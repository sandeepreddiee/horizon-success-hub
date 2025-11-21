import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import AdvisorStudents from "./pages/AdvisorStudents";
import AdvisorAlerts from "./pages/AdvisorAlerts";
import AdvisorInterventions from "./pages/AdvisorInterventions";
import AdvisorReports from "./pages/AdvisorReports";
import AdvisorResources from "./pages/AdvisorResources";
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
          <Route path="/" element={<Login />} />
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
              path="/advisor/students"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <AdvisorStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor/alerts"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <AdvisorAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor/interventions"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <AdvisorInterventions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor/reports"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <AdvisorReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor/resources"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <AdvisorResources />
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
