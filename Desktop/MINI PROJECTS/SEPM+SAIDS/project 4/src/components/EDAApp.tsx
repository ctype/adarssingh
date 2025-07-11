import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import FileUpload from './FileUpload';
import DataOverview from './DataOverview';
import Statistics from './Statistics';
import Visualizations from './Visualizations';
import ExportReport from './ExportReport';
import StatisticalModules from './StatisticalModules';
import PythonLibrariesDemo from './PythonLibrariesDemo';
import { Upload, Database, BarChart3, LineChart, Download, AlertCircle, Menu, X } from 'lucide-react';
import {
  clearAllData,
  clearCurrentSessionData,
  getCurrentDatasetId,
  initializeStorageCleanup,
  cleanupOldData
} from '../services/storageService';
import { Calculator, Code } from 'lucide-react';

const EDAApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, loading, error } = useSelector((state: RootState) => state.dataset);

  // Initialize storage cleanup on app start
  useEffect(() => {
    initializeStorageCleanup();
  }, []);

  // Comprehensive cleanup on component unmount and page events
  useEffect(() => {
    let isUnloading = false;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      isUnloading = true;
      // Clear current session data when user is about to leave
      clearCurrentSessionData();
      // Optional: Show confirmation dialog for unsaved work
      const currentDatasetId = getCurrentDatasetId();
      if (currentDatasetId) {
        event.preventDefault();
        event.returnValue = 'Your analysis data will be cleared when you leave this page.';
        return event.returnValue;
      }
    };

    const handleUnload = () => {
      // Final cleanup on actual unload
      clearCurrentSessionData();
    };

    const handleVisibilityChange = () => {
      // Clear data when tab becomes hidden for extended period
      if (document.visibilityState === 'hidden') {
        setTimeout(() => {
          if (document.visibilityState === 'hidden' && !isUnloading) {
            clearCurrentSessionData();
          }
        }, 30000); // Clear after 30 seconds of being hidden
      }
    };

    const handlePageHide = () => {
      // Clear data when page is hidden (mobile browsers, tab switching)
      clearCurrentSessionData();
    };

    const handleFocus = () => {
      // Clean up old data when user returns to the tab
      cleanupOldData(1); // Clean data older than 1 hour
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Clear data when component unmounts
      if (!isUnloading) {
        clearCurrentSessionData();
      }
    };
  }, []);

  // Periodic cleanup while app is active
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      // Clean old data every 15 minutes
      cleanupOldData(2); // Clean data older than 2 hours
      // If no current dataset, clear everything
      const currentDatasetId = getCurrentDatasetId();
      if (!currentDatasetId) {
        clearAllData();
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

  // Memory pressure cleanup
  useEffect(() => {
    const handleMemoryPressure = () => {
      console.log('🚨 Memory pressure detected, clearing old data...');
      cleanupOldData(0.5); // Clean data older than 30 minutes
    };

    // Listen for memory pressure events (if supported)
    if ('memory' in performance) {
      const checkMemory = () => {
        const memInfo = (performance as any).memory;
        if (memInfo && memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.9) {
          handleMemoryPressure();
        }
      };

      const memoryCheckInterval = setInterval(checkMemory, 60000); // Check every minute
      return () => clearInterval(memoryCheckInterval);
    }
  }, []);

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload, component: FileUpload },
    { id: 'overview', label: 'Overview', icon: Database, component: DataOverview, disabled: data.length === 0 },
    { id: 'statistics', label: 'Statistics', icon: BarChart3, component: Statistics, disabled: data.length === 0 },
    { id: 'statistical-modules', label: 'Advanced Stats', icon: Calculator, component: StatisticalModules, disabled: data.length === 0 },
    { id: 'python-libraries', label: 'Python Libraries', icon: Code, component: PythonLibrariesDemo, disabled: data.length === 0 },
    { id: 'visualizations', label: 'Charts', icon: LineChart, component: Visualizations, disabled: data.length === 0 },
    { id: 'export', label: 'Export', icon: Download, component: ExportReport, disabled: data.length === 0 },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || FileUpload;

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Error Banner */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          borderBottom: '1px solid #fecaca',
          padding: '12px 0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} color="#dc2626" />
              <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>
                {error}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Banner */}
      {loading && (
        <div style={{
          backgroundColor: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          padding: '12px 0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #3b82f6',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <span style={{ color: '#1d4ed8', fontSize: '14px', fontWeight: '500' }}>
                Processing your file...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Mobile Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            '@media (min-width: 768px)': {
              display: 'none'
            }
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="#3b82f6" />
              <span style={{ fontWeight: '600', color: '#1f2937' }}>EDA Tool</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              {tabs.find(tab => tab.id === activeTab)?.label}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderTop: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              zIndex: 20
            }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isDisabled = tab.disabled;

                return (
                  <button
                    key={tab.id}
                    onClick={() => !isDisabled && handleTabClick(tab.id)}
                    disabled={isDisabled}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      width: '100%',
                      border: 'none',
                      backgroundColor: isActive ? '#f8fafc' : '#ffffff',
                      color: isDisabled ? '#9ca3af' : isActive ? '#3b82f6' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      textAlign: 'left',
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Desktop Tabs */}
          <div style={{
            display: 'none',
            '@media (min-width: 768px)': {
              display: 'flex'
            }
          }}>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isDisabled = tab.disabled;

                return (
                  <button
                    key={tab.id}
                    onClick={() => !isDisabled && setActiveTab(tab.id)}
                    disabled={isDisabled}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px 24px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: isDisabled ? '#9ca3af' : isActive ? '#3b82f6' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!isDisabled && !isActive) {
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isDisabled && !isActive) {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <ActiveComponent />
      </main>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (min-width: 768px) {
            .mobile-header {
              display: none !important;
            }
            .desktop-tabs {
              display: flex !important;
            }
          }
          
          @media (max-width: 767px) {
            .desktop-tabs {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EDAApp;