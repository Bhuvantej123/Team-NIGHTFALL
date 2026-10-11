import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { TopBar } from './components/navigation/TopBar';
import { DemoFooter } from './components/navigation/DemoFooter';
import { ColophonSheet } from './components/common/ColophonSheet';
import { DiscoverPage } from './pages/DiscoverPage';
import { CreatorDetailPage } from './pages/CreatorDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignJourneyPage } from './pages/CampaignJourneyPage';

interface ColophonState {
  isOpen: boolean;
  work: any;
  creator: any;
  dark: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCasting = location.pathname.includes('/casting');

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const [colophonState, setColophonState] = useState<ColophonState>({
    isOpen: false,
    work: null,
    creator: null,
    dark: false,
  });

  const handleOpenColophon = (work: any, creator: any, dark = false) => {
    setColophonState({
      isOpen: true,
      work,
      creator,
      dark,
    });
  };

  const handleCloseColophon = () => {
    setColophonState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div
      className={`min-h-screen bg-paper text-ink flex flex-col font-ui antialiased selection:bg-marker selection:text-ink ${
        isCasting ? 'h-screen w-screen overflow-hidden' : ''
      }`}
    >
      {/* 64px Editorial TopBar (Hidden in Casting Room) */}
      {!isCasting && (
        <TopBar
          currentRoute={location.pathname}
          onNavigate={(route: string) => navigate(route)}
          onNewCampaign={() => navigate('/campaigns')}
        />
      )}

      {/* Main Content Area */}
      <main className={isCasting ? 'h-screen w-screen overflow-hidden' : 'flex-1'}>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                onOpenColophon={handleOpenColophon}
                onShowToast={showToast}
              />
            }
          />
          <Route
            path="/discover"
            element={<DiscoverPage onOpenColophon={handleOpenColophon} />}
          />
          <Route
            path="/creators/:id"
            element={<CreatorDetailPage onOpenColophon={handleOpenColophon} />}
          />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route
            path="/campaigns/:id/*"
            element={<CampaignJourneyPage onOpenColophon={handleOpenColophon} />}
          />
        </Routes>
      </main>

      {/* Demo Footer (Hidden in Casting Room) */}
      {!isCasting && (
        <DemoFooter
          onResetData={() => {
            localStorage.removeItem('colophon_campaigns');
            showToast('Workspace seed data refreshed', 'info');
          }}
        />
      )}

      {/* Global Slide-over Drawer: Colophon Sheet */}
      <ColophonSheet
        isOpen={colophonState.isOpen}
        onClose={handleCloseColophon}
        work={colophonState.work}
        creator={colophonState.creator}
        dark={colophonState.dark}
        onSelectCreator={(c: any) => {
          handleCloseColophon();
          if (c?.id) {
            navigate(`/creators/${c.id}`);
          }
        }}
      />

      {/* Global Feedback Toasts Container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-ctl bg-ink text-surface border border-ink/80 shadow-float text-[13px] font-ui"
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && (
                  <CheckCircle2 size={16} className="text-verified flex-shrink-0" />
                )}
                {toast.type === 'error' && (
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                )}
                {toast.type === 'info' && (
                  <Info size={16} className="text-surface flex-shrink-0" />
                )}
                <span className="leading-snug">{toast.message}</span>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-surface/50 hover:text-surface p-0.5 rounded transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
