import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | occurs.org',
  description: 'Terms of Service for occurs.org - Read our terms and conditions for using our news website.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfService() {
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
              <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="newspaper-headline text-4xl md:text-5xl text-black dark:text-white mb-6 text-center">
                Terms of Service
              </h1>
              <div className="w-16 h-1 bg-red-600 mx-auto"></div>
            </div>

            <div className="newspaper-body text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using occurs.org, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials on occurs.org for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">3. Content and Intellectual Property</h2>
                <p>All content on occurs.org, including but not limited to text, graphics, logos, images, and software, is the property of occurs.org and is protected by copyright and other intellectual property laws. We respect intellectual property rights and give proper credit to content creators when applicable.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">4. User Conduct</h2>
                <p>You agree not to use the website in any way that:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Is unlawful, harmful, or violates any applicable laws</li>
                  <li>Infringes upon the rights of others</li>
                  <li>Is defamatory, obscene, or offensive</li>
                  <li>Interferes with the proper functioning of the website</li>
                </ul>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">5. Disclaimer</h2>
                <p>The materials on occurs.org are provided on an &apos;as is&apos; basis. occurs.org makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">6. Limitations</h2>
                <p>In no event shall occurs.org or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on occurs.org, even if occurs.org or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">7. Accuracy of Materials</h2>
                <p>The materials appearing on occurs.org could include technical, typographical, or photographic errors. occurs.org does not warrant that any of the materials on its website are accurate, complete, or current. occurs.org may make changes to the materials contained on its website at any time without notice.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">8. Links</h2>
                <p>occurs.org has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by occurs.org of the site. Use of any such linked website is at the user&apos;s own risk.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">9. Modifications</h2>
                <p>occurs.org may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">10. Governing Law</h2>
                <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>
              </section>

              <section>
                <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-4">11. Contact Information</h2>
                <p>If you have any questions about these Terms of Service, please contact us:</p>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
