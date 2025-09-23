import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

export const useIncome = () => {
  const { user } = useAuthContext();
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setIncomeEntries([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "income"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const incomeData = [];
        querySnapshot.forEach((doc) => {
          incomeData.push({ ...doc.data(), id: doc.id });
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
  }, [user]);

  const addIncome = async (incomeData) => {
    if (!user) {
      throw new Error("User must be authenticated to add income");
    }

    try {
      const docRef = await addDoc(collection(db, "income"), {
        ...incomeData,
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

  const updateIncome = async (id, incomeData) => {
    if (!user) {
      throw new Error("User must be authenticated to update income");
    }

    try {
      const docRef = doc(db, "income", id);
      await updateDoc(docRef, {
        ...incomeData,
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteIncome = async (id) => {
    if (!user) {
      throw new Error("User must be authenticated to delete income");
    }

    try {
      await deleteDoc(doc(db, "income", id));
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
    deleteIncome,
  };
};
