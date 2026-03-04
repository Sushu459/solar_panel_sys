import { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';

export default function InquirySection() {
  const { createInquiry } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        project_id: null,
      });

      if (result) {
        setIsSubmitted(true);
        toast.success('Inquiry submitted successfully! We will contact you soon.');
      } else {
        toast.error('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all shadow-sm rounded-xl py-2.5";

  if (isSubmitted) {
    return (
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-lime-50/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-lime-100 shadow-xl shadow-emerald-500/5">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
              Thank You!
            </h2>
            <p className="text-slate-500 font-medium mb-8 text-lg leading-relaxed">
              Your inquiry has been submitted successfully. Our team will review your 
              request and get back to you within 24-48 hours.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', phone: '', message: '' });
              }}
              className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 rounded-full px-8 py-6 font-bold shadow-md shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 border-0"
            >
              Submit Another Inquiry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-white via-emerald-50/30 to-lime-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Info */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Ready to Go <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-500">Solar?</span>
            </h2>
            <p className="text-lg text-white/50 font-medium mb-10 leading-relaxed">
              Get a free consultation and quote for your solar installation. 
              Our experts will help you find the perfect solution for your energy needs.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: CheckCircle,
                  title: 'Free Site Assessment',
                  description: 'We evaluate your location for optimal solar potential',
                },
                {
                  icon: CheckCircle,
                  title: 'Customized Solutions',
                  description: 'Tailored solar systems designed for your specific needs',
                },
                {
                  icon: CheckCircle,
                  title: 'End-to-End Support',
                  description: 'From installation to maintenance, we handle everything',
                },
                {
                  icon: CheckCircle,
                  title: 'Government Subsidies',
                  description: 'We help you avail all applicable subsidies and incentives',
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center flex-shrink-0 border border-emerald-200 shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h3>
                      <p className="text-white/45 font-medium">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-lime-100 shadow-xl shadow-emerald-500/5 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-2xl font-extrabold text-slate-800 mb-8 relative z-10">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-bold flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Email & Phone */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-bold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700 font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your requirements..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 rounded-xl py-6 font-bold text-base shadow-md shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 border-0 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Inquiry...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Inquiry
                  </>
                )}
              </Button>

              <p className="text-xs font-semibold text-slate-400 text-center mt-4">
                By submitting, you agree to our privacy policy. We respect your privacy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}