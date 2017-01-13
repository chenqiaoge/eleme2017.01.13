
/*
if(location.hash) {
	var hash = location.hash; //hash = #rlist
	$(hash).show();
	$(hash).siblings().hide();
}
window.onhashchange = function(){
	var hash = location.hash; //hash = #rlist
	$(hash).show();
	$(hash).siblings().hide();
}*/

// 把本地缓存存取的方法封装起来
	function Store(nameSpace,data){
		// 多态，用同一个API，去实现不同的方法（存取操作），
		if (data) {
			// 存储
			sessionStorage.setItem(nameSpace,JSON.stringify(data));
			return;
		}
		// 取出缓存
		return JSON.parse(sessionStorage.getItem(nameSpace));
	}

//更进一步的路由的实现
//采用js模块化开发的手段进行项目的路由设计

//模块化开发，首先你要确定模块，对你项目功能进行抽象

//因为我们项目中，有4个不同的页面，在我眼中 就会有4个不同的模块，面向对象的方式
/*
searchObj 地址搜索页面对象

rlistObj 商家列表页对象

detailObj 餐厅详情页对象

citylistObj 城市选择页对象


关键性的难题？  模块与模块之间怎么联系在一起？*/
// 创建一个 hash值 与 模块 映射关系表
var hashMap = {
	'address': searchObj,
	'rlist' : rlistObj,
	'citylist' : citylistObj,
	'detail' : detailObj,
	'checkOut':checkOutObj
}
var cacheMap = {
	// 判断模块是否初始化的映射关系表
}
var prevModule = null;//前一个模块
var curModule = null;//当前模块

function routeController(hash){
	// 路由控制方法
	var module = hashMap[hash] || hashMap['address'];
	// console.log(module);
	var khash = hash;	//最初是赋值'',但存在不刷新就不加载的bug，
	// 得到对应hash值的对应模块对象（当hash值里边有address时）
	if (hash.indexOf('address') !== -1) {
		module = searchObj;
		khash = 'address';
		module.cCity(hash);//改变城市
	}
	// 当检测到hash值里边有rlist时，跳转到餐厅列表页
	if (hash.indexOf('rlist') !== -1) {
		module = rlistObj;
		khash = 'rlist';
		module.changeResList(hash);//改变餐厅列表
	};
	// 当检测到hash值里边有detail时，跳转到餐厅列表页
	if (hash.indexOf('detail') !== -1) {
		module = detailObj;
		khash = 'detail';
		module.loadDetail(hash);//改变餐厅列表
	}


	// 接着我们需要维护好前一个与当前模块的关系
	prevModule = curModule;
	curModule = module;
	// console.log(prevModule+','+curModule)
	if (prevModule) {
		prevModule.leave();
	}
	curModule.enter();
	// 优化性能，减少请求次数
	console.log(khash);
	if(!cacheMap[khash]) {
		//该模块没有被初始化过
		curModule.init();
		cacheMap[khash] = true;
		/*cacheMap = {
			address-天津: true,
			address-上海: true,
			address: true
		}*/
	}
}
// 判断hash值是否存在，不存在时显示搜索页
if (location.hash) {
	var hash = location.hash.slice(1);
	routeController(hash);
}else{
	routeController('address');
}
// 当hash值改变时，函数执行
window.onhashchange = function(){
	var hash = location.hash.slice(1);
	// console.log(hash)
	routeController(hash);
}

Pace.Options = {
 // Disable the 'elements' source
 ajax: false,
 // Only show the progress on regular and ajax-y page navigation,
 // not every request
 restartOnRequestAfter: false
}

