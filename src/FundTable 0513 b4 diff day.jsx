import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FundTable = ({ fund, emailDates, isChecked, onCheckboxChange, isExpanded, onToggleExpand }) => {
  const { t } = useTranslation();

  // Function to normalize date format to 'yyyy/MM/dd'
  const normalizeDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString.replace(/-/g, '/');
  };

  const title = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h6">{fund.name}</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={(e) => onCheckboxChange(fund.name, e.target.checked)}
            name="sendMail"
          />
        }
        label="Send Mail"
      />
    </Box>
  );

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        title={title}
        action={
          <IconButton onClick={onToggleExpand} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      />
      <Collapse in={isExpanded}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Issue Date')}</TableCell>
                  <TableCell>{t('Deadline Date')}</TableCell>
                  <TableCell>{t('Email Date')}</TableCell>
                  <TableCell>{t('Is Sent')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fund.issues.map((issue, index) => {
                  const emailDate = emailDates && index < emailDates.length ? emailDates[index] : null;
                  const isRowEnabled = emailDate ? emailDate.isEnabled : false;
                  return (
                    <TableRow
                      key={issue.issue_date}
                      sx={{ backgroundColor: isRowEnabled ? 'white' : '#f5f5f5' }}
                    >
                      <TableCell>{normalizeDate(issue.issue_date)}</TableCell>
                      <TableCell>{normalizeDate(issue.deadline_date)}</TableCell>
                      <TableCell>{emailDate ? normalizeDate(emailDate.date) : 'No email date set'}</TableCell>
                      <TableCell>{emailDate ? (emailDate.isSent ? 'Yes' : 'No') : 'N/A'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default FundTable;