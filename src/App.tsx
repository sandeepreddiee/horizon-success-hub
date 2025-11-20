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
import PlaceholderPage from "./pages/PlaceholderPage";
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
            <Route
              path="/advisor/students"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <PlaceholderPage title="My Students" role="ADVISOR" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor/alerts"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <PlaceholderPage title="Risk Alerts" role="ADVISOR" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor/notes"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <PlaceholderPage title="Interventions & Notes" role="ADVISOR" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor/reports"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <PlaceholderPage title="Reports & Insights" role="ADVISOR" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisor/resources"
              element={
                <ProtectedRoute requiredRole="ADVISOR">
                  <PlaceholderPage title="Resources & Support" role="ADVISOR" />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/:studentId/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <PlaceholderPage title="My Courses" role="STUDENT" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/progress"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <PlaceholderPage title="My Progress" role="STUDENT" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/resources"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <PlaceholderPage title="Resources & Support" role="STUDENT" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/help"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <PlaceholderPage title="Help & Contact Advisor" role="STUDENT" />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
