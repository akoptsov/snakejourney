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
	
	var engine = new Engine({
		events: {
			scorechange: function(score){
				$score.html("������� �������: "+ score);
			},
			timechange: function(time){
				$time.html("���� ��� ��� " + time + " ������");
			},
			endgame: function(){
				alert('������ ����������� ����������. ���� ��������..');
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