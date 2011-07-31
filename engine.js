
if(!defaults){
	defaults = {};
}

defaults.Engine = {
	events: {
		startgame: function(){},
		startlevel:function(level){},
		endgame: function(result){},
		endlevel: function(level, result){},
		scorechange: function(score){},
		timechange: function(time){},
		gameover: function(){}
	},
	levels:[
		{name: 'Уровень 1', finish: {score:10}}, 
		{name: 'Уровень 2', finish: {time:60}}, {name: 'Последний уровень', finish: {time:180}}
	]
};

defaults.Level = {
	name: 'Level',
	field: {
		height: 20,
		width: 20
	},
	steptime: 250,
	snake: {
		coords: [{row:0, col:0}, {row: 0, col: 1}]
	},
	finish: {
		time: 0,
		score: 0
	}
};

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
//
//Класс Engine - создаёт поле и управляет событиями игры
//
var Engine = function(opts){
	var engine = this;
	var options = $.extend(true,{}, defaults.Engine, opts);
	
	engine.create= function($element){
		var matrix = engine.matrix = new Matrix();
		matrix.create($element);
		
		var _lasttime = 0;
		var tasker = engine.tasker = {
			timer : 250,
			runs: 0,
			task : function(){
				if(snake){
					
					if(_direction){
						snake.direction(_direction);
						_direction = undefined;
					}

					var index = matrix.find(snake.head());
					if(index){
						switch(snake.direction()){
							case 'left': index.col--; break;
							case 'right': index.col++; break;
							case 'up': index.row--; break;
							case 'down': index.row++; break;
							default: break;
						}
						var cell = matrix.cell(index.row, index.col);
						snake.move(cell);
					}
				}
			},
			start : function(){
				if(this.task){
					var $tasker = this;
					this.interval = setInterval(
						function(){ 
							$tasker.runs +=$tasker.timer;
							$tasker.task();
							var _runtime = Math.floor(tasker.runs/1000.0);
							if(_runtime!=_lasttime){
								_invoke(options.events.timechange, engine, _runtime);
								_lasttime = _runtime;
							}
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
		
		
		var fruiter = engine.fruiter ={
			fruit: {
				eaten: 0,
				className: 'fruit'
			}, spawn: function(){
				var cell = matrix.cell(_rnd(0,20), _rnd(0,20));
				if(cell.hasClass(defaults.Snake.classes.body)){
					fruiter.spawn();
				} else {
					cell.addClass(fruiter.fruit.className);
				}
			}, remove: function($element){
				$element.removeClass(fruiter.fruit.className);
			}, isfruit: function($element){
				return !!$element.hasClass(fruiter.fruit.className);
			}
		}
		
		var snake = engine.snake = new Snake({
			checkers: {
				edible: function($element){
					return fruiter.isfruit($element);
				}
			},
			actions: {
				eat: function($element){
					fruiter.remove($element);
					fruiter.spawn();
					_invoke(options.events.scorechange, engine, ++fruiter.fruit.eaten);
				},
				die: function($element){
					tasker.stop();
					_invoke(options.events.endgame, engine);
				}
			}
		});
		
		snake.create(matrix.cell(0,0).add(matrix.cell(1,0)));
		fruiter.spawn();
		
		if($.isFunction(options.events.startgame)){
			options.events.startgame.call(engine);
		}
	};

	var _direction;
	
	engine.command = function(dir){
		if(dir=='pause'){
			
			if(engine.tasker && engine.tasker.interval){
				//останавливаем игру
				engine.tasker.stop();
			} else if(engine.tasker.runs > 0) {
				//запускаем, но только если игра уже идёт
				engine.tasker.start();
			}
		} else if(engine.snake.canturn(dir)){
			_direction = dir;
			if (!engine.tasker.interval){
				engine.tasker.start();
			}
		}
	};
}