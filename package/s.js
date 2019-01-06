/*var data;
$.getJSON("/package/data.json", function(d){
    data = d;
})*/

//声明全局变量
var first = true;
var configurl = 'package/config.json';
var commentapi = "https://dans.mdh.red/v3/"; //评论提交服务器地址
var dplayerapi = "https://dans.mdh.red/"; //弹幕服务器地址
var commentsdata; //评论数据
var commentshtml = ''; //评论列表
var lurl = window.location.href; //当前页面url
var commentid; //评论页ID
var title = ''; //页面标题
var data; //xlsx数据
//根据邮箱获取头像，暂未开发
//var gravatar = md5(email);
//var gravatarurl = 'https://cn.gravatar.com/avatar/' + gravatar;

var ws; //worksheet 存储xlsx数组
var xlsxurl = "./package/data.xlsx"; //表格文件地址
console.log('xlsx正在加载');
var oReq = new XMLHttpRequest();
var lexicon = new Array();
var xlsarr = new Array();;
oReq.open("GET", xlsxurl, true);
oReq.responseType = "arraybuffer";

oReq.onload = function(e) {
    var arraybuffer = oReq.response;
    /* convert data to binary string */
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    /* Call XLSX */
    //获取表格对象
    var workbook = XLSX.read(bstr, {
        type: "binary"
    });
    ws = workbook.Sheets['alldata'];
    var reg = /[1-9][0-9]*/g;
    var max = parseInt(ws['!ref'].match(reg)[1]) + 1;
    for (var i = 2; i < max; i++) {
        var va = ws['A' + i]['v'];
        var vb = ws['B' + i]['v'];
        var vc = ws['C' + i]['v'];
        var vd = ws['D' + i]['v'];
        var ve = ws['E' + i]['v'];
        var vf = ws['F' + i]['v'];
        var vg = ws['G' + i]['v'];
        var vh = ws['H' + i]['v'];
        var vi = ws['I' + i]['v'];
        var vj = ws['J' + i]['v'];
        var vk = ws['K' + i]['v'];
        if (vi == "none") {
            vi = ""
        }
        if (vj == "none") {
            vj = "https://i.loli.net/2019/01/05/5c303f07edeb1.jpg"
        }

        xlsarr.push({
            "id": va,
            "category": vb,
            "name": vc,
            "title": vd,
            "url": ve,
            "suffix": vf,
            "desc": vg,
            "time": vh,
            "addition": vi,
            "pic": vj,
            "max": vk
        })


    }
    console.log('xlsx加载完成，点击链接加载视频');
    loadindexhtml(xlsarr);
}
oReq.send();
data = xlsarr;
var navhtml = [];
var indexarr = [];

function loadindexhtml(data) { //打印播放列表
    console.log('开始加载视频列表...');
    //动画
    $("#container").fadeOut(800);
    var lastid;

    for (var i = 0; i < data.length - 1; i++) {
        var u = data[i - 1];
        var o = data[i];
        var p = data[i + 1];
        var startid = data[i].id - data[i].max + 1;
        if (o.name == p.name) {
            continue;
        } else {
            navhtml.push({
                "html": "<li> <a href=\"javascript:void(0)\" onclick=\"aclick(" + startid + "," + o.max + ")\" >" + o.name + "</a></li>",
                "category": o.category
            });

            indexarr.push({
                "html": '<div class="col-md-4"><style>@media (min-width: 1000px){.thumbnail{height:430px!important;}.loaddp{position: absolute;bottom: 30px;}}</style><div class="thumbnail"><img alt="300x169" src="' + o.pic + '" /><div class="caption"><h3>' + o.name + '</h3><p style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 5;-webkit-box-orient: vertical;" title="' + o.desc + '" >&nbsp;&nbsp;&nbsp;&nbsp;' + o.desc + '</p><p class="loaddp"><a class="btn btn-primary" href="javascript:void(0);" onclick="aclick(' + startid + ',' + o.max + ')"  >观看</a></p></div></div></div>'
            });
        }
        lastid = i + 1;


    };

    indexarr.push({
        "html": '<div class="col-md-4"><style>@media (min-width: 1000px){.thumbnail{height:430px!important;}.loaddp{position: absolute;bottom: 30px;}}</style><div class="thumbnail"><img alt="300x169" src="' + data[lastid].pic + '" /><div class="caption"><h3>' + data[lastid].name + '</h3><p style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 5;-webkit-box-orient: vertical;" title="' + data[lastid].desc + '" >&nbsp;&nbsp;&nbsp;&nbsp;' + data[lastid].desc + '</p><p class="loaddp"><a class="btn btn-primary" href="javascript:void(0);" onclick="aclick(' + data[lastid].id + ',' + data[lastid].max + ')"  >观看</a></p></div></div></div>'
    });
    var indexhtml = '';

    for (var i = indexarr.length - 1; i > indexarr.length - 7; --i) {
        indexhtml = indexhtml + indexarr[i].html;
    }

    navhtml = getnav(navhtml);
    var category = '';
    var navlisthtml = '';

    for (var i = 0; i < navhtml.length; i++) {
        if (navhtml[i].html.length > 0) {
            for (var j = 0; j < navhtml[i].html.length; j++) {
                navlisthtml = navlisthtml + navhtml[i]['html'][j]
            }
        }

        category = category + '<li class="dropdown"> <a href="#" class="dropdown-toggle " data-toggle="dropdown" data-hover="dropdown">' + navhtml[i].category + '<strong class="caret"></strong></a><ul class="dropdown-menu">' + navlisthtml + '</ul></li>';
        navlisthtml = '';
    };

    document.getElementById('navhtml').innerHTML = category;
    document.getElementById('indexhtml').innerHTML = indexhtml;
    $("#container").fadeIn(800);
    console.log('视频列表加载完成');
};

