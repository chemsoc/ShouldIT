/**
 * Get the specs from a glob and merges the specs
 */
var merge = require("merge");

 function collectSpecs(specsGlob, tags, callback) {
    var featureTransformer = require('./featureTransformer'),
        glob = require("glob"),
        response = {},
        count = 0;

    glob(specsGlob, {}, function (er, files) {
        var i,
            fileTransformerCallback = function(spec) {
                response = mergeSpecs(spec, response);
                count++;
                fileTransformed(files, count, response, callback);
            };
        for (i = 0; i < files.length; i++) {
            featureTransformer(files[i], tags, fileTransformerCallback);
        }
    });
}

function fileTransformed(files, count, response, callback) {
    if(files.length === count) {
        callback(response);
    }
}

function mergeSpecs(spec, response) {
    spec = JSON.parse(spec);
    for(var key in spec) {
        if (spec.hasOwnProperty(key)) {
            if( response.hasOwnProperty(key) ){
               response[key] = merge.recursive(response[key],spec[key]);
            } else {
                response[key] = spec[key];
            }
        }
    }
    return response;
}

module.exports = collectSpecs;