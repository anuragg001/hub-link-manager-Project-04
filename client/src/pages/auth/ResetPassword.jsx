import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/auth/reset-password/${token}`, { password });
      alert('Password reset successful! You are now logged in.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Password</h2>
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Reset Password</Button>
        </form>
      </div>
    </div>
  );
}