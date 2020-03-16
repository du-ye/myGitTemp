mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005,//flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators:false
});
//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
    interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
});

//点击进入会员中心
$(".fa-user").on("tap",function () {
    LT.loginAjax({
        url:"/user/queryUserMessage",
        type:"get",
        data:"",
        success:function (data) {
            if (data.error==400){
                //未登录，跳到登录页面，并且要当前的地址传到登陆页面，当登录成功，按照这个地址跳转回来
                //从项目的根目录去跳转
                location.href="/mobile/user/login.html?returnURL="+location.href;
                return false;
            } else {
                //已登录，就正常执行后面的操作member
                location.href="/mobile/member.html?returnURL="+location.href;
            }
        }
    })
})