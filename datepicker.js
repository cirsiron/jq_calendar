(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('dateSelect', ['jquery'], factory); // 由于已经设置了baseDir
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(global.jQuery);
    }
})(this, function($) {

    //------------------------不变量的统一定义 B -------------------------------------

    //------------------------不变量的统一定义 E -------------------------------------


    // ---------------------- 纯函数的定义 B -----------------------------------------
    /**
     * 将小于10的值改为0x,比如 1 --> 01
     * @param {String} val
     */
    function padding(val) {
        val = parseInt(val);
        if (typeof val === "number" && val.toString() != "NaN") {
            val = val < 10 ? "0" + val : val;
        }
        return val;
    }

    function getUnitDate() {
        return {
            '分': 60,
            '小时': 3600,
            '天': 86400,
            '周': 604800,
            '月': 2592000,
            '年': 31536000,
            '岁': 31536000
        };
    }
    // ---------------------- 纯函数的定义 E -----------------------------------------

    function getNowDate() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return {
            year: year,
            month: padding(month),
            day: padding(day),
            hour: padding(hour),
            minute: padding(minute),
            second: padding(second)
        }
    }

    /**
     * 获取 页面上的日期数据集合
     * @param $this
     * @returns {object}
     */
    var getPageDateData = function($this) {

        var $thisWrapper = $this.parents(".ui-calender-wrapper");
        
        var year = $thisWrapper.find(".jedateyear").text().replace(/年/g, "");
        var day = $this.text() || 1;
        var month = $thisWrapper.find(".jedatemonth").text().replace(/月/g, "");
        if($this.hasClass("bg-blue")) {
            month--;
        }
        if ($this[0].nodeName === "SPAN") {
            day = $thisWrapper.find("td.bg-current").text();
        }
        var hour = $thisWrapper.find(".ui-calender-hms input[data-hms=h]").val();
        var minute = $thisWrapper.find(".ui-calender-hms input[data-hms=m]").val();
        var second = $thisWrapper.find(".ui-calender-hms input[data-hms=s]").val();

        $thisWrapper.fadeOut();
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second
        };
    };
    function transAppropriateTime(secs) {
        var timeNum = getUnitDate();
        if(secs >= timeNum["年"]) {
            return {
                time: secs/timeNum["年"],
                unit: "年"
            }
        }else if(secs >= timeNum["月"]) {
            return {
                time: secs/timeNum["月"],
                unit: "月"
            }
        }else if(secs >= timeNum["周"]) {
            return {
                time: secs/timeNum["周"],
                unit: "周"
            }
        }else if(secs >= timeNum["天"]) {
            return {
                time: secs/timeNum["天"],
                unit: "天"
            }
        }else if(secs >= timeNum["时"]) {
            return {
                time: secs/timeNum["时"],
                unit: "时"
            }
        }else if(secs >= timeNum["分"]) {
            return {
                time: secs/timeNum["分"],
                unit: "分"
            }
        }else if(secs >= timeNum["秒"]) {
            return {
                time: secs/timeNum["秒"],
                unit: "秒"
            }
        }else {
            return {
                time: 0,
                unit: "天"
            }
        }
    }
    // ---------------------- DOM的相关操作 B ----------------------------------------
    /**
     * 设置日期显示input框的值
     * @param _t
     * @param $this
     */
    var setInputVal = function(_t, $this) {
        var time = "";
        if (_t.format && /hh:mm:ss/g.test(_t.format)) {
            time = now.year + "-" + now.month + "-" + now.day + " " + now.hour + ":" + now.minute + ":" + now.second;
        } else {
            time = now.year + "-" + now.month + "-" + now.day;
        }
        var $thisInput = $this.parents('.ui-calender-wrapper').prev(".calender");

        $thisInput.val(time);
    };


    // ---------------------- DOM的相关操作 E ----------------------------------------

    // ----------------------- jq 扩展 B --------------------------------------------
    //  校验input框为数字并且大于0
    $.fn.exceedZero = function() {
        var $input = $(this);
        var inputVal = $input.val();
        if ($(this)[0].nodeName === "INPUT" && (!/\d+/g.test(inputVal) || parseInt(inputVal) <= 0)) {
            $input.val(0);
        }
    };

    // ----------------------- jq 扩展 E --------------------------------------------

    // --------------------------- 构造函数 B ------------------------------------
    function Calender(obj) {
        this.$input = obj.$input;
        this.format = obj.format;
        this.onSelected = obj.onSelected;
    }
    Calender.prototype = {
        constructor: Calender,
        getMonthData: function(year, month) {
            var ret = []; //使用数组来获取一组需要的数据
            if (!year || !month) {
                var now = new Date();
                year = now.getFullYear();
                month = now.getMonth() + 1;
            }
            var firstDay = new Date(year, month - 1, 1);
            year = firstDay.getFullYear();
            month = firstDay.getMonth() + 1;
            var weekNum = firstDay.getDay();
            if (weekNum == 0) {
                weekNum = 7;
            }
            var lastDayOfLastMonth = new Date(year, month - 1, 0);
            var lastDateOfLastMonth = lastDayOfLastMonth.getDate();
            var preMonthCount = firstDay.getDay() - 1; // 第一天需要打头需要空几格
            var lastDay = new Date(year, month, 0);
            var lastDate = lastDay.getDate();
            for (var i = 0; i < 6 * 7; i++) {
                var notCurrentClass = "noop";
                var date = i + 1 - preMonthCount; //
                var showDate = date; //需要显示的日期
                var thisMonth = month; // 当前的月份
                // 上一个月
                if (date <= 0) {
                    notCurrentClass = "bg-blue";
                    thisMonth = month - 1; //月份减一
                    showDate = lastDateOfLastMonth + date;
                } else if (date > lastDate) {
                    // 下一个月
                    notCurrentClass = "bg-blue";
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
                    notCurrentClass: notCurrentClass,
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
        },
        createUI: function(year, month) {
            var dateData = this.getMonthData(year, month);
            this.dateData = dateData;
            var now = getNowDate();
            var monthData = dateData.days;
            month = dateData.month;
            year = dateData.year;
            var html =
                '<div class="jedatetop">' +
                '<div class="jedateym" style="width:50%;">' +
                '<i class="prev triangle ui-calender-mouth-prev">&lt;</i>' +
                '<span class="jedatemm" ym="">' +
                '<em class="jedatemonth" month="">' + month + '月</em>' +
                '<em class="pndrop"></em>' +
                '</span>' +
                '<i class="next triangle ui-calender-mouth-next">&gt;</i>' +
                '</div>' +
                '<div class="jedateym" style="width:50%;">' +
                '<i class="prev triangle ui-calender-year-prev">&lt;</i>' +
                '<span class="jedateyy" ym="">' +
                '<em class="jedateyear" year="">' + year + '年</em>' +
                '<em class="pndrop"></em>' +
                '</span>' +
                '<i class="next triangle ui-calender-year-next">&gt;</i>' +
                '</div>' +
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
                var exceedTime = new Date(year, item.month - 1, item.showDate);
                if (year === now.year && item.month === parseInt(now.month) && now.day === item.showDate) {
                    //  当前时间添加高亮
                    html += '<td class="bg-current" data-month=' + item.month + '>' + item.showDate +
                        '</td>';
                } else if (+exceedTime > +new Date()) {
                    //  越界时间置灰
                    html += '<td class="bg-exceed" data-month=' + item.month + '>' + item.showDate +
                        '</td>';
                } else {
                    html += '<td class=' + item.notCurrentClass + ' data-month=' + item.month + '>' + item.showDate +
                        '</td>';
                }
                if (i % 7 === 6) {
                    // 每周的最后一天
                    html += '</tr>';
                }
            }
            html += '</tbody>' +
                '</table>' +
                '</div>';
            html += '<div class="ui-calender-foot">' +
                '<div class="ui-calender-foot-flex ui-calender-foot-hms-wrapper">' +
                '<ul class="ui-calender-hms">' +
                '<li>' +
                '<input type="number" maxlength="2" value=' + now.hour + ' data-value="" data-hms="h">' +
                '</li><i>:</i>' +
                '<li>' +
                '<input type="number" maxlength="2" value=' + now.minute + ' data-value="" data-hms="m">' +
                '</li><i>:</i>' +
                '<li>' +
                '<input type="number" maxlength="2" value=' + now.second + ' data-value="" data-hms="s">' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="ui-calender-foot-flex jedatebtn">' +
                // '<span class="ui-calender-btn--ok">确定</span>' +
                '<span class="ui-calender-btn--today">今天</span>' +
                '</div>' +
                '</div>';
            return html;
        },
        renderByMonth: function(dire, $thisInput, now) {
            var $input = $thisInput;
            var year, month;
            var dateData = this.dateData;
            if (dateData) {
                year = dateData.year;
                month = dateData.month;
            }
            if (dire === "prev") {
                month--;
            } else if (dire === "next") {
                month++;
            } else if (dire === "now" && now) {
                year = now.year;
                month = now.month;
            }
            var renderHtml = this.createUI(year, month);
            var $wrapper = document.createElement("div");
            $wrapper.className = 'ui-calender-wrapper d-n';
            $wrapper.innerHTML = renderHtml;
            $input.next(".ui-calender-wrapper").remove();
            $input.after($($wrapper));

        },
        renderByYear: function(dire, $thisInput) {
            var $input = $thisInput;
            var year, month;
            var dateData = this.dateData;
            if (dateData) {
                year = dateData.year;
                month = dateData.month;
            }
            if (dire === "prev") {
                year--;
            } else if (dire === "next") {
                year++;
            }
            var renderHtml = this.createUI(year, month);
            var $wrapper = document.createElement("div");
            $wrapper.className = 'ui-calender-wrapper';
            $wrapper.innerHTML = renderHtml;
            $input.next(".ui-calender-wrapper").remove();
            $input.after($($wrapper));
        },
        addEvent: function() {
            var _t = this;
            var $content = this.$input.parent() || $("body");
            $content.off("click.calender propertychange.calender input.calender");
            $content.on("click", function(e) {
                e.stopPropagation();
            });
            $content.on("click.calender", ".ui-calender-mouth-prev", function() {
                var $thisInput = $(this).parents('.ui-calender-wrapper').prev(".calender");
                _t.renderByMonth("prev", $thisInput);
                $thisInput.next(".ui-calender-wrapper").show();
            });
            $content.on("click.calender", ".ui-calender-mouth-next", function() {
                var $thisInput = $(this).parents('.ui-calender-wrapper').prev(".calender");
                _t.renderByMonth("next", $thisInput);
                $thisInput.next(".ui-calender-wrapper").show();
            });
            $content.on("click.calender", ".ui-calender-year-prev", function() {
                var $thisInput = $(this).parents('.ui-calender-wrapper').prev(".calender");
                _t.renderByYear("prev", $thisInput);
            });
            $content.on("click.calender", ".ui-calender-year-next", function() {
                var $thisInput = $(this).parents('.ui-calender-wrapper').prev(".calender");
                _t.renderByYear("next", $thisInput);
            });
            
            
            $content.on("click.calender", ".ui-calender-wrapper tbody td", function() {
                var $this = $(this);
                if ($this.hasClass("bg-exceed")) {
                    return;
                }
                
                $this.parents("table").find("td").removeClass("bg-current");
                $this.addClass("bg-current");
                var timeObj = getPageDateData($this);
                timeObj._t = this;
                // _t.setCalenderInputVal($thisWrapper, timeObj);
                typeof _t.onSelected === "function" && _t.onSelected(timeObj);
            });
            // $content.on("click.calender", ".ui-calender-btn--today", function() {
            //     var $this = $(this);
            //     var now = getNowDate();
            //     var $thisInput = $this.parents('.ui-calender-wrapper').prev(".calender");
            //     _t.renderByMonth("now", $thisInput, now);
            //
            //     var tempArr = [now.hour, now.minute, now.second];
            //     var $inputs = $this.parents(".ui-calender-foot").find(".ui-calender-hms li input");
            //     for (var i = 0, arrLen = tempArr.length; i < arrLen; i++) {
            //         var tempItem = tempArr[i];
            //         $inputs.eq(i).val(tempItem);
            //     }
            //     $thisInput.parent().children(".ui-calender-wrapper").show();
            // });
            $content.on("click.calender", ".ui-calender-btn--today", function() {
                var $this = $(this);
                var $thisWrapper = $this.parents(".ui-calender-wrapper");
                var timeObj = getPageDateData($this);
                timeObj._t = this;
                // _t.setCalenderInputVal($thisWrapper, now);
                $thisWrapper.fadeOut();
                typeof _t.onSelected === "function" && _t.onSelected(timeObj);
            });
            // 时分秒限制
            $content.on("click.calender propertychange.calender input.calender", "[data-hms=h]", function() {
                var $input = $(this);
                var inputVal = $input.val();
                if ($input[0].nodeName === "INPUT" && (!/\d+/g.test(inputVal) || parseInt(inputVal) <= 0)) {
                    $input.val("00");
                } else if (parseInt(inputVal) > 24) {
                    $input.val(24);
                } else if (parseInt(inputVal) < 10) {
                    $input.val("0" + parseInt(inputVal));
                }
            });
            $content.on("click.calender propertychange.calender input.calender", "[data-hms=m]", function() {
                var $input = $(this);
                var inputVal = $input.val();
                if ($input[0].nodeName === "INPUT" && (!/\d+/g.test(inputVal) || parseInt(inputVal) <= 0)) {
                    $input.val("00");
                } else if (parseInt(inputVal) >= 60) {
                    $input.val(59);
                } else if (parseInt(inputVal) < 10) {
                    $input.val("0" + parseInt(inputVal));
                }
            });
            $content.on("click.calender propertychange.calender input.calender", "[data-hms=s]", function() {
                var $input = $(this);
                var inputVal = $input.val();
                if ($input[0].nodeName === "INPUT" && (!/\d+/g.test(inputVal) || parseInt(inputVal) <= 0)) {
                    $input.val("00");
                } else if (parseInt(inputVal) >= 60) {
                    $input.val(59);
                } else if (parseInt(inputVal) < 10) {
                    $input.val("0" + parseInt(inputVal));
                }
            });
            $content.on("mouseleave", function () {
                var $this = $(this);
                $this.find(".ui-calender-wrapper").fadeOut();
            });

        },
        /**
         * 设置input时间框的值
         * @param {Object} obj 
         * @param {*}  $thisWrapper
         * @param {*}  formatDateObj
         */
        setCalenderInputVal: function($thisWrapper, formatDateObj) {
            var year = formatDateObj.year;
            var month = formatDateObj.month;
            var day = formatDateObj.day;
            var time = "";
            var $hms = $thisWrapper.find(".ui-calender-hms");
            if (this.format && /hh:mm:ss/g.test(this.format)) {
                var hour = $hms.find("input[data-hms=h]").val();
                var minute = $hms.find("input[data-hms=m]").val();
                var second = $hms.find("input[data-hms=s]").val();
                time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
                $thisWrapper.prev("input.calender").val(time);
            } else {
                time = year + "-" + month + "-" + day;
                $thisWrapper.prev("input.calender").val(time);
            }
            $thisWrapper.fadeOut();
        },
        init: function() {
            var $input = $(this.$input);
            var _t = this;

            function transTime(time, unit) {
                var objDateCount = getUnitDate();
                var now = new Date();
                var count = +now - time * (objDateCount[unit] * 1000);
                return new Date(count);
            }
            $input.on("click", function() {
                var $this = $(this);
                var $content = $this.parents(".date-icon-wrapper").prev(".date-content");
                var time = $content.find(".data-content__switch--long>input.date-content__input").val();
                var unit = $content.find(".data-content__switch--long>.select>input").val();
                var newCurrent = transTime(time, unit);
                _t.renderByMonth("now", $this, {
                    "year": newCurrent.getFullYear(),
                    "month": newCurrent.getMonth() + 1
                });
                // 隐藏其他的日期元素
                var $currentForm = $this.parents(".symptom-form");
                $currentForm.find(".ui-calender-wrapper").hide();
                
                var $currentWrapper = $(this).next(".ui-calender-wrapper");
                $currentWrapper.eq(0).fadeIn();
            });
            //  添加事件
            this.addEvent();
        }
    };
    // window.Calender = Calender;
    // --------------------------- 构造函数 E ------------------------------------

    // -------------------------- 使用示例 B -----------------------------------
    // -------------------------- 使用示例 E -----------------------------------

    return {
        Calender: Calender,
        transAppropriateTime: transAppropriateTime
    };
});