//返回顶部

function totop() {
    $("html, body").scrollTop(0).animate({scrollTop: $("body").offset().top},800);
}
//分类整理

function getnav(oldArr) {
    var newArr = new Array();
    var hasSame = false;
    for (var i = 0; i < oldArr.length; i++) {
        if (newArr.length > 0) {
            for (var j = 0; j < newArr.length; j++) {
                if (oldArr[i].category == newArr[j].category) {
                    newArr[j].html.push(oldArr[i].html);
                    hasSame = true;
                }
            }
        }
        if (!hasSame) {
            var json = {};
            json.category = oldArr[i].category;
            json.html = new Array();
            json.html.push(oldArr[i].html);
            newArr.push(json);
        }
        hasSame = false;
    }
    return newArr;
}

//预处理参数

function aclick(id, max) {
    $("#container").fadeOut(300);
    id = id - 1;
    max = id + max;
    var url = data[id].url;
    var desc = data[id].desc;
    var time = data[id].time;
    var category = data[id].category;
    var suffix = data[id].suffix;
    var addition = data[id].addition;
    var pic = data[id].pic;
    title = data[id].title;
    var playlist = '';
    for (var i = id; i < max; i++) {
        playlist = playlist + '<a id="p' + data[i].id + '"class="list-group-item" onclick=\'switchDP("p' + data[i].id + '","' + data[i].url + '","' + data[i].suffix + '","' + data[i].desc + '","' + data[i].time + '","' + data[i].category + '","' + data[i].title + '","' + data[i].addition + '","' + data[i].pic + '")\'>' + data[i].title + '</a>\n'
    }
    console.log(desc, '\n' + time, '\n' + category, '\n' + title);
    loaddp(url, suffix, desc, time, playlist, addition, pic);
    document.getElementsByTagName("title")[0].innerText = title;
    document.getElementById('comment').style.display = "block";
    document.getElementById('indexhtml').style.display = "none";
}

function loaddp(vurl, suffix, desc, time, playlist, addition, pic) {
    var url = vurl + suffix;
    if (!first) {
        dp.destroy();
        console.log('dp已经销毁');
        //初始化播放器
        console.log('正在初始化播放器');
        var id = md5(url);
        commentid = id;
        if (addition == "" || addition == null || addition == undefined) { // "",null,undefined
            window.dp = new DPlayer({
                container: document.getElementById('dplayer'),
                video: {
                    url: url,
                    pic: pic,
                    thumbnails: vurl + '.jpg'
                },
                danmaku: {
                    id: id,
                    api: dplayerapi,
                    token: 'tokendemo',
                    user: cip
                }
            });
        } else {
            window.dp = new DPlayer({
                container: document.getElementById('dplayer'),
                video: {
                    url: url,
                    pic: pic,
                    thumbnails: vurl + '.jpg'
                },
                danmaku: {
                    id: id,
                    token: 'tokendemo',
                    addition: [addition],
                    api: dplayerapi,
                    user: cip
                }
            });
        };

        //更改简介和时间
        document.getElementById('desc').innerHTML = '简介：' + desc;
        document.getElementById('time').innerHTML = "时间：" + time;
        document.getElementById('playlist').innerHTML = playlist;
        console.log(url, id, cip, addition)
        console.log('初始化播放器完成');
        console.log('准备加载评论');
        document.getElementById('comments').innerHTML = '暂无评论';
        getcomments();
        console.log('评论加载完成');

    } else {
        //初始化播放器
        console.log('正在初始化播放器');
        var id = md5(url);
        commentid = id;
        if (addition == "" || addition == null || addition == undefined) { // "",null,undefined
            window.dp = new DPlayer({
                container: document.getElementById('dplayer'),
                video: {
                    url: url,
                    pic: pic,
                    thumbnails: vurl + '.jpg'
                },
                danmaku: {
                    id: id,
                    token: 'tokendemo',
                    api: dplayerapi,
                    user: cip
                }
            });
        } else {
            window.dp = new DPlayer({
                container: document.getElementById('dplayer'),
                video: {
                    url: url,
                    pic: pic,
                    thumbnails: vurl + '.jpg'
                },
                danmaku: {
                    id: id,
                    token: 'tokendemo',
                    addition: [addition],
                    api: dplayerapi,
                    user: cip
                }
            });
        };

        //更改简介和时间
        document.getElementById('desc').innerHTML = '简介：' + desc;
        document.getElementById('time').innerHTML = "时间：" + time;
        document.getElementById('playlist').innerHTML = playlist;
        console.log(url, id, cip, addition)
        console.log('初始化播放器完成');
        console.log('准备加载评论');
        document.getElementById('comments').innerHTML = '暂无评论';
        getcomments();
        console.log('评论加载完成');
        first = false;
    };

    setTimeout(function() {
        totop();
    }, 500);
    $("#container").fadeIn(300);
}

