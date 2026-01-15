import { createContext, useContext, useState } from 'react';
import { authAPI } from '../api/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState(
    () => localStorage.getItem('accessToken')
  );

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => await authAPI.getMe(),
    enabled: !!token
  });

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    queryClient.refetchQueries({ queryKey: ['me'] });
    setToken(data.accessToken);
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    localStorage.setItem('accessToken', data.accessToken);
    queryClient.refetchQueries({ queryKey: ['me'] });
    setToken(data.accessToken);
  };

  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem('accessToken');
    queryClient.setQueryData(['me'], null);
    setToken(null);
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