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
  Tabs,
  Tab,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProductPopup from './ProductPopup';
import CompanyPopup from './CompanyPopup';

const ProductTable = ({ 
  searchText = '',
  filterCompany = '',
  filterCategory = '',
  filterType = '',
  filterStatus = '',
  onTabChange
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0); // 0 for products, 1 for companies
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [companyPopupOpen, setCompanyPopupOpen] = useState(false);

  // Load product data
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

  // Load company data
  useEffect(() => {
    fetch('/company_pages/all_company_table_data.json')
      .then(response => response.json())
      .then(data => {
        setCompanies(data.list || []);
      })
      .catch(error => {
        console.error('Error loading company data:', error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0); // Reset to first page when switching tabs
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  const handleRowClick = (productCode) => {
    setSelectedProduct(productCode);
    setPopupOpen(true);
  };

  const handleCompanyRowClick = (companyCode) => {
    setSelectedCompany(companyCode);
    setCompanyPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseCompanyPopup = () => {
    setCompanyPopupOpen(false);
    setSelectedCompany(null);
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

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = searchText === '' || 
        company.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        company.code?.toLowerCase().includes(searchText.toLowerCase()) ||
        company.region?.toLowerCase().includes(searchText.toLowerCase());
      
      return matchesSearch;
    });
  }, [companies, searchText]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchText, filterCompany, filterCategory, filterType, filterStatus]);

  // Get current data based on active tab
  const currentData = activeTab === 0 ? filteredProducts : filteredCompanies;

  // Get paginated data
  const paginatedData = currentData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ mt: 4 }}>
      {/* Tabs for switching between Products and Companies */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="product and company tabs">
          <Tab label={t('productTable.products') || 'Products'} />
          <Tab label={t('productTable.companies') || 'Companies'} />
        </Tabs>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="data table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {activeTab === 0 ? (
                // Product table headers
                <>
                  <TableCell><strong>{t('productTable.productName')}</strong></TableCell>
                  <TableCell><strong>{t('productTable.company')}</strong></TableCell>
                  <TableCell><strong>{t('productTable.category')}</strong></TableCell>
                  <TableCell><strong>{t('productTable.type')}</strong></TableCell>
                  <TableCell><strong>{t('productTable.status')}</strong></TableCell>
                  <TableCell><strong>{t('productTable.policyPeriod')}</strong></TableCell>
                </>
              ) : (
                // Company table headers
                <>
                  <TableCell><strong>{t('companyTable.logo')}</strong></TableCell>
                  <TableCell><strong>{t('companyTable.companyName')}</strong></TableCell>
                  <TableCell><strong>{t('companyTable.region')}</strong></TableCell>
                  <TableCell><strong>{t('companyTable.description')}</strong></TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              activeTab === 0 ? (
                // Product rows
                paginatedData.map((product) => (
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
                    <TableCell>
                      <Typography variant="body2">
                        {product.policyPeriod || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Company rows
                paginatedData.map((company) => (
                  <TableRow
                    key={company.code}
                    onClick={() => handleCompanyRowClick(company.code)}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    <TableCell>
                      <img 
                        src={company.logo} 
                        alt={company.name}
                        style={{ width: 40, height: 40, objectFit: 'contain' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {company.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={company.region} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 400
                      }}>
                        {company.desc || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={activeTab === 0 ? 6 : 4} align="center">
                  <Typography variant="body2" color="textSecondary">
                    {activeTab === 0 
                      ? t('productTable.noProductsAvailable') 
                      : t('companyTable.noCompaniesAvailable')}
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
        count={currentData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('productTable.rowsPerPage')}
      />
      
      {activeTab === 0 && (
        <ProductPopup 
          open={popupOpen}
          onClose={handleClosePopup}
          productCode={selectedProduct}
        />
      )}
      
      {activeTab === 1 && (
        <CompanyPopup 
          open={companyPopupOpen}
          onClose={handleCloseCompanyPopup}
          companyCode={selectedCompany}
        />
      )}
    </Box>
  );
};

export default ProductTable;
