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

    function Text(globe, globeData) {

        this._globe = globe;
        this._globeData = globeData;

        this.init = function() {

            if (this._globeData == null) {
                this._text = '';
                this._font_description = 'Sans 10';
                this._color = BLACK;
                this._width = globe._width - 20;
                this._height = SIZE_RESIZE_AREA / 2;
            } else {
                /* example of the text data in the json globe data stored
                {"text_font_description": "Sans 10",
                 "text_text": "Hmm, esto parece estar funcionando",
                 "text_color": [0, 0, 0],
                 "text_width": 78, "text_height": 22}

                NOTE: color components are in the range 0-65535
                https://developer.gnome.org/pygtk/stable/class-gdkcolor.html#constructor-gdkcolor
                */
                this._text = this._globeData['text_text'];
                this._font_description = this._globeData['text_font_description'];
                this._color = this.GdkToHtmlColor(this._globeData['text_color']);
                this._width = this._globeData['text_width'];
                this._height = this._globeData['text_height'];

                this._textView = null;
            };
        };

        this.GdkToHtmlColor = function(r, g, b) {
            // r, g, b are int in the range 0-65535
            // returns a str with the format "#rrggbb"
            rh = (r / 65535 * 16).toString(16);
            gh = (g / 65535 * 16).toString(16);
            bh = (b / 65535 * 16).toString(16);
            return "#" + rh + gh + bh;
        };

        this.HtmlToGdkColor = function(rgb) {
            // rgb is a str with the format "#rrggbb"
            // return a array [r, g, b] with int in the range 0-65535
            rh = rgb.substr(1, 2);
            gh = rgb.substr(3, 2);
            bh = rgb.substr(5, 2);
            r = parseInt(rh, 16) / 255 * 65535;
            g = parseInt(rg, 16) / 255 * 65535;
            b = parseInt(rb, 16) / 255 * 65535;
            return [r, g, b];
        };

        this.update = function() {
            if (this._textView != null) {
                this._globe._stage.removeChild(this._textView);
            };
            this._textView = new createjs.Text(this._text,
                                               this._font_description,
                                               this._color);
            this._textView.textAlign = 'center';
            this._textView.x = this._globe._x;
            this._textView.y = this._globe._y;
            this._globe._stage.addChildAt(this._textView, 2);
            this._globe._stage.update();
        };

        this.init();
        return this;
    };

    function Globe(box, globeData) {
        this._box = box;
        this._stage = box.stage;

        this.init = function() {
            if (globeData == null) {
                this._x = 100;
                this._y = 100;
                this._width = 100;
                this._height = 50;
                this._point = [this._width / 2,
                               this._height / 2];
                this._radio = 100;
                this._direction = DIR_DOWN;
                this._text = Text(this, null);
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
                this._text = Text(this, globeData);
            };

            this._shape = null;
            this._controls = [];
            this._selected = false;
        };

        this.createShape = function() {
            if (this._shape != null) {
                this._stage.removeChild(this._shape);
            };
            this._shape = new createjs.Shape();
            this._stage.addChild(this._shape);
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

            this._shape.on("pressmove",function(event) {
                this._x = event.stageX;
                this._y = event.stageY;
                this._selected = true;
                this.update();
            }, this);

        };

        this.createControls = function() {
            // remove controls if aready exist
            this._controls.forEach(
                function (element, index, array) {
                    this._stage.removeChild(element);
            }, this);

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
            this._pointerControl = new createjs.Shape();
            point_pos = this.getPointPosition(false);
            this._pointerControl.graphics.beginStroke(BLACK);
            this._pointerControl.graphics.arc(point_pos[0], point_pos[1],
                                             SIZE_RESIZE_AREA / 2,
                                             0, 2 * Math.PI);
            this._pointerControl.graphics.endStroke();

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill("#000").arc(
                point_pos[0], point_pos[1], SIZE_RESIZE_AREA / 2,
                0, 2 * Math.PI);
            this._pointerControl.hitArea = hitArea;

            this._pointerControl.visible = this._selected;

            this._shapeControls.visible = this._selected;
            this._stage.addChild(this._shapeControls, this._pointerControl);
            this._controls.push(this._shapeControls);
            this._controls.push(this._pointerControl);

            this._pointerControl.on("pressmove",function(event) {
                this.setPointPosition(event.stageX, event.stageY);
                this._selected = true;
                this.update();
            }, this);

            createAsyncBitmapButton(this, './icons/resize.svg',
                function(globe, button) {
                    button.x = globe._x - globe._width - button.width / 2;
                    button.y = globe._y - globe._height - button.height / 2;
                    button.visible = globe._selected;
                    globe._controls.push(button);
                    globe._stage.addChildAt(button, 3);
                    globe._stage.update();

                    button.on('pressmove', function(event) {
                        this._width = Math.max(globe._x - event.stageX,
                                                SIZE_RESIZE_AREA / 2);
                        this._height = Math.max(globe._y - event.stageY,
                                                 SIZE_RESIZE_AREA / 2);
                        this.update();
                    }, globe);

                });

            createAsyncBitmapButton(this, './icons/object_rotate_right.svg',
                function(globe, button) {
                    button.x = globe._x + globe._width - button.width / 2;
                    button.y = globe._y + globe._height - button.height / 2;
                    button.visible = globe._selected;
                    globe._controls.push(button);
                    globe._stage.addChildAt(button, 3);
                    globe._stage.update();

                    button.on('click', function(event) {
                        globe.rotate();
                    });

                });
        };

        this.rotate = function () {
            switch (this._direction) {
                case DIR_DOWN:
                    this._direction = DIR_LEFT;
                    break;
                case DIR_RIGHT:
                    this._direction = DIR_DOWN;
                    break;
                case DIR_LEFT:
                    this._direction = DIR_UP;
                    break;
                case DIR_UP:
                    this._direction = DIR_RIGHT;
                    break;
            };
            var i = this._point[0];
            this._point[0] = this._point[1]; this._point[1] = i;
            this.update();
        };

        this.update = function() {
            this.createShape();
            this.createControls();
            this._text.update();
            this._stage.update();
        }

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

        this.setPointPosition = function (new_x, new_y) {
            switch (this._direction) {
                case DIR_DOWN:
                    this._point[0] = new_x - this._x;
                    this._point[1] = new_y - this._y - this._height;
                    break;
                case DIR_RIGHT:
                    this._point[0] = new_x - this._x - this._width;
                    this._point[1] = new_y - this._y;
                    break;
                case DIR_LEFT:
                    this._point[0] = - new_x + this._x - this._width;
                    this._point[1] = new_y - this._y;
                    break;
                case DIR_UP:
                    this._point[0] = new_x - this._x;
                    this._point[1] = - new_y + this._y - this._height;
            };
        };

        this.init();
        this.update();
    };

    toon.ComicBox = ComicBox;

    return toon;
});



