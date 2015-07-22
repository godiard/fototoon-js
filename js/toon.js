define(function (require) {

    require("easel");

    var onAndroid = /Android/i.test(navigator.userAgent);

    var smallScreen = (window.innerWidth < 700) || (window.innerHeight < 600);
    var font = smallScreen ? "16px Arial" : "24px Arial";


    toon = {};

    function ComicBox(canvas) {

        this.canvas = canvas;
        this._width = canvas.width * 0.8;
        this._height = canvas.height * 0.8;
        this._margin_x = canvas.width * 0.1;
        this._margin_y = canvas.height * 0.1;

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
            var line_width = 3;
            background.graphics.setStrokeStyle(line_width, "round");
            background.graphics.beginStroke(
                "#000000").drawRect(
                this._margin_x, this._margin_y,
                this._width, this._height);
            this.container.hitArea = background;
            this.container.addChild(background);
            this.stage.addChild(this.container);
            this.stage.update();
        };


        this.stage.on("pressup", function (event) {
        }, this);

        this.stage.on('mousedown', function (event) {
            //var cell = this.getCell(event.stageX, event.stageY);
        }, this);

        this.stage.on("pressmove", function (event) {
            //var end_cell = this.getCell(event.stageX, event.stageY);
        }, this);


        /*
        Draw a rounded rectangle over shape
        star_cell, end_cell = array of integer
        shape = createjs.Shape
        color = createjs.Graphics.getRGB
        */
        this.markWord = function(start_cell, end_cell, shape, color, fill) {

            var start_cell_x = start_cell[0];
            var start_cell_y = start_cell[1];
            var x1 = start_cell_x * this.cell_size + this.cell_size / 2;
            var y1 = this.margin_y + start_cell_y * this.cell_size +
                this.cell_size / 2;

            if (start_cell != end_cell) {
                var end_cell_x = end_cell[0];
                var end_cell_y = end_cell[1];
                var x2 = end_cell_x * this.cell_size + this.cell_size / 2;
                var y2 = this.margin_y + end_cell_y * this.cell_size +
                    this.cell_size / 2;
                var diff_x = x2 - x1;
                var diff_y = y2 - y1;
                var angle_rad = Math.atan2(diff_y, diff_x);
                var angle_deg = angle_rad * 180 / Math.PI;
                var distance = diff_x / Math.cos(angle_rad);
                if (Math.abs(angle_deg) == 90) {
                    distance = Math.abs(diff_y);
                };
            } else {
                var angle_deg = 0;
                var distance = 0;
            };

            var line_width = this.cell_size / 10;
            shape.graphics.setStrokeStyle(line_width, "round");
            if (fill && enableAnimations) {
                shape.graphics.beginFill(color);
            } else {
                shape.graphics.beginStroke(color);
            };
            shape.graphics.drawRoundRect(
                -(this.cell_size - line_width) / 2,
                -(this.cell_size - line_width) / 2,
                distance + this.cell_size - line_width,
                this.cell_size - line_width,
                this.cell_size / 2);
            shape.graphics.endStroke();
            shape.rotation = angle_deg;
            shape.x = x1;
            shape.y = y1;
        };


    };

    toon.ComicBox = ComicBox;

    return toon;
});



