import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/horizon-logo.png";
import { preloadAllData } from "@/services/dataCache";
import { GraduationCap, UserCog, Shield, TrendingUp, Users } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("advisor@horizonu.edu");
  const [password, setPassword] = useState("advisor123");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (asRole: "ADVISOR" | "STUDENT") => {
    setIsLoading(true);

    try {
      const response = await authAPI.login(email, password, asRole);
      const { token, role, studentId } = response.data;

      preloadAllData();
      login(token, role, studentId);

      toast({
        title: "Welcome back!",
        description: `Logged in as ${role.toLowerCase()}`,
      });

      if (role === "ADVISOR") {
        navigate("/advisor/dashboard", { replace: true });
      } else {
        navigate(`/student/${studentId}/dashboard`, { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: TrendingUp, text: "Predictive Analytics" },
    { icon: Users, text: "Student Support" },
    { icon: Shield, text: "Early Intervention" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left side - Hero panel */}
      <div className="hidden lg:flex w-[45%] sidebar-premium flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm p-2 border border-white/10">
              <img src={logoImage} alt="Horizon University Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-sm font-heading font-bold text-white">Horizon University</span>
              <p className="text-xs text-white/60">Education Portal</p>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10 my-auto">
          <h1 className="text-5xl font-heading font-bold text-white mb-6 leading-tight tracking-tight">
            Retention &<br />
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Success Hub
            </span>
          </h1>
          
          <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-md">
            Empowering student success through data-driven insights and coordinated support systems.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <feature.icon className="w-4 h-4 text-white/80" />
                <span className="text-sm text-white/90 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
          <div>
            <p className="text-3xl font-heading font-bold text-white">5,000+</p>
            <p className="text-sm text-white/60">Active Students</p>
          </div>
          <div>
            <p className="text-3xl font-heading font-bold text-white">92%</p>
            <p className="text-sm text-white/60">Retention Rate</p>
          </div>
          <div>
            <p className="text-3xl font-heading font-bold text-white">24/7</p>
            <p className="text-sm text-white/60">Support Access</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 p-2">
              <img src={logoImage} alt="Horizon University Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-heading font-bold text-foreground">Horizon</span>
              <p className="text-xs text-muted-foreground">University Portal</p>
            </div>
          </div>

          <div className="card-premium p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Welcome back</h2>
              <p className="text-muted-foreground">Sign in to access your dashboard</p>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advisor@horizonu.edu"
                  className="h-12 rounded-xl input-premium"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium mb-2 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-12 rounded-xl input-premium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleLogin("ADVISOR")}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 btn-premium"
                size="lg"
              >
                <UserCog className="w-4 h-4 mr-2" />
                Sign in as Advisor
              </Button>

              <Button
                onClick={() => handleLogin("STUDENT")}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 rounded-xl border-2 font-semibold transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary"
                size="lg"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Sign in as Student
              </Button>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors animated-underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
