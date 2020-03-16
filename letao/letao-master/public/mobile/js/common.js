window.LT={};
LT.getParmas=function () {
    //获取问号后面的内容 由于中午会乱码 解码decodeURI
    var search=decodeURI(location.search);
    if (search){
        search=search.replace("?","");
        var arr=search.split("&");
        //console.log(arr);
        var parmas=[];
        arr.forEach(function (item,index) {
            var newArr=item.split("=");
            parmas[newArr[0]]=newArr[1];
        })
        //console.log(parmas);
        return parmas;
    }
}

LT.loginAjax = function (obj) {
    $.ajax({
        url:obj.url||"#",
        type:obj.type||"get",
        data:obj.data||"",
        dataType:obj.dataType||"json",
        success:function (data) {
            if (data.error==400){
                //未登录，跳到登录页面，并且要当前的地址传到登陆页面，当登录成功，按照这个地址跳转回来
                //从项目的根目录去跳转
                location.href="/mobile/user/login.html?returnURL="+location.href;
                return false;
            } else {
                //已登录，就正常执行后面的操作
                obj.success && obj.success(data);
            }
        }
    })
}

LT.strObj=function (str) {
    var obj={};
    if (str){
        var arr=str.split("&");
        arr.forEach(function (item,index) {
            var newArr=item.split("=");
            obj[newArr[0]]=newArr[1];
        })
        return obj;
    }
}

