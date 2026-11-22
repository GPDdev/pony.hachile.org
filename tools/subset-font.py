"""Build the website-only WenKai subset: python tools/subset-font.py source.ttf."""
from pathlib import Path
import sys
from fontTools import subset

root = Path(__file__).resolve().parent.parent
text = ''.join((root / file).read_text(encoding='utf-8') for file in ('index.html', 'en/index.html', 'script.js', 'style.css'))
options = subset.Options()
options.flavor = 'woff2'
options.name_IDs = ['*']
options.name_legacy = True
options.name_languages = ['*']
font = subset.load_font(sys.argv[1], options)
missing = sorted(set(c for c in text if '\u3400' <= c <= '\u9fff') - {chr(c) for c in font.getBestCmap()})
if missing:
    raise ValueError('Missing Chinese glyphs: ' + ''.join(missing))
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
output = root / 'fonts/pony-wenkai.woff2'
subset.save_font(font, output, options)
print(f'All Chinese characters covered; {output.stat().st_size:,} bytes.')
