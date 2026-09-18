import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    axiosClient.post(`/auth/verify-email/${token}`)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg text-center space-y-4">
        <h2 className="text-2xl font-bold">Email Verification</h2>
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status === 'success' && (
          <>
            <div className="text-green-500 font-semibold">{message}</div>
            <Link to="/login"><Button className="mt-4">Go to Login</Button></Link>
          </>
        )}
        {status === 'error' && (
          <div className="text-destructive font-semibold">{message}</div>
        )}
      </div>
    </div>
  );
}