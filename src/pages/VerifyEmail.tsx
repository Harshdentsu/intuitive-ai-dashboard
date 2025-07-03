
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyToken(token);
    } else {
      setIsVerifying(false);
      toast({
        title: "Invalid Link",
        description: "The verification link is invalid",
        variant: "destructive"
      });
    }
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-email', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      if (error) throw error;

      const result = await data;
      
      if (result.success) {
        setEmail(result.email);
        setIsVerified(true);
        toast({
          title: "Email Verified!",
          description: "Please complete your account setup"
        });
        
        // Redirect to setup page with email parameter
        setTimeout(() => {
          navigate(`/setup-account?email=${encodeURIComponent(result.email)}`);
        }, 2000);
      } else {
        toast({
          title: "Verification Failed",
          description: result.message || "The verification link is invalid or expired",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Something went wrong during verification",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">The verification link is invalid or has expired.</p>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm w-full max-w-md">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-4">Email verified for {email}</p>
          <p className="text-sm text-gray-500">Redirecting to account setup...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
