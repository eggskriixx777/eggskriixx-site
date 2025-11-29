import React, { useState, useEffect, useRef } from 'react';
import { Play, Instagram, Youtube, Mail, Clock } from 'lucide-react';

/**
 * EGGSKRIIXX Official Site
 * - Hero: 原本 Liquid 封面
 * - 其他：玻璃背景 + 所有主要照片都有金屬反光框
 */

// --- Icons ---
const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// 1. Trailing Cursor
const TrailingCursor = () => {
  const [trail, setTrail] = useState([]);
  const idCounter = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setTrail((prev) => {
        idCounter.current += 1;
        const newTrail = [
          ...prev,
          { x: e.clientX, y: e.clientY, id: idCounter.current },
        ];
        if (newTrail.length > 20) newTrail.shift();
        return newTrail;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] mix-blend-screen bg-indigo-500/30 blur-md"
        style={{
          transform:
            trail.length > 0
              ? `translate(${trail[trail.length - 1].x - 16}px, ${
                  trail[trail.length - 1].y - 16
                }px)`
              : "none",
          transition: "transform 0.05s linear",
        }}
      />

      <div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[101]"
        style={{
          transform:
            trail.length > 0
              ? `translate(${trail[trail.length - 1].x - 4}px, ${
                  trail[trail.length - 1].y - 4
                }px)`
              : "none",
        }}
      />

      {trail.map((point, index) => {
        const size = (index / trail.length) * 20;
        const opacity = (index / trail.length) * 0.6;

        return (
          <div
            key={point.id}
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[99] mix-blend-screen"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: point.x,
              top: point.y,
              transform: "translate(-50%, -50%)",
              backgroundColor:
                index % 2 === 0
                  ? "rgba(100, 100, 255, 0.8)"
                  : "rgba(200, 200, 255, 0.5)",
              opacity,
              boxShadow: `0 0 ${size}px rgba(100,100,255,0.5)`,
            }}
          />
        );
      })}
    </>
  );
};

