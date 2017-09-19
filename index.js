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
        Object.prototype.toString.call(val) === "[object " + type + "]";
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
        switch (m) {
            case 2:
                num = isLeep(y) ? 29 : 28;
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

    var calenderFn = {};
    calenderFn.getMonthData = function(year, month) {
        var ret = []; //使用数组来获取一组需要的数据

        if (!year || !month) {
            var now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
        }
        var firstDay = new Date(year, month - 1, 1);
        year = firstDay.getFullYear();
        month = firstDay.getMonth() + 1;
        var weekNum = firstDay.getDay();
        if (weekNum === 0) {
            weekNum = 7;
        }
        var lastDayOfLastMonth = new Date(year, month - 1, 0);
        var lastDateOfLastMonth = lastDayOfLastMonth.getDate();
        var preMonthCount = firstDay.getDay() - 1; // 第一天需要打头需要空几格
        var lastDay = new Date(year, month, 0);
        var lastDate = lastDay.getDate();
        for (var i = 0; i < 6 * 7; i++) {

            var date = i + 1 - preMonthCount; //
            var showDate = date; //需要显示的日期
            var thisMonth = month; // 当前的月份
            // 上一个月
            if (date <= 0) {
                thisMonth = month - 1; //月份减一
                showDate = lastDateOfLastMonth + date;
            } else if (date > lastDate) {
                // 下一个月
                thisMonth = month + 1; // 月份加一
                showDate = showDate - lastDate;
            }
            if (thisMonth === 0) {
                thisMonth = 12;
            }
            if (thisMonth === 13) {
                thisMonth = 1;
            }
            ret.push({
                month: thisMonth,
                date: date,
                showDate: showDate
            });
        }
        return {
            year: year,
            month: month,
            days: ret
        };
    }
    var dateData = null;
    // 日期组件的模板
    calenderFn.createUI = function(year, month) {
        dateData = calenderFn.getMonthData(year, month);
        var monthData = dateData.days;
        var month = dateData.month;
        var year = dateData.year;
        var html = '<div class="ui-calender-title">' +
            '<a href="#" class="ui-calender-btn ui-canlender-prev">&lt;</a>' +
            '<a href="#" class="ui-calender-btn ui-calender-next">&gt;</a>' +
            '<span class="ui-calender-cur-month">' + year + '-' + month +
            '</span>' +
            '</div>' +
            '<div class="ui-calender-content">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '<th>日</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        for (var i = 0, monLen = monthData.length; i < monLen; i++) {
            var item = monthData[i];
            if (i % 7 === 0) {
                // 每周的第一天
                html += '<tr>';
            }
            console.log(item);
            html += '<td data-month=' + item.month + '>' + item.showDate +
                '</td>'
            if (i % 7 === 6) {
                // 每周的最后一天
                html += '</tr>';
            }
        };
        html += '</tbody>' +
            '</table>' +
            '</div>';
        return html;
    }
    var $wrapper
    calenderFn.render = function(dire, $input) {
        var year, month;
        if (dateData) {
            year = dateData.year;
            month = dateData.month;
        }
        if (dire === "prev") {
            month--;
        } else if (dire === "next") {
            month++;
        }
        var renderHtml = calenderFn.createUI(year, month);
        $wrapper = document.createElement("div");
        $wrapper.className = 'ui-calender-wrapper';
        $wrapper.innerHTML = renderHtml;
        $($input).after($($wrapper));
    }
    calenderFn.init = function($input) {
        calenderFn.render(null, $input);

        $($input).on("click", function() {
            var left = $($input).offset().left;
            var top = $($input).offset().top;
            var height = $($input).height();
            $($wrapper).css({
                "top": top + height + 2,
                "left": left
            });
            $($wrapper).show();
        });
        $($wrapper).on("click", ".ui-canlender-prev", function() {
            calenderFn.render("prev", $input);
        });
        $($wrapper).on("click", ".ui-canlender-next", function() {
            calenderFn.render("next", $input);
        });
    };
    window.calenderFn = calenderFn;
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
