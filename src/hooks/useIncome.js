import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  orderBy,
  query 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

export const useIncome = () => {
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'income'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const incomeData = [];
        querySnapshot.forEach((doc) => {
          incomeData.push({ id: doc.id, ...doc.data() });
        });
        setIncomeEntries(incomeData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addIncome = async (incomeData) => {
    try {
      const docRef = await addDoc(collection(db, 'income'), {
        ...incomeData,
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

  const updateIncome = async (id, incomeData) => {
    try {
      const docRef = doc(db, 'income', id);
      await updateDoc(docRef, {
        ...incomeData,
        updatedAt: new Date()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteIncome = async (id) => {
    try {
      await deleteDoc(doc(db, 'income', id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    incomeEntries,
    loading,
    error,
    addIncome,
    updateIncome,
    deleteIncome
  };
};