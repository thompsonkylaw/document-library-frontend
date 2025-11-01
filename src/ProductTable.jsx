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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProductPopup from './ProductPopup';

const ProductTable = ({ 
  searchText = '',
  filterCompany = '',
  filterCategory = '',
  filterType = '',
  filterStatus = ''
}) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

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
