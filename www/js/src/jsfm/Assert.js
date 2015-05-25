/**
 * @class Assert
 */
fm.Package("jsfm");
fm.Class("Assert");
jsfm.Assert = function (me) {
    'use strict';
    this.setMe = function (_me) {
        me = _me;
    };

    /**
     * Throw exception if condition fail
     * @method isLessOrEqual
     * @param  {Number}  num1 this number must be less than or equal to num2
     * @param  {Number}  num2
     * @return
     */
    var disableErrorHandling = false;

    function assignValue(data) {
        if (data == undefined) {
            return ""
        }
        return data;
    }

    Static.isValidDate = function (date, name) {
        date = assignValue(date);
        if ((date.split(" ").length < 3 && date.split("-").length < 3) || !(this.isNumber(new Date(date).getTime(), name))) {
            throwException(name, "Date is not valid");
        }
    };

    Static.disableErrorHandling = function () {
        disableErrorHandling = true;
    };

    Static.throwError = function (name, message) {
        throwException(name, message);
    }

    function throwException(name, message) {
        if (!disableErrorHandling) {
            throw new JsfmException(name, message);
        }
    }

    Static.isLessOrEqual = function (num1, num2, name, e) {
        if (parseFloat(num1) > parseFloat(num2)) {
            throwException(name, e || (name + " can not be greater than " + num2));
        }
        return num1;
    };

    Static.isGreaterThan = function (num1, num2, name, e) {
        if (parseFloat(num1) < parseFloat(num2)) {
            throwException(name, e || (name + " can not be less than " + num2));
        }
        return num1;
    };

    Static.isNotEmpty = function (num, name) {
        if (!(num + "").length) {
            throwException(name, "This field can not be empty!");
        }
        return num;
    };

    /**
     * Throw exception if condition fails
     * @method isNumber
     * @param  {Number}  num this must be a number
     */


    Static.isNumber = function (num, name, e) {
        this.isNotEmpty(num, name);
        if (isNaN(num) || num === null) {
            throwException(name, e || "Only number is allowed!");
        }
        return num;
    };

    Static.isUndefinedOrNumber = function (num, name, e) {
        if (num) {
            me.isNumber(num, name, e);
        }
        return false;
    }

    /**
     * Throw exception if condition fails
     * @method isInteger
     * @param  {Number}  num this must be an integer
     */

    Static.isInteger = function (num, name, e) {
        this.isNotEmpty(num, name);
        this.isNumber(num, name);
        if (parseInt(num, 10) != num) {
            throwException(name, e || "Only integer is allowed!");
        }
        return num;
    };

    Static.isUndefinedOrInteger = function (num, name, e) {
        if (num) {
            me.isInteger(num, name, e);
        }
        return false;
    }

    /**
     * This method check if length of string is more than lenSize
     * @method lengthMoreThan
     * @param {String} str
     * @param {Number} lenSize
     */

    Static.lengthMoreThan = function (str, lenSize, name, e) {
        str = assignValue(str);
        if (str.length <= lenSize) {
            throwException(name, e || ("Length must be greater than " + lenSize));
        }
        return str;
    };

    /**
     * throw exception if first parameter is not an Object
     * @param  {Object}  obj
     * @param  {String}  name
     * @param  {String}  e
     */
    Static.validateObject = function (obj, name, e) {
        if (!(obj instanceof Object)) {
            throwException(name, e || "is not an object");
        }
    };


    Static.isPositiveNum = function (num, name, e) {
        this.isNumber(num, name, e);
        if (num < 0) {
            throwException(name, e || "Only postive values are allowed.");
        }
        return num;
    };

    Static.validateURL = function (url, name, e){
        var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
        if(!myRegExp.test(url)) {
            throwException(name, e || "Invalid url");
        }
    };

    Static.startLessThanEnd = function (start, end, name, e) {
        if(end < start) {
            throwException(name, e || "Start can't be more than End");
        }
    };
};

function JsfmException(name, message) {
    this[name] = message;
    this.toString = function () {
        return name + " " + message;
    };
}
JsfmException.prototype = new Error;