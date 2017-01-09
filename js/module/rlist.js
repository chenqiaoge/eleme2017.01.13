
var rlistObj = Object.create(searchObj);//原型继承
rlistObj = $.extend(rlistObj,{
	name:'餐厅列表页',
	dom:$('#rlist'),
	init:function(){
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
		        })
	},
	// 处理图片的路径
	srcDeal:function(str,flg,sn,en){
		  var newstr="";
		    var tmp=str.substring(sn, en);
		    newstr+= flg+tmp+flg;
			newstr = str.replace(str.slice(sn,en),newstr);
			newstr = newstr.replace('png','png.png');
			newstr = newstr.replace('jpeg','jpeg.jpeg');
			newstr = newstr.replace('jpg','jpg.jpg');
			newstr = newstr.replace('gif','gif.gif');
		    return newstr;
	},
	changeResList:function(hash){
		var that = this;
		var lat = hash.split('-')[1];
		var lon = hash.split('-')[2];
		$.ajax({
			url:'/shopping/restaurants',
			data:{
				latitude:lat,
				longitude:lon,
				offset:0,
				limit:20,
				extras:['activities']
			},
			success:function(res){
				console.log('eleme请求成功');
				// console.log(res);

				var str = '';
				for(var i = 0; i<res.length; i++){
					var src = res[i].image_path;
					// console.log(src);
					var srcs = that.srcDeal(src,'/',1,3);
					// console.log(srcs);

					str += '<dl class="item"><dt><img src="https://fuss10.elemecdn.com/'+srcs+'" alt=""></dt><dd class="situation"><div class="place"><p class="resName">'+res[i].name+'</p><span class="protect">票</span></div><div class="star"><span><span class="rate">'+res[i].rating+'</span><span>月售'+res[i].recent_order_num+'单</span></span></div><div class="send"><div class="moneylimit" _v-01bcfc2b=""> <span _v-01bcfc2b="">¥'+res[i].float_minimum_order_amount+'起送</span> <span _v-01bcfc2b="">配送费¥'+res[i].float_delivery_fee+'</span> </div><div class="timedistance-wrap" _v-01bcfc2b=""> <span class="distance-wrap" _v-01bcfc2b="">'+parseFloat(res[i].distance/1000)+'km</span> <span class="time-wrap" _v-01bcfc2b="">'+res[i].order_lead_time+'分钟</span> </div></div></dd></dl>';

				}
				$('.reslist').html(str);
			},
			error:function(){
				console.log('数据请求失败')
			}
		})
	},
	bindEvent:function(){

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









