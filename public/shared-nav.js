(function() {
  const SUPABASE_URL = 'https://vlrbeemaxxdqiczdxomd.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscmJlZW1heHhkcWljemR4b21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzkxNDYsImV4cCI6MjA4NDE1NTE0Nn0.TVPeCb9pudVV2_OsjSeNU6fGCVOVxSx6mYUfZPg0QB0';

  const currentPath = window.location.pathname;

  function isActive(path) {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  }

  function renderNav(session) {
    const nav = document.createElement('nav');
    nav.id = 'shared-nav';
    nav.innerHTML = `
      <style>
        #shared-nav {
          background-color: #ffffff;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          padding: 10px 35px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        #shared-nav .sn-container {
          max-width: 1400px; margin: 0 auto; padding: 0 30px;
          display: flex; justify-content: space-between; align-items: center;
        }
        #shared-nav .sn-left { flex: 1; display: flex; justify-content: flex-start; }
        #shared-nav .sn-logo img { height: 95px; width: auto; display: block; }
        #shared-nav .sn-center {
          flex: 3; display: flex; justify-content: center; align-items: center;
          gap: 30px; list-style: none; margin: 0; padding: 0;
        }
        #shared-nav .sn-center a {
          text-decoration: none; color: #1e293b; font-weight: 500;
          font-size: 0.9rem; white-space: nowrap; transition: color 0.2s;
        }
        #shared-nav .sn-center a:hover, #shared-nav .sn-center a.active { color: #5c8ab9; }
        #shared-nav .sn-right { flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
        #shared-nav .sn-login-btn {
          background-color: #9cbce2; color: #ffffff;
          padding: 10px 32px; border-radius: 999px; font-weight: 700;
          font-size: 1.05rem; text-decoration: none; transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(156, 188, 226, 0.3); white-space: nowrap;
        }
        #shared-nav .sn-login-btn:hover { background-color: #8baad1; transform: translateY(-1px); }
        #shared-nav .sn-user-menu {
          display: flex; align-items: center; gap: 10px;
          padding: 6px 16px; border-radius: 30px; cursor: pointer;
          transition: 0.2s; border: 1px solid #e5e7eb; text-decoration: none; color: #1e293b;
        }
        #shared-nav .sn-user-menu:hover { background: #f9fafb; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        #shared-nav .sn-avatar {
          width: 32px; height: 32px; border-radius: 50%; object-fit: cover;
          background: #e5e7eb; border: 1px solid #e5e7eb;
        }
        #shared-nav .sn-user-name { font-size: 0.875rem; font-weight: 600; }
        @media (max-width: 768px) {
          #shared-nav .sn-center { gap: 16px; }
          #shared-nav .sn-center a { font-size: 0.8rem; }
          #shared-nav .sn-logo img { height: 60px; }
          #shared-nav .sn-container { padding: 0 10px; }
          #shared-nav { padding: 8px 15px; }
        }
      </style>
      <div class="sn-container">
        <div class="sn-left">
          <a href="/" class="sn-logo">
            <img src="https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/Assets/LOGO2%20UPWC@4x.png" alt="UPWC Logo">
          </a>
        </div>
        <ul class="sn-center">
          <li><a href="/"${isActive('/') ? ' class="active"' : ''}>Home</a></li>
          <li><a href="/three-principles/"${isActive('/three-principles') ? ' class="active"' : ''}>The Three Principles</a></li>
          <li><a href="/resources/"${isActive('/resources') ? ' class="active"' : ''}>Resources</a></li>
          <li><a href="/map"${isActive('/map') ? ' class="active"' : ''}>Event Map</a></li>
          <li><a href="/community/"${isActive('/community') ? ' class="active"' : ''}>Community</a></li>
        </ul>
        <div class="sn-right" id="sn-auth-area">
          ${session
            ? `<a href="/dashboard" class="sn-user-menu">
                <img class="sn-avatar" src="${session.avatarUrl}" alt="">
                <span class="sn-user-name">${session.name}</span>
              </a>`
            : `<a href="/join" class="sn-login-btn">Join</a>`
          }
        </div>
      </div>
    `;
    return nav;
  }

  async function init() {
    // Wait for Supabase SDK
    if (typeof window.supabase === 'undefined') {
      // Load Supabase if not already loaded
      await new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/@supabase/supabase-js@2';
        s.onload = resolve;
        document.head.appendChild(s);
      });
    }

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: { session } } = await client.auth.getSession();

    let sessionInfo = null;
    if (session) {
      const { data: profile } = await client.from('profiles').select('full_name, avatar_url').eq('id', session.user.id).single();
      const name = profile?.full_name || session.user.email.split('@')[0];
      const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
      sessionInfo = { name, avatarUrl };
    }

    const nav = renderNav(sessionInfo);

    // Replace existing nav if present, otherwise prepend to body
    const existingNav = document.querySelector('#shared-nav') || document.querySelector('.navbar');
    if (existingNav) {
      existingNav.replaceWith(nav);
    } else {
      document.body.prepend(nav);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
