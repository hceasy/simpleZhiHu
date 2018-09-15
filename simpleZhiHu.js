// ==UserScript==
// @name            极简知乎
// @version         18.9.15.1
// @author          hceasy
// @namespace       https://hceasy.com
// @supportURL      https://github.com/hceasy/simpleZhiHu/issues
// @description     有些时候看知乎不是那么方便,你懂的.
// @match           *://www.zhihu.com/question/*
// @match			*://www.zhihu.com/search*
// @run-at          document-idle
// ==/UserScript==
(function() {
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
  // 改下标题
  window.document.title = fake_title

  // icon也改了.(IE邪教,凉了,没的治)
  var link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = fake_icon
  document.getElementsByTagName('head')[0].appendChild(link)
  switch (pageType) {
    case 'question':
      console.log('q')
      fixQuestionPage()
      break
    case 'search':
      console.log('s')
      fixSearchPage()
      break
  }
  function fixQuestionPage() {
    var cssFix = document.createElement('style')
    // 吸底的评论栏
    cssFix.innerHTML += '.RichContent-actions{bottom:auto !important;}'
    // 问题评论
    cssFix.innerHTML += '.QuestionHeader-footer{display:none !important;}'
    // 直接屏蔽顶部问题相关
    cssFix.innerHTML += '.QuestionHeader{display:none !important;}'
    cssFix.innerHTML += '.Question-main{margin:0 !important;}'
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
