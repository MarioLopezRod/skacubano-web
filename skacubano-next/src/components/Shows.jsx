"use client";

import { motion } from "framer-motion";

const showVideos = [
  {
    id: "ISKzBoIjls8",
    title: "Live at the Nobel Peace Prize Concert",
    location: "Oslo, Norway (2005)",
    description: "A legendary performance introduced by Salma Hayek to a global audience of millions following the band's BBC World Music Award nomination.",
  },
  {
    id: "RrD1GKeGcgc",
    title: "Ska Cubano Live Show",
    location: "Festival Stage Performance",
    description: "Experience the band's raw, infectious energy and brass-heavy mambo-ska backbeat driving festival crowds wild.",
  },
  {
    id: "CmoXFLzOiFc",
    title: "Freedom Sounds 2019 Live",
    location: "Cologne, Germany (2019)",
    description: "Ska Cubano performs Cleopatra at Freedom Sounds festival in Cologne, Germany in 2019.",
  },
];

const archiveShows = [
  { date: "26 JUN 2005", event: "Glastonbury Festival", venue: "Jazz World Stage", city: "Somerset", country: "United Kingdom" },
  { date: "02 JUL 2005", event: "Roskilde Festival", venue: "Arena Stage", city: "Roskilde", country: "Denmark" },
  { date: "11 DEC 2005", event: "Nobel Peace Prize Concert", venue: "Oslo Spektrum", city: "Oslo", country: "Norway" },
  { date: "22 JAN 2006", event: "Big Day Out Festival", venue: "Gold Stage Tour", city: "Sydney & Auckland", country: "Australia & NZ" },
  { date: "11 MAY 2007", event: "WOMAD Cáceres", venue: "Plaza Mayor", city: "Cáceres", country: "Spain" },
  { date: "12 JUL 2008", event: "Rhythms Of The World", venue: "Hitchin Priory grounds", city: "Hitchin", country: "United Kingdom" },
  { date: "14 NOV 2008", event: "Koko Camden Town", venue: "Hometown Tour Headline", city: "London", country: "United Kingdom" },
  { date: "04 JUN 2009", event: "Sunrise Celebration Festival", venue: "Main Stage", city: "Yeovil, Somerset", country: "United Kingdom" },
  { date: "23 JUL 2010", event: "WOMAD Charlton Park", venue: "Charlton Park Stage", city: "Wiltshire", country: "United Kingdom" },
  { date: "13 MAY 2011", event: "WOMAD Cáceres", venue: "Plaza Mayor", city: "Cáceres", country: "Spain" },
  { date: "02 JUN 2012", event: "Kaya Festival", venue: "Faenol Estate", city: "Bangor, Wales", country: "United Kingdom" },
  { date: "10 AUG 2012", event: "Boomtown Fair", venue: "Matterley Estate", city: "Winchester", country: "United Kingdom" },
  { date: "18 AUG 2012", event: "Happy Art Festival", venue: "Open Air Stage", city: "Nyíregyháza", country: "Hungary" },
  { date: "27 JUL 2013", event: "Iboga Summer Festival", venue: "Main Stage", city: "Xàbia", country: "Spain" },
];

export default function Shows() {
  return (
    <section
      id="shows"
      className="relative w-full overflow-hidden bg-[#0d0a07] py-24 px-4 md:px-8 border-b border-yellow-400/5"
    >

      {/* Film grain overlay for visual texture */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.1] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-20 max-w-6xl mx-auto flex flex-col items-center">

        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-[#d35400] tracking-tighter italic leading-none drop-shadow-[0_2px_10px_rgba(243,234,192,0.15)]">
            SHOWS & CONCERTS
          </h2>
          <p
            className="mt-3 text-[#faab15]/80 text-xs md:text-sm font-bold uppercase tracking-[.35em]"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            — LIVE ON STAGE —
          </p>
          <p
            className="mt-4 text-[#faf6ee]/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The true spirit of Ska Cubano beats on stage. Relive the high-energy fusion of mambo, son, and ska that got the whole world dancing.
          </p>
        </div>

        {/* VIDEOS GRID CONTAINER */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {showVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-[#181512] rounded-lg overflow-hidden border border-white/[0.04] shadow-[0_12px_32px_rgba(0,0,0,0.8)] hover:border-[#faab15]/20 group transition-all duration-300 flex flex-col"
            >
              {/* Responsive Video Wrapper */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Text Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#faab15]/80 uppercase tracking-widest block mb-1">
                    {video.location}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <p className="mt-3 text-white/60 text-xs md:text-[13px] leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* RETRO FESTIVAL POSTER SECTION */}
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative bg-[#1c1814] rounded-lg p-6 md:p-10 border-4 border-dashed border-[#8c6239]/50 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Stamp stamp lines decorative overlay */}
            <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none opacity-[0.03] select-none">
              <svg width="100%" height="100%">
                <pattern id="diagonal-stripes" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="20" height="40" fill="#fff" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />
              </svg>
            </div>

            {/* Poster Header */}
            <div className="text-center border-b-2 border-dashed border-[#8c6239]/30 pb-6 mb-8 relative">
              <span className="text-[10px] font-mono uppercase tracking-[.3em] text-[#faab15] font-bold">
                CONCERT CHRONOLOGY
              </span>
              <h3 className="text-2xl md:text-4xl font-extrabold text-white mt-1 uppercase tracking-tight">
                ★ HISTORIC TOUR DATES & FESTIVALS ★
              </h3>
              <p className="text-[11px] text-white/50 mt-1 font-mono uppercase tracking-widest">
                — CASINOSOUNDS BOOKINGS INTERNATIONAL —
              </p>
            </div>

            {/* Concert Dates List/Table */}
            <div className="space-y-4">
              {archiveShows.map((show, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 6, backgroundColor: "rgba(250,171,21,0.04)" }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded border-b border-[#8c6239]/10 last:border-b-0 transition-all duration-150 gap-2 sm:gap-4 cursor-default"
                >
                  {/* Date Badge */}
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#faab15]/80 animate-pulse hidden sm:inline-block" />
                    <span className="text-sm font-mono font-bold text-[#faab15] bg-[#faab15]/10 px-2 py-0.5 rounded border border-[#faab15]/20">
                      {show.date}
                    </span>
                  </div>

                  {/* Event & Venue Info */}
                  <div className="flex-1">
                    <h4 className="text-sm md:text-base font-extrabold text-white leading-tight uppercase">
                      {show.event}
                    </h4>
                    <p className="text-xs text-white/60 font-mono mt-0.5">
                      {show.venue}
                    </p>
                  </div>

                  {/* Location Info */}
                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className="text-xs md:text-sm font-semibold text-white/80 uppercase">
                      {show.city}
                    </span>
                    <span className="text-[10px] font-mono text-[#8c6239] uppercase tracking-wider block">
                      {show.country}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Poster Footer Stamp */}
            <div className="mt-8 text-center border-t-2 border-dashed border-[#8c6239]/30 pt-6">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                THIS SECTION PAYS TRIBUTE TO THE HISTORIC TOUR DATES OF THE BAND • ALL RIGHTS RESERVED
              </span>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
