/**
 * Interview Store
 * Store global pour la gestion des entretiens avec Zustand
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GetInterviewsUseCase } from '@application/use-cases/GetInterviewsUseCase.js';
import { CreateInterviewUseCase } from '@application/use-cases/CreateInterviewUseCase.js';
import { ApiInterviewRepository } from '@infrastructure/repositories/ApiInterviewRepository.js';
import { ApiUserRepository } from '@infrastructure/repositories/ApiUserRepository.js';

// Repositories
const interviewRepository = new ApiInterviewRepository();
const userRepository = new ApiUserRepository();

export const useInterviewStore = create(
  subscribeWithSelector((set, get) => ({
    // État
    interviews: [],
    currentInterview: null,
    isLoading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    },
    filters: {},
    sorting: {
      field: 'scheduledDate',
      direction: 'desc'
    },

    // Use cases
    getInterviewsUseCase: new GetInterviewsUseCase(interviewRepository),
    createInterviewUseCase: new CreateInterviewUseCase(interviewRepository, userRepository),

    // Actions
    loadInterviews: async (user, filters = {}, sorting = null, pagination = null) => {
      try {
        set({ isLoading: true, error: null });

        const currentState = get();
        const finalSorting = sorting || currentState.sorting;
        const finalPagination = pagination || { 
          page: currentState.pagination.page, 
          limit: currentState.pagination.limit 
        };

        const result = await currentState.getInterviewsUseCase.execute({
          user,
          filters,
          sorting: finalSorting,
          pagination: finalPagination
        });

        set({
          interviews: result.interviews,
          pagination: result.pagination,
          filters: result.filters,
          sorting: finalSorting,
          isLoading: false,
          error: null
        });

        return result;
      } catch (error) {
        set({
          interviews: [],
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    createInterview: async (user, interviewData) => {
      try {
        set({ isLoading: true, error: null });

        const result = await get().createInterviewUseCase.execute({
          user,
          ...interviewData
        });

        // Recharger la liste des entretiens
        await get().loadInterviews(user);

        set({
          currentInterview: result.interview,
          isLoading: false,
          error: null
        });

        return result;
      } catch (error) {
        set({
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    loadInterview: async (id) => {
      try {
        set({ isLoading: true, error: null });

        const interview = await interviewRepository.findById(id);
        
        if (!interview) {
          throw new Error('Entretien non trouvé');
        }

        set({
          currentInterview: interview,
          isLoading: false,
          error: null
        });

        return interview;
      } catch (error) {
        set({
          currentInterview: null,
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    updateInterview: async (id, updateData) => {
      try {
        set({ isLoading: true, error: null });

        const updatedInterview = await interviewRepository.update(id, updateData);

        // Mettre à jour dans la liste
        const interviews = get().interviews.map(interview =>
          interview.id === id ? updatedInterview : interview
        );

        set({
          interviews,
          currentInterview: updatedInterview,
          isLoading: false,
          error: null
        });

        return updatedInterview;
      } catch (error) {
        set({
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    deleteInterview: async (id) => {
      try {
        set({ isLoading: true, error: null });

        await interviewRepository.delete(id);

        // Supprimer de la liste
        const interviews = get().interviews.filter(interview => interview.id !== id);

        set({
          interviews,
          currentInterview: null,
          isLoading: false,
          error: null
        });

        return true;
      } catch (error) {
        set({
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    startInterview: async (id) => {
      try {
        set({ isLoading: true, error: null });

        const updatedInterview = await interviewRepository.startInterview(id);

        // Mettre à jour dans la liste
        const interviews = get().interviews.map(interview =>
          interview.id === id ? updatedInterview : interview
        );

        set({
          interviews,
          currentInterview: updatedInterview,
          isLoading: false,
          error: null
        });

        return updatedInterview;
      } catch (error) {
        set({
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    completeInterview: async (id, completionData) => {
      try {
        set({ isLoading: true, error: null });

        const updatedInterview = await interviewRepository.completeInterview(id, completionData);

        // Mettre à jour dans la liste
        const interviews = get().interviews.map(interview =>
          interview.id === id ? updatedInterview : interview
        );

        set({
          interviews,
          currentInterview: updatedInterview,
          isLoading: false,
          error: null
        });

        return updatedInterview;
      } catch (error) {
        set({
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    cancelInterview: async (id, reason = '') => {
      try {
        set({ isLoading: true, error: null });

        const updatedInterview = await interviewRepository.cancelInterview(id, reason);

        // Mettre à jour dans la liste
        const interviews = get().interviews.map(interview =>
          interview.id === id ? updatedInterview : interview
        );

        set({
          interviews,
          currentInterview: updatedInterview,
          isLoading: false,
          error: null
        });

        return updatedInterview;
      } catch (error) {
        set({
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    rescheduleInterview: async (id, newDate) => {
      try {
        set({ isLoading: true, error: null });

        const updatedInterview = await interviewRepository.rescheduleInterview(id, newDate);

        // Mettre à jour dans la liste
        const interviews = get().interviews.map(interview =>
          interview.id === id ? updatedInterview : interview
        );

        set({
          interviews,
          currentInterview: updatedInterview,
          isLoading: false,
          error: null
        });

        return updatedInterview;
      } catch (error) {
        set({
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    // Gestion des filtres et pagination
    setFilters: (filters) => {
      set({ filters });
    },

    setSorting: (sorting) => {
      set({ sorting });
    },

    setPage: (page) => {
      set({ 
        pagination: { 
          ...get().pagination, 
          page 
        } 
      });
    },

    setLimit: (limit) => {
      set({ 
        pagination: { 
          ...get().pagination, 
          limit,
          page: 1 // Reset à la première page
        } 
      });
    },

    clearCurrentInterview: () => {
      set({ currentInterview: null });
    },

    clearError: () => {
      set({ error: null });
    },

    // Getters
    getInterviewById: (id) => {
      const { interviews } = get();
      return interviews.find(interview => interview.id === id);
    },

    getTodaysInterviews: () => {
      const { interviews } = get();
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      return interviews.filter(interview => {
        const interviewDate = new Date(interview.scheduledDate);
        return interviewDate >= startOfDay && interviewDate <= endOfDay;
      });
    },

    getUpcomingInterviews: (days = 7) => {
      const { interviews } = get();
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      return interviews.filter(interview => {
        const interviewDate = new Date(interview.scheduledDate);
        return interviewDate >= now && interviewDate <= futureDate;
      });
    }
  }))
);