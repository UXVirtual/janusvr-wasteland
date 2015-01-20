/**
 * Logger
 *
 * Stores and outputs x number of lines of logs. Useful for outputting to a JanusVR Text Object
 *
 * @author codenamesrcl (http://www.reddit.com/u/codenamesrcl) - original author
 * @author Michael Andrew (michael@uxvirtual.com)
 */
var Logger = (function(){

    var logs = [];

    var _maxLogs = 50;


    function LogItem(level, value, location){
        if(typeof value !== 'object'){
            this.value = value;
        }
        else{
            this.value = JSON.stringify(value);
        }
        this.location = location;
        this.level = level;
    }
    LogItem.prototype.print = function(){
        return this.level + " : " + this.location + " : " + this.value;
    };

    function AddLog(level, value, location){
        var item = new LogItem(level, value, location);

        logs.push(item);

        if(logs.length > _maxLogs){
            logs.shift();
        }

        return item;
    }

    return{
        log:function(value, location, level, callback){

            if(typeof location === 'undefined'){
                location = -1;
            }

            if(typeof level === 'undefined'){
                level = 0;
            }

            var item = new AddLog(level, value, location);

            if(typeof callback === 'function'){
                callback(item);
            }
        },
        get:{
            logsOfLevel:function(level){
                if(level !== 0){
                    var returnable = [];
                    for(var dex = 0; dex < logs.length; dex++){
                        if(logs[dex].level === level){
                            returnable.push(logs[dex]);
                        }
                    }

                    return returnable;
                }
                else{
                    return logs;
                }
            },
            logsMinLevel:function(minlevel){
                //get logs of at least this level
            }
        },

        config:{
            maxLogs:{
                get:function(){
                    return _maxLogs;
                },
                set:function(value){
                    if(typeof value === 'number'){
                        _maxLogs = value;
                    }
                }
            }
        }
    };

}());