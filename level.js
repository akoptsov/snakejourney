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

var Level = function(opts){
	var level = this;
	var options = $.extend(true,{}, defaults.Level, opts);
	
	level.create = function(engine){
		level.engine = engine
		if(engine.gamefield){
			var matrix = level.matrix = new Matrix(options.field);
			matrix.create(engine.gamefield);
			
			var _lasttime = 0;
			var tasker = level.tasker = {
				timer : options.steptime,
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
									_invoke(options.events.timechange, level, _runtime);
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
			
			
			var fruiter = level.fruiter = {
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
			
			var snake = level.snake = new Snake({
				checkers: {
					edible: function($element){
						return fruiter.isfruit($element);
					}
				},
				actions: {
					eat: function($element){
						fruiter.remove($element);
						fruiter.spawn();
						_invoke(options.events.scorechange, level, ++fruiter.fruit.eaten);
					},
					die: function($element){
						tasker.stop();
						_invoke(options.events.endgame, level);
					}
				}
			});
			
			var snakebody;
			$.each(options.snake.coords, function(index, coords){
				var cell = matrix.cell(coords.row, coords.col);
				if(!snakebody){
					snakebody = cell;
				} else {
					snakebody.add(cell);
				}
			});

			snake.create(snakebody);
			fruiter.spawn();
			
			if($.isFunction(options.events.startgame)){
				options.events.startgame.call(level);
			}
		}
	};

	var _direction;
	
	level.command = function(dir){
		if(dir=='pause'){
			if(level.tasker && level.tasker.interval){
				//останавливаем игру
				level.tasker.stop();
			} else if(level.tasker.runs > 0) {
				//запускаем, но только если игра уже идёт
				level.tasker.start();
			}
		} else if(level.snake.canturn(dir)){
			_direction = dir;
			if (!level.tasker.interval){
				level.tasker.start();
			}
		}
	};
}