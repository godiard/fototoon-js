requirejs.config({
    baseUrl: "lib",
    shim: {
        easel: {
            exports: "createjs"
        },
    },
    paths: {
        activity: "../js",
        easel: "../lib/easeljs-0.7.1.min",
        preload: "../lib/preloadjs-0.4.1.min",
        toon: "../js/toon",
    }
});

requirejs(["activity/activity"]);
