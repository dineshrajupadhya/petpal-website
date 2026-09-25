import React from 'react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: September 2026</p>

        <Section title="Information We Collect">
          <p>We collect information you provide directly: name, email, phone, address, and payment-related details when you place an order or submit an adoption application. We also collect usage data such as pages visited to improve the Platform.</p>
        </Section>

        <Section title="How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To process orders, adoption applications, and account registration</li>
            <li>To send transactional emails (order confirmations, password resets)</li>
            <li>To respond to support and contact form enquiries</li>
            <li>To improve our services and prevent fraud</li>
          </ul>
        </Section>

        <Section title="Data Sharing">
          <p>We do not sell your personal data. We share data only with: payment processors (Razorpay) to complete transactions, and service providers strictly necessary to operate the Platform. We may disclose data if required by law.</p>
        </Section>

        <Section title="Data Security">
          <p>Passwords are stored using bcrypt hashing. Communications are encrypted via HTTPS. Payment processing is handled by PCI-DSS compliant providers — we never store your full card details.</p>
        </Section>

        <Section title="Cookies">
          <p>We use essential browser storage to keep you signed in. We do not use third-party advertising trackers.</p>
        </Section>

        <Section title="Your Rights">
          <p>You may request access to, correction of, or deletion of your personal data by contacting us at support@petpal.com. Account deletion does not affect order records we are legally required to retain.</p>
        </Section>

        <Section title="Contact">
          <p>For privacy-related questions, email support@petpal.com.</p>
        </Section>
      </div>
    </div>
  );
}
