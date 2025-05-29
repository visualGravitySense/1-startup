// React хуки для работы с Firebase
import { useState, useEffect } from 'react';
import { 
  dashboardService, 
  preorderService, 
  automationService, 
  interviewService 
} from '../firebase/service.js';

// ========== ОСНОВНОЙ ДАШБОРД ==========
export function useDashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const overview = await dashboardService.getOverview();
        setData(overview);
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard overview:', err);
        setError(err.message);
        setData(dashboardService.getDefaultOverview());
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const overview = await dashboardService.getOverview();
      setData(overview);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh };
}

// ========== ПРЕДЗАКАЗЫ ==========
export function usePreorders(realTime = false) {
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (realTime) {
      // Real-time подписка
      setLoading(true);
      const unsubscribe = preorderService.subscribe((data) => {
        setPreorders(data);
        setLoading(false);
        setError(null);
      });

      return () => unsubscribe();
    } else {
      // Одноразовая загрузка
      const loadPreorders = async () => {
        try {
          setLoading(true);
          const data = await preorderService.getAll();
          setPreorders(data);
          setError(null);
        } catch (err) {
          console.error('Error loading preorders:', err);
          setError(err.message);
          setPreorders([]);
        } finally {
          setLoading(false);
        }
      };

      loadPreorders();
    }
  }, [realTime]);

  const addPreorder = async (preorderData) => {
    try {
      await preorderService.add(preorderData);
      // Если не real-time, обновляем вручную
      if (!realTime) {
        const updated = await preorderService.getAll();
        setPreorders(updated);
      }
    } catch (err) {
      console.error('Error adding preorder:', err);
      throw err;
    }
  };

  return { preorders, loading, error, addPreorder };
}

// ========== АВТОПОСТИНГ ==========
export function useAutomation() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await automationService.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error loading automation stats:', err);
        setError(err.message);
        setStats({
          totalPosts: 0,
          thisWeek: 0,
          platforms: {},
          lastPost: null
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const addPost = async (postData) => {
    try {
      await automationService.addPost(postData);
      // Обновляем статистику
      const updated = await automationService.getStats();
      setStats(updated);
    } catch (err) {
      console.error('Error adding post:', err);
      throw err;
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await automationService.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, addPost, refresh };
}

// ========== ИНТЕРВЬЮ ==========
export function useInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [interviewsData, statsData] = await Promise.all([
          interviewService.getAll(),
          interviewService.getStats()
        ]);
        setInterviews(interviewsData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Error loading interviews:', err);
        setError(err.message);
        setInterviews([]);
        setStats({ total: 0, completed: 0, scheduled: 0, avgRating: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addInterview = async (interviewData) => {
    try {
      await interviewService.add(interviewData);
      // Обновляем данные
      const [interviewsData, statsData] = await Promise.all([
        interviewService.getAll(),
        interviewService.getStats()
      ]);
      setInterviews(interviewsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error adding interview:', err);
      throw err;
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const [interviewsData, statsData] = await Promise.all([
        interviewService.getAll(),
        interviewService.getStats()
      ]);
      setInterviews(interviewsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { interviews, stats, loading, error, addInterview, refresh };
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ХУКИ ==========

// Хук для обработки состояния загрузки
export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);

  const withLoading = async (asyncFn) => {
    setLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return { loading, setLoading, withLoading };
}

// Хук для уведомлений
export function useNotification() {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const showSuccess = (message) => showNotification(message, 'success');
  const showError = (message) => showNotification(message, 'error');
  const showWarning = (message) => showNotification(message, 'warning');

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning
  };
} 