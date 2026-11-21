"""Generate the original, looping project demos. Requires Pillow 10+.
Run from the repository root: python scripts/generate-project-previews.py
"""
from pathlib import Path
from math import sin, cos, pi
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'static/projects'
OUT.mkdir(parents=True, exist_ok=True)
W, H, SCALE = 720, 440, 2
BG = '#0b0b0b'
WHITE, MUTED, LINE = '#dfdfe2', '#85858e', '#303033'
FONT = ROOT / 'static/fonts/Geist-Regular.ttf'

def ease(x):
    x = max(0, min(1, x))
    return x*x*(3-2*x)

def font(size):
    return ImageFont.truetype(str(FONT), round(size*SCALE))

def line(points, fill=LINE, width=1):
    d.line([(round(x*SCALE), round(y*SCALE)) for x,y in points], fill=fill, width=round(width*SCALE), joint='curve')

def rect(box, fill, outline=None, radius=6):
    d.rounded_rectangle(tuple(round(v*SCALE) for v in box), radius=round(radius*SCALE), fill=fill, outline=outline, width=SCALE)

def text(x,y,value,size=17,fill=WHITE,anchor=None):
    d.text((round(x*SCALE),round(y*SCALE)),value.lower(),font=font(size),fill=fill,anchor=anchor)

def circle(x,y,r,fill,outline=None):
    d.ellipse(tuple(round(v*SCALE) for v in (x-r,y-r,x+r,y+r)),fill=fill,outline=outline,width=SCALE)

def cursor(x,y,click=False):
    if click:
        circle(x+5,y+7,19,'#242428')
    p=[(x,y),(x+2,y+23),(x+8,y+17),(x+13,y+28),(x+18,y+25),(x+13,y+15),(x+22,y+14)]
    d.polygon([(round(a*SCALE),round(b*SCALE)) for a,b in p],fill='#ededed',outline='#0b0b0b',width=2*SCALE)

def cine(t):
    # A quiet movie toolbar: rating, favourite and watchlist.
    y=222
    for i,h in enumerate([9,17,25]): line([(154+i*7,y+9),(154+i*7,y+9-h)],MUTED,2)
    text(191,y-10,'Cine',18)
    active = 1.25 < t < 3.25
    circle(328,y,27,'#19170f' if active else BG)
    points=[]
    for i in range(10):
        a=-pi/2+i*pi/5; r=13 if i%2==0 else 6
        points.append((328+cos(a)*r,y+sin(a)*r))
    d.polygon([(round(a*SCALE),round(b*SCALE)) for a,b in points],fill='#d9b873' if active else BG,outline='#d9b873' if active else MUTED,width=2*SCALE)
    text(359,y-11,'8.5' if active else '8.4',17)
    line([(438,210),(450,210),(450,235),(444,230),(438,235),(438,210)],WHITE,2)
    text(467,y-11,'Watchlist',17,MUTED)
    x=388-51*ease((t-.45)/.7)+51*ease((t-2.1)/.8)
    cy=277-49*ease((t-.45)/.7)+49*ease((t-2.1)/.8)
    cursor(x,cy,1.18<t<1.45)

def eustoma(t):
    # A small bot reply and a selected inline action.
    rect((190,111,530,290),'#151515', '#282828',9)
    circle(216,138,10,'#232724'); text(212,129,'e',14,'#a6c4ae')
    text(235,126,'Eustoma',17); text(452,129,'bot',13,MUTED)
    line([(206,161),(514,161)],'#242424')
    text(212,183,'How can I help?',18)
    active=1.2<t<3.1
    rect((207,225,513,268),'#1c2922' if active else '#202020', '#304c3d' if active else '#2c2c2c',5)
    text(360,246,'Connected' if active else 'Connect',16,'#85c5a3' if active else WHITE,anchor='mm')
    if active:
        line([(451,245),(456,250),(465,240)],'#85c5a3',2)
    x=489-80*ease((t-.4)/.7)+80*ease((t-2.1)/.8)
    y=321-67*ease((t-.4)/.7)+67*ease((t-2.1)/.8)
    cursor(x,y,1.15<t<1.45)

def icebergify(t):
    # A popularity chart gently reveals another listening tier.
    rect((133,84,587,356),'#101010','#303033',5)
    for x in range(180,580,58):
        for y in range(105,345,10): line([(x,y),(x,y+2)],'#2c2c30')
    line([(134,178),(586,178)],'#303033')
    line([(134,246),(586,246)],'#303033')
    text(153,101,'Your listening iceberg',16,MUTED)
    text(153,159,'MOST PLAYED',10,'#707078')
    text(153,227,'UNDER THE SURFACE',10,'#707078')
    text(153,295,'HIDDEN GEMS',10,'#707078')
    progress=ease((t-.4)/1.8)*(1-ease((t-2.7)/1.1))
    points=[(155,211),(217,211),(280,211),(342,188),(405,160),(468,141),(565,141)]
    end=progress*(len(points)-1)
    path=points[:int(end)+1]
    if int(end)<len(points)-1:
        a,b=points[int(end)],points[int(end)+1]; f=end-int(end)
        path.append((a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f))
    if len(path)>1: line(path,'#b8c5d0',2)
    x,y=path[-1]; circle(x,y,3,'#cdd9e2')
    if progress>.95:
        rect((458,180,558,211),'#202024','#33333a',4)
        text(508,195,'Top 1%',14,WHITE,anchor='mm')

def bonch(t):
    # A registry row gains a checked state.
    rect((130,94,590,346),'#121212','#303033',6)
    text(152,113,'Research registry',17)
    rect((483,110,568,140),'#202022','#343438',4)
    text(525,125,'+ Add',13,WHITE,anchor='mm')
    line([(131,158),(589,158)],'#2c2c30')
    text(185,176,'TITLE',10,MUTED); text(470,176,'STATUS',10,MUTED)
    for i,w in enumerate([165,132,185]):
        y=216+i*45
        circle(157,y,5,'#222226', '#55555d')
        rect((185,y-3,185+w,y+3),'#56565f',radius=2)
        if i==0 and 1.3<t<3.3:
            circle(157,y,7,'#263b30'); line([(154,y),(157,y+3),(162,y-4)],'#92b89d',1)
            text(470,y-8,'Saved',13,'#92b89d')
        else: rect((472,y-3,535,y+3),'#313137',radius=2)
        if i<2: line([(149,y+23),(572,y+23)],'#242427')
    x=220-63*ease((t-.45)/.7)+63*ease((t-2.1)/.8)
    y=264-48*ease((t-.45)/.7)+48*ease((t-2.1)/.8)
    cursor(x,y,1.2<t<1.45)

for name,draw in [('cine',cine),('eustoma',eustoma),('icebergify',icebergify),('bonch',bonch)]:
    frames=[]
    for n in range(60):
        im=Image.new('RGB',(W*SCALE,H*SCALE),BG)
        d=ImageDraw.Draw(im)
        draw(n/15)
        frames.append(im.resize((W,H),Image.Resampling.LANCZOS))
    frames[0].save(OUT/f'{name}.webp',save_all=True,append_images=frames[1:],duration=[67,67,66]*20,loop=0,quality=85,method=6,minimize_size=True)
    frames[0].save(OUT/f'{name}-poster.webp',quality=90,method=6)
    with Image.open(OUT/f'{name}.webp') as check:
        assert check.is_animated and check.n_frames>1
        print(f'{name}: {check.n_frames} frames, {check.size}, {(OUT/f"{name}.webp").stat().st_size // 1024} KB')
