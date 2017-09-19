(function(global, factory) {
    if (typeof global.define === "function" && define.amd) {
        define('calender', ['jquery'], factory);
    } else if (typeof module === "object" && module.exports === "object") {
        module.exports = factory(require('jquery'));
    } else {
        factory(global.jQuery);
    }
})(this, function() {
    var defalutConfig = {
        width: 280,
        height: 365,
        // 默认日期为当前日期
        date: new Date(),
        format: 'yyyy/mm/dd',

        // 一周的第一天
        // 0表示周日，依次类推
        startWeek: 0,
        // 星期格式
        weekArray: ['日', '一', '二', '三', '四', '五', '六'],

        // 设置选择范围
        // 格式：[开始日期, 结束日期]
        // 开始日期为空，则无上限；结束日期为空，则无下限
        // 如设置2015年11月23日以前不可选：[new Date(), null] or ['2015/11/23']
        selectedRang: [null, new Date()],
    };

    //------------------------不变量的统一定义 B -------------------------------------

    //------------------------不变量的统一定义 E -------------------------------------


    // ---------------------- 纯函数的定义 B -----------------------------------------
    /**
     * 判断数据的类型
     * @param {*} val   
     * @param {str} type  
     */
    function checkType(val, type) {
        Object.prototype.toString.call(val) === "[object "+ type +"]"; 
    }
    /**
     * 判断是否是闰年
     * @param {Number} year 
     */
    function isLeep(year) {
        return (year % 100 !== 0 && year % 4 === 0) || (year % 400 === 0);
    }
    /**
     * 获取月份的天数
     * @param {Number} m 月份
     * @param {Number} y 年份
     */
    function getDaysNum(m, y) {
        var num = 31;
        switch(m) {
            case 2:
                num =  isLeep(y) ? 29 : 28;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                num = 30;
                break;
        }
        return num;
    }
    // ---------------------- 纯函数的定义 E -----------------------------------------

    // ---------------------- DOM的相关操作 B ----------------------------------------

    // ---------------------- DOM的相关操作 E ----------------------------------------

    // 日期组件的模板 B
    var calenderTmpl = {
        wrap: function() {
            return '<div id="" class="jedatebox jedateblue" author="chen guojun" jeformat="YYYY-MM-DD hh:mm:ss" jefixed="#refix" style="position: relative; display: block;"></div>';
        },
        title: function() {
            return '<div class="jedatetop">'+
                        '<div class="jedateym" style="width:50%;">'+
                            '<i class="prev triangle monthprev"></i>'+
                            '<span class="jedatemm" ym="12">'+
                                '<em class="jedatemonth" month="9">9月</em>'+
                                '<em class="pndrop"></em>'+
                            '</span>'+
                            '<i class="next triangle monthnext"></i>'+
                        '</div>'+
                        '<div class="jedateym" style="width:50%;">'+
                            '<i class="prev triangle yearprev"></i>'+
                            '<span class="jedateyy" ym="24">'+
                                '<em class="jedateyear" year="2017">2017年</em>'+
                                '<em class="pndrop"></em>'+
                            '</span>'+
                            '<i class="next triangle yearnext"></i>'+
                        '</div>'+
                    '</div>'
        },
        content: function() {

        },
        foot: function() {

        }
    }

    // 日期组件的模板 E

    // --------------------------- 构造函数 B ------------------------------------
    var Calender = function() {

    }

    Calender.prototype = {
        constructor: "Calender",

    }

    // return Calender;
    // --------------------------- 构造函数 E ------------------------------------

    // -------------------------- 使用示例 B -----------------------------------

    // -------------------------- 使用示例 E -----------------------------------
});