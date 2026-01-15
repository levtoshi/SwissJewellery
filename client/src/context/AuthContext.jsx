import { createContext, useContext } from 'react';
import { authAPI } from '../api/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => await authAPI.getMe()
  });

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    queryClient.refetchQueries({ queryKey: ['me'] });
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    localStorage.setItem('accessToken', data.accessToken);
    queryClient.refetchQueries({ queryKey: ['me'] });
  };

  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem('accessToken');
    queryClient.setQueryData(['me'], null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading: isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);