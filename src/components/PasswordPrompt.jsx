import React, { useState } from 'react';
import { Paper, Typography, Box, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PasswordPrompt = ({ onSubmit, onClose, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <Paper 
      elevation={10} 
      sx={{ 
        position: 'fixed', 
        bottom: 24, 
        right: 24, 
        width: 300, 
        p: 2,
        borderRadius: 2, 
        zIndex: 1100 
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Enter Passcode</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!error}
        helperText={error}
        size="small"
        autoFocus
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 1 }}>
        Unlock
      </Button>
    </Paper>
  );
};

export default PasswordPrompt; 