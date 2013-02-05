/*
 * om-tabs-core.js
 */
var el,
    active;
    
var omTabs_defaults = {
	tabHeight: 27,
	tabWidth: 80
};

var REMOTE_DATA = "this this the remote data",
	REMOTE_DATA2 = "this this the remote data2";

function hasClass(target , className , msg){
	var cls = className.split(' ');
	var has = true;
	for(var i=0,len=cls.length; i<len && has; i++){
		if(!target.hasClass(cls[i])){
			has = false;
		}
	}
	ok(has , msg);
}

function notHasClass(target , className , msg){
	var cls = className.split(' ');
	var has = false;
	for(var i=0,len=cls.length; i<len && !has; i++){
		if(target.hasClass(cls[i])){
			has = true;
		}
	}
	ok(!has , msg);
}

function hasBorder(target , msg){
	notEqual(target.css('border-top-width') , '0px' , msg);
	notEqual(target.css('border-right-width') , '0px' , msg);
	notEqual(target.css('border-bottom-width') , '0px' , msg);
	notEqual(target.css('border-left-width') , '0px' , msg);
}

function noBorder(target , msg){
	equal(target.css('border-top-width') , '0px' , msg);
	equal(target.css('border-right-width') , '0px' , msg);
	equal(target.css('border-bottom-width') , '0px' , msg);
	equal(target.css('border-left-width') , '0px' , msg);
}

