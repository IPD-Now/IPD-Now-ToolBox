import { useState, useEffect } from 'react';
import { Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Login from './components/Login';
import Header from './components/Header';
import DocumentList from './components/DocumentList';
import theme from './theme';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
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
  
  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated) {
      fetchDocuments(isMounted);
    } else {
      setDocuments([]);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

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
    // Clear authentication from localStorage
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
    // Update the documents list by removing the deleted hospital
    const updatedDocuments = documents.filter(doc => doc.id !== hospitalId);
    setDocuments(updatedDocuments);

    // Find the deleted hospital name
    const deletedHospital = documents.find(doc => doc.id === hospitalId);
    const hospitalName = deletedHospital?.name || 'Hospital';

    // Show success notification
    setSnackbar({
      open: true,
      message: `${hospitalName} has been deleted successfully`,
      severity: 'success'
    });
  };

  const handleHospitalUpdated = (hospitalId, updatedHospital, refreshList = false) => {
    // If refreshList is true, we need to refresh the entire list (used after creating a new hospital)
    if (refreshList) {
      fetchDocuments();
      
      // Show success notification
      setSnackbar({
        open: true,
        message: 'New hospital has been created successfully',
        severity: 'success'
      });
      return;
    }
    
    // Update the documents list with the edited hospital
    const updatedDocuments = documents.map(doc => 
      doc.id === hospitalId ? { ...doc, ...updatedHospital } : doc
    );
    
    setDocuments(updatedDocuments);

    // Show success notification
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

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
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
            bgcolor: theme.palette.background.default
          }}
        >
          <CircularProgress color="primary" size={50} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Box 
          sx={{ 
            height: '100vh',
            width: '100vw',
            margin: 0,
            padding: 0,
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: theme.palette.background.default,
            overflow: 'hidden',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <Header 
            isAuthenticated={isAuthenticated}
            userName={userName}
            onLogout={handleLogout}
          />
          
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1,
              flexShrink: 1,
              overflowY: 'auto',
              height: 'calc(100% - 76px)',
              position: 'relative',
              pb: 2,
              mt: 0,
              px: 0
            }}
          >
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mx: 3, 
                  mt: 3, 
                  borderRadius: 2,
                  boxShadow: theme.shadows[2] 
                }}
              >
                {error}
              </Alert>
            )}
            <DocumentList
              documents={documents}
              onDocumentDeleted={handleHospitalDeleted}
              onDocumentUpdated={handleHospitalUpdated}
            />
          </Box>
        </Box>
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
