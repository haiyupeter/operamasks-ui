$(function(){
    $.extend($,{omRules:{}});
    $.omRules.lang={
            notNum: "不是有效的数字",
            notDecimal:"不是有效的小数",
            notInteger:"不是有效的整数",
            notStr:"不是有效字符",
            notChinese : "不是有效汉字",
            notEmail:"不是有效的邮箱",
            notMobilePhone:"不是有效的手机号码",
            notTelephone:"不是有效的固定电话号码",
            notQQ:"不是有效的QQ号码",
            notIdCard:"不是有效的身份证号码",
            notIP:"不是有效的IP地址",
            checkURL:"不是有效的URL",
            notQuote:"含有特殊字符，不能输入",
            notDate:"非法日期格式",
            checkTime:"时间格式非法",
            notFullTime:"日期格式非法",
            notTrueValidateCodeBy18IdCard:"18位身份证最后位验证非法",
            notValidityBrithBy18IdCard : "18位身份证生日验证非法",
            notValidityBrithBy15IdCard : "15位身份证生日验证非法",
            maleOrFemalByIdCard : "你不是女人，这辈子不能注册！"
    };
    /**
     * ruleName : isNum
     */
    $.validator.addMethod("isNum", function(value) {
         return checkNum(value);
     }, $.omRules.lang.notNum);
    
    /**
     * ruleName : isDecimal
     */
    $.validator.addMethod("isDecimal", function(value , element ,params) {
        var a = element , b = params;
        return checkDecimal(value);
    }, $.omRules.lang.notDecimal);
    /**
     * ruleName : isInteger
     */
    $.validator.addMethod("isInteger", function(value) {
        return checkInteger(value);
    }, $.omRules.lang.notInteger);

    /**
     * ruleName : isStr
     */
    $.validator.addMethod("isStr", function(value) {
        return checkStr(value);
    }, $.omRules.lang.notStr);

    /**
     * ruleName : isChinese
     */
    $.validator.addMethod("isChinese", function(value) {
        return checkChinese(value);
    }, $.omRules.lang.notChinese);

    /**
     * ruleName : isEmail
     */
    $.validator.addMethod("isEmail", function(value) {
        return checkEmail(value);
    }, $.omRules.lang.notEmail);

    /**
     * ruleName : isMobilePhone
     */
    $.validator.addMethod("isMobilePhone", function(value) {
        return checkMobilePhone(value);
    }, $.omRules.lang.notMobilePhone);

    /**
     * ruleName : isTelephone
     */
    $.validator.addMethod("isTelephone", function(value) {
        return checkTelephone(value);
    }, $.omRules.lang.notTelephone);

    /**
     * ruleName : isQQ
     */
    $.validator.addMethod("isQQ", function(value) {
        return checkQQ(value);
    }, $.omRules.lang.notQQ);
    /**
     * ruleName : isIP
     */
    $.validator.addMethod("isIP", function(value) {
        return checkIP(value);
    }, $.omRules.lang.notIP);
    /**
     * ruleName : isURL
     */
    $.validator.addMethod("isURL", function(value) {
        return checkURL(value);
    }, $.omRules.lang.notURL);
    /**
     * ruleName : isQuote
     */
    $.validator.addMethod("isQuote", function(value) {
        return checkQuote(value);
    }, $.omRules.lang.notQuote);
    /**
     * ruleName : isDate
     */
    $.validator.addMethod("isDate", function(value) {
        return checkDate(value);
    }, $.omRules.lang.notDate);
    /**
     * ruleName : isTime
     */
    $.validator.addMethod("isTime", function(value) {
        return checkTime(value);
    }, $.omRules.lang.notTime);
    /**
     * ruleName : isFullTime
     */
    $.validator.addMethod("isFullTime", function(value) {
        return checkFullTime(value);
    }, $.omRules.lang.notFullTime);
    /**
     * ruleName : isIdCard
     */
    $.validator.addMethod("isIdCard", function(value) {
        return IdCardValidate(value);
    }, $.omRules.lang.notIdCard);
    /**
     * ruleName : isTrueValidateCodeBy18IdCard
     */
    $.validator.addMethod("isTrueValidateCodeBy18IdCard", function(value) {
        return isTrueValidateCodeBy18IdCard(value);
    }, $.omRules.lang.notTrueValidateCodeBy18IdCard);
    /**
     * ruleName : isValidityBrithBy18IdCard
     */
    $.validator.addMethod("isValidityBrithBy18IdCard", function(value) {
        return isValidityBrithBy18IdCard(value);
    }, $.omRules.lang.notValidityBrithBy18IdCard);
    /**
     * ruleName : isValidityBrithBy15IdCard
     */
    $.validator.addMethod("isValidityBrithBy15IdCard", function(value) {
        return isValidityBrithBy15IdCard(value);
    }, $.omRules.lang.notValidityBrithBy15IdCard);
    /**
     * ruleName : ismaleOrFemalByIdCard
     */
    $.validator.addMethod("ismaleOrFemalByIdCard", function(value) {
        return maleOrFemalByIdCard(value);
    }, $.omRules.lang.maleOrFemalByIdCard);
});

