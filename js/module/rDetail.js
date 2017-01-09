

var detailObj = Object.create(searchObj);//原型继承
detailObj = $.extend(detailObj,{
	name:'餐厅详情页',
	dom:$('#detail')

})
