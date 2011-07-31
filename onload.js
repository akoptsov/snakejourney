var _keys = {
	/*стрелка влево*/	37: 'left',
	/*стрелка вверх*/	38: 'up',
	/*стрелка вправо*/	39: 'right',
	/*стрелка вниз*/	40: 'down',
	/*пробел*/			32: 'pause'
};
//
// Точка входа.
//
$(function() {
	var $time = $('<p></p>').appendTo('.info');
	var $score = $('<p></p>').appendTo('.info');
	var $requirement = $('<p></p>').appendTo('.info');
	
	
	var engine = new Engine({
		events: {
			startlevel: function(level){
				if(level.name){
					$.info.show({text:(level.name|| 'Новый уровень')});
				}
				$time.empty();
				$score.empty();
				$requirement.html((function(){
					if(!level.finish.score){
						if(level.finish.time){
							return 'Задание уровня: продержаться '+level.finish.time+' секунд';
						}
					} else if(!level.finish.time){
						if(level.finish.score){
							return 'Задание уровня: отрастить хвост длины '+ ((level.snake?(level.snake.length() + level.finish.score): level.finish.score) - 1)
						}
					} else {
						return 'Задание уровня: отрастить хвост длины '+ ((level.snake?(level.snake.length() + level.finish.score): level.finish.score) - 1)+' за '+level.finish.time+' секунд';
					}
				})());
			},
			endlevel: function(level, result, proceed){
				$.info.show({
					text:'<p>Уровень завершен</p><p>Вы играли '+result.time+' секунд и набрали '+result.score+' oчков</p>',
					callback: function(){
						proceed();
					}
				});
			},
			endgame: function(result, proceed){
				var engine = this;
				$.info.show({
					text:'<p>Игра пройдена!</p><p>Всего Вы играли '+result.time+' секунд и набрали '+result.score+' oчков</p>',
					callback: function(){
						proceed();
						if(engine.gamefield){
							$time.empty();
							$score.empty();
							$.info.show({
								text:'ПОЗДРАВЛЯЕМ С ПОБЕДОЙ!',
								callback: function(){
									location.reload(true);
								}
							});
						}
					}	
				});
			},
			scorechange: function(score){
				$score.html("Съедено фруктов: "+ score);
			},
			timechange: function(time){
				$time.html("Игра идёт уже " + time + " секунд");
			},
			gameover: function(){
				$.info.show({
					text:'Змейка безвременно скончалась. Игра окончена..', 
					callback: function(){
						location.reload(true);
					}
				});
			}
		}
	});
	
	engine.create($('.gamefield'));
	
	$(window).keydown(function(e){
		var event = e || window.event;
		var keycode = event.keyCode || event.charCode;
		if(_keys[keycode]){
			engine.command(_keys[keycode]);
		}
	});
});