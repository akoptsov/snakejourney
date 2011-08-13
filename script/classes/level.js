defaults.Level = {
	name: 'Level',
	field: {
		height: 20,
		width: 20
	},
	fruit: {
		className: 'fruit',
		quantity: 1
	},
	steptime: 250,
	snake: {
		//WARNING: _direction определено в snake.js
		direction: _directions.right,
		coords: [{row:0, col:0}, {row: 0, col: 1}]
	},
	finish: {
		time: 0,
		score: 0
	}, events:  {
		start: function(){},
		pause: function(){},
		clear: function(result){}, 
		failed: function(result){},
		scorechange: function(score){},
		timechange: function(time){}
	}
};

var Level = function(opts){
	var level = this;
	var options = $.extend(true,{}, defaults.Level, opts);
	level.name = options.name;
	level.finish = options.finish;
	
	var _result = {
		score: 0,
		time: 0
	};
	
	function _settime(time){
		if(time!=_result.time){
			_result.time = time;
			if(options.finish.time && _result.time>=options.finish.time){
				_tasker.stop();
				_invoke(options.events.clear, level, _result);
			} else {
				_invoke(options.events.timechange, level, _result.time);
			}
		}
	}
	
	function _setscore(score){
		if(score!=_result.score){
			_result.score=score;
			if(options.finish.score && _result.score>=options.finish.score){
				_tasker.stop();
				_invoke(options.events.clear, level, _result);
			} else {
				_invoke(options.events.scorechange, level, _result.score);
			}
		}
	}
	
	var _matrix = new Matrix(options.field);
	
	function _cell(coords){
		if(_matrix){
			return _matrix.cell(coords.row, coords.col);
		}
	}
	
	var _tasker = {
		timer : options.steptime,
		runs: 0,
		task : function(){
			if(_snake && _matrix){
				
				if(_direction){
					_snake.direction(_direction);
					_direction = undefined;
				}

				var index = _matrix.find(_snake.head());
				if(index){
					switch(_snake.direction()){
						case 'left': index.col--; break;
						case 'right': index.col++; break;
						case 'up': index.row--; break;
						case 'down': index.row++; break;
						default: break;
					}
					_snake.move(_cell(index));
				}
			}
		},
		start : function(){
			if(this.task){
				var tasker = this;
				this.interval = setInterval(
					function(){ 
						tasker.runs +=tasker.timer;
						tasker.task();
						_settime(Math.floor(tasker.runs/1000.0));
					}, 
					this.timer
				);
			}
		},
		stop: function(){
			if(this.interval){
				clearInterval(this.interval);
				this.interval = false;
			}
		}
	};
	
	var _fruiter = {
		fruit: {
			eaten: 0,
			quantity: options.fruit.quantity,
			className: options.fruit.className
		}, spawn: function(){
			var cell = _cell({row:_rnd(0,20), col:_rnd(0,20)});
			if((_snake && _snake.issnake(cell)) || _fruiter.isfruit(cell)){
				_fruiter.spawn();
			} else {
				cell.addClass(_fruiter.fruit.className);
			}
		}, remove: function($element){
			$element.removeClass(_fruiter.fruit.className);
		}, isfruit: function($element){
			return !!$element.hasClass(_fruiter.fruit.className);
		}
	};
	
	var _snake = level.snake = new Snake({
		classes: options.snake.classes,
		checkers: {
			edible: function($element){
				return _fruiter.isfruit($element);
			}
		},
		actions: {
			eat: function($element){
				_fruiter.remove($element);
				_fruiter.spawn();
				_setscore(++_fruiter.fruit.eaten);
			},
			die: function($element){
				_tasker.stop();
				_invoke(options.events.failed, level, _result);
			}
		}
	});
	
	
	// ѕользовательское направление движени€ змеи. 
	// Ќужно дл€ того, чтобы исключить слишком быстрые нажати€ пользователем на клавиши
	var _direction;
	
	//создаЄт новый уровень
	level.create = function(engine){
		level.engine = engine
		if(engine.gamefield){
			_matrix.create(engine.gamefield);

			var snakebody;
			$.each(options.snake.coords, function(index, coords){
				var cell = _cell(coords);
				if(cell){
					if(!snakebody){
						snakebody = cell;
					} else {
						snakebody.push(cell[0]);
					}
				}
			});
			_snake.create(snakebody);
			
			for(var i=0; i< options.fruit.quantity; i++){
				_fruiter.spawn();
			}
			
			_invoke(options.events.start, level);
		}
	};
	
	//обрабатывает команду ползовател€
	level.command = function(dir){
		if(dir=='pause'){
			if(_tasker && _tasker.interval){
				//останавливаем игру
				_tasker.stop();
				_invoke(options.events.pause, level);
			} else if(_tasker.runs > 0) {
				//запускаем, но только если игра уже идЄт
				_tasker.start();
			}
		} else if(_snake && _snake.canturn(dir)){
			_direction = dir;
			if (!_tasker.interval){
				_tasker.start();
			}
		}
	};
	
	//удал€ет текущий уровень
	level.destroy = function(dir){
		if(_tasker && _tasker.interval){
			_tasker.stop();
		}
		if(_matrix){
			_matrix.destroy();
		}
	}
}