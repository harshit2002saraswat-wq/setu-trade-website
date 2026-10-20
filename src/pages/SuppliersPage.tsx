import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Sprout,
  Users,
  Truck,
  Warehouse,
  Snowflake,
  Factory,
  Package,
  Leaf,
  ClipboardList,
  Handshake,
  User,
  MapPin,
  Scale,
  Tag,
  Package2,
  Calendar,
  ScanSearch,
  Award,
  Camera,
  Building2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PRODUCT_CATEGORIES } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';

const SUPPLIER_HERO_IMAGE =
  'https://images.pexels.com/photos/11688197/pexels-photo-11688197.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const WHO_CAN_SUPPLY = [
  { icon: Sprout, title: 'Farmers', text: 'Individual farmers growing agricultural products for supply.' },
  { icon: Users, title: 'FPOs / Farmer Groups', text: 'Farmer Producer Organisations and farmer groups aggregating produce.' },
  { icon: Truck, title: 'Agricultural Traders', text: 'Traders dealing in agricultural commodities and products.' },
  { icon: Building2, title: 'Mandi Suppliers', text: 'Suppliers operating through agricultural mandis and markets.' },
  { icon: Snowflake, title: 'Cold Storages', text: 'Cold storage operators with stored agricultural produce.' },
  { icon: Warehouse, title: 'Processors', text: 'Processing units for cleaned, graded or processed agricultural products.' },
  { icon: Factory, title: 'Manufacturers', text: 'Manufacturers of agro-based and value-added products.' },
  { icon: Leaf, title: 'Organic Product Suppliers', text: 'Suppliers of organically grown agricultural products.' },
];

const INFO_REQUIRED = [
  { icon: Building2, label: 'Supplier / Business Name' },
  { icon: User, label: 'Contact Person' },
  { icon: MapPin, label: 'Location' },
  { icon: Package, label: 'Product' },
  { icon: ScanSearch, label: 'Variety / Grade' },
  { icon: Scale, label: 'Available Quantity' },
  { icon: Tag, label: 'Expected Price' },
  { icon: Package2, label: 'Packaging' },
  { icon: Calendar, label: 'Harvest / Availability Period' },
  { icon: ClipboardList, label: 'Quality Specifications' },
  { icon: Award, label: 'Certifications, if applicable' },
  { icon: Camera, label: 'Photos / Product documents, if available' },
];

const ONBOARDING_STEPS = [
  { step: 1, title: 'Supplier Enquiry', text: 'Submit your supplier and product details through the enquiry process.' },
  { step: 2, title: 'Product & Capacity Review', text: 'We review the product, available quantity and supply details you share.' },
  { step: 3, title: 'Specification Discussion', text: 'Discuss product grade, quality, packaging and other applicable requirements.' },
  { step: 4, title: 'Commercial Discussion', text: 'Discuss pricing and commercial terms according to the product and transaction.' },
  { step: 5, title: 'Supply Coordination', text: 'Coordinate supply, documentation and logistics according to the agreed terms.' },
];

export function SuppliersPage() {
  useSeo({
    title: 'Become a Supplier | Setu Trade',
    description:
      'Join the Setu Trade sourcing network. Farmers, FPOs, traders, processors and suppliers of Indian agricultural products can submit a supplier enquiry.',
    canonicalPath: '/suppliers',
  });

  return (
    <>
      <Header />
      <div className="pt-[4.5rem]">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-brand-950">
          <div className="absolute inset-0 -z-10">
            <img
              src={SUPPLIER_HERO_IMAGE}
              alt="Indian farmers harvesting crops in a field"
              className="h-full w-full object-cover opacity-35 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-950/80 to-brand-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-transparent" />
          </div>
          <div className="container-page py-20 sm:py-28 lg:py-32">
            <div className="max-w-3xl">
              <p className="eyebrow text-brand-300 animate-fade-up">
                <span className="h-px w-8 bg-brand-400" />
                For Suppliers
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: '0.08s' }}>
                Become a Supplier to Setu Trade
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100 animate-fade-up" style={{ animationDelay: '0.16s' }}>
                Join our sourcing network and supply agricultural and agro-based products
                to buyers through Setu Trade.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: '0.24s' }}>
                <Link to="/contact" className="btn-primary text-base">
                  Submit Supplier Enquiry
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products"
                  className="btn border border-brand-700 bg-brand-900/40 px-5 py-3 text-base text-white hover:bg-brand-800/60"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Who Can Supply */}
        <section className="bg-white py-14 sm:py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="eyebrow">
                <span className="h-px w-8 bg-brand-500" />
                Who Can Supply
              </p>
              <h2 className="section-title mt-4">Who Can Supply</h2>
              <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
                Setu Trade works with various types of agricultural suppliers across India.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WHO_CAN_SUPPLY.map((item, i) => (
                <div
                  key={item.title}
                  className="card p-6 hover:shadow-card-hover animate-fade-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <item.icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-charcoal-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products We Source */}
        <section className="bg-charcoal-50 py-14 sm:py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="eyebrow">
                <span className="h-px w-8 bg-brand-500" />
                Products We Source
              </p>
              <h2 className="section-title mt-4">Products We Source</h2>
              <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
                We source across the following agricultural product categories, including
                products such as Potato, Wheat, Mustard, Bajra, Jowar, Paddy/Rice and other
                agricultural products.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCT_CATEGORIES.map((cat, i) => (
                <Link
                  key={cat.slug}
                  to={`/products?category=${cat.slug}`}
                  className="card group block overflow-hidden hover:shadow-card-hover animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="relative h-36 overflow-hidden bg-charcoal-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
                    <h3 className="absolute bottom-3 left-5 right-5 text-base font-bold text-white">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="p-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 group-hover:text-brand-900">
                      View Products
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Supplier Information Required */}
        <section className="bg-white py-14 sm:py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="eyebrow">
                <span className="h-px w-8 bg-brand-500" />
                Supplier Information
              </p>
              <h2 className="section-title mt-4">Supplier Information Required</h2>
              <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
                Suppliers should be ready to provide the following information when
                submitting an enquiry. This helps us review your product and supply details.
              </p>
            </div>
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INFO_REQUIRED.map((item, i) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-charcoal-100 bg-white p-4 animate-fade-up"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <item.icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="text-sm font-medium text-charcoal-800">{item.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-charcoal-500">
              Certifications are not mandatory unless applicable to the product or
              destination market.
            </p>
          </div>
        </section>

        {/* How Supplier Onboarding Works */}
        <section className="bg-brand-950 py-14 sm:py-20">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="eyebrow text-brand-300">
                <span className="h-px w-8 bg-brand-400" />
                Supplier Onboarding
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-[1.15] text-white sm:text-4xl">
                How Supplier Onboarding Works
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-200">
                A simple process from supplier enquiry to supply coordination.
              </p>
            </div>
            <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {ONBOARDING_STEPS.map((s, i) => (
                <li
                  key={s.step}
                  className="relative rounded-2xl border border-brand-900 bg-brand-900/40 p-6 animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="font-display text-4xl font-extrabold text-brand-500/50">
                    {String(s.step).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-200">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Supplier CTA */}
        <section className="bg-white py-16">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Handshake className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <h2 className="mt-6 text-2xl font-bold text-charcoal-900 sm:text-3xl">
                Have Agricultural Products to Supply?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-charcoal-600">
                Submit a supplier enquiry with your product and supply details. We can
                review your requirement and discuss potential sourcing opportunities.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/contact" className="btn-primary text-base">
                  Submit Supplier Enquiry
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="btn-secondary text-base">
                  Contact Setu Trade
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
