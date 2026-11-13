"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, Rocket, ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    useCase: "general",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <Rocket className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              Molten
            </span>
          </Link>

          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-6 text-4xl font-bold lg:text-5xl">
              Let&apos;s Build AI Agents,
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Together
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Ready to build interactive web experiences? Our team is here to
              help you get started with Molten.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl"
              variants={scaleIn}
              initial="initial"
              animate="animate"
            >
              <h2 className="mb-6 text-2xl font-bold">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-2"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className="mt-2"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="useCase">Use Case</Label>
                  <select
                    id="useCase"
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="demo">Request Demo</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="enterprise">Enterprise Solution</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2 min-h-[120px]"
                    placeholder="Tell us about your project ideas and how Molten can help..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div>
                <h2 className="mb-6 text-2xl font-bold">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">Email</h3>
                      <p className="text-gray-600">hello@useframe.vercel.app</p>
                      <p className="text-sm text-gray-500">
                        We&apos;ll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-500">
                        Mon-Fri, 9AM-6PM EST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold">Office</h3>
                      <p className="text-gray-600">Molten</p>
                      <p className="text-gray-600">123 Innovation Drive</p>
                      <p className="text-gray-600">San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <h3 className="mb-4 text-xl font-bold">Why Choose Molten?</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700">
                      AI-powered code assistance
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-gray-700">
                      Enterprise-grade security
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">24/7 customer support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <span className="text-gray-700">Custom integrations</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <h3 className="mb-4 text-xl font-bold">Response Time</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">General Inquiries</span>
                    <span className="font-semibold text-green-600">
                      24 hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Demo Requests</span>
                    <span className="font-semibold text-blue-600">4 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Enterprise Sales</span>
                    <span className="font-semibold text-purple-600">
                      2 hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Technical Support</span>
                    <span className="font-semibold text-orange-600">
                      1 hour
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
