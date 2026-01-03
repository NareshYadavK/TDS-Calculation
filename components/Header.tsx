
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          TDS Calculator
        </h1>
        <p className="text-md text-gray-500 mt-1">
          Based on Section 393, Income Tax Act, 2025
        </p>
      </div>
    </header>
  );
};

export default Header;
