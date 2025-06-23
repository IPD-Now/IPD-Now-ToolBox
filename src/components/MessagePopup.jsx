import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Fab,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ButtonGroup,
  Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MessageIcon from '@mui/icons-material/Message';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs, setDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

const MessagePopup = ({ refreshNotifications, onUnlock }) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const textFieldRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMessage('');
  };
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const insertUserName = () => {
    const textField = textFieldRef.current;
    if (textField) {
      const start = textField.selectionStart;
      const end = textField.selectionEnd;
      const text = message;
      const newText = text.substring(0, start) + "{UserName}" + text.substring(end);
      setMessage(newText);
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        textField.selectionStart = start + 10; // length of "{UserName}"
        textField.selectionEnd = start + 10;
        textField.focus();
      }, 0);
    }
    handleMenuClose();
  };

  const getNextMessageNumber = async () => {
    const messagesRef = collection(db, 'notifications');
    const q = query(messagesRef, orderBy('messageNumber', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    let nextNumber = 1;
    if (!querySnapshot.empty) {
      const lastMessage = querySnapshot.docs[0].data();
      nextNumber = (lastMessage.messageNumber || 0) + 1;
    }
    return nextNumber;
  };

  const handleSendClick = async () => {
    if (!message.trim()) return;

    if (message.trim().toLowerCase() === 'unlock') {
      onUnlock();
      handleClose();
      return;
    }
    
    setConfirmOpen(true);
  };
  
  const handleConfirmSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setConfirmOpen(false);

    try {
      const nextNumber = await getNextMessageNumber();
      const messageId = `Message${nextNumber}`;
      
      await setDoc(doc(db, 'notifications', messageId), {
        content: message.trim(),
        timestamp: new Date(),
        messageNumber: nextNumber
      });

      handleClose();
      
      await refreshNotifications();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="send message"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 80,
          height: 80,
          '& .MuiSvgIcon-root': {
            fontSize: 36
          }
        }}
      >
        <MessageIcon />
      </Fab>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <MessageIcon color="primary" />
            <Typography variant="h6">Send Message</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            inputRef={textFieldRef}
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="outlined"
            onClick={handleMenuOpen}
            endIcon={<ArrowDropDownIcon />}
            disabled={loading}
          >
            Insert Variable
          </Button>
          <Button
            variant="contained"
            onClick={handleSendClick}
            disabled={loading || !message.trim()}
            startIcon={<SendIcon />}
          >
            Send Message
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={insertUserName}>
               {"{UserName}"}
            </MenuItem>
          </Menu>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Broadcast Message
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to send this message to all users?
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'action.hover', whiteSpace: 'pre-wrap' }}>
            <Typography>{message}</Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSend} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Sending...' : 'Confirm Send'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MessagePopup; 