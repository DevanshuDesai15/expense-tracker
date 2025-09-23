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

export const useSavingsAccounts = () => {
  const { user } = useAuthContext();
  const [savingsAccounts, setSavingsAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setSavingsAccounts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "savingsAccounts"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const savingsData = [];
        querySnapshot.forEach((doc) => {
          savingsData.push({ ...doc.data(), id: doc.id });
        });
        setSavingsAccounts(savingsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addSavingsAccount = async (accountData) => {
    if (!user) {
      throw new Error("User must be authenticated to add a savings account");
    }

    try {
      const docRef = await addDoc(collection(db, "savingsAccounts"), {
        ...accountData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSavingsAccount = async (id, accountData) => {
    if (!user) {
      throw new Error("User must be authenticated to update a savings account");
    }

    try {
      const docRef = doc(db, "savingsAccounts", id);
      await updateDoc(docRef, {
        ...accountData,
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSavingsAccount = async (id) => {
    if (!user) {
      throw new Error("User must be authenticated to delete a savings account");
    }

    try {
      await deleteDoc(doc(db, "savingsAccounts", id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    savingsAccounts,
    loading,
    error,
    addSavingsAccount,
    updateSavingsAccount,
    deleteSavingsAccount,
  };
};
