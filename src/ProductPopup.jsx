import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ProductPopup = ({ open, onClose, productCode }) => {
  const { t } = useTranslation();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && productCode) {
      loadProductDetails();
    }
  }, [open, productCode]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert productCode format from "AIA:2I1OLP" to "AIA_2I1OLP"
      const fileName = productCode.replace(':', '_');
      const response = await fetch(`/products/${fileName}_detail.json`);
      
      if (!response.ok) {
        throw new Error(t('productPopup.productDetailsNotFound'));
      }
      
      const data = await response.json();
      const productInfo = data.data || data;
      setProductData(productInfo);
    } catch (err) {
      console.error('Error loading product details:', err);
      setError(err.message || t('productPopup.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProductData(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {loading ? t('productPopup.loading') : productData?.productName || t('productPopup.productDetails')}
        </Typography>
        <Button onClick={handleClose} color="inherit" size="small">
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : productData ? (
          <Box>
            {/* Basic Information */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('productPopup.company')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {productData.logo && (
                      <img 
                        src={productData.logo} 
                        alt={productData.companyName}
                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                      />
                    )}
                    <Typography variant="body1">{productData.companyName}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('productPopup.category')}
                  </Typography>
                  <Chip 
                    label={productData.categoryName} 
                    size="small" 
                    color="primary" 
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('productPopup.type')}
                  </Typography>
                  <Chip 
                    label={t(`productTable.types.${productData.type}`) || productData.type} 
                    size="small" 
                    color={productData.type === 'BASIC' ? 'success' : 'default'}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            {productData.desc && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('productPopup.description')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {productData.desc}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Product Highlights */}
            {productData.highlights && productData.highlights.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('productPopup.highlights', 'Product Highlights')}
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {productData.highlights.map((highlight, index) => (
                    <Typography 
                      key={index} 
                      component="li" 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      {highlight}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Payment Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {t('productPopup.paymentInformation')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('productPopup.currencies')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {productData.currencies?.map((currency) => (
                      <Chip key={currency} label={currency} size="small" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('productPopup.frequencies')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {productData.frequencies?.map((freq) => (
                      <Chip 
                        key={freq} 
                        label={t(`productPopup.frequencyValues.${freq}`) || freq} 
                        size="small" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('productPopup.paymentTerm')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {productData.paymentTerm?.map((term, index) => (
                      <Chip key={index} label={`${term} ${t('productPopup.years')}`} size="small" color="secondary" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Product Details */}
            {productData.details && productData.details.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('productPopup.productDetailsSection')}
                </Typography>
                {productData.details.map((detail, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">{detail.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={1}>
                        {detail.attributes?.map((attr, attrIndex) => (
                          <Grid item xs={12} key={attrIndex}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                              <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }}>
                                {attr.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  flex: 1, 
                                  textAlign: 'right',
                                  whiteSpace: 'pre-line'
                                }}
                              >
                                {attr.value || '-'}
                              </Typography>
                            </Box>
                            <Divider />
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}

            {/* Files/Documents */}
            {productData.files && productData.files.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('productPopup.relatedDocuments')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {productData.files.map((file, index) => {
                    // Extract company code and product code from productCode (e.g., "AIA:2I1OLP" -> "AIA_2I1OLP")
                    const filePrefix = productCode.replace(':', '_');
                    // Construct local PDF path
                    const localPdfPath = `/PDFs/${filePrefix}_${file.fileName}`;
                    
                    return (
                      <Link
                        key={index}
                        href={localPdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
                      >
                        <DownloadIcon fontSize="small" />
                        <Typography variant="body2">{file.fileName}</Typography>
                      </Link>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Product News/Information */}
            {productData.information && productData.information.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('productPopup.latestNews')}
                </Typography>
                {productData.information.map((info, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Chip 
                      label={t(`productPopup.informationTypes.${info.type}`) || info.type.replace('_', ' ')} 
                      size="small" 
                      color={info.type === 'PRODUCT_PROMOTION' ? 'success' : 'info'}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {info.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(info.time).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            {t('productPopup.noProductDetails')}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          {t('productPopup.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductPopup;
