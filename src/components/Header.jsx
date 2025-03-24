import { AppBar, Toolbar, Typography, Box, Container, Button, IconButton, useMediaQuery, Avatar, Chip } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { ExitToApp as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import appLogo from '../assets/applogo.jpeg';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.primary.main, 0.02)})`,
  boxShadow: '0px 4px 10px rgba(16, 24, 40, 0.06), 0px 1px 3px rgba(16, 24, 40, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  borderBottomLeftRadius: 16, 
  borderBottomRightRadius: 16,
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  width: '100%',
  margin: 0,
  padding: 0,
  left: 0,
  right: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: '100%',
    height: 2,
    background: alpha(theme.palette.primary.main, 0.2),
    borderRadius: 4,
    opacity: 0.5,
  }
}));

const LogoImage = styled('img')(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  objectFit: 'cover',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
  }
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.6rem',
  letterSpacing: '-0.02em',
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  textShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  '& span': {
    color: theme.palette.text.primary,
    fontWeight: 600,
    position: 'relative',
    marginLeft: '4px',
  },
}));

const LogoAccent = styled('span')({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '0px',
    left: 0,
    width: '100%',
    height: '2px',
    background: 'currentColor',
    opacity: 0.7,
    borderRadius: '1px',
  },
});

const UserChip = styled(Chip)(({ theme }) => ({
  height: 38,
  borderRadius: 19,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginRight: theme.spacing(2),
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
  },
  '& .MuiChip-avatar': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.main,
  },
  '& .MuiChip-label': {
    padding: '0 12px',
  }
}));

const Header = ({ isAuthenticated, userName, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledAppBar position="sticky" color="default" elevation={0}>
      <Box sx={{ width: '100%', px: { xs: 1.5, sm: 2.5 } }}>
        <Toolbar sx={{ px: 0, height: 76, justifyContent: 'space-between' }}>
          <LogoContainer>
            <LogoImage src={appLogo} alt="IPD Now ToolBox" />
            <Logo variant="h1" component="div">
              IPD<LogoAccent>Now</LogoAccent>
              <span>ToolBox</span>
            </Logo>
          </LogoContainer>

          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && userName && (
                <UserChip
                  avatar={<Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.15) }}><PersonIcon fontSize="small" /></Avatar>}
                  label={userName}
                  variant="outlined"
                  size="medium"
                />
              )}
              
              {isMobile ? (
                <IconButton 
                  color="primary" 
                  onClick={onLogout}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(3, 123, 65, 0.08)',
                    '&:hover': { 
                      bgcolor: 'rgba(3, 123, 65, 0.15)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  onClick={onLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ 
                    borderRadius: 10, 
                    px: 2.5,
                    py: 0.8,
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
                    }
                  }}
                >
                  Sign Out
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Box>
    </StyledAppBar>
  );
};

export default Header;