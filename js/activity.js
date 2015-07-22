define(function (require) {
    var activity = require("sugar-web/activity/activity");
    var datastore = require("sugar-web/datastore");


    // initialize canvas size
    var onAndroid = /Android/i.test(navigator.userAgent);
    if (window.location.search.indexOf('onAndroid') > -1) {
        onAndroid = true;
    };

    var onXo = ((window.innerWidth == 1200) && (window.innerHeight >= 900));
    var sugarCellSize = 75;
    var sugarSubCellSize = 15;
    if (!onXo && !onAndroid) {
        sugarCellSize = 55;
        sugarSubCellSize = 11;
    };
    if (onAndroid) {
        // set to the size of the bottom bar
        sugarCellSize = 0;
    }

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {


        // Initialize the activity.
        activity.setup();

        // HERE GO YOUR CODE



        require("toon");

        var mainCanvas = document.getElementById("mainCanvas");
        // remove 5 more to be sure no scrollbars are visible
        mainCanvas.height = window.innerHeight - sugarCellSize - 5;
        mainCanvas.width = mainCanvas.height * 4 / 3;
        mainCanvas.style.left = ((window.innerWidth - mainCanvas.width) / 2) + "px";

        this.comicBox = new toon.ComicBox(mainCanvas);
        this.comicBox.init();

    });

});
