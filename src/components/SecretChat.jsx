import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Box, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { dbChat } from '../firebase-chat.js';

const SecretChat = ({ onClose, userName, messages }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showThumbsUp, setShowThumbsUp] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await addDoc(collection(dbChat, 'secret-chat'), {
      text: newMessage,
      sender: userName,
      timestamp: serverTimestamp(),
      seenBy: [], 
    });

    setNewMessage('');
    setShowThumbsUp(true);
    setTimeout(() => {
      setShowThumbsUp(false);
    }, 3000);
  };

  const isTyping = newMessage.length > 0;

  return (
    <Paper 
      elevation={10} 
      sx={{ 
        position: 'fixed', 
        bottom: 24, 
        right: 24, 
        width: 350, 
        height: 500, 
        borderRadius: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        zIndex: 1100,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {showThumbsUp ? (
            <Typography sx={{ ml: 1.5, fontSize: '1.2rem' }}>👍</Typography>
          ) : (
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                ml: 1.5,
                transition: 'background-color 0.3s ease',
                backgroundColor: isTyping ? '#fdd835' : '#ffffff',
                '@keyframes pulse': {
                  '0%': { boxShadow: `0 0 0 0 ${isTyping ? 'rgba(253, 216, 53, 0.7)' : 'rgba(255, 255, 255, 0.7)'}` },
                  '70%': { boxShadow: `0 0 0 6px ${isTyping ? 'rgba(253, 216, 53, 0)' : 'rgba(255, 255, 255, 0)'}` },
                  '100%': { boxShadow: `0 0 0 0 ${isTyping ? 'rgba(253, 216, 53, 0)' : 'rgba(255, 255, 255, 0)'}` },
                },
                animation: 'pulse 1.5s infinite',
              }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto', bgcolor: 'grey.100' }}>
        {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'white',
                  color: 'text.primary',
                  maxWidth: '80%',
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>
            </Box>
          ))
        }
        <div ref={messagesEndRef} />
      </Box>
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 1, display: 'flex', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            '& .MuiInputBase-input': {
              color: 'transparent',
              caretColor: 'action.active',
              '&::selection': {
                color: 'transparent',
                backgroundColor: 'transparent',
              },
            },
          }}
        />
        <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default SecretChat; 