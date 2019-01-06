# DPlayer-xlsx

>  🀀󻀀 xlsx-Database Player

![](https://img.shields.io/badge/DPlayer-1.25.0-orange.svg)
![](https://img.shields.io/badge/Bootsrtap-3.3.7-blue.svg)
![](https://img.shields.io/badge/JS_xlsx-2013-green.svg)
![](https://img.shields.io/badge/OwO-1.0-white.svg)
![](https://img.shields.io/badge/JS_color-2.0.5-red.svg)
 
## 使用说明
数据在`package/data.xlsx`中，为`Office Excel`文件

## 数据说明

|  参数  | 说明 | 
| ---- | ----------- |
| id | 视频文件唯一id，在Excel中拉动手柄会自动填充 |
| category | 分类 |
| name | 节目名称 |
| title | 分集标题 |
| url | 直链地址 |
| suffix | 后缀名 |
| desc | 分集简介 |
| time | 视频年份 |
| addition | 第三方弹幕，参考[如何获取cid](https://blog.menhood.wang/player.html) |
| pic | 封面地址 |
| max | 最大集数 |


## 修改方式：
~~在`index.html`文件中的`nav navbar-nav`后复制代码~~，
~~修改onclick="aclick(5,1)"，前面的数字是xlsx中的节目起始id，后面的是集数~~
已经是自动获取了。首页为最近6条更新内容，在`s.js`的`第117行`把`7`改为想要的数字即可

## 注意事项：
xlsx文件格式必须保持不变，sheet1的名称必须为 `alldata`

xlsx文件中下拉手柄可`自动填充`数字，所以id、title、url结尾是纯数字，便于操作

url和title的值小于10时需要在前面加数字`0`，以保证资源正常读取，排版不乱

资源`url`地址格式为：`路径/01.MP4`  必须以数字为文件名才能切换集数

`suffix`即后缀名区分大小写，大小写不对可能无法加载资源，记得在前面加英文句号`.`

表格文件地址在`package/s.js`第`21`行，直接替换引号内的地址即可

弹幕以及评论服务器地址在`package/s.js`第`8、9`行，根据需要自行修改

## Author

**biliblog** © [Menhood](https://github.com/menhood), Released under the [MIT](./LICENSE) License.<br>

> Blog [@Menhood](https://menhood.wang) · GitHub [@Menhood](https://github.com/Menhood) · Twitter [@Menhoodt](https://twitter.com/menhoodt) · Telegram Channel [@Menhood](https://t.me/Menhood)