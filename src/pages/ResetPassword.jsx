
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      navigate('/login');
    } catch (err) {
      // Error toast is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => setShowPassword(!showPassword);

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
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <KeyRound className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-center text-slate-400">
                Enter your new password below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-green-500 focus:border-green-500 pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                    />
                    <button type="button" onClick={toggleShowPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-sm text-red-400 mt-1">{errors.newPassword}</p>}
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-green-500 focus:border-green-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </CardContent>
             <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-slate-400">
                Remembered your password?{' '}
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

export default ResetPassword;
