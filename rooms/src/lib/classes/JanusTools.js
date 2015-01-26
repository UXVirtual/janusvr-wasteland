/**
 * JanusTools
 *
 * Requires gl-matrix (https://github.com/toji/gl-matrix)
 * Requires tween.js (https://github.com/sole/tween.js/)
 *
 * @constructor
 */
var JanusTools = (function () {

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

        objectLookAtPoint: function (object1, point, ignoreX, ignoreY, ignoreZ) {
            if (typeof ignoreX === 'undefined') {
                ignoreX = false;
            }

            if (typeof ignoreY === 'undefined') {
                ignoreY = false;
            }

            if (typeof ignoreZ === 'undefined') {
                ignoreZ = false;
            }

            var transformedPoint = this.objectTransformPoint(object1, point);

            var x = (ignoreX) ? object1.fwd.x : transformedPoint.x;
            var y = (ignoreY) ? object1.fwd.y : transformedPoint.y;
            var z = (ignoreZ) ? object1.fwd.z : transformedPoint.z;

            object1.fwd = new Vector(x, y, z);
        },

        objectTransformPoint: function (object1, point) {
            //invert the coordinates so object will be facing the correct direction when looking at point
            point.x = point.x * -1;
            point.y = point.y * -1;
            point.z = point.z * -1;

            return point;
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

        updateHUD: function (object, player, y, text) {
            // Rudimentary HUD, follows the player and faces the player.

            if (typeof text !== 'undefined') {
                object.text = text;
            }

            var offsetPosition = translate(player.pos, player['view_dir']);
            var faceUserFWD = scalarMultiply(player['view_dir'], -1);

            //y = height that text should display at relative to player's viewport
            object.pos = translate(offsetPosition, new Vector(0, y, 0));
            object.fwd = faceUserFWD;
        },

        /*updateNPCText: function (textObjectName, player, y, text, color) {
            var textObject;

            if (typeof room.objects[textObjectName] === 'undefined') {
                room.createObject("Text", {'js_id': textObjectName});

                textObject = room.objects[textObjectName];
                textObject.id = textObjectName;
            } else {
                textObject = room.objects[textObjectName];
            }

            if (typeof color === 'undefined') {
                textObject.col = new Vector(1, 1, 1);
            } else {
                textObject.col = color;
            }

            textObject.scale = new Vector(1, 1, 1);

            this.updateHUD(textObject, player, y, text);


        },*/

        isObjectNearby: function (object1, object2, targetDistance) {

            if (typeof targetDistance === 'undefined') {
                targetDistance = 2;
            }

            var totalDistance = distance(object1.pos, object2.pos);

            return (totalDistance <= targetDistance);
        }




    };
}());