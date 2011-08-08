(function($){
	//"статические" переменные
	var _meta = {
		types:{
			blink: 'blink',
			keypress: 'keypress',
			buttons: 'buttons'
		}, keys: {
			refresh: 116
		}
	}
	
	
	$.info = {
		defaults: {
			strings: {
				keypress : 'Для продолжения нажмите '
			},
			type: _meta.types.blink,
			types: {
				blink: {
					
				},
				keypress: {
					name: 'Пробел',
					key: 32,
					fade: 1000
				}
			},
			css: {
				container: { className:'ui-custom-info-container'},
				message: {className: 'ui-custom-info-message'},
				keypress: {className: 'ui-custom-info-keypress'}
			},
			modal : {
				
			},
			callback: function(){}
		},
		show: function(opts){
			function _button(btnopts){
				if(btnopts.text && btnopts.click){
					return btn =  ('<span></span>').text(btnopts.text)
						.addClass(options.css.button.className)
						.hover(
							function(){$(this).addClass(btnstyle.classNameHover|| '');}, 
							function(){$(this).removeClass(btnstyle.classNameHover||'')}
						).click(function(){ _invoke(options.btnopts.click, this, _clear);});
				}
			};
			
			var $document = $(document);

			var options = $.extend(true, {}, $.info.defaults, opts || {});
			if(!_meta.types[options.type]){
				options.type = _meta.types.blink;
			}

			var container = $('<table></table>').addClass(options.css.container.className);
			var message = $('<td></td>').html(options.text || '').addClass(options.css.message.className);
			$('<tr></tr>').append(message).appendTo(container);

			
			if(options.type == _meta.types.keypress){
				var keyinfo = $('<td></td>')
					.html('['+options.strings.keypress+options.types.keypress.name+']')
					.addClass(options.css.keypress.className).hide();
				
				var keytimer = setInterval(function(){
					keyinfo.fadeIn(options.types.keypress.fade).fadeOut(options.types.keypress.fade);
				}, 2*options.types.keypress.fade);
				
				$('<tr></tr>').append(keyinfo).appendTo(container);
			}
			
			var modalopts = $.extend(true, {}, options.modal, {
					callbacks: {
						show: function(){
							$document.bind('keydown', _blockkeys);
						},
						clear: function(){
							$document.unbind('keydown', _blockkeys);
						}
					}
				});
			container.modal(
				modalopts
			);
			
			var _blockkeys = function(event){
				if(event.keyCode != _meta.keys.refresh){
					if( options.type==_meta.types.keypress && 
						event.keyCode==options.types.keypress.key){
						container.modal('hide', 
							function(){ container.modal('clear', options.callback || $.noop); }
						);
					}
					event.stopPropagation();
					event.preventDefault();
				}
			};
			
			if(options.type==_meta.types.blink){
				container.modal('show', function(){
					container.modal('hide', function(){
						container.modal('clear', options.callback || $.noop);
					});
				});
			} else {
					container.modal('show');
			}
		}
	};
})(jQuery);