/**
 * Created by Administrator on 2017/3/26 0026.
 */

//当前第一个比较的div
var clickDiv1Id = -1;
//当前第二个比较的div
var clickDiv2Id = -1;
//找出图片个数
var findImgCount = 0;
//当前是否可点击
var canClick = true;


//时间变量
var costTime = 0;
//时间计时器变量
var timeSi = 0;

window.onload = function() {
    var begin = document.getElementById('begin');
    //获取最好成绩
    if(localStorage){
        var best = document.getElementById('best');
        if(localStorage.getItem('bestGrade') == null) {
            best.innerHTML = '<span style="font-size: 14px; color: white">暂无最好记录</span>'
        } else {
            best.innerHTML = '最好成绩：<span style="font-size: 18px; color: coral">' + localStorage.getItem('bestGrade') + '</span> s'
        }

    }else{
        best.innerHTML = '<span style="font-size: 14px">无法获取您的最好成绩哦</span>';
    }

    //开始按钮事件注册
    begin.onclick = function() {
        begin.style.display = 'none';
        var wrap = document.getElementById('wrap');
        wrap.style.opacity = '1';
        initGame();
    }
}

//初始化游戏函数
function initGame() {
    timeSi = setInterval(runTimer, 1000);
    //8张图片每张的剩余量数组，初始每张图片8张 8*8=64
    var imgRemainCountArr = [8, 8, 8, 8, 8, 8, 8, 8];

    var wrap = document.getElementById('wrap');
    //初始化64个div块背景
    var imgDivs = wrap.getElementsByTagName('div');
    for(var i = 0; i < imgDivs.length; i++){
        //产生1~8之间的随机数
        var randNum = parseInt(Math.random() * 8);
        //取一张当前仍有剩余的图片
        while(imgRemainCountArr[randNum] == 0){
            randNum = parseInt(Math.random() * 8);
        }
        imgRemainCountArr[randNum]--;

        //设置每个div块的图片id
        imgDivs[i].setAttribute('imgId', randNum + 1);

        //单块鼠标点击事件注册
        imgDivs[i].onclick = function() {
            if(canClick == false)
                return;
            var imgId = this.getAttribute('imgId');
            if(clickDiv1Id == -1) {
                this.style.backgroundImage = 'url(images/' + imgId + '.jpg)';
                clickDiv1Id = this.id;
            } else if(clickDiv2Id == -1) {
                this.style.backgroundImage = 'url(images/' + imgId + '.jpg)';
                clickDiv2Id = this.id;
                if(clickDiv1Id == clickDiv2Id){
                    clickDiv2Id = -1;
                    return;
                }

                if(document.getElementById(clickDiv1Id).getAttribute('imgId') == document.getElementById(clickDiv2Id).getAttribute('imgId')){
                    findImgCount = findImgCount + 2;
                    //清空已匹配块的onclick函数
                    document.getElementById(clickDiv1Id).onclick = function(){};
                    document.getElementById(clickDiv2Id).onclick = function(){};
                    //重置当前比较块
                    clickDiv1Id = -1;
                    clickDiv2Id = -1;
                    var tips = document.getElementById('tips');
                    tips.innerHTML = '已消除 <span style="font-size: 18px; color: coral">' + findImgCount + '</span> 个'
                    if(findImgCount == 64) {
                        if(localStorage){
                            if(localStorage.getItem('bestGrade') == null) {
                                localStorage.setItem('bestGrade', costTime);
                            } else if(parseInt(localStorage.getItem('bestGrade')) > costTime){
                                localStorage.setItem('bestGrade', costTime);
                            }
                        }
                        var reStart = confirm("恭喜您，通关成功，点击确定重新开始~");
                        clearInterval(timeSi);
                        if(reStart == true) {
                            location.reload(true);
                        }
                    }

                } else{
                    canClick = false;
                    setTimeout(hiddenTwo, 1000);
                }
            }
        }
    }

    //隐藏未匹配的两个div，并设置当前可点击
    function hiddenTwo() {
        document.getElementById(clickDiv1Id).style.backgroundImage = '';
        document.getElementById(clickDiv2Id).style.backgroundImage = '';
        clickDiv1Id = -1;
        clickDiv2Id = -1;
        canClick = true;
    }

    //计时器函数
    function runTimer() {
        costTime = costTime + 1;
        var timer = document.getElementById('timer');
        timer.innerHTML = '已用时：<span style="font-size: 18px; color: coral">' + costTime + '</span> s'
    }
}