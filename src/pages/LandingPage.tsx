import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const changesData = [
  { icon: '✨', title: 'Less stress, anxiety, and overthinking', desc: 'a quieter mind emerges naturally' },
  { icon: '💡', title: 'Greater clarity and resilience', desc: 'navigating life\'s challenges with fresh perspective' },
  { icon: '🤝', title: 'Stronger, more fulfilling relationships', desc: 'deeper understanding of yourself and others' },
  { icon: '🌱', title: 'Reconnection with innate well-being', desc: 'realizing it was always there' },
  { icon: '🧭', title: 'Sustainable behavior and lifestyle changes', desc: 'from insight, not willpower' },
  { icon: '🌊', title: 'A natural sense of peace', desc: 'even in uncertain or difficult times' },
];

const principlesData = [
  { icon: '✨', title: 'Mind', desc: 'The universal intelligence behind all of life — the formless energy and source from which all things are created.' },
  { icon: '💠', title: 'Consciousness', desc: 'The gift of awareness that makes our thinking real to us — transforming formless thought into a felt, lived experience.' },
  { icon: '💭', title: 'Thought', desc: 'The creative power that generates our moment-to-moment experience of reality — from the inside out.' },
];

const appAreas = [
  '🏥 Hospitals', '🏛️ Correctional Facilities', '🤝 Social Services',
  '💼 Business & Leadership', '🎓 Education', '💚 Couples Therapy', '🏠 Addiction Recovery',
];

const publicFeatures = [
  'Explore events on the global Event Map',
  'Browse the curated Resources Library',
  'Learn about the Three Principles at your own pace',
  'Subscribe to the newsletter for updates',
];

const practitionerFeatures = [
  'Publish events to reach a global audience',
  'Share resources with the community',
  'Connect with fellow practitioners worldwide',
  'Join discussions in the community feed',
];

const membershipFeatures = [
  'Publish events to the global Event Map',
  'Share resources with the community',
  'Community discussion feed',
  'Member directory — find and connect with practitioners',
  'Full dashboard access',
];

