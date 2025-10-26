/**
 * Dashboard Page
 * Page d'accueil avec vue d'ensemble des données
 */

import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  TextField,
  FormControlLabel,
  Switch

} from '@mui/material';
import html2pdf from 'html2pdf.js';
import {
  Event as EventIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { useAuthStore } from '@presentation/stores/authStore.js';
import { interviewsAPI, producteursAPI, questionnairesAPI } from '../../../services/api.js';
import LoadingSpinner from '@presentation/components/Common/LoadingSpinner.jsx';

const DashboardPage = () => {
  const exportRef = React.useRef();

  // Export as HTML
  const handleExportHTML = () => {
    const htmlContent = exportRef.current?.innerHTML;
    const win = window.open('', '', 'width=900,height=700');
    win.document.write('<html><head><title>Export HTML</title></head><body>' + htmlContent + '</body></html>');
    win.document.close();
  };

  // Export as PDF
  const handleExportPDF = () => {
    if (exportRef.current) {
      html2pdf().set({ filename: 'dashboard.pdf' }).from(exportRef.current).save();
    }
  };
  const [showAll, setShowAll] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let interviewsRes;
        let interviews = [];
        let filterStart, filterEnd;
        if (showAll) {
          interviewsRes = await interviewsAPI.getAll();
          interviews = interviewsRes.interviews || interviewsRes.data || interviewsRes || [];
        } else {
          if (startDate && endDate) {
            filterStart = new Date(startDate);
            filterEnd = new Date(endDate);
          } else {
            const today = new Date();
            filterStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            filterEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
          }
          if (interviewsAPI.getByDate) {
            interviewsRes = await interviewsAPI.getByDate(filterStart, filterEnd);
            interviews = interviewsRes.interviews || interviewsRes.data || interviewsRes || [];
          } else {
            interviewsRes = await interviewsAPI.getAll();
            interviews = (interviewsRes.interviews || interviewsRes.data || interviewsRes || []).filter(r => {
              const created = new Date(r.createdAt);
              return created >= filterStart && created <= filterEnd;
            });
          }
        }
        const total = interviews.length;
        const completed = interviews.filter(r => {
          if (typeof r.isCompleted !== 'undefined') return r.isCompleted;
          return Array.isArray(r.reponses) && r.reponses.some(rep => rep.valeur && rep.valeur !== '');
        }).length;
        const inProgress = total - completed;
        setStats({ total, completed, inProgress });
        setResponsesToday(interviews);
        const exploitantsSet = new Set();
        interviews.forEach(r => {
          if (r.exploitantId && r.exploitantId.$oid) {
            exploitantsSet.add(r.exploitantId.$oid);
          } else if (typeof r.exploitantId === 'string') {
            exploitantsSet.add(r.exploitantId);
          }
        });
        const repartitionQuestionnaire = {};
        interviews.forEach(r => {
          const qid = r.questionnaireId?.$oid || r.questionnaireId || 'N/A';
          repartitionQuestionnaire[qid] = (repartitionQuestionnaire[qid] || 0) + 1;
        });
        const entretiensParHeure = {};
        interviews.forEach(r => {
          const h = new Date(r.createdAt).getHours();
          entretiensParHeure[h] = (entretiensParHeure[h] || 0) + 1;
        });
        setKpi({
          producteursUniques: exploitantsSet.size,
          repartitionQuestionnaire,
          entretiensParHeure
        });
      } catch (err) {
        setStats({ total: 0, completed: 0, inProgress: 0 });
        setResponsesToday([]);
        setKpi({ producteursUniques: 0, repartitionQuestionnaire: {}, entretiensParHeure: {} });
      }
    };
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(intervalId);
  }, [showAll, startDate, endDate]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });
  const [responsesToday, setResponsesToday] = useState([]);
  const [kpi, setKpi] = useState({ producteursUniques: 0, repartitionQuestionnaire: {}, entretiensParHeure: {} });
  const user = useAuthStore((state) => state.user);

  // TODO: Add useEffect to fetch stats, responsesToday, and kpi from API

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Bienvenue, {user?.fullName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vue synthétique des indicateurs clés (KPI) sur les entretiens
        </Typography>
        <Box mt={2} display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={<Switch checked={showAll} onChange={e => setShowAll(e.target.checked)} />}
            label="Afficher tous les entretiens"
          />
          {!showAll && (
            <>
              <TextField
                label="Date début"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={startDate ? startDate : ''}
                onChange={e => setStartDate(e.target.value)}
              />
              <TextField
                label="Date fin"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={endDate ? endDate : ''}
                onChange={e => setEndDate(e.target.value)}
              />
            </>
          )}
        </Box>
      </Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <EventIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">{stats.total}</Typography>
            <Typography color="text.secondary">Entretiens du jour</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">{stats.completed}</Typography>
            <Typography color="text.secondary">Complétés</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <PeopleIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">{stats.inProgress}</Typography>
            <Typography color="text.secondary">En cours</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <ScheduleIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" component="div">{kpi.producteursUniques}</Typography>
            <Typography color="text.secondary">Producteurs uniques</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Répartition des entretiens par questionnaire</Typography>
            <Pie
              data={{
                labels: Object.keys(kpi.repartitionQuestionnaire),
                datasets: [{
                  data: Object.values(kpi.repartitionQuestionnaire),
                  backgroundColor: [
                    '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1', '#c2185b', '#ffa000', '#388e3c', '#fbc02d'
                  ],
                }],
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Entretiens par heure</Typography>
            <Bar
              data={{
                labels: Object.keys(kpi.entretiensParHeure).map(h => `${h}h`),
                datasets: [{
                  label: 'Nombre d’entretiens',
                  data: Object.values(kpi.entretiensParHeure),
                  backgroundColor: '#1976d2',
                }],
              }}
              options={{
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h2">
                  Détail des entretiens du jour ({responsesToday.length})
                </Typography>
              </Box>
              {responsesToday.length === 0 ? (
                <Typography color="text.secondary">Aucun entretien enregistré aujourd'hui</Typography>
              ) : (
                <List>
                  {responsesToday.map((r) => (
                    <ListItem key={r.id} divider>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Exploitant: ${r.exploitantId?.$oid || r.exploitantId || 'inconnu'}`}
                        secondary={`Questionnaire: ${r.questionnaireId?.$oid || r.questionnaireId || 'N/A'} | Créé à: ${format(new Date(r.createdAt), 'HH:mm', { locale: fr })}`}
                      />
                      <Chip
                        label={r.isCompleted ? 'Complété' : 'En cours'}
                        color={r.isCompleted ? 'success' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;