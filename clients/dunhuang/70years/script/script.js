var $msie=$.browser.msie;
var $msie8=$msie && parseInt($.browser.version) <9;
var $msie9=$msie && parseInt($.browser.version) <=9;
var $DH70={
	getJSONLength:function(json){
		var i=0;
		for(var val in json){
			if(!!json[val]){
				i+=1;
			}
		}
		return i;
	},
	getValueByKey:function (array,key,val,param){
		for(var i=0;i<array.length;i++){
			if(array[i][key]==val){
				return !!param? (array[i][param]) : (array[i]); //param存在，则返回对应值，不传值，则返回对象
			}
		}
	},
	getDataByKey:function(array,key,val){
		var temp=[];
		for(var i=0;i<array.length;i++){
			if(array[i][key]==val){
				temp.push(array[i]);
			}
		}
		return temp.length<=0? null : temp;
	},
	getIndexByKey:function(array,key,val){
		for(var i=0;i<array.length;i++){
			if(array[i][key]==val){
				return i;
			}
		}
	},
	deleteValueByKey:function (array,key,val){
		for(var i=0;i<array.length;i++){
			if(array[i][key]==val){
				array.splice(i,1);
			}
		}
	},
	resizeImgLoader:function(obj,w,h,w2,h2){
		var ow=obj.width || w2 ||0,
			oh=obj.height || h2 || 0;
		w = w || $(window).width();
		h= h || $(window).height();
		//var _scale= ow>oh?Math.max(w/ow,h/oh):Math.min(w/ow,h/oh);
		var _scale= Math.max(w/ow,h/oh);
		$(obj).css({"width":ow*_scale,"height":oh*_scale,"position":"absolute","left":(w-ow*_scale)/2,"top":(h-oh*_scale)/2});
		$(obj).attr("orgw",ow*_scale);
		$(obj).attr("orgh",oh*_scale);
	},
	imgloader:function(src,callback){
		var img=new Image();
		if(typeof(callback)=='function'){
			img.onload=callback;
		}
		img.src=src;
		//清除
		img=null;
	},
	checkTransform:function(){
		if (typeof(window.Modernizr) !== 'undefined') {
			return Modernizr.csstransforms;
		}
		var props = [ 'transformProperty', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform' ];
		var m_style=document.documentElement.style;
		for ( var i in props ) {
			if (m_style[props[i]]!== undefined) {
				return true; //IE9 支持 transform 但是不支持 transition
			}
		}
	},
	//滚动事件
	windwoScrollHandler:function(){
		var sh=$(window).scrollTop(),wh=$(window).height();
		var viewh=sh+wh;

		//debug
		$(".scrollh").html('scrollh:'+sh);
		$(".winh").html('winh:'+wh);
		$(".viewh").html('viewh:'+viewh);
	},
	//滚动锁
	beWheel:false,
	//鼠标滚动事件处理，逻辑判断后 调用页面切换处理方法
	mainWheelHandler:function(e, delta, deltaX, deltaY,isKey){
		if(!$DH70.beWheel){
			$DH70.beWheel=true;
			var $this=$(".section.active"),_c=$(".section").index($this);
			//var _l=$("#main").offset().left,_ww=$(window).width(),_sW=$(this).outerWidth();
			if(delta>0){//上滚
				//if(_c==1){$f.beWheel=false;return;}//禁止向上滚回首屏
				$DH70.mainPageChange(_c,_c-1);
			}else{  //下滚
				//if(_c==0){$f.beWheel=false;return;}//首屏禁止向下滚动
				$DH70.mainPageChange(_c,_c+1);
			}
			setTimeout(function(){
				$DH70.beWheel=false;
			},500);
		}
		return false;
	},
	//页面出场入场 切换逻辑处理.具体动画 在 相应的 pageIn,pageOut事件中处理
	//由于是 竖屏 处理方式，只需要用 beback = c > t
	mainPageChange:function(c,t){
		var _=this;
		var $page=$(".section"),
			_l=$page.size();
		c = c || $page.index($(".section.active")) || 0;
		t= t<0? 0 : (t>=_l? _l-1:t);
		if(c==t){return;}
		$page.eq(c).removeClass('active').trigger('pageOut',(c>t));
		$page.eq(t).addClass('active').trigger('pageIn',(c>t));
		//导航处理
		_.navChange(t);
		return _;
	},
	//导航处理逻辑
	navChange:function(index){
		var $nav=$(".navlist");
		$nav.removeClass("cur").eq(index).addClass("cur");
		if(index==0){
			$(".btn_gotop").fadeOut(300);
		}else{
			$(".btn_gotop").fadeIn(300);
		}
	},
	//resize
	resizeHandler:function(){
		var _w=$(window).width(),_h=$(window).height(),_orgw=1360,_orgh=700;
		var $bg=$(".fullbg");
		_h=_h<=600?600:_h;
		_w=_w<=1200?1200:_w;
		$DH70.config.winHeight=_h;
		$("#main").css({"height":_h});
		var _scale=Math.max(_w/_orgw,_h/_orgh);
		$bg.css({"width":_scale*_orgw,"height":_scale*_orgh,"left":(_w-_scale*_orgw)/2,"top":(_h-_scale*_orgh)/2});
		//其他CSS
		$("#section_3 .topcover").css({"height":_h-280});
		$("#section_2 .topcover").css({"height":_h-195});
		$("#section_1 .topcover").css({"height":_h-70});
		$("#section_1 .timelinecover").css({"width":_w-160});
		$("#nav_wrapper.cur").css({"bottom":_h-100});
	},
	imageAutoAnimate:function(index){
		var _=this;
		index = index || 0;
		var _list=dh70_assets.banner;
		var $parent=$("#banner");
		var $sign=$("#homepage .dotcover .dotlist");
		var $old=$parent.find("img");
		var _w=$parent.width(),_h=$parent.height();
		var _ow=parseFloat($old.attr("orgw")),_oh=parseFloat($old.attr("orgh"));
		$parent.prepend('<img src="'+_list[index]+'" onload="$DH70.resizeImgLoader(this);" />');
		$old.stop().animate({"left":(_w-1.4*_ow)/2,"top":(_h-1.4*_oh)/2,"width":1.4*_ow,"height":1.4*_oh,"opacity":0},2000,function(){
			$(this).remove();
		});
		$sign.removeClass("cur").eq(index).addClass("cur");
		return _;
	},
	imageAuto:function(index,during){
		var _=this;
		clearTimeout(_.config.bannerTimer);
		index = index || 0;
		var _list=dh70_assets.banner;
		var _s=_list.length;
		index= index<0?_s-1:(index>=_s?0:index);
		_.imageAutoAnimate(index);
		_.config.bannerTimer=setTimeout(function(){
			_.imageAuto(index+1,during);
		},during);
	},
	config:{
		winHeight:0,
		curRenWu:1,
		curItem:1
	},
	supportCanvas:function(){
		return !!document.createElement("canvas").getContext;
	},
	drawCircle:function(r){
		var _=this;
		var canvas=document.createElement("canvas");
			canvas.width=1557;
			canvas.height=1557;
			canvas.style["background"]="transparent";
		
		var ctx=canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(0,778,r,0,Math.PI*2,false);
		ctx.closePath();
		ctx.clip();
		//弧度
		//var radias=deg *(Math.PI/180);
		ctx.strokeStyle="#eee9e1";
		//一个圆弧 r=272
		ctx.beginPath();
		ctx.arc(272,778,272,0,Math.PI*2,false);
		ctx.closePath();
		ctx.stroke();
		//一个圆弧 r=716>>1  308
		ctx.beginPath();
		ctx.arc(308,778,308,0,Math.PI*2,false);
		ctx.closePath();
		ctx.stroke();
		//一个圆弧 r=1046>>1  523
		ctx.beginPath();
		ctx.arc(523,778,523,0,Math.PI*2,false);
		ctx.closePath();
		ctx.stroke();
		//一个圆弧 r=1556>>1  778
		ctx.beginPath();
		ctx.arc(778,778,778,0,Math.PI*2,false);
		ctx.closePath();
		ctx.stroke();
		return canvas;
	},
	canvasAnimate:function(cvs,time,step){
		var _=this;
		clearTimeout($(cvs).attr("timeid"));
		var fps=25,during=parseInt(1000/fps);
		step = step || 1;
		var steps=Math.ceil(time/during);
		var r= step/steps * 1557;
		var ctx=cvs.getContext("2d");
		ctx.clearRect(0,0,cvs.width,cvs.height);
		ctx.drawImage(_.drawCircle(r),0,0);
		if(step<steps){
			$(cvs).attr("timeid",setTimeout(function(){
				_.canvasAnimate(cvs,time,step+1);
			},during));
		}
	},
	stopCanvasAnimate:function(){
		var _=$DH70;
		var section=this;
		$(section).find(".cvs").each(function(i,e){
			clearTimeout($(this).attr("timeid"));
		});
	},
	renderCanvas:function(during){
		var _=$DH70;
		var section=this;
		if(_.supportCanvas()){
			$(section).find(".cvs").each(function(i,e){
				_.canvasAnimate(this,during,1);
			});
		}else{
			$(section).find(".bgcover1").stop().empty()
				.css({
					"background":"url(images/round.png) left center no-repeat",
					"width":0,"height":0,"margin-top":-147
				}).animate({"width":1557,"height":1557,"margin-top":-925},during);
			$(section).find(".bgcover2").stop().empty()
				.css({
					"background":"url(images/round.png) left center no-repeat",
					"width":0,"height":0,"margin-top":78
				}).animate({"width":1557,"height":1557,"margin-top":-700},during);
		}
		return _;
	},
	yearListInit:function(year){
		var _=this;
		var $list=$("#section_1 .yearlist");
		var _w=$(window).width();
		var holew=(_w<=1200?1200:_w)-160;
		var now=new Date().getFullYear();
		var percent=(holew-146)/(now-1944);
		$list.each(function(i,e){
			var temp=parseInt($(this).attr("relval"));
			$(this).css({"left":(temp-1944)*percent+10});
		});
		year = year || now
		$("#section_1 .yearslider").css({"left":percent*(year-1944)}).html(year);
		_.renderNewsListForYear(year);
		return _;
	},
	bindDrag:function(){
		var _=this;
		$("#section_1 .yearslider").pep({
			"shouldEase":false,
			"useCSSTranslation":false,
			"constrainTo":"parent",
			"axis":"x",
			"drag":function(e,obj){
				var cx= obj.pos.x;
				var _w=$(window).width();
				var holew=(_w<=1200?1200:_w)-160;
				var now=new Date().getFullYear();
				var percent=(holew-146)/(now-1944);
				var cur=Math.floor(cx/percent)+1944;
				$("#section_1 .yearslider").html(cur);
			},
			"start":function(e,obj){
				$("#section_1 .dragtips").fadeOut(300);
			},
			"stop":function(e,obj){
				var cx= obj.pos.x;
				var _w=$(window).width();
				var holew=(_w<=1200?1200:_w)-160;
				var now=new Date().getFullYear();
				var percent=(holew-146)/(now-1944);
				var cur=Math.floor(cx/percent)+1944;
				$("#section_1 .yearslider").html(cur);
				_.renderNewsListForYear(cur);
				//$("#section_1 .dragtips").fadeIn(300);
			}
		});
		return _;
	},
	monthSlider:function(month){
		var _=this;
		var $slider=$("#section_1 .monthslider");
		clearTimeout($slider.attr("timeid"));
		var curPos=parseInt($slider.attr("relpos")) || 1 ;
		var step= curPos>month? -1 :(curPos==month? 0:1);
		var tar=curPos+step-1;
		tar = tar <=0? 0:(tar>=11? 11 :tar);
		$slider.stop().animate({"left":tar*80},100,"linear");
		$slider.html((tar+1)+"月");
		$slider.attr("relpos",tar+1);
		if( (tar+1)*step < month*step){
			$slider.attr("timeid",setTimeout(function(){
				_.monthSlider(month);
			},100));
		}
	},
	renderNewsListForYear:function(year,month){
		var _=this;
		var data=_.getDataByKey(dh70_assets.news,"year",year);
		var $month=$("#section_1 .monthlist");
		if(!!data){
			//渲染月份
			for(var i=1;i<=12;i++){
				var temp=_.getDataByKey(data,"month",i);
				$month.eq(i-1).css({"visibility":!!temp?"visible":"hidden"});
			}
			//取最后一条数据的月份
			month = month || data[data.length-1].month || (new Date().getMonth()+1);
			_.newsData=data;
			_.renderNewsListForMonth(month);
		}
		return _;
	},
	newsData:null,
	renderNewsListForMonth:function(month){
		var _=this;
		var data=_.getDataByKey(_.newsData,"month",month);
		if(!!data){
			//挪动月份指示
			_.monthSlider(parseInt(month));
			//渲染数据
			_.renderNewsList(data);
		}
		return _;
	},
	renderNewsList:function(data){
		var _=this;
		data =data || [];
		//计算宽度 及数量
		var coverw=($(window).width()<=1200?1200:$(window).width())-330,
			coverh=($(window).height()<=600?600:$(window).height())-180;
		var perw=360,perh=440;
		var orgrows=Math.floor(coverw/perw),
			orgcols=Math.floor(coverh/perh);
		orgcols=orgcols<=1?1:orgcols;
		var count=data.length;
		var rows=Math.min(orgrows,count),
			cols=Math.min(orgcols,Math.ceil(count/rows));
		//写入DOM
		var html="";
		var $parent=$("#section_1 .topcover");
		for(var i=0;i<cols;i++){
			for(var j=0;j<rows;j++){
				var temp=data[i*rows+j];
				if(!!temp){
					if(temp.type=="history"){
						html+=('<div class="newslist history" relid="'+temp.id+
							'"><div class="news_tit">'+temp.title+
							'</div><div class="news_time">'+temp.timeline+
							'</div><div class="news_pic"><img src="'+temp.pic+
							'" width="100%" /></div><p class="news_desc">'+temp.desc+
							'</p><a href="javascript:;" class="btn_more"><img src="images/icon/icon_4.png" /></a>'+
							'<div class="news_type"></div><div class="news_icon"><img src="images/icon/icon_10.png" /></div></div>');
					}else{
						html+=('<div class="newslist person" relid="'+temp.id+
							'"><div class="news_tit">'+temp.title+
							'</div><div class="news_pos">'+temp.posite+
							'</div><div class="news_pic"><img src="'+temp.pic+
							'" width="100%" /></div><a href="javascript:;" class="btn_more"><img src="images/icon/icon_4.png" /></a>'+
                			'<div class="news_type"></div><div class="news_icon"><img src="images/icon/icon_10.png" /></div>');
					}
				}
			}
		}
		var $old=$parent.find(".newslist");
		$parent.append(html);
		var $new=$parent.find(".newslist").not($old);
		//入场动画
		$new.each(function(i,e){
			$(this).stop().css({"opacity":0,"left":200+i*perw+(coverw-rows*perw)/2,"top":coverh});
			if($(this).hasClass("person")){
				$(this).animate({"opacity":1,"top":100+(coverh-cols*perh)/2+80},500+i*150);
			}else{
				$(this).animate({"opacity":1,"top":100+(coverh-cols*perh)/2+(i%2)*20},500+i*150);
			}
		});
		//出场动画
		$old.each(function(i,e){
			$(this).stop().animate({"opacity":0,"top":-coverh},650,function(){
				$(this).remove();
			});
		});
		//绑定点击事件
		$new.find(".btn_more").bind("click",function(){
			if($(this).parents(".newslist").hasClass("history")){
				_.moreNewsHandler.call(this);
			}else{
				_.morePersonHandler.call(this);
			}
		});
		return _;
	},
	moreNewsHandler:function(){
		var _=$DH70;
		var $parent=$(this).parents(".newslist");
		var relid=$parent.attr("relid");
		var data=_.getValueByKey(dh70_assets.news,"id",relid);
		var orgpos=$parent.position();
		var orgw=$parent.outerWidth();
		var orgh=$parent.outerHeight();
		var $popwin=$("#news_wrapper");
		var winh=$(window).height();
		var winw=$(window).width();
		if(!!data){
			//写入文档
			$popwin.find(".p_content").attr("relid",relid);
			$popwin.find(".p_tit").html(data.title);
			$popwin.find(".p_time").html(data.timeline);
			$popwin.find(".p_cont").html(data.content);
			$popwin.find(".p_pic").html('<img src="'+data.pic+'" width="100%" />');
			//入场动画
			$popwin.find(".p_itemlist").css({"height":winh-368});
			$popwin.stop().css({"display":"block","opacity":1});
			$popwin.find(".p_content").stop().css({
				"width":orgw-40,
				"height":orgh-40,
				"padding-left":20,
				"padding-right":20,
				"padding-top":20,
				"padding-bottom":20,
				"left":orgpos.left,
				"top":orgpos.top+100
			}).animate({
				"width":725,
				"height":winh-300,
				"padding-left":50,
				"padding-right":50,
				"padding-top":50,
				"padding-bottom":50,
				"left":(winw-825)/2,
				"top":100
			},500);
		}
		return _;
	},
	morePersonHandler:function(){
		var _=$DH70;
		var $parent=$(this).parents(".newslist");
		var relid=$parent.attr("relid");
		var data=_.getValueByKey(dh70_assets.news,"id",relid);
		var orgpos=$parent.position();
		var orgw=$parent.outerWidth();
		var orgh=$parent.outerHeight();
		var $popwin=$("#person_wrapper");
		var winh=$(window).height();
		var winw=$(window).width();
		if(!!data){
			//写入文档
			$popwin.find(".p_content").attr("relid",relid);
			$popwin.find(".p_tit").html(data.title);
			$popwin.find(".p_posite").html(data.posite);
			$popwin.find(".p_cont").html(data.content);
			$popwin.find(".p_pic").html('<img src="'+data.pic+'" width="100%" />');
			//入场动画
			$popwin.find(".p_itemlist").css({"height":winh-340});
			$popwin.stop().css({"display":"block","opacity":1});
			$popwin.find(".p_content").stop().css({
				"width":orgw-40,
				"height":orgh-40,
				"padding-left":20,
				"padding-right":20,
				"padding-top":20,
				"padding-bottom":20,
				"left":orgpos.left,
				"top":orgpos.top+100
			}).animate({
				"width":440,
				"height":winh-300,
				"padding-left":50,
				"padding-right":50,
				"padding-top":50,
				"padding-bottom":50,
				"left":(winw-540)/2,
				"top":100
			},500);
		}
		return _;
	},
	renderItemList:function(type,page){
		var _=this;
		//计算宽度 及数量
		var coverw=$(window).width()-240,
			coverh=$(window).height()-195;
		var data=dh70_assets[type];
		var perw=400,rows=3;
		if(coverw<=1200){
			perw=Math.floor(coverw/3);
			rows=3;
		}else{
			perw=400;
			rows=Math.floor(coverw/400);
		}
		//当前页码
		if(page==0){return _;}
		page =page || _.config.curItem || 1;
		//写入DOM
		var html="",corn=(page-1)*rows;
		var $parent=$("#section_2 .topcover");
		if(corn>=data.length){
			return _;
		}
		for(var i=0;i<rows;i++){
			var temp=data[corn+i];
			if(!!temp){
				html+=('<div class="itemlist" relid="'+temp.id+
					'"><div class="it_tit">'+temp.title+
					'</div><div class="it_pic"><img src="'+temp.pic+
					'" width="100%" /></div><p class="it_desc">'+temp.desc+
					'</p><a href="javascript:;" class="btn_more"><img src="images/icon/icon_4.png" /></a></div>');
			}
		}
		var $old=$parent.find(".itemlist");
		$parent.append(html);
		var $new=$parent.find(".itemlist").not($old);
		var th=(coverh-515)/2;
		th=th<=-35?-35:th;
		//入场动画
		$new.each(function(i,e){
			$(this).stop().css({"opacity":0,"left":coverw+240,"width":perw-50,"top":th})
				.animate({"opacity":1,"left":160+(coverw-perw*rows)/2+i*perw},500+i*150);
		});
		//出场动画
		$old.each(function(i,e){
			$(this).stop().animate({"opacity":0,"left":-perw},650,function(){
				$(this).remove();
			});
		});
		_.config.curItem=page;
		//绑定点击事件
		$new.find(".btn_more").bind("click",_.moreContentHandler);
		return _;
	},
	moreContentHandler:function(e){
		var _=$DH70;
		var $item=$(this).parents(".itemlist");
		var relid=$item.attr("relid");
		var index=$("#section_2 .btn_tit").index($("#section_2 .btn_tit.cur"));
		var type=(index==0)?"essay":((index==1)?"fruit":"");
		var data=_.getValueByKey(dh70_assets[type],"id",relid);
		var orgpos=$item.position();
		var orgw=$item.outerWidth();
		var orgh=$item.outerHeight();
		var $popwin=$("#news_wrapper");
		var winh=$(window).height();
		var winw=$(window).width();
		if(!!data){
			//写入文档
			$popwin.find(".p_content").attr("relid",relid);
			$popwin.find(".p_tit").html(data.title);
			$popwin.find(".p_time").html(data.timeline);
			$popwin.find(".p_cont").html(data.content);
			$popwin.find(".p_pic").html('<img src="'+data.pic+'" width="100%" />');
			//入场动画
			$popwin.find(".p_itemlist").css({"height":winh-368});
			$popwin.stop().css({"display":"block","opacity":1});
			$popwin.find(".p_content").stop().css({
				"width":orgw-50,
				"height":orgh-60,
				"padding-left":25,
				"padding-right":25,
				"padding-top":30,
				"padding-bottom":30,
				"left":orgpos.left,
				"top":orgpos.top+195
			}).animate({
				"width":725,
				"height":winh-300,
				"padding-left":50,
				"padding-right":50,
				"padding-top":50,
				"padding-bottom":50,
				"left":(winw-825)/2,
				"top":100
			},500);
		}
	},
	renderRenWU:function(page,beback){
		var _=this;
		//计算 一次放多少项
		var coverw=$(window).width()-350,
			coverh=$(window).height()-280;
		var _sw=10,_sh=20;
		var rows=1,cols=1;
		var data=dh70_assets.renwu;
		rows=Math.floor(coverw/280);
		cols=Math.floor(coverh/320);
		cols= cols<=1?1:cols;
		//当前页码
		page =page || _.config.curRenWu || 1;
		//写入DOM
		var html="",corn=(page-1)*rows*cols;
		var $parent=$("#section_3 .topcover");
		//导航切换
		if(corn>=data.length){
			$("#section_3 .btn_next").addClass("cur");
			$("#section_3 .btn_prev").removeClass("cur");
			return _;
		}else if(corn<=1){
			$("#section_3 .btn_prev").addClass("cur");
			$("#section_3 .btn_next").removeClass("cur");
		}else{
			$("#section_3 .btn_prev").removeClass("cur");
			$("#section_3 .btn_next").removeClass("cur");
		}
		for(var i=0;i<cols;i++){
			for(var j=0;j<rows;j++){
				var temp=data[corn+i*cols+j];
				if(!!temp){
					html+=('<div class="renwulist" relid="'+temp.id+
						'"><div class="rw_head"><img src="'+temp.head+
						'" /></div><p class="rw_name">'+temp.name+
						'</p><p class="rw_char">'+temp.char+
						'</p> <p class="re_desc">'+temp.desc+'</p></div>');
				}
			}
		}
		var $old=$parent.find(".renwulist");
		$parent.append(html);
		var $new=$parent.find(".renwulist").not($old);
		//入场动画
		$new.each(function(i,e){
			var _c=Math.floor(i/rows),
			    _r=i%rows;
			var _top=(coverh-cols*320)/2 +_c*320;
			$(this).stop().css({
				"opacity":0,
				"left":200+(coverw-rows*280)/2+_r*280,
				"top":(coverh-cols*320)/2 +_c*320+(!!beback?-coverh:coverh)
			}).animate({
				"opacity":1,
				"left":200+(coverw-rows*280)/2+_r*280,
				"top":_top<=0?35:_top
			},500+150*_r);
		});
		//出场动画
		$old.each(function(i,e){
			var _r=Math.floor(i/rows),
			    _c=i%rows;
			$(this).stop().animate({"opacity":0,"top":(!!beback?coverh:-coverh)},650,function(){
				$(this).remove();
			});
		});
		_.config.curRenWu=page;
		return _;
	},
	pageEvent:function(){
		var _=this;
		var pageHeight=_.config.winHeight;
		//通用 页面切换 处理
		$(".section").bind("pageIn",function(e,beback){
			$(this).stop().css({"top":!!beback ? "-100%":"100%","display":"block"}).animate({"top":"0%"},500);
			$(this).find(".leftsign1,.leftsign2,.leftsign3,.leftsign4").stop().animate({"top":"50%"},800);
			$(this).find(".leftsign_t").stop().animate({"top":140},800);
			$(this).find(".title").stop().animate({"top":135},800);
			$(this).find(".btn_home").stop().animate({"top":120},800);
		});
		$(".section").bind("pageOut",function(e,beback){
			//固定形式背景
			$(this).find(".fixedbg").css({"position":"fixed"});

			$(this).stop().animate({"top":!!beback ? "100%":"-100%"},500,function(){
				$(this).css({"display":"none"});
				$(this).find(".fixedbg").css({"position":"absolute"});
			});
			$(this).find(".leftsign1,.leftsign2,.leftsign3,.leftsign4").stop().animate({"top":!!beback ?"150%":"-50%"},600);
			$(this).find(".leftsign_t").stop().animate({"top":!!beback ?640:-360},600);
			$(this).find(".title").stop().animate({"top":!!beback ?935:-665},600);
			$(this).find(".btn_home").stop().animate({"top":!!beback ?1120:-880},600);
		});
		//各页面切换 自定义处理
		$("#homepage").bind("pageIn",function(e,beback){
			var _h=$(window).height();
			$("#nav_wrapper").stop().animate({"bottom":0},500).removeClass("cur");
			$("#logo2").fadeOut(200);
			$("#logo1").fadeIn(200,function(){
				$(this).animate({"top":108},300);
			});
			$(this).find(".slogan").stop().animate({"top":"50%","opacity":1},1200,"easeOutCubic");
			$(this).find(".btn_more").stop().animate({"top":"50%","opacity":1},1000,"easeOutCubic");
			var index=$(this).find(".dotlist").index($(this).find(".dotlist.cur"));
			_.imageAuto(index+1,6000);
		});
		$("#homepage").bind("pageOut",function(e,beback){
			clearTimeout(_.config.bannerTimer);
			var _h=$(window).height();
			$("#nav_wrapper").stop().animate({"bottom":(_h<=600?600:_h)-100},500).addClass("cur");
			$("#logo1").stop().animate({"top":0},300,function(){
				$(this).fadeOut(200);
				$("#logo2").fadeIn(200);
			});
			$(this).find(".slogan").stop().animate({"top":!!beback?"150%":"-50%","opacity":0},300);
			$(this).find(".btn_more").stop().animate({"top":!!beback?"150%":"-50%","opacity":0},300);
		});
		$("#section_1").bind("pageIn",function(e,beback){
			var year=dh70_assets.news[dh70_assets.news.length-1].year;
			_.yearListInit(parseInt(year));
			$("#section_1 .dragtips").fadeIn(300);
			_.renderCanvas.call(this,5000);
		});
		$("#section_1").bind("pageOut",function(e,beback){
			_.stopCanvasAnimate.call(this);
		});
		$("#section_2").bind("pageIn",function(e,beback){
			$(this).find(".topcover").empty();
			var index=$(this).find(".btn_tit").index($(this).find(".btn_tit.cur"));
			var type=(index==0)?"essay":((index==1)?"fruit":"");
			_.renderItemList(type,_.config.curItem);
			_.renderCanvas.call(this,5000);
		});
		$("#section_2").bind("pageOut",function(e,beback){
			_.stopCanvasAnimate.call(this);
		});
		$("#section_3").bind("pageIn",function(e,beback){
			$(this).find(".topcover").empty();
			_.renderRenWU(_.config.curRenWu,beback);
		});
		$("#section_3").bind("pageOut",function(e,beback){

		});
		return _;
	},
	eventInit:function(){
		var _=this;
		//滚动事件
		//$(window).on("scroll",_.windwoScrollHandler);
		//滚动事件
		$(".section").on("mousewheel",_.mainWheelHandler);
		//resize
		$(window).on("resize",_.resizeHandler).trigger("resize");
		//导航点击
		$(".navlist").bind("click",function(){
			var cur=$(".navlist").index($(".navlist.cur"));
			var tar=$(".navlist").index(this);
			if(cur==tar){return;}
			_.mainPageChange(cur,tar);
		});
		$(".btn_home,.btn_gotop").bind("click",function(e){
			_.mainPageChange(null,0);
		});
		//第一页
		$("#section_1 .monthlist").bind("click",function(e){
			var index=$("#section_1 .monthlist").index(this);
			_.renderNewsListForMonth(index+1);
		});
		//第二页
		$("#section_2 .btn_prev").bind("click",function(){
			var index=$("#section_2 .btn_tit").index($("#section_2 .btn_tit.cur"));
			var type=(index==0)?"essay":((index==1)?"fruit":"");
			_.renderItemList(type,_.config.curItem-1);
		});
		$("#section_2 .btn_next").bind("click",function(){
			var index=$("#section_2 .btn_tit").index($("#section_2 .btn_tit.cur"));
			var type=(index==0)?"essay":((index==1)?"fruit":"");
			_.renderItemList(type,_.config.curItem+1);
		});
		$("#section_2 .btn_tit").bind("click",function(e){
			if($(this).hasClass("cur")){return;}
			var index=$("#section_2 .btn_tit").index(this);
			var type=(index==0)?"essay":((index==1)?"fruit":"");
			_.renderItemList(type,1);
			$("#section_2 .btn_tit").removeClass("cur");
			$(this).addClass("cur");
		});
		//第三页
		$("#section_3 .btn_prev").bind("click",function(){
			if($(this).hasClass("cur")){return;}
			_.renderRenWU(_.config.curRenWu-1,true);
		});
		$("#section_3 .btn_next").bind("click",function(){
			if($(this).hasClass("cur")){return;}
			_.renderRenWU(_.config.curRenWu+1,false);
		});
		//pop window
		$(".close").bind("click",function(){
			$(this).parents(".p_window").fadeOut(300);
		});
		return _;
	},
	cssInit:function(){
		var _=this;
		//首页 图片全屏化
		var img=$("#banner img").get(0);
		_.resizeImgLoader(img,null,null,1440,700);
		//首页图片 圆点 初始化
		var _s=dh70_assets.banner.length,html="";
		for(var i=0;i<_s;i++){
			html+=('<a href="javascript:;" class="dotlist"></a>');
		}
		$("#homepage .dotcover").css({"width":_s*32}).html(html);
		$("#homepage .dotcover .dotlist").eq(0).addClass("cur");
		//首页图片 圆点事件
		$("#homepage .dotcover .dotlist").bind("click",function(e){
			if($(this).hasClass("cur")){return;}
			var index=$("#homepage .dotcover .dotlist").index(this);
			_.imageAuto(index,5000);
		});
		_.bindDrag();
		return _;
	},
	share:function(type){
		var _link = '' || window.location.href,
			title = '',
			img='',
			_class='',	//百度收藏
			content = '';
		switch (type){
			case 'sina':
				window.open('http://v.t.sina.com.cn/share/share.php?appkey=&url='+encodeURIComponent(_link)+'&pic='+encodeURIComponent(img)+'&title='+encodeURIComponent(content)+'','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
				break;
			case 'qqz':
				window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(_link)+'&title='+encodeURIComponent(title)+'&pics='+encodeURIComponent(img)+'&summary='+encodeURIComponent(content)+'','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
				break;
			case 'renren':
				window.open('http://widget.renren.com/dialog/share?resourceUrl='+encodeURIComponent(_link)+'&description='+encodeURIComponent(_link)+'&pic='+encodeURIComponent(img)+'&message='+encodeURIComponent(content)+'&title='+encodeURIComponent(title)+'','_blank','scrollbars=no,width=650,height=550,left=75,top=20,status=no,resizable=yes');
				break;
			default:
				break;
		}
	},
	loadImages:function(array){
		var _=this;
		array=array||[];
		for(var i=0;i<array.length;i++){
			_.imgloader(array[i]);
		}
		return _;
	},
	init:function(){
		var _=this;
		_.cssInit().eventInit().pageEvent();
		setTimeout(function(){
			_.imageAuto(1,6000);
			_.loadImages(dh70_assets.banner);
		},5000);
		return _;
	}
};


$(function(){
	$DH70.init();
});