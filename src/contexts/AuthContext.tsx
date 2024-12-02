import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface User {
  id: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('Setting up auth state...');
    
    const setupAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
          return;
        }

        console.log('Initial session:', initialSession);
        
        if (initialSession?.user) {
          setIsAuthenticated(true);
          setUser({ 
            id: initialSession.user.id,
            email: initialSession.user.email 
          });
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
          console.log('Auth state changed:', _event, currentSession);
          
          if (currentSession?.user) {
            setIsAuthenticated(true);
            setUser({ 
              id: currentSession.user.id,
              email: currentSession.user.email 
            });
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        });

        return () => {
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
        
        if (data.user.email !== 'admin@fenomenpet.com') {
          toast.error('Bu sayfaya erişim yetkiniz yok');
          await supabase.auth.signOut();
          return false;
        }
        
        setIsAuthenticated(true);
        setUser({ 
          id: data.user.id,
          email: data.user.email 
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear local state first to ensure UI updates immediately
      setIsAuthenticated(false);
      setUser(null);

      // Clear any stored session data
      localStorage.removeItem('supabase.auth.token');
      
      // Attempt to sign out from Supabase, but don't wait for it
      supabase.auth.signOut().catch(error => {
        console.error('Error during Supabase signout:', error);
      });
      
      // Show success message
      toast.success('Başarıyla çıkış yapıldı');
      
      // Redirect to home page
      window.location.replace('/');
    } catch (error) {
      console.error('Error in logout process:', error);
      // Ensure redirect happens even if there's an error
      window.location.replace('/');
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