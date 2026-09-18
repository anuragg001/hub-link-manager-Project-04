import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [simulatedLink, setSimulatedLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage(res.data.message);
      setSimulatedLink(res.data.simulatedEmailLink);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to send reset link');
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
            <p>Click the link below to reset your password:</p>
            <a href={simulatedLink} className="text-primary break-all">{simulatedLink}</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <p className="text-sm text-muted-foreground mb-6 text-center">Enter your email and we will send you a reset link.</p>
        {status === 'error' && <div className="bg-destructive/10 text-destructive p-3 rounded mb-4 text-sm">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}