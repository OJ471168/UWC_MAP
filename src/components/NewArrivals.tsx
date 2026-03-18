const products = [
  { name: "Classic Suit", price: "$899", color: "bg-neutral-300" },
  { name: "Blazer", price: "$475", color: "bg-neutral-400" },
  { name: "Winter Coat", price: "$650", color: "bg-neutral-350" },
  { name: "Formal Shirt", price: "$245", color: "bg-neutral-300" },
  { name: "Wool Sweater", price: "$320", color: "bg-amber-900/30" },
];

export default function NewArrivals() {
  return (
    <section id="arrivals" className="relative overflow-hidden bg-brand-dark py-20 md:py-28">
      {/* Watermark Text */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 select-none">
        <span className="font-serif text-[8rem] font-bold tracking-wider text-white/[0.03] md:text-[12rem]">
          Damat
        </span>
      </div>
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 rotate-90 select-none">
        <span className="font-serif text-[8rem] font-bold tracking-wider text-white/[0.03] md:text-[12rem]">
          Tween
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm tracking-widest text-brand-gold">New Arrivals</p>
          <h2 className="font-serif text-4xl text-white md:text-5xl">Winter Luxe</h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
          {products.map((product, i) => (
            <div key={i} className="group cursor-pointer">
              <div className={`relative aspect-[3/4] overflow-hidden rounded-sm ${product.color}`}>
                {/* Image container — zooms on hover */}
                <div className="flex h-full items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
                  <svg width="80" height="160" viewBox="0 0 80 160" fill="none" className="opacity-30">
                    <ellipse cx="40" cy="25" rx="15" ry="18" fill="#555" />
                    <rect x="22" y="43" width="36" height="55" rx="5" fill="#444" />
                    <rect x="18" y="98" width="18" height="55" rx="4" fill="#333" />
                    <rect x="44" y="98" width="18" height="55" rx="4" fill="#333" />
                  </svg>
                </div>

                {/* Overlay — slides up on hover */}
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                  <span className="mb-6 rounded border border-white px-5 py-2 text-xs tracking-wider text-white transition-transform duration-400 translate-y-4 group-hover:translate-y-0">
                    Quick View
                  </span>
                </div>
              </div>

              {/* Product info — name slides right, price highlights */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-white/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/90">
                  {product.name}
                </span>
                <span className="text-xs font-medium text-white transition-colors duration-300 group-hover:text-brand-gold">
                  {product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
