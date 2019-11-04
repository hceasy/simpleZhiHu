// ==UserScript==
// @name            极简知乎
// @version         0.1.15
// @author          hceasy
// @namespace       https://hceasy.com
// @supportURL      https://github.com/hceasy/simpleZhiHu/issues
// @description     有些时候看知乎不是那么方便,你懂的.
// @match           *://www.zhihu.com/question/*
// @match			*://www.zhihu.com/search*
// @match			*://www.zhihu.com/hot
// @match			*://www.zhihu.com/follow
// @match			*://www.zhihu.com/
// @run-at          document-end
// ==/UserScript==
; (function () {
    'use strict'
    // 区分搜索问答页面
    let webUrl = window.location.pathname
    let pageType
    if (webUrl.indexOf('question') >= 0) {
        pageType = 'question'
    } else if (webUrl.indexOf('search') >= 0) {
        pageType = 'search'
    } else if (webUrl.indexOf('hot') >= 0 || webUrl.indexOf('follow') >= 0 || window.location.href === "https://www.zhihu.com/") {
        pageType = 'hot'
    }
    // 用GitHub的图标替换
    let fake_title = 'GitHub'
    let fake_icon = 'https://github.githubassets.com/favicon.ico'
    // icon也改了.(IE邪教,凉了,没的治)
    let link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link')
    window.onload = function () {
        const sConfig = window.localStorage
        if (sConfig.fakeTitle === undefined) {
            sConfig.fakeTitle = 'true'
            sConfig.showQuestion = 'true'
        }
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
                break
            case 'search':
                fixSearchPage()
                break
            case 'hot':
                fixHomePage()
                break
        }
        this.document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                showFakeTitle()
            } else if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
                showQuestion()
            }
        })
    }
    function showFakeTitle () {
        const sConfig = window.localStorage
        if (sConfig.fakeTitle === 'true') {
            sConfig.fakeTitle = 'false'
            alert('不伪装标题栏')
        } else {
            sConfig.fakeTitle = 'true'
            alert('伪装标题栏')
        }
        window.location.reload()
    }
    function showQuestion () {
        const sConfig = window.localStorage
        if (sConfig.showQuestion === 'true') {
            sConfig.showQuestion = 'false'
            alert('显示提问标题')
        } else {
            sConfig.showQuestion = 'true'
            alert('隐藏提问标题')
        }
        window.location.reload()
    }
    function fixQuestionPage () {
        const sConfig = window.localStorage
        let cssFix = document.createElement('style')
        // 吸底的评论栏
        cssFix.innerHTML += '.RichContent-actions{bottom:auto !important;}'
        // 直接屏蔽顶部问题相关
        if (sConfig.showQuestion === 'true') {
            cssFix.innerHTML += '.QuestionHeader-footer{display:none !important;}'
            cssFix.innerHTML += '.QuestionHeader{display:none !important;}'
            cssFix.innerHTML += '.Question-main{margin:0 !important;}'
        }
        // 顶部关键词
        cssFix.innerHTML += '.QuestionHeader-tags{display:none !important;}'
        // 问题相关撑满
        cssFix.innerHTML += '.QuestionHeader-content{width:100% !important;}'
        cssFix.innerHTML += '.QuestionHeader{min-width:auto !important;}'
        // 内容图片/视频最大300px
        cssFix.innerHTML += '.origin_image{max-width:300px !important;}'
        cssFix.innerHTML += '.RichText-video{max-width:300px !important;}'
        // 内容链接去特征
        cssFix.innerHTML +=
            '.LinkCard{margin:auto !important;display:inline !important;}.LinkCard-content{background-color: transparent;}.LinkCard-title{color:#999 !important}'
        // 点赞
        cssFix.innerHTML +=
            '.VoteButton{color:#999 !important;background: none; !important}'
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
        document.getElementsByClassName('Question-mainColumn')[0].style.width =
            '100%'
    }
    function fixSearchPage () {
        let cssFix = document.createElement('style')
        // header
        cssFix.innerHTML += 'header{display:none !important;}'
        // SearchTabs
        cssFix.innerHTML += '.SearchTabs{display:none !important;}'
        // SearchSideBar
        cssFix.innerHTML += '.SearchSideBar{display:none !important;}'
        // CornerButtons
        cssFix.innerHTML += '.CornerButtons{display:none !important;}'
        // .SearchMain
        cssFix.innerHTML +=
            '.SearchMain{width:100% !important;margin: 0 !important;}'
        // Search-container
        cssFix.innerHTML +=
            '.Search-container{width: auto !important;min-height: auto !important;margin:none !important;}'
        cssFix.innerHTML += '.SearchSections{width:auto !important}'
        // 点赞
        cssFix.innerHTML +=
            '.VoteButton{color:#999 !important;background: none; !important}'
        // 内容图片/视频最大300px
        cssFix.innerHTML += '.origin_image{max-width:300px !important;}'
        cssFix.innerHTML += '.RichText-video{max-width:300px !important;}'
        document.getElementsByTagName('head')[0].appendChild(cssFix)
    }
    function fixHomePage () {
        let cssFix = document.createElement('style')
        // header
        cssFix.innerHTML += '.GlobalSideBar{display:none !important;}'
        cssFix.innerHTML += '.Topstory-container{width:100% !important;padding:0 !important}'
        cssFix.innerHTML += '.Topstory-mainColumn{width:100% !important;}'
        document.getElementsByTagName('head')[0].appendChild(cssFix)
    }
    //
})()
