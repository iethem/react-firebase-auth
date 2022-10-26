import React, { useState, useEffect, useContext, createContext } from 'react';
import * as firebase from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_MESSAGING_APP_ID,
};

if (!firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
}

const firebaseAuth = getAuth();
export const getFirebaseAuth = () => firebaseAuth;

let AuthContext = createContext<any>(null!);

export function AuthProvider({ children }: any) {
  const auth = useAuthProvider();
  return (
    <AuthContext.Provider value={auth}>
      {auth.loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useAuthProvider() {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState<any>(true);

  const signOut = () => {
    setLoading(true);
    firebaseAuth.signOut();
    setLoading(false);
  };

  useEffect(() => {
    const firebaseAuth = getAuth();
    const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signOut,
  };
}
