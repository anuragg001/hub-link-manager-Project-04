import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>Enter your email to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-destructive/15 text-destructive border border-destructive/20 p-3 rounded-md mb-6 text-sm font-medium animate-in shake">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary transition-colors">Forgot password?</Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="bg-background/50" />
            </div>
            <Button type="submit" className="w-full h-11 text-base">Sign In</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/40 pt-6">
          <div className="text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}