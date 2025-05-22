import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState('loading'); // loading | success | expired | invalid | missing | dberror | error
  const [message, setMessage] = useState('');

  // Extract token from URL query param
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('missing');
      setMessage(
        '📬 Please check your email for the verification link to activate your account.'
      );
      return;
    }

    const verifyEmailToken = async () => {
      try {
        // Call your backend verification endpoint with the token
        // Adjust URL accordingly to your PHP verify-email.php location
        const response = await fetch(
          `/api/verify-email.php?token=${encodeURIComponent(token)}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (response.ok) {
          // Backend might redirect or respond with status, but your PHP redirects to /verify-result.html?
          // So here let's call an API endpoint instead that returns JSON — or you need to create one.
          // For now, let's assume response JSON { status: 'success' | 'expired' | 'invalid' | ... }
          const data = await response.json();

          setStatus(data.status);
          switch (data.status) {
            case 'success':
              setMessage('✅ Your email has been verified successfully!');
              toast({
                title: 'Email Verified',
                description: 'Your email has been verified successfully!',
              });
              // Optionally redirect after a short delay
              setTimeout(() => navigate('/login'), 3000);
              break;
            case 'expired':
              setMessage(
                '⏰ The verification link has expired. Please sign up again.'
              );
              break;
            case 'invalid':
              setMessage('❌ Invalid verification token.');
              break;
            case 'missing':
              setMessage('⚠️ Missing verification token.');
              break;
            case 'dberror':
              setMessage('❌ Internal server error. Please try again later.');
              break;
            default:
              setMessage('Something went wrong.');
          }
        } else {
          setStatus('error');
          setMessage('Something went wrong verifying your email.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again later.');
      }
    };

    verifyEmailToken();
  }, [token, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <Card className="w-full shadow-lg border-t-4 border-t-primary">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                  {status === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Email Verification
              </CardTitle>
              <CardDescription className="text-center">
                {message ||
                  (status === 'loading' ? 'Verifying your email...' : '')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status !== 'success' && status !== 'missing' && (
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full">
                  Retry Verification
                </Button>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                onClick={() => navigate('/login')}
                className="w-full">
                Go to Login
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
