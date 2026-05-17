import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login({ email: formData.email, name: formData.name });
      setIsLoading(false);
      navigate("/category");
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-32 right-[15%] w-72 h-72 bg-[#8B7355]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-16 left-[10%] w-56 h-56 bg-[#D8C9AE]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#F5F0E8] tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm text-[#B0ACA5]">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#C4A882] hover:text-[#D8C9AE] transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <Card className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="name"
              label="Full name"
              type="text"
              required
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            
            <Input
              id="email"
              label="Email address"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            
            <Input
              id="password"
              label="Password"
              type="password"
              required
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Button type="submit" variant="primary" className="w-full flex justify-center" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Continue"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            
            <p className="text-xs text-center text-[#8B7355]">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
