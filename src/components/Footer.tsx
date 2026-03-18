export default function Footer() {
  return (
    <footer id="footer" className="border-t border-white/10 bg-brand-dark py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white">Contacts</h3>
            <ul className="space-y-3 text-xs text-white/60">
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                456 Fashion Avenue, Miami, FL
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                +1 (555) 888-7890
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Damattween@mail.com
              </li>
            </ul>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center leading-none">
              <span className="text-xl font-bold tracking-[0.3em] text-white">DAMAT</span>
              <span className="text-[10px] tracking-[0.5em] text-white/70">TWEEN</span>
            </div>
            {/* Social Icons */}
            <div className="mt-4 flex items-center gap-4">
              <a href="#" className="text-white/60 transition hover:text-white" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" className="text-white/60 transition hover:text-white" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-white/60 transition hover:text-white" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="text-right">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white">Working Hours</h3>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <span className="text-white/40">Mon to Friday</span>
                <span className="ml-3">9 am To 10 pm</span>
              </li>
              <li>
                <span className="text-white/40">Saturday</span>
                <span className="ml-3">1 pm To 10 pm</span>
              </li>
              <li>
                <span className="text-white/40">Sunday</span>
                <span className="ml-3">8 pm To 10 pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © 2024 Damat Tween. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
