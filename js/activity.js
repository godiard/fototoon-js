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

    var localizationData = require("localizationData");
    var lang = navigator.language.substr(0, 2);
    console.log('LANG ' + lang);

    function _(text) {
        // this function add a fallback for the case of translation not found
        // can be removed when we find how to read the localization.ini
        // file in the case of local html file opened in the browser
        translation = localizationData[lang][text];
        if (translation == '') {
            translation = text;
        };
        return translation;
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
        require("filesaver");
        require("persistence");
        var cordobaIO = new persistence.CordobaIO();

        var mainCanvas = document.getElementById("mainCanvas");
        var sortCanvas = document.getElementById("sortCanvas");
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
        var tp = new textpalette.TextPalette(textButton, toonModel,
                                             _('SetGlobeText'));

       // page counter
        var pageCounter = document.getElementById("page-counter");

        var toonModel = new toon.Model(initialData, mainCanvas, tp);
        toonModel.init();
        toonModel.attachPageCounterViewer(pageCounter);
        toonModel.attachPrevNextButtons(previousButton, nextButton);

        var editMode = true;

        var addGlobeButton = document.getElementById("add-globe");
        var menuData = [{'icon': true, 'id': toon.TYPE_GLOBE,
                         'label': _('Globe')},
                        {'icon': true, 'id': toon.TYPE_EXCLAMATION,
                         'label': _('Exclamation')},
                        {'icon': true, 'id': toon.TYPE_WHISPER,
                         'label': _('Whisper')},
                        {'icon': true, 'id': toon.TYPE_CLOUD,
                         'label': _('Think')},
                        {'icon': true, 'id': toon.TYPE_RECTANGLE,
                         'label': _('Box')},];
        var mp = new menupalette.MenuPalette(addGlobeButton,
            _("Add a globe"), menuData);

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

        // this part is a fake file selector to use in android
        var fileSelector = document.getElementById('file-selector');

        function selectFile(filePath) {
            console.log('PATH SELECTED ' + filePath);
            fileSelector.style.display = 'none';

            mainCanvas.style.display = 'block';
            pageCounter.style.display = 'block';
        };

        function startFileSelection(fileList) {
            mainCanvas.style.display = 'none';
            sortCanvas.style.display = 'none';
            pageCounter.style.display = 'none';
            if (fileList.length == 0) {
                fileList.push('File not found' + '.fototoon')
            };
            // create file list entries
            var content = '';
            for (var i = 0; i < fileList.length; i++) {
                var filePath = fileList[i];
                var fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
                fileName = fileName.substring(0, fileName.indexOf('.fototoon'));
                content = content + '<button id="' + filePath + '">' +
                    fileName + '</button><br/>';
            };

            fileSelector.style.left = ((window.innerWidth - 500) / 2) + "px";

            fileSelector.style.display = 'block';
            console.log(content);
            fileSelector.innerHTML = content;
            var buttons = fileSelector.querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', function(e) {
                    selectFile(e.target.id)
                });
            };
        };

        var openButton = document.getElementById("doc-open");
        openButton.addEventListener('click', function (e) {
            if (onAndroid) {
                cordobaIO.getFilesList(startFileSelection);
            } else {
                toonChooser.focus();
                toonChooser.click();
            };
        });

        toonChooser.addEventListener('click', function (event) {
            this.value = null;
        });

        toonChooser.addEventListener('change', function (event) {
            // Read file here.
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    try {
                        // read the content of the file with JSZip
                        var zip = new JSZip(e.target.result);
                        var data = {};
                        // NOTE: This code assume data.json file
                        // is stored before the images
                        $.each(zip.files, function (index, zipEntry) {
                            console.log('reading ' + zipEntry.name);
                            if (zipEntry.name == 'data.json') {
                                data = JSON.parse(zipEntry.asText());
                                if (data['images'] == undefined) {
                                    data['images'] = {};
                                };
                            } else {
                                // load the image data in a blob, and read
                                // with a filereader to store as a data url
                                var imageBlob = new Blob(
                                    [zipEntry.asArrayBuffer()], {type: 'image/png'});
                                var reader = new FileReader();
                                reader.onloadend = (function () {
                                    // store the image data in the model data
                                    data['images'][zipEntry.name] = reader.result;
                                });
                                reader.readAsDataURL(imageBlob);
                            };
                        });

                        toonModel.setData(data);
                        if (!editMode) {
                            toonModel.changeToEditMode();
                            editMode = true;
                        };

                    } catch(e) {
                        console.log('Exception ' + e.message);
                        console.log('Reading file ' + theFile.name);
                    };
                };
            })(file);
            var file = toonChooser.files[0];
            if (file) {
                reader.readAsArrayBuffer(file);
            };
        }, false);

        function dataURItoString(dataURI) {
            // from http://stackoverflow.com/questions/4998908/
            // convert-data-uri-to-file-then-append-to-formdata/5100158#5100158
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            return byteString;
        };

        var saveButton = document.getElementById("doc-save");
        saveButton.addEventListener('click', function (e) {
            zip = new JSZip();
            // this line is enough to read the file on the js version
            // because the images data is stored as data uris.
            // but the objective is have  file format compatible
            // with the python version

            // zip.file("data.json", JSON.stringify(toonModel.getData()));

            // clone the data to remove the images
            var dataWithoutImages = {}
            dataWithoutImages['version'] = toonModel.getData()['version'];
            dataWithoutImages['boxs'] = toonModel.getData()['boxs'];
            zip.file("data.json", JSON.stringify(dataWithoutImages));

            for(var key in toonModel.getData()['images']) {
                var imageName = key;
                console.log('saving image ' + imageName);
                zip.file(imageName,
                         dataURItoString(toonModel.getData()['images'][imageName]),
                         {'binary': true});
            };

            var blob = zip.generate({type:"blob"});
            if (onAndroid) {
                cordobaIO.save(blob, toonModel.getTitle() + ".fototoon");
                activity.showAlert(_('ToonSaved'),
                    _('FileSavedSuccessfully'), null, null);
            } else {
                saveAs(blob, toonModel.getTitle() + ".fototoon");
            };
        });

        var saveImageButton = document.getElementById("image-save");
        var saveImageMenuData = [{'id': '0', 'label': _('OneRow')},
                                 {'id': '1', 'label': _('OneColumn')},
                                 {'id': '2', 'label': _('TwoColumns')}];
        var simp = new menupalette.MenuPalette(saveImageButton,
            _("SaveAsImage"), saveImageMenuData);

        for (var i = 0; i < simp.buttons.length; i++) {
            simp.buttons[i].addEventListener('click', function(e) {
                if (onAndroid) {
                    toonModel.saveAsImage(this.id, null);
                    activity.showAlert(_('ImageSaved'),
                        _('TheImageIsSavedInYourGallery'), null, null);
                } else {
                    toonModel.saveAsImage(this.id, function(blob) {
                        saveAs(blob, "fototoon.png");
                    });
                };
            });
        };

        var sortButton = document.getElementById("sort-button");

        sortButton.addEventListener('click', function (e) {
            // verify if there are at least 3 boxes
            // the first box is the title and can't be moved
            // then only have sense sort with more than 2 boxes
            if (toonModel.getData()['boxs'].length < 3) {
                return;
            };
            if (editMode) {
                toonModel.initPreviews();

                toonModel.storePreview();
                // resize the canvas
                sortCanvas.width = window.innerWidth - sugarCellSize * 2;
                var boxWidth = sortCanvas.width / toonModel.getData()['boxs'].length;
                sortCanvas.height = boxWidth * 3 / 4;
                sortCanvas.style.left = ((window.innerWidth - sortCanvas.width) / 2) + "px";
                sortCanvas.style.top = ((window.innerHeight - sortCanvas.height) / 2) + "px";
                toonModel.initSort(sortCanvas);
            } else {
                toonModel.finishSort();
                toonModel.init();
            };
            // switch editMode
            editMode = ! editMode;

        });

        var cleanAllButton = document.getElementById("clean-all-button");

        cleanAllButton.addEventListener('click', function (e) {

            activity.showConfirmationAlert(_('ATENTION'),
                _('RemoveAllConfirmMessage'),
                _('Yes'), _('No'), function(result) {
                    if (result) {
                        toonModel.setData(initialData);
                        if (!editMode) {
                            toonModel.changeToEditMode();
                            editMode = true;
                        };
                    };
                });
        });

    });

});
