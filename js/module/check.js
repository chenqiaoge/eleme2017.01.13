
var checkOutObj = Object.create(searchObj);//继承
checkOutObj = $.extend(checkOutObj,{
	name:'结算页面',
	dom: $('#checkOut'),
	init:function(){
		console.log($('.goPay'))
	},
	bindEvent:function(){

	},
})




















