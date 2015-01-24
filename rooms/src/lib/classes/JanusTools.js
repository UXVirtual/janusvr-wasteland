/**
 * JanusTools
 *
 * Requires gl-matrix (https://github.com/toji/gl-matrix)
 *
 * @constructor
 */
var JanusTools = (function(){

    return {
        createfromXYZ: function(vec3)
        {
            var temp = quat.create();
            quat.rotateY(temp, temp, vec3[1]);
            quat.rotateX(temp, temp, vec3[0]);
            quat.rotateZ(temp, temp, vec3[2]);
            return temp;
        },

        generateLeftUpForward: function(left2,up2,forward2,quaternion)
        {
            var up = [0, 1, 0];
            var forward = [0, 0, -1];
            var left = [-1, 0, 0];

            vec3.transformQuat(up, up, quaternion);
            vec3.transformQuat(forward, forward, quaternion);
            vec3.transformQuat(left, left, quaternion);



            var coordinates = {
                left: [left[0], left[1], left[2]],
                up: [up[0], up[1], up[2]],
                forward: [forward[0], forward[1], forward[2]]
            };

            //Logger.log(coordinates);

            return coordinates;
        },

        objectLookAt: function(object1,object2)
        {
            var playerPosition = vec3.fromValues(object2.pos.x, object2.pos.y, object2.pos.z);


            //Logger.log(object2.pos.x+','+object2.pos.y+','+object2.pos.z);

            var quaternion = this.createfromXYZ(playerPosition);

            var rotationCoordinates = this.generateLeftUpForward(vec3.fromValues(object1.xdir.x,object1.xdir.y,object1.xdir.z),vec3.fromValues(object1.ydir.x,object1.ydir.y,object1.ydir.z),vec3.fromValues(object1.zdir.x,object1.zdir.y,object1.zdir.z),quaternion);

            //Logger.log(object1.xdir+','+object1.ydir+','+object1.zdir);

            object1.xdir.x = rotationCoordinates.left[0];
            object1.xdir.y = rotationCoordinates.left[1];
            object1.xdir.z = rotationCoordinates.left[2];

            object1.ydir.x = rotationCoordinates.up[0];
            object1.ydir.y = rotationCoordinates.up[1];
            object1.ydir.z = rotationCoordinates.up[2];

            object1.zdir.x = rotationCoordinates.forward[0];
            object1.zdir.y = rotationCoordinates.forward[1];
            object1.zdir.z = rotationCoordinates.forward[2];

            //Logger.log(object1.xdir.x+','+object1.xdir.y+','+object1.xdir.z);

            //object1.xdir = new Vector(rotationCoordinates.left[0], rotationCoordinates.left[1], rotationCoordinates.left[2]);
            //object1.ydir = new Vector(rotationCoordinates.up[0], rotationCoordinates.up[1], rotationCoordinates.up[2]);
            //object1.zdir = new Vector(rotationCoordinates.forward[0], rotationCoordinates.forward[1], rotationCoordinates.forward[2]);
        }
    };
}());