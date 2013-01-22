function cookieTool(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires
                && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime()
                        + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires
                                                            // attribute,
                                                            // max-age is not
                                                            // supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [ name, '=', encodeURIComponent(value), expires,
                path, domain, secure ].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for ( var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie
                            .substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
function writeThemeCss() {
    var themeName = cookieTool('omtheme'),
        urlPath = location.pathname,
        anchorIndex = urlPath.search(/demos/);
    var relativePath = "";
    if (anchorIndex != -1) {
        var pathPrefix = urlPath.substring(anchorIndex + 5);
        var prefixArray = pathPrefix.split('/');
        for (var i=0;i<prefixArray.length;i++) {
            if (prefixArray[i] != '') {
                relativePath += '../';
            }
        }
    } else {
        anchorIndex = urlPath.search(/example/);
        if (anchorIndex != -1) {
            var pathPrefix = urlPath.substring(anchorIndex + 7);
            var prefixArray = pathPrefix.split('/');
            for (var i=0;i<prefixArray.length;i++) {
                if (prefixArray[i] != '') {
                    relativePath += '../';
                }
            }
        }
    }
    var fullPath = relativePath + "themes/" + (themeName ? themeName : 'apusic') + "/om-all.css";
    var cssStyle = '<link rel="stylesheet" type="text/css" href="'+ fullPath +'" />';
    document.writeln(cssStyle);
}
writeThemeCss();