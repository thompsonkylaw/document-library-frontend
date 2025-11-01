import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  TablePagination,
  TextField,
  InputAdornment,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';
import ProductPopup from './ProductPopup';

const ProductTable = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  
  // Filter states
  const [searchText, setSearchText] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    // Load the product data from the JSON file
    fetch('/pages/all_product_table_data.json')
      .then(response => response.json())
      .then(data => {
        setProducts(data.list || []);
      })
      .catch(error => {
        console.error('Error loading product data:', error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (productCode) => {
    setSelectedProduct(productCode);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedProduct(null);
  };

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

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = searchText === '' || 
        product.productName?.toLowerCase().includes(searchText.toLowerCase()) ||
        product.productCode?.toLowerCase().includes(searchText.toLowerCase());
      
      // Company filter
      const matchesCompany = filterCompany === '' || product.companyName === filterCompany;
      
      // Category filter
      const matchesCategory = filterCategory === '' || product.categoryName === filterCategory;
      
      // Type filter
      const matchesType = filterType === '' || product.type === filterType;
      
      // Status filter
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
    setPage(0);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchText, filterCompany, filterCategory, filterType, filterStatus]);

  // Get paginated products
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t('productTable.title')}
      </Typography>
      
      {/* Search and Filter Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Bar */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder={t('productTable.searchPlaceholder') || 'Search products...'}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Company Filter */}
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('productTable.company') || 'Company'}</InputLabel>
              <Select
                value={filterCompany}
                label={t('productTable.company') || 'Company'}
                onChange={(e) => setFilterCompany(e.target.value)}
              >
                <MenuItem value="">
                  <em>{t('productTable.all') || 'All'}</em>
                </MenuItem>
                {companies.map(company => (
                  <MenuItem key={company} value={company}>{company}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category Filter */}
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('productTable.category') || 'Category'}</InputLabel>
              <Select
                value={filterCategory}
                label={t('productTable.category') || 'Category'}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="">
                  <em>{t('productTable.all') || 'All'}</em>
                </MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Type Filter */}
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('productTable.type') || 'Type'}</InputLabel>
              <Select
                value={filterType}
                label={t('productTable.type') || 'Type'}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="">
                  <em>{t('productTable.all') || 'All'}</em>
                </MenuItem>
                {types.map(type => (
                  <MenuItem key={type} value={type}>
                    {t(`productTable.types.${type}`) || type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status Filter */}
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('productTable.status') || 'Status'}</InputLabel>
              <Select
                value={filterStatus}
                label={t('productTable.status') || 'Status'}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">
                  <em>{t('productTable.all') || 'All'}</em>
                </MenuItem>
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>
                    {t(`productTable.statuses.${status}`) || status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters Button */}
          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              disabled={!searchText && !filterCompany && !filterCategory && !filterType && !filterStatus}
            >
              {t('productTable.clearFilters') || 'Clear Filters'}
            </Button>
          </Grid>
        </Grid>

        {/* Results Count */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="textSecondary">
            {t('productTable.showing') || 'Showing'} {filteredProducts.length} {t('productTable.of') || 'of'} {products.length} {t('productTable.products') || 'products'}
          </Typography>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="product table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>{t('productTable.productName')}</strong></TableCell>
              <TableCell><strong>{t('productTable.company')}</strong></TableCell>
              <TableCell><strong>{t('productTable.category')}</strong></TableCell>
              <TableCell><strong>{t('productTable.type')}</strong></TableCell>
              <TableCell><strong>{t('productTable.status')}</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow
                  key={product.productCode}
                  onClick={() => handleRowClick(product.productCode)}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {product.productName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img 
                        src={product.logo} 
                        alt={product.companyName}
                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                      />
                      {product.companyName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.categoryName} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={t(`productTable.types.${product.type}`) || product.type} 
                      size="small" 
                      color={product.type === 'BASIC' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={t(`productTable.statuses.${product.sellStatus}`) || product.sellStatus} 
                      size="small" 
                      color={product.sellStatus === 'SELLING' ? 'success' : 'warning'}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    {t('productTable.noProductsAvailable')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      
      <ProductPopup 
        open={popupOpen}
        onClose={handleClosePopup}
        productCode={selectedProduct}
      />
    </Box>
  );
};

export default ProductTable;
