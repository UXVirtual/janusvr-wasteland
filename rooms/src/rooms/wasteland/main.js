/**
 * Wasteland Room Main JS script
 *
 * Handles all interactivity for the Wasteland room.
 *
 * @author Michael Andrew (michael@uxvirtual.com)
 */

var room = room;

var lastPlayerYFalling = 0;
var lastPlayerY = 0;
var killPlayerWhenLanded = false;
var fogMachine;
var isDying = false;

var currentSoundCount = 1;

var billyBob;

/*room.elevators = {
    elevator: new Elevator('elevator',[14.6, 40],20),
    elevator2: new Elevator('elevator2',[30, 74],20)
};*/

room.logDebug = function(text){
    JanusTools.updateHUD(room.objects['console'],player,0,0.9,0,text);
};

room.log = function(logs){

    var output = '';

    if(typeof logs === 'string'){
        output = logs;
    }else if(Object.prototype.toString.call( logs ) === '[object Array]'){
        for(var i = 0; i < logs.length; i++){
            output += StringTools.pad(logs[i].print(),200,'_',StringTools.STR_PAD_RIGHT);
        }
    }

    room.objects.debugText.text = output;
};

room.startFogMachine = function(){
    fogMachine = JanusTools.cycleFog(room,0.005,0.020,1000,isDying);
};

room.resetPlayerPosition = function(){
    player.pos = new Vector(38.09,17,-5.39);//room.pos;
    player.xdir = new Vector(0.85,0,0.53);
    player.ydir = new Vector(0,1,0);
    player.zdir = new Vector(0.53,0,-0.84);
    lastPlayerYFalling = 0;
    lastPlayerY = 0;
};

room.killPlayer = function(){

    room.playSound('die'+currentSoundCount);
    currentSoundCount++;

    if(currentSoundCount > 10){
        currentSoundCount = 1;
    }

    isDying = true;

    var originalFogCol = room['fog_col'];
    var originalFogDensity = room['fog_density'];
    //var originalFogMode = room['fog_mode'];

    //fogMachine.stop();

    new TWEEN.Tween( {
        density: originalFogDensity,
        r: originalFogCol.x,
        g: originalFogCol.y,
        b: originalFogCol.z
    })
        .to( {
            density: 3,
            r: 1,
            g: 0,
            b: 0
        }, 1000 )
        .easing(TWEEN.Easing.Linear.None)
        .onStart( function(){
            //room['fog_mode'] = 'linear';
        })
        .onUpdate( function () {


            room['fog_density'] = this.density;
            room['fog_col'] = new Vector(this.r,this.g,this.b);

        } )
        .onComplete( function () {
            //reset players position to start
            room.resetPlayerPosition();
            room['fog_density'] = originalFogDensity;
            room['fog_col'] = originalFogCol;
            //room['fog_mode'] = originalFogMode;
            //room.startFogMachine();
            isDying = false;
        })
        .start();
};

room.checkFalling = function(){
    if(JanusTools.isInRoom(player)){

        //check if player is falling
        new TWEEN.Tween( {
            time: 0
        })
            .to( { time: 2000 }, 2000 )
            .onStart( function () {

            })
            .onUpdate( function () {



            } )
            .onComplete( function() {

                if(lastPlayerYFalling-player.pos.y > 10){
                    //player has fallen 5m since last check 2 seconds ago - they will be killed when they land
                    killPlayerWhenLanded = true;
                }



                lastPlayerYFalling = player.pos.y;


                room.checkFalling();
            })
            .start();
    }
};

room.checkLanded = function(){
    if(lastPlayerY === player.pos.y){
        //player is stationary - if they must be killed do it here
        if(killPlayerWhenLanded){

            killPlayerWhenLanded = false;

            room.killPlayer();
        }
    }
};

