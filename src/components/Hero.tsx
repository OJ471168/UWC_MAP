export default function Hero() {
  return (
    <section className="relative min-h-screen bg-brand-dark pt-20 overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-16 md:grid-cols-2 md:py-24 lg:py-32">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <p className="mb-2 text-sm tracking-widest text-brand-gold">Nueva Colección</p>
          <h1 className="font-serif text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Invierno 2020
          </h1>
          <a
            href="#arrivals"
            className="mt-8 inline-block w-fit rounded border border-white px-7 py-3 text-sm tracking-wider text-white transition hover:bg-white hover:text-brand-dark"
          >
            Discover More
          </a>
          <p className="mt-12 max-w-xs text-xs leading-relaxed text-white/50">
            Craft timeless ensembles of fabric, prominent materials built into elegance and luxury.
          </p>
        </div>

        {/* Right - Hero Image + Cards */}
        <div className="relative flex items-end justify-center md:justify-end">
          {/* Main Hero Image */}
          <div className="relative h-[400px] w-[300px] overflow-hidden rounded-sm bg-gradient-to-b from-brand-cream/20 to-brand-cream/5 md:h-[500px] md:w-[360px]">
            <div className="flex h-full items-end justify-center">
              <div className="h-[90%] w-[80%] bg-gradient-to-t from-neutral-600 to-neutral-400 opacity-30" />
            </div>
            {/* Placeholder silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="200" height="400" viewBox="0 0 200 400" fill="none" className="opacity-40">
                <ellipse cx="100" cy="60" rx="35" ry="40" fill="#888" />
                <rect x="65" y="100" width="70" height="120" rx="10" fill="#777" />
                <rect x="55" y="220" width="35" height="150" rx="8" fill="#666" />
                <rect x="110" y="220" width="35" height="150" rx="8" fill="#666" />
              </svg>
            </div>
          </div>

          {/* Floating Cards */}
          <div className="absolute -right-2 top-8 flex flex-col gap-3 md:right-[-40px]">
            <div className="h-20 w-16 rounded border border-white/20 bg-white/10 backdrop-blur-sm md:h-24 md:w-20" />
            <div className="h-20 w-16 rounded border border-white/20 bg-white/10 backdrop-blur-sm md:h-24 md:w-20" />
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