// 2. Liquid Background (Hero)
const LiquidBackground = ({ image }) => {
  const [turbulence, setTurbulence] = useState(0);
  const requestRef = useRef();
  const targetTurbulence = useRef(0);

  const handleMouseMove = () => {
    targetTurbulence.current = 0.03;
  };

  useEffect(() => {
    const animate = () => {
      targetTurbulence.current *= 0.95;
      setTurbulence((prev) => prev + (targetTurbulence.current - prev) * 0.1);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="hero-liquid">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${0.01 + turbulence} ${0.01 + turbulence}`}
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={500 * turbulence}
            />
          </filter>
        </defs>
      </svg>

      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-100"
        style={{
          backgroundImage: `url(${image})`,
          filter: `url(#hero-liquid) brightness(0.9)`,
          transform: "scale(1.05)",
        }}
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

// 3. Metal Title
const MetalTitle = ({ text }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative z-20 text-center mix-blend-screen px-4 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="text-distortion">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={hovered ? "0.08" : "0"}
              numOctaves="1"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={hovered ? "15" : "0"}
            />
          </filter>
        </defs>
      </svg>

      <h1
        className="text-[15vw] md:text-[13vw] font-black leading-none tracking-normal select-none transition-all duration-500 ease-out"
        style={{
          fontFamily: "'Rubik Puddles', system-ui",
          transform: `scaleY(1.2) ${hovered ? "scale(1.05)" : "scale(1)"}`,
          background:
            "linear-gradient(180deg, #ffffff 0%, #e6e6e6 45%, #666666 50%, #ffffff 55%, #cccccc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter:
            "drop-shadow(0px 0px 20px rgba(255,255,255,0.6)) url(#text-distortion)",
        }}
      >
        {text}
      </h1>
    </div>
  );
};

// 4. Spotify Row
const SpotifyRow = ({
  index,
  title,
  artist,
  duration,
  image,
  isAlbum,
  url,
  tracks,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group flex flex-col border-b border-[#222] bg-black/70 hover:bg-black/80 backdrop-blur-[1px] transition-colors duration-200">
      <div
        className="flex items-center gap-4 p-3 cursor-pointer"
        onClick={() =>
          isAlbum ? setExpanded(!expanded) : window.open(url, "_blank")
        }
      >
        <div className="w-8 text-center text-gray-400 font-mono text-sm group-hover:hidden">
          {index}
        </div>
        <div className="w-8 hidden group-hover:flex justify-center text-green-500">
          <Play size={16} fill="currentColor" />
        </div>

        <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-sm bg-[#333]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={`font-bold text-sm md:text-base truncate ${
              expanded ? "text-green-500" : "text-white"
            }`}
          >
            {title}
          </div>
          <div className="text-gray-400 text-xs truncate">{artist}</div>
        </div>

        <div className="text-gray-300 text-xs font-mono w-12 text-right">
          {duration}
        </div>
      </div>

      {isAlbum && expanded && (
        <div className="bg-black/80 px-4 py-4 md:pl-20 md:pr-8 border-t border-white/10 w-full animate-slide-down overflow-hidden backdrop-blur-[2px]">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-700 pb-1">
            Album Tracks
          </div>
          <div className="flex flex-col gap-1">
            {tracks.map((t, i) => (
              <a
                key={i}
                href={t.url}
                target="_blank"
                rel="noreferrer"
                className="flex justify-between items-center py-2 hover:bg-white/5 px-2 rounded group/track cursor-pointer"
              >
                <div className="flex gap-4 items-center">
                  <span className="text-gray-500 text-xs font-mono w-6 text-right">
                    {i + 1}
                  </span>
                  <span className="text-gray-200 text-sm group-hover/track:text-white">
                    {t.title}
                  </span>
                </div>
                {t.feat && (
                  <span className="text-gray-400 text-xs hidden md:block">
                    {t.feat}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. MV Item（加金屬框）
const MVItem = ({ title, url, image, index }) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="group relative block aspect-video overflow-hidden"
  >
    <div className="metal-frame w-full h-full">
      <div className="metal-frame-inner w-full h-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-100 transition-all duration-700 transform group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
          <div className="flex justify-between items-start">
            <span
              className="text-white font-black text-2xl font-mono mix-blend-overlay"
              style={{ fontFamily: "'Syncopate', sans-serif" }}
            >
              {index}
            </span>
            <div className="bg-red-600 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
              Official Video
            </div>
          </div>
          <h3
            className="text-white font-bold text-lg md:text-xl uppercase tracking-tighter translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            style={{ fontFamily: "'Syncopate', sans-serif" }}
          >
            {title}
          </h3>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Play fill="white" size={24} />
          </div>
        </div>
      </div>
    </div>
  </a>
);

// 6. Merch Item（商品圖加金屬框）
const MerchItem = ({ title, image, link, label }) => (
  <a
    href={link}
    target="_blank"
    rel="noreferrer"
    className="group block bg-black/70 border border-white/10 hover:border-white/50 transition-colors backdrop-blur-[2px]"
  >
    <div className="aspect-square relative">
      <div className="metal-frame w-full h-full">
        <div className="metal-frame-inner w-full h-full">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>
      <div className="absolute top-2 right-2 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
        {label}
      </div>
    </div>
    <div className="p-4">
      <h3
        className="text-white font-bold text-lg uppercase tracking-wide mb-2"
        style={{ fontFamily: "'Syncopate', sans-serif" }}
      >
        {title}
      </h3>
      <div className="w-full py-2 bg-white text-black text-center text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
        Buy Now
      </div>
    </div>
  </a>
);

// --- Main App ---
export default function App() {
  const [loading, setLoading] = useState(true);

  const images = {
    hero: "/MEITU_20250725_055335885.jpg",
    profile: "/MEITU_20251020_040324866.jpg",
    cover_luv: "/1000y封面.jpg",
    cover_poker: "/未命名-1_工作區域 1.jpg",
    cover_pokermerch: "/MEITU_20251020_171046099.jpg",
    cover_die: "/MF5LqHAt2UmywpKCZJ2GoV.jpg",
    cover_no_love: "/SpzaRfFpZjaczN29Qsw2qV.jpg",
    cover_world: "/9hYoyGUCDcWjVJYiU33AYU.jpg",
    cover_take: "/EXvkS4nG4wRfCFb9Ayzc39.jpg",
    cover_miss: "/FSiJdBqhN2ye79ZEg22cY2.jpg",
    cover_notok: "/YUCijDttt3UiQX8vN33GUE.jpg",
    merch_sticker: "/20241119_180411.jpg",
    glass: "/shattered-glass-5k-3840x1080-16152.jpg",
  };

  const ytThumbs = {
    satellite: "https://img.youtube.com/vi/zBPXHttydFk/maxresdefault.jpg",
    fuzhao: "https://img.youtube.com/vi/UVsG4hc2C_Q/maxresdefault.jpg",
    memories: "https://img.youtube.com/vi/hHkXSXCInXs/maxresdefault.jpg",
    takeit: "https://img.youtube.com/vi/_NvT_9iaLjU/maxresdefault.jpg",
  };

  const releases = [
    {
      title: "luv u 1000yrs",
      artist: "蛋蛋EGgskriiXX",
      year: "2025",
      duration: "3:01",
      image: images.cover_luv,
      type: "Single",
      url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+luv+u+1000yrs",
    },
    {
      title: "殘心 Poker",
      artist: "蛋蛋EGgskriiXX",
      year: "2025",
      duration: "17 首歌曲",
      image: images.cover_poker,
      type: "Album",
      isAlbum: true,
      url: "#",
      tracks: [
        {
          title: "GAME START",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+GAME+START",
        },
        {
          title: "回眸",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+回眸",
        },
        {
          title: "回眸pt2",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+回眸pt2",
        },
        {
          title: "shawty",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+shawty",
        },
        {
          title: "那些回憶一天一天沖淡了餘溫",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+那些回憶",
        },
        {
          title: "翅膀",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+翅膀",
        },
        {
          title: "TOO YOUNG",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+TOO+YOUNG",
        },
        {
          title: "浮躁",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+浮躁",
        },
        {
          title: "女孩坐上帕拉梅拉",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+女孩坐上帕拉梅拉",
        },
        {
          title: "純愛小帥",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+純愛小帥",
        },
        {
          title: "我恨妳 ihateugirl",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+我恨妳",
        },
        {
          title: "衛星",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+衛星",
        },
        {
          title: "你讓我成了emo神",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+你讓我成了emo神",
        },
        {
          title: "台北的雨一直下",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+台北的雨一直下",
        },
        {
          title: "你把它全都帶走",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+你把它全都帶走",
        },
        {
          title: "傷心果",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+傷心果",
        },
        {
          title: "GAME OVER",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+GAME+OVER",
        },
      ],
    },
    {
      title: "通通去死吧",
      artist: "蛋蛋EGgskriiXX",
      year: "2025",
      duration: "2:03",
      image: images.cover_die,
      type: "Single",
      url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+通通去死吧",
    },
    {
      title: "我們之間沒有愛了吧",
      artist: "蛋蛋EGgskriiXX",
      year: "2024",
      duration: "2:41",
      image: images.cover_no_love,
      type: "Single",
      url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+我們之間沒有愛了吧",
    },
    {
      title: "他媽的這個世界不愛我了",
      artist: "蛋蛋EGgskriiXX",
      year: "2024",
      duration: "2:58",
      image: images.cover_world,
      type: "Single",
      url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+他媽的這個世界不愛我了",
    },
    {
      title: "你把它全都帶走",
      artist: "蛋蛋EGgskriiXX",
      year: "2024",
      duration: "3:44",
      image: images.cover_take,
      type: "Single",
      url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+你把它全都帶走",
    },
    {
      title: "我想你了",
      artist: "蛋蛋EGgskriiXX",
      year: "2024",
      duration: "4:22",
      image: images.cover_miss,
      type: "Single",
      url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+我想你了",
    },
    {
      title: "not OK",
      artist: "蛋蛋EGgskriiXX",
      year: "2022",
      duration: "2 首歌曲",
      image: images.cover_notok,
      type: "EP",
      isAlbum: true,
      url: "#",
      tracks: [
        {
          title: "not OK",
          feat: "feat. Ada",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+not+OK",
        },
        {
          title: "想要忘記妳所以我假裝自己是一盤烤肉",
          url: "https://music.youtube.com/search?q=蛋蛋EGgskriiXX+想要忘記妳所以我假裝自己是一盤烤肉",
        },
      ],
    },
  ];

  const mvs = [
    {
      title: "衛星 Satellite (Official Music Video)",
      url: "https://youtu.be/zBPXHttydFk",
      image: ytThumbs.satellite,
    },
    {
      title: "浮躁 (Official Music Video)",
      url: "https://youtu.be/UVsG4hc2C_Q",
      image: ytThumbs.fuzhao,
    },
    {
      title: "那些回憶一天一天沖淡了餘溫 (Official Music Video)",
      url: "https://youtu.be/hHkXSXCInXs",
      image: ytThumbs.memories,
    },
    {
      title: "你把它全都帶走 (Official Music Video)",
      url: "https://youtu.be/_NvT_9iaLjU",
      image: ytThumbs.takeit,
    },
  ];

  useEffect(() => {
    if (!document.querySelector('script[src*="tailwindcss"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
        <div
          className="text-white text-4xl font-black italic tracking-tighter animate-pulse"
          style={{ fontFamily: "'Rubik Puddles', system-ui" }}
        >
          EGGSKRIIXX LOADING
        </div>
      </div>
    );

  return (
    <div className="bg-[#000] min-h-screen text-white overflow-x-hidden font-sans selection:bg-white selection:text-black cursor-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik+Puddles&family=Syncopate:wght@400;700&family=UnifrakturMaguntia&display=swap');
        body { cursor: none; }

        /* 金屬反光框 */
        .metal-frame {
          position: relative;
          padding: 4px;
          border-radius: 18px;
          background: linear-gradient(135deg,#fdfdfd,#b5b5b5,#ffffff,#707070,#fdfdfd);
          box-shadow:
            0 0 25px rgba(255,255,255,0.18),
            0 12px 35px rgba(0,0,0,0.7);
          overflow: hidden;
        }
        .metal-frame-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 14px;
          overflow: hidden;
          background: radial-gradient(circle at 30% 0%,rgba(255,255,255,0.12),transparent 55%),
                      #050505;
        }
        .metal-frame::before {
          content: "";
          position: absolute;
          inset: -40%;
          background:
            conic-gradient(from 200deg,
              rgba(255,255,255,0.9),
              rgba(255,255,255,0.1),
              rgba(255,255,255,0.6),
              rgba(0,0,0,0.2),
              rgba(255,255,255,0.8),
              rgba(255,255,255,0.05));
          mix-blend-mode: screen;
          opacity: 0.3;
          transform: translate3d(-10%, -10%, 0) rotate(8deg);
          pointer-events: none;
        }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); max-height: 0; }
          to { opacity: 1; transform: translateY(0); max-height: 3000px; } 
        }
        .animate-slide-down {
          animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <TrailingCursor />

      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference px-4 py-4 md:px-8 flex justify-between items-center bg-black/50 backdrop-blur-sm border-b border-white/10">
        <span
          className="font-black text-xl tracking-tighter"
          style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}
        >
          EGGSKRIIXX
        </span>
        <div
          className="flex gap-4 text-xs font-bold uppercase tracking-widest"
          style={{ fontFamily: "'Syncopate', sans-serif" }}
        >
          <a href="#music" className="hover:text-gray-400">
            Releases
          </a>
          <a href="#visuals" className="hover:text-gray-400">
            Visuals
          </a>
          <a href="#merch" className="hover:text-gray-400">
            Merch
          </a>
          <a href="#about" className="hover:text-gray-400">
            About
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <LiquidBackground image={images.hero} />
        <MetalTitle text="EGGSKRIIXX" />
        <div className="absolute bottom-10 z-20 text-xs font-mono tracking-widest text-white/50 animate-bounce">
          SCROLL TO ENTER
        </div>
      </section>

      {/* 玻璃背景包住下面所有區塊 */}
      <div
        className="relative border-t border-white/10"
        style={{
          backgroundImage: `url(${images.glass})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-black/80">
          {/* Catalog */}
          <section
            id="music"
            className="relative py-20 px-4 md:px-12 max-w-5xl mx-auto"
          >
            <div className="flex items-end gap-4 mb-8">
              <h2
                className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none"
                style={{ fontFamily: "'Syncopate', sans-serif" }}
              >
                Catalog
              </h2>
              <span className="text-xs font-mono text-gray-300 mb-2">
                /// OFFICIAL RELEASES
              </span>
            </div>

            <div className="flex text-xs text-gray-300 uppercase tracking-widest border-b border-gray-500/70 pb-2 mb-2 px-3">
              <div className="w-8">#</div>
              <div className="flex-1">Title</div>
              <div className="w-12 text-right">
                <Clock size={14} />
              </div>
            </div>

            <div className="flex flex-col w-full">
              {releases.map((r, i) => (
                <SpotifyRow key={i} index={i + 1} {...r} />
              ))}
            </div>
          </section>

          {/* Visuals */}
          <section
            id="visuals"
            className="relative py-20 px-4 md:px-12 max-w-6xl mx-auto border-t border-white/10"
          >
            <h2
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 text-right"
              style={{ fontFamily: "'Syncopate', sans-serif" }}
            >
              Visuals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {mvs.map((mv, i) => (
                <MVItem key={i} index={`0${i + 1}`} {...mv} />
              ))}
            </div>
          </section>

          {/* Merch */}
          <section
            id="merch"
            className="relative py-20 px-4 md:px-12 max-w-4xl mx-auto border-t border-white/10"
          >
            <h2
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400"
              style={{ fontFamily: "'Syncopate', sans-serif" }}
            >
              Merch Drop
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MerchItem
                title="殘心 Poker Album"
                image={images.cover_pokermerch}
                label="Physical CD"
                link="https://myship.7-11.com.tw/general/detail/GM2411197374634"
              />
              <MerchItem
                title="小蛋 Sticker Pack"
                image={images.merch_sticker}
                label="Accessories"
                link="https://myship.7-11.com.tw/general/detail/GM2411197374634"
              />
            </div>
          </section>

          {/* About */}
          <section
            id="about"
            className="relative py-32 px-4 md:px-12 max-w-6xl mx-auto border-t border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              {/* Profile + 金屬框 */}
              <div className="relative">
                <div className="metal-frame w-full">
                  <div className="metal-frame-inner w-full">
                    <img
                      src={images.profile}
                      alt="Profile"
                      className="w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
                <div
                  className="absolute -bottom-4 -right-4 bg-white text-black p-4 font-black text-xl uppercase"
                  style={{ fontFamily: "'Syncopate', sans-serif" }}
                >
                  The Creator
                </div>
              </div>

              <div className="space-y-8">
                <h2
                  className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-40"
                  style={{
                    fontFamily: "'Impact', sans-serif",
                    transform: "scaleY(1.5)",
                    transformOrigin: "left top",
                  }}
                >
                  Behind
                  <br />
                  The
                  <br />
                  Music
                </h2>
                <div className="text-gray-300 font-sans text-sm md:text-base leading-relaxed space-y-4 text-justify">
                  <p>
                    蛋蛋EGgskriiXX 的音樂宇宙從一個安靜的小房間開始。在還沒有人聽見之前，他就已經以專業製作人的標準要求自己——每一層合成器的質地、每一段回聲、每一個情緒落點，都精準得像儀式。
                  </p>
                  <p>
                    無數深夜堆疊成他的世界：迷幻、憂鬱、像在霧中漂浮；卻同時乾淨、清晰、結構嚴謹，如同聲音工程的手術刀。
                  </p>
                  <p>
                    聽眾不是「被邀請」，而是「被吸進」這個宇宙。回憶在低頻裡溶解，情緒在殘響中漂流，走得越深，就越靠近自己的出口與救贖。
                  </p>
                  <p>
                    他從來不是為了被看見而創作。但當越來越多人開始聽見他，他帶來的不只是迷幻的聲音，而是一個能被理解、被治癒的地方。
                  </p>
                  <div className="w-full h-[1px] bg-white/15 my-6" />
                  <p className="italic text-gray-400">
                    EGgskriiXX was born in a quiet room where no one was
                    listening. Long before anyone cared, he treated every track
                    with the precision of a professional—tuning every synth
                    texture, every echo, every drop of emotion with surgical
                    focus.
                  </p>
                  <p className="italic text-gray-400">
                    Night after night, he built a universe of his own: hazy,
                    melancholic, and dreamlike—yet engineered with clarity and
                    discipline. Listeners don’t just hear his music; they get
                    pulled into it.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative py-16 px-4 text-center border-t border-white/10">
            <div className="flex justify-center gap-8 mb-8 text-white">
              <a
                href="https://instagram.com/eggskriixx"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                <Instagram size={32} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCvfRkwM9lY6TBOnATzkTZ6w"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                <Youtube size={32} />
              </a>
              <a
                href="https://www.tiktok.com/@eggskriixx"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                <TikTokIcon size={32} />
              </a>
              <a
                href="mailto:eggskriixx@gmail.com"
                className="hover:text-gray-400 transition-colors"
              >
                <Mail size={32} />
              </a>
            </div>
            <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">
              Contact: eggskriixx@gmail.com
            </p>
            <p className="text-gray-600 font-mono text-[10px] mt-4 uppercase">
              © 2025 EGGSKRIIXX. ALL RIGHTS RESERVED.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

