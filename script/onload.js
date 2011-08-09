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
							return '������� ������: ��������� ���� ����� '+ (level.snake?(level.snake.length() + level.finish.score): level.finish.score)
						}
					} else {
						return '������� ������: ��������� ���� ����� '+ (level.snake?(level.snake.length() + level.finish.score): level.finish.score) +' �� '+level.finish.time+' ������';
					}
				})());
			},
			endlevel: function(level, result, proceed){
				$.info.show({
					type:'keypress', 
					text:'<p>������� ��������</p><p>'+((player.Name)?(player.Name+', '):'')+'�� ������ '+result.time+' ������ � ������� '+result.score+' o����</p>',
					callback: function(){
						proceed();
					}
				});
			},
			endgame: function(result, proceed){
				var engine = this;
				$.info.show({
					type:'keypress', 
					text:'<p>���� ��������!</p><p>'+((player.Name)?(player.Name+', '):'')+'����� �� ������ '+result.time+' ������ � ������� '+result.score+' o����</p>',
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
										text:'����������� � �������!',
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
					text: '���� ��������������',
					callback: function(){
						engine.command('pause');
					}
				})
			},
			scorechange: function(score){
				$score.html("������� �������: "+ score);
			},
			timechange: function(time){
				$time.html("���� ��� ��� " + time + " ������");
			},
			gameover: function(){
				$.info.show({
					type:'keypress', 
					text:'������ ����������� ����������. ���� ��������..', 
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
		header: {text: '������� ���� ���'},
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