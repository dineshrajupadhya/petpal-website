import React from 'react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: September 2026</p>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using PetPal ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
        </Section>

        <Section title="2. Accounts">
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must provide accurate information and be at least 18 years old to place orders or submit adoption applications.</p>
        </Section>

        <Section title="3. Adoption Services">
          <p>Submitting an adoption application does not guarantee adoption. All applications are subject to review, and PetPal reserves the right to approve or reject applications at its discretion. Approved adopters must comply with home-visit and follow-up requirements specified in the application.</p>
          <p>Adoption fees are non-refundable once an adoption is completed, except where required by law.</p>
        </Section>

        <Section title="4. Store & Orders">
          <p>Product prices are listed in Indian Rupees (₹) and include applicable GST at checkout. Cash on Delivery (COD) and online payments (via Razorpay) are supported payment methods.</p>
          <p>We reserve the right to cancel orders in cases of pricing errors, stock unavailability, or suspected fraud, with a full refund of any amounts paid.</p>
        </Section>

        <Section title="5. User Conduct">
          <p>You agree not to misuse the Platform, including attempting unauthorised access, submitting false information, or interfering with normal operation of the service.</p>
        </Section>

        <Section title="6. Limitation of Liability">
          <p>PetPal provides the Platform "as is" without warranties of any kind. To the maximum extent permitted by law, PetPal shall not be liable for indirect, incidental, or consequential damages arising from use of the Platform.</p>
        </Section>

        <Section title="7. Changes to Terms">
          <p>We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the revised Terms.</p>
        </Section>

        <Section title="8. Contact">
          <p>Questions about these Terms? Contact us at support@petpal.com or through our Contact page.</p>
        </Section>
      </div>
    </div>
  );
}
