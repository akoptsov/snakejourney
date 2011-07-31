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
		}
	}

	$.info = {
		defaults: {
			fadeout: 2000,
			fadein: 1000,
			css: {
				container: { className:'ui-custom-container'},
				modal: {className: 'ui-custom-modal'},
				message: {className: 'ui-custom-message'}
			}
		},
		show: function(opts){
			_meta.id++;
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
			
			
			message.html(options.text || '');
			

			var _blockmouse = function(event){
				event.stopPropagation();
				event.preventDefault();
			};
			
			var _blockkeys = function(event){
				event.stopPropagation();
				event.preventDefault();
			};
			
			var _clear = function(){
				modal.remove();
				container.remove();
				$document.unbind('keydown',_blockkeys);
				$document.unbind('mousedown', _blockmouse);
			}
			
			modal.css(style.modal());
			container.css(style.container());
			//check
			 $document.bind('keydown', _blockkeys);
			 $document.bind('mousedown', _blockmouse);
			modal.fadeTo(options.fadein, 0.5).fadeOut(options.fadeout);
			container.fadeIn(options.fadein).fadeOut(options.fadeout, function(){
				_clear();
				_invoke(options.callback, window);
			});
		}
	};
})(jQuery);