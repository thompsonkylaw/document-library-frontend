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

const App = () => {
  const { t } = useTranslation();
  const [appBarColor, setAppBarColor] = useState(localStorage.getItem('appBarColor') || 'green');

  // Product filter states
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Load products
  useEffect(() => {
    fetch('/pages/all_product_table_data.json')
      .then(response => response.json())
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
      return matchesSearch && matchesCompany && matchesCategory && matchesType && matchesStatus;
    });
  }, [products, searchText, filterCompany, filterCategory, filterType, filterStatus]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchText('');
    setFilterCompany('');
    setFilterCategory('');
    setFilterType('');
    setFilterStatus('');
  };

  useEffect(() => {
    localStorage.setItem('appBarColor', appBarColor);
  }, [appBarColor]);

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

      <Container sx={{  mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <ProductTable 
              searchText={searchText}
              filterCompany={filterCompany}
              filterCategory={filterCategory}
              filterType={filterType}
              filterStatus={filterStatus}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Card elevation={3} sx={{ p: 2 }}>
              <SearchAndFilter
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
                companies={companies}
                categories={categories}
                types={types}
                statuses={statuses}
                onClearFilters={handleClearFilters}
                filteredCount={filteredProducts.length}
                totalCount={products.length}
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