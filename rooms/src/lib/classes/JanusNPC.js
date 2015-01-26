/**
 * JanusNPC Class
 *
 * Adds NPC properties to the specified Object which allows interaction when the player comes near
 *
 * @param id
 * @param dialog (Array) An array of dialog objects in the format of Text class described below
 * @param player (Object) JanusVR player object
 * @param targetDistance (Number) Number of the distance the player must be to the NPC before the NPC can be interacted
 * with
 * @returns {{nextSentance: Function, displaySentance: Function, restart: Function, isNearby: Function}}
 * @constructor
 */
var JanusNPC = function (id,dialog,player,targetDistance) {

    if(typeof targetDistance === 'undefined'){
        targetDistance = 2;
    }

    var _currentSentance = 0;
    var _dialog = [];
    var _imageObject;
    var _textObject;
    var _targetDistance = targetDistance;
    var _id = id;
    var _player = player;

    /**
     * Text Class
     * @param text (string) Text to display to the user
     * @param col (Vector) JanusVR Vector of color that text should be. Use the format Vector(R,G,B)
     * @param image (string) ID of the JanusVR AssetImage to display as an Image alongside the text
     * @param y (Number) The distance from the bottom of the players viewport to position text
     * @constructor
     */
    function Text(text,col,image,y) {

        if(typeof y === 'undefined'){
            y = 1.0;
        }

        this.text = text;
        this.col = col;
        this.image = image;
        this.y = y;
    }

    for(var i = 0; i < dialog.length; i++){
        _dialog.push(new Text(dialog[i].text,dialog[i].col,dialog[i].image,dialog[i].y));
    }

    //create text object if it doesn't exist
    if(typeof room.objects.npcText === 'undefined'){
        room.createObject("Text", {'js_id': 'npcText'});

        _textObject = room.objects.npcText;
        _textObject.id = "Text";
    }

    //create image object if it doesn't exist
    if(typeof room.objects.npcImage === 'undefined'){
        room.createObject("Image", {'js_id': 'npcImage'});

        _imageObject = room.objects.npcImage;
        _imageObject.id = _dialog[_currentSentance].image;
    }

    return {

        currentSentance: {
            get: function(){
                return _dialog[_currentSentance];
            }
        },

        attractorSentance: {
            show: function(){

            },
            hide: function(){

            }
        },

        nextSentance: function () {
            _currentSentance++;
            this.displaySentance(_currentSentance);

        },

        displaySentance: function(sentanceID) {


            _textObject.text = _dialog[sentanceID].text;
            //_textObject.col = _dialog[sentanceID].col;

            //set image ID to _currentImage so it will match the first sentence
            _imageObject.id = _dialog[sentanceID].image;
            _imageObject.scale = new Vector(0.1, 0.1, 0.1);
            _imageObject.lighting = false;
        },

        restart: function () {
            _currentSentance = 0;
            this.displaySentance(_currentSentance);
        },

        isNearby: function () {
            return JanusTools.isObjectNearby(room.objects[_id],_player,_targetDistance);
        }

    };
};

/**
 * Janus NPC Tools
 *
 * Supporting static functions that affect all NPCs
 */
var JanusNPCTools = (function () {

    return {
        /**
         * Update
         *
         * Static Function
         *
         * Updates the currently displayed NPC text to face the user. Call this on every Room.update()
         *
         * @param y (Number) The distance from the bottom of the players viewport to position text
         */
        update: function(player,y) {
            var textObject = room.objects.npcText;
            var imageObject = room.objects.npcImage;

            if(typeof textObject !== 'undefined'){
                JanusTools.updateHUD(textObject, player, 0, y);
            }

            if(typeof imageObject !== 'undefined'){
                JanusTools.updateHUD(imageObject, player, 0, y+0.15);
            }
        }
    };

}());

