
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center overflow-hidden">
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
            className="mx-auto mb-8 w-max h-max rounded-full flex items-center justify-center"
            variants={itemVariants}
            animate={floatingAnimation}
          >
            <img 
              alt="Wheely Logo" 
              className="h-24 w-40 drop-shadow-lg" 
              src="/lovable-uploads/d3339318-3ea0-4a45-b1da-59798d4a28a2.png" 
            />
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-6"
            variants={itemVariants}
          >
            Welcome to Wheely
          </motion.h1>

          <motion.p 
            className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            An intelligent assistant built to simplify workflows, answer queries, and empower teams
            across sales, service, and inventory in the tyre manufacturing industry.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <Button 
              onClick={() => navigate('/login')} 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg h-14 group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            
            <Button 
              onClick={() => navigate('/signup')} 
              variant="outline" 
              size="lg" 
              className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-md h-14"
            >
              Create Account
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={itemVariants}
        >
          {/* Feature Card 1 */}
          <motion.div 
            className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
              <MessageSquare className="h-7 w-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Query Support</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ask natural questions about product availability, claim status, or sales with instant responses.
            </p>
          </motion.div>

          {/* Feature Card 2 */}
          <motion.div 
            className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
              <Users className="h-7 w-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Role-Based Insights</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Whether you're a dealer, sales rep, or admin — get the right data at the right time.
            </p>
          </motion.div>

          {/* Feature Card 3 */}
          <motion.div 
            className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200 hover:shadow-xl hover:-translate-y-3 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
              <Zap className="h-7 w-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Insights</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get answers in under 2 seconds. Wheely responds fast — boosting your productivity.
            </p>
          </motion.div>
        </motion.div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-20 h-20 bg-orange-200/30 rounded-full blur-xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-32 h-32 bg-orange-300/20 rounded-full blur-xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-16 h-16 bg-orange-400/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
