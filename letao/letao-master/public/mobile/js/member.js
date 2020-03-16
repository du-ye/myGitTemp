$(function () {
    //1.渲染页面
    getMemberData(function (data) {
        $(".mui-table-view").html(template("personal",data));
    })
    
    //2.点击退出
    $(".mui-btn-outlined").on("tap",function () {
        SecedeMemberData(function (data) {
            location.href="/mobile/user/login.html?returnURL="+location.href;
        })
    })
    
    function getMemberData(callback) {
        LT.loginAjax({
            url:"/user/queryUserMessage",
            type:"get",
            data:"",
            dataType:"json",
            success:function (data) {
                // console.log(data);
                callback&&callback(data);
            }
        })
    }

    function SecedeMemberData(callback) {
        LT.loginAjax({
            url:"/user/logout",
            type:"get",
            data:"",
            dataType:"json",
            success:function (data) {
                //console.log(data);
                callback&&callback(data);
            }
        })
    }
})