import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, Target, Users, Lightbulb, Shield, Zap,
  Code, Database, TrendingUp, Award, Github, Linkedin,
  Instagram
} from 'lucide-react';
import mypic from '../../assets/pic2.jpg'; // Ensure this path is correct for your project structure

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <Shield size={32} color="#3b82f6" />,
      title: 'Privacy First',
      description: 'Your data never leaves your browser. We believe in complete data privacy and security.'
    },
    {
      icon: <Zap size={32} color="#10b981" />,
      title: 'Lightning Fast',
      description: 'Optimized algorithms and smart caching deliver instant results for your analysis.'
    },
    {
      icon: <Users size={32} color="#8b5cf6" />,
      title: 'User Centric',
      description: 'Designed for both technical and non-technical users with intuitive interfaces.'
    },
    {
      icon: <Lightbulb size={32} color="#f59e0b" />,
      title: 'Innovation',
      description: 'Constantly evolving with the latest data science techniques and technologies.'
    }
  ];

  const technologies = [
    { name: 'React', description: 'Modern UI framework' },
    { name: 'TypeScript', description: 'Type-safe development' },
    { name: 'Redux Toolkit', description: 'State management' },
    { name: 'D3.js', description: 'Data visualization' },
    { name: 'Recharts', description: 'Chart components' },
    { name: 'Math.js', description: 'Mathematical computations' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-700 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <BarChart3 size={64} className="mx-auto mb-6" />
          <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
            About NoStatsSherlock
          </h1>
          <p className="text-lg leading-relaxed text-blue-100 lg:text-xl">
            Democratizing data analysis by making exploratory data analysis
            accessible to everyone, regardless of technical background.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Target size={32} color="#3b82f6" />
                <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
                  Our Mission
                </h2>
              </div>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                We believe that data analysis shouldn't require a PhD in statistics or
                years of programming experience. Our mission is to democratize data
                insights by providing powerful, automated analysis tools that anyone can use.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                Whether you're a business analyst, researcher, student, or curious individual
                with a CSV file, NoStatsSherlock empowers you to uncover meaningful patterns
                and insights in your data within minutes.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10">
              <h3 className="mb-6 text-2xl font-semibold text-gray-900">
                What We Solve
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  'Complex statistical software with steep learning curves',
                  'Time-consuming manual data exploration processes',
                  'Expensive enterprise analytics tools',
                  'Privacy concerns with cloud-based solutions',
                  'Technical barriers for non-programmers'
                ].map((problem, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                    <span className="text-base text-gray-700">
                      {problem}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              Our Core Values
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              The principles that guide our development and shape our product decisions.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-16 lg:grid-cols-3 lg:items-center">
            {/* Developer Info */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center shadow-sm lg:col-span-1">
              <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-blue-600">
                <img
                  src={mypic} // Changed from placeholder to imported image
                  alt="Adarsh's Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-gray-900">
                Adarsh
              </h3>
              <p className="mb-5 text-base text-gray-600">
                Aspiring Dev & Data Dabbler (Mostly Aspiring)
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/ctype" // Replace with your actual GitHub
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-gray-700 p-3 text-white transition duration-200 ease-in-out hover:bg-gray-800"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://instagram.com/adarshssn" // Replace with your actual LinkedIn
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-red-700 p-3 text-white transition duration-200 ease-in-out hover:bg-gray-800"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>

            {/* About Developer */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
                Meet the Human Behind the Code (It's Me!)
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Hey there! I'm **Adarsh**, the one (and only) developer behind NoStatsSherlock.
                While I might not have a decade of experience under my belt (yet!), I'm fueled
                by a passion for making cool stuff and, well, making data less scary for everyone.
                This project is basically me trying to figure things out and share what I learn
                with the world, one CSV file at a time.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-gray-700">
                My grand vision is pretty simple: why should you need a fancy degree or spend
                hours coding just to understand your data? NoStatsSherlock is my attempt to
                democratize data insights, making them accessible even to folks who, like me,
                sometimes struggle with remembering if it's `mean` or `median` (it's both,
                depending on the day!).
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: <Code size={20} />, text: 'Still Learning Code' },
                  { icon: <Database size={20} />, text: 'Enthusiastic Data Lover' },
                  { icon: <TrendingUp size={20} />, text: 'Future Analytics Wiz' },
                  { icon: <Award size={20} />, text: 'Hopes to Win an Award Someday' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg bg-gray-100 p-3">
                    <div className="text-blue-600">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              Built with Modern Technology (Mostly Because I Thought It Was Cool)
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              NoStatsSherlock is built using cutting-edge technologies to ensure
              performance, reliability, and an exceptional user experience. (And because
              I really wanted to learn these!)
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition duration-200 ease-in-out hover:-translate-y-0.5"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {tech.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            Ready to Explore Your Data? (No Stats Degree Required!)
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            Join the community of data enthusiasts who trust NoStatsSherlock
            for their exploratory data analysis needs. (Or just people who want to look smart.)
          </p>
          <Link
            to="/app"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <BarChart3 size={20} />
            Start Your Analysis
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
