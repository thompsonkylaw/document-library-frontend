import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

const Setting = ({ setAppBarColor, onClose, onTestEmail }) => {
  const { t } = useTranslation();
  const colors = ['#009739', '#E4002B', '#FFCD00', '#00008F', '#004A9F', '#ed1b2e'];

  const handleColorSelect = (color) => {
    setAppBarColor(color);
    onClose();
  };
 //v1.0.0
  return (
    <>
      <DialogTitle>v1.0.0 {t('settings')}</DialogTitle>
      <DialogContent>
        <Box>
          {colors.map((color) => (
            <Button
              key={color}
              onClick={() => handleColorSelect(color)}
              style={{
                backgroundColor: color,
                color: color === '#FFCD00' ? 'black' : 'white',
                margin: '5px',
                minWidth: '80px',
              }}
            >
              {color}
            </Button>
          ))}
        </Box>
        {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" color="secondary" onClick={onTestEmail}>
            {t('testEmailButton')}
          </Button>
        </Box> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </>
  );
};

export default Setting;