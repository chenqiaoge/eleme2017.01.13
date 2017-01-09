// 进行不同设备间的通用配置
(function(){
	console.log('自适应布局初始配置');
	// 首先获取不同设备下的宽度
	var clientWidth = document.documentElement.clientWidth;
	// 第二步，为不同设备设置不同的根元素的大小
	document.documentElement.style.fontSize = clientWidth * (20/320) + 'px';
})()



