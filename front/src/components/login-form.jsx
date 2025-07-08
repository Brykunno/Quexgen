import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Loader2 } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { useState,useEffect } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../lib/constants";

export function LoginForm({ className,route, method,...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);

  
  const name = method == "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    try {
      const res = await api.post(route, { username, password });
  
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        
        localStorage.setItem('img_dir',`${import.meta.env.VITE_API_URL}/api`);
  
  
        try {
          const userRes = await api.get(`/api/user/account/`);
          const data = userRes.data;
          localStorage.setItem('username',data[0].username);
          localStorage.setItem('is_admin',data[0].is_superuser);
  
          if (data[0].is_superuser === true) {
            localStorage.setItem('admin_logged_in',true)
            navigate("/admin/dashboard");
          } else {
            localStorage.setItem('user_logged_in',true)
            navigate("/dashboard");
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          setSwal({
            show: true,
            title: 'Error',
            text: 'There was a problem fetching user data. Please try again later.',
          });
        }
  
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error('Error during login:', error);
    
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  // Toggle the state to switch between "text" and "password"
};
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}> 
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="username1"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        
          required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <div className="relative mb-3">
                        <Input
                            type={showPassword ? "text" : "password"}
                            
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <Eye className="h-5 w-5 text-gray-500" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                        </button>
                    </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="animate-spin mr-2" />
      Logging in
    </>
  ) : (
    "Login"
  )}
</Button>

            
            </div>
          
          </form>
        </CardContent>
      </Card>
    </div>
  );
}