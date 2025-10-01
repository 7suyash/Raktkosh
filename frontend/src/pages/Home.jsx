import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon,
  UsersIcon,
  ChartBarIcon,
  MapPinIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const stats = [
    { label: 'Active Donors', value: '10,000+', icon: UsersIcon, color: 'text-blue-600' },
    { label: 'Blood Units Available', value: '5,000+', icon: ChartBarIcon, color: 'text-green-600' },
    { label: 'Cities Covered', value: '50+', icon: MapPinIcon, color: 'text-purple-600' },
    { label: 'Lives Saved', value: '25,000+', icon: ShieldCheckIcon, color: 'text-red-600' },
  ];

  const features = [
    {
      title: 'Real-time Tracking',
      description: 'Live inventory updates and donor availability across all locations with instant notifications.',
      icon: ChartBarIcon,
    },
    {
      title: 'Smart Matching',
      description: 'AI-powered donor-recipient matching based on location, blood type, and urgency.',
      icon: UsersIcon,
    },
    {
      title: 'Emergency Response',
      description: 'Instant alerts and rapid response system for critical situations with priority handling.',
      icon: ShieldCheckIcon,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="space-y-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 w-20 h-20 flex items-center justify-center">
                  <HeartIcon className="h-10 w-10 text-white" />
                </div>
              </div>
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              >
                Every Drop
                <span className="block bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                  Counts
                </span>
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl max-w-3xl mx-auto text-red-100 leading-relaxed"
              >
                Join India's most trusted blood bank management system. 
                Connect donors with those in need, instantly. Together, we save lives.
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="group bg-white text-red-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-glow-lg transform hover:-translate-y-1"
              >
                <span>Become a Life Saver</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/emergency"
                className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Emergency Blood Request
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-red-100 text-sm font-medium">
                  Live System • 24/7 Operational • Instant Matching
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
            >
              <div className="text-center">
                <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-red-600">RAKTKOSH</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing blood bank management with cutting-edge technology, 
            compassionate service, and a commitment to saving lives.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-red-100"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-red-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 rounded-3xl mx-4 lg:mx-8">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of life savers and be the reason someone gets to see tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link
                to="/register"
                className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl hover:shadow-glow-lg"
              >
                Join RAKTKOSH Today
              </Link>
              <Link
                to="/about"
                className="border-2 border-gray-400 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;