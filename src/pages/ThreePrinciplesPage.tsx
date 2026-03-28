import React from 'react';
import { Link } from 'react-router-dom';

const principles = [
  {
    icon: '✨',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    title: 'Mind',
    paragraphs: [
      'Mind is the universal intelligence behind all of life — the energy and source from which all things are created. It is the formless essence that powers our capacity to be alive, to think, and to be aware.',
      'Mind is not the brain, nor personal thinking. It is the intelligent energy that underlies all existence, the source that allows every human being to have the experience of being alive.',
    ],
  },
  {
    icon: '💠',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Consciousness',
    paragraphs: [
      'Consciousness is the gift of awareness. It gives us the ability to experience our thinking — to see, hear, feel, taste, and smell. Without Consciousness, we would have no experience of life.',
      'Consciousness makes our thoughts real to us. It is what transforms the formless energy of Thought into a felt, lived experience — making it possible for us to perceive and navigate the world.',
    ],
  },
  {
    icon: '💭',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Thought',
    paragraphs: [
      'Thought is the creative power that allows us to generate our moment-to-moment experience of reality. Every feeling we have comes from the thoughts we are having in the moment — not from external circumstances.',
      'Thought is not just cognitive or intellectual. It includes all forms of mental activity — conscious and unconscious — that create our personal experience of the world from the inside out.',
    ],
  },
];

const ThreePrinciplesPage: React.FC = () => (
  <div className="font-['Inter',system-ui,-apple-system,sans-serif] text-slate-900 bg-slate-50">
    {/* Hero */}
    <section className="bg-gradient-to-br from-slate-100 to-white border-b border-slate-200 py-20 px-5 text-center max-md:py-[50px]">
      <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#5c8ab9] rounded-full text-[0.85rem] font-bold uppercase tracking-wide mb-5">
        Foundation
      </span>
      <h1 className="text-[3rem] font-extrabold tracking-tight leading-[1.1] mb-4 m-0 max-md:text-[2rem]">
        The Three Principles
      </h1>
      <p className="text-slate-500 text-lg leading-relaxed max-w-[700px] mx-auto m-0">
        An understanding of the fundamental nature of human experience, first articulated by Sydney Banks — pointing to the source of all thought, feeling, and perception.
      </p>
    </section>

    {/* Principle Cards */}
    <section className="max-w-[900px] mx-auto py-[60px] px-5">
      {principles.map(({ icon, iconBg, iconColor, title, paragraphs }) => (
        <div key={title} className="bg-white border border-slate-200 rounded-2xl p-10 mb-[30px] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] max-md:p-7">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center text-2xl flex-shrink-0 ${iconBg} ${iconColor}`}>
              {icon}
            </div>
            <h2 className="text-2xl font-bold m-0">{title}</h2>
          </div>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-slate-500 text-base leading-relaxed mb-3 last:mb-0">{p}</p>
          ))}
        </div>
      ))}
    </section>

    {/* Quote */}
    <section className="bg-gradient-to-br from-blue-50/60 to-slate-50 border-y border-slate-200 py-[60px] px-5 text-center">
      <blockquote className="max-w-[700px] mx-auto text-xl italic text-slate-900 leading-relaxed">
        "If the only thing people learned was not to be afraid of their experience, that alone would change the world."
        <div className="mt-4 text-[0.95rem] font-semibold text-[#5c8ab9] not-italic">— Sydney Banks</div>
      </blockquote>
    </section>

    {/* How They Work Together */}
    <section className="max-w-[900px] mx-auto py-[60px] px-5">
      <h2 className="text-[2rem] font-extrabold tracking-tight mb-4 m-0">How They Work Together</h2>
      <p className="text-slate-500 text-[1.05rem] leading-relaxed mb-4">
        The Three Principles are not separate forces — they work as one unified system to create all of human experience. Mind provides the energy, Thought creates the form, and Consciousness brings it to life as our felt reality.
      </p>
      <p className="text-slate-500 text-[1.05rem] leading-relaxed mb-4">
        Understanding these principles doesn't give you a technique or a set of rules to follow. Instead, it offers an insight into how your experience is being created moment to moment. When this understanding deepens, people naturally find greater clarity, resilience, and peace of mind — not by changing their circumstances, but by seeing how their experience of those circumstances is being generated from within.
      </p>
      <p className="text-slate-500 text-[1.05rem] leading-relaxed m-0">
        This understanding has been applied across many fields — mental health, education, business, community programs, and addiction recovery — helping people reconnect with their innate well-being.
      </p>
    </section>

    {/* CTA */}
    <section className="bg-gradient-to-br from-blue-50/60 to-slate-50 border-t border-slate-200 py-[60px] px-5 text-center">
      <h2 className="text-3xl font-extrabold mb-3 m-0">Continue Exploring</h2>
      <p className="text-slate-500 text-[1.05rem] mb-[30px] m-0">Discover events, connect with practitioners, and dive deeper into the understanding.</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link to="/resources" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base no-underline bg-[#9cbce2] text-white shadow-[0_2px_8px_rgba(156,188,226,0.4)] hover:bg-[#8baad1] hover:-translate-y-0.5 transition-all">
          Browse Resources
        </Link>
        <Link to="/map" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base no-underline bg-white text-slate-900 border border-slate-200 hover:border-[#5c8ab9] hover:text-[#5c8ab9] hover:-translate-y-0.5 transition-all">
          Find Events Near You
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-slate-900 text-slate-400 py-10 px-5 text-center text-[0.85rem]">
      <p>&copy; 2026 UPWC — Understanding the Three Principles Worldwide Community</p>
    </footer>
  </div>
);

export default ThreePrinciplesPage;
