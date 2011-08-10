
if(!defaults){
	defaults = {};
}

defaults.Engine = {
	events: {
		startgame: function(){},
		endgame: function(result, proceed){},
		pausegame: function(){},
		startlevel: function(level){},
		endlevel: function(level, result, proceed){},
		scorechange: function(score){},
		timechange: function(time){},
		gameover: function(){}
	},
	levels:[
		{
			name: 'Уровень 1 : Зеленая Козявка', 
			field: {width:20, height:20}, 
			steptime: 240,
			finish: { score:1/*8*/ }
		}, 
		{
			name: 'Уровень 2 : Алый Аспид', 
			field: {width:25, height:25}, 
			fruit:{quantity:3}, 
			snake:{
				classes:{body:'snake-asp'}
			}, 
			steptime: 180, 
			finish: {score:2/*23*/}
		},
		{
			name: 'Последний уровень: Железный Питон', 
			field: {width:25, height:25}, 
			fruit: {quantity:2}, 
			snake:{
				classes:{
					body: 'snake-python', 
					bodyalter:'snake-alter'
				}
			}, 
			steptime:120, 
			finish: {time:/*90*/10}
		}
	]
};
//
//Класс Engine - создаёт уровни и управляет событиями игры
//
var Engine = function(opts){
	var engine = this;
	var options = $.extend(true,{}, defaults.Engine, opts);

	var _result = {
		score: 0,
		time: 0
	};
	
	//обработчики событий уровня. в контексте у них находится объект Level
	var _levelevents = {
		start: function(){
			_invoke(options.events.startlevel, engine, this);
		},
		pause: function(){
			_invoke(options.events.pausegame, engine);
		},
		clear: function(result){
			_result.score +=result.score;
			_result.time  +=result.time;
			
			if(options.levels.length){
				if(_levelindex < options.levels.length - 1){
					_invoke(options.events.endlevel, engine, this, result, _nextlevel);
				} else {
					_invoke(options.events.endgame, engine, _result, _endgame);
				}
			}
		}, 
		failed: function(){
			_invoke(options.events.gameover, engine, _result);
		},
		scorechange: function(score){
			_invoke(options.events.scorechange, engine, score);
		},
		timechange: function(time){
			_invoke(options.events.timechange, engine, time);
		}
	}
	
	function _endgame(){
		if(this.level){
			this.level.destroy();
		}
	}
	
	var _levelindex = -1;
	function _nextlevel(){
		if(engine.level){
			engine.level.destroy();
		}
		_levelindex++;
		if(options.levels.length){
			engine.level = new Level($.extend(true,{},options.levels[_levelindex], {events: _levelevents}));
			engine.level.create(engine);
		}
	}
	
	engine.create= function($element){
		engine.gamefield = $element;
		_invoke(options.events.startgame, engine);
		_nextlevel();
	};
	engine.command = function(dir){
		if(engine.level && $.isFunction(engine.level.command)){
			engine.level.command(dir);
		}
	};
}