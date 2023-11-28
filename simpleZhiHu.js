// ==UserScript==
// @name            极简知乎
// @version         0.1.34
// @author          hceasy
// @namespace       https://hceasy.com
// @supportURL      https://github.com/hceasy/simpleZhiHu/issues
// @description     优化阅读界面,免登录,广告去除,黑名单功能.
// @match           *://www.zhihu.com/question/*
// @match           *://www2.zhihu.com/question/*
// @match           *://www.zhihu.com/search*
// @match           *://www.zhihu.com/hot
// @match           *://www.zhihu.com/follow
// @match           *://www.zhihu.com/
// @match           *://zhuanlan.zhihu.com/*
// @match           *://www.zhihu.com/signin*
// @run-at          document-end
// ==/UserScript==
; (function () {
    'use strict'
    // 设置菜单
    const menuHTML = `<div class="extMenu"><img src="https://zhstatic.zhihu.com/assets/error/liukanshan_wire.svg" alt="刘看山" width="15px" height="19px"><p>显示提问标题栏 <input id="showQuestion" type="checkbox"></p><p>浏览器标题替换 <input id="showFakeTitle" type="checkbox"></p><p>页面宽度(694px/80%) <input id="pageWidth" type="text"></p><p>黑名单列表:</p><p><textarea placeholder="刘看山,匿名用户" id="blackList" cols="20" rows="2"></textarea></p><p><button id="saveConfig">保存</button></p></div>`
    const menuCss = `.extMenu {position: fixed;top: 10px;right: 10px;width: 15px;height: 19px;font-size: 12px;overflow: hidden;}.extMenu:hover {width: auto;height: auto;border: 1px solid #000;padding:10px;}.extMenu:hover img {display: none;}`
    const blinkLiu = `.extMenu{animation:jumpLiu 5s infinite}@keyframes jumpLiu{0%{right:10px;background-color:#264653}20%{right:20px;background-color:#2a9d8f}40%{right:30px;background-color:#e9c46a}60%{right:10px;background-color:#f4a261}80%{right:20px;background-color:#e76f51}100%{right:10px;background-color:#264653}}`

    // 区分搜索问答页面
    const pathName = window.location.pathname
    const hostName = window.location.hostname
    let pageType
    if (pathName.indexOf('question') >= 0) {
        pageType = 'question'
    } else if (pathName.indexOf('search') >= 0) {
        pageType = 'search'
    } else if (pathName.indexOf('hot') >= 0 || pathName.indexOf('follow') >= 0 || window.location.href === "https://www.zhihu.com/") {
        pageType = 'hot'
    } else if (pathName.indexOf('signin') >= 0) {
        pageType = 'signin'
    } else if (hostName === "zhuanlan.zhihu.com") {
        pageType = 'zhuanlan'
    }

    // 用GitHub的图标替换
    const fake_title = 'GitHub'
    // icon也改了
    const fake_icon = 'https://github.githubassets.com/favicon.ico'
    let link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link')
    window.onload = function () {
        const sConfig = window.localStorage
        if (sConfig.fakeTitle === undefined || sConfig.showQuestion === undefined || sConfig.blackList === undefined || sConfig.pageWidth === undefined) {
            sConfig.fakeTitle = 'true'
            sConfig.showQuestion = 'true'
            sConfig.blackList = ''
            sConfig.pageWidth = '694px'
        }
        // 不登陆不让滚动
        let modelsNum = 0
        let fixTimer = setInterval(() => {
            const mainHtml = document.getElementsByTagName('html')[0]
            if (mainHtml.style.overflow === 'hidden') {
                mainHtml.style.overflow = ''
            }
        }, 200);
        // 添加菜单
        let cssFix = document.createElement('style')
        cssFix.innerHTML += menuCss
        if (typeof (sConfig.blinkLiu) === 'undefined') {
            cssFix.innerHTML += blinkLiu
        }
        document.getElementsByTagName('head')[0].appendChild(cssFix)
        let htmlFix = document.createElement('div')
        htmlFix.innerHTML += menuHTML
        document.body.appendChild(htmlFix)

        // 绑定操作
        document.getElementById('showFakeTitle').checked = JSON.parse(sConfig.fakeTitle)
        document.getElementById('showQuestion').checked = JSON.parse(sConfig.showQuestion)
        document.getElementById('blackList').value = sConfig.blackList
        document.getElementById('pageWidth').value = sConfig.pageWidth
        document.getElementById('saveConfig').addEventListener('click', function () {
            sConfig.fakeTitle = document.getElementById('showFakeTitle').checked
            sConfig.showQuestion = document.getElementById('showQuestion').checked
            sConfig.blackList = document.getElementById('blackList').value.split(',')
            sConfig.pageWidth = document.getElementById('pageWidth').value
            sConfig.blinkLiu = false
            window.location.reload()
        })

        // 改下标题
        if (sConfig.fakeTitle === 'true') {
            window.document.title = fake_title
            link.type = 'image/x-icon'
            link.rel = 'shortcut icon'
            link.href = fake_icon
            document.getElementsByTagName('head')[0].appendChild(link)
        }
        switch (pageType) {
            case 'question':
                fixQuestionPage()
                fixPageWidth()
                break
            case 'search':
                fixSearchPage()
                break
            case 'hot':
                fixHomePage()
                break
            case 'signin':
                addHotList()
                break
            case 'zhuanlan':
                fixZhuanLan()
                break
        }
        hideAuthor()
    }
    window.onscroll = function () {
        hideAuthor()
    }
    function addHotList () {
        let signButton = document.querySelector('.SignFlow-submitButton')
        if (signButton) {
            let hotButton = signButton.cloneNode(false)
            let parent = signButton.parentNode;
            parent.appendChild(hotButton)
            hotButton.innerHTML = '不想登录,去热榜转转'
            hotButton.onclick = function () {
                location.href = 'https://www.zhihu.com/billboard'
            }
        }
    }
    function fixQuestionPage () {
        const sConfig = window.localStorage
        let cssFix = document.createElement('style')
        // 吸底的评论栏
        cssFix.innerHTML += `.RichContent-actions{bottom:auto !important;}`
        // 直接屏蔽顶部问题相关
        if (sConfig.showQuestion === 'false') {
            cssFix.innerHTML += `.QuestionHeader-footer{display:none !important;}`
            cssFix.innerHTML += `.QuestionHeader{display:none !important;}`
            cssFix.innerHTML += `.Question-main{margin:0 !important;}`
        }
        // 问题页面登录弹窗
        //cssFix.innerHTML += `.Modal-backdrop{background-color: transparent;}`
        //cssFix.innerHTML += `.signFlowModal{display:none !important;}`
        cssFix.innerHTML += `.ysn1om,.css-1hwwfws,.css-1ynzxqw{display:none !important;}`
        const but = document.getElementsByClassName('Button Modal-closeButton Button--plain')[0]
        but.click()
        // 顶部关键词
        cssFix.innerHTML += `.QuestionHeader-tags{display:none !important;}`
        // 问题相关撑满
        cssFix.innerHTML += `.QuestionHeader-content{padding-left:0}`
        cssFix.innerHTML += `.QuestionHeader-footer{display:none !important;}`
        // cssFix.innerHTML += `.QuestionHeader-main {margin:10px;}'
        cssFix.innerHTML += `.QuestionHeader{width:694px;margin:0 auto;padding:0;min-width:auto;}`
        // 未展开时内容居中
        cssFix.innerHTML += `.ListShortcut{margin:0 auto;}`
        // 展开时居中
        cssFix.innerHTML += `.Question-sideColumn{display:none;}`
        cssFix.innerHTML += `.Question-mainColumn{margin:0 auto;}`
        // 内容图片/视频最大300px
        cssFix.innerHTML += `.origin_image{max-width:300px !important;}`
        cssFix.innerHTML += `.RichText-video{max-width:300px !important;}`
        // 内容链接去特征
        cssFix.innerHTML +=
            `.LinkCard{margin:auto !important;display:inline !important;}.LinkCard-content{background-color: transparent;}.LinkCard-title{color:#999 !important}`
        // 点赞
        cssFix.innerHTML +=
            `.VoteButton{color:#999 !important;background: none; !important}`
        // 评论展开宽度
        cssFix.innerHTML += `.Modal--fullPage{width:650px}`
        // 评论展开关闭按钮复位
        cssFix.innerHTML += `.Modal-closeButton{right:0;}`
        cssFix.innerHTML += `.Modal-closeIcon{fill:#919191;}`
        // 广告商品链接
        cssFix.innerHTML +=
            `.RichText-MCNLinkCardContainer{display:none !important;}`
        // 夹缝广告
        cssFix.innerHTML +=
            `.Pc-word{display:none !important;}`
        document.getElementsByTagName('head')[0].appendChild(cssFix)
        // 右侧问题相关
        document.getElementsByClassName('QuestionHeader-side')[1].style.display =
            'none'
        document.getElementsByClassName('Question-sideColumn')[0].style.display =
            'none'
        // 顶部问题标题
        document.getElementsByTagName('header')[0].style.display = 'none'
        // 内容撑满
        document.getElementsByClassName('Question-main')[0].style.width = 'auto'
        document.getElementsByClassName('Question-main')[0].style.padding = '0'
        document.getElementsByClassName('Question-mainColumn')[0].style.margin =
            '0 auto'
    }
    function fixSearchPage () {
        let cssFix = document.createElement('style')
        // header
        cssFix.innerHTML += `header{display:none !important;}`
        // SearchTabs
        cssFix.innerHTML += `.SearchTabs{display:none !important;}`
        // SearchSideBar
        cssFix.innerHTML += `.SearchSideBar{display:none !important;}`
        // CornerButtons
        cssFix.innerHTML +=`.CornerButtons{display:none !important;}`
        // .SearchMain
        cssFix.innerHTML +=
            `.SearchMain{width:100% !important;margin: 0 !important;}`
        // Search-container
        cssFix.innerHTML +=
           `.Search-container{width: auto !important;min-height: auto !important;margin:none !important;}`
        cssFix.innerHTML += `.SearchSections{width:auto !important}`
        // 点赞
        cssFix.innerHTML +=
            `.VoteButton{color:#999 !important;background: none; !important}`
        // 内容图片/视频最大300px
        cssFix.innerHTML += `.origin_image{max-width:300px !important;}`
        cssFix.innerHTML += `.RichText-video{max-width:300px !important;}`
        document.getElementsByTagName('head')[0].appendChild(cssFix)
    }
    function fixZhuanLan () {
        let cssFix = document.createElement('style')
        cssFix.innerHTML +=`.Recommendations-Main{display:none !important;}`
        document.getElementsByTagName('head')[0].appendChild(cssFix)
    }
    function fixHomePage () {
        let cssFix = document.createElement('style')
        cssFix.innerHTML += `.GlobalSideBar{display:none !important;}`
        cssFix.innerHTML += `.Topstory-container{width:100% !important;padding:0 !important}`
        cssFix.innerHTML += `.Topstory-mainColumn{width:100% !important;}`
        document.getElementsByTagName('head')[0].appendChild(cssFix)
    }
    function hideAuthor () {
        const answerList = document.getElementsByClassName('List-item')
        for (let index = 0; index < answerList.length; index++) {
            const obj = answerList[index]
            if(obj.innerHTML.includes('本内容版权为知乎及版权方所有，侵权必究'))
            {
                obj.style.display = 'none'
            }
            const key = JSON.parse(obj.getElementsByClassName('ContentItem AnswerItem')[0].getAttribute("data-zop"))
            if (key === null) {
                return
            }
            const blackList = window.localStorage.blackList.split(',')
            blackList.forEach(name => {
                if (key.authorName === name) {
                    obj.style.display = 'none'
                }
            });
        }
    }
    function fixPageWidth(){
        let page = document.querySelector(".Question-mainColumn")
        let header = document.querySelector(".QuestionHeader")
        let headerCont = document.getElementsByClassName("QuestionHeader-content")
        page.style.width = window.localStorage.pageWidth
        header.style.width = window.localStorage.pageWidth
        headerCont[1].style.width = '100%'
    }
})()
