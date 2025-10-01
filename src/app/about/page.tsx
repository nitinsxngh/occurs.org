import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, Mail, MapPin, Globe, Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | occurs.org',
  description: 'Learn about occurs.org - Your trusted source for comprehensive news coverage and journalism.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function About() {
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
              <Users className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="newspaper-headline text-4xl md:text-5xl text-black dark:text-white mb-6 text-center">
                About occurs.org
              </h1>
              <div className="w-16 h-1 bg-red-600 mx-auto"></div>
            </div>

            <div className="newspaper-body text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">Our Mission</h2>
                <p>At occurs.org, we are committed to delivering comprehensive news coverage and in-depth journalism from trusted sources worldwide. Our mission is to keep you informed with accurate, timely, and relevant news that matters to you.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">What We Do</h2>
                <p>We curate and present news from various reliable sources, ensuring that our readers have access to diverse perspectives on current events. Our team works diligently to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Provide comprehensive coverage of breaking news and current events</li>
                  <li>Present news from multiple trusted sources</li>
                  <li>Ensure accuracy and reliability in our content</li>
                  <li>Give proper credit to original content creators</li>
                  <li>Maintain high journalistic standards</li>
                </ul>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <Newspaper className="w-5 h-5 mr-2 text-red-600" />
                      Accuracy
                    </h3>
                    <p>We prioritize factual reporting and verify information from multiple sources before publication.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-red-600" />
                      Transparency
                    </h3>
                    <p>We believe in transparent journalism and always credit original content creators appropriately.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-red-600" />
                      Integrity
                    </h3>
                    <p>We maintain the highest standards of journalistic integrity in all our reporting.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-red-600" />
                      Accessibility
                    </h3>
                    <p>We make news accessible to everyone through our user-friendly platform and comprehensive coverage.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">Content Policy</h2>
                <p>We respect intellectual property rights and are committed to ethical journalism practices. When we feature content from other sources, we:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Always provide proper attribution to original sources</li>
                  <li>Include clear credits for images and content</li>
                  <li>Follow fair use guidelines and copyright laws</li>
                  <li>Maintain transparency about our content sources</li>
                </ul>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">Our Team</h2>
                <p>Our editorial team consists of experienced journalists and content curators who are passionate about delivering quality news. We work around the clock to ensure you stay informed about the latest developments around the world.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">Contact Us</h2>
                <p>We value feedback from our readers and are always looking to improve our service. If you have any questions, suggestions, or concerns, please don&apos;t hesitate to reach out to us:</p>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 mt-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p>connect@occurs.org</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-red-600 mt-1" />
                      <div>
                        <p className="font-semibold">Address</p>
                        <p>3rd Floor, Iconic Corenthum<br />
                        Sector-62, Noida-201309<br />
                        Sector 62, Noida<br />
                        Uttar Pradesh, India</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">Thank You</h2>
                <p>Thank you for choosing occurs.org as your trusted news source. We are committed to serving you with the highest quality journalism and keeping you informed about the world around you.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
