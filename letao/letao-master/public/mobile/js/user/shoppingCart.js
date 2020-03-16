$(function () {
    //初始化区域滚动
    mui('.mui-scroll-wrapper').scroll({
        indicators:false,//是否显示滚动条
    })

    //1.初始化页面 自动下拉刷新
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback :function () {
                    var _this=this;
                    setTimeout(function () {
                        getCartData(function (data) {
                            // console.log(data);
                            //渲染数据
                            $(".mui-table-view").html(template("cart", {list:data}))
                            //数据渲染结束后停止刷新
                            _this.endPulldownToRefresh();
                        })
                    },200)
                }
            }
        }
    })

    //2.刷新页面
    $(".fa-refresh").on("tap",function () {
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    })

    //3.点击删除
    $(".mui-table-view").on("tap",".mui-btn-red",function () {
        var id=$(this).attr("data-id");
        var $that=$(this);
        mui.confirm('您确定要删除吗？', '删除商品',['是', '否'], function(e) {
            if (e.index == 0) {
                // 调接口 删除后台对应的数据 删除页面当前数据
                LT.loginAjax({
                    url:"/cart/deleteCart",
                    type:"get",
                    data:{
                        id:id,
                    },
                    dataType:"json",
                    success:function (data) {
                        // console.log(data);
                        if (data.success==true){
                            $that.parent().parent().remove();
                            getPrice();
                        }
                    }
                })
            } else {
                //mui.swipeoutClose(js对象)
                mui.swipeoutClose($that.parent().parent()[0]);
            }
        })
    })

    //4点击编辑
    $(".mui-table-view").on("tap",".mui-btn-blue",function (){
        var id=$(this).attr("data-id");
        var $that=$(this);

        var $li=$(this).parent().parent();
        //获取所有的自定义属性
        //console.log(this.dataset);
        var html=template("edit",this.dataset)
        //console.log(html);
        mui.confirm(html.replace(/\n/g,""), '编辑商品',['是', '否'], function(e) {
            if (e.index == 0) {
                var size=$(".btn_size.now").html();
                var num=$(".drade_num input").val();
                //console.log(size, num);
                LT.loginAjax({
                    url:"/cart/updateCart",
                    type:"post",
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:"json",
                    success:function (data) {
                       if (data.success==true){//后台修改成功
                           //前端页面的渲染
                           $li.find(".number").html(num+"双");
                           //console.log($li.find(".number").text());
                           $li.find(".size").html("鞋码："+size);
                           $li.find("input").attr("data-num",num);
                           $(this).addClass('now');
                           getPrice();
                           mui.swipeoutClose($that.parent().parent()[0]);
                       }
                    }
                })
            } else {
                //mui.swipeoutClose(js对象)
                mui.swipeoutClose($that.parent().parent()[0]);
            }
        })
        var sizeP=$that.parent().next().children().children().children().eq(1).children().eq(2).children();//获取当前鞋码的标签
        console.log($that.parent().next().children().children().children().eq(1).children().eq(2).children());
        var oldSize=$(sizeP).html()[3]+$(sizeP).html()[4];
        var str=$("span.btn_size").text();
        var index=str.indexOf(oldSize)/2;
        $("span.btn_size").eq(index).addClass("now");
    })
        //4.1尺码选择
        $("body").on("tap",".btn_size",function () {
            $(this).addClass("now").siblings().removeClass("now")
        })
        //4.2数量的选择
        $("body").on("tap",".drade_num span",function () {
        //获取input框中的值
        var num=$(this).siblings("input").val();
        // console.log(num);
        //获取库存值
        var max=parseInt($(this).siblings("input").attr("data-max"));
        if($(this).hasClass("jian")){
            if(num==0){
                mui.toast("该商品的数量只能是正整数");
                return false;
            }
            num--;
        }else{
            if(num>=max){
                setTimeout(function () {
                    mui.toast("该商品库存不足");
                },200);
                return false;
            }
            num++;
        }
        //赋值
        $(this).siblings("input").val(num);
    })

    //5.计算价格
    $(".mui-table-view").on("change",'[type="checkbox"]',function () {
        getPrice();
    })

    //封装计算价格的函数
    function getPrice() {
        var $checkBox=$("[type=\"checkbox\"]:checked");
        var total=0;
        $checkBox.each(function (index,item) {
            var num=$(this).attr("data-num");
            var price=$(this).attr("data-price");
            total+=num*price;
        })
        total=total.toFixed(2);
        $("#cartAmount").html(total);
    }

    function getCartData(callback) {
        LT.loginAjax({
            url:"/cart/queryCart",
            type:"get",
            data:"",
            dataType:"json",
            success:function (data) {
                callback && callback(data);
            }
        })
    }
})