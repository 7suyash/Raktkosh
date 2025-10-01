import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const values = [
    {
      icon: HeartIcon,
      title: 'Compassion',
      description: 'We approach every situation with empathy and understanding.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Trust',
      description: 'Building reliable systems that donors and recipients can depend on.'
    },
    {
      icon: UsersIcon,
      title: 'Community',
      description: 'Bringing people together to save lives in their communities.'
    },
    {
      icon: ClockIcon,
      title: 'Urgency',
      description: 'Understanding that every second counts in emergency situations.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'RAKTKOSH Founded', description: 'Started with a vision to revolutionize blood donation' },
    { year: '2021', event: '10,000+ Donors', description: 'Reached milestone of 10,000 registered donors' },
    { year: '2022', event: 'National Expansion', description: 'Expanded operations to 50+ cities across India' },
    { year: '2023', event: '25,000 Lives Saved', description: 'Celebrated saving 25,000 lives through our platform' },
    { year: '2024', event: 'AI Integration', description: 'Implemented AI-powered matching and prediction systems' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About RAKTKOSH</h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Connecting compassion with technology to save lives, one donation at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                RAKTKOSH was born from a simple yet powerful idea: no one should lose their life 
                due to unavailability of blood. We bridge the gap between blood donors and those 
                in need through innovative technology and community engagement.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform connects donors, blood banks, and hospitals in real-time, ensuring 
                that blood reaches where it's needed most, when it's needed most.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-5 w-5 text-red-600" />
                  <span>50+ Cities Across India</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-5 w-5 text-red-600" />
                  <span>10,000+ Active Donors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-5 w-5 text-red-600" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: '25K+', label: 'Lives Saved' },
                    { number: '50+', label: 'Cities' },
                    { number: '10K+', label: 'Donors' },
                    { number: '100+', label: 'Blood Banks' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{stat.number}</div>
                      <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at RAKTKOSH
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Milestones in our mission to save lives</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-red-200 h-full"></div>
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <div className="text-red-600 font-bold text-lg mb-2">{milestone.year}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                    <p className="text-gray-600 text-sm">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow"></div>
                
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Whether you're a donor, blood bank, or hospital, you can be part of this life-saving mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Become a Donor
              </button>
              <button className="border border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                Partner With Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;