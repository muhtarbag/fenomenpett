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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Setting up auth state...');
    
    const setupAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error getting initial session:', sessionError);
          return;
        }

        console.log('📝 Initial session:', session);
        
        if (session?.user) {
          setIsAuthenticated(true);
          setUser({ 
            id: session.user.id,
            email: session.user.email 
          });
        }

        // Set up auth state change subscription
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔄 Auth state changed:', event, session);
          
          if (session?.user) {
            setIsAuthenticated(true);
            setUser({ 
              id: session.user.id,
              email: session.user.email 
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
        console.error('❌ Error setting up auth:', error);
        toast.error('Authentication setup failed');
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔑 Attempting login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        console.log('✅ Login successful:', data.user);
        setIsAuthenticated(true);
        setUser({ 
          id: data.user.id,
          email: data.user.email 
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error logging in:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('🔑 Logging out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        toast.error('Çıkış yaparken bir hata oluştu');
        return;
      }

      // Clear the local state
      setIsAuthenticated(false);
      setUser(null);
      
      console.log('✅ Logout successful');
      toast.success('Başarıyla çıkış yapıldı');
      
      // Force reload the page to clear any cached state
      window.location.href = '/login';
      
    } catch (error) {
      console.error('❌ Error in logout process:', error);
      toast.error('Çıkış yaparken bir hata oluştu');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

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