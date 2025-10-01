import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | occurs.org',
  description: 'Privacy Policy for occurs.org - Learn how we collect, use, and protect your personal information.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy() {
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
              <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="newspaper-headline text-4xl md:text-5xl text-black dark:text-white mb-6 text-center">
                Privacy Policy
              </h1>
              <div className="w-16 h-1 bg-red-600 mx-auto"></div>
            </div>

            <div className="newspaper-body text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you subscribe to our newsletter, contact us, or interact with our website. This may include:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Email address</li>
                  <li>Name (if provided)</li>
                  <li>Any other information you choose to provide</li>
                </ul>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Send you newsletters and updates (if you subscribe)</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze website usage and trends</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">3. Information Sharing</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist us in operating our website</li>
                </ul>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">4. Cookies and Tracking</h2>
                <p>We use cookies and similar technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">5. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">6. Third-Party Services</h2>
                <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of communications</li>
                </ul>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">8. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 mt-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-red-600" />
                      <span>Email: connect@occurs.org</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span>Address: 3rd Floor, Iconic Corenthum, Sector-62, Noida-201309, Sector 62, Noida, Uttar Pradesh, India</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">9. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
