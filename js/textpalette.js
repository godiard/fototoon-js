define(["sugar-web/graphics/palette"], function (palette) {

    'use strict';

    var textpalette = {};

    textpalette.TextPalette = function (textButton, toonModel) {

        palette.Palette.call(this, textButton);

        this.getPalette().id = "text-palette";

        var containerElem = document.createElement('div');

        var content = '<div class="row small">' +
            '<label>Set globe text:</label>' +
            '</div>' +
            '<div class="row expand">' +
            '<textarea rows="8" id="editor" class="expand"></textarea>' +
            '</div>';

        var colors = ['#000000', '#ff0000', '#00008b', '#006400', '#8b008b',
                      '#c0c0c0', '#ffd700', '#008000', '#ff4500', '#8b4513' ];

        content = content + '<table><tr>';
        for (var i = 0; i < colors.length; i++) {
            content = content + '<td><button class="color-picker" ' +
                'value="' + colors[i] + '" ' +
                'style="background-color: ' + colors[i] + '"></button></td>';
            if (i == 4) {
                content = content + '</tr><tr>';
            };
        };
        content = content + '</tr></table>';

        containerElem.innerHTML = content;

        this.setContent([containerElem]);

        this.editorElem = containerElem.querySelector('#editor');

        this.colorButtons = document.querySelectorAll(".color-picker");

    };

    var setText = function (text) {
        this.editorElem.value = text;
    };

    textpalette.TextPalette.prototype =
        Object.create(palette.Palette.prototype, {
            setText: {
                value: setText,
                enumerable: true,
                configurable: true,
                writable: true
            }
        });

    return textpalette;
});
