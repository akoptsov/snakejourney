var _keys = {
	/*������� �����*/	37: 'left',
	/*������� �����*/	38: 'up',
	/*������� ������*/	39: 'right',
	/*������� ����*/	40: 'down',
	/*������*/			32: 'pause'
};
//
// ����� �����.
//
$(function() {
	var $time = $('<p></p>').appendTo('.info');
	var $score = $('<p></p>').appendTo('.info');
	var $requirement = $('<p></p>').appendTo('.info');
	
	
	var engine = new Engine({
		events: {
			startlevel: function(level){
				if(level.name){
					$.info.show({text:(level.name|| '����� �������')});
				}
				$time.empty();
				$score.empty();
				$requirement.html((function(){
					if(!level.finish.score){
						if(level.finish.time){
							return '������� ������: ������������ '+level.finish.time+' ������';
						}
					} else if(!level.finish.time){
						if(level.finish.score){
							return '������� ������: ��������� ����� ����� '+ ((level.snake?(level.snake.length() + level.finish.score): level.finish.score) - 1)
						}
					} else {
						return '������� ������: ��������� ����� ����� '+ ((level.snake?(level.snake.length() + level.finish.score): level.finish.score) - 1)+' �� '+level.finish.time+' ������';
					}
				})());
			},
			endlevel: function(level, result, proceed){
				$.info.show({
					text:'<p>������� ��������</p><p>�� ������ '+result.time+' ������ � ������� '+result.score+' o����</p>',
					callback: function(){
						proceed();
					}
				});
			},
			endgame: function(result, proceed){
				var engine = this;
				$.info.show({
					text:'<p>���� ��������!</p><p>����� �� ������ '+result.time+' ������ � ������� '+result.score+' o����</p>',
					callback: function(){
						proceed();
						if(engine.gamefield){
							$time.empty();
							$score.empty();
							$.info.show({
								text:'����������� � �������!',
								callback: function(){
									location.reload(true);
								}
							});
						}
					}	
				});
			},
			scorechange: function(score){
				$score.html("������� �������: "+ score);
			},
			timechange: function(time){
				$time.html("���� ��� ��� " + time + " ������");
			},
			gameover: function(){
				$.info.show({
					text:'������ ����������� ����������. ���� ��������..', 
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