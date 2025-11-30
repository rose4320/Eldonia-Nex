"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

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
};

// Context型
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// ダミーユーザーデータベース
const DUMMY_USERS = [
  {
    id: 1,
    username: "demo",
    email: "demo@eldonia-nex.com",
    password: "demo123",
    display_name: "デモユーザー",
    avatar_url: "",
    subscription: "free",
    level: 5,
    exp: 1250
  },
  {
    id: 2,
    username: "creator",
    email: "creator@eldonia-nex.com",
    password: "creator123",
    display_name: "クリエイター太郎",
    avatar_url: "",
    subscription: "premium",
    level: 10,
    exp: 5000
  },
  {
    id: 3,
    username: "admin",
    email: "admin@eldonia-nex.com",
    password: "admin123",
    display_name: "管理者",
    avatar_url: "",
    subscription: "enterprise",
    level: 99,
    exp: 99999
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ページロード時に認証状態確認（ローカルストレージから復元）
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // ローカルストレージから保存されたユーザー情報を取得
        const savedUser = localStorage.getItem("eldonia_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // ログイン（ダミー認証）
  const login = async (usernameOrEmail: string, password: string) => {
    setLoading(true);
    
    // シミュレートのため少し待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ダミーユーザーデータベースから検索
    const foundUser = DUMMY_USERS.find(
      u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
    
    if (foundUser) {
      // パスワードを除外してユーザー情報を設定
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      // ローカルストレージに保存
      localStorage.setItem("eldonia_user", JSON.stringify(userWithoutPassword));
    } else {
      setUser(null);
      throw new Error("ユーザー名またはパスワードが正しくありません");
    }
    
    setLoading(false);
  };

  // ログアウト
  const logout = async () => {
    setLoading(true);
    
    // シミュレートのため少し待つ
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    localStorage.removeItem("eldonia_user");
    
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
