$(function () {
    /*
    * 1.初始化3级联动，点击地址框，弹出城市选择列表
    * 2.判断地址栏里面到底有没有传参 传参就修改地址 没有就是新增地址
    * 3.点击确认，获取一系列的值 效验后提交后台，跳转到收货地址页面
    * */

    // 1.初始化3级联动，点击地址框，弹出城市选择列表
    //1.1通过new mui.PopPicker()初始化popPicker组件
    var picker = new mui.PopPicker({
        //显示几级菜单
        layer: 3
    });
    // 1.2之后给picker加数据 setData() 支持数据格式为:数组
    picker.setData(cityData);
    // 1.3点击地址框显示城市选择列表
    $(".address").on("tap",function () {
        picker.show(function (item) {
            if (item[0].text==item[1].text) {
                item[0].text="";
            }
            $(".address").val(item[0].text+item[1].text+item[2].text)
        })
    })

    // 2.判断地址栏里面到底有没有传参 传参就修改地址 没有就是新增地址
    var addressId=location.search;
    addressId=addressId && addressId.split('=');
    addressId=addressId && addressId[1];
    if (addressId){
        $(".lt_header h3").html("修改收货地址");
        getAddressData(function (data) {
            var obj={};
            data.forEach(function (item) {
                if (item.id==addressId){//判断id是否一样
                    obj=item;
                }
            })
            $("[name=\"recipients\"]").val(obj.recipients);
            $("[name=\"postcode\"]").val(obj.postCode);
            $("[name=\"address\"]").val(obj.address);
            $("[name=\"addressDetail\"]").val(obj.addressDetail);
        })
    }else {
        $(".lt_header h3").html("新增收货地址");
    }

    // 3.点击确认，获取一系列的值 效验后提交后台，跳转到收货地址页面
    $(".btn_register").on("tap",function () {
        // console.log(decodeURI($("form").serialize()));
        var str=decodeURI($("form").serialize());
        var data=LT.strObj(str);
        //前台效验
        console.log(str);
        if (!data.recipients) return mui.toast("请输入用户名");
        if (!data.postcode) return mui.toast("请输入邮编编码");
        if (!data.address) return mui.toast("请输入省市区");
        if (!data.addressDetail) return mui.toast("请输入详细地址");

        var myUrl="/address/addAddress";
        var tip="添加";
        //判断addressId是否存在 存在意味着修改地址
        if (addressId){
            myUrl="/address/updateAddress";
            data.id=addressId;
            tip:"修改";
        }
        ediAddressData(myUrl,data,function (data) {
            console.log(11);
            mui.toast(tip+"成功");
            setTimeout(function () {
                location.href="address.html"
            },1000)
        })
    })


})

function getAddressData(callback) {
    LT.loginAjax({
        url:"/address/queryAddress",
        type:"get",
        data:"",
        dataType:"json",
        success:function (data) {
            // console.log(data);
            callback&&callback(data);
        }
    })
}

function ediAddressData(editUrl,parmas,callback) {
    LT.loginAjax({
        url:editUrl,
        type:"post",
        data:parmas,
        dataType:"json",
        success:function (data) {
            // console.log(data);
            callback&&callback(data);
        }
    })
}