room.moveDustDevil = function(){

    var randomXOffset = _.random(0,50);
    var randomXDir = _.random(0,1);
    var randomZOffset = _.random(0,50);
    var randomZDir = _.random(0,1);

    var dustDevil = room.objects.dustDevil;
    var text = room.objects.dustDevilText;

    new TWEEN.Tween( {
        x: dustDevil.pos.x,
        z: dustDevil.pos.z
    })
        .to( { x: ((randomXDir === 1) ? "+" : "-")+randomXOffset, z: ((randomZDir === 1) ? "+" : "-")+randomZOffset }, 10000 )
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo()
        .onUpdate( function () {
            //Logger.log(Math.round(room.objects.dustDevil.pos.x)+','+Math.round(room.objects.dustDevil.pos.y)+','+Math.round(room.objects.dustDevil.pos.z));

            if(this.x > 85){
                dustDevil.pos.x = 85;
                text.pos.x = 85;
            }else{
                dustDevil.pos.x = this.x;
                text.pos.x = this.x;
            }

            if(this.x < 0){
                dustDevil.pos.x = 0;
                text.pos.x = 0;
            }else{
                dustDevil.pos.x = this.x;
                text.pos.x = this.x;
            }

            if(this.z > 0){
                dustDevil.pos.z = 0;
                text.pos.z = 0;
            }else{
                dustDevil.pos.z = this.z;
                text.pos.z = this.z;
            }

            if(this.z < -61){
                dustDevil.pos.z = -61;
                text.pos.z = -61;
            }else{
                dustDevil.pos.z = this.z;
                text.pos.z = this.z;
            }

            //JanusTools.objectLookAt(room.objects.dustDevilText,player);

            text.text = Math.round(dustDevil.pos.x)+','+Math.round(dustDevil.pos.y)+','+Math.round(dustDevil.pos.z);
        } )
        .onComplete( function () {
            room.moveDustDevil();
        })
        .start();
};


var tween;

Logger.config.maxLogs = 5;



var firstRun = false;

room.firstRun = function(){
    if(!firstRun){

        var elevator = room.objects.elevator;
        var elevator2 = room.objects.elevator2;
        var elevator3 = room.objects.elevator3;
        var scalecube = room.objects.scalecube;

        //animate elevator
        new TWEEN.Tween( {
            y: elevator.pos.y
        })
            .to( { y: 35 }, 10000 )
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate( function () {
                //Logger.log('y: '+this.y);
                elevator.pos.y = this.y;
            } )
            .start();

        //TODO: set sync property to true for elevator objects to force other clients to update the position of
        //elevator. It may be better to do this after manual activations of elevators. For automatic elevators some kind
        //of syncronisation using the client's Date.now() time should be sufficient to ensure that the elevators of all
        //the clients are moving in sync with each other. I.e. when a client joins the JS will have a prepared index of
        //where the elevator should be at any given second and will skip ahead to the correct point. Might need to swap
        //out tween.js for Greensock tweening library and use the Timeline class to skip ahead in a tween.

        //animate elevator2
        new TWEEN.Tween( {
            y: elevator2.pos.y
        })
            .to( { y: 60 }, 5000 )
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate( function () {
                //Logger.log('y: '+this.y);
                elevator2.pos.y = this.y;
            } )
            .start();

        //animate elevator3
        new TWEEN.Tween( {
            y: elevator3.pos.y
        })
            .to( { y: 73 }, 2500 )
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate( function () {
                //Logger.log('y: '+this.y);
                elevator3.pos.y = this.y;
            } )
            .start();

        //animate scalecube
        new TWEEN.Tween( {
            scaleX: scalecube.scale.x,
            scaleY: scalecube.scale.y,
            scaleZ: scalecube.scale.z
        })
            .to( { scaleX: 1.2, scaleY: 1.3, scaleZ: 1.2 }, 500 )
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate( function () {
                //Logger.log('scaleX: '+this.scaleX);
                scalecube.scale.x = this.scaleX;
                scalecube.scale.y = this.scaleY;
                scalecube.scale.z = this.scaleZ;

            } )
            .start();

        room.startFogMachine();

        room.checkFalling();



        room.moveDustDevil();





        JanusTools.generateStairs([28.2, 14.6, -9],[0, 0, 0]);

        billyBob = new JanusNPC('billyBob',[
            {
                text: "!",
                col: new Vector(0,1,0),
                image: 'monster18headAssetImage',
                y: 2.7 //y offset from head of model to text position
            },
            {
                text: "Hi "+player.userid+", I'm Billy Bob the robot. I'll prepare the elevator for you!",
                col: new Vector(1,0,0),
                image: 'monster18headAssetImage',
                y: 0.9
            }
        ],player,3);

        room.playSound('storm-wind-loop');

        firstRun = true;
    }





};

