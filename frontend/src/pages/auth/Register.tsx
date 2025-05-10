import { SignUp } from '@clerk/clerk-react';

const Register = () => {
  return (
    <div className="auth-form animate-fade-in border border-white/20 bg-background-paper/30 backdrop-blur-md p-8 rounded-2xl">
      <div className="glass-card mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Create an account on <span className="text-primary">Knowledge Chakra</span>
        </h2>
        
        <SignUp 
          routing="path" 
          path="/register" 
          redirectUrl="/verify-email"
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-transparent shadow-none",
              headerTitle: "text-white text-2xl font-bold",
              headerSubtitle: "text-text-secondary",
              formButtonPrimary: "bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-all",
              formFieldInput: "bg-background-elevated border-background-paper/50 text-white rounded-xl p-3",
              formFieldLabel: "text-text-secondary",
              footerActionLink: "text-primary hover:text-primary-light",
              dividerLine: "bg-white/10",
              dividerText: "text-text-secondary",
              socialButtonsBlockButton: "hidden"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Register; 