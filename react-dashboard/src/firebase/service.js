// Firebase Service - функции для работы с данными
import { db } from './config.js';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

// ========== ПРЕДЗАКАЗЫ ==========
export const preorderService = {
  // Получить все предзаказы
  async getAll() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'preorders'), orderBy('timestamp', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting preorders:', error);
      return [];
    }
  },

  // Подписка на изменения предзаказов (real-time)
  subscribe(callback) {
    return onSnapshot(
      query(collection(db, 'preorders'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const preorders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(preorders);
      },
      (error) => {
        console.error('Error in preorders subscription:', error);
        callback([]);
      }
    );
  },

  // Добавить новый предзаказ
  async add(preorderData) {
    try {
      const docRef = await addDoc(collection(db, 'preorders'), {
        ...preorderData,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding preorder:', error);
      throw error;
    }
  }
};

// ========== АВТОПОСТИНГ ==========
export const automationService = {
  // Получить статистику постов
  async getStats() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'posts'), orderBy('timestamp', 'desc'))
      );
      const posts = querySnapshot.docs.map(doc => doc.data());
      
      return {
        totalPosts: posts.length,
        thisWeek: posts.filter(post => {
          const postDate = post.timestamp?.toDate();
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return postDate && postDate > weekAgo;
        }).length,
        platforms: this.groupByPlatform(posts),
        lastPost: posts[0] || null
      };
    } catch (error) {
      console.error('Error getting automation stats:', error);
      return {
        totalPosts: 0,
        thisWeek: 0,
        platforms: {},
        lastPost: null
      };
    }
  },

  groupByPlatform(posts) {
    return posts.reduce((acc, post) => {
      const platform = post.platform || 'unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});
  },

  // Добавить новый пост
  async addPost(postData) {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }
};

// ========== ИНТЕРВЬЮ ==========
export const interviewService = {
  // Получить все интервью
  async getAll() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'interviews'), orderBy('date', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting interviews:', error);
      return [];
    }
  },

  // Получить статистику интервью
  async getStats() {
    try {
      const interviews = await this.getAll();
      
      return {
        total: interviews.length,
        completed: interviews.filter(i => i.status === 'completed').length,
        scheduled: interviews.filter(i => i.status === 'scheduled').length,
        avgRating: this.calculateAvgRating(interviews)
      };
    } catch (error) {
      console.error('Error getting interview stats:', error);
      return { total: 0, completed: 0, scheduled: 0, avgRating: 0 };
    }
  },

  calculateAvgRating(interviews) {
    const completedWithRating = interviews.filter(i => 
      i.status === 'completed' && i.rating
    );
    if (completedWithRating.length === 0) return 0;
    
    const sum = completedWithRating.reduce((acc, i) => acc + i.rating, 0);
    return Math.round((sum / completedWithRating.length) * 10) / 10;
  },

  // Добавить новое интервью
  async add(interviewData) {
    try {
      const docRef = await addDoc(collection(db, 'interviews'), {
        ...interviewData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding interview:', error);
      throw error;
    }
  }
};

// ========== ОБЩАЯ СТАТИСТИКА ==========
export const dashboardService = {
  // Получить общую статистику для главной страницы
  async getOverview() {
    try {
      const [preorders, automationStats, interviewStats] = await Promise.all([
        preorderService.getAll(),
        automationService.getStats(),
        interviewService.getStats()
      ]);

      // Расчет выручки
      const totalRevenue = preorders.reduce((sum, order) => {
        const amount = parseFloat(order.amount) || 24; // дефолт $24
        return sum + amount;
      }, 0);

      // Конверсия (примерная)
      const conversion = preorders.length > 0 ? 
        Math.round((preorders.length / (automationStats.totalPosts || 1)) * 100 * 10) / 10 : 0;

      return {
        preorders: {
          count: preorders.length,
          revenue: totalRevenue,
          target: 10,
          progress: Math.round((preorders.length / 10) * 100)
        },
        automation: {
          postsThisWeek: automationStats.thisWeek,
          totalPosts: automationStats.totalPosts,
          platforms: Object.keys(automationStats.platforms).length,
          lastPost: automationStats.lastPost
        },
        interviews: {
          total: interviewStats.total,
          completed: interviewStats.completed,
          rating: interviewStats.avgRating
        },
        metrics: {
          conversion: conversion,
          weeklyGoal: 5, // постов в неделю
          revenueGoal: 240 // $240 цель
        }
      };
    } catch (error) {
      console.error('Error getting dashboard overview:', error);
      return this.getDefaultOverview();
    }
  },

  getDefaultOverview() {
    return {
      preorders: { count: 0, revenue: 0, target: 10, progress: 0 },
      automation: { postsThisWeek: 0, totalPosts: 0, platforms: 0, lastPost: null },
      interviews: { total: 0, completed: 0, rating: 0 },
      metrics: { conversion: 0, weeklyGoal: 5, revenueGoal: 240 }
    };
  }
}; 