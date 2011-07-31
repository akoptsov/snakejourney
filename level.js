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
		coords: [{row:0, col:0}, {row: 0, col: 1}]
	},
	finish: {
		time: 0,
		score: 0
	}, events:  {
		start: function(){},
		clear: function(result){}, 
		failed: function(){},
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
	}
	
	function _settime(time){
		if(time!=_result.time){
			_result.time = time;
			if(options.finish.time && _result.time>=options.finish.time){
				level.tasker.stop();
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
				level.tasker.stop();
				_invoke(options.events.clear, level, _result);
			} else {
				_invoke(options.events.scorechange, level, _result.score);
			}
		}
	}
	
	level.create = function(engine){
		level.engine = engine
		if(engine.gamefield){
			var matrix = level.matrix = new Matrix(options.field);
			matrix.create(engine.gamefield);
			
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
			
			
			var fruiter = level.fruiter = {
				fruit: {
					eaten: 0,
					quantity: options.fruit.quantity,
					className: options.fruit.className
				}, spawn: function(){
					var cell = matrix.cell(_rnd(0,20), _rnd(0,20));
					if(cell.hasClass(defaults.Snake.classes.body) ||
					   cell.hasClass(fruiter.fruit.className)){
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
				classes: options.snake.classes,
				checkers: {
					edible: function($element){
						return fruiter.isfruit($element);
					}
				},
				actions: {
					eat: function($element){
						fruiter.remove($element);
						fruiter.spawn();
						_setscore(++fruiter.fruit.eaten);
					},
					die: function($element){
						tasker.stop();
						_invoke(options.events.failed, level);
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
			for(var i=0; i< options.fruit.quantity; i++){
				fruiter.spawn();
			}

			_invoke(options.events.start, level);
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
	
	level.destroy = function(dir){
		if(level.tasker && level.tasker.interval){
			level.tasker.stop();
		}
		level.matrix.destroy();
	}
}