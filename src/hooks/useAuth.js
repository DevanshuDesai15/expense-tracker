import { useState, useEffect, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { sessionManager } from "../utils/sessionManager";
import { logAuthEvent } from "../utils/activityLogger";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(null);

  // Handle session expiration
  const handleSessionExpired = useCallback(async () => {
    try {
      await signOut(auth);
      alert('Your session has expired due to inactivity. Please log in again.');
    } catch (err) {
      console.error('Error during session expiration logout:', err);
    }
  }, []);

  // Monitor session time
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const remaining = sessionManager.getRemainingTime();
      setSessionTimeRemaining(remaining);

      // Warn user when session is about to expire (5 minutes remaining)
      if (remaining === 5) {
        const shouldExtend = confirm(
          'Your session will expire in 5 minutes due to inactivity. Click OK to continue your session.'
        );
        if (shouldExtend) {
          sessionManager.updateActivity();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Initialize session management
        sessionManager.initSession(firebaseUser.uid, handleSessionExpired);

        // Log successful authentication state
        logAuthEvent(firebaseUser.uid, 'login', {
          method: 'state_changed',
        });
      } else {
        setUser(null);
        sessionManager.endSession();
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
      sessionManager.endSession();
    };
  }, [handleSessionExpired]);

  const signUp = async (email, password, displayName = "") => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      // Log signup
      await logAuthEvent(userCredential.user.uid, 'login', {
        method: 'signup',
        email,
      });

      return userCredential.user;
    } catch (err) {
      setError(err.message);

      // Log failed signup attempt
      if (email) {
        await logAuthEvent('unknown', 'login_failed', {
          method: 'signup',
          email,
          error: err.message,
        });
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Log successful login
      await logAuthEvent(userCredential.user.uid, 'login', {
        method: 'email',
      });

      return userCredential.user;
    } catch (err) {
      setError(err.message);

      // Log failed login attempt
      await logAuthEvent('unknown', 'login_failed', {
        method: 'email',
        email,
        error: err.message,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Log successful Google login
      await logAuthEvent(userCredential.user.uid, 'login', {
        method: 'google',
      });

      return userCredential.user;
    } catch (err) {
      setError(err.message);

      // Log failed Google login attempt
      await logAuthEvent('unknown', 'login_failed', {
        method: 'google',
        error: err.message,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);

      if (user) {
        // Log logout
        await logAuthEvent(user.uid, 'logout', {
          manual: true,
        });
      }

      // End session
      sessionManager.endSession();

      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user,
    sessionTimeRemaining,
  };
};
