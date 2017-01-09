// 城市列表页对象
// 原型继承
var citylistObj = Object.create(searchObj);
// $.extend 进行对象的合并
citylistObj = $.extend(citylistObj,{
	name:'城市列表页',
	dom:$('#citylist'),
	init:function(){
		this.loadBaiduCityId();
		this.bindEvent();
	},
	// 获取百度外卖的城市id，并赋给城市（和饿了么一起）
	loadBaiduCityId:function(){
		var that = this;
		$.ajax({
			url:'/waimai',
			data:{
				qt:'getcitylist',
				format:1,
				t:1483689475543
			},
			dataType:'json',
			success:function(res){
				console.log(res);
				// 获取到的城市列表对象，需要进一步处理
				var t = [];
				var map = res.result.city_list;
				for(var key in map){
					t = t.concat(map[key]);
				};
				// console.log(t);//t是所有城市的一维数组
				// 将一维数组转换成对象（城市名和id一一对应）;
				var bdCityMap = {};
				for(var i in t){
					// 进行对象的动态创建
					bdCityMap[t[i].name] = t[i].code;
				}
				console.log(bdCityMap);
				// 转变成全局对象，便于跨函数调用
				that.bdCityMap = bdCityMap;
				that.loadHotCity();
				that.loadGroupCity();
			},
			error:function(){
				console.log('失败了')
			}
		})
	},
	// 加载abcd导航序列号
	loadNav : function(arr){
		var str = '';
		for(var i=0;i<arr.length;i++){
			str += '<li class="geo-city">'+arr[i]+'</li>';
			$('.al-list').html(str);
		}
	},
	// 加载一个拼音字母里的城市，
	loadSingleList : function(list){
		var that = this;
		var str = '';
		for (var i = 0; i < list.length; i++) {
			var t = encodeURI(list[i].name);
			var bcid = that.bdCityMap[list[i].name];
			str +='<a href="#address-'+t+'-'+list[i].id+'-'+bcid+'" class="geo-city">'+list[i].name+'</a>';
		}
		return str;
	},
	// 加载热门城市
	loadHotCity:function(){
		var that = this;
		$.ajax({
			url:'/v1/cities?type=hot',
			type:'get',
			success:function(res){
				console.log(res);
				var str = '';
				for (var i = 0; i < res.length; i++) {
					var t = encodeURI(res[i].name);
					var bcid = that.bdCityMap[res[i].name];
					str += '<a href="#address-'+t+'-'+res[i].id+'-'+bcid+'" class="geo-city-hot">'+res[i].name+'</a>';

				};
				$('.hot-city .geo-cities').html(str);
			},
			error:function(){
				console.log('e城市列表请求失败');
			}
		});
	},
	// 加载城市列表
	loadGroupCity:function(){
		var that = this;
		$.ajax({
			url:'/v1/cities?type=group',
			type:'get',
			success:function(res){
				console.log(res);//城市列表序号不对，需要排序
				var city = [];
				for(var key in res){
					city.push(key);
				};
				city.sort();
				that.loadNav(city);
				var str = '';
				for (var i = 0; i < city.length; i++) {
					str = '<div class="geo-cities-wrapper"><h4 class="geo-title" data-city="'+city[i]+'"><span class="ng-binding">'+city[i]+'</span><small class="geo-title-note"> </small></h4><div class="geo-cities clear">'+that.loadSingleList(res[city[i]])+'</div></div>';
					$('#citylist').append(str);
				}
			},
			error:function(){
				console.log('城市列表请求失败 ');
			}
		})
	},
	bindEvent:function(){
		// 点击abcd跳转到相应城市
		$('.al-list').on('click','li',function(){
			var selector = '[data-city="'+$(this).html()+'"]';
			// 选择器获取到data-city为abcd的属性，然后获取到下边有此属性的元素的top值，window滚动到相应位置，
			var offsetTop = $(selector).offset().top;
			window.scrollTo(0,offsetTop);		
		});
	}
})


