import { useState, useEffect } from 'react';
import { useAuthStore } from '../presentation/stores/authStore';
import { GetInterviewsUseCase } from '../application/use-cases/GetInterviewsUseCase';
import { CreateInterviewUseCase } from '../application/use-cases/CreateInterviewUseCase';
import { InterviewRepository } from '../infrastructure/repositories/InterviewRepository';

export const useInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const interviewRepository = new InterviewRepository();
  const getInterviewsUseCase = new GetInterviewsUseCase(interviewRepository);
  const createInterviewUseCase = new CreateInterviewUseCase(interviewRepository);

  const fetchInterviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getInterviewsUseCase.execute({});
      if (result.success) {
        setInterviews(result.data);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError('Erreur lors du chargement des entretiens');
    } finally {
      setLoading(false);
    }
  };

  const createInterview = async (interviewData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createInterviewUseCase.execute(interviewData);
      if (result.success) {
        setInterviews(prev => [...prev, result.data]);
        return { success: true, data: result.data };
      } else {
        setError(result.error.message);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Error creating interview:', err);
      const errorMessage = 'Erreur lors de la création de l\'entretien';
      setError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  return {
    interviews,
    loading,
    error,
    fetchInterviews,
    createInterview,
    refetch: fetchInterviews,
  };
};