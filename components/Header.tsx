import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            TDS <span className="text-blue-600">Navigator</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Section 393 • Income Tax Act, 2025 (India)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Status</span>
            <span className="text-sm font-bold text-green-500 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Regulations
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
