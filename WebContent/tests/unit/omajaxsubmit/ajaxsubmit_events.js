(function($) {

module("omAjaxSubmit : events");

test("'success' callback", function() {
    $('#targetDiv').empty();
    stop();

    var opts = {
        success: function() {
            ok( true, 'post-callback');
            start();
        }
    };

    expect(1);
    $('#form3').omAjaxSubmit(opts);
});

test("success callback params", function() {
    $('#targetDiv').empty();
    stop();

    if (/^1\.3/.test($.fn.jquery)) {
        expect(3);
        var $testForm = $("#form3").omAjaxSubmit({
            success: function(data, status, $form) { // jQuery 1.4+ signature
                ok (true, 'success callback invoked');
                ok (status === 'success', 'status === success');
                ok ($form === $testForm, '$form param is valid');
                start();
            }
        });
    }
    else { //if (/^1\.4/.test($.fn.jquery)) {
        expect(6);
        var $testForm = $("#form3").omAjaxSubmit({
            success: function(data, status, xhr, $form) { // jQuery 1.4+ signature
                ok (true, 'success callback invoked');
                ok (status === 'success', 'status === success');
                ok (true, 'third arg: ' + typeof xhr != undefined);
                ok (!!xhr != false, 'xhr != false');
                ok (xhr.status, 'xhr.status == ' + xhr.status);
                ok ($form === $testForm, '$form param is valid');
                start();
            }
        });
    }
});

test("naked hash", function() {
    $("#actionTest1").omAjaxSubmit({
        beforeSerialize: function($f, opts) {
            ok (true, 'url='+opts.url);
        }
    });
    ok (true, 'ajaxSubmit passed');
});
test("hash only", function() {
    $("#actionTest2").omAjaxSubmit({
        beforeSerialize: function($f, opts) {
            ok (true, 'url='+opts.url);
        }
    });
    ok (true, 'ajaxSubmit passed');
});
test("empty action", function() {
    $("#actionTest3").omAjaxSubmit({
        beforeSerialize: function($f, opts) {
            ok (true, 'url='+opts.url);
        }
    });
    ok (true, 'ajaxSubmit passed');
});
test("missing action", function() {
    $("#actionTest4").omAjaxSubmit({
        beforeSerialize: function($f, opts) {
            ok (true, 'url='+opts.url);
        }
    });
    ok (true, 'ajaxSubmit passed');
});

//test ajaxSubmit pre-submit callback
test("ajaxSubmit: pre-submit callback", function() {
    var opts = {
        beforeSubmit: function(a, jq) { // pre-submit callback
            ok( true, 'pre-submit callback');
            ok( a.constructor == Array, "type check array");
            ok( jq.jquery, "type check jQuery");
            ok( jq[0].tagName.toLowerCase() == 'form', "jQuery arg == 'form': " + jq[0].tagName.toLowerCase());
        }
    };

    expect(4);
    $('#form3').omAjaxSubmit(opts);
});

// test ajaxSubmit post-submit callback for response and status text
test("ajaxSubmit: post-submit callback", function() {
    stop();

    var opts = {
        success: function(responseText, statusText) { // post-submit callback
            ok( true, 'post-submit callback');
            ok( responseText.match("from server"), "responseText");
            ok( statusText == "success", "statusText");
            start();
        }
    };

    expect(3);
    $('#form3').omAjaxSubmit(opts);
});

// test ajaxSubmit with function argument
test("ajaxSubmit: function arg", function() {
    stop();

    expect(1);
    $('#form3').omAjaxSubmit(function() {
        ok( true, 'callback hit');
        start();
    });
});

//test json datatype
test("ajaxSubmit: dataType == json", function() {
    stop();

    var opts = {
        url: '../../../qunitAjaxSubmit?type=json',
        dataType: 'json',
        success: function(data, statusText) { // post-submit callback
            // assert that the json data was evaluated
            ok( typeof data == 'object', 'json data type');
            ok( data.name == 'jquery-test', 'json data contents');
            start();
        }
    };

    expect(2);
    $('#form2').omAjaxSubmit(opts);
});


// test script datatype
test("ajaxSubmit: dataType == script", function() {
    stop();

    var opts = {
        url: '../../../qunitAjaxSubmit?type=script&' + new Date().getTime(), // don't let ie cache it
        dataType: 'script',
        success: function(responseText, statusText) { // post-submit callback
            ok( typeof formScriptTest == 'function', 'script evaluated');
            ok( responseText.match('formScriptTest'), 'script returned');
            start();
        }
    };

    //expect(2);
    $('#form2').omAjaxSubmit(opts);
});

// test xml datatype
test("ajaxSubmit: dataType == xml", function() {
    stop();

    var opts = {
        url: '../../../qunitAjaxSubmit?type=xml',
        dataType: 'xml',
        success: function(responseXML, statusText) { // post-submit callback
            ok( typeof responseXML == 'object', 'data type xml');
            ok( $('test', responseXML).size() == 3, 'xml data query');
            start();
        }
    };

    expect(2);
    $('#form2').omAjaxSubmit(opts);
});


// test that args embedded in the action are honored; no real way
// to assert this so successful callback is used to signal success
test("ajaxSubmit: existing args in action attr", function() {
    stop();

    var opts = {
        success: function() { // post-submit callback
            ok( true, 'post callback');
            start();
        }
    };

    expect(1);
    $('#form5').omAjaxSubmit(opts);
});

// test ajaxSubmit using pre-submit callback to cancel submit
test("ajaxSubmit: cancel submit", function() {

    var opts = {
        beforeSubmit: function(a, jq) { // pre-submit callback
            ok( true, 'pre-submit callback');
            ok( a.constructor == Array, "type check");
            ok( jq.jquery, "type check jQuery");
            return false;  // return false to abort submit
        },
        success: function() { // post-submit callback
            ok( false, "should not hit this post-submit callback");
        }
    };

    expect(3);
    $('#form3').omAjaxSubmit(opts);
});

// test submitting a pseudo-form
test("ajaxSubmit: pseudo-form", function() {
    stop();

    var opts = {
        beforeSubmit: function(a, jq) { // pre-submit callback
            ok( true, 'pre-submit callback');
            ok( a.constructor == Array, "type check");
            ok( jq.jquery, "type check jQuery");
            ok( jq[0].tagName.toLowerCase() == 'div', "jQuery arg == 'div'");
        },
        success: function() { // post-submit callback
            ok( true, 'post-submit callback');
            start();
        },
        // url and method must be provided for a pseudo form since they can
        // not be extracted from the markup
        url:  '../../../qunitAjaxSubmit',
        type: 'post'
    };

    expect(5);
    $("#pseudo").omAjaxSubmit(opts);
});

// test eval of json response
test("ajaxSubmit: evaluate response", function() {
    stop();

    var opts = {
        success: function(responseText) { // post-callback
            ok( true, 'post-callback');
            ok( responseText.name == 'jquery-test', 'evaled response');
            start();
        },
        url: '../../../qunitAjaxSubmit?type=json'
    };

    expect(2);
    $("#form2").omAjaxSubmit(opts);
});

})(jQuery);
