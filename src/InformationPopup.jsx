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
  CircularProgress,
  Alert,
  Link,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const InformationPopup = ({ open, onClose, infoId }) => {
  const { t } = useTranslation();
  const [infoData, setInfoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && infoId) {
      loadInformationDetails();
    }
  }, [open, infoId]);

  const loadInformationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/infomations/${infoId}.json`);
      
      if (!response.ok) {
        throw new Error(t('informationPopup.informationNotFound', 'Information not found'));
      }
      
      const data = await response.json();
      const information = data.data || data;
      setInfoData(information);
    } catch (err) {
      console.error('Error loading information details:', err);
      setError(err.message || t('informationPopup.failedToLoad', 'Failed to load information'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInfoData(null);
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
          {loading ? t('informationPopup.loading', 'Loading...') : infoData?.title || t('informationPopup.informationDetails', 'Information Details')}
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
        ) : infoData ? (
          <Box>
            {/* Information Type and Date */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip 
                label={t(`productPopup.informationTypes.${infoData.type}`) || infoData.type.replace('_', ' ')} 
                size="small" 
                color={infoData.type === 'PRODUCT_PROMOTION' ? 'success' : 'info'}
              />
              <Typography variant="caption" color="textSecondary">
                {new Date(infoData.time).toLocaleDateString()}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                • ID: {infoData.id}
              </Typography>
            </Box>

            {/* Company Information */}
            {infoData.companyName && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('informationPopup.company', 'Company')}
                </Typography>
                <Typography variant="body1">{infoData.companyName}</Typography>
              </Box>
            )}

            {/* Tags */}
            {infoData.tags && infoData.tags.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  {t('informationPopup.tags', 'Tags')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {infoData.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Content */}
            {infoData.content && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('informationPopup.content', 'Content')}
                </Typography>
                <Box
                  sx={{ 
                    '& img': { maxWidth: '100%', height: 'auto' },
                    '& p': { marginBottom: 1 },
                  }}
                  dangerouslySetInnerHTML={{ __html: infoData.content }}
                />
              </Box>
            )}

            {/* Related Products */}
            {infoData.productNames && infoData.productNames.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('informationPopup.relatedProducts', 'Related Products')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {infoData.productNames.map((productName, index) => (
                    <Typography key={index} variant="body2" color="textSecondary">
                      • {productName}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Attachments */}
            {infoData.attachments && infoData.attachments.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('informationPopup.attachments', 'Attachments')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {infoData.attachments.map((attachment, index) => {
                    // Construct AWS S3 PDF URL
                    const pdfUrl = `https://my-documents-library.s3.ap-southeast-1.amazonaws.com/info_PDFs/${infoData.id}_${attachment.fileName}`;
                    
                    return (
                      <Link
                        key={index}
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
                      >
                        <DownloadIcon fontSize="small" />
                        <Typography variant="body2">{attachment.fileName}</Typography>
                      </Link>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Effective Date */}
            {(infoData.startEffectiveDate || infoData.endEffectiveDate) && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  {t('informationPopup.effectivePeriod', 'Effective Period')}
                </Typography>
                {infoData.startEffectiveDate && (
                  <Typography variant="body2">
                    {t('informationPopup.startDate', 'Start')}: {new Date(infoData.startEffectiveDate).toLocaleDateString()}
                  </Typography>
                )}
                {infoData.endEffectiveDate && (
                  <Typography variant="body2">
                    {t('informationPopup.endDate', 'End')}: {new Date(infoData.endEffectiveDate).toLocaleDateString()}
                  </Typography>
                )}
                {infoData.effective !== undefined && (
                  <Chip 
                    label={infoData.effective ? t('informationPopup.active', 'Active') : t('informationPopup.inactive', 'Inactive')}
                    size="small"
                    color={infoData.effective ? 'success' : 'default'}
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            {t('informationPopup.noData', 'No information available')}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          {t('informationPopup.close', 'Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InformationPopup;
