import { useState, useEffect } from 'react';
import { Box, CircularProgress, Snackbar, Alert, Tabs, Tab, Container, CssBaseline, ClickAwayListener } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { collection, getDocs, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { dbChat } from './firebase-chat';
import Login from './components/Login';
import Header from './components/Header';
import DocumentList from './components/DocumentList';
import NotificationsList from './components/NotificationsList';
import { lightTheme, darkTheme } from './theme';
import './App.css';
import MessagePopup from './components/MessagePopup';
import PasswordPrompt from './components/PasswordPrompt';
import SecretChat from './components/SecretChat';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showSecretChat, setShowSecretChat] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [displayableMessages, setDisplayableMessages] = useState([]);
  
  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedName = localStorage.getItem('userName');
      
      if (storedAuth === 'true' && storedName) {
        setIsAuthenticated(true);
        setUserName(storedName);
        
        setSnackbar({
          open: true,
          message: `Welcome back, ${storedName}`,
          severity: 'success'
        });
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Check for existing theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated) {
      fetchDocuments(isMounted);
      fetchNotifications(isMounted);
    } else {
      setDocuments([]);
      setNotifications([]);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Effect to fetch and manage secret chat messages
  useEffect(() => {
    if (isAuthenticated && userName) {
      const q = query(collection(dbChat, 'secret-chat'), orderBy('timestamp'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newUnseenMessages = [];
        querySnapshot.forEach((doc) => {
          const message = { id: doc.id, ...doc.data() };
          if (message.sender !== userName && !message.seenBy?.includes(userName)) {
            newUnseenMessages.push(message);
          }
        });

        if (newUnseenMessages.length > 0) {
          setDisplayableMessages(prevMessages => [...prevMessages, ...newUnseenMessages]);
          
          newUnseenMessages.forEach(async (msg) => {
            const msgRef = doc(dbChat, 'secret-chat', msg.id);
            await updateDoc(msgRef, {
              seenBy: arrayUnion(userName),
            });
          });
        }
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated, userName]);

  const fetchDocuments = async (isMounted = true) => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'hospitals'));
      if (isMounted) {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDocuments(docs);
        setSnackbar({
          open: true,
          message: 'Hospitals loaded successfully',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      if (isMounted) {
        setError('Failed to load hospitals. Please try refreshing the page.');
        setSnackbar({
          open: true,
          message: 'Failed to load hospitals',
          severity: 'error'
        });
        setDocuments([]);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const fetchNotifications = async (isMounted = true) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notifications'));
      if (isMounted) {
        const notifs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(notifs);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (isMounted) {
        setSnackbar({
          open: true,
          message: 'Failed to load notifications',
          severity: 'error'
        });
      }
    }
  };

  const handleLogin = ({ isAuthenticated: authStatus, error: loginError, userName: name }) => {
    setIsAuthenticated(authStatus);
    if (name) {
      setUserName(name);
    }
    
    if (!authStatus && loginError) {
      setError(loginError);
      setSnackbar({
        open: true,
        message: loginError,
        severity: 'error'
      });
    } else if (authStatus) {
      setError(null);
      setSnackbar({
        open: true,
        message: `Welcome, ${name}`,
        severity: 'success'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setDocuments([]);
    setSnackbar({
      open: true,
      message: 'You have been signed out',
      severity: 'info'
    });
  };

  const handleHospitalDeleted = (hospitalId) => {
    const updatedDocuments = documents.filter(doc => doc.id !== hospitalId);
    setDocuments(updatedDocuments);

    const deletedHospital = documents.find(doc => doc.id === hospitalId);
    const hospitalName = deletedHospital?.name || 'Hospital';

    setSnackbar({
      open: true,
      message: `${hospitalName} has been deleted successfully`,
      severity: 'success'
    });
  };

  const handleHospitalUpdated = (hospitalId, updatedHospital, refreshList = false) => {
    if (refreshList) {
      fetchDocuments();
      setSnackbar({
        open: true,
        message: 'New hospital has been created successfully',
        severity: 'success'
      });
      return;
    }
    
    const updatedDocuments = documents.map(doc => 
      doc.id === hospitalId ? { ...doc, ...updatedHospital } : doc
    );
    
    setDocuments(updatedDocuments);

    setSnackbar({
      open: true,
      message: `${updatedHospital.name} has been updated successfully`,
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUnlockTrigger = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (password) => {
    if (password === '28052025') {
      setShowPasswordPrompt(false);
      setShowSecretChat(true);
      setPasswordError('');
      setSnackbar({
        open: true,
        message: 'Secret chat unlocked!',
        severity: 'success'
      });
    } else {
      setPasswordError('Incorrect password');
      setShowPasswordPrompt(false);
      setSnackbar({
        open: true,
        message: 'Incorrect password',
        severity: 'error'
      });
    }
  };

  const closePasswordPrompt = () => {
    setShowPasswordPrompt(false);
    setPasswordError('');
  }

  const closeSecretChat = () => {
    setShowSecretChat(false);
  }

  if (loading) {
    return (
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Box 
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%',
            height: '100%',
            bgcolor: 'background.default'
          }}
        >
          <CircularProgress color="primary" size={50} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {!isAuthenticated ? (
        <Box sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Login onLogin={handleLogin} />
        </Box>
      ) : (
        <Box sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Header 
            isAuthenticated={isAuthenticated}
            userName={userName}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeToggle}
          />
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            <Container 
              maxWidth={false} 
              sx={{ 
                flexGrow: 1, 
                py: 3,
                px: { xs: 2, sm: 3, md: 4 },
                width: '100%',
                maxWidth: '100%'
              }}
            >
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' 
                  }}
                >
                  {error}
                </Alert>
              )}
              
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  mb: 3,
                  width: '100%'
                }}
              >
                <Tab label="Hospitals" />
                <Tab label="Notifications" />
              </Tabs>

              <Box sx={{ flexGrow: 1, width: '100%' }}>
                {activeTab === 0 && (
                  <DocumentList
                    documents={documents}
                    onDocumentDeleted={handleHospitalDeleted}
                    onDocumentUpdated={handleHospitalUpdated}
                  />
                )}
                {activeTab === 1 && (
                  <NotificationsList 
                    notifications={notifications}
                    refreshNotifications={fetchNotifications} 
                  />
                )}
              </Box>
            </Container>
          </Box>
          <MessagePopup 
            refreshNotifications={fetchNotifications}
            onUnlock={handleUnlockTrigger}
          />
        </Box>
      )}

      {showPasswordPrompt && (
        <PasswordPrompt 
          onSubmit={handlePasswordSubmit} 
          onClose={closePasswordPrompt}
          error={passwordError} 
        />
      )}

      {showSecretChat && (
        <ClickAwayListener onClickAway={closeSecretChat}>
          <div>
            <SecretChat 
              onClose={closeSecretChat} 
              userName={userName}
              messages={displayableMessages}
            />
          </div>
        </ClickAwayListener>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
