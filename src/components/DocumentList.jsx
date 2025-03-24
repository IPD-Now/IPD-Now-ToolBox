import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Fade,
  Chip,
  Tooltip,
  IconButton,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField as MuiTextField,
  Divider,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CircularProgress,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  PhoneEnabled as PhoneEnabledIcon,
  Image as ImageIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Key as KeyIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Add as AddIcon,
  LocalHospital as HospitalIcon,
  Home as HomeIcon,
  Place as PlaceIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { collection, doc, deleteDoc, updateDoc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Styled Components
const FilterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3.5),
  gap: theme.spacing(2.5),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(2),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  border: 'none',
  transition: 'all 0.25s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 2.5, 0),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const CardBody = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2, 2.5, 2.5),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const CardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2.5, 2.5),
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 'auto',
}));

const HospitalLogo = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.25),
  marginTop: theme.spacing(1.75),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  color: theme.palette.primary.main,
  flexShrink: 0,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
    '&:hover': {
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
      borderColor: alpha(theme.palette.primary.main, 0.3),
    },
    '&.Mui-focused': {
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
      borderColor: theme.palette.primary.main,
    },
  },
  '& fieldset': {
    borderWidth: 0,
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    fontSize: '0.95rem',
  },
}));

const StyledActionButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  borderRadius: 8,
  padding: theme.spacing(0.75, 1),
  fontWeight: 500,
  fontSize: '0.75rem',
  textTransform: 'none',
  boxShadow: 'none',
  '&.edit-button': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    }
  },
  '&.password-button': {
    backgroundColor: alpha(theme.palette.info.main, 0.1),
    color: theme.palette.info.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.info.main, 0.2),
    }
  },
  '&.delete-button': {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.main, 0.2),
    }
  }
}));

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 6,
  },
}));

// Add a styled Select component
const StyledSortSelect = styled(Select)(({ theme }) => ({
  borderRadius: 12,
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
    '&:hover': {
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
      borderColor: alpha(theme.palette.primary.main, 0.3),
    },
    '&.Mui-focused': {
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    fontSize: '0.95rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.divider, 0.8),
    borderWidth: 1,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
  },
}));

