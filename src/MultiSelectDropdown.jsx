import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, Select, MenuItem, Chip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MultiSelectDropdown = ({ selectedItems, onChange }) => {
  const { t } = useTranslation();
  const funds = [
    '聯博 - 美元收益基金 AA',
    '安聯收益及增長基金AM類 （H2-歐元對沖）收息',
    '富蘭克林入息基金',
    '測試基金'
  ];

  return (
    <Box display="grid" gap={1}>
      <Card elevation={1}>
        <CardContent>
          <Box>
            <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
              {t('selectFunds')}
            </Typography>
            <Select
              fullWidth
              variant="standard"
              multiple
              value={selectedItems}
              onChange={onChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      deleteIcon={
                        <IconButton
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const newSelected = selected.filter((item) => item !== value);
                            onChange({ target: { value: newSelected } });
                          }}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      }
                      onDelete={() => {}}
                    />
                  ))}
                </Box>
              )}
            >
              {funds.map((fund) => (
                <MenuItem key={fund} value={fund}>
                  {fund}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MultiSelectDropdown;