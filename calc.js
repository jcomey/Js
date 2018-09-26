$(function() {
    var msg = {
        "0001": "通用应答消息",
        "0002": "客户端心跳",
        "0003": "终端注销",
        "0100": "终端注册",
        "0102": "终端鉴权",
        "01F0": "平台登录请求",
        "8100": "终端注册应答",
        "8103": "设置终端参数",
        "8104": "查询终端参数",
        "8106": "查询指定终端参数",
        "81F0": "平台登录应答",
        "01F1": "平台登出请求消息",
        "0104": "查询终端参数应答",
        "0200": "位置信息汇报",
        "8201": "位置信息查询",
        "0201": "位置信息查询应答",
        "8202": "临时位置跟踪控制",
        "8001": "服务器端通用应答",
        "8003": "补传分包请求",
        "8105": "终端控制",
        "0101": "上报教练员登录",
        "8101": "教练员登录应答",
        "8102": "上报教练员登出",
        "0201": "上报学员登录",
        "8201": "学员登录应答",
        "0202": "上报学员登出",
        "8202": "上报学员登出应答",
        "0203": "上报学时",
        "8205": "命令上报学时记录",
        "0205": "命令上报学时记录应答",
        "8301": "立即拍照",
        "0301": "立即拍照应答",
        "8900": "数据下行透传",
        "0900": "数据上行透传",
        "8302": "查询照片",
        "0302": "查询照片应答",
        "0303": "上传照片查询结果",
        "8303": "上传照片查询结果应答",
        "8304": "上传指定照片",
        "0304": "上传指定照片应答",
        "0305": "上传照片初始化",
        "8305": "上传照片初始化应答",
        "0306": "上传照片数据包",
        "8501": "设置计时终端应用参数",
        "0501": "设置计时终端应用参数应答",
        "8502": "设置禁训状态",
        "0502": "设置禁训状态应答",
        "8503": "查询计时终端应用参数",
        "0503": "查询计时终端应用参数应答",
        "0401": "请求身份认证信息",
        "0402": "请求统一编号信息",
        "8402": "请求统一编号信息应答",
        "0403": "上报车辆绑定信息",
        "8403": "上报车辆绑定信息应答",
    }
    var reg = /\d{2}/gi; //分割2位数字正则17 09 21 08 32 29
    $("[copy]").click(function() {
        var copy = $(this).attr("copy");
        $(copy).focus();
        $(copy).select();
        document.execCommand("Copy", false, null);
    }); //复制按钮功能
    $('.input-text').keyup(function() {
        var regx = /(\w+)\s(\w+)/;
        var data = $(this).val().replace(/\s/gi, '').replace(/7D02/gi, '7E').replace(/7D01/gi, '7D'); //去空格 
        // var data =  orgCode.replace(/7D02/gi,'7E');//反转义 7d02>7e,7d01>7d
        $(this).val(data);
        var cmpdata = data;
        $('.dia-block').empty();
        $('.all').text(data.length); //命令长度位数
        analysis(data); //输出结果
        shows(data); //展示消息头+消息位数据
        getTxtCursorPosition();
        return data;
    });
    $('.input-text').click(function() {
        getTxtCursorPosition();
    });

    function hex2a(input, output) {
        var hex = input.toString();
        for (var i = 0; i < hex.length; i += 2) {
            output += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return output;
    } //转换成ASCII
    function analysis(data) {
        var msgid = data.slice(4, 8);
        var reldata = data.slice(34, data.length - 4);
        var submsgid = reldata.slice(2, 6); //透传消息对应消息ID
        var strCode = reldata.slice(14, 46); //获取16位计时终端编号hex
        var strDate = reldata.slice(86, 98); //6位时间码BCD[6]hex
        var strSerial = reldata.slice(98, 106); //4位序列号        
        var outCode = '';
        var outDate = '';
        var outSerial = '';
        $('.console').html("消息id:0x" + msgid + "::" + '<b style=\' color:#08e\'>' + msg[msgid] + '</b>');
        //显示消息体ID对应的名称
        switch (msgid) {
            case "0001":
                break;
            case "0100":
                $('.trans-data').html("<br/>" + "省域ID：" + reldata.slice(46, 54) + "<br/>" + "数据内容：" + reldata.slice(54, 62));
                break;
            case '0102':
                $('.trans-data').html("<br/>" + "时间戳：" + parseInt(reldata.slice(0, 8), 16) + "<br/>加密256byte：<p>" + reldata.slice(8, reldata.length) + "</p>");
                break
            case '0200':
                var warn = reldata.slice(0, 8); //报警标识
                var state = reldata.slice(8, 16); //状态标识
                var latitude = parseInt(reldata.slice(16, 24), 16) / 1000000; //坐标维度
                var longitude = parseInt(reldata.slice(24, 32), 16) / 1000000; //坐标经度
                var speed = parseInt(reldata.slice(32, 36), 16) / 10;
                var gspspeed = parseInt(reldata.slice(36, 40), 16) / 10;
                var direction = reldata.slice(40, 44);
                var date = reldata.slice(44, 56);
                var mileage = parseInt(reldata.slice(60, 68), 16);
                var oil = parseInt(reldata.slice(72, 76), 16);
                var altitude = parseInt(reldata.slice(80, 84), 16);
                var enginespd = parseInt(reldata.slice(88, 92), 16);
                var fdate = date.match(reg);
                $(".trans-data").html("纬度：" + latitude + "<br/>经度：" + longitude + "<br/>行驶记录速度：" + speed + "<br/>方向：" + direction + "<br/>卫星定位速度：" + gspspeed + "<br/>时间：" + fdate + "<br/>附加GNSS包：" + "<br/>里程：" + mileage + "<br/>油量：" + oil + "<br/>海拔：" + altitude + "<br/>发动机转速：" + enginespd);
                break;
            case '8001':
                // 7E80800100050000018637237929004C3C004C020000F97E           
                break;
            case '0900':
                hex2a(strCode, outCode); //转换ASCII
                hex2a(strDate, outDate); //转换ASCII
                hex2a(strSerial, outSerial); //转换ASCII
                $('.console').html('消息id:0x' + submsgid + "::" + '<b style=\' color:#08e\'>' + msg[submsgid] + '</b>');
                switch (submsgid) {
                    case '0203':
                        $('.trans-data').html("学时编号：" + hex2a(strCode, outCode) + hex2a(strDate, outDate) + hex2a(strSerial, outSerial) + "<br/>" + "数据长度：" + parseInt(reldata.slice(46, 54), 16) + "<br/>" + "数据内容：" + parseInt(reldata.slice(54, 56), 16) + "<br/>" + "学员编号：" + parseInt(reldata.slice(54, 56), 16) + "<br/>" + "教练编号：" + parseInt(reldata.slice(54, 56), 16) + "<br/>" + "学员编号：" + parseInt(reldata.slice(54, 56), 16));
                        break;
                    case '0203':
                        $('.trans-data').html("学时编号：" + hex2a(strCode, outCode) + hex2a(strDate, outDate) + hex2a(strSerial, outSerial) + "<br/>" + "数据长度：" + parseInt(reldata.slice(46, 54), 16) + "<br/>" + "数据内容：" + parseInt(reldata.slice(54, 56), 16) + "<br/>" + "学员编号：" + parseInt(reldata.slice(54, 56), 16) + "<br/>" + "教练编号：" + parseInt(reldata.slice(54, 56), 16) + "<br/>" + "学员编号：" + parseInt(reldata.slice(54, 56), 16));
                        break;
                    case '0301':
                        $('.trans-data').html("计时终端编号：" + hex2a(strCode, outCode) + "<br/>" + "数据长度：" + reldata.slice(46, 54) + "<br/>" + "数据内容：" + reldata.slice(54, 62) + "<br/>" + "执行结果：" + (parseInt(reldata.slice(54, 56), 16) ? '成功' : '失败') + "<br/>" + "上传模式：" + parseInt(reldata.slice(56, 58), 16) + "<br/>" + "摄像头通道：" + parseInt(reldata.slice(58, 60), 16) + "<br/>" + "图片实际尺寸：" + parseInt(reldata.slice(60, 62), 16));
                        break;
                    case '0302':
                        $('.trans-data').html("学时编号：" + hex2a(strCode, outCode) + hex2a(strDate, outDate) + hex2a(strSerial, outSerial) + "<br/>" + "数据长度：" + parseInt(reldata.slice(46, 54), 16) + "<br/>" + "执行结果：" + parseInt(reldata.slice(54, 56), 16));
                        break;
                    default:
                        break;
                }
                break;
            case '8103':
                $('.trans-data').html("参数个数" + parseInt(reldata.slice(0, 2), 16) + "<br/>" + "分包参数个数：" + parseInt(reldata.slice(2, 4), 16) + "<br/>参数ID:" + parseInt(reldata.slice(4, 12), 16) + "即0X00" + parseInt(reldata.slice(4, 12), 10) + "<br/>长度：" + parseInt(reldata.slice(12, 14), 16) + "<br/>值：" + parseInt(reldata.slice(14, 22), 16));
                break;
            case '8900':
                $('.console').html('消息id:0x' + submsgid + "::" + '<b style=\' color:#08e\'>' + msg[submsgid] + '</b>');
                switch (submsgid) {
                    case '8303':
                        $('.trans-data').html("计时终端编号：" + hex2a(strCode, outCode) + "<br/>" + "数据长度：" + reldata.slice(46, 54) + "<br/>" + "数据内容：" + reldata.slice(54, 62));
                        break;
                    default:
                        break;
                }
                break;
            default:
                $('.console').html("消息id:0x" + msgid + "::" + '<b style=\' color:#08e\'>' + msg[msgid] + '</b>');
                if (data.length > 1000) {
                    $('.console').html('<b class=\'animate\' style=\' color:#f00;\'>命令无法解析！总长度' + data.length + '</b>')
                }
                break;
        }
    }

    function shows(data) {
        $('.head-flag').text(data.slice(0, 2)); //头标识位
        $('.version').text(data.slice(2, 4)); //协议版本  BYTE
        $('.msgid').text(data.slice(4, 8)); //消息ID WORD
        $('.msgattr').text(data.slice(8, 12)); //消息体属性 WORD
        $('.fill').text(data.slice(12, 17)); //预留0补全16位 0X00000
        $('.phone').text(data.slice(17, 28)); //终端手机号预留补全16位  BCD[8]
        $('.serial').text(data.slice(28, 32)); //消息流水号 WORD
        $('.reserve').text(data.slice(32, 34)); //预留BYTE
        $('.data').val(data.slice(34, data.length - 4)); //数据包
        $('.check-flag').text(data.slice(data.length - 4, data.length - 2)); //校验码
        $('.end-flag').text(data.slice(data.length - 2, data.length)); //尾识位
    }
    //获取当前光标位
    function getTxtCursorPosition() {
        var $input = document.getElementById("rawdata");
        var cursurPosition = 0;
        if ($input.selectionStart) {
            cursurPosition = $input.selectionStart;
        } else {
            try {
                var range = document.selection.createRange();
                range.moveStart("character", -$input.value.length);
                cursurPosition = range.text.length;
            } catch (e) {}
        }
        $('.current').text(cursurPosition);
    }
});