/**
 * On Enter
 *
 * Invoked before the first update of the room. Note that this is not when the room is loaded, but when the user first
 * steps into the room.
 *
 * Note: onEnter() appears to be slightly buggy - tweens won't work here. Instead place these tweens inside room.update()
 * and run them once.
 */
room.onEnter = function(){


    Logger.log('Entered room');




};

/**
 * Update
 *
 * Invoked on each frame before the world is drawn.
 *
 * @param dt Time elapsed between this update and the previous update. Useful for ensuring objects move at the same
 * speed regardless of framerate.
 */
room.update = function(dt){

    room.firstRun();

    //room.logDebug("offset: "+Math.round((lastPlayerYFalling-player.pos.y) * 100) / 100+' killplayer: '+killPlayerWhenLanded+' NPC: '+JanusTools.isObjectNearby(room.objects.billyBob,player,2));

    //JanusTools.updateNPCText('npcText',player,1.2);

    //TODO: Fix bug caused by NPC library which causes the JS to stutter after a certain amount of time (memory leak?)

    if(billyBob.isNearby()){
        billyBob.displaySentence(1);
    }else{
        billyBob.restart();
    }

    JanusNPCTools.update(player,billyBob);

    //JanusTools.updateNPCText('npcText',player,1.2);

    lastPlayerY = player.pos.y;

    room.checkLanded();


    //var head = room.objects.monster18Head;
    //var body = room.objects.billyBob;

    JanusTools.objectLookAtPoint(room.objects.dustDevilText,player["view_dir"]);


    //JanusTools.objectLookAtPoint(room.objects['iron-fence'],player["view_dir"]);

    //output currently stored logs to Paragraph in room
    room.log(Logger.get.logsOfLevel(0));

    //room.logDebug('Pos: '+room.objects['billyBobAttractorText'].pos);

    TWEEN.update();
};

/**
 * On Collision
 *
 * Invoked twice when two objects in the room collide with each other: once with the first object as the first argument
 * and the second object as the second argument, and once with the second object as the first argument and the first
 * object as the second argument. Note that both elements need to have a collision radius in order to collide.
 *
 * @param object First object to detect collision against
 * @param other Second object to detect collision against
 */
room.onCollision = function(object,other){

};

/**
 * On Click
 *
 * This function is called when the user left clicks their mouse.
 *
 */
room.onClick = function(){


};

/**
 * On Key Up
 *
 * @param event
 */
room.onKeyUp = function(event)
{

    //room.logDebug('Pressed: "'+event.keyCode+'"');

    if (event.keyCode === " "){
        //NOTE: room.playSound() happens really late after the first call so is only useful for non-time critical sfx

        /*
         Right now, it's not possible to have a single SoundAsset start multiple times at the same time, right? So we
         have to wait until it's done playing before we can start it again.

         What I'm doing as a workaround right now is basically: have a lot of numbered sound assets and then manage
         which ones can be recycled using javascript. This works alright, but it would be nice to have a cleaner
         solution some time in the future!
         */

        room.playSound('jump-super'+currentSoundCount);
        currentSoundCount++;

        if(currentSoundCount > 20){
            currentSoundCount = 1;
        }
    }
};
