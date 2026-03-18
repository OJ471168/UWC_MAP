export default function CTABanner() {
  return (
    <section className="relative bg-brand-dark py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left - Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-700">
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            <div className="flex h-full items-center justify-center">
              <svg width="150" height="200" viewBox="0 0 150 200" fill="none" className="opacity-20">
                <ellipse cx="75" cy="40" rx="25" ry="30" fill="#aaa" />
                <rect x="45" y="70" width="60" height="80" rx="8" fill="#999" />
                <rect x="35" y="150" width="30" height="45" rx="5" fill="#888" />
                <rect x="85" y="150" width="30" height="45" rx="5" fill="#888" />
              </svg>
            </div>
          </div>

          {/* Right - Text */}
          <div className="text-center md:text-left">
            <p className="text-lg leading-relaxed text-white/80 md:text-xl">
              Transform your style today—luxury that reflects your essence.
              Elevate your wardrobe to iconic perfection.
            </p>
            <a
              href="#arrivals"
              className="mt-8 inline-block rounded border border-white px-7 py-3 text-sm tracking-wider text-white transition hover:bg-white hover:text-brand-dark"
            >
              Shop now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
