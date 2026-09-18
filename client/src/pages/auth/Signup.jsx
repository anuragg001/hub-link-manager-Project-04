import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [message, setMessage] = useState('');
  const [simulatedLink, setSimulatedLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/auth/signup', form);
      setStatus('success');
      setMessage(res.data.message);
      setSimulatedLink(res.data.simulatedEmailLink);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary">Check Your Email</h2>
          <p className="text-muted-foreground">{message}</p>
          <div className="bg-muted p-4 rounded text-sm text-left border mt-4">
            <p className="font-semibold mb-2">--- SIMULATED EMAIL ---</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href={simulatedLink} className="text-primary break-all">{simulatedLink}</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'error' && <div className="bg-destructive/15 text-destructive border border-destructive/20 p-3 rounded-md mb-6 text-sm font-medium animate-in shake">{message}</div>}
          
          {status === 'success' ? (
            <div className="space-y-6">
              <div className="bg-success/15 text-success border border-success/20 p-4 rounded-lg font-medium text-center">
                {message}
              </div>
              <div className="border border-border/60 bg-muted/30 p-6 rounded-xl space-y-4">
                <p className="text-sm font-medium text-muted-foreground text-center">Simulated Verification Email</p>
                <div className="bg-background border border-border shadow-sm p-4 rounded-lg text-center">
                  <p className="text-sm mb-4">Click the button below to verify your email address:</p>
                  <Button asChild className="w-full"><a href={simulatedLink} target="_blank" rel="noreferrer">Verify Email Address</a></Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="bg-background/50" />
              </div>
              <Button type="submit" className="w-full h-11 text-base">Sign Up</Button>
            </form>
          )}
        </CardContent>
        {status !== 'success' && (
          <CardFooter className="flex justify-center border-t border-border/40 pt-6">
            <div className="text-sm text-muted-foreground">
              Already have an account? <a href="/login" className="text-primary font-medium hover:underline">Log in</a>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}