function switchDP(vid, vurl, suffix, desc, time, category, title, addition, pic) {
    $("#container").fadeOut(300);
    var thumbnails = vurl + '.jpg'
    var url = vurl + suffix;
    var id = md5(url);
    commentid = id;
    if (addition == "" || addition == null || addition == undefined) {
        dp.switchVideo({
            url: url,
            pic: pic,
            thumbnails: thumbnails
        }, {
            id: id,
            api: dplayerapi,
            user: cip
        });
    } else {
        dp.switchVideo({
            url: url,
            pic: pic,
            thumbnails: thumbnails
        }, {
            id: id,
            addition: [addition],
            api: dplayerapi,
            user: cip
        });
    }

    dp.toggle();
    document.getElementById('desc').innerHTML = '简介：' + desc;
    $(".list-group-item").removeClass('active');
    var listactive = document.getElementById(vid);
    $(listactive).addClass('list-group-item active');
    document.getElementsByTagName("title")[0].innerText = title;
    console.log('切换视频源为：');
    console.log(vid, '\n简介：' + desc, '\n时间：' + time, '\n分类：' + category, '\n标题：' + title);
    console.log('准备加载评论');
    document.getElementById('comments').innerHTML = '暂无评论';
    getcomments();
    console.log('评论加载完成');
setTimeout(function() {totop();}, 500); 
    $("#container").fadeIn(300);
}

//时间戳转换

function timetrans(date) {
    var date = new Date(date); //如果date为13位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}

function getcomments() {

    if (commentid == "" || commentid == null || commentid == undefined) { // "",null,undefined
        commentid = lurl;
    };
    var postid = md5(commentid);
    //获取评论数据
    $.ajax({
        async: true,
        type: "GET",
        dataType: "json",
        url: commentapi,
        data: {
            "id": postid
        },
        success: function(result) {
            console.log(result);
            if (result.resultCode == 200) {
                console.log('Get Data OK!');
            };
            commentsdata = result;
            for (var i = result["data"].length - 1; i >= 0; --i) {
                commentshtml = commentshtml + '<li class="list-group-item" >' +
                    '<a href="#" class="list-group-item active"><h4 class="list-group-item-heading">' +
                    commentsdata.data[i][3] + ' <small>' + timetrans(commentsdata.data[i][0]) +
                    '</small></h4></a>' + '  ' + '<p style="text-shadow: 2px 2px 1px #0000004d;color:#' + commentsdata.data[i][2].toString(16) +
                    ';">&nbsp;&nbsp;' + commentsdata.data[i][4] + '</p></li>\n'; //time//color//name//text
                document.getElementById('comments').innerHTML = commentshtml;

            };
            commentshtml = '';
        },
        error: function() {
            console.log('Ajax Get Error!');
        }
    });
    //解析json写入页面  
}

function submit() {
    if (commentid == "" || commentid == null || commentid == undefined) { // "",null,undefined
        commentid = lurl;
    };
    var postid = md5(commentid);
    //获取输入数据
    var name = document.getElementById('name').value;
    if (name == "" || name == null || name == undefined) { // "",null,undefined
        alert("名字将为IP地址！");
        name = cip.replace(/\d{1,3}$/, '*');
    }
    //var email = document.getElementById('email').value;
    var color = document.getElementById('color').value;
    var text = document.getElementById('text').value;
    if (text == "" || text == null || text == undefined) { // "",null,undefined
        alert("内容为空！");
        return;
    }
    var color10 = parseInt(color, 16);
    //获取当前时间戳    
    var timestamp = Date.parse(new Date());
    //data拼接
    var postdata = JSON.stringify({
        "id": postid,
        "author": name,
        "time": timestamp,
        "text": text,
        "color": color10,
        "type": 0
    })
    //ajax传输数据到后端
    $.ajax({
        //几个参数需要注意一下
        type: "POST", //方法类型
        dataType: "text", //预期服务器返回的数据类型
        url: commentapi, //url
        contentType: "application/json",
        data: postdata,
        success: function(result) {
            console.log(result); //打印服务端返回的数据(调试用)
            alert('提交成功！')
            getcomments();
            if (result.data !== '') {
                console.log('提交成功!');
            };
        },
        error: function(result) {
            console.log('提交失败!');
            console.log(result);
        }
    });


}

var OwO_demo = new OwO({
    logo: 'OωO表情',
    container: document.getElementsByClassName('OwO')[0],
    target: document.getElementById('text'),
    api: 'package/OwO/OwO.json',
    position: 'down',
    width: '100%',
    maxHeight: '250px'
});