import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2, MessageSquare, User, Star, Eye, PenLine, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useData } from '../contexts/DataContext';
import Header from '../sections/public/Header';
import Footer from '../sections/public/Footer';
import { toast } from 'sonner';

export default function ContactPage() {
  const { settings, createInquiry, reviews, fetchReviews, createReview } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Reviews section state
  const [reviewTab, setReviewTab] = useState<'view' | 'write'>('view');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [currentReviewPage, setCurrentReviewPage] = useState(0);
  const reviewsPerPage = 4; // Show 4 reviews per page (2x2 grid)
  const [reviewData, setReviewData] = useState({
    reviewer_name: '',
    rating: 5,
    comment: '',
  });

  // Pagination calculations
  const totalReviewPages = reviews ? Math.ceil(reviews.length / reviewsPerPage) : 0;
  const paginatedReviews = reviews ? reviews.slice(
    currentReviewPage * reviewsPerPage,
    (currentReviewPage + 1) * reviewsPerPage
  ) : [];

  const nextReviewPage = () => {
    setCurrentReviewPage((prev) => (prev + 1) % totalReviewPages);
  };

  const prevReviewPage = () => {
    setCurrentReviewPage((prev) => (prev - 1 + totalReviewPages) % totalReviewPages);
  };

  useEffect(() => {
    fetchReviews(true); // Fetch all reviews including unapproved
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        toast.success('Message sent successfully!');
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewData.reviewer_name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!reviewData.comment.trim()) {
      toast.error('Please enter your review');
      return;
    }

    setIsReviewSubmitting(true);

    try {
      const result = await createReview({
        reviewer_name: reviewData.reviewer_name,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      if (result) {
        setReviewSubmitted(true);
        toast.success('Review submitted! It will be visible after approval.');
      } else {
        toast.error('Failed to submit review.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: settings?.contact_phone || '+91 1800 123 4567',
      href: `tel:${settings?.contact_phone || '+9118001234567'}`,
    },
    {
      icon: Mail,
      title: 'Email',
      content: settings?.contact_email || 'info@solarsystems.in',
      href: `mailto:${settings?.contact_email || 'info@solarsystems.in'}`,
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      content: settings?.org_address || 'Solar Tower, Green Energy Road, Mumbai, MH',
      href: '#',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
      href: '#',
    },
  ];

  const inputClasses = "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 shadow-sm rounded-xl py-6 font-medium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-white text-slate-800 selection:bg-lime-200">
      <Header />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-500">Touch</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Have questions about solar energy? We're here to help. Reach out to us and our team will get back to you within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info Column */}
            <div className="lg:col-span-1 space-y-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-5 p-6 rounded-[2rem] bg-white border border-lime-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 transition-all duration-300">
                      <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base">{item.title}</h3>
                      <p className="text-slate-500 font-medium text-sm">{item.content}</p>
                    </div>
                  </a>
                );
              })}

             {/* Map Preview */}
<div className="rounded-[2rem] overflow-hidden border border-lime-100 h-64 bg-slate-100 shadow-sm">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124043.6826647915!2d79.91617488358482!3d14.4425987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4cf12a06958771%3A0xd3036c2025161f55!2sNellore%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    title="Office Location in Nellore"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <div className="bg-white rounded-[2.5rem] p-12 border border-lime-100 shadow-xl text-center h-full flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Message Sent!</h2>
                  <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto text-lg leading-relaxed">
                    Thank you for reaching out. Our solar experts will review your request and contact you within 24-48 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-10 py-6 font-bold transition-transform hover:-translate-y-1"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-lime-100 shadow-xl shadow-emerald-900/5">
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-8">Send Us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-500" /> Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className={inputClasses.replace("pl-12", "pl-6")}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-emerald-500" /> Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClasses.replace("pl-12", "pl-6")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-500" /> Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClasses.replace("pl-12", "pl-6")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-500" /> Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="I'm interested in solar for my home..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 shadow-sm rounded-2xl p-6 font-medium resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 py-8 text-lg font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 border-0 transition-transform hover:-translate-y-0.5 mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12 tracking-tight">
              Frequently Asked <span className="text-emerald-500">Questions</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  q: 'How much does a solar installation cost?',
                  a: 'Costs depend on your energy needs and roof size. Use our savings calculator to get an instant estimate.',
                },
                {
                  q: 'How long does installation take?',
                  a: 'Residential projects usually take 2-4 weeks, while commercial systems may take 4-8 weeks depending on capacity.',
                },
                {
                  q: 'What government subsidies are available?',
                  a: 'The Indian government offers significant subsidies for residential installations. We handle all paperwork for you.',
                },
                {
                  q: 'How long do solar panels last?',
                  a: 'Quality solar panels are designed to last 25-30 years with very minimal maintenance required.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-8 rounded-[2rem] bg-white border border-lime-100 shadow-sm hover:border-emerald-200 transition-colors group"
                >
                  <h3 className="font-extrabold text-slate-800 mb-3 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    {faq.q}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed pl-5">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-6 tracking-tight">
              Customer <span className="text-emerald-500">Reviews</span>
            </h2>
            <p className="text-center text-slate-600 font-medium mb-10 max-w-2xl mx-auto">
              See what our customers say about us or share your experience
            </p>

            {/* Tab Switcher */}
            <div className="flex justify-center gap-4 mb-10">
              <Button
                onClick={() => setReviewTab('view')}
                className={`px-8 py-6 rounded-full font-bold flex items-center gap-2 transition-all ${
                  reviewTab === 'view'
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white border border-lime-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <Eye className="w-5 h-5" />
                View Reviews
              </Button>
              <Button
                onClick={() => setReviewTab('write')}
                className={`px-8 py-6 rounded-full font-bold flex items-center gap-2 transition-all ${
                  reviewTab === 'write'
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white border border-lime-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <PenLine className="w-5 h-5" />
                Give Your Review
              </Button>
            </div>

            {/* View Reviews Tab */}
            {reviewTab === 'view' && (
              <div className="max-w-5xl mx-auto">
                {reviews && reviews.length > 0 ? (
                  <>
                    {/* Reviews count and average rating */}
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-slate-600 font-medium">
                        Showing {currentReviewPage * reviewsPerPage + 1}-{Math.min((currentReviewPage + 1) * reviewsPerPage, reviews.length)} of {reviews.length} reviews
                      </p>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-lime-100">
                        <Star className="w-5 h-5 text-lime-400 fill-lime-400" />
                        <span className="font-bold text-slate-800">
                          {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                        </span>
                        <span className="text-slate-400 text-sm">avg</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {paginatedReviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-8 rounded-[2rem] bg-white border border-lime-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center text-white font-bold text-lg">
                                {review.reviewer_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">{review.reviewer_name}</h4>
                                <p className="text-sm text-slate-400">
                                  {new Date(review.created_at).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < review.rating
                                      ? 'text-lime-400 fill-lime-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed line-clamp-3">{review.comment}</p>
                          {review.admin_response && (
                            <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                              <p className="text-sm font-bold text-emerald-600 mb-1">Response from Ever Green Solar:</p>
                              <p className="text-sm text-slate-700 line-clamp-2">{review.admin_response}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalReviewPages > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                          onClick={prevReviewPage}
                          className="p-3 rounded-full bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-lime-200 shadow-sm"
                          aria-label="Previous reviews"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                          {Array.from({ length: totalReviewPages }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentReviewPage(i)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                i === currentReviewPage 
                                  ? 'bg-emerald-500 scale-125' 
                                  : 'bg-lime-200 hover:bg-lime-300'
                              }`}
                              aria-label={`Go to page ${i + 1}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={nextReviewPage}
                          className="p-3 rounded-full bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-lime-200 shadow-sm"
                          aria-label="Next reviews"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 bg-white rounded-[2rem] border border-lime-100">
                    <Star className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Reviews Yet</h3>
                    <p className="text-slate-500 font-medium">Be the first to share your experience!</p>
                    <Button
                      onClick={() => setReviewTab('write')}
                      className="mt-6 bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 rounded-full px-8 py-6 font-bold"
                    >
                      Write a Review
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Write Review Tab */}
            {reviewTab === 'write' && (
              <div className="max-w-2xl mx-auto">
                {reviewSubmitted ? (
                  <div className="bg-white rounded-[2.5rem] p-12 border border-lime-100 shadow-xl text-center">
                    <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-4">Thank You!</h3>
                    <p className="text-slate-500 font-medium mb-8 text-lg leading-relaxed">
                      Your review has been submitted and is pending approval. It will be visible once our team reviews it.
                    </p>
                    <Button
                      onClick={() => {
                        setReviewSubmitted(false);
                        setReviewData({ reviewer_name: '', rating: 5, comment: '' });
                      }}
                      className="bg-slate-400 text-white hover:bg-slate-400 rounded-full px-10 py-6 font-bold"
                    >
                      Submit Another Review
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-lime-100 shadow-xl">
                    <h3 className="text-2xl font-extrabold text-blue-800 mb-8">Share Your Experience</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="reviewer_name" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                          <User className="w-4 h-4 text-emerald-500" /> Your Name
                        </Label>
                        <Input
                          id="reviewer_name"
                          type="text"
                          placeholder="John Doe"
                          value={reviewData.reviewer_name}
                          onChange={(e) => setReviewData((prev) => ({ ...prev, reviewer_name: e.target.value }))}
                          className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 shadow-sm rounded-xl py-6 font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                          <Star className="w-4 h-4 text-emerald-500" /> Your Rating
                        </Label>
                        <div className="flex gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                              className="p-1 transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-10 h-10 ${
                                  star <= reviewData.rating
                                    ? 'text-lime-400 fill-lime-400'
                                    : 'text-slate-300 hover:text-lime-200'
                                } transition-colors`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comment" className="text-slate-700 font-bold ml-1 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-500" /> Your Review
                        </Label>
                        <Textarea
                          id="comment"
                          placeholder="Tell us about your experience with Ever Green Solar Systems..."
                          value={reviewData.comment}
                          onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
                          rows={5}
                          className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 shadow-sm rounded-2xl p-6 font-medium resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isReviewSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 py-8 text-lg font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 border-0 transition-transform hover:-translate-y-0.5 mt-4"
                      >
                        {isReviewSubmitting ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" /> Submit Review
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}