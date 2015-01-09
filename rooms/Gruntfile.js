var module;

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ["Gruntfile.js", "src/**/*.js"],
            // configuration options for jshint parsing. For a full explanation of what these do see the URL below:
            // http://jshint.com/docs/options/
            options: {
                es3: true,
                es5: false,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: false,
                maxerr: 0,
                newcap: true,
                noempty: true,
                nonbsp: true,
                nonew: true,
                undef: true,
                unused: false,

                globals: {
                    'debugger': true,
                    room: true,
                    debug: true,
                    print: true,
                    uniqueId: true,
                    removeKey: true,

                    //bower libraries in bower_components
                    TWEEN: true,

                    //custom classes in src/lib/classes
                    Elevator: true
                }
            }
        },
        uglify: {

            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: false,
                sourceMap: true,
                beautify: true
            },

            /** START DEFINE ROOM JS FILES **/

            wasteland: {
                files: {
                    //output JS file path, input array of JS file paths to combine
                    'js/wasteland.min.js': ['bower_components/TWEEN/build/tween.min.js','src/lib/classes/elevator.js','src/rooms/wasteland/main.js']
                }
            }

            /** END DEFINE ROOM JS FILES **/
        },
        watch: {
            js: {
                files: ["<%= jshint.files %>"],
                tasks: ["jshint", "uglify"],
                options: {
                    livereload: false
                }
            },
            glsl:{
                //only processing fragment shaders as JanusVR does not support vertex shaders higher than #version 130
                //and glsl-validate cannot compile shaders earlier than #version 150 - use JanusVR error_log.txt output
                //to check for glsl errors instead
                files: ['shaders/*.frag.glsl'],
                options: {
                    livereload: false,
                    nospawn: true
                }
            }
        },
        exec: {

            glsl: {
                command: function(filepath){

                    var splitPath = filepath.split('.');

                    var shaderType = splitPath[splitPath.length-2];

                    var profile;

                    switch(shaderType){
                        case 'frag':
                        case 'fragment':
                            profile = 'fragment';
                            break;
                        case 'vertex':
                        case 'vert':
                            profile = 'vertex';
                            break;
                    }

                    return '../tools/glsl-validate '+filepath+' +profile='+profile;
                },
                stdout: true,
                stderr: true,
                exitCode: 0
            }
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {

        //grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
        switch(target){
            case 'glsl':
                //watch for changes to glsl files and run external validation cli program to validate that glsl file compiles
                if(action === 'added' || action === 'changed'){
                    grunt.task.run('exec:glsl:'+filepath);
                }

                break;
        }


    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');

    // Default task(s).
    grunt.registerTask('default', ['jshint','uglify']);

};