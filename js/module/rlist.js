
var rlistObj = Object.create(searchObj);//原型继承
rlistObj = $.extend(rlistObj,{
	name:'餐厅列表页',
	dom:$('#rlist'),
	offset : 0,
	init:function(){
			// 轮播部分
			var slider = $('#slider');
			var subscript = slider.find(".slide-trigger").find("span");
		        subscript.eq(0).addClass("cur");
		        window.mySwipe = new Swipe(document.getElementById('slider'), {
		            loop:false,
		            speed: 400,
		            // auto: 3000,
		            continuous:true,
		            disableScroll:false,
		            callback: function(index, elem) {
		            	index = index%2;
		            	// console.log(index);
		                subscript.eq(index).addClass("cur").siblings().removeClass("cur");
		            }
		        });

		
	},
	enter:function(){
		this.dom.show();
		this.bindEvent();
	},
	leave:function(){
		this.dom.hide();
		// 离开该页面时移除滚动事件
		window.removeEventListener('scroll',this.scrollInfo);
	},
	// 实现按需加载
	scrollInfo:function(event){
		console.log('滚动了');
		var that = rlistObj;
		// console.log(window.scrollY + window.innerHeight + ','+that.dom.height());
		if (window.scrollY + window.innerHeight === that.dom.height() && isTrue) {
			console.log('滚动到底部了');
			
			that.offset += 20;
			console.log(that.offset);
			// 加载餐厅列表
			that.loadInfo(null,true);
			isTrue = false;
		}
	},
	bindEvent:function(){
		// 监听滚动事件
		var that = this;
		// 添加逻辑点判断，滚动到底部而且ajax成功加载后才可以进行下次请求，
		this.isTrue = true;
		window.addEventListener('scroll',this.scrollInfo);
	},
	// 加载饿了么的餐厅列表
	loadInfo:function(locObj,flag){
		var that = this;
		locObj = locObj || Store('ele');
		console.log(locObj);
		var lat = locObj.lat;
		var lng = locObj.lng;
		var name = locObj.name;
		console.log(name);
		$('.resAddress').html(name);
		if(!!flag === false){
			$('.reslist').html('');
		}
		// 加载选定地点的餐厅（依据通过geo获取的经纬值）
		$.ajax({
			url:'/shopping/restaurants',
			data:{
				latitude:lat,
				longitude:lng,
				offset:that.offset,
				limit:20,
				extras:['activities']
			},
			success:function(res){
				console.log('eleme请求成功');
				// console.log(res);
				// 当滑到底部时要给用户提示，页面正在加载
				// console.log(res.length);
				if (res.length === 0 || res.length <= 19) {
					console.log('没有了');
					$('.reslist').addClass('overlist');
					// 如果没有数据就不再进行下次ajax请求，
					this.isTrue = false;
				}else{
					$('.reslist').removeClass('overlist');
					// 还有数据的条件下才可以进行下次ajax请求
					this.isTrue = true;
				}
				var str = '';
				for(var i = 0; i<res.length; i++){
					var src = res[i].image_path;
					// console.log(src);
					var srcs = that.srcDeal(src,'/',1,3);
					// console.log(srcs);

					str += '<dl class="item"><a href="#detail-'+res[i].id+'-'+res[i].latitude+'-'+res[i].longitude+'" ><dt><img src="https://fuss10.elemecdn.com/'+srcs+'" alt=""></dt><dd class="situation"><div class="place"><p class="resName">'+res[i].name+'</p><span class="protect">票</span></div><div class="star"><span class="starB1"></span><span class="starB2" style="width:'+73*res[i].rating/5+'px"></span><span><span class="rate">'+res[i].rating+'</span><span>月售'+res[i].recent_order_num+'单</span></span></div><div class="send"><div class="moneylimit" _v-01bcfc2b=""> <span _v-01bcfc2b="">¥'+res[i].float_minimum_order_amount+'起送</span> <span _v-01bcfc2b="">配送费¥'+res[i].float_delivery_fee+'</span> </div><div class="timedistance-wrap" _v-01bcfc2b=""> <span class="distance-wrap" _v-01bcfc2b="">'+parseFloat(res[i].distance/1000)+'km</span> <span class="time-wrap" _v-01bcfc2b="">'+res[i].order_lead_time+'分钟</span> </div></div></dd></a></dl>';
					

				}
				$('.reslist').append(str);
				
			},
			error:function(){
				console.log('数据请求失败')
			}
		})
	},
	// 处理图片的路径
	srcDeal:function(str,flg,sn,en){
		  var newstr="";
		    var tmp=str.substring(sn, en);
		    newstr+= flg+tmp+flg;
			newstr = str.replace(str.slice(sn,en),newstr);
			newstr = newstr.replace(newstr.slice(34),newstr.slice(34)+'.'+newstr.slice(34));
		    return newstr;
	},
	changeResList:function(hash){
		var that = this;
		// 判断点击的是百度还是饿了么的
		if (hash.split('-')[1] !== 'bd') {
			// 取出缓存的地点的经纬值
			var locInfo = Store('ele');
			console.log(locInfo);
			// 如果没有缓存过就ajax获取并在本地缓存起来，
			if (!locInfo) {
				$.ajax({
					url:'/v2/pois/' + hash.split('-')[1],
					type:'get',
					success:function(res){
						console.log('获取到经纬了');
						var obj = {
							lat : res.latitude,
							lng : res.longitude,
							name: res.name
						};
						Store('ele',obj);
						console.log(res.name);
						// 调用加载餐厅列表函数
						that.loadInfo(obj);
					},
					error:function(){
						console.log('经纬获取失败')
					}
				})
				return;//此处return作用：如果执行了if，就不再重复调用loadInfo函数了，且没有缓存时也会先ajax获取，再调用loadInfo函数，避免bug
			};
			// 调用加载餐厅列表函数
			this.loadInfo(locInfo);
		}else{			
			console.log('这是百度家的 ');
			
			// this.bdLoad();
		}
	
	},
	// 百度餐厅的数据待找寻
	bdLoad:function(){
		var lat = hash.split('-')[1];
		var lon = hash.split('-')[2];
		$.ajax({
			url:'',
			data:{

			},
			success:function(res){
				console.log(res);
			},
			error:function(){
				console.log('bd餐厅列表获取失败');
			}
		})
	}

})

// 注意此处轮播部分的调用位置，
/*$(function(){
	// 轮播部分
	var slider = $('#slider');
        slider.find(".slide-trigger").find("span").eq(0).addClass("cur");
        window.mySwipe = new Swipe(document.getElementById('slider'), {
            speed: 400,
            // auto: 3000,
            callback: function(index, elem) {
            	index = index%2;
            	// console.log(index);
                slider.find(".slide-trigger").find("span").eq(index).addClass("cur").siblings().removeClass("cur");
            }
        });
})*/









