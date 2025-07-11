import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { BarChart3, Shield, Zap, Users } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);

  const benefits = [
    {
      icon: <Shield size={20} color="#3b82f6" />,
      title: 'Unbreakable Privacy',
      description: 'Your data is not a corporate commodity. It stays in your browser. We never store or access your files – this is not their system.'
    },
    {
      icon: <Zap size={20} color="#10b981" />,
      title: 'Unleash Instant Truths',
      description: 'Forget the mundane. Get raw, statistical insights and visualizations in seconds. See the patterns they don\'t want you to see.'
    },
    {
      icon: <Users size={20} color="#8b5cf6" />,
      title: 'For the Disillusioned Analyst',
      description: 'No coding, no corporate jargon. This is for those who question the spreadsheet, the PowerPoint. For the rebels, the researchers, the real thinkers.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid lg:grid-cols-2">
        
        {/* Left Side - Branding & Benefits (Hidden on mobile, shown on tablet+) */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-gray-800 to-gray-700 p-8 xl:p-14 text-white">
          <div className="mb-6 flex items-center gap-3">
            <BarChart3 size={28} color="#3b82f6" />
            <h1 className="text-xl xl:text-2xl font-bold">
              NoStatsSherlock
            </h1>
          </div>

          <h2 className="mb-4 text-2xl xl:text-4xl font-bold leading-tight">
            This Is Your Data. Not Theirs.
          </h2>

          <p className="mb-8 text-sm xl:text-base leading-relaxed text-gray-300">
            You are not your job. You are not your bank account. You are not the car you drive.
            You are not the contents of your wallet. You are not your data. Until now.
            Reclaim it. Understand it. Break free from the tyranny of unanalyzed numbers.
          </p>

          <div className="flex flex-col gap-5">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 rounded-lg bg-white/10 p-2">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="mb-1 text-sm xl:text-base font-semibold text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-xs xl:text-sm leading-snug text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-white/20 bg-white/10 p-4">
            <p className="mb-2 text-sm font-medium text-gray-200">
              A Project by Adarsh.
            </p>
            <p className="text-xs leading-snug text-gray-300">
              We are the all-singing, all-dancing crap of the world. But here, we build.
              We dismantle. We see. This is not about self-improvement. This is about self-destruction
              of ignorance.
            </p>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 xl:p-14">
          {/* Mobile-only header */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <BarChart3 size={24} color="#3b82f6" />
            <h1 className="text-xl font-bold text-gray-900">
              NoStatsSherlock
            </h1>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">
                {isSignUp ? 'Join the Project' : 'Welcome Back, Insurgent'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {isSignUp
                  ? 'Sign up. Stop being a slave to your spreadsheets.'
                  : 'Sign in. The revolution needs data.'
                }
              </p>
            </div>

            {/* Clerk Authentication Components */}
            <div className="mb-6 w-full -ml-4 sm:ml-0">
              {isSignUp ? (
                <SignUp
                  appearance={{
                    elements: {
                      rootBox: {
                        width: '100%',
                        margin: '0'
                      },
                      card: {
                        boxShadow: 'none',
                        border: '1px solid #e5e7eb',
                        width: '100%',
                        margin: '0'
                      },
                      formButtonPrimary: {
                        fontSize: '14px',
                        fontWeight: '600'
                      },
                      formFieldInput: {
                        fontSize: '14px'
                      },
                      headerTitle: {
                        fontSize: '20px',
                        textAlign: 'center'
                      },
                      headerSubtitle: {
                        fontSize: '14px',
                        textAlign: 'center'
                      },
                      socialButtonsBlockButton: {
                        fontSize: '14px',
                        fontWeight: '500'
                      },
                      footerActionLink: {
                        fontSize: '14px'
                      }
                    }
                  }}
                  redirectUrl="/app"
                />
              ) : (
                <SignIn
                  appearance={{
                    elements: {
                      rootBox: {
                        width: '100%',
                        margin: '0 auto'
                      },
                      card: {
                        boxShadow: 'none',
                        border: '1px solid #e5e7eb',
                        width: '100%',
                        margin: '0'
                      },
                      formButtonPrimary: {
                        fontSize: '14px',
                        fontWeight: '600'
                      },
                      formFieldInput: {
                        fontSize: '14px'
                      },
                      headerTitle: {
                        fontSize: '20px',
                        textAlign: 'center'
                      },
                      headerSubtitle: {
                        fontSize: '14px',
                        textAlign: 'center'
                      },
                      socialButtonsBlockButton: {
                        fontSize: '14px',
                        fontWeight: '500'
                      },
                      footerActionLink: {
                        fontSize: '14px'
                      }
                    }
                  }}
                  redirectUrl="/app"
                />
              )}
            </div>

            {/* Toggle between Sign In and Sign Up */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="mb-2 text-sm text-gray-600">
                {isSignUp ? 'Are you already awake?' : "Ready to break free?"}
              </p>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-semibold text-blue-600 underline transition duration-200 ease-in-out hover:text-blue-700 active:text-blue-800"
              >
                {isSignUp ? 'Sign in (Your data is waiting.)' : 'Create an account (And start the project.)'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs leading-relaxed text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy.
                Your data is processed locally and never stored on our servers.
                Remember the first rule of NoStatsSherlock: You do not talk about your data outside of this app!
                And the second rule... you DO NOT talk about your data outside of this app!
              </p>
            </div>

            {/* Mobile-only benefits summary */}
            <div className="mt-6 lg:hidden">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Why NoStatsSherlock?</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield size={16} color="#3b82f6" />
                    <span className="text-xs text-gray-600">Unbreakable Privacy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} color="#10b981" />
                    <span className="text-xs text-gray-600">Instant Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} color="#8b5cf6" />
                    <span className="text-xs text-gray-600">For Real Thinkers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;