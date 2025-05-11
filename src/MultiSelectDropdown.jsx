import React from 'react';
import { Box, Card, CardContent, Typography, Select, MenuItem } from '@mui/material';

const MultiSelectDropdown = ({ selectedItems, onChange }) => {
  const funds = [
    '聯博 - 美元收益基金 AA',
    '安聯收益及增長基金AM類 （H2-歐元對沖）收息',
    '富蘭克林入息基金'
  ];

  return (
    <Box display="grid" gap={1}>
      <Card elevation={1}>
        <CardContent>
          <Box>
            <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
              Select Funds
            </Typography>
            <Select
              fullWidth
              variant="standard"
              multiple
              value={selectedItems}
              onChange={onChange}
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