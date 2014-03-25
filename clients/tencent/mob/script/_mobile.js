(function($){
var $win = $(window); $body = $('body'); var $doc = $(document);
var $FF = $.browser.mozilla,$webkit = $.browser.webkit,$safari = $.browser.safari;
var $ipad = navigator.userAgent.toLowerCase().match(/ipad/i) == "ipad";
var $msie = $.browser.msie,$ie6 = $msie&&parseFloat($.browser.version)<7 , $ie8 = $msie&&parseFloat($.browser.version)<9 ;
var $winos = navigator.platform.toLowerCase().indexOf("win")>-1?true:false;
var _w,_h,_dw=640,_dh=880;
try{document.domain = "qq.com";}catch(e$$5){}
$.fx.interval = 40;

$f = window.$f || {
	NS:{},
	resizeHandle:function(e){
		var _=$f;
		_w =  640,_h = $win.height();
		if(_h<1.05*_w){_h=Math.round(_w*_dh/_dw);}
		$('.main').height(_h);
		$('.view').each(function(index, element) {
			$(this).css({height:_h});//,top:index*_h
		});
		$('.container').css({height:_h*$('.view').length});
		$('.view_bg img').each(function(index, element) {
			var _bw=$(this).data('w'),_bh=$(this).data('h'),_s = Math.max(_w/_bw,_h/_bh);
			$(this).css({width:_s*_bw,height:_s*_bh,marginLeft:-(_s*_bw)/2,marginTop:-(_s*_bh)/2,left:'50%',top:'50%'});
		});
	},
	cssInit:function(){
		var _ = this,__='cssInit';
		for(var i in _){i.indexOf('Init')>0&&i!=__&&$.isFunction(_[i])&&_[i]();}
		return;
	},
	init:function(){
		var self = this;
		$win.resize(self.resizeHandle);
		self.cssInit();
		$win.trigger("resize");
	},
	renderNav:function(_i){
		var _=this,$nav=$('.nav li');
		$nav.removeClass('cur').eq(_i).addClass('cur');
	},
	pageInit:function(){
		var _=this,$dir=$('.B_dir'),_C=1,$v=$('.view'),_s=$v.length,_cur,_tar,$m=$('.container'),_t=550,_e='easeInOutSine';
		$win.bind('load',function(){
			setTimeout(function(){
				$('#view1 .load').remove();
				$('#view1 .tip').css({display:'block',opacity:1}).transition({opacity:1},500);
				__img__=null;_C=0;
			},1500);
		});
		
		$dir.bind('click',function(){
			var _i = !$dir.index(this)?-1:1;_cur = $v.index($v.filter('.cur')),_tar = _cur+_i;
			if(!_C&&_tar>=0&&_tar<_s){
				_C=1;$v.eq(_cur).trigger('leave');$v.eq(_tar).trigger('enter');
			}
		});
		$v.bind('enter',function(){
			var _this=this,__tar=_tar;
			$(this).stop().addClass('cur').css({zIndex:1});//.find('.view_bg').css({y:_h*(_tar>_cur?-0.65:0.65)}).transition({y:0},_t,_e);
			$m.stop().transition({y:-1*_tar*_h},_t,_e,function(){setTimeout(function(){_C=0},250);_.renderNav(__tar)});
		}).bind('leave',function(){
			var _this=this;
			$(this).stop(true,true).removeClass('cur').css({zIndex:0}).find('.view_bg').transition({y:_h*(_cur>_tar?-0.65:0.65)},_t,_e,function(){$(this).css({y:0});});
		});
		$('#view2,#view3').bind('enter',function(){
			var _this=this,_s = $(_this).find('ul').length-1;
			$(this).find('ul').each(function(index, element) {
				var _d = _tar>_cur?1:-1,_i = _d>0?index+1:_s+1-index;
				$(this).stop().transition({y:_h*0.5*_d*_i},0).transition({y:0},_t+_i*250,_e);//+_i*250
			});
		}).bind('leave',function(){
			var _this=this,_s = $(_this).find('ul').length-1;
			$(this).find('ul').each(function(index, element) {
				var _d = _cur>_tar?1:-1,_i = _d>0?index+1:_s+1-index;
				$(this).transition({y:_h*0.5*_d*_i},_t+_i*250,_e);//+_i*250
			});
		});
		
		$('body').hammer({ drag_lock_to_axis: true }).on("drag swipeup swipedown",function(ev){
			ev.gesture.preventDefault();
			ev.gesture.stopPropagation();
			ev.stopPropagation();  
			ev.preventDefault(); 
			switch(ev.type){
				case 'swipedown':
					$dir.eq(0).trigger('click');
				break;
				case 'swipeup':
					$dir.eq(1).trigger('click');
				break;
			}
		});
		//page
		var $link=$('.view ul a'),$w=$('.wrapper'),$person=$('.person'),_pl=$person.length,_e1='easeInOutCubic',_e2='linear';
		$link.bind('click',function(){
			if(!_C){
				var _id=$(this).data('p');
				if(!$person.filter('#'+_id).get(0))return;
				_C=1,_select(_id),$w.eq(1).stop().transition({y:-_h},_t,_e1,function(){_C=0;});
			}
		});
		$w.eq(1).hammer({drag_lock_to_axis:true}).on("drag swipeup swipedown swipeleft swiperight",function(ev){
			ev.gesture.preventDefault();
			ev.gesture.stopPropagation();
			ev.stopPropagation();  
			ev.preventDefault(); 
			switch(ev.type){
				case 'swipedown':
					$(this).trigger('return');
				break;
				case 'swipeleft':
					_slider(1);
				break;
				case 'swiperight':
					_slider(-1);
				break;
				default:
					
				break;
			}
		}).bind('return',function(){
			if(!_C){
				_C=1;$w.eq(1).stop().transition({y:-0},_t,_e1,function(){_C=0;})
				//$w.eq(0).stop().css({zIndex:1}).transition({y:0},_t,_e1);
			}
		}).find('.close').bind('click',function(){
			$w.eq(1).trigger('return');
		}),_slider=function(dir){
			//dir=dir&&1;
			if(!_C){
				_C=1;
				var _cur=$person.index($person.filter('.cur')),_tar=(__tar=_cur+dir)<0?_pl-1:__tar>=_pl?0:__tar;
				$person.eq(_tar).stop().transition({x:dir<0?-640:640},0).css({display:'block',zIndex:1}).transition({x:0},_t,_e1,function(){
					$person.eq(_cur).css({display:'none'}).removeClass('cur');$(this).addClass('cur').css({zIndex:0});_C=0;
				})
			}
		},_select=function(id){
			$person.hide().removeClass('cur').filter('#'+id).addClass('cur').css({display:'block'}).transition({x:0},0);
		};
	},
	slideClickHandler:function(_self,_cls,_tar,_dur,_f,_CLICK){
		var self = this;
		if(!$(_self).hasClass("current")&&(!_CLICK||!_CLICK.state)){
			var f = $(_cls).index($(_cls+'.current'));
			var t = $(_cls).index($(_self));
			_CLICK.state = true;
			self.slideRender($(_tar),f,t,_dur,_f,_CLICK?function(){_CLICK.state = false;}:null);
			$(_cls).eq(f).removeClass("current");$(_cls).eq(t).addClass("current");
		}
	},
	slideLeftRightHanler:function(_self,_cls,_nav){
		var s = $(_nav).size(),i = $(_cls).index(_self)==0?-1:1;
		var f = $(_nav).index($(_nav+".current")), t = f+i<0?s-1:f+i>=s?0:f+i;
		$(_nav).eq(t).trigger("click",(f+i<0||f+i>=s)?true:false);
	},
	slideRender:function(tar,f,t,dur,flag,c){
		var $tar = $(tar);
		$tar.eq(t).stop(true,false).css({"display":"block","left":!!flag?(f>t?"100%":"-100%"):(f>t?"-100%":"100%"),"z-index":1}).animate({left:"0%"},dur,"easeInOutSine",c);
		$tar.eq(t).trigger("slideIn");
		$tar.eq(f).stop(true,false).css({"display":"block","z-index":0}).animate({left:!!flag?(f>t?"-100%":"100%"):(f>t?"100%":"-100%")},dur+50,"easeInOutSine",function(){
			$(this).hide();
			$(this).trigger("slideOut");
		});
		$tar.eq(f).removeClass("current");$tar.eq(t).addClass("current");
	},
	fadeLeftRightHandler:function(_self,_cls,$tars){
		var s = $(_nav).size(),i = $(_cls).index(_self)==0?-1:1;
		var f = $(_nav).index($(_nav+".current")), t = f+i<0?s-1:f+i>=s?0:f+i;
		$tars.eq(f).fadeOut(350,function(){
			$tars.eq(t).fadeIn(350);
		});
	},
	
	TPL:function(template, data) {
	  return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
		var keys = key.split("."), v = data[keys.shift()];
		for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
		return (typeof v !== "undefined" && v !== null) ? v : "";
	  });
	},
	cssCreator:function(a,b){
		var property = {};
		property[a]=property["-moz-"+a]=property["-webkit-"+a]=property["-ms-"+a]=property["-o-"+a]=b;
		return property;
	},
	pxToInt:function(str){
		return str.indexOf("px")>-1?Math.round(parseFloat(str.split('px')[0])):str;
	},
	shuffleArray: function(arr){
		for(var j, x, i = arr.length; i; j = parseInt(Math.random()* i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	},
	sizeOf:function(o){
		var counter = 0;
		for(var i in o)counter++;
		return counter;
	},
	objTostr:function(o,s,t){
		var str = "";s = !!s?s:"";var k=!!t?"":" ";
		for(var i in o){
			str+=(s+i+k);
		}
		return str;
	},
	objTostrP:function(o,n,s,t){
		var str = "";s = !!s?s:"";var k=!!t?"":" ";
		for(var i in o){
			str+=(s+o[i][n]+k);
		}
		return str;
	},
	
	is: function(A, _) {
		var $ = Object.prototype.toString.call(_).slice(8, -1).toLowerCase();
		return _ !== undefined && _ !== null && $ === A.toLowerCase()
	},
	isFunction : function(o){return this.is('function',o);},
	isObject : function(o){return this.is('object',o);},
	isString : function(o){return this.is('string',o);},
	isArray : function(o){return this.is('array',o);},
	isBoolean : function(o){return this.is('boolean',o);},
	isDate : function(o){return this.is('date',o);},
	isNumber : function(o){return this.is('number',o);},
	isUndefined : function(o){return o===undefined;},
	isNull : function(o){return o===null;},
	isEmptyObject : function(o){if(this.isObject(o)){for(var i in o){return false;}return true;}else{return false;}},
	isEmptyArray : function(o){return this.isArray(o)&&o.length==0;},
	isNotEmptyArray : function(o){return this.isArray(o)&&o.length>0;}
};
function log(msg) {
	//if(!$f.test){return;}
	if (window.console && window.console.log)
		window.console.log(msg);//+"|date:"+new Date().getTime()
	else if (window.opera && window.opera.postError)
		window.opera.postError(msg);
};
$().ready(function(e) {
	$f.init();
});

}).call(window,jQuery);