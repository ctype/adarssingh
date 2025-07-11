import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import {
  BarChart3, Upload, TrendingUp, Download, Shield, Zap,
  ArrowRight, Play, Star, Users, Clock
} from 'lucide-react';

const HeroPage: React.FC = () => {
  const features = [
    {
      icon: <Upload size={24} color="#3b82f6" />,
      title: 'Elementary Upload',
      description: 'Simply drag and drop your CSV files - the game is afoot instantly!'
    },
    {
      icon: <TrendingUp size={24} color="#10b981" />,
      title: 'Deductive Analysis',
      description: 'Automated statistical deductions with correlation matrices and insights'
    },
    {
      icon: <BarChart3 size={24} color="#8b5cf6" />,
      title: 'Visual Evidence',
      description: 'Beautiful charts, histograms, scatter plots revealing hidden patterns'
    },
    {
      icon: <Download size={24} color="#f59e0b" />,
      title: 'Case Reports',
      description: 'Download comprehensive investigation reports in multiple formats'
    },
    {
      icon: <Shield size={24} color="#ef4444" />,
      title: 'Confidential Cases',
      description: 'All processing happens locally - your data secrets stay with you'
    },
    {
      icon: <Zap size={24} color="#06b6d4" />,
      title: 'Lightning Deduction',
      description: 'Instant insights with optimized algorithms and detective efficiency'
    }
  ];

  const stats = [
    { icon: <Users size={20} />, value: '10K+', label: 'Data Detectives' },
    { icon: <BarChart3 size={20} />, value: '50K+', label: 'Cases Solved' },
    { icon: <Clock size={20} />, value: '95%', label: 'Faster Than Watson' },
    { icon: <Star size={20} />, value: '4.9/5', label: 'Detective Rating' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-700 py-20 lg:py-32 text-white">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
                <Zap size={16} />
                Elementary Data Detection
              </div>

              <h1 className="mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-4xl font-bold leading-tight text-transparent lg:text-6xl">
                Solve Your Data Mysteries
                <br />
                <span className="text-yellow-400">Elementary, My Dear Watson</span>
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-blue-100 lg:text-xl">
                Upload your CSV files and let our detective algorithms uncover hidden patterns,
                statistical clues, and data insights. No coding required, complete confidentiality guaranteed.
              </p>

              <div className="mb-10 flex flex-col gap-4 sm:flex-row">
                <SignedOut>
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-lg transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Play size={20} />
                    Begin Investigation
                  </Link>
                </SignedOut>

                <SignedIn>
                  <Link
                    to="/app"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-lg transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <BarChart3 size={20} />
                    Enter Lab
                  </Link>
                </SignedIn>

                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-transparent px-6 py-4 text-base font-semibold text-white transition duration-300 ease-in-out hover:border-white/50 hover:bg-white/10"
                >
                  The Methods
                  <ArrowRight size={20} />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-2 flex justify-center text-yellow-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold lg:text-3xl">
                      {stat.value}
                    </div>
                    <div className="text-xs text-blue-100">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Demo/Preview */}
            <div className="relative flex items-center justify-center">
              <div className="flex w-full max-w-sm flex-col items-center justify-center gap-5 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md lg:w-96 lg:h-80">
                <BarChart3 size={64} color="#fbbf24" />
                <div className="text-center">
                  <h3 className="mb-2 text-xl font-semibold">
                    Detective Dashboard
                  </h3>
                  <p className="text-sm text-blue-100">
                    Real-time clue analysis with brilliant visualizations
                  </p>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-10 w-16 rounded-md bg-white/20 animate-pulse-${i}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* This is how you'd typically add a custom keyframe animation in Tailwind */}
        <style>
          {`
            @keyframes pulse-1 { 0% { opacity: 0.4; } 100% { opacity: 1; } }
            @keyframes pulse-2 { 0% { opacity: 0.4; } 100% { opacity: 1; } } /* Adjusted for visual difference if needed */
            @keyframes pulse-3 { 0% { opacity: 0.4; } 100% { opacity: 1; } } /* Adjusted for visual difference if needed */

            .animate-pulse-1 { animation: pulse-1 1s ease-in-out infinite alternate; }
            .animate-pulse-2 { animation: pulse-2 1.2s ease-in-out infinite alternate; }
            .animate-pulse-3 { animation: pulse-3 1.4s ease-in-out infinite alternate; }
          `}
        </style>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              Detective Tools for Data Investigation
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Everything you need to crack the case, from basic clues
              to advanced pattern recognition and comprehensive case reports.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            Ready to Solve Your Data Mystery?
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            Join thousands of data detectives who trust NoStatsSherlock
            for their most challenging investigative analysis cases.
          </p>

          <SignedOut>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Play size={20} />
              Start Detecting Now
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              to="/app"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-8 py-4 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              <BarChart3 size={20} />
              Return to Lab
            </Link>
          </SignedIn>
        </div>
      </section>
    </div>
  );
};

export default HeroPage;