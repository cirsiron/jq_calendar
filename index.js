(function(global, factory) {
    if (typeof global.define === "function" && define.amd) {
        define('calender', ['jquery'], factory);
    } else if (typeof module === "object" && module.exports === "object") {
        module.exports = factory(require('jquery'));
    } else {
        factory(global.jQuery);
    }
})(this, function() {

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
     * 
     */
    function padding(val) {
        val = parseInt(val);
        if(typeof  val === "number" && val != NaN) {
            val =  val < 10 ? "0" + val : val;
        }
        return val;
    }
    // ---------------------- 纯函数的定义 E -----------------------------------------

    function getNowDate() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth()+1;
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
     * 设置input时间框的值
     * @param {Object} obj 
     * @param {*}  $thisWrapper
     */
    function setCalenderInputVal(obj, $thisWrapper, formatDateObj) {
        var year = formatDateObj.year;
        var month = formatDateObj.month;
        var day = formatDateObj.day;
        var $hms = $thisWrapper.find(".ui-calender-hms");
        if(obj.format && /hh:mm:ss/g.test(obj.format)) {
            var hour = $hms.find("input[data-hms=h]").val();
            var minute= $hms.find("input[data-hms=m]").val();
            var second= $hms.find("input[data-hms=s]").val();
            var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            $thisWrapper.prev("input.calender").val(time);
        }else {
            var time = year + "-" + month + "-" + day;
            $thisWrapper.prev("input.calender").val(time);
        }
        $thisWrapper.fadeOut();
    }
    // ---------------------- DOM的相关操作 B ----------------------------------------
    var _onClickMonthPrev = function() {
        var $thisInput = $(this).parents('.ui-calender-wrapper').prev(".calender");
        calenderFn.renderByMonth("prev", $thisInput);
        $thisInput.next(".ui-calender-wrapper").show();
    };
    var _onClickMonthNext = function() {
        var $thisInput = $(this).parents('.ui-calender-wrapper').prev(".calender");
        calenderFn.renderByMonth("next", $thisInput);
        $thisInput.next(".ui-calender-wrapper").show();
    };
    var _onClickYearPrev = function() {
        var $thisInput = $(this).parents('.ui-calender-wrapper').prev(".calender");
        calenderFn.renderByYear("prev", $thisInput);
    }
    var _onClickYearNext = function() {
        var $thisInput = $(this).parents('.ui-calender-wrapper').prev(".calender");
        calenderFn.renderByYear("next", $thisInput);
    }
    var _onClickToday = function() {
        var $this =$(this);
        var tempArr = [];
        var now = getNowDate();
        obj = addEvent.obj;
        var time = "";
        if(obj.format && /hh:mm:ss/g.test(obj.format)) {
            time = now.year + "-" + now.month + "-" + now.day + " " + now.hour + ":" + now.minute +":"+ now.second;
        }else {
            time = now.year + "-" + now.month + "-" + now.day;
        }
        var $thisInput = $this.parents('.ui-calender-wrapper').prev(".calender");
        
        $thisInput.val(time);
        tempArr = [now.hour, now.minute, now.second];
        var $inputs = $this.parents(".ui-calender-foot").find(".ui-calender-hms li input");
        for(var i = 0, arrLen = tempArr.length; i < arrLen; i++) {
            var tempItem = tempArr[i];
            $inputs.eq(i).val(tempItem);
        }
    }
    var _onClickBtnOk = function() {
        var $this = $(this);
        obj = addEvent.obj;
        var $thisWrapper = $this.parents(".ui-calender-wrapper");
        var now = getNowDate();
        setCalenderInputVal(obj, $thisWrapper, now);
    }
    var _onSelected = function() {
        var $this = $(this);
        if($this.hasClass("bg-exceed")) {
            return;
        }
        obj = addEvent.obj;
        var $thisWrapper = $this.parents(".ui-calender-wrapper");
        var year = $thisWrapper.find(".jedateyear").text().replace(/年/g,"");
        var month = $this.attr("data-month");
        var day = $this.text();
        var hour = $thisWrapper.find(".ui-calender-hms input[data-hms=h]").val();
        var minute = $thisWrapper.find(".ui-calender-hms input[data-hms=m]").val();
        var second = $thisWrapper.find(".ui-calender-hms input[data-hms=s]").val();
        var timeObj = {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second
        };
        setCalenderInputVal(obj, $thisWrapper, timeObj);
        typeof obj.onSelected === "function" && obj.onSelected(timeObj);
    }
    /**
     * 给生成的元素添加事件
     * @param {Object} obj 
     */
    function addEvent(obj) {
        $body = obj.$content || $("body");
        addEvent.obj = obj;
        $body.off("click.calender")
        $body.on("click.calender", ".ui-calender-mouth-prev", _onClickMonthPrev);
        $body.on("click.calender", ".ui-calender-mouth-next", _onClickMonthNext);
        $body.on("click.calender", ".ui-calender-year-prev", _onClickYearPrev);
        $body.on("click.calender", ".ui-calender-year-next", _onClickYearNext);
        $body.on("click.calender", ".ui-calender-wrapper tbody td", _onSelected);
        $body.on("click.calender", ".ui-calender-btn--today", _onClickToday);
        $body.on("click.calender", ".ui-calender-btn--ok", _onClickBtnOk);
    }
    // ---------------------- DOM的相关操作 E ----------------------------------------

    // ----------------------- jq 扩展 B --------------------------------------------
    //  校验input框为数字并且大于0
    $.fn.exceedZero = function() {
        var $input =$(this);
        var inputVal = $input.val();
        if($(this)[0].nodeName === "INPUT" &&  (!/\d+/g.test(inputVal) || parseInt(inputVal)<=0) ) {
            $input.val(0);
        }
    }
    // ----------------------- jq 扩展 E --------------------------------------------

    // --------------------------- 构造函数 B ------------------------------------
    function Calender() {

    }
    Calender.prototype = {
        constructor: Calender,
        getMonthData: function(year, month) {
            var ret = []; //使用数组来获取一组需要的数据
            if (!year || !month) {
                var now = new Date();
                year = now.getFullYear();
                month = now.getMonth()+1;
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
                var notCurrentClass= "noop";
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
        createUI: function(year, month, exceedTime) {
            var dateData = this.getMonthData(year, month);
            this.dateData = dateData;
            var now = getNowDate();
            var monthData = dateData.days;
            var month = dateData.month;
            var year = dateData.year;
            var html = 
                '<div class="jedatetop">' +
                '<div class="jedateym" style="width:50%;">'+
                '<i class="prev triangle ui-calender-mouth-prev">&lt;</i>'+
                '<span class="jedatemm" ym="12">'+
                '<em class="jedatemonth" month="9">'+ month +'月</em>'+
                '<em class="pndrop"></em>'+
                '</span>'+
                '<i class="next triangle ui-calender-mouth-next">&gt;</i>'+
                '</div>'+
                '<div class="jedateym" style="width:50%;">'+
                '<i class="prev triangle ui-calender-year-prev">&lt;</i>'+
                '<span class="jedateyy" ym="24">'+
                '<em class="jedateyear" year="2017">'+ year +'年</em>'+
                '<em class="pndrop"></em>'+
                '</span>'+
                '<i class="next triangle ui-calender-year-next">&gt;</i>'+
                '</div>'+   
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
                var exceedTime = new Date(year, item.month-1, item.showDate);
                if(year === now.year && item.month === parseInt(now.month) && now.day === item.showDate) {
                     //  当前时间添加高亮
                    html += '<td class="bg-current" data-month=' + item.month + '>' + item.showDate +
                    '</td>';
                }else if(+exceedTime > +new Date()) {
                    //  越界时间置灰
                    html += '<td class="bg-exceed" data-month=' + item.month + '>' + item.showDate +
                    '</td>';
                }else {
                    html += '<td class='+ item.notCurrentClass +' data-month=' + item.month + '>' + item.showDate +
                    '</td>';
                }
                if (i % 7 === 6) {
                    // 每周的最后一天
                    html += '</tr>';
                }
            };
            html += '</tbody>' +
                '</table>' +
                '</div>';
            html += '<div class="ui-calender-foot">'+
                    '<div class="ui-calender-foot-flex">'+
                        '<ul class="ui-calender-hms">'+
                            '<li>'+
                                '<input type="text" maxlength="2" value='+ now.hour +' data-value="" data-hms="h">'+
                            '</li><i>:</i>'+
                            '<li>'+
                                '<input type="text" maxlength="2" value='+ now.minute +' data-value="" data-hms="m">'+
                            '</li><i>:</i>'+
                            '<li>'+
                                '<input type="text" maxlength="2" value='+ now.second +' data-value="" data-hms="s">'+
                            '</li>'+
                        '</ul>'+
                    '</div>'+
                    '<div class="ui-calender-foot-flex jedatebtn">'+
                        '<span class="ui-calender-btn--ok">确定</span>'+
                        '<span class="ui-calender-btn--today">今天</span>'+
                        '<span class="ui-calender-btn--clear">清空</span>'+
                    '</div>'+
                '</div>';
            return html;
        },
        renderByMonth: function(dire, $input) {
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
            }
            var renderHtml = this.createUI(year, month);
            $wrapper = document.createElement("div");
            $wrapper.className = 'ui-calender-wrapper d-n';
            $wrapper.innerHTML = renderHtml;
            $($input).next(".ui-calender-wrapper").remove();
            $($input).after($($wrapper));
        },
        renderByYear: function(dire, $input) {
            var year, month;
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
            $wrapper = document.createElement("div");
            $wrapper.className = 'ui-calender-wrapper';
            $wrapper.innerHTML = renderHtml;
            $($input).next(".ui-calender-wrapper").remove();
            $($input).after($($wrapper));
        },
        init: function(obj) {
            var $input = $(obj.$input);
            this.renderByMonth(null, $input);
            $input.on("click", function() {
                var left = $input.offset().left;
                var top = $input.offset().top;
                var height = $input.height();
                var $currentWrapper = $(this).next(".ui-calender-wrapper");
                $currentWrapper.css({
                    left: left,
                    top: top + height + 12
                })
                $currentWrapper.eq(0).fadeIn();
            });
            //  添加事件
            addEvent(obj);
        }
    }
    window.Calender = Calender;
    // return ;
    // --------------------------- 构造函数 E ------------------------------------

    // -------------------------- 使用示例 B -----------------------------------
    // -------------------------- 使用示例 E -----------------------------------

    return {
        Calender: Calender
    }
});
