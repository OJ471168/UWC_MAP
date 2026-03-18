"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex flex-col items-center leading-none">
          <span className="text-lg font-bold tracking-[0.3em] text-white">DAMAT</span>
          <span className="text-[10px] tracking-[0.5em] text-white/70">TWEEN</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-8 text-sm tracking-wide text-white/80 md:flex">
          <li><a href="#" className="text-white transition hover:text-brand-gold">Home</a></li>
          <li><a href="#collections" className="transition hover:text-brand-gold">Collections</a></li>
          <li><a href="#arrivals" className="transition hover:text-brand-gold">Accessories</a></li>
          <li><a href="#footer" className="transition hover:text-brand-gold">Contact</a></li>
        </ul>

        {/* Shop Now Button */}
        <a
          href="#arrivals"
          className="hidden rounded border border-white px-5 py-2 text-sm tracking-wide text-white transition hover:bg-white hover:text-brand-dark md:inline-block"
        >
          Shop Now
        </a>

        {/* Mobile Menu Button */}
        <button
          className="text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-brand-dark px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4 text-sm text-white/80">
            <li><a href="#" onClick={() => setMenuOpen(false)} className="text-white">Home</a></li>
            <li><a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a></li>
            <li><a href="#arrivals" onClick={() => setMenuOpen(false)}>Accessories</a></li>
            <li><a href="#footer" onClick={() => setMenuOpen(false)}>Contact</a></li>
          </ul>
          <a
            href="#arrivals"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-block rounded border border-white px-5 py-2 text-sm text-white"
          >
            Shop Now
          </a>
        </div>
      )}
    </nav>
  );
}
