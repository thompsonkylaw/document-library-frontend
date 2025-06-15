import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Grid,
  Card,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from './LanguageSwitch';
import MultiSelectDropdown from './MultiSelectDropdown';
import EmailSetting from './EmailSetting';
import FundTable from './FundTable';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

const App = () => {
  const IsProduction = true;
  const IsWp = true;
  const [wpUserEmail, setWpUserEmail] = useState('');
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [numberOfDayAhead, setNumberOfDayAhead] = useState(2);
  const [appBarColor, setAppBarColor] = useState(localStorage.getItem('appBarColor') || 'green');
  const [outputData1, setOutputData1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [selectedFundsForMail, setSelectedFundsForMail] = useState([]);
  const [userData, setUserData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedWpUserEmail, setSavedWpUserEmail] = useState('');
  const [savedNumberOfDayAhead, setSavedNumberOfDayAhead] = useState(null);
  const [savedSelectedFunds, setSavedSelectedFunds] = useState([]);
  const [savedSelectedFundsForMail, setSavedSelectedFundsForMail] = useState([]);
  const [expandedFunds, setExpandedFunds] = useState({});

  const handleChange = (event) => {
    setSelectedFunds(event.target.value);
  };

  const handleCheckboxChange = (fundName, checked) => {
    setSelectedFundsForMail((prev) =>
      checked ? (prev.includes(fundName) ? prev : [...prev, fundName]) : prev.filter((name) => name !== fundName)
    );
  };

  useEffect(() => {
    localStorage.setItem('appBarColor', appBarColor);
  }, [appBarColor]);

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          const serverURL = IsProduction ? 'https://fundcalendarbackend-production-0aeb.up.railway.app' : 'http://localhost:7003';
          const response = await axios.post(`${serverURL}/getData`, { selectedFunds });
          setOutputData1(response.data);
        } catch (err) {
          setError(err.response?.data?.detail || 'Failed to fetch data for Plan 1');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedFunds]);

  useEffect(() => {
    if (IsWp) {
      const fetchUserEmail = async () => {
        try {
          const apiUrl = window.wpApiSettings.root + 'myplugin/v1/system-login-name';
          const response = await axios.get(apiUrl, {
            headers: { 'X-WP-Nonce': window.wpApiSettings.nonce },
            withCredentials: true,
          });
          if (response.data.user_email) {
            setWpUserEmail(response.data.user_email);
            setEmail(response.data.user_email);
          } else {
            console.error('User email not found in API response');
          }
        } catch (error) {
          console.error('Failed to fetch user email:', error);
        }
      };
      fetchUserEmail();
    } else {
      setEmail('thompsonkylaw@gmail.com');
      setWpUserEmail('thompsonkylaw@gmail.com');
      console.log('Running in non-production mode, using default email');
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const serverURL = IsProduction ? 'https://fundcalendarbackend-production-0aeb.up.railway.app' : 'http://localhost:7003';
      const response = await axios.post(`${serverURL}/getUserData`, { wpUserEmail, numberOfDayAhead });
      const userData = response.data;
      setUserData(userData);
      console.log('User data:', userData);
      const funds = userData.funds || [];
      setSelectedFunds(funds.map((fund) => fund.name));
      setSelectedFundsForMail(funds.filter((fund) => fund.email_date.some((ed) => ed.isEnabled)).map((fund) => fund.name));
      setNumberOfDayAhead(userData.numberOfDayAhead);

      setSavedWpUserEmail(wpUserEmail);
      setSavedNumberOfDayAhead(userData.numberOfDayAhead);
      setSavedSelectedFunds(funds.map((fund) => fund.name));
      setSavedSelectedFundsForMail(funds.filter((fund) => fund.email_date.some((ed) => ed.isEnabled)).map((fund) => fund.name));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    if (wpUserEmail) fetchUserData();
  }, [wpUserEmail]);

  useEffect(() => {
    const isChanged =
      wpUserEmail !== savedWpUserEmail ||
      numberOfDayAhead !== savedNumberOfDayAhead ||
      JSON.stringify(selectedFunds) !== JSON.stringify(savedSelectedFunds) ||
      JSON.stringify(selectedFundsForMail) !== JSON.stringify(savedSelectedFundsForMail);
    setHasUnsavedChanges(isChanged);
  }, [wpUserEmail, numberOfDayAhead, selectedFunds, selectedFundsForMail, savedWpUserEmail, savedNumberOfDayAhead, savedSelectedFunds, savedSelectedFundsForMail]);

  const handleSave = async () => {
    try {
      const serverURL = IsProduction ? 'https://fundcalendarbackend-production-0aeb.up.railway.app' : 'http://localhost:7003';
      await axios.post(`${serverURL}/saveUserData`, {
        wpUserEmail,
        numberOfDayAhead,
        selectedFunds,
        selectedFundsForMail,
      });
      console.log('Settings saved successfully');
      await fetchUserData();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleTestEmail = async () => {
    try {
      const serverURL = IsProduction ? 'https://fundcalendarbackend-production-0aeb.up.railway.app' : 'http://localhost:7003';
      const response = await axios.post(`${serverURL}/sendTestEmail`, { wpUserEmail });
      if (response.status === 200) {
        alert('Test email sent successfully');
      } else {
        alert('Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Error sending test email');
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = 'Are you sure you want to leave before saving your changes?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ width: '100%', backgroundColor: appBarColor }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => (window.location.href = 'https://portal.aimarketings.io/tool-list/')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            {t('Medical Financial Calculator')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 2, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MultiSelectDropdown selectedItems={selectedFunds} onChange={handleChange} />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            ) : outputData1.length > 0 ? (
              <Box sx={{ mt: 4 }}>
                {outputData1.map((fund) => {
                  const userFund = userData?.funds.find((f) => f.name === fund.name);
                  const emailDates = userFund ? userFund.email_date : [];
                  console.log('emailDates', emailDates);
                  return (
                    <FundTable
                      key={fund.name}
                      fund={fund}
                      emailDates={emailDates}
                      isChecked={selectedFundsForMail.includes(fund.name)}
                      onCheckboxChange={handleCheckboxChange}
                      isExpanded={expandedFunds[fund.name] || false}
                      onToggleExpand={() =>
                        setExpandedFunds((prev) => ({
                          ...prev,
                          [fund.name]: !prev[fund.name],
                        }))
                      }
                    />
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                {t('pleaseSelectFund')}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ p: 2 }}>
              <EmailSetting
                email={email}
                setEmail={setEmail}
                numberOfDayAhead={numberOfDayAhead}
                setNumberOfDayAhead={setNumberOfDayAhead}
                disabled={false}
                hasUnsavedChanges={hasUnsavedChanges}
                onSave={handleSave}
                onTestEmail={handleTestEmail}
              />
            </Card>
            <Box sx={{ mt: 2 }}>
              <LanguageSwitch setAppBarColor={setAppBarColor} appBarColor={appBarColor} onTestEmail={handleTestEmail} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;