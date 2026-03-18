const collections = [
  { span: "col-span-1 row-span-2", height: "h-[400px] md:h-full", bg: "bg-neutral-300" },
  { span: "col-span-1", height: "h-48 md:h-auto", bg: "bg-neutral-400" },
  { span: "col-span-1", height: "h-48 md:h-auto", bg: "bg-neutral-200" },
  { span: "col-span-1", height: "h-48 md:h-auto", bg: "bg-neutral-350" },
  { span: "col-span-1", height: "h-48 md:h-auto", bg: "bg-neutral-300" },
];

export default function ExclusiveCollections() {
  return (
    <section id="collections" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-14 text-center font-serif text-4xl text-brand-dark md:text-5xl">
          Exclusive Collections
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          {/* Large left image */}
          <div className={`${collections[0].span} ${collections[0].bg} overflow-hidden rounded-sm`}>
            <div className="flex h-full min-h-[300px] items-center justify-center md:min-h-0">
              <svg width="100" height="200" viewBox="0 0 100 200" fill="none" className="opacity-25">
                <ellipse cx="50" cy="30" rx="18" ry="22" fill="#555" />
                <rect x="30" y="52" width="40" height="65" rx="6" fill="#444" />
                <rect x="25" y="117" width="22" height="70" rx="5" fill="#333" />
                <rect x="53" y="117" width="22" height="70" rx="5" fill="#333" />
              </svg>
            </div>
          </div>

          {/* Top row images */}
          {collections.slice(1, 3).map((col, i) => (
            <div key={i} className={`${col.bg} ${col.height} overflow-hidden rounded-sm`}>
              <div className="flex h-full items-center justify-center">
                <svg width="60" height="120" viewBox="0 0 60 120" fill="none" className="opacity-25">
                  <ellipse cx="30" cy="18" rx="12" ry="14" fill="#555" />
                  <rect x="16" y="32" width="28" height="40" rx="4" fill="#444" />
                  <rect x="12" y="72" width="16" height="42" rx="3" fill="#333" />
                  <rect x="32" y="72" width="16" height="42" rx="3" fill="#333" />
                </svg>
              </div>
            </div>
          ))}

          {/* "Live Sales" button area */}
          <div className="col-span-1 flex items-center justify-center rounded-sm border border-brand-dark/10 bg-brand-light">
            <a
              href="#"
              className="rounded border border-brand-dark px-6 py-2 text-sm tracking-wider text-brand-dark transition hover:bg-brand-dark hover:text-white"
            >
              Live Sales
            </a>
          </div>

          {/* Bottom row images */}
          {collections.slice(3).map((col, i) => (
            <div key={i} className={`${col.bg} ${col.height} overflow-hidden rounded-sm`}>
              <div className="flex h-full items-center justify-center">
                <svg width="60" height="120" viewBox="0 0 60 120" fill="none" className="opacity-25">
                  <ellipse cx="30" cy="18" rx="12" ry="14" fill="#555" />
                  <rect x="16" y="32" width="28" height="40" rx="4" fill="#444" />
                  <rect x="12" y="72" width="16" height="42" rx="3" fill="#333" />
                  <rect x="32" y="72" width="16" height="42" rx="3" fill="#333" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
