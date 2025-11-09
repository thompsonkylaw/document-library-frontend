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
import InformationPopup from './InformationPopup';

const companyModules = import.meta.glob('../json_data/company/*.json');

const CompanyPopup = ({ open, onClose, companyCode }) => {
  const { t, i18n } = useTranslation();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInfoId, setSelectedInfoId] = useState(null);
  const [infoPopupOpen, setInfoPopupOpen] = useState(false);

  useEffect(() => {
    if (open && companyCode) {
      loadCompanyDetails();
    }
  }, [open, companyCode]);

  const loadCompanyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const path = `../json_data/company/${companyCode}.json`;

      if (companyModules[path]) {
        const module = await companyModules[path]();
        const companyInfo = module.data || module.default || module;
        setCompanyData(companyInfo);
      } else {
        throw new Error(t('companyPopup.companyDetailsNotFound') || 'Company details not found');
      }
    } catch (err) {
      console.error('Error loading company details:', err);
      setError(err.message || t('companyPopup.failedToLoad') || 'Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCompanyData(null);
    setError(null);
    onClose();
  };

  const handleInfoClick = (infoId) => {
    setSelectedInfoId(infoId);
    setInfoPopupOpen(true);
  };

  const handleInfoPopupClose = () => {
    setInfoPopupOpen(false);
    setSelectedInfoId(null);
  };

  // Handle PDF link click with error fallback
  const handlePdfClick = async (e, fileName, companyCode) => {
    e.preventDefault();
    
    const filePrefix = companyCode.replace(':', '_');
    const baseUrl = 'https://my-documents-library.s3.ap-southeast-1.amazonaws.com/company_PDFs';
    
    // Normalize filename: replace % with space
    let normalizedFileName = fileName.replace(/%/g, ' ');
    
    // Always create both versions from the normalized filename
    // Replace any V followed by 6 digits with lowercase v
    let lowercaseVFileName = normalizedFileName.replace(/V(\d{6})/gi, 'v$1');
    
    // Replace any v followed by 6 digits with uppercase V  
    let uppercaseVFileName = normalizedFileName.replace(/v(\d{6})/gi, 'V$1');
    
    const lowercaseUrl = `${baseUrl}/${filePrefix}_${lowercaseVFileName}`;
    const uppercaseUrl = `${baseUrl}/${filePrefix}_${uppercaseVFileName}`;
    
    console.log('Checking PDF availability:');
    console.log('Lowercase v URL:', lowercaseUrl);
    console.log('Uppercase V URL:', uppercaseUrl);
    
    // Function to check if URL is accessible
    const checkUrlExists = async (url) => {
      try {
        const response = await fetch(url, { 
          method: 'GET',
          mode: 'cors',
        });
        return response.ok;
      } catch (error) {
        return false;
      }
    };
    
    // Determine which URL to try first based on original normalized filename
    let primaryUrl = lowercaseUrl;
    let fallbackUrl = uppercaseUrl;
    
    // If original normalized filename has uppercase V, try uppercase first
    if (/V\d{6}/.test(normalizedFileName)) {
      primaryUrl = uppercaseUrl;
      fallbackUrl = lowercaseUrl;
    }
    
    console.log('Checking primary URL first...');
    
    // Try primary URL first
    const primaryExists = await checkUrlExists(primaryUrl);
    
    if (primaryExists) {
      console.log('Primary URL exists, opening:', primaryUrl);
      window.open(primaryUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.log('Primary URL not accessible, trying fallback...');
      
      // Try fallback URL
      const fallbackExists = await checkUrlExists(fallbackUrl);
      
      if (fallbackExists) {
        console.log('Fallback URL exists, opening:', fallbackUrl);
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.error('Neither URL is accessible, opening primary anyway...');
        // Open primary URL anyway as last resort
        window.open(primaryUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Get localized name based on current language
  const getLocalizedName = (nameI18n, defaultName) => {
    if (!nameI18n) return defaultName;
    
    const languageMap = {
      'en': 'enUS',
      'zh-HK': 'zhHantHK',
      'zh-CN': 'zhHansCN'
    };
    
    const key = languageMap[i18n.language] || 'enUS';
    return nameI18n[key] || defaultName;
  };

  // Get localized description based on current language
  const getLocalizedDesc = (descI18n, defaultDesc) => {
    if (!descI18n) return defaultDesc;
    
    const languageMap = {
      'en': 'enUS',
      'zh-HK': 'zhHantHK',
      'zh-CN': 'zhHansCN'
    };
    
    const key = languageMap[i18n.language] || 'enUS';
    return descI18n[key] || defaultDesc;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {loading 
              ? (t('companyPopup.loading') || 'Loading...') 
              : companyData 
                ? getLocalizedName(companyData.nameI18n, companyData.name)
                : (t('companyPopup.companyDetails') || 'Company Details')}
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
          ) : companyData ? (
            <Box>
              {/* Basic Information */}
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('companyPopup.companyName') || 'Company Name'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {companyData.logo && (
                        <img 
                          src={companyData.logo} 
                          alt={companyData.name}
                          style={{ width: 40, height: 40, objectFit: 'contain' }}
                        />
                      )}
                      <Typography variant="body1">
                        {getLocalizedName(companyData.nameI18n, companyData.name)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('companyPopup.region') || 'Region'}
                    </Typography>
                    <Chip 
                      label={companyData.region} 
                      size="small" 
                      color="primary" 
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('companyPopup.code') || 'Code'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {companyData.code}
                    </Typography>
                  </Grid>
                  {companyData.rank !== undefined && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {t('companyPopup.rank') || 'Rank'}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {companyData.rank}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Description */}
              {(companyData.desc || companyData.descI18n) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {t('companyPopup.description') || 'Description'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-line' }}>
                    {getLocalizedDesc(companyData.descI18n, companyData.desc)}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Credit Ratings */}
              {companyData.creditRatings && companyData.creditRatings.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {t('companyPopup.creditRatings') || 'Credit Ratings'}
                  </Typography>
                  <Grid container spacing={2}>
                    {companyData.creditRatings.map((rating, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            {rating.rating}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {rating.project}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {rating.ratingAgency}
                          </Typography>
                          {rating.time && (
                            <Typography variant="caption" color="textSecondary" display="block">
                              {new Date(rating.time).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Useful Links */}
              {companyData.links && companyData.links.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {t('companyPopup.usefulLinks') || 'Useful Links'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {companyData.links.map((linkItem, index) => (
                      <Link
                        key={index}
                        href={linkItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          gap: 0.5, 
                          textDecoration: 'none',
                          p: 1.5,
                          bgcolor: 'grey.50',
                          borderRadius: 1,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                          {getLocalizedDesc(linkItem.descriptionI18n, linkItem.description)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-all' }}>
                          {linkItem.link}
                        </Typography>
                      </Link>
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Company Details */}
              {companyData.details && companyData.details.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {t('companyPopup.companyDetailsSection') || 'Company Details'}
                  </Typography>
                  {companyData.details.map((detail, index) => (
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
              {companyData.files && companyData.files.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {t('companyPopup.relatedDocuments') || 'Related Documents'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {companyData.files
                      .filter(file => file.fileName && file.fileName.toLowerCase().endsWith('.pdf'))
                      .map((file, index) => {
                        return (
                          <Link
                            key={index}
                            href="#"
                            onClick={(e) => handlePdfClick(e, file.fileName, companyCode)}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', cursor: 'pointer' }}
                          >
                            <DownloadIcon fontSize="small" />
                            <Typography variant="body2">{file.fileName}</Typography>
                          </Link>
                        );
                      })}
                  </Box>
                </Box>
              )}

              {/* Company News/Information */}
              {companyData.information && companyData.information.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {t('companyPopup.latestNews') || 'Latest News & Updates'}
                  </Typography>
                  {[...companyData.information]
                    .sort((a, b) => new Date(b.time) - new Date(a.time))
                    .map((info, index) => (
                    <Box 
                      key={index} 
                      data-info-id={info.id}
                      onClick={() => handleInfoClick(info.id)}
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        }
                      }}
                    >
                      <Chip 
                        label={t(`companyPopup.informationTypes.${info.type}`) || info.type.replace('_', ' ')} 
                        size="small" 
                        color={info.type === 'COMPANY_NEWS' ? 'info' : 'success'}
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
              {t('companyPopup.noCompanyDetails') || 'No company details available'}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            {t('companyPopup.close') || 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <InformationPopup 
        open={infoPopupOpen}
        onClose={handleInfoPopupClose}
        infoId={selectedInfoId}
      />
    </>
  );
};

export default CompanyPopup;
