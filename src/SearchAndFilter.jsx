import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchAndFilter = ({
  activeTab = 0, // 0 for products, 1 for companies
  searchText,
  setSearchText,
  filterCompany,
  setFilterCompany,
  filterCategory,
  setFilterCategory,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterRegion,
  setFilterRegion,
  filterHot,
  setFilterHot,
  companies,
  categories,
  types,
  statuses,
  regions,
  hotOptions,
  onClearFilters,
  filteredCount,
  totalCount,
  appBarColor,
}) => {
  const { t } = useTranslation();

  // Determine if we're in company mode
  const isCompanyMode = activeTab === 1;

  const sortedCompanies = useMemo(() => {
    if (!companies) return [];
    
    let topCompany = '';
    if (appBarColor === '#009739') {
      topCompany = '宏利保險';
    } else if (appBarColor === '#E4002B') {
      topCompany = '友邦保險';
    } else if (appBarColor === '#FFCD00') {
      topCompany = '永明金融';
    } else if (appBarColor === '#ed1b2e') {
      topCompany = '保誠保險';
    }

    if (topCompany) {
      return [...companies].sort((a, b) => {
        if (a === topCompany) return -1;
        if (b === topCompany) return 1;
        return 0;
      });
    }

    return companies;
  }, [companies, appBarColor]);

  return (
    <Box sx={{ mb: 2 }}>
      {/* Search and Filter Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {isCompanyMode ? (t('companyTable.title') || 'Company Search') : (t('productTable.title') || 'Product Search')}
        </Typography>
        
        <Grid container spacing={1.5} alignItems="center">
          {/* Search Bar */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              placeholder={
                isCompanyMode 
                  ? (t('companyTable.searchPlaceholder') || 'Search companies...') 
                  : (t('productTable.searchPlaceholder') || 'Search products...')
              }
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

          {/* Show product filters only when in product mode */}
          {!isCompanyMode && (
            <>
              {/* Company Filter */}
              <Grid item xs={12}>
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
                    {sortedCompanies?.map(company => (
                      <MenuItem key={company} value={company}>{company}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12}>
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
                    {categories?.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Type Filter */}
              <Grid item xs={12}>
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
                    {types?.map(type => (
                      <MenuItem key={type} value={type}>
                        {t(`productTable.types.${type}`) || type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Status Filter */}
              <Grid item xs={12}>
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
                    {statuses?.map(status => (
                      <MenuItem key={status} value={status}>
                        {t(`productTable.statuses.${status}`) || status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Region Filter */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('productTable.region') || 'Region'}</InputLabel>
                  <Select
                    value={filterRegion}
                    label={t('productTable.region') || 'Region'}
                    onChange={(e) => setFilterRegion(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>{t('productTable.all') || 'All'}</em>
                    </MenuItem>
                    {regions?.map(region => (
                      <MenuItem key={region} value={region}>{region}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Hot Filter */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    {t('productTable.hot') || 'Hot'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={filterHot === 'true' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setFilterHot('true')}
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        fontWeight: filterHot === 'true' ? 600 : 400,
                      }}
                    >
                      {t('yes') || 'Yes'}
                    </Button>
                    <Button
                      variant={filterHot === 'false' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setFilterHot('false')}
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        fontWeight: filterHot === 'false' ? 600 : 400,
                      }}
                    >
                      {t('no') || 'No'}
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </>
          )}

          {/* Product Count and Clear Filters Button */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                {t('productTable.showing') || 'Showing'} {filteredCount} {t('productTable.of') || 'of'} {totalCount} {
                  isCompanyMode 
                    ? (t('productTable.companies') || 'companies')
                    : (t('productTable.products') || 'products')
                }
              </Typography>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<ClearIcon />}
                onClick={onClearFilters}
                disabled={
                  isCompanyMode 
                    ? !searchText 
                    : (!searchText && !filterCompany && !filterCategory && !filterType && !filterStatus && !filterRegion && !filterHot)
                }
              >
                {t('productTable.clearFilters') || 'Clear Filters'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SearchAndFilter;