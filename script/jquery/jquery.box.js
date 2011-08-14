(function($){
	//"статические" переменные
	var _meta = {
		name: 'box'
	}
	
	

	var box = {
		name: _meta.name,
		defaults: {
			css: {
				container: {
					className : 'ui-custom-box-container'
				},
				header: {
					className : 'ui-custom-box-header'
				},
				content: {
					className : 'ui-custom-box-content'
				},
				buttonpanel: {
					className : 'ui-custom-box-buttonpanel'
				},
				button: {
					className : 'ui-custom-button',
					classNameHover : 'ui-custom-button-hover'
				}
			},
			header: {
				show: true
			},
			buttons: {
					cancel : {text: 'Отмена', click: function(proceed){_invoke(proceed, this); }},
					ok: {text: 'Готово', click: function(proceed){ _invoke(proceed, this); }}
			},
			modal : {
				
			}
		},
		methods: {
			init: function(opts){
				var options = $.extend(true, {}, $[_meta.name].defaults, opts);

				var container = $('<div></div>').addClass(options.css.container.className);
				var header = $('<div></div>').addClass(options.css.header.className);
				if(options.header.text){
					header.html(options.header.text);
				}
				
				var content = $('<div></div>').addClass(options.css.content.className);
				this.each(function(){
					content.append($(this));
				});
				
				var buttonpanel = $('<div></div>').addClass(options.css.buttonpanel.className);
				if(options.buttons){
					$.each(options.buttons, function(index, value){
						if(value.show !== false){
							buttonpanel.append(_button(value, container));
						}
					});
				}
				
				function _button(btnopts, form){
					if(btnopts.text && btnopts.click){
						return $('<span></span>')
							.addClass(options.css.button.className)
							.hover(
								function(){$(this).addClass(options.css.button.classNameHover|| '');}, 
								function(){$(this).removeClass(options.css.button.classNameHover||'')}
							)
							.text(btnopts.text)
							.click(function(event){ 
								_invoke(
									btnopts.click, 
									form, 
									function(action){ 
										container.modal('hide', function(){ 
											container.modal('clear', action);
										});
									}
								);
							});
					}
				};
				
				container.append(content, buttonpanel);
				if(options.header.show!==false){
					container.prepend(header);
				}
				
				container.modal(options.modal).modal('show');
				
				return this;
			}
		}
	};
	
	_register(box);
})(jQuery);