/*global define*/
define([
        'Core/clone',
        'Core/defaultValue',
        'Core/defined',
        'Renderer/Context',
        'Specs/createCanvas',
        'Specs/createFrameState'
    ], function(
        clone,
        defaultValue,
        defined,
        Context,
        createCanvas,
        createFrameState) {
    "use strict";
    /*global unescape*/

    function getQueryParameters() {
        var queryParameters = {};

        var search = window.location.search;
        if (search.length > 1) {
            search = search.substr(1);
            var parameters = search.split('&');
            for (var i = 0; i < parameters.length; ++i) {
                if (parameters[i].length > 0) {
                    var index = parameters[i].indexOf('=');
                    if (index !== -1) {
                        var key = parameters[i].substr(0, index);
                        var value = unescape(parameters[i].substr(index + 1));
                        queryParameters[key] = value;
                    } else {
                        queryParameters[parameters[i]] = '';
                    }
                }
            }
        }

        return queryParameters;
    }

    function createContext(options) {
        // clone options so we can change properties
        options = clone(defaultValue(options, {}));
        options.alpha = defaultValue(options.alpha, true);

        var canvas = createCanvas();
        var context = new Context(canvas, options);

        var parameters = getQueryParameters();
        if (!defined(parameters.skipWebGLValidation)) {
            context.setValidateShaderProgram(true);
            context.setValidateFramebuffer(true);
            context.setLogShaderCompilation(true);
            context.setThrowOnWebGLError(true);
        }

        var us = context.getUniformState();
        us.update(createFrameState());

        return context;
    }

    return createContext;
});