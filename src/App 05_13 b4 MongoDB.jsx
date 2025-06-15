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
  CardHeader,
  CardContent,
  CircularProgress,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';

import LanguageSwitch from './LanguageSwitch';
import MultiSelectDropdown from './MultiSelectDropdown';
import EmailSetting from './EmailSetting';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

const FundTable = ({ fund, isChecked, onCheckboxChange }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const title = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h6">{fund.name}</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={(e) => onCheckboxChange(fund.name, e.target.checked)}
            name="sendMail"
          />
        }
        label="Send Mail"
      />
    </Box>
  );

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        title={title}
        action={
          <IconButton onClick={toggleExpand} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      />
      <Collapse in={isExpanded}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Issue Date')}</TableCell>
                  <TableCell>{t('Deadline Date')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fund.issues.map((issue) => (
                  <TableRow key={issue.issue_date}>
                    <TableCell>{issue.issue_date}</TableCell>
                    <TableCell>{issue.deadline_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const App = () => {
  const IsProduction = true;
  const [wpUserEmail, setwpUserEmail] = useState('');
  const { t } = useTranslation();
  const [email, setEmail] = useState('thompsonkylaw@gmail.com');
  const [numberOfDayAhead, setNumberOfDayAhead] = useState(2);

  const [appBarColor, setAppBarColor] = useState(localStorage.getItem('appBarColor') || 'green');
  
  const [outputData1, setOutputData1] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedFunds, setSelectedFunds] = useState([]);
  const [selectedFundsForMail, setSelectedFundsForMail] = useState([]);

  const handleChange = (event) => {
    setSelectedFunds(event.target.value);
  };

  const handleCheckboxChange = (fundName, checked) => {
    setSelectedFundsForMail(prev => {
      if (checked) {
        return prev.includes(fundName) ? prev : [...prev, fundName];
      } else {
        return prev.filter(name => name !== fundName);
      }
    });
  };

  useEffect(() => {
    localStorage.setItem('appBarColor', appBarColor);
  }, [appBarColor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          const serverURL = IsProduction
            ? 'https://fundcalendarbackend-production.up.railway.app'
            : 'http://localhost:7003';
          const response = await axios.post(serverURL + '/getData', {
            selectedFunds: selectedFunds,
          });
          setOutputData1(response.data);
          console.log(response.data);
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

  // Fetch user email from WordPress API
  useEffect(() => {
    if (IsProduction) {
      const fetchUserEmail = async () => {
        try {
          const apiUrl = window.wpApiSettings.root + 'myplugin/v1/system-login-name';
          const response = await axios.get(apiUrl, {
            headers: {
              'X-WP-Nonce': window.wpApiSettings.nonce,
            },
            withCredentials: true,
          });
          if (response.data.user_email) {
            setwpUserEmail(response.data.user_email);
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
      setEmail('default@example.com');
      console.log('Running in non-production mode, using default email');
    }
  }, []);

  // Log wpUserEmail when it changes
  useEffect(() => {
    if (wpUserEmail) {
      console.log('wpUserEmail:', wpUserEmail);
    }
  }, [wpUserEmail]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: '100%', backgroundColor: appBarColor }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => {
              window.location.href = "https://portal.aimarketings.io/tool-list/";
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            {t('Medical Financial Calculator')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 10, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MultiSelectDropdown selectedItems={selectedFunds} onChange={handleChange} />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            ) : outputData1.length > 0 ? (
              <Box sx={{ mt: 4 }}>
                {outputData1.map((fund, index) => (
                  <FundTable
                    key={index}
                    fund={fund}
                    isChecked={selectedFundsForMail.includes(fund.name)}
                    onCheckboxChange={handleCheckboxChange}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Please select at least one fund.
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
            />
             </Card>
            <Box sx={{ mt: 2 }}>
              <LanguageSwitch setAppBarColor={setAppBarColor} appBarColor={appBarColor} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;