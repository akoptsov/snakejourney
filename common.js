/* requires: jquery.min.js */
 
//обертка для вызова функции. 
//использование: _invoke(fname, context[, arg1, arg2,..]);
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


var _default='init';

//регистратор плагинов jQuery
function _register(pobject){
	if(pobject.name && pobject.methods && pobject.defaults){
		$[pobject.name].defaults = pobject.defaults;
		$.fn[pobject.name] = function(){
			if(arguments.length==0){
				pobject.methods[pobject.mehtods['default'] || _default].apply(this, {});
			} else {
				if(typeof arguments[0] == 'string'){
					var mname = arguments[0];
					if($.isFunction(pobject.methods[mname])){
						pobject.methods[mname].apply(this, $.makeArray(arguments).splice(1, arguments.length - 1));
					} else {
						$.error('Missing method "'+mname+'" on $.'+pobject.name+'!');
					}
				} else {
					pobject.methods[pobject.mehtods['default'] || _default].apply(this, $.makeArray(arguments).splice(1, arguments.length - 1));
				} 
			}
		}
	} else {
		$.error('Missing vital parameters on plugin register');
	}
}
