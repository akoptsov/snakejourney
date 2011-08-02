(function($){
	//"статические" переменные
	_meta = {
		id: 0,
		zindexmin: 9000,
		zindex : function(id){
			return _meta.zindexmodal(id) + 1;
		},
		zindexmodal: function(id){
			return _meta.zindexmin + 2 * id;
		},
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
				},
				buttons: {
					ok: {text: 'Готово', click: function(proceed){ _invoke(proceed, this); }},
					cancel : {text: 'Отмена', click: function(proceed){_invoke(proceed, this); }}
				}
			},
			fadeout: 2000,
			fadein: 1000,
			css: {
				container: { className:'ui-custom-container'},
				modal: {className: 'ui-custom-modal'},
				message: {className: 'ui-custom-message'},
				keypress: {className: 'ui-custom-keypress'},
				button: {className: 'ui-custom-button', classNameHover:'ui-custom-button-hover'}
			}
		},
		show: function(opts){
			_meta.id++;
			
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
			var $body = $('body');
			var options = $.extend(true, {}, $.info.defaults, opts || {});
			var style= {
				modal:function() { return {
						'position' :'absolute',
						'z-index'  :  _meta.zindexmodal(_meta.id), 
						'height' :  $document.height(),
						'width'  :  $document.width(), 
						'background-color' : 'gray' 
					};
				},
				container: function(){
					return{
						'position':'absolute',
						'z-index': _meta.zindex(_meta.id),
						'top': ( $document.height() - container.height())/2,
						'left': ( $document.width() - container.width())/2
					}
				}
			};
			var modal = $('<div></div>')
				.addClass(options.css.modal.className)
				.hide().appendTo($body);
			var container = $('<table></table>')
				.addClass(options.css.container.className)
				.hide().appendTo($body);
			var message = $('<td></td>').addClass(options.css.message.className);
			$('<tr></tr>').append(message).appendTo(container);

			if(!_meta.types[options.type]){
				options.type = _meta.types.blink;
			}
			
			if(options.type == _meta.types.keypress){
				var keyinfo = $('<td></td>')
					.html('['+options.strings.keypress+options.types.keypress.name+']')
					.addClass(options.css.keypress.className).hide();
				
				var keytimer = setInterval(function(){
					keyinfo.fadeIn(options.types.keypress.fade).fadeOut(options.types.keypress.fade);
				}, 2*options.types.keypress.fade);
				
				$('<tr></tr>').append(keyinfo).appendTo(container);
			}
			
			message.html(options.text || '');
			

			
			var _blockkeys = function(event){
				if(event.keyCode != _meta.keys.refresh){
					if( options.type==_meta.types.keypress && 
						event.keyCode==options.types.keypress.key){
						_close();
					}
					event.stopPropagation();
					event.preventDefault();
				}
			};
			
			var _clear = function(){
				modal.remove();
				container.remove();
				if(options.type == _meta.types.keypress && keytimer){
					clearInterval(keytimer);
				}
				$document.unbind('keydown',_blockkeys);
			};
			
			var _close = function(){
				modal.fadeOut(options.fadeout);
				container.fadeOut(options.fadeout, function(){
					_clear();
					_invoke(options.callback, window);
				})
			}
			
			modal.css(style.modal());
			container.css(style.container());
			//check
			 $document.bind('keydown', _blockkeys);
			
			modal.fadeTo(options.fadein, 0.5);
			if(options.type==_meta.types.blink){
				container.fadeIn(options.fadein, _close);
			} else {
				container.fadeIn(options.fadein);
			}
		}
	};
})(jQuery);