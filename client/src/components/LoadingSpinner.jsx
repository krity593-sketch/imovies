import React from 'react';
import { Film } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading cinema experience...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-rose-500/20 border-t-rose-600 animate-spin" />
        <Film className="w-6 h-6 text-rose-500 absolute animate-pulse" />
      </div>
      <p className="mt-4 text-slate-400 font-medium tracking-wide animate-pulse text-sm">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
