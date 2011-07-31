
if(!defaults){
	var defaults = {};
}

// Список направлений. Хак - противоположные в сумме дают 5, 
// Проверка этого условия ниже не даёт змейке развернуться на 180 и сожрать саму себя
var _directions = {
	left: 2,
	up:  4,
	right: 3,
	down: 1
};

// Параметры по умолчанию для класса Змейка
defaults.Snake = {
	//классы css 
	classes: { 
		body: 'snake',
		/*bodyalter: 'snake-alter',*/
		dead: 'dead'
	},
	// Функции проверки
	checkers : {
		//Есть ли в этом элементе что-то съедобное?
		edible: function($element){}
	},
	//методы обратного вызова (callback)
	actions : {
		//Метод, вызываемый при движении змеи
		move: function($element){},
		//Метод, вызываемый при кормежке змеи
		eat: function($element){},
		//Метод, вызываемый над свежим трупиком змеи
		die: function($element){}
	}
};
//
// Класс Змейка
//
function Snake(opts){
	var snake = this;
	//Туловище. Состоит из набора элементов DOM, используется для применения стилей и учёта относящихся к змее элементов
	var _body =$();

	//склеиваем пользовательские настройки и настройки по умолчанию в единый объект
	var options = $.extend(true, {}, defaults.Snake, opts);

	//Текущее направление движения змеи
	var _direction;

	// проверяет, не является ли уже этот элемент частью змеи
	function _snake($element){
		return !!$element.hasClass(options.classes.body);
	}
	
	//добавляем новый элемент в конец объекта _body(в голову змейки):
	function _add($element){
		if($element){
			//WARNING: не использовать для этих целей jQuery.add - он добавляет новые элементы не в конец, а в порядке генерации разметки.
			_body.push($element.addClass(options.classes.body).get(0));
			
			if(options.classes.bodyalter){
				_body.filter('.'+options.classes.bodyalter).removeClass(options.classes.bodyalter);
				_body.filter(':odd').addClass(options.classes.bodyalter);
			}
		}
	}
	// выкидываем последний элемент хвоста(первый элемент объекта _body), предварительно убрав с него все стили
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
	// убиваем змейку
	function _die($element){
		if(_body.length){
			_body.removeClass(options.classes.bodyalter||'').addClass(options.classes.dead||'');
		}
		if($.isFunction(options.actions.die))
			options.actions.die.call(_body, $element);
	}
	
	//создаём змейку из объекта jQuery
	snake.create = function($element){
		var ret = true;
		$element.each(function(){
			ret = !!_add($(this)) && ret;
		});
		return ret;
	};
	
	//задаёт или возвращает направление движения змейки (в зависимости от количества аргументов)
	snake.direction = function(direction){
		if(arguments.length<1){
			return _direction;
		}
		if(snake.canturn(direction)){
			_direction = direction;
			return true;
		} return false;
	};
	
	//проверяет, годится ли предлагаемое направление для смены текущего
	snake.canturn = function(direction){
		return !_direction || 
				//Внимание, см комментарий к массиву _directions
				(_directions[direction] && (_directions[_direction]+_directions[direction]!=5));
	};
	
	//попытка переместить голову змейки в этот элемент
	snake.move = function($element){
		if(!$element){
			//если элемент не задан - мы за границами поля. Смерть от столкновения с тупым тяжелым предметом(стеной)
			_die();
		} else if (_snake($element)){
			//если в этой клетке уже есть змейка - мы отгрызли себе хвост. Смерть через харакири.
			_die($element);
		} else if ($.isFunction(options.checkers.edible) && options.checkers.edible($element)){
			// Если мы наткнулись на что-то съедобное
			if($.isFunction(options.actions.eat)){
				options.actions.eat($element);
			}
			_add($element);
		} else {
			//выкидываем элемент с хвоста и добавляем новый к голове
			_drop();_add($element);
			if($.isFunction(options.actions.move)){
				options.actions.move($element);
			}
		}
	};
	
	//Возвращает элемент, отвечающий голове змейки
	snake.head = function(){
		return _body.last();
	};
}