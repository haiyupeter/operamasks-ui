(function($) {

module("omAjaxSubmit: options");

//test ajaxSubmit target update
test("ajaxSubmit: target == String", function() {
    $('#targetDiv').empty();
    stop();
    var opts = {
        target: '#targetDiv',
        success: function() { // post-callback
            ok( true, 'post-callback');
            ok( $('#targetDiv').text().match("from server"), "targetDiv updated");
            start();
        }
    };

    expect(2);
    $('#form3').omAjaxSubmit(opts);
});

// test passing jQuery object as the target
test("ajaxSubmit: target == jQuery object", function() {
    stop();
    var target = $('#targetDiv');
    target.empty();

    var opts = {
        target: target,
        success: function(responseText) { // post-callback
            ok( true, 'post-callback');
            ok( $('#targetDiv').text().match("from server"), "targetDiv updated");
            start();
        }
    };

    expect(2);
    $("#form2").omAjaxSubmit(opts);
});

// test passing DOM element as the target
test("ajaxSubmit: target == DOM element", function() {
    stop();
    $('#targetDiv').empty();
    var el = $('#targetDiv')[0];

    var opts = {
        target: '#targetDiv',
        success: function(responseText) { // post-callback
            ok( true, 'post-callback');
            ok( $('#targetDiv').text().match("from server"), "targetDiv updated");
            start();
        }
    };

    expect(2);
    $("#form2").omAjaxSubmit(opts);
});

//test simulated $.load behavior
test("ajaxSubmit: load target with scripts", function() {
    stop();
    $('#targetDiv').empty();

    var opts = {
        target: '#targetDiv',
        url:    '../../../qunitAjaxSubmit?type=doc-with-scripts&' + new Date().getTime(),
        success: function(responseText) { // post-callback
            ok( true, 'success-callback');
            ok( $('#targetDiv').text().match("from server"), "targetDiv updated");
            ok( typeof unitTestVariable1 != 'undefined', 'first script block executed');
            ok( typeof unitTestVariable2 != 'undefined', 'second script block executed');
            ok( typeof scriptCount != 'undefined', 'third script block executed');
            ok( window.scriptCount == 1, 'scripts executed once: ' + scriptCount);
            start();
        }
    };

    expect(6);
    $("#form2").omAjaxSubmit(opts);
});


})(jQuery);
