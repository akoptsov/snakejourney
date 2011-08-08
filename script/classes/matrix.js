
//  ласс матрицы.
//
if(!defaults){
	var defaults = {};
}

defaults.Matrix = {
	id: 'matrix',
	height : 20,
	width: 20,
	cell: { 
		height: 20,
		width: 20,
		className: 'cell'
	},
	className: 'matrix',
	border:{
		enabled:true,
		width:1
	},
	occupied: {
		className : 'occupied'
	}
};


var _div = '<div></div>';
var _data = {
	coords: 'matrix-data-cell-coords'
} ;

function Matrix(opts){
	var matrix = this;
	var options = opts || {};
	
	function _get(name){
		return options[name]||defaults.Matrix[name];
	}
	
	function _cell(opts){
		return $(_div).addClass(opts.className).css({'width': opts.width, 'height': opts.height});
	}
	
	matrix.width = _get('width');
	matrix.height = _get('height');
	matrix.id = _get('id');
	
	//создание матрицы внутри родител€
	matrix.create = function($parent){
		if($parent){
			var $widget = matrix.widget = $(_div).addClass(_get('className')).appendTo($parent);
			
			if(matrix.id){
				$widget.attr('id', matrix.id);
			}
			if(matrix.width && matrix.height){
				var border = _get('border');
				var _offset = border && border.enabled ? border.width:0;
				var _pxWidth = matrix.width* (+_get('cell').width + _offset);
				var _pxHeight = matrix.height*(+_get('cell').height + _offset);
				$widget.css({'width': _pxWidth, 'height': _pxHeight});
				
				var cellOpts = _get('cell');
				if(cellOpts.width && cellOpts.height){
					var lastcoords = {row:0, col:0};
					for(var i = 0; i < matrix.width * matrix.height; i++){
						//кешируем координаты в данные при создании, чтоб каждый раз их не вычисл€ть
						var col = i % matrix.width, row = (i - col) / matrix.width;
						/*
						var dx = col-lastcoords.col, dy= row-lastcoords.row;
						if(dx*dx+dy*dy>1)
						{
							alert(i+" "+col+" "+row);
						}
						*/
						lastcoords={row:row, col:col};
						_cell(cellOpts).data(_data.coords, {row : row, col: col }).appendTo($widget);
					}
					return true;
				}
				
			}
		}
		return false;
	};
	
	//возвращает объект - €чейку матрицы
	matrix.cell = function(row, col){
		if(0<=row && row< matrix.width){
			if(0<=col && col < matrix.height){
				if(matrix.widget){
					return matrix.widget.children(':eq('+(row*(matrix.width)+col)+')');
				}
			}
		}
	};
	
	//провер€ет, не зан€та ли €чейка матрицы
	matrix.get = function(row, col){
		var cell = matrix.cell(row, col);
		if(cell){
			return cell.hasClass(_get('occupied').className);
		}
	};
	
	//помечает €чейку матрицы как зан€тую
	matrix.set = function(row, col, value){
		var cell = matrix.cell(row, col);
		if(cell){
			if(value===false){
				cell.removeClass(_get('occupied').className);
				return true;
			} else if (value===true){
				cell.addClass(_get('occupied').className);
				return true;
			}
		}
		return false;
	};
	
	//ќпредел€ет координаты по индексу (вынима€ их из кеша - всЄ уже посчитано)
	matrix.find = function($element){
		var cached = $element.data(_data.coords);
		if(cached){
			//копируем объект, чтобы его можно было безопасно мен€ть
			return {row: cached.row, col:cached.col};
		}
	};
	
	//”дал€ет матрицу
	matrix.destroy = function(){
		if(matrix.widget){
			matrix.widget.remove();
		}
	};
}

