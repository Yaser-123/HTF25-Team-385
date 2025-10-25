/**
 * Sign In Page
 * Clerk authentication page for existing users
 */

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to access your time capsules
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-300",
                socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
                socialButtonsBlockButtonText: "text-white font-semibold",
                dividerLine: "bg-white/20",
                dividerText: "text-gray-400",
                formFieldLabel: "text-gray-300",
                formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-gray-400",
                formButtonPrimary: "bg-primary hover:bg-primary-hover",
                footerActionLink: "text-primary hover:text-primary-hover",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-primary hover:text-primary-hover",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                otpCodeFieldInput: "bg-white/10 border-white/20 text-white",
                formResendCodeLink: "text-primary hover:text-primary-hover",
                footer: "hidden",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
