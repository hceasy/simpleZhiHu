// ==UserScript==
// @name            极简知乎
// @version         18.12.06.1
// @author          hceasy
// @namespace       https://hceasy.com
// @supportURL      https://github.com/hceasy/simpleZhiHu/issues
// @description     有些时候看知乎不是那么方便,你懂的.
// @match           *://www.zhihu.com/question/*
// @match			*://www.zhihu.com/search*
// @run-at          document-end
// ==/UserScript==
;(function() {
  'use strict'
  // 区分搜索问答页面
  let webUrl = window.location.pathname
  let pageType
  if (webUrl.indexOf('question') >= 0) {
    pageType = 'question'
  } else if (webUrl.indexOf('search') >= 0) {
    pageType = 'search'
  }
  // 用GitHub的图标替换
  var fake_title = 'GitHub'
  var fake_icon = 'https://assets-cdn.github.com/favicon.ico'
  // icon也改了.(IE邪教,凉了,没的治)
  var link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement('link')
  window.onload = function() {
    let _t
    let _q
    if (typeof localStorage.szt === 'undefined') {
      localStorage.szt = 'false'
      localStorage.szq = 'false'
    } else {
      _t = localStorage.szt
      _q = localStorage.szq
    }
    if (localStorage.szt === 'false') {
      // 改下标题
      window.document.title = fake_title
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = fake_icon
    }
    document.onkeydown = function(event) {
      var e = event || window.event
      if (e.keyCode == 84 && e.ctrlKey && e.shiftKey && e.altKey) {
        if (localStorage.szt === 'true') {
          localStorage.szt = 'false'
          alert('标题栏替换开启')
        } else {
          localStorage.szt = 'true'
          alert('标题栏替换关闭')
        }
        window.location.reload()
      }
      if (e.keyCode == 81 && e.ctrlKey && e.shiftKey && e.altKey) {
        if (localStorage.szq === 'true') {
          localStorage.szq = 'false'
          alert('问题显示开启')
        } else {
          localStorage.szq = 'true'
          alert('问题显示关闭')
        }
        window.location.reload()
      }
    }
    if (!localStorage.szq) {
      window.document.title = fake_title
    }
    document.getElementsByTagName('head')[0].appendChild(link)
    switch (pageType) {
      case 'question':
        fixQuestionPage()
        break
      case 'search':
        fixSearchPage()
        break
    }
  }
  function fixQuestionPage() {
    var cssFix = document.createElement('style')
    // 吸底的评论栏
    cssFix.innerHTML += '.RichContent-actions{bottom:auto !important;}'
    // 直接屏蔽顶部问题相关
    if (localStorage.szq === 'false') {
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
  function fixSearchPage() {
    var cssFix = document.createElement('style')
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
  //
})()
