import React from 'react';

const VerifyEmail = () => {
  return (
    <div className="auth-form animate-fade-in border border-white/20 bg-background-paper/30 backdrop-blur-md p-8 rounded-2xl">
      <div className="glass-card">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">Email Verification</h2>
        <p className="text-text-secondary text-center mb-6">
          Please verify your email by clicking the link we sent to your inbox
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail; 