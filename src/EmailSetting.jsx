import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box,
  IconButton,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EmailSetting = ({ 
  email,
  setEmail,
  onEmailChange,
  numberOfDaysAhead,
  setNumberOfDaysAhead,
  onNumberOfDaysAheadChange,
  disabled
  
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('emailSetting.title')}
        </Typography>
        <IconButton 
          sx={{ 
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
        <TextField
          fullWidth
          label={t('emailSetting.email')}
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          variant="outlined"
          margin="normal"
          
        />
        <FormControl fullWidth margin="normal" disabled={disabled}>
          <InputLabel>{t('emailSetting.numberOfDaysAhead')}</InputLabel>
          <Select
            value={numberOfDaysAhead}
            onChange={(e) => onNumberOfDaysAheadChange(Number(e.target.value))}
          >
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default EmailSetting;