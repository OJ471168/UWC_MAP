import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { STRIPE_CONFIG, getStripe } from '../lib/stripe';

type FormView = 'pricing' | 'signup' | 'login';

const features = [
  'Publish events to the global Event Map',
  'Share resources with the community',
  'Community discussion feed',
  'Member directory — connect with practitioners',
  'Full dashboard access',
];

const JoinPage: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<FormView>('pricing');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated + active member → show "already member" state
  const isActiveMember = profile?.membershipStatus === 'active';

  // If logged in but not a member, redirect to checkout automatically
  useEffect(() => {
    if (!authLoading && user && profile && !isActiveMember) {
      redirectToCheckout(user.id, user.email ?? '');
    }
  }, [authLoading, user, profile, isActiveMember]);

  const redirectToCheckout = async (userId: string, email: string) => {
    const stripe = await getStripe();
    if (!stripe) return;

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: STRIPE_CONFIG.priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: STRIPE_CONFIG.successUrl,
      cancelUrl: STRIPE_CONFIG.cancelUrl,
      clientReferenceId: userId,
      customerEmail: email,
    });

    if (error) {
      setError(`Payment error: ${error.message}`);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupName || !signupEmail || !signupPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    const { data, error: signupError } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: { data: { full_name: signupName } },
    });

    if (signupError) {
      setError(signupError.message);
      setSubmitting(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').update({ full_name: signupName }).eq('id', data.user.id);
      await redirectToCheckout(data.user.id, data.user.email ?? signupEmail);
    }

    setSubmitting(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (loginError) {
      setError(loginError.message);
      setSubmitting(false);
      return;
    }

    if (data.user) {
      // Check membership
      const { data: profileData } = await supabase
        .from('profiles')
        .select('membership_status')
        .eq('id', data.user.id)
        .single();

      if (profileData?.membership_status === 'active') {
        navigate('/dashboard');
        return;
      }

      await redirectToCheckout(data.user.id, data.user.email ?? loginEmail);
    }

    setSubmitting(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 to-white border-b border-slate-200 py-20 px-5 text-center">
        <span className="inline-block px-4 py-1.5 bg-sky-100 text-[#5c8ab9] rounded-full text-sm font-bold uppercase tracking-wider mb-5">
          Membership
        </span>
        <h1 className="m-0 mb-4 text-5xl font-extrabold tracking-tight text-slate-900 leading-tight max-md:text-3xl">
          Join the UPWC Community
        </h1>
        <p className="text-slate-500 text-lg max-w-[600px] mx-auto leading-relaxed">
          Connect with practitioners worldwide, share events, access resources, and engage in meaningful discussions.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-[900px] mx-auto py-16 px-5">
        {/* Already a member */}
        {isActiveMember && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-9 max-w-[480px] mx-auto text-center">
            <h3 className="text-emerald-600 m-0 mb-2 text-xl font-bold">You're already a member!</h3>
            <p className="text-slate-500 m-0 mb-5">You have an active community membership.</p>
            <Link
              to="/dashboard"
              className="inline-block py-3 px-7 bg-emerald-600 text-white rounded-full font-bold no-underline transition-all hover:bg-emerald-700"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Pricing Card */}
        {!isActiveMember && view === 'pricing' && (
          <div className="bg-white border-2 border-[#5c8ab9] rounded-2xl p-12 max-w-[480px] mx-auto text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5c8ab9] to-[#9cbce2]" />
            <div className="text-sm font-bold uppercase text-[#5c8ab9] tracking-wider mb-2">Community Membership</div>
            <h2 className="text-2xl font-extrabold m-0 mb-6">Everything you need to connect and share</h2>
            <div className="text-6xl font-extrabold text-slate-900 mb-0">
              $40<span className="text-lg font-medium text-slate-500"> / year</span>
            </div>

            <ul className="list-none p-0 my-8 text-left">
              {features.map((f) => (
                <li key={f} className="py-2.5 text-[0.95rem] text-slate-500 flex items-center gap-3 border-b border-slate-100 last:border-b-0">
                  <span className="w-[22px] h-[22px] rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    <Check size={14} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setView('signup')}
              className="w-full py-4 border-none bg-[#9cbce2] text-white rounded-xl text-lg font-bold cursor-pointer transition-all shadow-[0_4px_12px_rgba(156,188,226,0.4)] hover:bg-[#8baad1] hover:-translate-y-0.5"
            >
              Join Now — $40/year
            </button>
            <p className="mt-5 text-sm text-slate-500">
              Already a member?{' '}
              <Link to="/dashboard" className="text-[#5c8ab9] no-underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* Signup Form */}
        {!isActiveMember && view === 'signup' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-9 max-w-[480px] mx-auto">
            <h3 className="m-0 mb-1.5 text-xl font-bold">Create your account</h3>
            <p className="text-slate-500 text-sm m-0 mb-5">
              Sign up first, then you'll be taken to the secure payment page.
            </p>
            <form onSubmit={handleSignup}>
              <div className="mb-4 text-left">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm box-border focus:outline-none focus:border-[#5c8ab9] focus:shadow-[0_0_0_3px_rgba(92,138,185,0.15)]"
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm box-border focus:outline-none focus:border-[#5c8ab9] focus:shadow-[0_0_0_3px_rgba(92,138,185,0.15)]"
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm box-border focus:outline-none focus:border-[#5c8ab9] focus:shadow-[0_0_0_3px_rgba(92,138,185,0.15)]"
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 border-none bg-[#9cbce2] text-white rounded-xl text-lg font-bold cursor-pointer transition-all shadow-[0_4px_12px_rgba(156,188,226,0.4)] hover:bg-[#8baad1] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {submitting ? 'Creating account...' : 'Create Account & Pay'}
              </button>
            </form>
            <p className="mt-5 text-sm text-slate-500 text-center">
              Already have an account?{' '}
              <button
                onClick={() => { setView('login'); setError(''); }}
                className="text-[#5c8ab9] font-semibold bg-transparent border-none cursor-pointer p-0"
              >
                Sign in instead
              </button>
            </p>
          </div>
        )}

        {/* Login Form */}
        {!isActiveMember && view === 'login' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-9 max-w-[480px] mx-auto">
            <h3 className="m-0 mb-1.5 text-xl font-bold">Sign in to continue</h3>
            <p className="text-slate-500 text-sm m-0 mb-5">
              Log in with your existing account to proceed to payment.
            </p>
            <form onSubmit={handleLogin}>
              <div className="mb-4 text-left">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm box-border focus:outline-none focus:border-[#5c8ab9] focus:shadow-[0_0_0_3px_rgba(92,138,185,0.15)]"
                />
              </div>
              <div className="mb-4 text-left">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm box-border focus:outline-none focus:border-[#5c8ab9] focus:shadow-[0_0_0_3px_rgba(92,138,185,0.15)]"
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 border-none bg-[#9cbce2] text-white rounded-xl text-lg font-bold cursor-pointer transition-all shadow-[0_4px_12px_rgba(156,188,226,0.4)] hover:bg-[#8baad1] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {submitting ? 'Signing in...' : 'Sign In & Pay'}
              </button>
            </form>
            <p className="mt-5 text-sm text-slate-500 text-center">
              Don't have an account?{' '}
              <button
                onClick={() => { setView('signup'); setError(''); }}
                className="text-[#5c8ab9] font-semibold bg-transparent border-none cursor-pointer p-0"
              >
                Create one
              </button>
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-5 text-center text-sm">
        <p>&copy; 2026 UPWC — Understanding the Three Principles Worldwide Community</p>
      </footer>
    </div>
  );
};

export { JoinPage };
