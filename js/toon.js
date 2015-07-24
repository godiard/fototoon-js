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

    toon = {};

    function ComicBox(canvas, data) {

        this.canvas = canvas;
        this._data = data;
        this._width = canvas.width - LINE_WIDTH * 2;
        this._height = canvas.height - LINE_WIDTH * 2;

        this.stage = new createjs.Stage(canvas);
        // Enable touch interactions if supported on the current device
        createjs.Touch.enable(this.stage);
        this.stage.mouseChildren = false;

        this.container;
        this.globes = [];

        this.init = function () {
            this.container = new createjs.Container();
            this.container.x = 0;
            this.container.y = this.margin_y;

            // need a white background to receive the mouse events
            var background = new createjs.Shape();
            background.graphics.setStrokeStyle(LINE_WIDTH, "round");
            background.graphics.beginStroke(
                BLACK).drawRect(LINE_WIDTH, LINE_WIDTH,
                                this._width, this._height);
            this.container.hitArea = background;
            this.container.addChild(background);
            this.stage.addChild(this.container);
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


        this.stage.on("pressup", function (event) {
        }, this);

        this.stage.on('mousedown', function (event) {
            //var cell = this.getCell(event.stageX, event.stageY);
        }, this);

        this.stage.on("pressmove", function (event) {
            //var end_cell = this.getCell(event.stageX, event.stageY);
        }, this);

    };

    function Globe(box, globeData) {
        this._box = box;
        this._stage = box.stage;
        this._container = box.container;
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
        this._container.addChild(this._shape);

        this.draw = function() {
            this._shape.graphics.setStrokeStyle(LINE_WIDTH, "round");
            this._shape.graphics.beginStroke(BLACK);
            this._shape.graphics.beginFill(WHITE);

            var scale_x = this._width /this._radio;
            var scale_y = this._height /this._radio;

            // TODO: direction DOWN only
            var x = this._x / scale_x;
            var y = this._y /scale_y;

            switch (this._direction) {
                case DIR_DOWN:
                    this._shape.graphics.arc(x, y, this._radio,
                                             100 / (180.0) * Math.PI,
                                             80 / (180.0) * Math.PI)
                    this._shape.graphics.lineTo(
                        x + this._point[0] / scale_x,
                        y + this._radio + this._point[1] / scale_y);
                    break;
                case DIR_RIGHT:
                    this._shape.graphics.arc(x, y, this._radio,
                                             10 / (180.0) * Math.PI,
                                             350 / (180.0) * Math.PI)
                    this._shape.graphics.lineTo(
                        x + this._radio + this._point[0] / scale_x,
                        y + this._point[1] / scale_y);
                    break;
                case DIR_LEFT:
                    this._shape.graphics.arc(x, y, this._radio,
                                             190 / (180.0) * Math.PI,
                                             530 / (180.0) * Math.PI)
                    this._shape.graphics.lineTo(
                        x - this._radio - this._point[0] / scale_x,
                        y + this._point[1] / scale_y);
                    break;
                case DIR_UP:
                    this._shape.graphics.arc(x, y, this._radio,
                                             280 / (180.0) * Math.PI,
                                             620 / (180.0) * Math.PI)
                    this._shape.graphics.lineTo(
                        x + this._point[0] / scale_x,
                        y - this._radio - this._point[1] / scale_y);
            };
            this._shape.graphics.closePath();

            this._shape.graphics.endStroke();

            this._shape.setTransform(0, 0,scale_x, scale_y);

            this._stage.update();
        };


        this.draw();
    };

    toon.ComicBox = ComicBox;

    return toon;
});



