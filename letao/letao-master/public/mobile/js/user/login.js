$(function () {
    //点击确认按钮 获取数据并且检查
    $(".mui-btn-primary").on("tap",function () {
        //serialize()获取表单序列化的数据 必须要有form标签和有name属性
        //console.log($("#form").serialize());

        //前台验证
        var  dataObj=LT.strObj($("#form").serialize());
        //console.log(dataObj);
        if (!dataObj.username){
            mui.toast("请输入用户名");
            return false;
        }
        if (!dataObj.password){
            mui.toast("请输入密码");
            return false;
        }

        //后台验证
        $.ajax({
            url:"/user/login",
            type:"post",
            data:$("#form").serialize(),
            dataType:"json",
            success:function (data,e) {
                // console.log(data);
                if (data.success==true){
                    //获取传过来的地址，在跳回去
                    var returnUrl=location.search.replace("?returnURL=","");
                    //console.log(returnUrl);
                    if (returnUrl){
                        location.href=returnUrl;
                        //阻止默认事件
                        e.preventDefault();
                    }else {
                        location.href="./index.html";
                    }
                } else if (data.error==403){
                    mui.toast(data.message);
                }
            }
        })
    })
})