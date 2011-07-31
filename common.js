/* requires: jquery.min.js */
 
//îáåğòêà äëÿ âûçîâà ôóíêöèè. 
//èñïîëüçîâàíèå: _invoke(fname, context[, arg1, arg2,..]);
function _invoke(){
	if(arguments.length>1){
		if($.isFunction(arguments[0])){
			arguments[0].apply(arguments[1], $.makeArray(arguments).splice(2, arguments.length - 2));
		}
	}
}

function _rnd(inf, sup){
	var res = Math.floor(Math.random()*(sup-inf) + inf);
	return res >= sup ? sup - 1 : res;
};
