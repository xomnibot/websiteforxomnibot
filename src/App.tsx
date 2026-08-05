import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { SearchProvider } from '@/context/SearchContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { AppRoutes } from '@/router/routes';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SearchProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-emerald-400 selection:text-black">
            <Navbar />
            <div className="flex-1">
              <AppRoutes />
            </div>
            <Footer />
            <SearchModal />
          </div>
        </Router>
      </SearchProvider>
    </ThemeProvider>
  );
};

export default App;
