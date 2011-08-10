var _keys = {
	/*������� �����*/	37: 'left',
	/*������� �����*/	38: 'up',
	/*������� ������*/	39: 'right',
	/*������� ����*/	40: 'down',
	/*������*/			32: 'pause'
};

var settings = {
	classes : {
		menu : {
			container: 'startmenu-container',
			button : 'startmenu-button',
			buttonhover: 'startment-button-hover'
		},
		scores: {
			container: 'scores-container',
			header : 'scores-row-header',
			row: 'scores-row'
		}
	},
	scores: {
		titles: {
			Name: '�����',
			Score: '����',
			Time: '�����'
		},
		count : 10
	}
}


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
					text:'<p>���� ��������!</p><p>'+((player.Name)?(player.Name+', �'):'�')+'���� �� ������ '+result.time+' ������ � ������� '+result.score+' o����</p>',
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
			gameover: function(result){
				$.info.show({
					type:'keypress', 
					text:'������ ����������� ����������. ���� ��������..', 
					callback: function(){
						$.info.show({
							type:'keypress', 
							text:'<p>'+((player.Name)?(player.Name+', �'):'�')+'���� �� ������ '+result.time+' ������ � ������� '+result.score+' o����</p>',
							callback: function(){
								if(player.Id && result.time && result.score)
								$.service.call({
									url: 'ajax/setscore.php',
									data: { playerid : player.Id, time: result.time, score:result.score },
									success: function(data){
										location.reload(true);
									}
								});
								
							}
						});
					}
				});
			}
		}
	});

	var startform =$('<div></div>').addClass(settings.classes.menu.container);
	
	var _button = function(opts){
		return $('<div></div>').html(opts.text||'')
			.addClass(opts.className||settings.classes.menu.button)
			.hover(
				function(){$(this).addClass(settings.classes.menu.buttonhover);},
				function(){$(this).removeClass(settings.classes.menu.buttonhover);}
			);
	};
	
	var _buttons = {
		New : _button({text: 'Ho��� ����'}).appendTo(startform).click(function(){
			startform.modal('hide', function(){ 
				startform.modal('clear', function(){
					var userform = $('<div></div>');
					var text = $('<input type="text"/>').css('width', '97%');
					userform.append(text).box({
						header: {text: '������� ���� ���'},
						buttons: {
							ok: {
								click:function(proceed){ 
									userform.find('p').remove();
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
										
									} else {
										userform.prepend('<p>�������� ���� ���-����</p><p>������ �� \'myname; drop table Players; --\'!</p>');
									}
								}
							}, cancel: {
								show: false
							}
						}
					});
				})
			})
		}),
		Scores : _button({text : '������� �������'}).appendTo(startform).click(function(){
				scores=$('<table></table>').addClass(settings.classes.scores.container);
				var _row = function(value){
					return $('<tr></tr>').append('<td>'+value.Name+'</td>','<td>'+value.Score+'</td>','<td>'+value.Time+'</td>');
				};
				titlerow= _row(settings.scores.titles).appendTo(scores).addClass(settings.classes.scores.header);
				

				$.service.call({
					url: 'ajax/getscores.php',
					data: {count : settings.scores.count},
					success: function(data){
						var json = $.parseJSON(data);
						if(json.length){
							$.each(json, function(index, value){
								_row(value).addClass(settings.classes.scores.row).appendTo(scores);
							});
							scores.modal().modal('show', function(){
								scores.click(function(){
									scores.modal('hide', function(){scores.modal('clear');});
								});
							});
						}
					}
				});
		})
	}
	
	startform.modal().modal('show');

	
	
	
	$(window).keydown(function(e){
		var event = e || window.event;
		var keycode = event.keyCode || event.charCode;
		if(_keys[keycode]){
			engine.command(_keys[keycode]);
		}
	});
});