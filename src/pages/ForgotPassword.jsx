
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MailQuestion } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset } = useAuth();

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      // Error toast is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full shadow-2xl bg-slate-800 border-slate-700 text-white">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <MailQuestion className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-center text-slate-400">
                {isSubmitted 
                  ? `If an account with ${email} exists, a password reset link has been sent.`
                  : "Enter your email address and we'll send you a link to reset your password."
                }
              </CardDescription>
            </CardHeader>
            {!isSubmitted ? (
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-amber-500 focus:border-amber-500 ${error ? 'border-red-500' : ''}`}
                    />
                    {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </CardContent>
            ) : (
              <CardContent>
                <p className="text-center text-slate-300">Please check your inbox (and spam folder) for the reset link.</p>
              </CardContent>
            )}
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-slate-400">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-sky-400 hover:text-sky-300 hover:underline">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
