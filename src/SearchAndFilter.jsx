import React from 'react';
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
  companies,
  categories,
  types,
  statuses,
  onClearFilters,
  filteredCount,
  totalCount,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 2 }}>
      {/* Search and Filter Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {t('productTable.title')}
        </Typography>
        
        <Grid container spacing={1.5} alignItems="center">
          {/* Search Bar */}
          <Grid item xs={12}>
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
                {companies?.map(company => (
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

          {/* Clear Filters Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                {t('productTable.showing') || 'Showing'} {filteredCount} {t('productTable.of') || 'of'} {totalCount} {t('productTable.products') || 'products'}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ClearIcon />}
                onClick={onClearFilters}
                disabled={!searchText && !filterCompany && !filterCategory && !filterType && !filterStatus}
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