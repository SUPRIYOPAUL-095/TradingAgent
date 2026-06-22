'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1>Something went wrong</h1>
        <button onClick={() => reset()}>Try Again</button>
      </div>
    </div>
  );
}
