import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | occurs.org',
  description: 'Get in touch with occurs.org - Contact us for inquiries, feedback, or support.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b-4 border-black dark:border-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors newspaper-caption"
            >
              <ArrowLeft className="w-4 h-4" />
              ← BACK TO NEWS
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="newspaper-card">
          <div className="p-8">
            <div className="mb-8">
              <MessageSquare className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="newspaper-headline text-4xl md:text-5xl text-black dark:text-white mb-6 text-center">
                Contact Us
              </h1>
              <div className="w-16 h-1 bg-red-600 mx-auto"></div>
            </div>

            <div className="newspaper-body text-gray-700 dark:text-gray-300 leading-relaxed space-y-8">
              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">Get in Touch</h2>
                <p>We&apos;d love to hear from you! Whether you have questions, feedback, or suggestions, our team is here to help. Reach out to us through any of the following channels:</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-red-600" />
                      Email Us
                    </h3>
                    <p className="mb-2">For general inquiries, feedback, or support:</p>
                    <a 
                      href="mailto:connect@occurs.org" 
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      connect@occurs.org
                    </a>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-red-600" />
                      Visit Us
                    </h3>
                    <p className="mb-2">Our office location:</p>
                    <address className="not-italic">
                      3rd Floor, Iconic Corenthum<br />
                      Sector-62, Noida-201309<br />
                      Sector 62, Noida<br />
                      Uttar Pradesh, India
                    </address>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-red-600" />
                      Response Time
                    </h3>
                    <p>We typically respond to emails within 24-48 hours during business days.</p>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Send us a Message</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        placeholder="What&apos;s this about?"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Your message here..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">How can I report an issue with the website?</h3>
                    <p>Please email us at connect@occurs.org with details about the issue you&apos;re experiencing. Include your browser type and any error messages you see.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Can I suggest news topics or sources?</h3>
                    <p>Absolutely! We welcome suggestions for news topics and sources. Send us your recommendations at connect@occurs.org.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">How do I subscribe to updates?</h3>
                    <p>You can subscribe to our newsletter by providing your email address. We&apos;ll keep you updated with the latest news and important updates.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">Business Hours</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Office Hours</h3>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                      <p>Saturday: 10:00 AM - 4:00 PM IST</p>
                      <p>Sunday: Closed</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email Support</h3>
                      <p>Available 24/7</p>
                      <p>Response within 24-48 hours</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
