
// 项目中，四个不同的页面分别创建为四个模块对象，
// searchObj 地址搜索页面对象

// rlistObj 商家列表页对象

// detailObj 餐厅详情页对象

// citylistObj 城市选择页对象
// 项目中的跳转依据hash值，要建立一个hash值与模块之间的映射关系表
var hashMap = {
	'address':searchObj,
	'rlist':rlistObj,
	'citylist':restaurantListObj,
	'detail':rDetailObj
};
// ？？？？？？？？？？？
var cacheMap = {
	// 判断模块是否初始化的映射关系表	
}

var prevModule = null;
var curModule = null;
// 跳转路线控制器函数，
function pathController(hash){
	var module = hashMap[hash] || hashMap['address'];
	var khash = '';
	// 当hash值不再只是多个#，就要if判断了，有address时跳转到地址搜索页 ，并依据hash值改变城市
	if(hash.indexOf('address') !== -1){
		module = searchObj;
		khash = '';
		module.cCity(hash);	//调用改变城市方法
	}
	// 当检测到hash值里边有rlist时，跳转到餐厅列表页
	if (hash.indexOf('rlist') !== -1) {
		module = rlistObj;
		khash = 'rlist';
		module.changeResList(hash);//改变餐厅列表
	}
	prevModule = curModule;
	curModule = module;
	if(prevModule){
		prevModule.leave();
	}
	curModule.enter();
	// 优化性能，减少请求次数
	if (!cacheMap[khash]) {
		// 该模块没有被初始化过，执行if,?????
		curModule.init();
		cacheMap[khash] = true;
	}
}

// 判断hash值是否存在，不存在时显示搜索页
if (location.hash) {
	var hash = location.hash.slice(1);
	pathController(hash);
}else{
	pathController('address');
}
// 当hash值（a标签的href）改变时，函数执行
window.onhashchange = function(){
	// 获取到hash值，去除掉#号，
	var hash = location.hash.slice(1);
	pathController(hash);
}


















