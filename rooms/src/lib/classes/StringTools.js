var StringTools = (function(){

    return {

        STR_PAD_LEFT: 1,
        STR_PAD_RIGHT: 2,
        STR_PAD_BOTH: 3,


        /**
         * Pad
         *
         * Pads a string to the left or right to the given length
         *
         * @author Michael Andrew (michael@uxvirtual.com)
         *
         * @url http://www.webtoolkit.info/javascript-pad.html - original code from this URL
         *
         * @param str
         * @param len
         * @param pad
         * @param dir
         * @returns string
         */
        pad: function(str, len, pad, dir) {



            if (typeof(len) === "undefined") { len = 0; }
            if (typeof(pad) === "undefined") { pad = '-'; }
            if (typeof(dir) === "undefined") { dir = this.STR_PAD_RIGHT; }

            if (len + 1 >= str.length) {

                switch (dir){

                    case this.STR_PAD_LEFT:
                        str = new Array(len + 1 - str.length).join(pad) + str;
                        break;

                    case this.STR_PAD_BOTH:

                        var padlen = len - str.length;
                        var right = Math.ceil((padlen) / 2);
                        var left = padlen - right;
                        str = new Array(left+1).join(pad) + str + new Array(right+1).join(pad);
                        break;

                    default:
                        str = str + new Array(len + 1 - str.length).join(pad);
                        break;

                } // switch

            }

            return str;

        }
    };

}());