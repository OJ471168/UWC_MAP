export default function TailoredSection() {
  return (
    <section className="bg-brand-light py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left - Images Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[3/4] rounded-sm bg-neutral-300">
              <div className="flex h-full items-center justify-center">
                <svg width="60" height="120" viewBox="0 0 60 120" fill="none" className="opacity-25">
                  <ellipse cx="30" cy="18" rx="12" ry="14" fill="#555" />
                  <rect x="16" y="32" width="28" height="40" rx="4" fill="#444" />
                  <rect x="12" y="72" width="16" height="42" rx="3" fill="#333" />
                  <rect x="32" y="72" width="16" height="42" rx="3" fill="#333" />
                </svg>
              </div>
            </div>
            <div className="aspect-[3/4] rounded-sm bg-neutral-400">
              <div className="flex h-full items-center justify-center">
                <svg width="60" height="120" viewBox="0 0 60 120" fill="none" className="opacity-25">
                  <ellipse cx="30" cy="18" rx="12" ry="14" fill="#555" />
                  <rect x="16" y="32" width="28" height="40" rx="4" fill="#444" />
                  <rect x="12" y="72" width="16" height="42" rx="3" fill="#333" />
                  <rect x="32" y="72" width="16" height="42" rx="3" fill="#333" />
                </svg>
              </div>
            </div>
            <div className="aspect-[3/4] rounded-sm bg-neutral-200">
              <div className="flex h-full items-center justify-center">
                <svg width="60" height="120" viewBox="0 0 60 120" fill="none" className="opacity-25">
                  <ellipse cx="30" cy="18" rx="12" ry="14" fill="#555" />
                  <rect x="16" y="32" width="28" height="40" rx="4" fill="#444" />
                  <rect x="12" y="72" width="16" height="42" rx="3" fill="#333" />
                  <rect x="32" y="72" width="16" height="42" rx="3" fill="#333" />
                </svg>
              </div>
            </div>
            <div className="aspect-[3/4] rounded-sm bg-neutral-300">
              <div className="flex h-full items-center justify-center">
                <svg width="60" height="120" viewBox="0 0 60 120" fill="none" className="opacity-25">
                  <ellipse cx="30" cy="18" rx="12" ry="14" fill="#555" />
                  <rect x="16" y="32" width="28" height="40" rx="4" fill="#444" />
                  <rect x="12" y="72" width="16" height="42" rx="3" fill="#333" />
                  <rect x="32" y="72" width="16" height="42" rx="3" fill="#333" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right - Text Content */}
          <div>
            <h2 className="font-serif text-4xl leading-tight text-brand-dark md:text-5xl">
              Tailored to You,
              <br />
              Styled to Perfection
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-brand-text">
              &ldquo;Experience the art of personal styling, where luxury
              meets innovation, offering you curated collections
              and unparalleled craftsmanship to elevate your
              wardrobe and express your unique, sophisticated
              essence.&rdquo;
            </p>
            <a
              href="#arrivals"
              className="mt-8 inline-block rounded border border-brand-dark px-7 py-3 text-sm tracking-wider text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Explore
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
