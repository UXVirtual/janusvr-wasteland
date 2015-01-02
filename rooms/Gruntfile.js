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
                    'js/wasteland.min.js': ['src/lib/classes/elevator.js','src/rooms/wasteland/main.js']
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
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};