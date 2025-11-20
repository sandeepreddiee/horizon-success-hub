import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdvisorNotes from "./pages/AdvisorNotes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Advisor Routes */}
            <Route
              path="/advisor/dashboard"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <AdvisorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor/student/:studentId/notes"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <AdvisorNotes />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/:studentId/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
