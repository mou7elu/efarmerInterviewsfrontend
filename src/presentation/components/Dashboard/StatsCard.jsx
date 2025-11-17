/**
 * Composant StatsCard
 * Affiche une carte de statistique avec icône, titre et valeur
 */

import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = 'primary',
  trend,
  loading = false 
}) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            backgroundColor: `${color}.main`,
            color: 'white',
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {Icon && <Icon sx={{ fontSize: 32 }} />}
        </Box>
        
        {trend && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {trend > 0 ? (
              <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                color: trend > 0 ? 'success.main' : 'error.main',
                fontWeight: 600
              }}
            >
              {Math.abs(trend)}%
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box>
        <Typography variant="h3" component="div" fontWeight="bold" gutterBottom>
          {loading ? '...' : value?.toLocaleString() || 0}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default StatsCard;
