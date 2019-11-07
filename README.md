# 极简知乎

[GitHub 项目地址](https://github.com/hceasy/simpleZhiHu/)

### 作用

有时候因为你懂得原因,浏览知乎不是很方便.这个油猴脚本用来改变下知乎界面

### 原理

- 替换 icon 小图标
- 改变 title 为自己设定的标题
- 屏蔽一些不太重要的模块,如评论吸底,右侧介绍栏目
- 内容展开

### 使用方法

1.安装 Greasemonkey 或 Tampermonkey

- Firefox

  [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)

  [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/)

- Chrome

  [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

  2.下载脚本安装

  点击[simpleZhiHu](https://greasyfork.org/zh-CN/scripts/37823-%E6%9E%81%E7%AE%80%E7%9F%A5%E4%B9%8E)下载,

  3.浏览知乎某个问题列表,页面加载完便会生效.

  4.`ctrl`+`shift`+`T`/`ctrl`+`shift`+`Q` 切换隐藏标题与隐藏提问开关

### 效果

![](https://hceasy.com/app/demo.png)

### 备注

### 已适配

- \*://www.zhihu.com/question/\* 问题页面

- \*://www.zhihu.com/search\* 搜索页面

- \*://www.zhihu.com/signin\* 登录页面

- \*://www.zhihu.com/hot 热榜

- \*://www.zhihu.com/follow 关注

- \*://www.zhihu.com/ 个人首页

### 0.1.16 更新

- 加入未登录直接跳转到热榜按钮

### 0.1.15 更新

- mac 中 `ctrl`+`alt`+`shift` 会导致字母变符号,去掉 `alt` 兼容 mac
- 隐藏标题与隐藏提问改为快捷键 `ctrl`+`shift`+`T`/`ctrl`+`shift`+`Q`

### 0.1.14 更新

- 解决 Greasemonkey 中脚本不运行的问题
- 隐藏标题与隐藏提问改为快捷键 `ctrl`+`alt`+`shift`+`T`/`ctrl`+`alt`+`shift`+`Q`

### 19.6.9 更新

- 适配了首页的关注，热榜

### 12.13 更新

- 优化了切换标题与问题显示功能

### 12.06 更新

- 加入切换标题与问题显示功能

### 9.13 更新

- 适配搜索结果页面

### 7.27 更新

- 图片最大 300 像素
- 去掉问题顶部提示框
