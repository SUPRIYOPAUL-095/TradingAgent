'use client';

export default function Error500() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100">
      <h1 className="text-5xl font-bold mb-4">500 – Internal Server Error</h1>
      <p className="text-lg mb-6">Something went wrong. Please try again later.</p>
    </div>
  );
}
