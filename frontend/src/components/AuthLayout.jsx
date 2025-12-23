import React from 'react';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[calc(100vh-64px-64px)] bg-gradient-to-b from-sky-50 via-white to-indigo-50/40 flex items-center">
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white">🚀</div>
            <span className="text-xl font-semibold">GrowMore</span>
          </div>
        </div>
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="mt-3 text-gray-600">{subtitle}</p>}
            {footer && <div className="mt-6 text-sm text-gray-600">{footer}</div>}
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
