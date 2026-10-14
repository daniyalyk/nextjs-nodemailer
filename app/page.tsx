'use client';

import { useState } from 'react';
import { useFormik } from 'formik';

export default function Home() {
  const [status, setStatus] = useState('');
  const formik = useFormik({
    initialValues: { email: '' },
    validate: ({ email }) => {
      const errors: { email?: string } = {};

      if (!email.trim()) {
        errors.email = 'Enter your email address.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Enter a valid email address.';
      }

      return errors;
    },
    onSubmit: async ({ email }, { resetForm }) => {
      setStatus('');

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });

        if (!response.ok) {
          throw new Error('Email could not be sent.');
        }

        resetForm();
        setStatus('Email sent successfully.');
      } catch {
        setStatus('Could not send your email. Please try again.');
      }
    },
  });

  const emailError = formik.touched.email && formik.errors.email;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101713] px-6 text-[#e8efe9]">
      <form
        onSubmit={formik.handleSubmit}
        noValidate
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <label htmlFor="email" className="text-sm font-medium text-[#c6d3c9]">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'email-error' : undefined}
          {...formik.getFieldProps('email')}
          className="h-12 w-full rounded-md border border-[#38483d] bg-[#19231c] px-4 text-base text-[#f1f5f2] outline-none placeholder:text-[#829187] transition focus:border-[#83c49b] focus:ring-2 focus:ring-[#83c49b]/20"
        />
        {emailError && (
          <p id="email-error" className="-mt-2 text-sm text-[#f3a8a8]">
            {emailError}
          </p>
        )}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="h-12 rounded-md bg-[#83c49b] px-4 font-semibold text-[#102016] transition hover:bg-[#a0d6b2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a0d6b2] disabled:cursor-wait disabled:opacity-60"
        >
          {formik.isSubmitting ? 'Sending...' : 'Send email'}
        </button>
        <p role="status" aria-live="polite" className="min-h-5 text-sm text-[#c6d3c9]">
          {status}
        </p>
      </form>
    </main>
  );
}
