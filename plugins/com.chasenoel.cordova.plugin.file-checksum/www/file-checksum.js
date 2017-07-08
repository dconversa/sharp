var exec = require('cordova/exec');

var FileChecksum = function(){};

FileChecksum.prototype.getChecksum = function(file,success, fail){
    
    exec(
        function successCallback(resp){
            console.log('success, sending response');
            success(resp);
        },
        function errorCallback(errMessage){
            if(typeof fail === 'undefined'){
                fail = function(){ console.log('failed getChecksum: '+errMessage);};
            }
            else{
                console.log(errMessage);
                fail(new Error(errMessage));
            }
        },
        'FileChecksum',
        'getChecksum',
        [file]
    );
};

FileChecksum.prototype.getChecksums = function(files){
    exec(
        function successCallback(resp){
            return resp;
        },
        function errorCallback(err){
            return err;
        },
        'FileChecksum',
        'getChecksums',
        [files]
    );
};

FileChecksum.prototype.compareFileToChecksum = function(filesWithChecksum){
    exec(
        function successCallback(resp){
            return resp;
        },
        function errorCallback(err){
            return err;
        },
        'FileChecksum',
        'compareFileToChecksum',
        [filesWithChecksum]
    );
};

module.exports = FileChecksum;