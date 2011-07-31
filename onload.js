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
	
	var engine = new Engine({
		events: {
			scorechange: function(score){
				$score.html("Съедено фруктов: "+ score);
			},
			timechange: function(time){
				$time.html("Игра идёт уже " + time + " секунд");
			},
			endgame: function(){
				alert('Змейка безвременно скончалась. Игра окончена..');
				window.location.reload(true);
			}
		}
	});
	
	engine.create($('.gamefield'));
	
	window.onkeydown = function(e){
		var event = e || window.event;
		var keycode = event.keyCode || event.charCode;
		if(_keys[keycode]){
			engine.command(_keys[keycode]);
		}
	};
});