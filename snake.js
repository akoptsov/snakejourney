
if(!defaults){
	var defaults = {};
}

// ������ �����������. ��� - ��������������� � ����� ���� 5, 
// �������� ����� ������� ���� �� ��� ������ ������������ �� 180 � ������� ���� ����
var _directions = {
	left: 2,
	up:  4,
	right: 3,
	down: 1
};

// ��������� �� ��������� ��� ������ ������
defaults.Snake = {
	//������ css 
	classes: { 
		body: 'snake',
		/*bodyalter: 'snake-alter',*/
		dead: 'dead'
	},
	// ������� ��������
	checkers : {
		//���� �� � ���� �������� ���-�� ���������?
		edible: function($element){}
	},
	//������ ��������� ������ (callback)
	actions : {
		//�����, ���������� ��� �������� ����
		move: function($element){},
		//�����, ���������� ��� �������� ����
		eat: function($element){},
		//�����, ���������� ��� ������ �������� ����
		die: function($element){}
	}
};
//
// ����� ������
//
function Snake(opts){
	var snake = this;
	//��������. ������� �� ������ ��������� DOM, ������������ ��� ���������� ������ � ����� ����������� � ���� ���������
	var _body =$();

	//��������� ���������������� ��������� � ��������� �� ��������� � ������ ������
	var options = $.extend(true, {}, defaults.Snake, opts);

	//������� ����������� �������� ����
	var _direction;

	// ���������, �� �������� �� ��� ���� ������� ������ ����
	function _snake($element){
		return !!$element.hasClass(options.classes.body);
	}
	
	//��������� ����� ������� � ����� ������� _body(� ������ ������):
	function _add($element){
		if($element){
			//WARNING: �� ������������ ��� ���� ����� jQuery.add - �� ��������� ����� �������� �� � �����, � � ������� ��������� ��������.
			_body.push($element.addClass(options.classes.body).get(0));
			
			if(options.classes.bodyalter){
				_body.filter('.'+options.classes.bodyalter).removeClass(options.classes.bodyalter);
				_body.filter(':odd').addClass(options.classes.bodyalter);
			}
		}
	}
	// ���������� ��������� ������� ������(������ ������� ������� _body), �������������� ����� � ���� ��� �����
	function _drop(){
		if(_body.length){
			 _body = _body.not(
				_body.first()
					.removeClass(options.classes.bodyalter|| '')
					.removeClass(options.classes.body||'')
					.removeClass(options.classes.dead||'')
			 );
		}
	}
	// ������� ������
	function _die($element){
		if(_body.length){
			_body.removeClass(options.classes.bodyalter||'').addClass(options.classes.dead||'');
		}
		if($.isFunction(options.actions.die))
			options.actions.die.call(_body, $element);
	}
	
	//������ ������ �� ������� jQuery
	snake.create = function($element){
		var ret = true;
		$element.each(function(){
			ret = !!_add($(this)) && ret;
		});
		return ret;
	};
	
	//����� ��� ���������� ����������� �������� ������ (� ����������� �� ���������� ����������)
	snake.direction = function(direction){
		if(arguments.length<1){
			return _direction;
		}
		if(snake.canturn(direction)){
			_direction = direction;
			return true;
		} return false;
	};
	
	//���������, ������� �� ������������ ����������� ��� ����� ��������
	snake.canturn = function(direction){
		return !_direction || 
				//��������, �� ����������� � ������� _directions
				(_directions[direction] && (_directions[_direction]+_directions[direction]!=5));
	};
	
	//������� ����������� ������ ������ � ���� �������
	snake.move = function($element){
		if(!$element){
			//���� ������� �� ����� - �� �� ��������� ����. ������ �� ������������ � ����� ������� ���������(������)
			_die();
		} else if (_snake($element)){
			//���� � ���� ������ ��� ���� ������ - �� �������� ���� �����. ������ ����� ��������.
			_die($element);
		} else if ($.isFunction(options.checkers.edible) && options.checkers.edible($element)){
			// ���� �� ���������� �� ���-�� ���������
			if($.isFunction(options.actions.eat)){
				options.actions.eat($element);
			}
			_add($element);
		} else {
			//���������� ������� � ������ � ��������� ����� � ������
			_drop();_add($element);
			if($.isFunction(options.actions.move)){
				options.actions.move($element);
			}
		}
	};
	
	//���������� �������, ���������� ������ ������
	snake.head = function(){
		return _body.last();
	};
}