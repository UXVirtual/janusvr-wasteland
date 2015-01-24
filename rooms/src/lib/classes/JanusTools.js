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

        generateLeftUpForward: function(quaternion)
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

        objectLookAtPoint: function(object1,point)
        {

            //invert the coordinates so object will be facing the correct direction when looking at point
            point.x = point.x*-1;
            point.y = point.y*-1;
            point.z = point.z*-1;

            Logger.log(Math.round(point.x * 100) / 100+' '+Math.round(point.y * 100) / 100+' '+Math.round(point.z * 100) / 100);

            object1.fwd = point;
        },

        generateStairs: function(position,color){
            Logger.log('Generating stairs...');

            room.createObject("Object",{'js_id':"stair1"});

            room.objects.stair1.id = 'cube';
            room.objects.stair1.pos = new Vector(position[0],position[1],position[2]);
            room.objects.stair1.col = new Vector(color[0],color[1],color[2]);
            room.objects.stair1.scale = new Vector(1,1,1);

            Logger.log('Generated stairs at: '+room.objects.stair1.pos);
        }


    };
}());