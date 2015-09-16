define(function (require) {

    persistence = {};

    function errorHandler(e) {
      var msg = '';

      switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.NOT_FOUND_ERR:
          msg = 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          msg = 'SECURITY_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          msg = 'INVALID_STATE_ERR';
          break;
        default:
          msg = 'Unknown Error';
          break;
      };

      console.log('Error: ' + msg);
    };


    function CordobaIO(parent) {

        this.save = function(content, fileName) {
            // save a file to disk

            function onDirResolved(dir) {
                dir.getFile(fileName, {create:true}, function(file) {
                    file.createWriter(function(fileWriter) {
                        fileWriter.write(content);
                        console.log('FILE SAVED ' + fileName);
                    }, errorHandler);
                });
            };

            function onFsResolved(fs) {
                window.resolveLocalFileSystemURL(
                    cordova.file.externalApplicationStorageDirectory,
                    onDirResolved, errorHandler);
            };

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                onFsResolved, errorHandler);
        };

        this.getFilesList = function(callback) {
            console.log('getFilesList');
            var fileList = [];

            function onDirResolved(dir) {
                var reader =dir.createReader();
                reader.readEntries(function(entries) {
                    console.log('readEntries');
                    for (var i=0; i<entries.length; i++) {
                        if (entries[i].name.indexOf(".fototoon") != -1) {
                            fileList.push(entries[i].fullPath);
                        };
                    };
                    console.log('fileList ' + fileList);
                    callback(fileList);
                }, errorHandler);
            };

            function onFsResolved(fs) {
                window.resolveLocalFileSystemURL(
                    cordova.file.externalApplicationStorageDirectory,
                    onDirResolved, errorHandler);
            };

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                onFsResolved, errorHandler);

            return fileList;
        };

    };

    persistence.CordobaIO = CordobaIO;

    return persistence;
});

