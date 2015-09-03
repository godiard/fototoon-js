define(function (require) {
    var activity = require("sugar-web/activity/activity");
    var datastore = require("sugar-web/datastore");
    var textpalette = require("textpalette");
    var menupalette = require("sugar-web/graphics/menupalette");

    // initialize canvas size
    var onAndroid = /Android/i.test(navigator.userAgent);
    if (window.location.search.indexOf('onAndroid') > -1) {
        onAndroid = true;
    };

    var loadTestData = false;
    if (window.location.search.indexOf('loadTestData') > -1) {
        loadTestData = true;
    };

    var onXo = ((window.innerWidth == 1200) && (window.innerHeight >= 900));
    var sugarCellSize = 75;
    var sugarSubCellSize = 15;
    if (!onXo && !onAndroid) {
        sugarCellSize = 55;
        sugarSubCellSize = 11;
    };

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();

        if (onAndroid) {
            // hide activity and close buttons on android
            var activityButton = document.getElementById("activity-button");
            var stopButton = document.getElementById("stop-button");
            var firstSeparator = document.getElementById("first-separator");
            activityButton.style.display = 'none';
            stopButton.style.display = 'none';
            firstSeparator.style.display = 'none';
        };

        // HERE GO YOUR CODE

        var initialData =  {"version": "1", "boxs": [{'globes':[]}]};

        // this data was generated by fototoon activity (python)
        var testData = {"version": "1",
            "boxs": [
                // title box
                {"img_w": 0, "img_y": 0,
                 "image_name": "", "img_x": 0, "slideshow_duration": 10,
                    "globes": [
                {"direction": null, "text_font_description": "Sans 10",
                "globe_type": "RECTANGLE", "height": 13, "width": 81,
                "text_color": [0, 0, 0], "radio": 15, "text_width": 76,
                "y": 225, "x": 600, "text_height": 8, "title_globe": true,
                "text_text": "T\u00edtulo:"}], "img_h": 0},

                // this is the first box
                {"img_w": 589, "img_y": 0, "image_name": "image3.png",
                 "img_x": 0, "img_h": 441, "slideshow_duration": 10,
                    "globes": [
                        {'direction': 'abajo',
                        'text_font_description': 'Sans 14',
                        'globe_type': 'EXCLAMATION',
                        'text_text': 'Hey!',
                        'height': 36.66666666666667, 'width': 76.66666666666667,
                        'text_color': [60909, 9509, 10537], 'radio': 30,
                        'text_width': 46, 'y': 72.0, 'x': 96.0, 'text_height': 22,
                        'title_globe': false, 'point_0': 40.5, 'point_1': 54},
                        {'direction': 'abajo',
                        'text_font_description': 'Serif 10',
                        'globe_type': 'GLOBE', 'text_text': 'Shhhh...',
                        'height': 26.666666666666668, 'width': 80.0,
                        'text_color': [0, 0, 0], 'radio': 30, 'mode': 'despacio',
                        'text_width': 48, 'y': 35.0, 'x': 485.0, 'text_height': 16,
                        'title_globe': false,
                        'point_0': -38.0, 'point_1': 39.33333333333333},
                        {'direction': 'abajo',
                        'text_font_description': 'Sans bold 10',
                        'globe_type': 'GLOBE', 'text_text': 'Hola',
                        'height': 26.666666666666668, 'width': 80.0,
                        'text_color': [0, 0, 0], 'radio': 30, 'mode': 'normal',
                        'text_width': 48, 'y': 155.0, 'x': 492.0,
                        'text_height': 16, 'title_globe': false,
                        'point_0': -54.0, 'point_1': 30.333333333333343},
                        {'direction': 'arriba',
                        'text_font_description': 'Sans italic 10',
                        'globe_type': 'CLOUD', 'text_text': 'Servira esto?',
                        'height': 26.666666666666668, 'width': 80.0,
                        'text_color': [0, 0, 0], 'radio': 30, 'text_width': 48,
                        'y': 251.0, 'x': 128.0, 'text_height': 16,
                        'title_globe': false,
                        'point_0': 49.0, 'point_1': 21.333333333333343},
                        {'direction': null,
                        'text_font_description': 'Monospace 10',
                        'globe_type': 'RECTANGLE', 'height': 15, 'width': 140,
                        'text_color': [0, 0, 0], 'radio': 15, 'text_width': 135,
                        'y': 288.0, 'x': 442.0, 'text_height': 10,
                        'title_globe': false,
                        'text_text': 'Test con todas los globos'}],
                },
                // second box
                {"img_w": 589, "img_y": 0, "image_name": "image2.png",
                "img_x": 0, "slideshow_duration": 10,
                "globes": [
                {"direction": "abajo", "text_font_description": "Sans 10",
                "globe_type": "CLOUD",
                "text_text": "Y solo estoy un mes atrasado...",
                "height": 48.333333333333336, "width": 118.33333333333334,
                "text_color": [0, 0, 0], "radio": 30, "text_width": 71,
                "y": 71.0, "x": 201.0, "text_height": 29, "title_globe": false,
                "point_0": 63.0, "point_1": 32.66666666666666}], "img_h": 441}]};


        if (loadTestData) {
            initialData = testData;
        };

        require("toon");

        var mainCanvas = document.getElementById("mainCanvas");
        // remove 5 more to be sure no scrollbars are visible
        mainCanvas.height = window.innerHeight - sugarCellSize - 5;
        mainCanvas.width = mainCanvas.height * 4 / 3;
        mainCanvas.style.left = ((window.innerWidth - mainCanvas.width) / 2) + "px";

        var previousButton = document.getElementById("previous-button");
        previousButton.addEventListener('click', function (e) {
            toonModel.showPreviousBox();
        });

        var nextButton = document.getElementById("next-button");
        nextButton.addEventListener('click', function (e) {
            toonModel.showNextBox();
        });

        var textButton = document.getElementById("text-button");
        var tp = new textpalette.TextPalette(textButton, toonModel);

        var toonModel = new toon.Model(initialData, mainCanvas, tp);
        toonModel.init();

        var addGlobeButton = document.getElementById("add-globe");
        var menuData = [{'icon': true, 'id': toon.TYPE_GLOBE,
                         'label': 'Add a globe'},
                        {'icon': true, 'id': toon.TYPE_EXCLAMATION,
                         'label': 'Add a exclamation'},
                        {'icon': true, 'id': toon.TYPE_WHISPER,
                         'label': 'Add a whisper'},
                        {'icon': true, 'id': toon.TYPE_CLOUD,
                         'label': 'Add a thinking'},
                        {'icon': true, 'id': toon.TYPE_RECTANGLE,
                         'label': 'Add a text box'},];
        var mp = new menupalette.MenuPalette(addGlobeButton,
            "Add globes", menuData);

        for (var i = 0; i < mp.buttons.length; i++) {
            mp.buttons[i].addEventListener('click', function(e) {
                toonModel.addGlobe(this.id);
            });
        };

        // load images
        var imageChooser = document.getElementById('image-loader');

        var addButton = document.getElementById("add-button");
        addButton.addEventListener('click', function (e) {
            imageChooser.focus();
            imageChooser.click();
        });

        imageChooser.addEventListener('click', function (event) {
            this.value = null;
        });

        imageChooser.addEventListener('change', function (event) {
            // Read file here.
            var reader = new FileReader();
            reader.onloadend = (function () {
                 toonModel.addImage(reader.result);
            });

            var file = imageChooser.files[0];
            if (file) {
                reader.readAsDataURL(file);
            };

        }, false);

        // load fototoon files
        var JSZip = require("jszip");
        var toonChooser = document.getElementById('fototoon-loader');

        var openButton = document.getElementById("doc-open");
        openButton.addEventListener('click', function (e) {
            toonChooser.focus();
            toonChooser.click();
        });

        toonChooser.addEventListener('click', function (event) {
            this.value = null;
        });

        toonChooser.addEventListener('change', function (event) {
            // Read file here.
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    console.log('e ' + e);
                    try {
                        // read the content of the file with JSZip
                        var zip = new JSZip(e.target.result);
                        $.each(zip.files, function (index, zipEntry) {
                            console.log('reading ' + zipEntry.name);
                            // the content is here : zipEntry.asText()
                            if (zipEntry.name == 'data.json') {
                                data = JSON.parse(zipEntry.asText());
                                toonModel = new toon.Model(data, mainCanvas, tp);
                                toonModel.init();
                            };
                        });

                    } catch(e) {
                        console.log('Exception ' + theFile.name + " : " + e.message);
                    };
                };
            })(file);
            var file = toonChooser.files[0];
            if (file) {
                reader.readAsArrayBuffer(file);
            };

        }, false);



    });

});
