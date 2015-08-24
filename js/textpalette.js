define(["sugar-web/graphics/palette"], function (palette) {

    'use strict';

    var textpalette = {};

    textpalette.TextPalette = function (textButton, toonModel) {

        palette.Palette.call(this, textButton);

        this.getPalette().id = "text-palette";

        var containerElem = document.createElement('div');

        containerElem.innerHTML = '<div class="row small">' +
            '<label>Set globe text:</label>' +
            '</div>' +
            '<div class="row expand">' +
            '<textarea rows="8" id="editor" class="expand"></textarea>' +
            '</div>';

        this.setContent([containerElem]);

        this.editorElem = containerElem.querySelector('#editor');

        this.editorElem.onblur = function () {
            console.log('bye!');
        };

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
