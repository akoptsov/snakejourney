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
	var $requirement = $('<p></p>').addClass('task').appendTo('.info');
	var $time = $('<p></p>').appendTo('.info');
	var $score = $('<p></p>').appendTo('.info');
	
	
	var player = {
		Name:'',
		Id:0
	};
	
	var level = {
		index:0
	};
	
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
							return 'Задание уровня: воспитать змею длины '+ (level.snake?(level.snake.length() + level.finish.score): level.finish.score)
						}
					} else {
						return 'Задание уровня: воспитать змею длины '+ (level.snake?(level.snake.length() + level.finish.score): level.finish.score) +' за '+level.finish.time+' секунд';
					}
				})());
			},
			endlevel: function(level, result, proceed){
				$.info.show({
					type:'keypress', 
					text:'<p>Уровень завершен</p><p>'+((player.Name)?(player.Name+', '):'')+'Вы играли '+result.time+' секунд и набрали '+result.score+' oчков</p>',
					callback: function(){
						proceed();
					}
				});
			},
			endgame: function(result, proceed){
				var engine = this;
				$.info.show({
					type:'keypress', 
					text:'<p>Игра пройдена!</p><p>'+((player.Name)?(player.Name+', '):'')+'Всего Вы играли '+result.time+' секунд и набрали '+result.score+' oчков</p>',
					callback: function(){
						if(player.Id && result.time && result.score)
						$.service.call({
							url: 'ajax/setscore.php',
							data: { playerid : player.Id, time: result.time, score:result.score },
							success: function(data){
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
						
					}	
				});
			},
			pausegame: function(){
				$.info.show({
					type: 'keypress',
					modal: {fadein: 500, fadeout: 100},
					text: 'Игра приостановлена',
					callback: function(){
						engine.command('pause');
					}
				})
			},
			scorechange: function(score){
				$score.html("Съедено фруктов: "+ score);
			},
			timechange: function(time){
				$time.html("Игра идёт уже " + time + " секунд");
			},
			gameover: function(){
				$.info.show({
					type:'keypress', 
					text:'Змейка безвременно скончалась. Игра окончена..', 
					callback: function(){
						location.reload(true);
					}
				});
			}
		}
	});
	
	var field = $('<div></div>');
	var text = $('<input type="text"/>').css('width', '97%');
	field.append(text).box({
		header: {text: 'Введите Ваше имя'},
		buttons: {
			ok: {
				click:function(proceed){ 
					if(text.val()){
						player.Name = text.val();
						$.service.call({
							url: 'ajax/getplayer.php',
							data: {name:player.Name},
							success: function(data){
								if(data){
									player.Id = data;
									proceed(function(){
										engine.create($('.gamefield'));
									});
								}
							}
						});
						
					}
				}
			}, cancel: {
				show: false
			}
		}
	});
	
	
	$(window).keydown(function(e){
		var event = e || window.event;
		var keycode = event.keyCode || event.charCode;
		if(_keys[keycode]){
			engine.command(_keys[keycode]);
		}
	});
});