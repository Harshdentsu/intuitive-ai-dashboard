import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bot, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.username || !formData.password || !formData.role) {
    toast({
      title: "Missing Information",
      description: "Please fill in all fields",
      variant: "destructive"
    });
    return;
  }

  setIsLoading(true);

  // 🔐 Hardcoded login check
  if (
    formData.username === "harsh" &&
    formData.password === "harsh" &&
    formData.role === "dealer"
  ) {
    localStorage.setItem("username", "harsh");
    localStorage.setItem("userRole", "dealer");

    toast({
      title: "Welcome Harsh!",
      description: "Access granted. Redirecting...",
    });

    navigate("/assistant"); // 🔁 Direct navigation
  } else {
    toast({
      title: "Access Denied",
      description: "Only Harsh with role dealer is allowed.",
      variant: "destructive"
    });
  }

  setIsLoading(false);
};


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <img src="public/logo.png" alt="Wheely Logo" className="h-54 w-54" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  autoComplete="new-username"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    autoComplete="new-password"  
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({...formData, role: value})}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="dealer">Dealer</SelectItem>
                    <SelectItem value="sales_rep">Sales Rep</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-900 font-medium"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-gray-500 to-gray-900 hover:from-gray-700 hover:to-gray-1100 text-white font-medium rounded-lg shadow-lg"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                New user?{" "}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
