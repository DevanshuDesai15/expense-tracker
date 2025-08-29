import React, { useState, useEffect } from "react";
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
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthContext } from "../contexts/AuthContext";
import { DEFAULT_EXPENSE_CATEGORIES } from "../data/defaultCategories";

export const useCategories = () => {
  const { user } = useAuthContext();
  const [userCategories, setUserCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Initialize user categories with defaults if first time
  const initializeUserCategories = async () => {
    if (!user || hasInitialized || isInitializing) return;

    console.log("Starting category initialization for user:", user.uid);
    setIsInitializing(true);

    try {
      // Check if user already has categories
      const q = query(
        collection(db, "categories"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("First time user - initializing with default categories");
        // First time user - copy default categories one by one to avoid duplicates
        for (const defaultCat of DEFAULT_EXPENSE_CATEGORIES) {
          // Check if this specific category already exists (extra safety)
          const existingCatQuery = query(
            collection(db, "categories"),
            where("userId", "==", user.uid),
            where("categoryId", "==", defaultCat.id)
          );
          const existingCat = await getDocs(existingCatQuery);

          if (existingCat.empty) {
            await addDoc(collection(db, "categories"), {
              categoryId: defaultCat.id,
              name: defaultCat.name,
              budgetAmount: defaultCat.budgetAmount,
              isDefault: true,
              userId: user.uid,
              userEmail: user.email,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            console.log(`Added category: ${defaultCat.name}`);
          } else {
            console.log(`Category ${defaultCat.name} already exists, skipping`);
          }
        }
        console.log("Successfully initialized user categories with defaults");
      } else {
        console.log(
          `User already has ${querySnapshot.size} categories, skipping initialization`
        );
      }

      setHasInitialized(true);
    } catch (err) {
      console.error("Error initializing categories:", err);
      setError(err.message);
      setHasInitialized(true); // Set to true anyway to avoid infinite loops
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setUserCategories([]);
      setLoading(false);
      setHasInitialized(false);
      setIsInitializing(false);
      setConnectionError(false);
      return;
    }

    console.log("Setting up Firebase listener for user categories");

    // Test Firebase connection first
    const testConnection = async () => {
      try {
        const testQuery = query(
          collection(db, "categories"),
          where("userId", "==", user.uid)
        );
        await getDocs(testQuery);
        console.log("✅ Firebase connection successful");
        setConnectionError(false);
      } catch (err) {
        console.error("❌ Firebase connection failed:", err);
        setConnectionError(true);
        setError(`Firebase connection error: ${err.message}`);
        setLoading(false);
        return;
      }
    };

    testConnection();

    const q = query(
      collection(db, "categories"),
      where("userId", "==", user.uid),
      orderBy("name", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        console.log("📥 Firebase snapshot received");
        const categoryData = [];
        querySnapshot.forEach((doc) => {
          categoryData.push({
            docId: doc.id, // Store the document ID for editing/deleting
            id: doc.data().categoryId,
            ...doc.data(),
          });
        });

        console.log(
          `✅ Loaded ${categoryData.length} user categories:`,
          categoryData
        );
        setUserCategories(categoryData);
        setLoading(false);
        setConnectionError(false);

        // Initialize categories for first-time users only if no categories exist
        if (categoryData.length === 0 && !hasInitialized && !isInitializing) {
          console.log("📋 No categories found, triggering initialization");
          initializeUserCategories();
        }
      },
      (err) => {
        console.error("❌ Firebase listener error:", err);
        setError(`Firebase listener error: ${err.message}`);
        setConnectionError(true);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Show user categories if available, otherwise show defaults as fallback
  const allCategories = React.useMemo(() => {
    if (userCategories.length > 0) {
      // Use user categories from Firebase
      return userCategories.map((cat) => ({
        id: cat.categoryId || cat.id,
        name: cat.name,
        budgetAmount: cat.budgetAmount || 0,
        isCustom: !cat.isDefault,
        docId: cat.docId, // Include document ID for editing/deleting
      }));
    } else if (connectionError || error) {
      // If Firebase is having issues, show defaults as read-only fallback
      return DEFAULT_EXPENSE_CATEGORIES.map((cat) => ({
        ...cat,
        isCustom: false,
        isReadOnly: true, // Mark as read-only when using fallback
      }));
    } else {
      // Loading or initializing - show defaults temporarily
      return DEFAULT_EXPENSE_CATEGORIES;
    }
  }, [userCategories, connectionError, error]);

  const addCategory = async (categoryData) => {
    if (!user) {
      throw new Error("User must be authenticated to add categories");
    }

    try {
      // Generate a unique ID for the category
      const categoryId =
        categoryData.name
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .replace(/\s+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        Date.now();

      const docRef = await addDoc(collection(db, "categories"), {
        categoryId,
        name: categoryData.name,
        budgetAmount: categoryData.budgetAmount || 0,
        isDefault: false, // User-added categories are not default
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

  const updateCategory = async (docId, categoryData) => {
    if (!user) {
      throw new Error("User must be authenticated to update categories");
    }

    try {
      await updateDoc(doc(db, "categories", docId), {
        ...categoryData,
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCategory = async (docId) => {
    if (!user) {
      throw new Error("User must be authenticated to delete categories");
    }

    try {
      await deleteDoc(doc(db, "categories", docId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getCategoryById = (categoryId) => {
    return allCategories.find((cat) => cat.id === categoryId);
  };

  const getCategoryName = (categoryId) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : categoryId;
  };

  const forceInitializeCategories = async () => {
    console.log("🔄 Force reinitializing categories...");
    setHasInitialized(false);
    setConnectionError(false);
    setError(null);
    setLoading(true);
    await initializeUserCategories();
  };

  const cleanupDuplicateCategories = async () => {
    if (!user) return;

    try {
      console.log("Starting duplicate cleanup...");
      const q = query(
        collection(db, "categories"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const categoryMap = new Map();
      const duplicates = [];

      // Group categories by categoryId
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const categoryId = data.categoryId;

        if (categoryMap.has(categoryId)) {
          // This is a duplicate
          duplicates.push(doc.id);
        } else {
          // Keep the first one we encounter
          categoryMap.set(categoryId, doc.id);
        }
      });

      // Delete duplicates
      console.log(`Found ${duplicates.length} duplicate categories to remove`);
      for (const duplicateDocId of duplicates) {
        await deleteDoc(doc(db, "categories", duplicateDocId));
        console.log(`Deleted duplicate category: ${duplicateDocId}`);
      }

      console.log("Duplicate cleanup completed");
    } catch (err) {
      console.error("Error cleaning up duplicates:", err);
      setError(err.message);
    }
  };

  return {
    allCategories,
    userCategories,
    loading,
    error,
    connectionError,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryName,
    forceInitializeCategories,
    cleanupDuplicateCategories,
    hasUserCategories: userCategories.length > 0,
    isInitializing,
    isUsingFallback: (connectionError || error) && userCategories.length === 0,
  };
};
