/**
 * JanusTools
 *
 * Requires gl-matrix (https://github.com/toji/gl-matrix)
 * Requires tween.js (https://github.com/sole/tween.js/)
 *
 * @constructor
 */
var JanusTools = (function () {

    var _lastURL = '';
    var _lookAtPointVector = new Vector(0,0,0);
    var _objectTransformPointVector = new Vector(0,0,0);

    return {
        createfromXYZ: function (vec3) {
            var temp = quat.create();
            quat.rotateY(temp, temp, vec3[1]);
            quat.rotateX(temp, temp, vec3[0]);
            quat.rotateZ(temp, temp, vec3[2]);
            return temp;
        },

        generateLeftUpForward: function (quaternion) {
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

        //TODO: fix issue where new Vectors are created every frame - currently these have memory leaks
        /*
         If you're talking about using JS to animate, avoid assigning values to the result of the Vector() function, which allocates memory. As when it used it in an assignment operation, the previously allocated memory remains (you are just changing a pointer during the assignment). The "Vector" object built into JS needs some reworking.
         A workaround for now is to set each of the x, y, z values explicitly and deal directly with the floats. So for example avoid:
         object["blah"].pos = Vector(x,y,z);
         and do:
         object["blah"].pos.x = x; object["blah"].pos.y = y; object["blah"].pos.z = z;
         */
        objectLookAtPoint: function (object1, point, ignoreX, ignoreY, ignoreZ, invertPos) {
            if (typeof ignoreX === 'undefined') {
                ignoreX = false;
            }

            if (typeof ignoreY === 'undefined') {
                ignoreY = false;
            }

            if (typeof ignoreZ === 'undefined') {
                ignoreZ = false;
            }

            if (typeof invertPos === 'undefined') {
                invertPos = true;
            }

            var transformedPoint = (invertPos) ? this.objectTransformPoint(point) : point;

            var x = (ignoreX) ? object1.fwd.x : transformedPoint.x;
            var y = (ignoreY) ? object1.fwd.y : transformedPoint.y;
            var z = (ignoreZ) ? object1.fwd.z : transformedPoint.z;

            _lookAtPointVector.x = x;
            _lookAtPointVector.y = y;
            _lookAtPointVector.z = z;

            object1.fwd = _lookAtPointVector;

            //object1.fwd.x = x;
            //object1.fwd.y = y;
            //object1.fwd.z = z;
        },

        objectTransformPoint: function (point) {
            //invert the coordinates so object will be facing the correct direction when looking at point
            //point.x = point.x * -1;
            //point.y = point.y * -1;
            //point.z = point.z * -1;

            _objectTransformPointVector.x = point.x;
            _objectTransformPointVector.y = point.y;
            _objectTransformPointVector.z = point.z;

            //point = scalarMultiply( new Vector(point.x,point.y,point.z), -1);
            //point = scalarMultiply(point, -1);
            point = scalarMultiply(_objectTransformPointVector, -1);

            return point;
        },

        updateHUD2: function (object,player,x,y,z) {
            //You'll want to incorporate the player's view_dir and up_dir. You'll also need the cross product of those
            // two for the third vector. Set these to the xdir, ydir, zdir (orientation) for your object so it faces you
            // regardless of view direction. Lastly you'll want to translate the object outward -
            // add the player.pos + player.eye_pos + player.view_dir * distance_you_want.

            var crossProduct = cross(player['view_dir'],player['up_dir']);


            //print(crossProduct);
            object.xdir = cross(player['view_dir'],player['up_dir']);
            object.ydir = scalarMultiply(player['up_dir'], 1);
            object.zdir = cross(player['view_dir'],player['up_dir']);

            //var faceUserFWD = scalarMultiply( cross(player['view_dir'],player['up_dir']), -1);
            //object.fwd = faceUserFWD;

            object.pos = new Vector((player.pos.x + player['eye_pos'].x + player['view_dir'].x * 0.5),(player.pos.y + player['eye_pos'].y + player['view_dir'].y + y),(player.pos.z + player['eye_pos'].z + player['view_dir'].z * 0.5));

            print(object.pos);

            //var offsetPosition = translate(player.pos, player['view_dir']);

            //object.pos = translate(offsetPosition, new Vector( 0, y, 0));

        },


        //JanusVR screen FOV is 70 as at current version. FOV for Oculus is taken from Oculus SDK
        vectorToScreen2D: function (vector,player,fov,screenWidth,screenHeight) {
            //double screenX = 0d, screenY = 0d;

            var screenX = 0;
            var screenY = 0;

            // Camera is defined in XAML as:
            //        <Viewport3D.Camera>
            //             <PerspectiveCamera Position="0,0,800" LookDirection="0,0,-1" />
            //        </Viewport3D.Camera>

            //PerspectiveCamera cam = viewPort.Camera as PerspectiveCamera;

            // Translate input point using camera position
            var inputX = vector.x - player.pos.x;
            var inputY = vector.y - player.pos.y;
            var inputZ = vector.z - player.pos.z;

            var aspectRatio = screenWidth / screenHeight;

            // Apply projection to X and Y
            screenX = inputX / (-inputZ * Math.Tan(fov / 2));

            screenY = (inputY * aspectRatio) / (-inputZ * Math.Tan(fov / 2));

            // Convert to screen coordinates
            //screenX = screenX * screenWidth;

            //screenY = screenY * screenHeight;
            //screenY = screenHeight * (1 - screenY);

            screenX = screenWidth * (screenX + 1.0) / 2.0;
            screenY = screenHeight * (1.0 - ((screenY + 1.0) / 2.0));


            // Additional, currently unused, projection scaling factors
            /*
             double xScale = 1 / Math.Tan(Math.PI * cam.FieldOfView / 360);
             double yScale = aspectRatio * xScale;

             double zFar = cam.FarPlaneDistance;
             double zNear = cam.NearPlaneDistance;

             double zScale = zFar == Double.PositiveInfinity ? -1 : zFar / (zNear - zFar);
             double zOffset = zNear * zScale;

             */

            return {
                x: screenX,
                y: screenY
            };
        },

        generateStairs: function (position, color) {
            Logger.log('Generating stairs...');

            room.createObject("Object", {'js_id': "stair1"});

            room.objects.stair1.id = 'cube';
            room.objects.stair1.pos = new Vector(position[0], position[1], position[2]);
            room.objects.stair1.col = new Vector(color[0], color[1], color[2]);
            room.objects.stair1.scale = new Vector(1, 1, 1);

            Logger.log('Generated stairs at: ' + room.objects.stair1.pos);
        },

        cycleFog: function (object, min, max, interval, paused) {

            var randomOffset = _.random(0, min);
            var randomDir = _.random(0, 1);

            var self = this;

            return new TWEEN.Tween({
                density: object['fog_density']
            })
                .to({ density: ((randomDir === 1) ? "+" : "-") + randomOffset }, interval)
                .yoyo(true)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onUpdate(function () {

                    if (!paused) {
                        var newDensity = this.density;

                        if (this.density < min) {
                            newDensity = min;
                        } else if (this.density > max) {
                            newDensity = max;
                        }

                        object['fog_density'] = newDensity;
                    }


                    //Logger.log(object['fog_density']);
                })
                .onComplete(function () {
                    self.cycleFog(object, min, max, interval, paused);
                })
                .onStop(function () {

                })
                .start();
        },

        updateHUD: function (object, player, x, y, z, text) {
            // Rudimentary HUD, follows the player and faces the player.

            if (typeof text !== 'undefined') {
                object.text = text;
            }

            if(typeof x === 'undefined'){
                x = 0;
            }

            if(typeof y === 'undefined'){
                y = 0;
            }

            if(typeof z === 'undefined'){
                z = 0;
            }


            //NOTE: Adjusting the below will force the object to always be at a position fixed in the world offset by Z
            //var offsetPosition = translate(new Vector(player.pos.x,player.pos.y,player.pos.z-20), player['view_dir']);


            var offsetPosition = translate(player.pos, player['view_dir']);
            var faceUserFWD = scalarMultiply( player['view_dir'], -1);

            //faceUserFWD.x = faceUserFWD.x*4;
            //faceUserFWD.z = faceUserFWD.z*4;

            //y = height that text should display at relative to player's viewport
            object.pos = translate(offsetPosition, new Vector( 0, y, 0));
            object.fwd = faceUserFWD;
        },

        isObjectNearby: function (object1, object2, targetDistance) {

            if (typeof targetDistance === 'undefined') {
                targetDistance = 2;
            }

            var totalDistance = distance(object1.pos, object2.pos);

            return (totalDistance <= targetDistance);
        },

        isInRoom: function (player) {
            if(player.url === _lastURL){
                return true;
            }else{
                _lastURL = player.url;
                return false;
            }
        }




    };
}());