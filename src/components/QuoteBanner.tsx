export default function QuoteBanner() {
  return (
    <section className="relative bg-brand-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative flex flex-col items-center">
          {/* Overlapping Images */}
          <div className="relative mb-8 flex items-center justify-center">
            <div className="absolute -left-16 top-4 hidden h-48 w-36 rotate-[-5deg] rounded bg-neutral-300 shadow-lg md:block" />
            <div className="h-56 w-44 rounded bg-neutral-400 shadow-xl md:h-64 md:w-52" />
            <div className="absolute -right-16 top-4 hidden h-48 w-36 rotate-[5deg] rounded bg-neutral-300 shadow-lg md:block" />
          </div>

          {/* Quote */}
          <h2 className="mt-6 text-center font-serif text-3xl leading-snug text-brand-dark md:text-4xl lg:text-5xl">
            &ldquo;L&apos;élégance vous habille à
            <br />
            chaque occasion&rdquo;
          </h2>

          {/* Shop Now */}
          <a
            href="#arrivals"
            className="mt-8 rounded bg-brand-dark px-8 py-3 text-sm tracking-wider text-white transition hover:bg-black"
          >
            Shop Now
          </a>

          {/* Decorative line */}
          <div className="mt-10 h-px w-full max-w-2xl bg-brand-dark/20" />
        </div>
      </div>
    </section>
  );
}
