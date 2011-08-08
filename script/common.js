/* requires: jquery.min.js */
 

//��������� ������� - ��������� ������ n ��������� �� ������� � ������� �������
function _drop(n, arrobj){
	return (arrobj.length > n) ? ($.makeArray(arrobj).splice(n, arrobj.length - n)) : [];
}

 
 //������� ��� ������ �������. 
//�������������: _invoke(fname, context[, arg1, arg2,..]);
function _invoke(){
	if(arguments.length>1){
		if($.isFunction(arguments[0])){
			arguments[0].apply(arguments[1], _drop(2, arguments));
		}
	}
}

//��������� ����� ����� n: inf <= n < sup 
function _rnd(inf, sup){
	var res = Math.floor(Math.random()*(sup-inf) + inf);
	//���� ���������� 1 (����������� ����� �� ���� 0)
	return res >= sup ? sup - 1 : res;
}


// �������� ������, ����������� �� ���������
var _default='init';
//����������� �������� jQuery
function _register(pobject){
	if(pobject.name && pobject.methods && pobject.defaults){
		
		$[pobject.name] = { 
			defaults : pobject.defaults 
		};
		
		$.fn[pobject.name] = function(){
			if(arguments.length < 1){
				return pobject.methods[pobject.mehtods['default'] || _default].apply(this, {});
			} else {
				if(typeof arguments[0] == 'string'){
					var mname = arguments[0];
					if($.isFunction(pobject.methods[mname])){
						return pobject.methods[mname].apply(this, _drop(1, arguments));
					} else {
						$.error('Missing method "'+mname+'" on $.'+pobject.name+'!');
					}
				} else {
					return pobject.methods[pobject.methods['default'] || _default].apply(this, $.makeArray(arguments));
				} 
			}
		};
	} else {
		$.error('Missing vital parameters on plugin register');
	}
}
