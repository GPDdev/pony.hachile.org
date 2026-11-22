# Skyblue's little cloud

<div align="center"><img alt="Tests" src="https://img.shields.io/badge/tests-node%20test-blue"><img alt="License" src="https://img.shields.io/badge/code-MIT-green"><img alt="Version" src="https://img.shields.io/badge/version-1.10.17-lightgrey"><img alt="Language" src="https://img.shields.io/badge/HTML-CSS-JavaScript-blue"></div>

天蓝晨风的小马身份主页，收着自我介绍、插画、喜欢的音乐和站点入口。页面使用信纸、照片和贴纸细节，带有滚动渐显及可拖动的小马伙伴。

[中文版](https://pony.hachile.org/) / [English](https://pony.hachile.org/en/)

## 目录

- [本地预览](#本地预览)
- [维护](#维护)
- [字体与素材](#字体与素材)
- [测试与部署](#测试与部署)
- [参与贡献](#参与贡献)
- [许可](#许可)

## 本地预览

纯静态 HTML、CSS 和 JavaScript，无运行时框架或后端。仓库根目录执行：

```sh
python -m http.server 8000
```

浏览器打开 `http://localhost:8000/` 或 `http://localhost:8000/en/`。必须以仓库根目录提供服务，资源使用根路径。

## 维护

| 文件 | 用途 |
| --- | --- |
| `index.html` | 中文主页源文件 |
| `tools/build-en.mjs` | 英文文案及静态英文页面生成 |
| `en/index.html` | 可直接访问的完整英文页 |
| `style.css` | 共享字体、主题、响应式布局与动画 |
| `script.js` | 五首官方音乐的选择与懒加载，桌宠移动、拖动和方向保持 |
| `fonts/` | 中文网页字体子集及原许可证 |
| `素材/`、`gif/` | 站主提供的插画与 Pony Town 动画 |

修改中文文案后，同步更新翻译映射，再运行：

```sh
node tools/build-en.mjs
```

生成器会检查英文页是否残留未翻译的中文正文和标签。两页都带语言切换、canonical 和 hreflang；切换不依赖 JavaScript。

音乐仅在点击“加载官方播放器”后连接 Bandcamp。本站不托管音频，不使用账户、浏览行为追踪或分析服务。第三方播放器内部的样式由 Bandcamp 控制。

## 字体与素材

- 英文统一使用站主提供的 `Equestria-4.otf`，保持原始字重，关闭合成粗体。
- 中文统一使用 [霞鹜文楷 Regular v1.530](https://github.com/lxgw/LxgwWenKai/releases/tag/v1.530)。`fonts/pony-wenkai.woff2` 为网站文案专用子集，原始字体采用 [SIL OFL 1.1](fonts/OFL.txt)。
- 添加中文字符后需重新生成子集。下载原始 `LXGWWenKai-Regular.ttf`，安装字体工具后执行：

```sh
python -m pip install "fonttools[woff]"
python tools/subset-font.py /path/to/LXGWWenKai-Regular.ttf
```

子集覆盖中文、英文页和交互脚本的字符，并检查中文缺字。原始 TTF 不必提交。

## 测试与部署

```sh
node --test tests/*.test.mjs
```

检查桌宠只有在走路或飞行时移动、保持最后朝向及 GIF 原始尺寸，并验证歌曲和素材引用。页面改动还需检查中英文、手机布局、字体加载、键盘操作和减少动态效果设置。

GitHub Pages 从 `main` 根目录部署。`CNAME` 为 `pony.hachile.org`，DNS 指向 `gpddev.github.io`，开启 Enforce HTTPS。源代码与生成的英文页一同提交；更新日志同步到 Home 和 Site，使用相同版本号。

## 参与贡献

欢迎在 [Issues](https://github.com/GPDdev/pony.hachile.org/issues) 报告布局、翻译或交互问题。请说明页面语言、设备宽度与复现步骤。

## 许可

本项目的原创 HTML、CSS、JavaScript 和工具代码采用 [MIT 许可证](LICENSE)。该授权不包含角色设定、插画、GIF、音乐或 Equestria 字体；这些内容保留各自权利人的权利。霞鹜文楷及其网页子集依照随附 OFL 许可证分发。
