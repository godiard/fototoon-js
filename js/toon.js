define(function (require) {

    require("easel");

    var onAndroid = /Android/i.test(navigator.userAgent);

    var smallScreen = (window.innerWidth < 700) || (window.innerHeight < 600);
    var font = smallScreen ? "16px Arial" : "24px Arial";

    var LINE_WIDTH = 2;
    var BLACK = "#000000";
    var WHITE = "#ffffff";

    // Spanish names for historic reasons
    var DIR_DOWN = "abajo";
    var DIR_UP = "arriba";
    var DIR_LEFT = "izq";
    var DIR_RIGHT = "der";
    var SIZE_RESIZE_AREA = 40; // TODO style.GRID_CELL_SIZE / 2

    toon = {};

    function createAsyncBitmapButton(globe, url, callback) {
        // creates a square black button with a image inside
        // is used for the corner controls in the globe
        var img = new Image();
        img.cont = null;
        img.globe = globe;

        img.onload = function () {
            var bitmap = new createjs.Bitmap(img);
            bitmap.setBounds(0, 0, img.width, img.height);
            bounds = bitmap.getBounds();
            var scale = SIZE_RESIZE_AREA / bounds.height;
            bitmap.scaleX = scale;
            bitmap.scaleY = scale;

            if (this.cont == null) {
                this.cont = new createjs.Container();
                this.cont.name = 'button';
                var hitArea = new createjs.Shape();
                hitArea.graphics.beginFill("#000").drawRect(0, 0,
                    SIZE_RESIZE_AREA, SIZE_RESIZE_AREA);
                this.cont.width = SIZE_RESIZE_AREA;
                this.cont.height = SIZE_RESIZE_AREA;
                this.cont.hitArea = hitArea;
                this.cont.addChild(hitArea);
                this.cont.addChild(bitmap);
                callback(this.globe, this.cont);
            };
        };
        img.src = url;
        return img;
    };

    function ComicBox(canvas, data) {

        this.canvas = canvas;
        this._data = data;
        this._width = canvas.width - LINE_WIDTH * 2;
        this._height = canvas.height - LINE_WIDTH * 2;

        this.stage = new createjs.Stage(canvas);
        // Enable touch interactions if supported on the current device
        createjs.Touch.enable(this.stage);

        this.globes = [];

        this.init = function () {
            var background = new createjs.Shape();
            background.graphics.setStrokeStyle(LINE_WIDTH, "round");
            background.graphics.beginStroke(
                BLACK).drawRect(LINE_WIDTH, LINE_WIDTH,
                                this._width, this._height);
            this.stage.addChild(background);
            if (this._data != null) {
                globes = this._data['globes'];
                for (var n = 0; n < globes.length; n++) {
                    var globe = new Globe(this, globes[n]);
                    this.globes.push(globe);
                }
            };
            this.stage.update();
        };

        this.addGlobe = function () {
            globe = new Globe(this);
        };

        /*
        this.stage.on("click", function (event) {
            console.log('stage click' + event.target);
        }, this);
        */
    };

    function Globe(box, globeData) {
        this._box = box;
        this._stage = box.stage;
        if (globeData == null) {
            this._x = 100;
            this._y = 100;
            this._width = 100;
            this._height = 50;
            this._point = [this._width / 2,
                           this._height / 2];
            this._radio = 100;
            this._direction = DIR_DOWN;
        } else {
            /* example of the json data stored

            {"direction": "abajo", "text_font_description": "Sans 10",
                 "globe_type": "GLOBE",
                "text_text": "Hmm, esto parece estar funcionando",
                "height": 36.66666666666667, "width": 130.0,
                "text_color": [0, 0, 0], "radio": 30, "mode": "normal",
                "text_width": 78, "y": 63.0, "x": 202.0,
                "text_height": 22, "title_globe": false, "point_0": 40.5,
                "point_1": 54}
            */

            this._x = globeData['x'];
            this._y = globeData['y'];
            this._width = globeData['width'];
            this._height = globeData['height'];
            this._point = [globeData['point_0'],
                           globeData['point_1']];
            this._radio = globeData['radio'];
            this._direction = globeData['direction'];
        };

        this._shape = new createjs.Shape();
        this._stage.addChild(this._shape);
        this._controls = [];
        this._selected = false;

        this.draw = function() {
            this._shape.graphics.setStrokeStyle(LINE_WIDTH, "round");
            this._shape.graphics.beginStroke(BLACK);
            this._shape.graphics.beginFill(WHITE);

            var scale_x = this._width /this._radio;
            var scale_y = this._height /this._radio;

            var x = this._x / scale_x;
            var y = this._y / scale_y;

            switch (this._direction) {
                case DIR_DOWN:
                    var begin = 100;
                    var end = 80;
                    break;
                case DIR_RIGHT:
                    var begin = 10;
                    var end = 350;
                    break;
                case DIR_LEFT:
                    var begin = 190;
                    var end = 170;
                    break;
                case DIR_UP:
                    var begin = 280;
                    var end = 260;
            };
            this._shape.graphics.arc(x, y, this._radio,
                                     begin / (180.0) * Math.PI,
                                     end / (180.0) * Math.PI)

            point_pos = this.getPointPosition(true);
            this._shape.graphics.lineTo(point_pos[0], point_pos[1]);

            this._shape.graphics.closePath();

            this._shape.graphics.endStroke();

            this._shape.setTransform(0, 0,scale_x, scale_y);

            this._stage.update();
        };

        this.drawControls = function() {
            var x = this._x;
            var y = this._y;
            var w = this._width;
            var h = this._height;

            this._shapeControls = new createjs.Shape();
            // draw dotted rectangle around the globe
            this._shapeControls.graphics.setStrokeStyle(1, "round");
            this._shapeControls.graphics.beginStroke(WHITE);
            this._shapeControls.graphics.rect(x - w , y - h, w * 2, h * 2);
            this._shapeControls.graphics.setStrokeDash([2]);
            this._shapeControls.graphics.beginFill("rgba(0, 0, 0, 0)");
            this._shapeControls.graphics.beginStroke(BLACK);
            this._shapeControls.graphics.rect(x - w , y - h, w * 2, h * 2);
            this._shapeControls.graphics.endStroke();

            // point position
            point_pos = this.getPointPosition(false);
            this._shapeControls.graphics.beginStroke(BLACK);
            this._shapeControls.graphics.arc(point_pos[0], point_pos[1],
                                             SIZE_RESIZE_AREA / 2,
                                             0, 2 * Math.PI)
            this._shapeControls.graphics.endStroke();

            this._shapeControls.visible = false;
            this._stage.addChild(this._shapeControls);
            this._controls.push(this._shapeControls);

            createAsyncBitmapButton(this, './icons/resize.svg',
                function(globe, button) {
                    button.x = globe._x - globe._width;
                    button.y = globe._y - globe._height;
                    button.visible = false;
                    globe._controls.push(button);
                    globe._stage.addChildAt(button, 2);
                    globe._stage.update();

                    button.on('click', function(event) {
                        console.log('button clicked' + event.target);
                    });

                });
        };

        this._shape.on('click', function(event) {
            if (this._selected) {
                this._selected = false;
                this._controls.forEach(
                    function (element, index, array) {
                        element.visible = false;
                });
            } else {
                this._selected = true;
                this._controls.forEach(
                    function (element, index, array) {
                        element.visible = true;
                });
            };
            this._stage.update();
        }, this);

        this.getPointPosition = function (scaled) {
            var scale_x = 1;
            var scale_y = 1;
            if (scaled) {
                scale_x = this._width / this._radio;
                scale_y = this._height / this._radio;
            };

            var x = this._x / scale_x;
            var y = this._y /scale_y;
            var w = this._width / scale_x;
            var h = this._height /scale_y;

            switch (this._direction) {
                case DIR_DOWN:
                    return [x + this._point[0] / scale_x,
                        y + h + this._point[1] / scale_y];
                case DIR_RIGHT:
                    return [x + w + this._point[0] / scale_x,
                        y + this._point[1] / scale_y];
                case DIR_LEFT:
                    return [x - w - this._point[0] / scale_x,
                        y + this._point[1] / scale_y];
                case DIR_UP:
                    return [x + this._point[0] / scale_x,
                        y - h - this._point[1] / scale_y];
            };
        };

        this.draw();
        this.drawControls();
    };

    toon.ComicBox = ComicBox;

    return toon;
});



