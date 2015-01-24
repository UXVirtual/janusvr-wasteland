/**
 * Wasteland Room Main JS script
 *
 * Handles all interactivity for the Wasteland room.
 *
 * @author Michael Andrew (michael@uxvirtual.com)
 */

var room = room;

/*room.elevators = {
    elevator: new Elevator('elevator',[14.6, 40],20),
    elevator2: new Elevator('elevator2',[30, 74],20)
};*/

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

room.moveDustDevil = function(){

    var randomXOffset = _.random(0,50);
    var randomXDir = _.random(0,1);
    var randomZOffset = _.random(0,50);
    var randomZDir = _.random(0,1);

    new TWEEN.Tween( {
        x: room.objects.dustDevil.pos.x,
        z: room.objects.dustDevil.pos.z
    })
        .to( { x: ((randomXDir === 1) ? "+" : "-")+randomXOffset, z: ((randomZDir === 1) ? "+" : "-")+randomZOffset }, 2000 )
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo()
        .onUpdate( function () {
            Logger.log(Math.round(room.objects.dustDevil.pos.x)+','+Math.round(room.objects.dustDevil.pos.y)+','+Math.round(room.objects.dustDevil.pos.z));

            if(this.x > 85){
                room.objects.dustDevil.pos.x = 85;
                room.objects.dustDevilText.pos.x = 85;
            }else{
                room.objects.dustDevil.pos.x = this.x;
                room.objects.dustDevilText.pos.x = this.x;
            }

            if(this.x < 0){
                room.objects.dustDevil.pos.x = 0;
                room.objects.dustDevilText.pos.x = 0;
            }else{
                room.objects.dustDevil.pos.x = this.x;
                room.objects.dustDevilText.pos.x = this.x;
            }

            if(this.z > 4){
                room.objects.dustDevil.pos.z = 4;
                room.objects.dustDevilText.pos.x = 4;
            }else{
                room.objects.dustDevil.pos.z = this.z;
                room.objects.dustDevilText.pos.z = this.z;
            }

            if(this.z < -61){
                room.objects.dustDevil.pos.z = -61;
                room.objects.dustDevilText.pos.x = -61;
            }else{
                room.objects.dustDevil.pos.z = this.z;
                room.objects.dustDevilText.pos.z = this.z;
            }

            //JanusTools.objectLookAt(room.objects.dustDevilText,player);

            room.objects.dustDevilText.text = Math.round(room.objects.dustDevil.pos.x)+','+Math.round(room.objects.dustDevil.pos.y)+','+Math.round(room.objects.dustDevil.pos.z);
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



        new TWEEN.Tween( {
            y: room.objects.cubetest.pos.y
        })
            .to( { y: 70 }, 10000 )
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate( function () {
                //Logger.log('y: '+this.y);
                room.objects.cubetest.pos.y = this.y;

            } )
            .start();

        new TWEEN.Tween( {
            scaleX: room.objects.cubetest2.scale.x,
            scaleY: room.objects.cubetest2.scale.y,
            scaleZ: room.objects.cubetest2.scale.z
        })
            .to( { scaleX: 1.2, scaleY: 1.3, scaleZ: 1.2 }, 500 )
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate( function () {
                //Logger.log('scaleX: '+this.scaleX);
                room.objects.cubetest2.scale.x = this.scaleX;
                room.objects.cubetest2.scale.y = this.scaleY;
                room.objects.cubetest2.scale.z = this.scaleZ;

            } )
            .start();



        //Logger.log(room.objects.dustDevilText.xdir+' '+room.objects.dustDevilText.ydir+' '+room.objects.dustDevilText.zdir);

        //room.moveDustDevil();

        //Logger.log(_.random(0,50));

        firstRun = true;
    }

    JanusTools.objectLookAt(room.objects.dustDevilText,player);
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

    //Logger.log('update: '+Date.now());



    //room.log('tween length: '+TWEEN._tweens.length);

    //room.log('mep');
    //room.log(['cake','cake2','cake3']);

    /*for(var elevator in room.elevators){
        room.elevators[elevator].update();
    }*/


    TWEEN.update();





    //room.log('update: '+Date.now()+' '+tweenSuccess);


    //room.log('tween success: '+tweenSuccess);


    //room.objects.cubetest.pos.y = 40;



    //output currently stored logs to Paragraph in room
    room.log(Logger.get.logsOfLevel(0));

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