export default function About() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-16 text-center font-serif text-3xl text-brand-dark md:text-4xl">
          L&apos;élégance vous habille à chaque occasion
        </h2>

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left - Text */}
          <div>
            <p className="max-w-md text-sm leading-relaxed text-brand-text">
              This is a luxury fashion brand that blends timeless
              elegance with modern style. We create conscious
              fashion using premium materials, ensuring you
              experience the perfect blend of luxury,
              sophistication in every outfit.
            </p>
          </div>

          {/* Right - Circle Image */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="h-56 w-56 overflow-hidden rounded-full border-2 border-brand-dark/10 bg-neutral-200 md:h-72 md:w-72">
                <div className="flex h-full items-center justify-center text-neutral-400">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <ellipse cx="60" cy="35" rx="20" ry="22" fill="currentColor" />
                    <rect x="35" y="57" width="50" height="50" rx="8" fill="currentColor" />
                  </svg>
                </div>
              </div>
              {/* Since badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-brand-dark bg-white px-5 py-2 text-xs font-medium tracking-wider text-brand-dark">
                since 2013
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
