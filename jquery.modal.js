(function($){
	//"статические" переменные
	_meta = {
		name: 'modal'
		id: 0,
		zindexmin: 9000,
		zindex : function(id){
			return _meta.zindexmodal(id) + 1;
		},
		zindexmodal: function(id){
			return _meta.zindexmin + 2 * id;
		}, events : {
			show: 'show.modal',
			hide: 'hide.modal',
			clear: 'clear.modal'
		}, data: {
			show: 'modal-data-show',
			hide: 'modal-data-hide',
			clear: 'modal-data-clear'
		}
	}
	
	
	var modal = {
		name = _meta.name,
		defaults: {
			fadeout: 2000,
			fadein: 1000,
			css: {
				container: { className:'ui-custom-container'},
				modal: {className: 'ui-custom-modal'},
				message: {className: 'ui-custom-message'},
				keypress: {className: 'ui-custom-keypress'},
				button: {className: 'ui-custom-button', classNameHover:'ui-custom-button-hover'}
			},
			callbacks: {
				show: function(){},
				hide: function(){},
				clear: function(){}
			}
		},	
		methods = {
			init: function(opts){
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
				
				
				this.each(function(index){
					var $element = $(this);
					var modal = $('<div></div>')
						.addClass(options.css.modal.className)
						.hide().appendTo($body);
					var container = $('<div></div>')
						.addClass(options.css.container.className)
						.hide().appendTo($body);

					$element.appendTo(container);
					
					$.each(_meta.events, function(name, value){
						$element.bind(value, options.callbacks[name]);
					});
					
					
					var _private = {
						clear : function(nextaction){
							modal.remove();
							container.remove();
							$.element.trigger(_meta.events.clear);
							if($.isFunction(nextaction)){
								nextaction();
							}
						},
						hide : function(nextaction){
							modal.fadeOut(options.fadeout);
							container.fadeOut(options.fadeout, function(){
								$element.trigger(_meta.events.hide);
								if($.isFunction(nextaction)){
									nextaction();
								}
							});
						},
						show : function(nextaction) {
							$element.trigger(meta.events.show);
							modal.css(style.modal());
							container.css(style.container());
							modal.fadeTo(options.fadein, 0.5);
							container.fadeIn(options.fadein, $.isFunction(nextaction) ? nextaction || $noop);
						}
					};
					
					$.each(_meta.data, function(name, value)){
						$element.data(value, _private[name]);
					}
				});
			}
		}	
	};
	
	$.each(['hide', 'show', 'clear'], function(mname){
		modal[mname] = function(nextaction){
			var $element = $(this[0]);
			var method = $element.data(mname);
			if($.isFunction(method)){
				method.call($element[0], nextaction);
			}
		}
	});
	
	_register(modal);
	
})(jQuery);