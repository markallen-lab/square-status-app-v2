
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ArrowRight } from 'lucide-react';

const VerifyPhone = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyPhone } = useAuth();
  const { toast } = useToast();
  
  const phone = location.state?.phone;
  const email = location.state?.email;
  
  useEffect(() => {
    if (!phone) {
      navigate('/login');
      return;
    }
    
    // Simulate sending verification code
    toast({
      title: "Verification Code Sent",
      description: `A verification code has been sent to ${phone}`,
    });
    
    // Set countdown for resend button
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [phone, navigate, toast]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await verifyPhone(phone, verificationCode, email);
      
      toast({
        title: "Verification Successful",
        description: "Your phone number has been verified successfully.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = () => {
    if (countdown > 0) return;
    
    // Simulate resending verification code
    const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`phoneVerification_${phone}`, phoneVerificationCode);
    
    toast({
      title: "Verification Code Resent",
      description: `A new verification code has been sent to ${phone}`,
    });
    
    // Reset countdown
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // For demo purposes, show the verification code
  const demoCode = localStorage.getItem(`phoneVerification_${phone}`);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full shadow-lg border-t-4 border-t-primary">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Verify Your Phone</CardTitle>
              <CardDescription className="text-center">
                We've sent a verification code to<br />
                <span className="font-medium">{phone}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className={error ? 'border-red-500' : ''}
                    maxLength={6}
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                  
                  {/* For demo purposes only */}
                  {demoCode && (
                    <p className="text-xs text-gray-500 mt-1">
                      Demo code: {demoCode}
                    </p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify Phone'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-gray-500">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className={`text-primary ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyPhone;
