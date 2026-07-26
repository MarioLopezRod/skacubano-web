"use client";

import React from "react";

/**
 * Custom SVG Vector Exclamation Circle for ¡ (Inverted Exclamation)
 * Renders a pixel-perfect Bowlorama-style circle with a clean inverted exclamation mark cutout.
 */
function InvertedExclamationCircle({ className = "" }) {
  return (
    <span className={`inline-flex items-center justify-center align-middle mx-[0.03em] ${className}`} style={{ width: "0.85em", height: "0.85em" }}>
      <svg viewBox="0 0 100 100" className="w-full h-full text-current select-none" aria-hidden="true">
        <mask id="bowlorama-inv-excl-mask">
          <rect width="100" height="100" fill="white" />
          <circle cx="50" cy="22" r="8.5" fill="black" />
          <path d="M 41.5 38 L 58.5 38 L 54.5 82 L 45.5 82 Z" fill="black" />
        </mask>
        <circle cx="50" cy="50" r="49" fill="currentColor" mask="url(#bowlorama-inv-excl-mask)" />
      </svg>
    </span>
  );
}

/**
 * Custom SVG Vector Exclamation Circle for ! (Closing Exclamation)
 * Renders a pixel-perfect Bowlorama-style circle with a clean exclamation mark cutout.
 */
function ExclamationCircle({ className = "" }) {
  return (
    <span className={`inline-flex items-center justify-center align-middle mx-[0.03em] ${className}`} style={{ width: "0.85em", height: "0.85em" }}>
      <svg viewBox="0 0 100 100" className="w-full h-full text-current select-none" aria-hidden="true">
        <mask id="bowlorama-excl-mask">
          <rect width="100" height="100" fill="white" />
          <path d="M 41.5 18 L 58.5 18 L 54.5 62 L 45.5 62 Z" fill="black" />
          <circle cx="50" cy="78" r="8.5" fill="black" />
        </mask>
        <circle cx="50" cy="50" r="49" fill="currentColor" mask="url(#bowlorama-excl-mask)" />
      </svg>
    </span>
  );
}

/**
 * BowloramaText Component
 * Renders text in retro Bowlorama circle style, resolving font glyph defects:
 * 1. Spanish inverted ¡ and closing ! are rendered using custom vector SVG circles (no bowling pin artifact).
 * 2. Ampersand & and all letters are vertically centered along a unified alignment line.
 */
export default function BowloramaText({ text, className = "" }) {
  if (!text) return null;

  const textStr = String(text);
  const words = textStr.split(" ");

  return (
    <span className={`inline-flex flex-wrap items-center justify-center gap-x-[0.3em] ${className}`}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex items-center justify-center whitespace-nowrap">
          {Array.from(word).map((char, charIdx) => {
            if (char === "¡") {
              return <InvertedExclamationCircle key={charIdx} />;
            }
            if (char === "!") {
              return <ExclamationCircle key={charIdx} />;
            }
            if (char === "&") {
              return (
                <span
                  key={charIdx}
                  className="font-bowlorama inline-flex items-center justify-center leading-none text-[0.98em] mx-[0.03em]"
                  style={{ transform: "translateY(0.04em)" }}
                >
                  &
                </span>
              );
            }

            return (
              <span key={charIdx} className="font-bowlorama inline-flex items-center justify-center leading-none">
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
