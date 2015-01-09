/**
 * Elevator Class
 *
 * Enables an AssetObject to be turned into an elevator
 *
 * @author Michael Andrew (michael@uxvirtual.com) - Abstracted class & modifications
 * @author Dizzket (dizzket@reddit) - Original code and concept
 * @param stops Array of absolute positioned y-height values of stops. If 2 stops are created the elevator will start on
 * the first one then move up to the second stop and repeat the cycle every cycleInterval
 * @constructor
 */
var Elevator = function(id,stops,cycleInterval) {

    this.room = room;

    this.timer = 0;

    this.activated = 0;

    this.goToStop = 0;

    this.direction = 1; //1 is up, 0 is down

    this.cycleInterval = cycleInterval; //when to automatically change floors. -1 disables this

    this.stops = stops;

    this.id = id;
};

/**
 * Activate
 *
 * Activates the elevator
 */
Elevator.prototype.activate = function(){



    if (this.activated === 0)
    {
        if (this.direction === 1) //Upwards
        {
            //this.room.log('cycle interval hit '+this.timer);



            if (this.goToStop+1 >= this.stops.length) //If the next stop is larger than the array of stops
            {
                this.goToStop -= 1; //Set the next stop for below you
                this.direction = 0; //Set the direction to down
            }
            else
            {
                this.goToStop += 1; //Otherwise, if space above you, ascend.
            }
        }
        else //Downwards
        {
            if (this.goToStop-1 < 0)  //If next stop is below first array index
            {
                this.goToStop += 1; //Set the next stop for above you
                this.direction = 1; //Set direction to up
            }
            else
            {
                this.goToStop -= 1; //Otherwise, let you go down.
            }
        }
        this.timer = 0;
        this.activated = 1; //Activate elevator
    }
};

/**
 * Update
 *
 * Updates the elevator position based on its current movement path
 */
Elevator.prototype.update = function(){
    var moveSpeed;




    if (this.cycleInterval !== -1)
    {


        if (this.timer > this.cycleInterval)
        {

            //debugger; // jshint ignore:line
            this.activate();
        }
        else
        {
            this.timer += 1;
        }
    }

    if (this.activated === 1)
    {
        if (this.direction === 1) //if moving upwards
        {
            moveSpeed = +0.05; //Set moveSpeed (referenced when moving elevator)

            for(var i = this.goToStop; i <= this.stops.length; i++) //start loop beginning index to next stop
            {
                if (this.room.objects[this.id].pos.y > this.stops[i]) //if elevator next stop is smaller than elevator elevation
                {
                    this.activated = 0; //disable elevator
                    break;
                }
            }
        }
        else //if moving down
        {
            moveSpeed = -0.05;
            for(var x = this.goToStop; x >= 0; x--) //start loop beginning index to next stop
            {
                if (this.room.objects[this.id].pos.y < this.stops[x]) //if elevator next stop is smaller than elevator elevation
                {
                    this.activated = 0; //disable elevator
                    break;
                }
            }
        }
    }
    else
    {
        moveSpeed = 0;
    }


    if (this.activated === 1) //Update elevator height
    {
        this.room.objects[this.id].pos.y += moveSpeed;
    }
    else
    {
        this.room.objects[this.id].pos.y = this.stops[this.goToStop]; //Clip to the current stop
    }

    //this.room.log('next stop: '+(this.goToStop+1)+ ' length: '+this.stops.length+' activated: '+this.activated+' direction: '+((this.direction === 1) ? 'up' : 'down'));

    //this.room.log(this.timer);
};