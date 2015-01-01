//JanusVR Javascript
//Simple Multifloor Elevator v0.1
//dizzket@reddit
//

//Global Variables
var timer = 0;

//Objects

var elevator = {
    activated: 0,
    gotostop: 0,
    direction: 1, //1 is up, 0 is down
    //cycleinterval: 1024 //when to automatically change floors. -1 disables this
    cycleinterval: 20 //when to automatically change floors. -1 disables this
};

// Arrays

// absolute positioned y-height of stops. If 2 stops are created the elevator will start on the first one then move up
// to the second stop and repeat the cycle every cycleinterval
var stop = [14.6, 74];

// Functions

room.elevClick = function() {

    if (elevator.activated == 0)
    {
        if (elevator.direction == 1) //Upwards
        {
            if (elevator.gotostop+1 >= stop.length) //If the next stop is larger than the array of stops
            {
                elevator.gotostop -= 1; //Set the next stop for below you
                elevator.direction = 0; //Set the direction to down
            }
            else
            {
                elevator.gotostop += 1; //Otherwise, if space above you, ascend.
            }
        }
        else //Downwards
        {
            if (elevator.gotostop-1 < 0)  //If next stop is below first array index
            {
                elevator.gotostop += 1; //Set the next stop for above you
                elevator.direction = 1; //Set direction to up
            }
            else
            {
                elevator.gotostop -= 1; //Otherwise, let you go down.
            }
        }
        timer = 0
        elevator.activated = 1; //Activate elevator
    }

}

room.update = function() {

    if (elevator.cycleinterval != -1)
    {
        if (timer > elevator.cycleinterval)
        {
            room.elevClick()
        }
        else
        {
            timer += 1
        }
    }

    if (elevator.activated == 1)
    {
        if (elevator.direction == 1) //if moving upwards
        {
            var movespeed = +0.05 //Set movespeed (referenced when moving elevator)

            for(i=elevator.gotostop;i<=stop.length;i++) //start loop beginning index to next stop
            {
                if (room.objects["elevator"].pos.y > stop[i]) //if elevator next stop is smaller than elevator elevation
                {
                    elevator.activated = 0; //disable elevator
                    break;
                }
            }
        }
        else //if moving down
        {
            var movespeed = -0.05
            for(i=elevator.gotostop;i>=0;i--) //start loop beginning index to next stop
            {
                if (room.objects["elevator"].pos.y < stop[i]) //if elevator next stop is smaller than elevator elevation
                {
                    elevator.activated = 0; //disable elevator
                    break;
                }
            }
        }
    }
    else
    {
        var movespeed = 0
    }


    if (elevator.activated == 1) //Update elevator height
    {
        room.objects["elevator"].pos.y += movespeed;
    }
    else
    {
        room.objects["elevator"].pos.y = stop[elevator.gotostop]; //Clip to the current stop
    }

    /*if ((player.pos.y < room.objects["elevator"].pos.y) && (player.pos.y > room.objects["elevator"].pos.y-2)) //If player is below object, update height.
    {

        if ((player.pos.x > room.objects["elevator"].pos.x-2) && (player.pos.x < room.objects["elevator"].pos.x+2)
            && (player.pos.z > room.objects["elevator"].pos.z-2) && (player.pos.z < room.objects["elevator"].pos.z+2) )
        {
            player.pos.y = room.objects["elevator"].pos.y;
        }


    }*/


}