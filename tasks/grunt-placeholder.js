/*
 **  grunt-placeholder
 **  Grunt Task for replacing placeholders in source files with values from a configuration file
 **  Copyright (c) 2015 Jochen Hoertreiter <jochen.hoertreiter@googlemail.com>
 **
 **  Permission is hereby granted, free of charge, to any person obtaining
 **  a copy of this software and associated documentation files (the
 **  "Software"), to deal in the Software without restriction, including
 **  without limitation the rights to use, copy, modify, merge, publish,
 **  distribute, sublicense, and/or sell copies of the Software, and to
 **  permit persons to whom the Software is furnished to do so, subject to
 **  the following conditions:
 **
 **  The above copyright notice and this permission notice shall be included
 **  in all copies or substantial portions of the Software.
 **
 **  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 **  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 **  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 **  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 **  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 **  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 **  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* global module: false */
module.exports = function (grunt) {
    /* global require: false */
    var chalk = require("chalk");
    var path = require("path");
    var ducky = require("ducky");
    var cacheLRU = require("cache-lru");

    grunt.registerMultiTask("placeholder", "replacing placeholders in source files with values from a configuration file", function () {
        /*  prepare options  */
        var options = this.options({
            configFile: "component.yaml",
            configType: "yaml", /* json or yaml */
            configEncoding: "utf8",
            placeholderRegex: /___config\.([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)*)___/g,
            sourceEncoding: "utf8"
        });

        var cache = new cacheLRU();
        grunt.verbose.writeflags(options, "Options");

        /*  iterate over all src-dest file pairs  */
        this.files.forEach(function (f) {
            try {
                f.src.forEach(function (src) {
                    var configFile = path.join(f.cwd ? f.cwd : "", path.dirname(src), options.configFile);
                    var dest = path.join(f.dest, src);
                    var copyOptions = {};

                    if (grunt.file.exists(configFile)) {
                        /* copy and replace */
                        var config = cache.get(configFile);
                        if (config === undefined) {
                            config = options.configType === "json" ? grunt.file.readJSON(configFile, {encoding: options.configEncoding})
                                : grunt.file.readYAML(configFile, {encoding: options.configEncoding});
                            cache.set(configFile, config);
                        }

                        copyOptions.encoding = options.sourceEncoding;
                        copyOptions.process = function (content) {
                            content = content.replace(options.placeholderRegex, function (m0, m1) {
                                if (typeof m1 === "undefined")
                                    throw "Regexp does not contain capture group";

                                /* find the value in the config file and return it as replacement for the key */
                                var replacement = ducky.select(config, m1);
                                grunt.log.debug("replacing \"" + m0 + "\" with \"" + replacement + "\"");
                                return replacement;
                            });
                            return content;
                        };
                        grunt.log.writeln("File \"" + chalk.green(src) + "\" substituted.");
                    }
                    grunt.file.copy(path.join(f.cwd ? f.cwd : "", src), dest, copyOptions);
                });
            }
            catch (e) {
                grunt.fail.warn(e);
            }
        });
    });
};

