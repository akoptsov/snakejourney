(function($){
	//"статические" переменные
	var _meta = {
		name: 'modal',
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
		name : _meta.name,
		defaults: {
			fadeout: 2000,
			fadein: 1000,
			css: {
				container: { className:'ui-custom-modal-container'},
				overlay: {className: 'ui-custom-modal-overlay'},
			},
			callbacks: {
				show: function(){},
				hide: function(){},
				clear: function(){}
			}
		},	
		methods : {
			init: function(opts){
				_meta.id++;
				
				var $body = $('body');
				var $document = $(document);
				
				var options = $.extend(true, {}, $.modal.defaults, opts || {});
				var style= {
					overlay:function() { return {
							'position' :'absolute',
							'z-index'  :  _meta.zindexmodal(_meta.id), 
							'height' :  $document.height(),
							'width'  :  $document.width(), 
							'background-color' : 'gray' 
						};
					},
					container: function(container){
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
					var overlay = $('<div></div>')
						.addClass(options.css.overlay.className)
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
							$element.trigger(_meta.events.clear);
							overlay.remove();
							container.remove();
							if($.isFunction(nextaction)){
								nextaction();
							}
						},
						hide : function(nextaction){
							overlay.fadeOut(options.fadeout);
							container.fadeOut(options.fadeout, function(){
								$element.trigger(_meta.events.hide);
								if($.isFunction(nextaction)){
									nextaction();
								}
							});
						},
						show : function(nextaction) {
							$element.trigger(_meta.events.show);
							overlay.css(style.overlay());
							container.css(style.container(container));
							overlay.fadeTo(options.fadein, 0.5);
							container.fadeIn(options.fadein, function() {
								if($.isFunction(nextaction)){
									nextaction();
								}
							});
						}
					};
					
					$.each(_meta.data, function(name, value){
						$element.data(value, _private[name]);
					});
				});
			}
		}	
	};
	
	$.each(['hide', 'show', 'clear'], function(index, mname){
		modal.methods[mname] = function(nextaction){
			var $element = $(this[0]);
			var method = $element.data(_meta.data[mname]);
			if($.isFunction(method)){
				method.call($element[0], nextaction);
			}
		}
	});
	
	_register(modal);
	
})(jQuery);