const faqData = [
  { q: 'What are the Three Principles?', a: 'The Three Principles — Mind, Consciousness, and Thought — were first articulated by Sydney Banks. They point to the fundamental nature of how all human experience is created from the inside out. This is not a technique or method, but an understanding that naturally brings clarity and peace of mind.' },
  { q: 'How is this different from other coaching or self-help approaches?', a: 'Rather than offering techniques or strategies to manage your thinking, this understanding points you toward the source of your experience. When you see how thought creates your reality moment to moment, change happens naturally — without effort or practice.' },
  { q: 'Do I need to be a practitioner to join?', a: 'No. The community welcomes everyone — whether you\'re just curious about the Three Principles, exploring for personal growth, or a seasoned practitioner. The membership gives you access to publish events and resources, join discussions, and connect with others.' },
  { q: 'Can I browse the site without joining?', a: 'Yes. The Event Map, Resources Library, and Three Principles page are all freely accessible. The membership unlocks the ability to publish events, share resources, and participate in the community discussion feed and member directory.' },
  { q: 'How does billing work?', a: 'Membership is $40 per year, billed annually through Stripe. You can cancel anytime. Your access remains active until the end of your billing period.' },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-b-0 py-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center gap-3 text-left font-bold text-base cursor-pointer bg-transparent border-none p-0 text-slate-900"
      >
        {q}
        <span className="text-xl text-slate-400 flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 text-slate-500 text-[0.95rem] leading-[1.7] ${
          open ? 'max-h-[300px] pt-3' : 'max-h-0'
        }`}
      >
        {a}
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [nlEmail, setNlEmail] = useState('');
  const [nlMsg, setNlMsg] = useState<{ text: string; success: boolean } | null>(null);

  const handleNewsletter = async (e: FormEvent) => {
    e.preventDefault();
    const email = nlEmail.trim();

    const { error } = await supabase.from('newsletter_subscribers').insert({ email });

    if (error) {
      if (error.code === '23505') {
        setNlMsg({ text: "You're already subscribed!", success: true });
      } else {
        setNlMsg({ text: 'Something went wrong. Please try again.', success: false });
      }
    } else {
      setNlMsg({ text: 'Thanks for subscribing!', success: true });
      setNlEmail('');
    }
  };

  return (
    <div className="font-['Inter',system-ui,-apple-system,sans-serif] text-slate-900 bg-slate-50">
      {/* Hero */}
      <section className="relative min-h-[580px] flex items-center justify-center text-center overflow-hidden py-20 px-5">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/65 to-slate-900/75" />
        </div>
        <div className="relative z-10 max-w-[800px]">
          <span className="inline-block px-[18px] py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white rounded-full text-[0.8rem] font-bold uppercase tracking-wider mb-6">
            A Grassroots Community
          </span>
          <h1 className="text-white text-[3.2rem] font-extrabold tracking-tight leading-[1.15] mb-3 max-md:text-[2rem]">
            Grounded In The<br />Three Principles Of<br /><span className="text-[#9cbce2]">Mind, Consciousness & Thought</span>
          </h1>
          <p className="text-white/85 text-xl mb-9 leading-relaxed max-w-[650px] mx-auto max-md:text-base">
            A space to explore, share, and grow together. We would love you to become part of us.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/three-principles" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base no-underline bg-white text-slate-900 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all">
              Explore the Three Principles
            </Link>
            <Link to="/join" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base no-underline bg-[#9cbce2] text-white shadow-[0_4px_14px_rgba(156,188,226,0.4)] hover:bg-[#8baad1] hover:-translate-y-0.5 transition-all">
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="text-center py-[70px] px-5 bg-white border-b border-slate-200">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-[1.9rem] font-bold leading-snug tracking-tight mb-5">
            When We Understand How These Three Principles Work Together, Lasting Well-Being Emerges Naturally.
          </h2>
          <p className="text-slate-500 text-[1.05rem] leading-relaxed">
            We are guided by the realization that at the core of all human experience — regardless of culture, background, or circumstance — we are all the same. At a deeper level, before the formation of thought, we are all the same.
          </p>
        </div>
      </section>

      {/* Changes Lives */}
      <section className="py-[70px] px-5 max-w-[1000px] mx-auto">
        <h2 className="text-center text-3xl font-extrabold mb-10 tracking-tight">How This Understanding Changes Lives</h2>
        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          {changesData.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3.5 p-5 bg-white border border-slate-200 rounded-xl">
              <div className="w-10 h-10 rounded-[10px] flex-shrink-0 flex items-center justify-center text-lg bg-emerald-50 text-emerald-800">
                {icon}
              </div>
              <p className="text-[0.95rem] text-slate-500 leading-normal m-0">
                <strong className="text-slate-900">{title}</strong> — {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Three Principles */}
      <section className="py-[70px] px-5 bg-white border-y border-slate-200">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center text-3xl font-extrabold mb-3 tracking-tight">The Three Principles</h2>
          <p className="text-center text-slate-500 text-base mb-11 max-w-[600px] mx-auto">
            Three universal constants behind all human experience, first articulated by Sydney Banks.
          </p>
          <div className="grid grid-cols-3 gap-7 max-md:grid-cols-1">
            {principlesData.map(({ icon, title, desc }) => (
              <div key={title} className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="text-[2.5rem] mb-4">{icon}</div>
                <h3 className="text-xl font-bold mb-2.5">{title}</h3>
                <p className="text-[0.92rem] text-slate-500 leading-relaxed m-0">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-9">
            <Link to="/three-principles" className="inline-flex items-center gap-2 px-[22px] py-2.5 rounded-full font-bold text-[0.9rem] no-underline bg-transparent text-[#5c8ab9] border-2 border-[#5c8ab9] hover:bg-[#5c8ab9] hover:text-white transition-all">
              Learn more about the Three Principles &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Application */}
      <section className="py-[70px] px-5 text-center">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-extrabold mb-3">Where This Understanding Is Applied</h2>
          <p className="text-slate-500 text-base mb-10">The Three Principles have been brought into many fields with transformative results.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8 max-md:gap-2.5">
            {appAreas.map(area => (
              <span key={area} className="px-[22px] py-2.5 bg-white border border-slate-200 rounded-full text-[0.9rem] font-semibold text-slate-500 hover:border-[#5c8ab9] hover:text-[#5c8ab9] transition-colors">
                {area}
              </span>
            ))}
          </div>
          <div className="inline-block px-7 py-3.5 bg-emerald-50 border-2 border-emerald-800 rounded-full text-base font-bold text-emerald-800">
            And Most Importantly — Your Everyday Life
          </div>
        </div>
      </section>

      {/* For Who */}
      <section className="py-[70px] px-5 bg-white border-y border-slate-200">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center text-3xl font-extrabold mb-3">Whether You're Exploring or Practicing</h2>
          <span className="block text-center text-slate-500 text-base mb-11">Everyone is welcome here — wherever you are in your journey.</span>
          <div className="grid grid-cols-2 gap-7 max-md:grid-cols-1">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-9">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2.5">🌍 Interested Public</h3>
              <ul className="list-none p-0 mb-5">
                {publicFeatures.map(f => (
                  <li key={f} className="py-2 text-[0.92rem] text-slate-500 flex items-start gap-2.5 border-b border-slate-100 last:border-b-0">
                    <span className="text-emerald-800 font-bold flex-shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/map" className="inline-flex items-center gap-2 px-[22px] py-2.5 rounded-full font-bold text-[0.9rem] no-underline bg-transparent text-[#5c8ab9] border-2 border-[#5c8ab9] hover:bg-[#5c8ab9] hover:text-white transition-all">
                Explore the Event Map &rarr;
              </Link>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-9">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2.5">🧑‍🏫 Three Principles Practitioners</h3>
              <ul className="list-none p-0 mb-5">
                {practitionerFeatures.map(f => (
                  <li key={f} className="py-2 text-[0.92rem] text-slate-500 flex items-start gap-2.5 border-b border-slate-100 last:border-b-0">
                    <span className="text-emerald-800 font-bold flex-shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/join" className="inline-flex items-center gap-2 px-[22px] py-2.5 rounded-full font-bold text-[0.9rem] no-underline bg-[#9cbce2] text-white shadow-[0_2px_8px_rgba(156,188,226,0.4)] hover:bg-[#8baad1] hover:-translate-y-0.5 transition-all">
                Join the Community &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Membership */}
      <section className="py-[70px] px-5 text-center">
        <h2 className="text-3xl font-extrabold mb-3">Community Membership</h2>
        <p className="text-slate-500 text-base mb-10">One simple plan. Everything you need to connect, share, and grow.</p>
        <div className="bg-white border-2 border-[#5c8ab9] rounded-[20px] p-11 max-w-[460px] mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5c8ab9] to-[#9cbce2]" />
          <div className="text-[0.8rem] font-bold uppercase text-[#5c8ab9] tracking-wide mb-1.5">Annual Membership</div>
          <h3 className="text-xl font-bold mb-5">UPWC Community</h3>
          <div className="text-[3.2rem] font-extrabold">$40<span className="text-base font-medium text-slate-500"> / year</span></div>
          <ul className="list-none p-0 my-7 text-left">
            {membershipFeatures.map(f => (
              <li key={f} className="py-2.5 text-[0.92rem] text-slate-500 flex items-center gap-3 border-b border-slate-100 last:border-b-0">
                <span className="w-[22px] h-[22px] rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link to="/join" className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-base no-underline bg-[#9cbce2] text-white shadow-[0_4px_14px_rgba(156,188,226,0.4)] hover:bg-[#8baad1] hover:-translate-y-0.5 transition-all">
            Join Now — $40/year
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-[70px] px-5 bg-white border-y border-slate-200">
        <div className="max-w-[750px] mx-auto">
          <h2 className="text-center text-3xl font-extrabold mb-10">Frequently Asked Questions</h2>
          {faqData.map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-[70px] px-5 text-center">
        <h2 className="text-3xl font-extrabold mb-3">Stay Connected</h2>
        <p className="text-slate-500 text-base mb-7">Subscribe to our newsletter for updates on events, new resources, and community news.</p>
        <form onSubmit={handleNewsletter} className="max-w-[460px] mx-auto flex gap-2.5 max-md:flex-col">
          <input
            type="email"
            value={nlEmail}
            onChange={e => setNlEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3.5 border border-slate-200 rounded-xl text-base font-[inherit] focus:outline-none focus:border-[#5c8ab9] focus:ring-[3px] focus:ring-[#5c8ab9]/15"
          />
          <button type="submit" className="px-8 py-3.5 rounded-full font-bold text-base bg-[#9cbce2] text-white shadow-[0_4px_14px_rgba(156,188,226,0.4)] hover:bg-[#8baad1] hover:-translate-y-0.5 transition-all border-none cursor-pointer">
            Subscribe
          </button>
        </form>
        {nlMsg && (
          <p className={`mt-3 text-sm ${nlMsg.success ? 'text-emerald-600' : 'text-red-500'}`}>
            {nlMsg.text}
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-5 text-center text-[0.85rem]">
        <p>&copy; 2026 UPWC — Understanding the Three Principles Worldwide Community</p>
      </footer>
    </div>
  );
};

export default LandingPage;
