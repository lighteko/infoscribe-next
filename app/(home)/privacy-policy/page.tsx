import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card className="p-6 md:p-8">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: April 9, 2025</p>
        </CardHeader>
        <CardContent className="p-0 space-y-6 text-muted-foreground">
          <p>
            Infoscribe (“we,” “our,” or “us”) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, and share your personal 
            information when you use our service.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong>Personal Information:</strong> Email address, name (optional), preferences or keywords you select.
              </li>
              <li>
                <strong>Usage Data:</strong> Log data, browser type, device information, and interaction data with our services.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies to improve user experience and analyze usage patterns.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Deliver personalized newsletters based on your selected interests</li>
              <li>Communicate service updates or account-related notices</li>
              <li>Improve and optimize our services and infrastructure</li>
              <li>Analyze usage data to refine our AI-powered curation</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Sharing Your Information</h2>
            <p>We do not sell your personal information. We may share it only with:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong>AWS (Amazon Web Services):</strong> For hosting, storage (S3), and email delivery (SES).
              </li>
              <li>
                <strong>Analytics Providers:</strong> Such as Google Analytics, to understand traffic and improve performance.
              </li>
              <li>
                <strong>Legal Authorities:</strong> If required by law or to protect our rights and users.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to fulfill the purposes 
              stated in this Policy or as required by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Access, update, or delete your personal information</li>
              <li>Opt out of marketing emails at any time</li>
              <li>Request data portability or restrict processing</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at [contact@infoscribe.me].
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Data Security</h2>
            <p>
              We implement industry-standard safeguards (including HTTPS, access control, and 
              encrypted storage) to protect your information. However, no method of transmission 
              over the internet is 100% secure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. If we make material changes, we 
              will notify you via email or through our website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              [contact@infoscribe.me]
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
} 