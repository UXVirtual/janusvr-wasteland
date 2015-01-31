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
 * @returns {{nextSentence: Function, displaySentence: Function, restart: Function, isNearby: Function}}
 * @constructor
 */
var JanusNPC = function (id,dialog,player,targetDistance) {

    if(typeof targetDistance === 'undefined'){
        targetDistance = 2;
    }

    var _currentSentence = 0;
    var _dialog = [];
    var _imageObject;
    var _textObject;
    var _targetDistance = targetDistance;
    var _id = id;
    var _attractorTextObject;
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
        _imageObject.id = _dialog[_currentSentence].image;
    }

    //create attractor text object if it doesn't exist
    if(typeof room.objects[_id+'AttractorText'] === 'undefined'){
        room.createObject("Text", {'js_id': _id+'AttractorText'});

        _attractorTextObject = room.objects[_id+'AttractorText'];
        _attractorTextObject.id = "Text";
        _attractorTextObject.pos = room.objects[_id].pos;

    }else{
        _attractorTextObject = room.objects[_id+'AttractorText'];
    }

    return {

        id: {
            get: function() {
                return _id;
            }
        },

        currentSentence: {
            get: function(){
                return _dialog[_currentSentence];
            }
        },

        currentSentenceIndex: {
            get: function(){
                return _currentSentence;
            }
        },

        attractorTextObject: {
            get: function(){
                return _attractorTextObject;
            }
        },

        nextSentence: function () {
            _currentSentence++;
            this.displaySentence(_currentSentence);

        },

        displaySentence: function(sentenceID,targetObject) {

            _currentSentence = sentenceID;

            //NOTE: currently there is a bug where if the color of the text is set after the Text object is
            // initialized it may crash
            if(typeof targetObject === 'undefined'){
                _textObject.text = _dialog[sentenceID].text;
                //_textObject.col = _dialog[sentenceID].col;
            }else{
                _textObject.text = ' ';
                targetObject.text = _dialog[sentenceID].text;
                //targetObject.col = _dialog[sentenceID].col;
            }

            _imageObject.id = _dialog[sentenceID].image;
            _imageObject.scale = new Vector(0.1, 0.1, 0.1);
            _imageObject.lighting = false;

        },

        restart: function () {
            _currentSentence = 0;
            this.displaySentence(_currentSentence,_attractorTextObject);
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
        update: function(player,npc) {
            var textObject = room.objects.npcText;
            var imageObject = room.objects.npcImage;
            var attractorTextObject = npc.attractorTextObject.get();
            var npcHeadObject = room.objects[npc.id.get()+'Head'];
            var npcBodyObject = room.objects[npc.id.get()];
            var currentSentenceIndex = npc.currentSentenceIndex.get();
            var currentSentence = npc.currentSentence.get();
            //var npcObject = room.objects[npc.id.get()];

            var y = npc.currentSentence.get().y;

            if(typeof textObject !== 'undefined'){

                if(currentSentenceIndex > 0){
                    JanusTools.updateHUD(textObject, player, 0, y);
                }else{
                    JanusTools.updateHUD(textObject, player, 0, -99999);
                }

            }

            if(typeof imageObject !== 'undefined'){


                if(currentSentenceIndex > 0){
                    JanusTools.updateHUD(imageObject, player, 0, y+0.15);
                }else{
                    JanusTools.updateHUD(imageObject, player, 0, -99999);
                }
            }

            if(currentSentenceIndex > 0){
                attractorTextObject.pos = new Vector(npcHeadObject.pos.x,-99999,npcHeadObject.pos.z);
            }else{
                attractorTextObject.pos = new Vector(npcHeadObject.pos.x,npcHeadObject.pos.y+currentSentence.y,npcHeadObject.pos.z);
            }

            JanusTools.objectLookAtPoint(attractorTextObject,new Vector(player['view_dir'].x,player['view_dir'].y,player['view_dir'].z),false,false,false,true);

            JanusTools.objectLookAtPoint(npcHeadObject,player["view_dir"],false,false,false,true);
            JanusTools.objectLookAtPoint(npcBodyObject,player["view_dir"],false,true,false,true);
        }
    };

}());

