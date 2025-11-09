import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

const Setting = ({ setAppBarColor, onClose, onTestEmail }) => {
    const { t } = useTranslation();
  const colorCompanyMap = [
    { color: '#009739', company: 'Manulife' },
    { color: '#E4002B', company: 'AIA' },
    { color: '#FFCD00', company: 'Sunlife' },
    { color: '#00008F', company: 'AXA' },
    { color: '#004A9F', company: 'Chubb' },
    { color: '#ed1b2e', company: 'Prudential' },
    { color: '#e67e22', company: 'FWD' },
  ];
 
const IsProduction = window.root12appSettings?.IsProduction || false;  
// const [isWhitelisted, setIsWhitelisted] = useState(false);
 const whitelist = [import.meta.env.VITE_ADMIN_1_EMAIL, import.meta.env.VITE_ADMIN_2_EMAIL];
 const whitelisted = whitelist.includes(window.root12appSettings?.user_email);
//  setIsWhitelisted(whitelisted); // Set state first

 console.log("IsProduction=", window.root12appSettings?.IsProduction);
 console.log("logged in user email=", window.root12appSettings?.user_email);
 console.log("whitelisted=", whitelisted);
 //v1.0.0
  return (
    <>
      <DialogTitle>v1.0.0 {t('settings')}</DialogTitle>
      <DialogContent>
        {/* Company Selection */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
         {(whitelisted || !IsProduction) && colorCompanyMap.map(({ color, company }) => (
            <Button
              key={color}
              onClick={() => {
                setAppBarColor(color);
                setCompany(company);
                onClose();
              }}
              sx={{
                backgroundColor: color,
                color: color === '#FFCD00' ? 'black' : 'white',
                width: '120px',
                margin: '5px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {company}
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