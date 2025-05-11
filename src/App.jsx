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
import UseInflation from './UseInflation';
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
  const IsProduction = false;
  const { t } = useTranslation();
  const [email, setEmail] = useState('thompsonkylaw@gmail.com');
  const [numberOfDayAhead, setNumberOfDayAhead] = useState(2);


  const [appBarColor, setAppBarColor] = useState(localStorage.getItem('appBarColor') || 'green');
  const [useInflation, setUseInflation] = useState(false);
  const [plan1Inputs, setPlan1Inputs] = useState(() => {
    const savedInputs = localStorage.getItem('plan1Inputs');
    const defaultInputs = {
      company: "manulife",
      plan: "晉悅自願醫保靈活計劃",
      planCategory: "智選",
      effectiveDate: "2024-12-29",
      currency: "HKD",
      sexuality: "na",
      ward: "na",
      planOption: "22,800港元",
      age: 40,
      numberOfYears: 15,
      inflationRate: 6,
      currencyRate: 7.85,
      planFileName: "晉悅自願醫保靈活計劃_智選_2024-12-29_HKD_na_na"
    };
    return savedInputs ? { ...defaultInputs, ...JSON.parse(savedInputs) } : defaultInputs;
  });
  const [outputData1, setOutputData1] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [numberOfYearAccMP, setNumberOfYearAccMP] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finalNotionalAmount, setFinalNotionalAmount] = useState(null);
  const [cashValueInfo, setCashValueInfo] = useState({
    age_1: 65,
    age_2: 85,
    age_1_cash_value: 0,
    age_2_cash_value: 0,
    annual_premium: 0
  });
  const [clientInfo, setClientInfo] = useState({
    surname: "VIP",
    givenName: "VIP",
    chineseName: "",
    basicPlan: '宏摯傳承保障計劃(GS)',
    premiumPaymentPeriod: '15',
    basicPlanCurrency: '美元'
  });
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
            ? 'https://fastapi-production-a20ab.up.railway.app'
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

  useEffect(() => {
    if (outputData1.length === 0 || !outputData1[0].hasOwnProperty('medicalPremium')) {
      setProcessedData([]);
      setNumberOfYearAccMP(0);
      setCashValueInfo({
        age_1: 65,
        age_2: 85,
        age_1_cash_value: 0,
        age_2_cash_value: 0
      });
      return;
    }

    const processData = (data, inflationRate) => {
      let accumulatedMP = 0;
      const processed = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let medicalPremium = item.medicalPremium;
        if (i > 0 && useInflation) {
          medicalPremium = processed[i - 1].medicalPremium * (1 + inflationRate / 100);
        }
        accumulatedMP += medicalPremium;
        processed.push({
          ...item,
          medicalPremium,
          accumulatedMP
        });
      }
      return processed;
    };

    const processedData = processData(outputData1, plan1Inputs.inflationRate);
    setProcessedData(processedData);

    const finalYearData = processedData.find(item => item.yearNumber === plan1Inputs.numberOfYears);
    setNumberOfYearAccMP(finalYearData?.accumulatedMP || 0);

    const age1Data = processedData.find(item => item.age === 65);
    const age2Data = processedData.find(item => item.age === 85);
    setCashValueInfo({
      age_1: 65,
      age_2: 85,
      age_1_cash_value: age1Data ? age1Data.accumulatedMP : 0,
      age_2_cash_value: age2Data ? age2Data.accumulatedMP : 0
    });
  }, [outputData1, useInflation, plan1Inputs.inflationRate, plan1Inputs.numberOfYears, plan1Inputs.age]);

  useEffect(() => {
    localStorage.setItem('plan1Inputs', JSON.stringify(plan1Inputs));
  }, [plan1Inputs]);

  const handleInflationRateChange = (value) => {
    setPlan1Inputs(prev => ({ ...prev, inflationRate: value }));
  };

  const handleCurrencyRateChange = (value) => {
    setPlan1Inputs(prev => ({ ...prev, currencyRate: value }));
  };

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
                email = {email}
                numberOfDayAhead = {numberOfDayAhead}
                setEmail = {setEmail}
                setNumberOfDayAhead = {setNumberOfDayAhead}
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