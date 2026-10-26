import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithPasswordOnly } from '../../lib/auth';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = loginWithPasswordOnly(password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.error || 'Incorrect password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="font-serif text-3xl font-semibold tracking-tight text-[#292B28] hover:text-[#34483B] inline-block">
          GlowHauz
        </Link>
        <h2 className="text-xs uppercase tracking-widest text-[#34483B] font-semibold">
          Store Management Access
        </h2>
        <p className="text-xs text-[#666963]">
          Enter your administrator password to unlock the store dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md border border-[#E6E0D5] rounded-xs sm:px-10 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xs text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Store Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#A7B5A0]" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs text-[#292B28] focus:bg-white focus:outline-hidden font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#34483B] hover:bg-[#243329] disabled:bg-[#A7B5A0] text-white py-3 px-4 rounded-xs text-xs font-semibold shadow-xs transition-colors"
            >
              <span>{loading ? 'Verifying...' : 'Unlock Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-[#666963] hover:text-[#34483B] hover:underline">
              ← Return to public storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
