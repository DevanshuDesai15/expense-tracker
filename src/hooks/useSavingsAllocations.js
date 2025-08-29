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

export const useSavingsAllocations = () => {
  const { user } = useAuthContext();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setAllocations([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "savingsAllocations"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const allocationData = [];
        querySnapshot.forEach((doc) => {
          allocationData.push({ id: doc.id, ...doc.data() });
        });
        setAllocations(allocationData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addAllocation = async (allocationData) => {
    if (!user) {
      throw new Error("User must be authenticated to add savings allocation");
    }

    try {
      const docRef = await addDoc(collection(db, "savingsAllocations"), {
        ...allocationData,
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

  const updateAllocation = async (id, allocationData) => {
    try {
      const allocationRef = doc(db, "savingsAllocations", id);
      await updateDoc(allocationRef, {
        ...allocationData,
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAllocation = async (id) => {
    try {
      const allocationRef = doc(db, "savingsAllocations", id);
      await deleteDoc(allocationRef);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    allocations,
    loading,
    error,
    addAllocation,
    updateAllocation,
    deleteAllocation,
  };
};
