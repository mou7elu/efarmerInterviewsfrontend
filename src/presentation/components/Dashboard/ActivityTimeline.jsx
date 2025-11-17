/**
 * Composant ActivityTimeline
 * Affiche une timeline des activités récentes
 */

import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Box,
  Skeleton
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Agriculture as AgricultureIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ActivityTimeline = ({ activities = [], loading = false, maxItems = 10 }) => {
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'producteur':
        return <PersonAddIcon color="primary" />;
      case 'parcelle':
        return <AgricultureIcon color="success" />;
      case 'menage':
        return <HomeIcon color="info" />;
      default:
        return <ScheduleIcon color="action" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'producteur':
        return 'primary';
      case 'parcelle':
        return 'success';
      case 'menage':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="600">
          Activités Récentes
        </Typography>
        <List>
          {[1, 2, 3, 4, 5].map((i) => (
            <ListItem key={i} divider>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={60} />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="600">
          Activités Récentes
        </Typography>
        <Chip 
          label={`${activities.length} au total`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </Box>

      {displayedActivities.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            Aucune activité récente
          </Typography>
        </Box>
      ) : (
        <List>
          {displayedActivities.map((activity, index) => (
            <ListItem 
              key={index} 
              divider={index < displayedActivities.length - 1}
              sx={{ 
                px: 0,
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderRadius: 1
                }
              }}
            >
              <ListItemIcon>
                {getActivityIcon(activity.type)}
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">
                      {activity.title}
                    </Typography>
                    <Chip 
                      label={activity.type} 
                      size="small" 
                      color={getActivityColor(activity.type)}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(activity.date, { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default ActivityTimeline;
