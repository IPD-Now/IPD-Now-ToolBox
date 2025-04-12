import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Popover
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

const NotificationsList = ({ notifications, refreshNotifications }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDatePickerClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDatePickerClose = () => {
    setAnchorEl(null);
  };

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const open = Boolean(anchorEl);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply date filter
    if (selectedDate) {
      const selectedTimestamp = selectedDate.valueOf();
      filtered = filtered.filter(notification => {
        const notificationDate = notification.timestamp.toDate().getTime();
        // Compare only the date part (ignore time)
        const notificationDateOnly = new Date(notificationDate).setHours(0,0,0,0);
        const selectedDateOnly = new Date(selectedTimestamp).setHours(0,0,0,0);
        return notificationDateOnly === selectedDateOnly;
      });
    }

    // Apply text search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(notification => {
        const content = notification.content?.toLowerCase() || '';
        const id = notification.id?.toLowerCase() || '';
        return content.includes(query) || id.includes(query);
      });
    }

    return filtered;
  }, [notifications, searchQuery, selectedDate]);

  if (!notifications || notifications.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '200px',
        color: 'text.secondary'
      }}>
        <Typography variant="h6">No notifications available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: 1
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by message ID or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (searchQuery || selectedDate) && (
              <InputAdornment position="end">
                {selectedDate && (
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ mr: 1, cursor: 'pointer' }}
                    onClick={handleDatePickerClick}
                  >
                    {selectedDate.format('DD/MM/YYYY')}
                  </Typography>
                )}
                <IconButton 
                  size="small"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDate(null);
                  }}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <IconButton 
          onClick={handleDatePickerClick}
          color={selectedDate ? 'primary' : 'default'}
        >
          <CalendarTodayIcon />
        </IconButton>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleDatePickerClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 2 }}>
              <DateTimePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newDate) => {
                  setSelectedDate(newDate);
                  handleDatePickerClose();
                }}
                slotProps={{
                  textField: {
                    size: "medium",
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon color="action" />
                        </InputAdornment>
                      )
                    }
                  }
                }}
              />
            </Box>
          </Popover>
        </LocalizationProvider>
      </Paper>

      <Grid container spacing={3}>
        {filteredNotifications
          .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
          .map((notification) => (
          <Grid item xs={12} sm={6} md={4} key={notification.id}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  color: 'primary.main',
                  fontSize: '1.1rem'
                }}
              >
                {notification.id}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2,
                  flexGrow: 1,
                  color: 'text.secondary',
                  lineHeight: 1.6
                }}
              >
                {notification.content || 'No content available'}
              </Typography>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.disabled',
                  fontSize: '0.75rem',
                  display: 'block',
                  textAlign: 'right'
                }}
              >
                {notification.timestamp.toDate().toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NotificationsList; 