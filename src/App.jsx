import React, { useState, useEffect, useMemo } from 'react';
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
  Box,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from './LanguageSwitch';
import SearchAndFilter from './SearchAndFilter';
import ProductTable from './ProductTable';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});
const companyToColor = {
    "Manulife": '#009739', "AIA": '#E4002B', "Sunlife": '#FFCD00',
    "AXA": '#00008F', "Chubb": '#004A9F', "Prudential": '#ed1b2e', "FWD": '#e67e22',
};
const App = () => {
  const domain = window.root12appSettings?.domain || false;
  console.log("domain:", domain);
  const savedCompany = localStorage.getItem('company');
    const savedColor = localStorage.getItem('appBarColor');
   let initialCompany;
    let initialColor;

    if (domain) {
        const lowerCaseDomain = domain.toLowerCase();
        if (lowerCaseDomain === "portal.aimarketings.io" || lowerCaseDomain === "manu.aimarketings.io") {
            initialCompany = "Manulife";
            initialColor = companyToColor["Manulife"];
        } else if (lowerCaseDomain === "pru.aimarketings.io") {
            initialCompany = "Prudential";
            initialColor = companyToColor["Prudential"];
        } else if (lowerCaseDomain === "sunlife.aimarketings.io") {
            initialCompany = "Sunlife";
            initialColor = companyToColor["Sunlife"];
        } else if (lowerCaseDomain === "aia.aimarketings.io") {
            initialCompany = "AIA";
            initialColor = companyToColor["AIA"];
        } else if (lowerCaseDomain === "axa.aimarketings.io") {
            initialCompany = "AXA";
            initialColor = companyToColor["AXA"];
        } else if (lowerCaseDomain === "chubb.aimarketings.io") {
            initialCompany = "Chubb";
            initialColor = companyToColor["Chubb"];
        } else if (lowerCaseDomain === "fwd.aimarketings.io") {
            initialCompany = "FWD";
            initialColor = companyToColor["FWD"];
        } else {
            initialCompany = savedCompany || "Manulife";
            initialColor = savedColor || companyToColor[initialCompany];
        }
    } else if (savedCompany) {
        initialCompany = savedCompany;
        initialColor = savedColor || companyToColor[savedCompany];
    } else {
        initialCompany = "Manulife";
        initialColor = companyToColor["Manulife"];
    }
  const [company, setCompany] = useState(initialCompany);
  const { t } = useTranslation();
   const [appBarColor, setAppBarColor] = useState(initialColor);

  // Active tab state (0 for products, 1 for companies)
  const [activeTab, setActiveTab] = useState(0);

  // Product filter states
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterHot, setFilterHot] = useState('');

  // Load products
  useEffect(() => {
    import('@json_data/pages/all_product_table_data.json')
      .then(data => {
        setProducts(data.list || []);
      })
      .catch(error => {
        console.error('Error loading product data:', error);
      });
  }, []);

  // Get unique values for filter dropdowns
  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(products.map(p => p.companyName))];
    return uniqueCompanies.sort();
  }, [products]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.categoryName))];
    return uniqueCategories.sort();
  }, [products]);

  const types = useMemo(() => {
    const uniqueTypes = [...new Set(products.map(p => p.type))];
    return uniqueTypes.sort();
  }, [products]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(products.map(p => p.sellStatus))];
    return uniqueStatuses.sort();
  }, [products]);

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(products.map(p => p.region).filter(Boolean))];
    return uniqueRegions.sort();
  }, [products]);

  const hotOptions = useMemo(() => {
    return ['true', 'false'];
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchText === '' || 
        product.productName?.toLowerCase().includes(searchText.toLowerCase()) ||
        product.productCode?.toLowerCase().includes(searchText.toLowerCase());
      const matchesCompany = filterCompany === '' || product.companyName === filterCompany;
      const matchesCategory = filterCategory === '' || product.categoryName === filterCategory;
      const matchesType = filterType === '' || product.type === filterType;
      const matchesStatus = filterStatus === '' || product.sellStatus === filterStatus;
      const matchesRegion = filterRegion === '' || product.region === filterRegion;
      const matchesHot = filterHot === '' || String(product.hot) === filterHot;
      return matchesSearch && matchesCompany && matchesCategory && matchesType && matchesStatus && matchesRegion && matchesHot;
    });
  }, [products, searchText, filterCompany, filterCategory, filterType, filterStatus, filterRegion, filterHot]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchText('');
    setFilterCompany('');
    setFilterCategory('');
    setFilterType('');
    setFilterStatus('');
    setFilterRegion('');
    setFilterHot('');
  };

  // Handle tab change from ProductTable
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // Clear filters when switching tabs
    handleClearFilters();
  };

  useEffect(() => {
    localStorage.setItem('appBarColor', appBarColor);
  }, [appBarColor]);

  console.log("appBarColor:",   appBarColor);
  console.log("company:",   company);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ width: '100%', backgroundColor: appBarColor }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" 
                        onClick={() => {
                            if (company === "Manulife") {
                                window.location.href = "https://portal.aimarketings.io/tool-list";
                            } else if (company === "Prudential") {
                                window.location.href = "https://pru.aimarketings.io/tool-list";
                            } else if (company === "Sunlife") {
                                window.location.href = "https://sunlife.aimarketings.io/tool-list";
                            } else if (company === "AIA") {
                                window.location.href = "https://aia.aimarketings.io/tool-list";
                            } else if (company === "AXA") {
                                window.location.href = "https://axa.aimarketings.io/tool-list";
                            } else if (company === "Chubb") {
                                window.location.href = "https://chubb.aimarketings.io/tool-list";
                            } else if (company === "FWD") {
                                window.location.href = "https://fwd.aimarketings.io/tool-list";
                            }
                        }}
                        sx={{ color: company === 'Sunlife' ? '#003946' : 'inherit' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: company === 'Sunlife' ? '#003946' : 'white' }}>{t('Medical Financial Calculator')}</Typography>
                </Toolbar>
            </AppBar>

      <Container sx={{  mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <ProductTable 
              searchText={searchText}
              filterCompany={filterCompany}
              filterCategory={filterCategory}
              filterType={filterType}
              filterStatus={filterStatus}
              filterRegion={filterRegion}
              filterHot={filterHot}
              onTabChange={handleTabChange}
              appBarColor={appBarColor}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Card elevation={3} sx={{ p: 2 }}>
              <SearchAndFilter
                activeTab={activeTab}
                searchText={searchText}
                setSearchText={setSearchText}
                filterCompany={filterCompany}
                setFilterCompany={setFilterCompany}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterType={filterType}
                setFilterType={setFilterType}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterRegion={filterRegion}
                setFilterRegion={setFilterRegion}
                filterHot={filterHot}
                setFilterHot={setFilterHot}
                companies={companies}
                categories={categories}
                types={types}
                statuses={statuses}
                regions={regions}
                hotOptions={hotOptions}
                onClearFilters={handleClearFilters}
                filteredCount={filteredProducts.length}
                totalCount={products.length}
                appBarColor={appBarColor}
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