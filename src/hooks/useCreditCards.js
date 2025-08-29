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

export const useCreditCards = () => {
  const { user } = useAuthContext();
  const [creditCards, setCreditCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setCreditCards([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "creditCards"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const cardData = [];
        querySnapshot.forEach((doc) => {
          cardData.push({ id: doc.id, ...doc.data() });
        });
        setCreditCards(cardData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addCreditCard = async (cardData) => {
    if (!user) {
      throw new Error("User must be authenticated to add credit card");
    }

    try {
      const docRef = await addDoc(collection(db, "creditCards"), {
        ...cardData,
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

  const updateCreditCard = async (id, cardData) => {
    try {
      const cardRef = doc(db, "creditCards", id);
      await updateDoc(cardRef, {
        ...cardData,
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCreditCard = async (id) => {
    try {
      const cardRef = doc(db, "creditCards", id);
      await deleteDoc(cardRef);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    creditCards,
    loading,
    error,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
  };
};
