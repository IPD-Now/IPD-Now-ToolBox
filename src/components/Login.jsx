import { Box, Button, Typography, Paper, TextField, Avatar, FormControl, Select, MenuItem, InputAdornment, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { Visibility, VisibilityOff, Person, LockOutlined, LocalHospital, Healing, Medication, MonitorHeart, HealthAndSafety, Bloodtype, VaccinesOutlined, MedicalServices, KeyboardArrowDown } from '@mui/icons-material';
import appLogo from '../assets/applogo.jpeg';

const LoginWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 0,
  padding: 0,
  backgroundColor: '#ffffff',
  backgroundImage: 'none',
  '&::before': {
    content: 'none'
  },
  '&::after': {
    content: 'none'
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 420,
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  margin: theme.spacing(0, 2),
  position: 'relative',
  backgroundColor: '#ffffff',
  backdropFilter: 'none',
  zIndex: 10,
  borderTop: `3px solid ${theme.palette.primary.main}`,
  animation: 'fadeInUp 0.8s ease-out forwards',
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
}));

const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0, 2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    background: `linear-gradient(90deg, transparent, ${alpha('#69b56a', 0.3)}, transparent)`,
  }
}));

const LogoAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: '0 auto',
  backgroundColor: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  padding: 8,
  position: 'relative',
  transition: 'transform 0.3s ease',
  animation: 'logoPulse 3s infinite ease-in-out',
  '@keyframes logoPulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    '50%': {
      transform: 'scale(1.05)',
      boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4, 4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  position: 'relative',
  backgroundColor: '#ffffff', 
  '&::before': {
    content: 'none'
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 6,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }
  },
  '& .MuiSelect-select': {
    textAlign: 'left',
    paddingLeft: 36,
    fontWeight: 500
  },
  '& .MuiInputAdornment-root': {
    marginRight: 0,
    pointerEvents: 'none',
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 6,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '13.5px 14px 13.5px 38px'
  },
  '& .MuiInputAdornment-root': {
    marginRight: 8,
    marginLeft: 0
  },
  '& .MuiInputAdornment-positionStart': {
    position: 'absolute',
    left: 8
  }
}));

const HealthButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  padding: theme.spacing(1.2, 2),
  fontWeight: 600,
  fontSize: '0.95rem',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: 50,
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.2)}, transparent)`,
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      left: -100,
    },
    '100%': {
      left: '200%',
    },
  },
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)'
  }
}));

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Available names
  const availableNames = ['Raghav Sachdev', 'Dhruvi Mittal'];
  
  // Load saved name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName && availableNames.includes(savedName)) {
      setSelectedName(savedName);
    } else {
      setSelectedName(availableNames[0]);
    }
    
    // Add a small delay to trigger animations
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  const handleLogin = () => {
    if (!password.trim()) {
      setError('Password is required');
      onLogin({ isAuthenticated: false, error: 'Password is required' });
      return;
    }

    if (password === '@Bachgayeguru2006') {
      // Save selected name to localStorage
      localStorage.setItem('userName', selectedName);
      
      // Also save authentication state
      localStorage.setItem('isAuthenticated', 'true');
      
      setError('');
      onLogin({ isAuthenticated: true, error: null, userName: selectedName });
    } else {
      setError('Invalid password');
      onLogin({ isAuthenticated: false, error: 'Invalid password' });
    }
  };

  const handleNameChange = (event) => {
    setSelectedName(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <LoginWrapper>
      <StyledPaper elevation={5}>
        <LogoSection>
          <LogoAvatar src={appLogo} alt="IPD Now Tool Box" />
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mt: 2, 
              fontWeight: 700,
              color: '#027B41',
            }}
          >
            IPD Now Tool Box
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Private Database Manager
          </Typography>
        </LogoSection>
        
        <FormSection>
          <StyledFormControl fullWidth variant="outlined">
            <Select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              displayEmpty
              IconComponent={(props) => (
                <KeyboardArrowDown {...props} sx={{ color: 'primary.main', right: 8 }} />
              )}
              startAdornment={
                <InputAdornment position="start">
                  <HealthAndSafety color="primary" />
                </InputAdornment>
              }
            >
              {availableNames.map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </StyledFormControl>

          <StyledTextField
            fullWidth
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            placeholder="Enter your password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <HealthButton
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            disableElevation
            endIcon={<MedicalServices fontSize="small" />}
          >
            Sign In
          </HealthButton>
        </FormSection>
      </StyledPaper>
    </LoginWrapper>
  );
};

export default Login;