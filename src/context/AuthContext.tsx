import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  setPersistence,
  browserLocalPersistence,
  linkWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (phoneNumber: string, recaptchaContainerId: string) => Promise<ConfirmationResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const sendOTP = async (phoneNumber: string, recaptchaContainerId: string) => {
    if (!auth.currentUser) throw new Error("User must be logged in to link phone");

    let verifier = recaptchaVerifier;
    if (!verifier) {
      verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: "invisible",
      });
      setRecaptchaVerifier(verifier);
    }

    try {
      const confirmationResult = await linkWithPhoneNumber(auth.currentUser, phoneNumber, verifier);
      return confirmationResult;
    } catch (error) {
      console.error("Failed to send OTP:", error);
      verifier.clear(); // Reset on failure
      setRecaptchaVerifier(null);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, sendOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
