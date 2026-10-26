import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { Toast } from '../ui/Toast';
import { trackEvent } from '../../lib/analytics';

export const PublicLayout: React.FC = () => {
  const location = useLocation();

  // Scroll to top and track page view on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', { path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#292B28]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Toast />
    </div>
  );
};
