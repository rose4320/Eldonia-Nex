"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// API Base URL
const API_BASE_URL = 'http://localhost:8001/api/v1';

// ユーザー型（必要に応じて拡張）
export type User = {
  id: number;
  username: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  subscription?: string;
  level?: number;
  exp?: number;
  fan_count?: number;
};

// Context型
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ページロード時に認証状態確認（トークンで検証）
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem("authToken");
        
        if (authToken) {
          // トークンが存在する場合、バックエンドで検証
          const response = await fetch(`${API_BASE_URL}/users/me/`, {
            headers: {
              'Authorization': `Token ${authToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem("eldonia_user", JSON.stringify(userData));
          } else {
            // トークンが無効な場合はクリア
            localStorage.removeItem("authToken");
            localStorage.removeItem("eldonia_user");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("eldonia_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ログイン（バックエンドAPI統合）
  const login = async (usernameOrEmail: string, password: string) => {
    setLoading(true);
    
    try {
      // バックエンドAPIにログインリクエストを送信
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameOrEmail,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.non_field_errors?.[0] || 'ログインに失敗しました');
      }

      const data = await response.json();
      
      // トークンを保存
      localStorage.setItem('authToken', data.token);
      
      // ユーザー情報を取得（トークンを使用）
      const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: {
          'Authorization': `Token ${data.token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        localStorage.setItem("eldonia_user", JSON.stringify(userData));
      } else {
        // ユーザー情報取得失敗時は最小限の情報でログイン状態にする
        const minimalUser = {
          id: 0,
          username: usernameOrEmail,
        };
        setUser(minimalUser);
        localStorage.setItem("eldonia_user", JSON.stringify(minimalUser));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト
  const logout = async () => {
    setLoading(true);
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (authToken) {
        // バックエンドにログアウトリクエストを送信（オプション）
        await fetch(`${API_BASE_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        }).catch(() => {
          // ログアウトAPIがなくてもローカルのクリーンアップは実行
        });
      }
      
      setUser(null);
      localStorage.removeItem("eldonia_user");
      localStorage.removeItem("authToken");
    } catch (error) {
      console.error('Logout error:', error);
      // エラーが発生してもローカルの状態はクリア
      setUser(null);
      localStorage.removeItem("eldonia_user");
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  // 新規登録（バックエンドAPI統合）
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.username?.[0] || errorData.email?.[0] || '登録に失敗しました');
      }

      const data = await response.json();
      
      // 登録成功後、自動的にログイン
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        
        // ユーザー情報を取得
        const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
          headers: {
            'Authorization': `Token ${data.token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          localStorage.setItem("eldonia_user", JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
