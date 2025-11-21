import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/horizon-logo.png";

const Login = () => {
  const [email, setEmail] = useState("advisor@horizonu.edu");
  const [password, setPassword] = useState("advisor123");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (asRole: "ADVISOR" | "STUDENT") => {
    console.log("Login attempt started with:", { email, asRole });
    setIsLoading(true);

    try {
      console.log("Making API call...");
      const response = await authAPI.login(email, password, asRole); // Pass role to API
      console.log("API response received:", response);
      const { token, role, studentId } = response.data;

      login(token, role, studentId);

      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });

      // Navigate after successful login
      if (role === "ADVISOR") {
        window.location.href = "/advisor/dashboard";
      } else {
        window.location.href = `/student/${studentId}/dashboard`;
      }
    } catch (error: any) {
      console.error("Login error details:", error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* Left side - Teal panel */}
      <div className="w-2/5 bg-primary flex flex-col justify-center px-16 text-primary-foreground">
        <div className="mb-12">
          <img src={logoImage} alt="Horizon University Logo" className="w-16 h-16 mb-3" />
          <span className="text-sm opacity-90">Horizon University</span>
        </div>
        
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Horizon Retention &<br />Success Hub
        </h1>
        
        <p className="text-lg opacity-90">
          Empowering Student Success<br />Through Insight and Support
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 bg-background flex items-center justify-center px-8">
        <div className="w-full max-w-md bg-card rounded-xl border border-border p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">System Login</h2>

          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advisor@horizonu.edu"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handleLogin("ADVISOR")}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Login as Advisor
            </Button>

            <Button
              onClick={() => handleLogin("STUDENT")}
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              size="lg"
            >
              Login as Student
            </Button>
          </div>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
