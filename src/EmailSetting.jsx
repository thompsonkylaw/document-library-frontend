import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EmailSetting = ({
  email,
  setEmail,
  numberOfDayAhead,
  setNumberOfDayAhead,
  disabled,
  hasUnsavedChanges,
  onSave,
  onTestEmail, // Added new prop to handle test email action
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('emailSetting.title')}
        </Typography>
      </Box>
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
        <TextField
          fullWidth
          label={t('emailSetting.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          disabled={true}
        />
        <FormControl fullWidth margin="normal" disabled={disabled}>
          <InputLabel>{t('emailSetting.numberOfDaysAhead')}</InputLabel>
          <Select value={numberOfDayAhead} onChange={(e) => setNumberOfDayAhead(Number(e.target.value))}>
            {[...Array(11)].map((_, i) => (
              <MenuItem key={i } value={i }>{i }</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={onSave} disabled={!hasUnsavedChanges}>
            {t('emailSetting.updateButton')}
          </Button>
          
        </Box>
      </Box>
    </Box>
  );
};

export default EmailSetting;