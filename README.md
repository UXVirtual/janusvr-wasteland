janusvr-wasteland
=================

A wasteland environment filled with exciting locales to explore and NPCs to meet.

Installation
------------

1. Install [node.js](http://www.nodejs.org/).
2. Intall grunt-cli by running `npm install -g grunt-cli` from the terminal. Depending on your system configuration you may need to run this command with `sudo`.
3. Install project dependencies by running `npm install` from the `rooms` folder of the repository.

Building
--------

* Run `grunt` from the `rooms` folder of the respository to build the js files for each room from source.
* Alternately to use grunt to watch the `rooms/src` folder for changes run `grunt watch` from the root of the repository.

Every time you build using `grunt` you'll receive feedback on your JavaScript code including line numbers which will
suggest improvements. In the event of a JavaScript error in your code, the build will fail and it will tell you what you
did wrong.