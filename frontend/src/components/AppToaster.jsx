import { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const AppToaster = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? '#2a2520' : '#ffffff',
          color: isDark ? '#faf8f5' : '#2a2520',
          borderRadius: '12px',
          border: `1px solid ${isDark ? '#544a40' : '#ebe5d8'}`,
          boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.28)' : '0 4px 12px rgba(0,0,0,0.08)',
        },
        success: {
          iconTheme: {
            primary: '#f08573',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};

export default AppToaster;
