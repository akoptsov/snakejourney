
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
		{name: 'Уровень 1', steptime:150, finish: {score:10}}, 
		{name: 'Уровень 2', finish: {time:60}},
		{name: 'Последний уровень', finish: {time:180}}
	]
};


//
//Класс Engine - создаёт уровни и управляет событиями игры
//
var Engine = function(opts){
	var engine = this;
	var options = $.extend(true,{}, defaults.Engine, opts);
	
	engine.create= function($element){
		engine.gamefield = $element;
		if(options.levels.length){
			engine.level = new Level($.extend(true,{},options.levels[0],{events: options.events}));
			engine.level.create(engine);
		}
	};
	engine.command = function(dir){
		if(engine.level && $.isFunction(engine.level.command)){
			engine.level.command(dir);
		}
	};
}