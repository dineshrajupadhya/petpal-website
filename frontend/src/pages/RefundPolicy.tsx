import React from 'react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund & Return Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: September 2026</p>

        <Section title="Product Returns">
          <p>Products may be returned within <strong>7 days of delivery</strong> if unused, unopened, and in original packaging. Return shipping is free for defective or wrong items; otherwise a flat ₹99 return fee applies.</p>
        </Section>

        <Section title="Refunds">
          <p>Once we receive and inspect the returned item, refunds are processed to the original payment method within <strong>5-7 business days</strong>. For Cash on Delivery orders, refunds are issued via bank transfer — please provide your bank details when requesting the refund.</p>
        </Section>

        <Section title="Non-Returnable Items">
          <ul className="list-disc pl-5 space-y-1">
            <li>Opened food items, treats, and supplements (for hygiene reasons)</li>
            <li>Medications and grooming products with broken seals</li>
            <li>Customised or personalised items</li>
          </ul>
        </Section>

        <Section title="Damaged or Wrong Items">
          <p>If your order arrives damaged or incorrect, contact us within 48 hours with photos at support@petpal.com. We'll arrange a free replacement or full refund.</p>
        </Section>

        <Section title="Adoption Fees">
          <p>Adoption fees are <strong>non-refundable</strong> after an adoption is completed. If an adoption falls through before handover (e.g., the animal becomes unavailable), any fees paid are refunded in full within 7 business days.</p>
        </Section>

        <Section title="Order Cancellation">
          <p>You may cancel an order free of charge before it is shipped. For online payments, cancelled orders are refunded in full. COD orders are simply cancelled with no charge.</p>
        </Section>

        <Section title="How to Request a Refund">
          <p>Email support@petpal.com with your order number, or contact us through the Contact page. We respond within 1 business day.</p>
        </Section>
      </div>
    </div>
  );
}
