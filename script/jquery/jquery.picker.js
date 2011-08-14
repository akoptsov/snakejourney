(function($){
	var _name = 'picker';
	
	var _meta = {
		name: _name,
		data: {
			value: _name+'-data-value',
			widget: _name+'-data-widget'
		}
	};
	
	var _picker = {
		name: _meta.name,
		defaults: {
			css: {
				selection : {
					className : 'ui-custom-picker-selection'
				},
				item: { 
					normal : {
						className : 'ui-custom-picker-item' 
					},
					hover: {
						className: 'ui-custom-picker-item-hover'
					},
					selected: {
						className: 'ui-custom-picker-item-selected'
					}
				},
				container: {
					className: 'ui-custom-picker-container'
				}
			},
			items : [{name:'One', value:1}],
			initial:{
				index: 0
			} 
		},
		methods: {
			init: function(opts){
				var options = $.extend(true, {}, $[_meta.name].defaults, opts);
				var body = $(document.body);
				this.each(function(){
					var $element = $(this);
					
					if($.isArray(options.items)){
					
						var _item = function(data, click, selected){
							var item = $('<div></div>').html(data.name)
								.data(_meta.data.value, data.value)
								.addClass(options.css.item.normal.className)
								.hover(
									function(){$(this).addClass(options.css.item.hover.className);},
									function(){$(this).removeClass(options.css.item.hover.className);}
								).click(function(){
									$(this).addClass(options.css.item.selected.className);
								});
							
							if(selected){
								var equal = true;
								for(property in selected){
									if(selected[property]!=data.value[property]){
										equal=false;
									}
								}
								
								if(equal){
									item.addClass(options.css.item.selected.className);
								}
							}
							
							if($.isFunction(click)){
								item.bind('click', click);
							}
							return item;
						};
						
						var _selection = _item(options.items[options.initial.index], function(event){
							event.stopPropagation();
							_expand(_selection);
						}).removeClass(options.css.item.normal.className)
						.addClass(options.css.selection.className)
						.appendTo($element);
							
						var _menu = function(data, item){
							var location = item.offset();
							var widget = $('<div></div>').addClass(options.css.container.className)
							.css({
								'position': 'absolute', 
								'left': location.left, 
								'top' : location.top+item.outerHeight(), 
								'min-width' : item.innerWidth(),
								'z-index': '9900'
							});
							
							if($.isArray(data)){
								$.each(data, function(index, value){
									widget.append(_item(value, function(event){
										widget.find('.'+options.css.item.selected.className).removeClass(options.css.item.selected.className);
										_selection.html(value.name).data(_meta.data.value, value.value);
									}, $element.picker('value')));
								});
							}
							return widget;
						}
						
						var _expand = function(item){
							var $menu = _menu(options.items, item).hide().appendTo(body)
								.animate({'height':'show'}, 'fast');
							$(document).one('click', function(event){
								$menu.animate({'height':'hide'}, 'fast', function(){
									$menu.remove();
								});
							});
						};
						
						$element.data(_meta.data.widget, _selection);
					
					}
				});
				return this;
			},
			value: function(val){
				var $element = $(this.get(0));
				if($element){
					var $widget = $element.data(_meta.data.widget);
					if($widget){
						if(arguments.length > 0){
							$widget.data(_meta.data.value, val);
						} else {
							return $widget.data(_meta.data.value) || undefined;
						}
					}
				}
			}
		}
	};
	
	_register(_picker);

})(jQuery);