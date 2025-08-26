import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

export const useExpenses = () => {
  const { user } = useAuthContext();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
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
  }, [user]);

  const addExpense = async (expenseData) => {
    if (!user) {
      throw new Error("User must be authenticated to add expenses");
    }

    try {
      const docRef = await addDoc(collection(db, "expenses"), {
        ...expenseData,
        id: uuidv4(),
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateExpense = async (id, expenseData) => {
    if (!user) {
      throw new Error("User must be authenticated to update expenses");
    }

    try {
      const docRef = doc(db, "expenses", id);
      await updateDoc(docRef, {
        ...expenseData,
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    if (!user) {
      throw new Error("User must be authenticated to delete expenses");
    }

    try {
      await deleteDoc(doc(db, "expenses", id));
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
    deleteExpense,
  };
};
