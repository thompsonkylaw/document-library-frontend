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

  const normalizeDate = (dateString) => {
    if (!dateString) return t('na');
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
        label={t('sendMail')}
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
                  <TableCell>{t('issueDate')}</TableCell>
                  <TableCell>{t('deadlineDate')}</TableCell>
                  <TableCell>{t('emailDate')}</TableCell>
                  <TableCell>{t('dayLeft')}</TableCell>
                  <TableCell>{t('isSent')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fund.issues.map((issue, index) => {
                  const emailDate = emailDates && index < emailDates.length ? emailDates[index] : null;
                  const isRowEnabled = emailDate ? emailDate.isEnabled : false;
                  let diffDays = null;
                  if (emailDate) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const emailDateObj = new Date(emailDate.date.replace(/\//g, '-'));
                    emailDateObj.setHours(0, 0, 0, 0);
                    const diffTime = emailDateObj - today;
                    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  }
                  return (
                    <TableRow
                      key={issue.issue_date}
                      sx={{
                        backgroundColor: isRowEnabled
                          ? emailDate && diffDays < 0
                            ? '#484747FF'
                            : 'white'
                          : '#484747FF',
                        '& .MuiTableCell-root': {
                          fontWeight: emailDate && diffDays === 0 ? 'bold' : 'normal',
                        },
                      }}
                    >
                      <TableCell>{normalizeDate(issue.issue_date)}</TableCell>
                      <TableCell>{normalizeDate(issue.deadline_date)}</TableCell>
                      <TableCell>{emailDate ? normalizeDate(emailDate.date) : t('noEmailDateSet')}</TableCell>
                      <TableCell>{diffDays !== null ? diffDays : t('na')}</TableCell>
                      <TableCell>{emailDate ? (emailDate.isSent ? t('yes') : t('no')) : t('na')}</TableCell>
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