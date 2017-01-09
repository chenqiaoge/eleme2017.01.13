// 地址搜索模块的对象
var searchObj = {
	name:'地址搜索页',
	dom:$('#address'),
	init:function(){
		// 模块的初始化方法
		this.bindEvent();
	},
	cCity:function(hash){
		var cityname = hash.split('-')[1] || '上海';
		cityname = decodeURI(cityname);
		$('#cname').html(cityname);
		// eleme的城市id，
		this.ecityId = hash.split('-')[2];
		// 百度外卖的城市id
		this.bcid = hash.split('-')[3];
	},
	bindEvent:function(){
		var that = this;
		// 点击饿了么的搜索时，会打印出相应结果
		$('#query').on('click',function(){
			console.log('e点击了');
			var word = $('#keyword').val();
			console.log(word);
			$.ajax({
				url:'/v1/pois',
				data:{
					city_id:that.ecityId || 1,
					keyword:word,
					type:'search'
				},
				success:function(res){
					console.log(res);
					var str = '';
					for(var i = 0; i<res.length;i++){
						str += '<li><a href="#rlist-'+res[i].latitude+'-'+res[i].longitude+'-'+res[i].geohash+'">'+res[i].name+'<p>'+res[i].address+'</p></a></li>'
					};
					$('#list').html(str);
				},
				error:function(){
					console.log('e请求失败了');
				}
			})
		});
		// 点击百度外卖的搜索时
		$('#waimai').on('click',function(){
			var word = $('#keyword').val();
			$.ajax({
				url:'/waimai',
				dataType:'json',
				data:{
					qt:'poisearch',
					ie:'utf-8',
					sug:0,
					tn:'B_NORMAL_MAP',
					oue:1,
					res:1,
					display:'json',
					wd:word,
					c:that.bcid || 131,
					lat:'',
					lng:''
				},
				success:function(res){
					console.log(res.result.content.length);
					var str = '';
					for(var i=0;i<res.result.content.length;i++){
						str += '<li><a href="#rlist-'+res.result.content[i].latitude+'-'+res.result.content[i].longitude+'">'+res.result.content[i].name+'<p>'+res.result.content[i].address+'</p></a></li>';
					}
					$('#list').html(str);
				},
				error:function(){
					console.log('b请求失败');
				}
			})
		})
	},
	enter:function(){
		this.dom.show();
	},
	leave:function(){
		this.dom.hide();
	}
}












