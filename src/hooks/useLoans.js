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

export const useLoans = () => {
  const { user } = useAuthContext();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoans([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "loans"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const loanData = [];
        querySnapshot.forEach((doc) => {
          loanData.push({ ...doc.data(), id: doc.id });
        });
        setLoans(loanData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addLoan = async (loanData) => {
    if (!user) {
      throw new Error("User must be authenticated to add a loan");
    }

    try {
      const docRef = await addDoc(collection(db, "loans"), {
        ...loanData,
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

  const updateLoan = async (id, loanData) => {
    if (!user) {
      throw new Error("User must be authenticated to update a loan");
    }

    try {
      const docRef = doc(db, "loans", id);
      await updateDoc(docRef, {
        ...loanData,
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteLoan = async (id) => {
    if (!user) {
      throw new Error("User must be authenticated to delete a loan");
    }

    try {
      await deleteDoc(doc(db, "loans", id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    loans,
    loading,
    error,
    addLoan,
    updateLoan,
    deleteLoan,
  };
};