// Main Component
const DocumentList = ({ documents, onDocumentDeleted, onDocumentUpdated }) => {
  const theme = useTheme();
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [finalConfirmDialogOpen, setFinalConfirmDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [hospitalToDelete, setHospitalToDelete] = useState(null);
  const [hospitalToEdit, setHospitalToEdit] = useState(null);
  const [editedHospital, setEditedHospital] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Password states
  const [showPasswordDialogOpen, setShowPasswordDialogOpen] = useState(false);
  const [passwordConfirmDialogOpen, setPasswordConfirmDialogOpen] = useState(false);
  const [finalPasswordConfirmDialogOpen, setFinalPasswordConfirmDialogOpen] = useState(false);
  const [passwordConfirmText, setPasswordConfirmText] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hospitalForPassword, setHospitalForPassword] = useState(null);
  
  // Create Hospital states
  const [createHospitalOpen, setCreateHospitalOpen] = useState(false);
  const [placeIdDialogOpen, setPlaceIdDialogOpen] = useState(false);
  const [placeId, setPlaceId] = useState('');
  const [createHospitalStep, setCreateHospitalStep] = useState(0);
  const [newHospital, setNewHospital] = useState({
    placeId: '',
    fullAddress: '',
    logoURL: '',
    name: '',
    phoneNumber: '',
    masterPassword: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const filteredAndSortedDocs = documents
    .filter((doc) =>
      (doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.placeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fullAddress?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'title') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'date') {
        return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      }
      return 0;
    });

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  // Delete functions
  const handleDeleteClick = (hospital) => {
    setHospitalToDelete(hospital);
    setDeleteDialogOpen(true);
    setConfirmText('');
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setHospitalToDelete(null);
    setConfirmText('');
  };

  const handleConfirmTextChange = (e) => {
    setConfirmText(e.target.value);
  };

  const handleFirstConfirmation = () => {
    if (confirmText === "Yes Delete") {
      setDeleteDialogOpen(false);
      setFinalConfirmDialogOpen(true);
    }
  };

  const handleFinalConfirmationClose = () => {
    setFinalConfirmDialogOpen(false);
  };

  const handleFinalDelete = async () => {
    if (!hospitalToDelete) return;
    
    try {
      setIsDeleting(true);
      const hospitalRef = doc(db, 'hospitals', hospitalToDelete.id);
      await deleteDoc(hospitalRef);
      
      // Inform the parent component about the deletion
      if (onDocumentDeleted) {
        onDocumentDeleted(hospitalToDelete.id);
      }

      // Close the dialog
      setFinalConfirmDialogOpen(false);
      setHospitalToDelete(null);
    } catch (error) {
      console.error("Error deleting hospital:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Edit functions
  const handleEditClick = (hospital) => {
    setHospitalToEdit(hospital);
    setEditedHospital({
      name: hospital.name || '',
      fullAddress: hospital.fullAddress || '',
      phoneNumber: hospital.phoneNumber || '',
      logoURL: hospital.logoURL || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setHospitalToEdit(null);
    setEditedHospital({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedHospital(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!hospitalToEdit) return;
    
    try {
      setIsSaving(true);
      const hospitalRef = doc(db, 'hospitals', hospitalToEdit.id);
      await updateDoc(hospitalRef, editedHospital);
      
      // Inform the parent component about the update
      if (onDocumentUpdated) {
        onDocumentUpdated(hospitalToEdit.id, {
          ...hospitalToEdit,
          ...editedHospital
        });
      }

      // Close the dialog
      handleEditDialogClose();
    } catch (error) {
      console.error("Error updating hospital:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Password functions
  const handleShowPasswordClick = (hospital) => {
    setHospitalForPassword(hospital);
    setPasswordConfirmText('');
    setShowPasswordDialogOpen(true);
  };

  const handlePasswordConfirmTextChange = (e) => {
    setPasswordConfirmText(e.target.value);
  };

  const handleShowPasswordConfirmation = () => {
    if (passwordConfirmText === "Yes Show") {
      setShowPasswordDialogOpen(false);
      setFinalPasswordConfirmDialogOpen(true);
    }
  };

  const handleFinalPasswordConfirmationClose = () => {
    setFinalPasswordConfirmDialogOpen(false);
    setPasswordConfirmText('');
    setHospitalForPassword(null);
  };

  const handleFinalPasswordConfirmation = async () => {
    if (!hospitalForPassword) return;
    
    setFinalPasswordConfirmDialogOpen(false);
    setIsPasswordLoading(true);
    
    try {
      // Get master password from Firebase
      const passwordRef = doc(db, 'hospitals', hospitalForPassword.id);
      const hospitalDoc = await getDoc(passwordRef);
      
      if (hospitalDoc.exists() && hospitalDoc.data().masterPassword) {
        setMasterPassword(hospitalDoc.data().masterPassword);
      } else {
        // Create default password if it doesn't exist
        const defaultPassword = '@Bachgayeguru2006';
        await updateDoc(passwordRef, { masterPassword: defaultPassword });
        setMasterPassword(defaultPassword);
      }
      
      setPasswordDialogOpen(true);
    } catch (error) {
      console.error("Error fetching password:", error);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setMasterPassword('');
    setShowPassword(false);
  };

  const handleChangePasswordClick = () => {
    setPasswordDialogOpen(false);
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setChangePasswordDialogOpen(true);
  };

  const handleChangePasswordDialogClose = () => {
    setChangePasswordDialogOpen(false);
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmNewPassword(value);
    }
  };

  const handleSavePassword = async () => {
    if (!hospitalForPassword) return;
    
    if (!newPassword.trim()) {
      setPasswordError('Password cannot be empty');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setIsPasswordLoading(true);
    try {
      // Update password in Firebase
      const hospitalRef = doc(db, 'hospitals', hospitalForPassword.id);
      await updateDoc(hospitalRef, { masterPassword: newPassword });
      
      setChangePasswordDialogOpen(false);
      setPasswordError('');
      setNewPassword('');
      setConfirmNewPassword('');
      setMasterPassword(newPassword);
      setPasswordDialogOpen(true);
      
      // Show success in a snackbar if needed
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError('Failed to update password');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Create Hospital functions
  const handleCreateHospitalClick = () => {
    setPlaceIdDialogOpen(true);
  };

  const handlePlaceIdDialogClose = () => {
    setPlaceIdDialogOpen(false);
    setPlaceId('');
  };

  const handlePlaceIdChange = (e) => {
    setPlaceId(e.target.value);
  };

  const handlePlaceIdSubmit = async () => {
    if (!placeId.trim()) {
      setCreateError('Place ID is required');
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Create a document in Firebase with place ID as the document ID
      const docRef = doc(db, 'hospitals', placeId.trim());
      
      // Check if a document with this ID already exists
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCreateError('A hospital with this Place ID already exists.');
        setIsCreating(false);
        return;
      }
      
      // Set initial data - just the place ID
      await setDoc(docRef, {
        placeId: placeId.trim(),
        createdAt: new Date()
      });
      
      // Store the data in local state
      setNewHospital({
        id: placeId.trim(),
        placeId: placeId.trim(),
        name: '',
        fullAddress: '',
        logoURL: '',
        phoneNumber: '',
        masterPassword: ''
      });
      
      // Reset the place ID dialog
      setPlaceIdDialogOpen(false);
      setPlaceId('');
      
      // Start the step-by-step form from the first step (Address)
      setCreateHospitalStep(0);
      setCreateHospitalOpen(true);
      setIsCreating(false);
      
    } catch (error) {
      console.error("Error creating initial hospital record:", error);
      setCreateError('Failed to create hospital. Please try again.');
      setIsCreating(false);
    }
  };

  const handleSaveNewHospital = async () => {
    try {
      setIsCreating(true);
      setCreateError('');
      
      // Validate the required fields
      if (!newHospital.fullAddress) {
        setCreateError('Address is required');
        setIsCreating(false);
        return;
      }
      
      if (!newHospital.name) {
        setCreateError('Hospital name is required');
        setIsCreating(false);
        return;
      }
      
      if (!newHospital.masterPassword) {
        setCreateError('Master password is required');
        setIsCreating(false);
        return;
      }
      
      // Update the existing document created with place ID
      const hospitalRef = doc(db, 'hospitals', newHospital.id);
      
      // Update with all the collected fields
      await updateDoc(hospitalRef, {
        name: newHospital.name,
        fullAddress: newHospital.fullAddress,
        logoURL: newHospital.logoURL || '',
        phoneNumber: newHospital.phoneNumber || '',
        masterPassword: newHospital.masterPassword,
        updatedAt: new Date()
      });
      
      // Close the dialog and reset form
      setCreateHospitalOpen(false);
      setCreateHospitalStep(0);
      setNewHospital({
        placeId: '',
        fullAddress: '',
        logoURL: '',
        name: '',
        phoneNumber: '',
        masterPassword: ''
      });
      setCreateError('');
      
      // Refresh the documents list
      if (onDocumentUpdated) {
        onDocumentUpdated(null, null, true);
      }
      
    } catch (error) {
      console.error("Error updating hospital:", error);
      setCreateError('Failed to update hospital. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Update the handleCreateHospitalDialogClose to not need to check for partial records
  const handleCreateHospitalDialogClose = async () => {
    // If we have a hospital ID but not all required fields, delete the partial record
    if (newHospital.id) {
      try {
        // Delete the document since the user cancelled
        const hospitalRef = doc(db, 'hospitals', newHospital.id);
        await deleteDoc(hospitalRef);
      } catch (error) {
        console.error("Error cleaning up incomplete hospital record:", error);
      }
    }
    
    setCreateHospitalOpen(false);
    setCreateHospitalStep(0);
    setNewHospital({
      placeId: '',
      fullAddress: '',
      logoURL: '',
      name: '',
      phoneNumber: '',
      masterPassword: ''
    });
    setCreateError('');
  };

  const handleCreateHospitalChange = (e) => {
    const { name, value } = e.target;
    setNewHospital(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateHospitalNextStep = () => {
    // Validate current step
    if (createHospitalStep === 0 && !newHospital.fullAddress.trim()) {
      setCreateError('Full Address is required');
      return;
    } else if (createHospitalStep === 2 && !newHospital.name.trim()) {
      setCreateError('Hospital Name is required');
      return;
    } else if (createHospitalStep === 4 && !newHospital.masterPassword.trim()) {
      setCreateError('Master Password is required');
      return;
    } else {
      setCreateError('');
    }
    
    // Move to next step or save if last step
    if (createHospitalStep < 4) {
      setCreateHospitalStep(prev => prev + 1);
    } else {
      handleSaveNewHospital();
    }
  };

  const handleCreateHospitalPrevStep = () => {
    if (createHospitalStep > 0) {
      setCreateHospitalStep(prev => prev - 1);
      setCreateError('');
    } else {
      handleCreateHospitalDialogClose();
    }
  };

  // Get form fields for current step
  const getCreateHospitalStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                Enter Hospital Address
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please provide the complete address of the hospital.
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                mb: 2
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>How to find this:</strong> Open the link below in a new tab to see the hospital details:
                </Typography>
                <Link 
                  href={`https://www.google.com/maps/place/?q=place_id:${newHospital.placeId}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'block', wordBreak: 'break-all', fontSize: '0.8rem', mb: 1 }}
                >
                  https://www.google.com/maps/place/?q=place_id:{newHospital.placeId}
                </Link>
                <Typography variant="body2" color="text.secondary">
                  Copy the complete address displayed on Google Maps.
                </Typography>
              </Box>
            </Box>
            <MuiTextField
              fullWidth
              label="Full Address"
              name="fullAddress"
              value={newHospital.fullAddress}
              onChange={handleCreateHospitalChange}
              variant="outlined"
              margin="normal"
              required
              error={createError && !newHospital.fullAddress}
              helperText={createError && !newHospital.fullAddress ? createError : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      case 1:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                Add Hospital Logo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Provide a URL to the hospital's logo image.
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                mb: 2
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>How to find this:</strong> Check the hospital's official website or:
                </Typography>
                <Link 
                  href={`https://www.google.com/maps/place/?q=place_id:${newHospital.placeId}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'block', wordBreak: 'break-all', fontSize: '0.8rem', mb: 1 }}
                >
                  https://www.google.com/maps/place/?q=place_id:{newHospital.placeId}
                </Link>
                <Typography variant="body2" color="text.secondary">
                  From Google Maps, you can view the hospital's photos and right-click on their logo to copy the image URL.
                </Typography>
              </Box>
            </Box>
            <MuiTextField
              fullWidth
              label="Logo URL"
              name="logoURL"
              value={newHospital.logoURL}
              onChange={handleCreateHospitalChange}
              variant="outlined"
              margin="normal"
              placeholder="Paste a direct link to an image (optional)"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              helperText="Leave blank if no logo is available"
            />
            {newHospital.logoURL && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Logo Preview:</Typography>
                <Box 
                  component="img" 
                  src={newHospital.logoURL}
                  alt="Logo Preview"
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDIxIDE4IDMgMTggMyAyMSI+PC9wb2x5bGluZT48cGF0aCBkPSJtMTQgMTQgNy04Ij48L3BhdGg+PC9zdmc+';
                  }}
                />
              </Box>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                Enter Hospital Name
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Provide the official name of the hospital. The Place ID is set as the initial name.
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                mb: 2
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>How to find this:</strong> The hospital name is displayed prominently on Google Maps:
                </Typography>
                <Link 
                  href={`https://www.google.com/maps/place/?q=place_id:${newHospital.placeId}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'block', wordBreak: 'break-all', fontSize: '0.8rem', mb: 1 }}
                >
                  https://www.google.com/maps/place/?q=place_id:{newHospital.placeId}
                </Link>
                <Typography variant="body2" color="text.secondary">
                  Use the exact name as shown at the top of the Google Maps page.
                </Typography>
              </Box>
            </Box>
            <MuiTextField
              fullWidth
              label="Hospital Name"
              name="name"
              value={newHospital.name}
              onChange={handleCreateHospitalChange}
              variant="outlined"
              margin="normal"
              required
              error={createError && !newHospital.name}
              helperText={createError && !newHospital.name ? createError : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HospitalIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      case 3:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                Add Phone Number
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Provide a contact phone number for the hospital.
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                mb: 2
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>How to find this:</strong> Look for the phone number in the information panel on Google Maps:
                </Typography>
                <Link 
                  href={`https://www.google.com/maps/place/?q=place_id:${newHospital.placeId}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'block', wordBreak: 'break-all', fontSize: '0.8rem', mb: 1 }}
                >
                  https://www.google.com/maps/place/?q=place_id:{newHospital.placeId}
                </Link>
                <Typography variant="body2" color="text.secondary">
                  The phone number is usually listed under "Phone" in the sidebar information.
                </Typography>
              </Box>
            </Box>
            <MuiTextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={newHospital.phoneNumber}
              onChange={handleCreateHospitalChange}
              variant="outlined"
              margin="normal"
              placeholder="Enter phone number (optional)"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              helperText="Leave blank if no phone number is available"
            />
          </>
        );
      case 4:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                Create Master Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create a secure password to protect access to this hospital's information.
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                mb: 2
              }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Important:</strong> This password will be used to access and manage sensitive information for {newHospital.name || 'this hospital'}. Create a secure password you can remember.
                </Typography>
              </Box>
            </Box>
            <MuiTextField
              fullWidth
              label="Master Password"
              name="masterPassword"
              value={newHospital.masterPassword}
              onChange={handleCreateHospitalChange}
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              required
              error={createError && !newHospital.masterPassword}
              helperText={createError && !newHospital.masterPassword ? createError : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Initialize the map with Places autocomplete
  const initializePlacesMap = () => {
    // Not needed in the simplified approach
  };

  // Load Google Maps API
  useEffect(() => {
    // Not needed in the simplified approach
  }, [placeIdDialogOpen]);

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      pt: 2,
      px: { xs: 2, sm: 3 },
      pb: { xs: 2, sm: 3 },
      overflow: 'auto',
      margin: 0
    }}>
      <FilterBox>
        <SearchField
          fullWidth
          variant="outlined"
          placeholder="Search by name, place ID, address or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ 
              fontWeight: 500, 
              '&.Mui-focused': { 
                color: theme.palette.primary.main,
                fontWeight: 600
              },
            }}>
              Sort By
            </InputLabel>
            <StyledSortSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              MenuProps={{
                PaperProps: {
                  elevation: 3,
                  style: {
                    borderRadius: '12px',
                    marginTop: '8px'
                  },
                  sx: {
                    "& .MuiList-root": {
                      padding: '8px',
                      borderRadius: '12px'
                    },
                    "& .MuiMenuItem-root": {
                      borderRadius: '8px',
                      margin: '2px 0'
                    }
                  }
                }
              }}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SortIcon fontSize="small" />
                  {value === 'title' ? 'Name' : 'Last Updated'}
                </Box>
              )}
            >
              <MenuItem 
                value="title" 
                sx={{ 
                  fontWeight: 500,
                  py: 1.25,
                  px: 2,
                  borderRadius: 6,
                  mx: 0.5,
                  my: 0.25,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    }
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                Name
              </MenuItem>
              <MenuItem 
                value="date" 
                sx={{ 
                  fontWeight: 500,
                  py: 1.25,
                  px: 2,
                  borderRadius: 6,
                  mx: 0.5,
                  my: 0.25,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    }
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                Last Updated
              </MenuItem>
            </StyledSortSelect>
          </FormControl>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateHospitalClick}
            sx={{ 
              borderRadius: 12, 
              fontWeight: 600,
              whiteSpace: 'nowrap',
              px: 2.5,
              py: 1.25,
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Create Hospital
          </Button>
        </Box>
      </FilterBox>

      <Grid container spacing={2.5}>
        {filteredAndSortedDocs.length === 0 ? (
          <Box sx={{ py: 8, width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No hospitals found matching your search
            </Typography>
          </Box>
        ) : (
          filteredAndSortedDocs.map((doc, index) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <Fade in timeout={300} style={{ transitionDelay: `${index * 40}ms` }}>
                <StyledCard>
                  <CardHeader>
                    {doc.logoURL ? (
                      <HospitalLogo>
                        <Box
                          component="img"
                          src={doc.logoURL}
                          alt={doc.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </HospitalLogo>
                    ) : (
                      <HospitalLogo>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {doc.name ? doc.name.charAt(0).toUpperCase() : 'H'}
                        </Typography>
                      </HospitalLogo>
                    )}
                    <Box sx={{ overflow: 'hidden', width: '100%' }}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          lineHeight: 1.3,
                          mb: 0.75,
                          color: 'text.primary',
                          textAlign: 'left',
                          wordBreak: 'break-word'
                        }}
                      >
                        {doc.name || 'Unnamed Hospital'}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          lineHeight: 1.4,
                          color: theme.palette.primary.main,
                          opacity: 0.7,
                          textAlign: 'left',
                          display: 'block',
                          width: '100%',
                          pb: 0.5
                        }}
                      >
                        Place ID: {doc.id}
                      </Typography>
                    </Box>
                  </CardHeader>

                  <CardBody>
                    {doc.fullAddress && (
                      <InfoItem>
                        <IconWrapper>
                          <LocationIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                        </IconWrapper>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            textAlign: 'left',
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                          }}
                        >
                          {doc.fullAddress}
                        </Typography>
                      </InfoItem>
                    )}
                    
                    <InfoItem>
                      <IconWrapper>
                        <PhoneIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                      </IconWrapper>
                      {doc.phoneNumber ? (
                        <Typography 
                          variant="body2"
                          sx={{ 
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'text.primary',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          {doc.phoneNumber}
                        </Typography>
                      ) : (
                        <Typography 
                          variant="body2"
                          sx={{ 
                            fontSize: '0.875rem',
                            fontStyle: 'italic',
                            color: 'text.secondary',
                            textAlign: 'left'
                          }}
                        >
                          Not Given
                        </Typography>
                      )}
                    </InfoItem>
                  </CardBody>

                  <Divider sx={{ opacity: 0.4, mt: 0.5, mb: 1 }} />

                  <CardActions className="card-actions">
                    <StyledActionButton
                      className="edit-button"
                      onClick={() => handleEditClick(doc)}
                      startIcon={<EditIcon fontSize="small" />}
                    >
                      Edit
                    </StyledActionButton>
                    <StyledActionButton
                      className="password-button"
                      onClick={() => handleShowPasswordClick(doc)}
                      startIcon={<KeyIcon fontSize="small" />}
                    >
                      Password
                    </StyledActionButton>
                    <StyledActionButton
                      className="delete-button"
                      onClick={() => handleDeleteClick(doc)}
                      startIcon={<DeleteIcon fontSize="small" />}
                    >
                      Delete
                    </StyledActionButton>
                  </CardActions>
                </StyledCard>
              </Fade>
            </Grid>
          ))
        )}
      </Grid>

      {/* Delete Confirmation Dialogs */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ 
          fontWeight: 600, 
          fontSize: '1.2rem', 
          color: 'error.main',
          pb: 1
        }}>
          Delete Hospital
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: '0.95rem' }}>
            You are about to delete <strong>{hospitalToDelete?.name}</strong>. This action cannot be undone.
            To confirm, please type <strong>"Yes Delete"</strong> in the box below:
          </DialogContentText>
          <MuiTextField
            autoFocus
            fullWidth
            value={confirmText}
            onChange={handleConfirmTextChange}
            variant="outlined"
            placeholder="Yes Delete"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                borderColor: alpha('#ef4444', 0.3),
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'error.main',
                  borderWidth: 2,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleDeleteDialogClose} 
            variant="outlined" 
            sx={{ 
              borderRadius: 1.5,
              color: 'text.secondary',
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFirstConfirmation} 
            color="error" 
            variant="contained"
            disabled={confirmText !== "Yes Delete"}
            sx={{ 
              borderRadius: 1.5,
              px: 3
            }}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Final Delete Confirmation Dialog */}
      <Dialog
        open={finalConfirmDialogOpen}
        onClose={handleFinalConfirmationClose}
        aria-labelledby="final-confirm-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle id="final-confirm-dialog-title" sx={{ 
          fontWeight: 600, 
          fontSize: '1.2rem', 
          color: 'error.main',
          pb: 1
        }}>
          Are You Sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: '0.95rem' }}>
            This is your final confirmation. <strong>{hospitalToDelete?.name}</strong> will be permanently deleted from the database.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleFinalConfirmationClose} 
            variant="outlined" 
            sx={{ 
              borderRadius: 1.5,
              color: 'text.secondary',
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFinalDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
            sx={{ 
              borderRadius: 1.5,
              px: 3
            }}
          >
            {isDeleting ? "Deleting..." : "Delete Hospital"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Hospital Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="edit-dialog-title"
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle id="edit-dialog-title" sx={{ 
          fontWeight: 600, 
          fontSize: '1.2rem',
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon fontSize="small" />
            Edit Hospital Details
          </Box>
          <IconButton size="small" onClick={handleEditDialogClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <StyledTextField
              fullWidth
              name="name"
              label="Hospital Name"
              variant="outlined"
              value={editedHospital.name || ''}
              onChange={handleEditChange}
              autoFocus
            />

            <StyledTextField
              fullWidth
              name="fullAddress"
              label="Address"
              variant="outlined"
              value={editedHospital.fullAddress || ''}
              onChange={handleEditChange}
              multiline
              rows={2}
            />

            <StyledTextField
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              variant="outlined"
              value={editedHospital.phoneNumber || ''}
              onChange={handleEditChange}
              placeholder="Enter phone number"
            />

            <StyledTextField
              fullWidth
              name="logoURL"
              label="Logo URL"
              variant="outlined"
              value={editedHospital.logoURL || ''}
              onChange={handleEditChange}
              placeholder="Paste image URL for logo"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              helperText="Paste a direct link to an image for the hospital logo"
            />

            {editedHospital.logoURL && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Logo Preview:</Typography>
                <Box 
                  component="img" 
                  src={editedHospital.logoURL}
                  alt="Logo Preview"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDIxIDE4IDMgMTggMyAyMSI+PC9wb2x5bGluZT48cGF0aCBkPSJtMTQgMTQgNy04Ij48L3BhdGg+PC9zdmc+';
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleEditDialogClose} 
            variant="outlined" 
            sx={{ 
              borderRadius: 1.5,
              color: 'text.secondary',
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            color="primary" 
            variant="contained"
            disabled={isSaving}
            startIcon={<SaveIcon />}
            sx={{ 
              borderRadius: 1.5,
              px: 3
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Confirmation Dialog */}
      <Dialog
        open={showPasswordDialogOpen}
        onClose={() => setShowPasswordDialogOpen(false)}
        aria-labelledby="password-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle id="password-dialog-title" sx={{ 
          fontWeight: 600, 
          fontSize: '1.2rem', 
          color: 'primary.main',
          pb: 1
        }}>
          Confirm Access to {hospitalForPassword?.name || 'Hospital'} Password
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: '0.95rem' }}>
            You are about to view the master password for <strong>{hospitalForPassword?.name || 'this hospital'}</strong>. To confirm, please type <strong>"Yes Show"</strong> in the box below:
          </DialogContentText>
          <MuiTextField
            autoFocus
            fullWidth
            value={passwordConfirmText}
            onChange={handlePasswordConfirmTextChange}
            variant="outlined"
            placeholder="Yes Show"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowPasswordDialogOpen(false)} 
            variant="outlined" 
            sx={{ 
              borderRadius: 1.5,
              color: 'text.secondary',
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleShowPasswordConfirmation} 
            color="primary" 
            variant="contained"
            disabled={passwordConfirmText !== "Yes Show"}
            sx={{ 
              borderRadius: 1.5,
              px: 3
            }}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Final Password Confirmation Dialog */}
      <Dialog
        open={finalPasswordConfirmDialogOpen}
        onClose={handleFinalPasswordConfirmationClose}
        aria-labelledby="final-password-confirm-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle id="final-password-confirm-dialog-title" sx={{ 
          fontWeight: 600, 
          fontSize: '1.2rem', 
          color: 'primary.main',
          pb: 1
        }}>
          Final Confirmation - {hospitalForPassword?.name || 'Hospital'} Password
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: '0.95rem' }}>
            This is your final confirmation. You are about to view the master password for <strong>{hospitalForPassword?.name || 'this hospital'}</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleFinalPasswordConfirmationClose} 
            variant="outlined" 
            sx={{ 
              borderRadius: 1.5,
              color: 'text.secondary',
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFinalPasswordConfirmation} 
            color="primary" 
            variant="contained"
            disabled={isPasswordLoading}
            sx={{ 
              borderRadius: 1.5,
              px: 3
            }}
          >
            {isPasswordLoading ? "Loading..." : "Show Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={handlePasswordDialogClose}
        aria-labelledby="view-password-dialog-title"
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle id="view-password-dialog-title" sx={{ 
          fontWeight: 600, 
          fontSize: '1.2rem',
          color: 'primary.main',
          pb: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <LockIcon fontSize="small" />
            {hospitalForPassword?.name || 'Hospital'} Password
          </Box>
          <IconButton size="small" onClick={handlePasswordDialogClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ 
          pt: 2, 
          pb: 2, 
          px: 3, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <MuiTextField
            fullWidth
            value={masterPassword}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            label="Master Password"
            margin="normal"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleChangePasswordClick} 
            variant="outlined" 
            color="primary"
            startIcon={<KeyIcon />}
            sx={{ 
              borderRadius: 1.5,
            }}
          >
            Change Password
          </Button>
          <Button 
            onClick={handlePasswordDialogClose} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: 1.5,
              px: 3
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordDialogOpen}
        onClose={handleChangePasswordDialogClose}
        aria-labelledby="change-password-dialog-title"
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle id="change-password-dialog-title" sx={{ 
          fontWeight: 600, 
          fontSize: '1.2rem',
          color: 'primary.main',
          pb: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <KeyIcon fontSize="small" />
            Change {hospitalForPassword?.name || 'Hospital'} Password
          </Box>
          <IconButton size="small" onClick={handleChangePasswordDialogClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1.5, px: 3, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ mb: 2, width: '100%', maxWidth: '400px' }}>
            <MuiTextField
              fullWidth
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              label="New Password"
              margin="dense"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
                '& .MuiInputLabel-root': {
                  marginTop: 0,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            />
            <MuiTextField
              fullWidth
              name="confirmPassword"
              value={confirmNewPassword}
              onChange={handlePasswordChange}
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              label="Confirm New Password"
              margin="dense"
              error={!!passwordError}
              helperText={passwordError}
              sx={{
                mt: 1.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
                '& .MuiInputLabel-root': {
                  marginTop: 0,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleChangePasswordDialogClose} 
            variant="outlined" 
            sx={{ 
              borderRadius: 1.5,
              color: 'text.secondary',
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSavePassword} 
            variant="contained" 
            color="primary"
            disabled={isPasswordLoading}
            startIcon={<SaveIcon />}
            sx={{ 
              borderRadius: 1.5,
              px: 3
            }}
          >
            {isPasswordLoading ? "Saving..." : "Save Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Place ID Dialog */}
      <Dialog
        open={placeIdDialogOpen}
        onClose={handlePlaceIdDialogClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600, 
          fontSize: '1.2rem',
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PlaceIcon fontSize="small" color="primary" />
            Enter Hospital Location
          </Box>
          <IconButton size="small" onClick={handlePlaceIdDialogClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
              How to find a Google Place ID:
            </Typography>
            <Box component="ol" sx={{ pl: 2, mb: 2 }}>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Open <Link 
                    href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ fontWeight: 500 }}
                  >
                    Google Place ID Finder
                  </Link> in a new tab
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Enter the hospital's name or address in the search box
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Click on the correct location on the map
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Copy the Place ID that appears in the infobox
                </Typography>
              </li>
            </Box>
            <Box sx={{ 
              p: 2, 
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}>
              <Typography variant="body2" color="text.secondary">
                Example Place ID: <code>ChIJN1t_tDeuEmsRUsoyG83frY4</code> (Sydney Opera House)
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <MuiTextField
              fullWidth
              label="Place ID"
              value={placeId}
              onChange={handlePlaceIdChange}
              variant="outlined"
              margin="normal"
              placeholder="Enter Place ID (e.g., ChIJN1t_tDeuEmsRUsoyG83frY4)"
              error={!!createError}
              helperText={createError || "Enter the Place ID from Google Maps"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handlePlaceIdDialogClose} 
            variant="outlined" 
            sx={{ 
              borderRadius: 1.5,
              color: 'text.secondary',
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePlaceIdSubmit} 
            color="primary" 
            variant="contained"
            disabled={!placeId.trim()}
            sx={{ 
              borderRadius: 1.5,
              px: 3
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Hospital Dialog */}
      <Dialog
        open={createHospitalOpen}
        onClose={handleCreateHospitalDialogClose}
        aria-labelledby="create-hospital-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle id="create-hospital-dialog-title" sx={{ 
          fontWeight: 600, 
          fontSize: '1.2rem',
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <HospitalIcon fontSize="small" color="primary" />
            Create New Hospital
          </Box>
          <IconButton size="small" onClick={handleCreateHospitalDialogClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={createHospitalStep} sx={{ pt: 3, pb: 4 }}>
            <Step>
              <StepLabel>Address</StepLabel>
            </Step>
            <Step>
              <StepLabel>Logo</StepLabel>
            </Step>
            <Step>
              <StepLabel>Name</StepLabel>
            </Step>
            <Step>
              <StepLabel>Phone</StepLabel>
            </Step>
            <Step>
              <StepLabel>Password</StepLabel>
            </Step>
          </Stepper>
          
          <Box sx={{ py: 2 }}>
            {getCreateHospitalStepContent(createHospitalStep)}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCreateHospitalPrevStep} 
            variant="outlined" 
            sx={{ 
              borderRadius: 1.5,
              color: 'text.secondary',
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }}
          >
            {createHospitalStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button 
            onClick={handleCreateHospitalNextStep} 
            color="primary" 
            variant="contained"
            disabled={isCreating}
            startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ 
              borderRadius: 1.5,
              px: 3
            }}
          >
            {isCreating ? 'Creating...' : (createHospitalStep === 4 ? 'Create Hospital' : 'Next')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentList;