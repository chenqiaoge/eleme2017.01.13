

var detailObj = Object.create(searchObj);//原型继承
detailObj = $.extend(detailObj,{
	name:'餐厅详情页',
	dom:$('#detail'),
	init:function(){
		this.bindEvent();
		// this.loadDetail();
	},
	bindEvent:function(){
		var that = this;
		// 点击左边楼梯会跳到相应类食物
		$('.left-floor').on('click','li',function(){
			console.log('dianle');
			$(this).addClass('food-active').siblings().removeClass('food-active');
			var selector = '[data-title="'+$(this).children('p').html()+'"]';
			console.log(selector);
			var curelem = $(selector).get(0);
			rightScroll.scrollToElement(curelem,500);

		});
		
		// 点击加减可以加入购物车，进行价钱和数量的运算
		$('.right-detail').on('click','.add',function(){
			console.log('点击加了');
			var numBox = $(this).parent().children('.buyNum');
			var num = numBox.html();

			// var price = $(this).parents('.foodDetail').find('.price').html();
			numBox.html(++num);
			// that.OnePrice = (num * price).toFixed(1);
			// console.log(that.OnePrice);
			that.addToCar(numBox);
		});
		$('.right-detail').on('click','.minus',function(){
			console.log('点击减了');
			var numBox = $(this).parent().children('.buyNum');
			var num = numBox.html();
			if (num <1) {
				numBox.html(0);
			}else{
				numBox.html(--num);
			}
			// var price = $(this).parents('.foodDetail').find('.price').html();
			
			// that.OnePrice = (num * price).toFixed(1);
			// console.log(that.OnePrice);
			that.addToCar(numBox);
		});

	},
	// 计算购物车的数量和价钱
	addToCar:function(numBox){
		// 让减号适当出现消失
		if(numBox !== undefined){
			if (numBox.html() > 0) {
				numBox.css('visibility','visible');
				numBox.prev().css('visibility','visible');
			}else{
				numBox.css('visibility','hidden');
				numBox.prev().css('visibility','hidden');
			}
		}
		
		
		var numList = $('.buyNum');
		var sum = 0;
		var money = 0;
		for (var i = 0; i < numList.length; i++) {
			sum += Number(numList.eq(i).html());
			money += Number((numList.eq(i).html() * $('.fPrice .price').eq(i).html()).toFixed(1));
		}
		if (sum === 0) {
			$('.goPay').css('background-color','grey');
			$('.buyNumber').hide();
		}else{
			$('.goPay').css('background-color','#3190e8');
			$('.buyNumber').show();
		}
		$('.buyNumber').html(sum);
		$('.money').html(money);
		// 左边楼梯每一类食品购买的数量
		var typeSum = 0;
		var typeList = $('.floorList li').children('p');
		for (var i = 0; i < typeList.length; i++) {
			var selector = $('[data-title = "'+typeList.eq(i).html()+'"]');
			// console.log(typeList.eq(0));
			// console.log(this.typeSum(selector));
			var typeNumBox = typeList.eq(i).next();
			typeNumBox.html(this.typeSum(selector));
			if (typeNumBox.html() > 0) {
				typeNumBox.css('visibility','visible');
			}else{
				typeNumBox.css('visibility','hidden');
			}
		}

	},
	// 计算每一类食物购买的数量
	typeSum:function(typeTitle){
		var numList = typeTitle.find('.buyNum');
		var sum = 0;
		for (var i = 0; i < numList.length; i++) {
			sum += Number(numList.eq(i).html());
		}
		return sum;
	},
	loadDetail:function(hash){
		this.id = hash.split('-')[1];
		this.lat = hash.split('-')[2];
		this.lng = hash.split('-')[3];
		this.loadHeaderInfo();
		this.loadResDetail();
	},
	// 头部信息加载
	loadHeaderInfo:function(){
		$.ajax({
			url:'/shopping/restaurant/'+this.id,
			data:{
				extras:['activities','album','license','identification','statistics'],
				latitude:this.lat,
				longitude:this.lng
			},
			success:function(res){
				console.log(res);
				var srcs = rlistObj.srcDeal(res.image_path,'/',1,3);
				$('.shop-name').html(res.name);
				$('.shopImg').attr('src','https://fuss10.elemecdn.com/'+srcs+'?imageMogr/quality/80/format/webp/');
			},
			error:function(){
				console.log('餐厅详情获取失败');

			}
		})
	},
	// 下方餐厅食品信息加载
	loadResDetail:function(){
		// $('.floorList').html('');
		// $('.rDetail-wrap').html('');
		var that = this;
		$.ajax({
			url:'/shopping/v2/menu?restaurant_id='+this.id,
			success:function(res){
				console.log(res);
				that.loadResLeft(res);
				that.loadResRight(res);
			}

		})
	},
	// 加载左边导航栏
	loadResLeft:function(list){
		var str = '';
		for (var i = 0; i < list.length; i++) {
			str += '<li><p>'+list[i].name+'</p><span class="typeNum">0</span></li>';

		};
		$('.floorList').html(str);

	},
	// 加载右侧食物信息
	loadResRight:function(list){
		var str = '';
		for (var i = 0; i < list.length; i++) {
			str +='<div class="foodItem" data-title="'+list[i].name+'">'+
				'<h3 class="tip">'+list[i].name+'</h3>'+
					this.loadRightSigle(list[i].foods)+ 
				'</div>';
		};
		// console.log($('.rDetail-wrap'))
		$('.rDetail-wrap').html(str);
		this.addToCar();
		// 滚动条初始化,实例化调用函数
		
		// ?????????出现多个滚动条时，第一次用了refresh，没有生效，第二次用destroy可以了，
		if(typeof leftScroll !== 'undefined' || typeof rightScroll !== 'undefined') {
			// destroy毁坏
				leftScroll.destroy();
			    rightScroll.destroy();	   
		}
		 
		console.log(typeof rightScroll)
		window.leftScroll = new IScroll('.left-floor',{
			scrollbars:false,	//是否显示滚动条
			probeType: 2,
			preventDefault:false,	//不阻止点击事件
			bounce:true			//控制其是否弹动
		});
		window.rightScroll = new IScroll('.right-detail',{
			scrollbars:true,	//是否显示滚动条
			probeType: 2,//
			preventDefault:false,	//不阻止点击事件
			bounce:false,
			interactiveScrollbars:true
		});
		
		// 实现右边滑动时左边楼梯会跟着相应显示
		// 先获取到每一个食品主题的对应高度，用一个数组存起来、
		this.cacheMaplist = [];
		var sum = 0;
		var that = this;
		$('.foodItem').each(function(index,elem){
			// console.log($(elem).height);
			sum += $(elem).height();
			that.cacheMaplist.push(sum);
		});
		console.log(this.cacheMaplist);

		var leftItem = $('.floorList').find('li');
		leftItem.eq(0).addClass('food-active');
		rightScroll.on('scroll',function(event){
			console.log('右边正在滚动');
			console.log('disty--',rightScroll.distY);
			console.log('y--',rightScroll.y);
			console.log('pointY',rightScroll.pointY);

			for (var i = 0; i < that.cacheMaplist.length; i++) {
				if(Math.abs(rightScroll.y)<=that.cacheMaplist[i]){
					console.log(i);
					leftItem.removeClass('food-active');
					leftItem.eq(i).addClass('food-active');
					break; //很重要，跳出当前循环,否则一直是最后一个
				}
			}

		})
	},
	loadRightSigle:function(list){
		var str = '';
		for (var i = 0; i < list.length; i++) {
			var src = list[i].image_path;
			// console.log(src);
			if(src!== null){
				var srcs = rlistObj.srcDeal(src,'/',1,3);
			}else{
				srcs = '';
			}
			
			// console.log(src+','+srcs);
			str += '<div class="foodInfo">'+
			'<img class="fImg" src="https://fuss10.elemecdn.com/'+srcs+'?imageMogr/thumbnail/140x140/format/webp/quality/85" alt="">'+
			'<div class="foodDetail">'+
				'<h4 class="fTitle">'+list[i].name+'</h4>'+
				'<p class="fsales">月售 <span class="sNUm">'+list[i].month_sales+'</span> 份</p>'+
				'<p class="fActive"></p>'+
				'<p class="fPrice">￥<span class="price">'+list[i].specfoods[0].price+'</span></p>'+
				'<div class="carButton">'+
					'<a href="javascript:;" class="minus">-</a>'+
					'<span class="buyNum">0</span>'+
					'<a href="javascript:;" class="add">+</a>'+
				'</div>'+
			'</div>'+
		'</div>'
		}
		return str;
	}
})
