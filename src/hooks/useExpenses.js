import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'expenses'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const expenseData = [];
        querySnapshot.forEach((doc) => {
          expenseData.push({ id: doc.id, ...doc.data() });
        });
        setExpenses(expenseData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addExpense = async (expenseData) => {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const docRef = doc(db, 'expenses', id);
      await updateDoc(docRef, {
        ...expenseData,
        updatedAt: new Date()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense
  };
};