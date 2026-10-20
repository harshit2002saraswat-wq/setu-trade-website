import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  PackageSearch,
  Sprout,
  Leaf,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSeo } from '@/hooks/useSeo';

const CONTACT_CARDS = [
  {
    icon: Briefcase,
    title: 'Business Enquiries',
    text: 'Contact us regarding agricultural products, sourcing requirements and international business enquiries.',
  },
  {
    icon: PackageSearch,
    title: 'Product Enquiries',
    text: 'Share the product, quantity, specification and destination you are interested in discussing.',
  },
  {
    icon: Sprout,
    title: 'Supplier Enquiries',
    text: 'Farmers, FPOs, traders and suppliers can contact Setu Trade regarding potential sourcing opportunities.',
  },
];

export function ContactPage() {
  useSeo({
    title: 'Contact Setu Trade | Indian Agro Products',
    description:
      'For product enquiries, sourcing requirements and business discussions, contact Setu Trade.',
    canonicalPath: '/contact',
  });

  return (
    <>
      <Header />
      <div className="pt-[4.5rem]">
        {/* Page header */}
        <section className="border-b border-charcoal-100 bg-white">
          <div className="container-page py-12 sm:py-16">
            <div className="max-w-3xl">
              <p className="eyebrow">
                <span className="h-px w-8 bg-brand-500" />
                Contact
              </p>
              <h1 className="section-title mt-4">Contact Setu Trade</h1>
              <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
                For product enquiries, sourcing requirements and business discussions,
                contact Setu Trade.
              </p>
            </div>
          </div>
        </section>

        {/* Contact cards */}
        <section className="bg-white py-14 sm:py-20">
          <div className="container-page">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CONTACT_CARDS.map((card, i) => (
                <div
                  key={card.title}
                  className="card p-7 hover:shadow-card-hover animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <card.icon className="h-6 w-6" strokeWidth={1.9} />
                  </span>
                  <h2 className="mt-5 text-lg font-semibold text-charcoal-900">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact details placeholders */}
        <section className="bg-charcoal-50 py-14">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="eyebrow">
                <span className="h-px w-8 bg-brand-500" />
                Contact Details
              </p>
              <h2 className="mt-4 text-2xl font-bold text-charcoal-900">
                Reach Setu Trade
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                Contact details will be shared here once configured. In the meantime,
                please use the enquiry channels above.
              </p>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <ContactPlaceholder icon={Mail} label="Email" />
              <ContactPlaceholder icon={Phone} label="Phone" />
              <ContactPlaceholder icon={MapPin} label="Location" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-950 py-16">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-900 text-brand-400">
                <Leaf className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
                Have a Product Requirement?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-brand-200">
                Tell us what agricultural product you are looking for, along with quantity,
                specification and destination.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/products" className="btn-primary text-base">
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/suppliers"
                  className="btn border border-brand-700 bg-brand-900/40 px-5 py-3 text-base text-white hover:bg-brand-800/60"
                >
                  Become a Supplier
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

function ContactPlaceholder({
  icon: Icon,
  label,
}: {
  icon: typeof Mail;
  label: string;
}) {
  return (
    <div className="card p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-50 text-charcoal-400">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-charcoal-400">
        {label}
      </h3>
      <p className="mt-2 text-sm text-charcoal-500">
        Available on request
      </p>
    </div>
  );
}
