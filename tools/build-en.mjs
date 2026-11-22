import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const translations = {
  '天蓝晨风的小天地': "Skyblue's little cloud",
  '跳到正文': 'Skip to content', '一匹小马的主页': 'A little pony homepage',
  '认识我': 'Meet me', '喜欢的事': 'Little joys', '听点音乐': 'Music', '打个招呼': 'Say hello',
  '欢迎来到我的小天地': 'Welcome to my little cloud', '你好呀，我是': "Hello, I'm", '天蓝晨风': 'Skyblue',
  '一匹住在上海的蓝色小天马。': 'A blue pegasus living in Shanghai.',
  '这里收着我的画、喜欢的歌，': 'Here are my drawings, favourite songs,',
  '还有一些想慢慢实现的小小愿望。': 'and a few dreams I am working on.',
  '来坐一会儿吧': 'Stay for a little while', '来自云中城 ☁': 'Cloudsdale born ☁',
  '很高兴你找到这里 ♡': 'So glad you found me ♡', '往下翻翻我的小手帐': 'A little more about me below',
  '一张小马名片': 'A little introduction', '来自云中城': 'From Cloudsdale',
  '先从名字说起': 'First, a name', '叫我天蓝': 'You can call me', '就好啦。': 'Skyblue.',
  '我的全名是 Skyblue Mornbreeze，也可以叫我天蓝。自设出生在云中城，现在生活在上海，一边学习和科研，一边做一个快乐的 Brony。': 'My full name is Skyblue Mornbreeze. My ponysona was born in Cloudsdale; in the human world I live in Shanghai, studying, doing research, and enjoying life as a Brony.',
  '在不同的地方，也许你会听到朋友叫我 Skyblue 或小蓝。名字不一样，都是同一匹喜欢认识新朋友的小马。': 'Friends may call me Skyblue, Tianlan, or Xiaolan. Every name belongs to the same pony, who is always happy to meet new friends.',
  '☁ 云中城出身': '☁ Born in Cloudsdale', '⌁ 现在在上海': '⌁ Now in Shanghai',
  '收集一点小快乐': 'Collecting little joys', '最近和一直喜欢的事': 'Things close to my heart',
  '把喜欢的事情，': 'A few things', '一件件留在这里。': 'that make me happy.',
  '一起出发': 'Off we go', '带着天琴心弦去旅行': 'Travelling with Lyra',
  '喜欢带着布偶到处走走、拍拍照片。每一段旅途都能留下新的故事。': 'I love taking my Lyra Heartstrings plush on trips and taking photos together. There is always another little story to bring home.',
  '慢慢练习': 'Little by little', '画画、写故事、做音乐': 'Drawing, stories & music',
  '还在学习，但总想把脑海中的小马世界画出来、写出来、唱出来。': 'I am still learning to draw, write, and make music. There are so many pony ideas in my head that I want to share.',
  '一个大愿望': 'One big wish', '造一匹真正的机器马': 'A robot pony of my own',
  '希望有一天，能做出像 Sweetiebot 一样厉害的机器小马。': 'Someday I hope to build a robot pony as wonderful as Sweetiebot.',
  '还可以去这些地方': 'More places to visit', '给你留了几扇门': 'A few doors left open',
  '再逛一会儿？': 'A little wander?', '跟我来。': 'Come along.',
  '我的地图、画廊，还有小马朋友们。挑一个喜欢的地方看看吧。': 'My map, my gallery, and my pony friends. Pick somewhere you would like to visit.',
  '我的小马国地图': 'My map of Equestria', '在地图上探索我的不同身份': 'Get to know me, one city at a time',
  '画廊与旅途': 'My gallery & travels', '看看我的画和喜欢的照片': 'Drawings and favourite photographs',
  '关于机器马的一个大梦想': 'A big dream about robot ponies', '找到其他小马': 'Meet other ponies',
  '小马社群与同好们': 'Pony communities and friends', '分你一只耳机': 'An earphone for you',
  '我的小小歌单': 'My little playlist', '要不要一起': 'Shall we listen', '听首歌？': 'to a song?',
  '五首我喜欢的小马音乐。选一首，加载播放器，再按下播放键就好。': 'Five pony songs I love. Choose one, load the player, and press play.',
  '现在想听': 'On the playlist', '加载官方播放器': 'Load the official player', '在 Bandcamp 打开原曲': 'Listen on Bandcamp',
  '点击加载才会连接 Bandcamp。歌曲由音乐人或发行方提供，本站不托管音频；播放受其平台规则与浏览器设置影响。': 'Bandcamp connects only when you load the player. Music is hosted by its artists or publishers. Playback follows their platform rules and your browser settings.',
  '留一封来自云端的信': 'A note from the clouds', '下次也来': 'Come back', '找我玩呀。': 'and say hello.',
  '如果你也是 Brony，或者只是想聊聊画画、音乐与天马行空的点子，欢迎来找我。': 'If you are a Brony too, or just feel like talking about art, music, or a wonderfully silly idea, I would love to hear from you.',
  '去我的小马国': 'Visit my Equestria', '了解人类世界的我 ↗': 'Meet my human side ↗',
  '本站无账户与行为追踪。音乐播放器仅在点击加载后连接 Bandcamp。': 'No accounts or activity tracking. Bandcamp connects only after you load its player.',
  '回到云端 ↑': 'Back to the clouds ↑', '拖动我四处走走 ✦': 'Drag me along ✦',
  '认识天蓝晨风 Skyblue Mornbreeze：一匹来自云中城、喜欢创作与探索的蓝色小天马。': 'Meet Skyblue Mornbreeze, a blue pegasus from Cloudsdale who loves creating, exploring, and making friends.',
  '返回顶部': 'Back to top', '页面导航': 'Page navigation',
  '天蓝晨风的蓝色飞马形象，站在云朵与蓝天下': 'Skyblue, a blue pegasus surrounded by clouds and blue sky',
  '天蓝晨风的可爱 Q 版形象': 'A cute chibi illustration of Skyblue',
  '天蓝晨风展开翅膀的插画': 'Skyblue spreading their wings', '粉色背景中的天蓝晨风插画': 'Skyblue on a pink background',
  '天蓝晨风的飞马立绘': 'A full-body portrait of Skyblue', '天蓝晨风的云朵可爱标记': "Skyblue's cloud cutie mark",
  '选择歌曲': 'Choose a song', '可拖动的桌面小马': 'Draggable pony companion',
  '小马天蓝，可拖动；点击打招呼，方向键可移动': 'Skyblue the pony: drag, click to say hello, or use the arrow keys to move',
  '收起桌面小马': 'Hide pony companion'
};

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
let html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  .replace('<html lang="zh-CN">', '<html lang="en">')
  .replace('<link rel="canonical" href="https://pony.hachile.org/">', '<link rel="canonical" href="https://pony.hachile.org/en/">');
html = html.replace(/>([^<>]+)</g, (full, inner) => {
  const text = inner.trim();
  return translations[text] ? `>${inner.replace(text, escape(translations[text]))}<` : full;
}).replace(/(alt|aria-label|content)="([^"]*)"/g, (full, attr, text) => translations[text] ? `${attr}="${escape(translations[text])}"` : full)
  .replace('href="/en/" lang="en" hreflang="en" aria-label="Switch to English">English', 'href="/" lang="zh-CN" hreflang="zh-CN" aria-label="切换到中文版">中文')
  .replaceAll('href="https://sky.hachile.org/"', 'href="https://sky.hachile.org/en/"')
  .replaceAll('href="https://home.hachile.org/"', 'href="https://home.hachile.org/en/"');
const text = html.replace(/(?:src|href)="[^"]*"/g, '').replace('切换到中文版', '').replace('中文', '');
if (/[\u3400-\u9fff]/.test(text)) throw new Error('English page has untranslated Chinese text.');
mkdirSync(new URL('../en/', import.meta.url), { recursive: true });
writeFileSync(new URL('../en/index.html', import.meta.url), html);
console.log('English page generated; visible copy and accessibility labels translated.');
