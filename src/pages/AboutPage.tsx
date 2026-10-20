import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Sprout,
  ScanSearch,
  Handshake,
  Ship,
  Leaf,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PRODUCT_CATEGORIES } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';

const ABOUT_IMAGE =
  'https://images.pexels.com/photos/20238486/pexels-photo-20238486.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const WHAT_WE_DO = [
  {
    icon: Sprout,
    title: 'Indian Product Sourcing',
    text: 'Identify and coordinate agricultural products according to buyer requirements.',
  },
  {
    icon: ScanSearch,
    title: 'Product Specifications',
    text: 'Discuss product grade, size, quality, packaging, quantity and other applicable requirements.',
  },
  {
    icon: Handshake,
    title: 'Commercial Coordination',
    text: 'Discuss quotations and commercial terms according to the agreed product specifications.',
  },
  {
    icon: Ship,
    title: 'Export Coordination',
    text: 'Coordinate applicable documentation and logistics requirements for transactions.',
  },
];

const APPROACH_STEPS = [
  { step: 1, title: 'Understand Buyer Requirement', text: 'Review the product, quantity, specification and destination indicated by the buyer.' },
  { step: 2, title: 'Confirm Product Specification', text: 'Discuss and confirm grade, size, quality, packaging and other applicable requirements.' },
  { step: 3, title: 'Coordinate Sourcing', text: 'Coordinate product sourcing according to the agreed specifications and availability.' },
  { step: 4, title: 'Coordinate Transaction Requirements', text: 'Coordinate commercial terms, documentation and logistics according to the transaction.' },
];

export function AboutPage() {
  useSeo({
    title: 'About Setu Trade | Indian Agro Products & Global Trade',
    description:
      'Setu Trade is an India-based agro-products trading business focused on connecting agricultural products sourced from India with international buyers.',
    canonicalPath: '/about',
  });

  return (
    <>
      <Header />
      <div className="pt-[4.5rem]">
        {/* Page hero */}
        <section className="bg-white py-12 sm:py-16">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <p className="eyebrow">
                  <span className="h-px w-8 bg-brand-500" />
                  About Us
                </p>
                <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] text-charcoal-900 sm:text-4xl lg:text-[2.75rem]">
                  About Setu Trade
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal-600">
                  Setu Trade is an India-based agro-products trading business focused on
                  connecting agricultural products sourced from India with international
                  buyers.
                </p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal-600">
                  The word <span className="font-semibold text-charcoal-800">Setu</span> means
                  <span className="font-semibold text-charcoal-800"> bridge</span> — and that
                  is what we aim to do: connect international buyers with Indian agricultural
                  products including fresh vegetables, agro products, millets and organic produce.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/products" className="btn-primary">
                    Explore Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/contact" className="btn-secondary">
                    Contact Setu Trade
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src={ABOUT_IMAGE}
                    alt="Indian farmer in an agricultural field"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Focus */}
        <section className="bg-charcoal-50 py-14 sm:py-16">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="eyebrow">
                <span className="h-px w-8 bg-brand-500" />
                Our Focus
              </p>
              <h2 className="section-title mt-4">Our Focus</h2>
              <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
                Setu Trade focuses on agricultural products including fresh vegetables,
                grains, millets and organic produce, depending on buyer requirements and
                sourcing availability.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="bg-white py-14 sm:py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="eyebrow">
                <span className="h-px w-8 bg-brand-500" />
                What We Do
              </p>
              <h2 className="section-title mt-4">What We Do</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WHAT_WE_DO.map((item, i) => (
                <div
                  key={item.title}
                  className="card p-7 hover:shadow-card-hover animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <item.icon className="h-6 w-6" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-charcoal-900">
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

        {/* Product Categories */}
        <section className="bg-charcoal-50 py-14 sm:py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="eyebrow">
                <span className="h-px w-8 bg-brand-500" />
                Product Categories
              </p>
              <h2 className="section-title mt-4">Product Categories</h2>
              <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
                Explore the agricultural product categories we focus on.
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
                  <div className="relative h-40 overflow-hidden bg-charcoal-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
                    <h3 className="absolute bottom-4 left-5 right-5 text-lg font-bold text-white">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-relaxed text-charcoal-600">
                      {cat.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 group-hover:text-brand-900">
                      View Products
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="bg-brand-950 py-14 sm:py-20">
          <div className="container-page">
            <div className="max-w-2xl">
              <p className="eyebrow text-brand-300">
                <span className="h-px w-8 bg-brand-400" />
                Our Approach
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-[1.15] text-white sm:text-4xl">
                Our Approach
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-200">
                A clear approach from understanding buyer requirements to coordinating
                transaction requirements.
              </p>
            </div>
            <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {APPROACH_STEPS.map((s, i) => (
                <li
                  key={s.step}
                  className="relative rounded-2xl border border-brand-900 bg-brand-900/40 p-6 animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="font-display text-4xl font-extrabold text-brand-500/50">
                    {String(s.step).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-200">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-16">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Leaf className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <h2 className="mt-6 text-2xl font-bold text-charcoal-900 sm:text-3xl">
                Have a Product Requirement?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-charcoal-600">
                Tell us what agricultural product you are looking for, along with quantity,
                specification and destination.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/products" className="btn-primary text-base">
                  Explore Products
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
