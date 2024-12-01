import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('Setting up auth state...');
    
    const setupAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session:', initialSession);
        
        if (initialSession) {
          setSession(initialSession);
          setIsAuthenticated(true);
          setUser({ id: initialSession.user.id });
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
          console.log('Auth state changed:', _event, currentSession);
          if (currentSession) {
            setSession(currentSession);
            setIsAuthenticated(true);
            setUser({ id: currentSession.user.id });
          } else {
            setSession(null);
            setIsAuthenticated(false);
            setUser(null);
          }
        });

        return () => {
          console.log('Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up auth:', error);
        toast.error('Authentication setup failed');
      }
    };

    setupAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        console.log('Login successful:', data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        setUser({ id: data.user.id });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const logout = async () => {
    console.log('Starting logout process...');
    
    try {
      // Clear local state first
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);

      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        console.log('Found active session, signing out...');
        const { error } = await supabase.auth.signOut({
          scope: 'local'  // Only clear the current tab's session
        });
        
        if (error) {
          console.error('Supabase signOut error:', error);
          toast.error("Çıkış yaparken bir hata oluştu, ancak local oturum kapatıldı");
          return;
        }
      } else {
        console.log('No active session found, skipping Supabase signOut');
      }

      console.log('Logout successful');
      toast.success("Başarıyla çıkış yapıldı");
    } catch (error) {
      console.error('Error in logout process:', error);
      toast.error("Çıkış yaparken bir hata oluştu");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};