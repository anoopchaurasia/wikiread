/**
 * @class Utility
 * @description Utility class
 */
fm.Package("jsfm");
fm.Include("lib.dateformat");
fm.Class("Utility");
jsfm.Utility = function (me) {

    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };
    Static.getInt = function (a, deft) {
        if (a) {
            return parseInt(a, 10);
        }
        return deft || 0;
    };

    Static.daysBetween = function (date1, date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }

    Static.getFloat = function (a) {
        if (a) {
            return parseFloat(a);
        }
        return 0.00;
    };

    Static.isValidEmail = function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            return true;
        }
        return false;
    };

    Static.UTCtoLocal = function (date) {
        var date = this.parseDate(date);
        var offset = -date.getTimezoneOffset();
        return new Date(date.getTime() + offset * 60 * 1000);
    };

    Static.parseFloat = function (a, decimal_point) {
        if (a) {
            decimal_point = decimal_point == undefined ? 2 : decimal_point;
            return parseFloat(a).toFixed(decimal_point);
        }
        return 0.00;
    };


    Static.truncateString = function (str, len, appendStr) {
        str = str + "";
        len = len || 20;
        appendStr = appendStr || "...";
        if (str.length > len) {
            str = str.substring(0, len) + appendStr;
        }
        return str;
    };

    Static.changeAMPM = function (val) {
        if (val == 12) return 12 + " pm";
        if (val > 12) return (val % 12) + " pm";
        if (val == 0) return 12 + " am";
        return val + " am";
    }

    Static.getCurrentDateTimeWithZeroSeconds = function () {
        return (new Date()).format("yyyy-mm-dd HH:MM:00");
    };

    Static.getCurrentDate = function () {
        return (new Date()).format("yyyy-mm-dd");
    };

    Static.getServerFormatDate = function (date) {
        if(!date) {
            return date;
        }
       return me.parseDate(date).format("yyyy-mm-dd");
    };

    Static.getClientFormatDate = function (date) {
       return me.parseDate(date).format("dd mmm yyyy");
    };

    Static.getClientFormatDateTime = function (date) {
        return me.parseDate(date).format("dd mmm yyyy hh:MM TT");
    };

    Static.getHours = function (time) {
        time = time || (new Date());
        return me.parseDate(time).format("h");
    };

    Static.getMinutes = function (time) {
        time = time || (new Date());
        return me.parseDate(time).format("MM");
    };

    Static.getMeridian = function (time) {
        time = time || (new Date());
        return me.parseDate(time).format("TT");
    };

    Static.twelveTo24Hours = function (time, meridian) {
        var time = parseInt(time, 10);
        if (meridian.toUpperCase() === "PM") {
            if (time !== 12) {
                time += 12;
            }
        } else if (meridian.toUpperCase() === "AM" && time === 12) {
            time = 0;
        }
        return time;
    }

    Static.parseTime = function (d) {
        if (typeof d === 'string') {
            var time = d.split(":");
            return new Date(0, 0, 0, time[0], time[1], time[2]);
        }
    };

    Static.parseDate = function (d) {
        if (d instanceof Date) return new Date(d);
        if (!isNaN(d)) return new Date(parseInt(d));
        if (typeof d === 'string') {
            var a = d.split(" ");
            if (a.length === 3) {
                if (isNaN(a[1])) {
                    return new Date(Date.parse(d));
                }
                return new Date(a[2], a[1] - 1, a[0]);
            }
            var date = a[0].split("-"),
                time = [0, 0, 0];
            if (a.length === 2) {
                time = a[1].split(":");
            }
            return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
        }
    };

    Static.dayDiff = function (date1, date2) {
        return ((date1 - date2) / (1000 * 60 * 60 * 24));
    };

    Static.getIdList = function (items) {
        var arr = [];
        for (var i = 0; items && i < items.length; i++) {
            arr.push(items[i].id);
        };
        return arr;
    };

    Static.getBool = function (val, dflt) {
        var val = (val === undefined ? dflt : val);
        return val === 'true' || val === true ? true : false;
    };

    Static.getTimeDiffInMinutes = function (start, end) {
        var startTime = Date.parse(start);
        return Math.floor(this.getTimeDiffInSeconds(startTime, end) / 60);
    };

    Static.getTimeDiffInSeconds = function (start, end){
        return  Math.floor((end.getTime() - start.getTime()) / 1000);
    };


    Static.getFormatedTimeDiff = function (start, end) {
        if (!start) return;
        var timediff = this.getTimeDiffInMinutes(start, end);
        return this.getFormatedTime(timediff);
    };

    Static.getTimeInHoursAndMinutes = function (ms) {
        var time = '';
        ms = parseInt(ms / (1000 * 60), 10);
        var hours = parseInt(ms / 60, 10);
        var mins = ms % 60;
        if (hours) time += hours + ' hours';
        if (hours && mins) time += ' ';
        if (mins) time += mins + ' minutes';
        return time;
    }

    Static.isTimeConflict = function (t_range1, t_range2) {
        return (t_range2.t1 >= t_range1.t1 && t_range2.t2 <= t_range1.t2) || (t_range2.t1 <= t_range1.t1 && t_range2.t2 > t_range1.t1) || (t_range2.t1 < t_range1.t2 && t_range2.t2 >= t_range1.t2);
    };

    Static.getFormatedTime = function (timediff) {
        var day = timediff >= 1440 ? Math.floor(timediff / 1440) : 0;
        timediff = timediff % 1440;
        var h = timediff >= 60 ? Math.floor(timediff / 60) : 0;
        var m = Math.floor(timediff % 60);
        var text = "";
        if (day > 0) {
            text += day + " day";
            if (day > 1) {
                text += "s";
            }
            text += " ";
        }
        if (h > 0) {
            text += h + " hr";
            if (h > 1) {
                text += "s";
            }
            text += " ";
        }
        if (!day)
            text += m + " mins";
        return text;
    };

    Static.isTodayDate = function (d) {
        return Date.parse(d).format('dd-mm-yyyy') === (new Date()).format('dd-mm-yyyy');
    };

    Static.getTwoDigit = function (val) {
        val = "" + val + "";
        if (val.length == 1) {
            val = "0" + val;
        }
        return val;
    };

    Static.getArrayOfKey = function (arr, key) {
        var flat = [];
        arr.forEach(function (a) {
            flat.push(a[key]);
        });
        return flat;
    };

    Static.pushArray = function (arr, append) {
        Array.prototype.push.apply(arr, append);
    };

    Static.bytesToSize = function (bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };

    Static.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    Static.searchQuery = function (name, type){
        var geg = RegExp("(\\?|&)"+name +"=(.*?)($|&)");
        var search = location.hash.substring(location.hash.indexOf("?"));
        var result = (search.match(geg) || [])[2] || "";
        if(result) {
            result = decodeURIComponent(result);
        }
        switch (type) {
            case 'int':
                if (result) {
                    return parseInt(result, 10);
                }
                return null;
            case 'bool':
                if(result === 'true') {
                    return true;
                } else if (result === 'false') {
                    return false;
                }
                return null;
            case 'array':
                if (result) {
                    return result.split(",");
                }
                return [];
            default:
                return result;
        }
    };

    Static.isEmptyObject = function (obj) {
        for (var k in obj){
            return false;
        }
        return true;
    }

    Static.removeDuplicate = function (arr) {
        var exist = {};
        return arr.filter(function(item){
            if(exist[item]) return false;
            exist[item]=true;
            return true;
        });
    };

    Static.toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    Static.getDiffObject = function (obj1, obj2) {

        if(!obj2) {
            return obj1;
        }
        var newObj = {};
        for(var k in obj2) {
            if(obj1[k] != obj2[k]){
                newObj[k] = obj2[k];
            }
        }
        for(var k in obj1) {
            if(obj1[k] != obj2[k]){
                newObj[k] = obj1[k];
            }
        }
        return newObj;
    };
    Static.timeElapsed = function () {
        var t = new Date().getTime();
        return function (){
            alert(new Date().getTime() - t);
        }
    };

};