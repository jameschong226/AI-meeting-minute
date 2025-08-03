
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md border border-slate-200">
        <div className="w-16 h-16 border-4 border-t-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-slate-600">Analyzing your meeting...</p>
        <p className="text-sm text-slate-500">This may take a few moments for longer files.</p>
    </div>
  );
};
