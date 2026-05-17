import Card from "../components/Card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      desc: "Perfect for getting started",
      accent: "#B0ACA5",
      features: [
        "1 Resume Template",
        "Basic Form Fields",
        "PDF Export",
        "Community Support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      desc: "For serious job seekers",
      accent: "#D8C9AE",
      features: [
        "All Resume Templates",
        "AI-Powered Suggestions",
        "Unlimited PDF Exports",
        "Priority Support",
        "Custom Branding",
        "Analytics Dashboard",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For recruiters & organizations",
      accent: "#B08D8D",
      features: [
        "Everything in Pro",
        "Smart Filtering Engine",
        "Bulk Resume Processing",
        "API Access",
        "Dedicated Account Manager",
        "Custom Integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5 }} 
        className="absolute top-20 right-[10%] w-80 h-80 bg-[#D8C9AE]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5, delay: 0.5 }} 
        className="absolute bottom-32 left-[5%] w-56 h-56 bg-[#8B7355]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.p variants={slideUp} className="text-[#C4A882] text-xs font-semibold tracking-[0.3em] uppercase mb-4">Pricing</motion.p>
          <motion.h1 variants={slideUp} className="text-4xl md:text-5xl font-light text-white mb-5">Simple, transparent pricing</motion.h1>
          <motion.p variants={slideUp} className="text-[#B0ACA5] max-w-xl mx-auto font-light">No hidden fees. Pick the plan that fits your needs.</motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan, i) => (
            <motion.div variants={slideUp} key={i} className="flex h-full">
              <Card className={`w-full flex flex-col relative ${plan.popular ? "border-[#D8C9AE]/30 !border-2" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#D8C9AE] to-[#8B7355] text-[#141414] text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[#F5F0E8] mb-1">{plan.name}</h3>
                  <p className="text-[#8B7355] text-sm">{plan.desc}</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-light text-white">{plan.price}</span>
                  <span className="text-[#B0ACA5] text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-[#B0ACA5]">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.accent }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className="mt-auto">
                  <button className={`w-full h-11 rounded-lg text-sm font-medium transition-all duration-300 ${
                    plan.popular
                      ? "neon-button"
                      : "border border-white/10 text-[#B0ACA5] hover:text-white hover:border-white/20 bg-white/[0.02]"
                  }`}>
                    {plan.cta}
                  </button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
