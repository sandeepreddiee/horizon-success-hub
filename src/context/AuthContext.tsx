import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  role: "ADVISOR" | "STUDENT" | null;
  studentId: number | null;
  login: (token: string, role: "ADVISOR" | "STUDENT", studentId: number | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"ADVISOR" | "STUDENT" | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as "ADVISOR" | "STUDENT" | null;
    const storedStudentId = localStorage.getItem("studentId");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
      setStudentId(storedStudentId ? parseInt(storedStudentId) : null);
    }
  }, []);

  const login = (newToken: string, newRole: "ADVISOR" | "STUDENT", newStudentId: number | null) => {
    setToken(newToken);
    setRole(newRole);
    setStudentId(newStudentId);

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    if (newStudentId) {
      localStorage.setItem("studentId", newStudentId.toString());
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setStudentId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        studentId,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
