import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { AuthField } from '../components/auth/AuthField';
import { staggerItem } from '../animations/pageTransitions';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, actionLoading, error, clearError } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key) => (e) => {
    clearError();
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(form);
    if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    if (result.ok) navigate('/', { replace: true });
  };

  const mergedErrors = {
    name: fieldErrors.name || error?.fieldErrors?.name,
    email: fieldErrors.email || error?.fieldErrors?.email,
    password: fieldErrors.password || error?.fieldErrors?.password,
  };

  return (
    <motion.div variants={staggerItem} initial="initial" animate="animate">
      <GlassCard className="!p-6 sm:!p-8" glow hover={false}>
        <div className="mb-8 text-center sm:text-left">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted mb-2">
            Get started
          </p>
          <h1 className="text-2xl font-semibold text-foreground font-sans text-glow">Create account</h1>
          <p className="text-xs text-muted font-sans mt-2">
            Join Gotta-do-it and start building momentum.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthField
            id="name"
            label="Name"
            value={form.name}
            onChange={update('name')}
            error={mergedErrors.name}
            autoComplete="name"
            placeholder="Your name"
          />
          <AuthField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={update('email')}
            error={mergedErrors.email}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthField
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={update('password')}
            error={mergedErrors.password}
            autoComplete="new-password"
            placeholder="Min 8 chars, upper, lower, number"
          />

          {error?.message && !Object.values(mergedErrors).some(Boolean) && (
            <p className="text-xs text-red-400/90 text-center font-sans" role="alert">
              {error.message}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={actionLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary rounded-xl py-3.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity mt-2"
          >
            {actionLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Sign up
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-xs text-muted font-sans">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-foreground underline underline-offset-4 hover:text-glow transition-colors"
          >
            Sign in
          </Link>
        </p>
      </GlassCard>
    </motion.div>
  );
};
