/**
 * Composant ChartSection
 * Section pour afficher des graphiques avec Chart.js
 */

import React from 'react';
import { Paper, Box, Typography, Skeleton } from '@mui/material';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const ChartSection = ({ 
  title, 
  type = 'bar', 
  data, 
  options = {},
  height = 300,
  loading = false 
}) => {
  
  // Options par défaut
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
      },
    },
    ...options,
  };

  // Sélectionner le type de graphique
  const renderChart = () => {
    if (loading) {
      return <Skeleton variant="rectangular" height={height} />;
    }

    const chartProps = {
      data,
      options: defaultOptions,
      height,
    };

    switch (type) {
      case 'pie':
        return <Pie {...chartProps} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      case 'line':
        return <Line {...chartProps} />;
      case 'bar':
      default:
        return <Bar {...chartProps} />;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      {title && (
        <Typography variant="h6" gutterBottom fontWeight="600">
          {title}
        </Typography>
      )}
      
      <Box sx={{ height, mt: 2 }}>
        {renderChart()}
      </Box>
    </Paper>
  );
};

export default ChartSection;