/**
 * 检查输入的一串字符是否全部是数字
 * 输入:str  字符串
 * 返回:true 或 flase; true表示为数字
 */
function checkNum(str){
    return str.match(/\D/) == null;
}
/**
 * 检查输入的一串字符是否为小数(小数包括正负整数)
 * 输入:str  字符串
 * 返回:true 或 flase; true表示为小数
 */
function checkDecimal(str){
    if (str.match(/^-?\d+(\.\d+)?$/g) == null) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 检查输入的一串字符是否为整型数据
 * 输入:str  字符串
 * 返回:true 或 flase; true表示为小数
 */
function checkInteger(str){
    if (str.match(/^[-+]?\d*$/) == null) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 检查输入的一串字符是否是字符
 * 输入:str  字符串
 * 返回:true 或 flase; true表示为全部为字符 不包含汉字
 */
function checkStr(str){
    if (/[^\x00-\xff]/g.test(str)) {
        return false;
    }
    else {
        return true;
    }
}
/**
 * 检查输入的一串字符是否包含汉字
 * 输入:str  字符串
 * 返回:true 或 flase; true表示包含汉字
 */
function checkChinese(str){
    if (escape(str).indexOf("%u") != -1) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 检查输入的邮箱格式是否正确
 * 输入:str  字符串
 * 返回:true 或 flase; true表示格式正确
 */
function checkEmail(str){
    if (str.match(/[A-Za-z0-9_-]+[@](\S*)(net|com|cn|org|cc|tv|[0-9]{1,3})(\S*)/g) == null) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 检查输入的手机号码格式是否正确
 * 输入:str  字符串
 * 返回:true 或 flase; true表示格式正确
 */
function checkMobilePhone(str){
    if (str.match(/^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/) == null) {
        return false;
    }
    else {
        return true;
    }
}
/**
 * 检查输入的固定电话号码是否正确
 * 输入:str  字符串
 * 返回:true 或 flase; true表示格式正确
 */
function checkTelephone(str){
    if (str.match(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/) == null) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 检查QQ的格式是否正确
 * 输入:str  字符串
 *  返回:true 或 flase; true表示格式正确
 */
function checkQQ(str){
    if (str.match(/^\d{5,10}$/) == null) {
        return false;
    }
    else {
        return true;
    }
}
/**
 * 检查输入的IP地址是否正确
 * 输入:str  字符串
 *  返回:true 或 flase; true表示格式正确
 */
function checkIP(str){
    var arg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if (str.match(arg) == null) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 检查输入的URL地址是否正确
 * 输入:str  字符串
 *  返回:true 或 flase; true表示格式正确
 */
function checkURL(str){
    if (str.match(/(http[s]?|ftp):\/\/[^\/\.]+?\..+\w$/i) == null) {
        return false
    }
    else {
        return true;
    }
}

/**
 * 检查输入的字符是否具有特殊字符
 * 输入:str  字符串
 * 返回:true 或 flase; true表示包含特殊字符
 * 主要用于注册信息的时候验证
 */
function checkQuote(str){
    var items = new Array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "{", "}", "[", "]", "(", ")");
    items.push(":", ";", "'", "|", "\\", "<", ">", "?", "/", "<<", ">>", "||", "//");
    items.push("admin", "administrators", "administrator", "管理员", "系统管理员");
    items.push("select", "delete", "update", "insert", "create", "drop", "alter", "trancate");
    str = str.toLowerCase();
    for (var i = 0; i < items.length; i++) {
        if (str.indexOf(items[i]) >= 0) {
            return false;
        }
    }
    return true;
}

/**
 * 检查日期格式是否正确
 * 输入:str  字符串
 * 返回:true 或 flase; true表示格式正确
 * 注意：此处不能验证中文日期格式
 * 验证短日期（2007-06-05）
 */
function checkDate(str){
    //var value=str.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
    var value = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (value == null) {
        return false;
    }
    else {
        var date = new Date(value[1], value[3] - 1, value[4]);
        return (date.getFullYear() == value[1] && (date.getMonth() + 1) == value[3] && date.getDate() == value[4]);
    }
}

/**
 * 检查时间格式是否正确
 * 输入:str  字符串
 * 返回:true 或 flase; true表示格式正确
 * 验证时间(10:57:10)
 */
function checkTime(str){
    var value = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/)
    if (value == null) {
        return false;
    }
    else {
        if (value[1] > 24 || value[3] > 60 || value[4] > 60) {
            return false
        }
        else {
            return true;
        }
    }
}

/**
 * 检查全日期时间格式是否正确
 * 输入:str  字符串
 * 返回:true 或 flase; true表示格式正确
 * (2007-06-05 10:57:10)
 */
function checkFullTime(str){
    var value = str.match(/^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/);
    if (value == null) {
        return false;
    }
    else {
        return true;
    }
}

/**  
 * 身份证15位编码规则：dddddd yymmdd xx p
 * dddddd：地区码
 * yymmdd: 出生年月日
 * xx: 顺序类编码，无法确定
 * p: 性别，奇数为男，偶数为女
 * <p />
 * 身份证18位编码规则：dddddd yyyymmdd xxx y
 * dddddd：地区码
 * yyyymmdd: 出生年月日
 * xxx:顺序类编码，无法确定，奇数为男，偶数为女
 * y: 校验码，该位数值可通过前17位计算获得
 * <p />
 * 18位号码加权因子为(从右到左) Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2,1 ]
 * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
 * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
 * i为身份证号码从右往左数的 2...18 位; Y_P为脚丫校验码所在校验码数组位置
 *
 */
var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];// 加权因子   
var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];// 身份证验证位值.10代表X   
function IdCardValidate(idCard){
    idCard = trim(idCard.replace(/ /g, ""));
    if (idCard.length == 15) {
        return isValidityBrithBy15IdCard(idCard);
    }
    else 
        if (idCard.length == 18) {
            var a_idCard = idCard.split("");// 得到身份证数组   
            if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
}

/**  
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param a_idCard 身份证号码数组
 * @return
 */
function isTrueValidateCodeBy18IdCard(a_idCard){
    var sum = 0; // 声明加权求和变量   
    if (a_idCard[17].toLowerCase() == 'x') {
        a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作   
    }
    for (var i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i];// 加权求和   
    }
    valCodePosition = sum % 11;// 得到验证码所位置   
    if (a_idCard[17] == ValideCode[valCodePosition]) {
        return true;
    }
    else {
        return false;
    }
}


/**  
 * 通过身份证判断是男是女
 * @param idCard 15/18位身份证号码
 * @return 'female'-女、'male'-男
 */
function maleOrFemalByIdCard(idCard){
    idCard = trim(idCard.replace(/ /g, ""));// 对身份证号码做处理。包括字符间有空格。   
    if (idCard.length == 15) {
        if (idCard.substring(14, 15) % 2 == 0) {
            return true;//'female';
        }
        else {
            return  false;//'male';
        }
    }
    else 
        if (idCard.length == 18) {
            if (idCard.substring(14, 17) % 2 == 0) {
                return  true;//'female';
            }
            else {
                return false;//'male';
            }
        }
        else {
            return null;
        }
}

/**  
 * 验证18位数身份证号码中的生日是否是有效生日
 * @param idCard 18位数身份证字符串
 * @return
 */
function isValidityBrithBy18IdCard(idCard18){
    var year = idCard18.substring(6, 10);
    var month = idCard18.substring(10, 12);
    var day = idCard18.substring(12, 14);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题   
    if (temp_date.getFullYear() != parseFloat(year) ||
    temp_date.getMonth() != parseFloat(month) - 1 ||
    temp_date.getDate() != parseFloat(day)) {
        return false;
    }
    else {
        return true;
    }
}

/**  
 * 验证15位数身份证号码中的生日是否是有效生日
 * @param idCard15 15位书身份证字符串
 * @return
 */
function isValidityBrithBy15IdCard(idCard15){
    var year = idCard15.substring(6, 8);
    var month = idCard15.substring(8, 10);
    var day = idCard15.substring(10, 12);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
    if (temp_date.getYear() != parseFloat(year) ||
    temp_date.getMonth() != parseFloat(month) - 1 ||
    temp_date.getDate() != parseFloat(day)) {
        return false;
    }
    else {
        return true;
    }
}
//去掉字符串头尾空格   
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
