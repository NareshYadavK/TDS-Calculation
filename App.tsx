
import React from 'react';
import TdsCalculator from './components/TdsCalculator';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <TdsCalculator />
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Disclaimer: This calculator is for informational purposes only and should not be considered as legal or financial advice. Please consult with a professional for specific guidance.</p>
        <p>&copy; 2025 TDS Calculator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
