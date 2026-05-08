import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from './firebase';
import { UserProfile } from './types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  updateProfileData: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    if (!db) return null;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UserProfile;
      }
    } catch (err) {
      console.error("Erro ao buscar perfil do Firestore:", err);
    }
    return null;
  };

  const signIn = async (email: string, pass: string) => {
    if (auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Demo Mode
      setUser({ email, displayName: email.split('@')[0], uid: 'demo-user' } as any);
      setProfile({ id: 'demo-user', name: email.split('@')[0], avatar: '', plan: 'Free', role: 'reader' });
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    if (auth && db) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      
      const newProfile: UserProfile = {
        id: cred.user.uid,
        name: name,
        avatar: '',
        plan: 'Free',
        role: 'reader'
      };
      try {
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      } catch (err) {
        console.error("Erro ao salvar perfil no Firestore. O banco de dados foi criado no Firebase Console?", err);
      }
      setProfile(newProfile);
    } else {
      // Demo Mode
      setUser({ email, displayName: name, uid: 'demo-user' } as any);
      setProfile({ id: 'demo-user', name: name, avatar: '', plan: 'Free', role: 'reader' });
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setProfile(null);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (user && db) {
      const docRef = doc(db, 'users', user.uid);
      try {
        await setDoc(docRef, data, { merge: true });
      } catch (err) {
        console.error("Erro ao atualizar Firestore. O banco de dados foi criado no Firebase Console?", err);
      }
      if (profile) {
        setProfile({ ...profile, ...data });
      }
    }
  };

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized. Running in Demo Mode.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userProfile = await fetchProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          // Fallback se n tiver perfil no db ainda
          setProfile({
            id: user.uid,
            name: user.displayName || 'Usuário',
            avatar: user.photoURL || '',
            plan: 'Free',
            role: 'reader'
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, logout, updateProfileData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
