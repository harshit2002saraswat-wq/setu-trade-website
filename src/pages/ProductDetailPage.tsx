import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, CircleCheck as CheckCircle2, FileText, FileCheck2, Globe as Globe2, Layers, Package, PackageCheck, Scale, ScanSearch, Ship } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { getProductDetail, getRelatedProducts } from '@/data/productDetails';
import type { ProductDetail } from '@/types';
import { useSeo } from '@/hooks/useSeo';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductDetail(slug) : undefined;

  if (!product) {
    return <ProductNotFound />;
  }

  return <ProductDetailContent product={product} />;
}

function ProductDetailContent({ product }: { product: ProductDetail }) {
  useSeo({ title: product.seoTitle, description: product.seoDescription });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.slug]);

  const related = getRelatedProducts(product.relatedProductSlugs);

  const overviewFields = [
    { label: 'Product', value: product.name },
    { label: 'Origin', value: product.origin },
    { label: 'Category', value: product.category },
    { label: 'Variety', value: product.variety },
    { label: 'Grade', value: product.grade },
    { label: 'Size', value: product.size },
    { label: 'Packaging', value: product.packaging },
    { label: 'Quantity', value: product.quantity },
    { label: 'Availability', value: product.availability },
  ];

  const exportFields = [
    { label: 'Origin', value: product.exportInfo.origin },
    { label: 'Destination', value: product.exportInfo.destination },
    { label: 'Incoterm', value: product.exportInfo.incoterm },
    { label: 'Documentation', value: product.exportInfo.documentation },
  ];

  return (
    <>
      <Header />
      <div className="pt-[4.5rem]">
        {/* Breadcrumb */}
        <div className="border-b border-charcoal-100 bg-white">
          <div className="container-page py-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-charcoal-500">
              <Link to="/" className="hover:text-brand-700">Home</Link>
              <ChevronRight className="h-3.5 w-3.5 text-charcoal-300" />
              <Link to="/products" className="hover:text-brand-700">Products</Link>
              <ChevronRight className="h-3.5 w-3.5 text-charcoal-300" />
              <Link to={`/products?category=${product.categorySlug}`} className="hover:text-brand-700">
                {product.category}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-charcoal-300" />
              <span className="font-medium text-charcoal-800">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Hero */}
        <section className="bg-white py-10 sm:py-14">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <span className="eyebrow">
                  <span className="h-px w-8 bg-brand-500" />
                  {product.category}
                </span>
                <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] text-charcoal-900 sm:text-4xl lg:text-[2.75rem]">
                  Indian {product.name}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal-600">
                  {product.description}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to={`/request-quote?product=${product.slug}`} className="btn-primary text-base">
                    Request a Quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/products" className="btn-secondary text-base">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Products
                  </Link>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative overflow-hidden rounded-2xl border border-charcoal-100 shadow-card">
                  <img
                    src={product.image}
                    alt={`Indian ${product.name} — sourced for export`}
                    className="h-64 w-full object-cover sm:h-80 lg:h-96"
                  />
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Overview */}
        <section className="bg-charcoal-50 py-14">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="eyebrow">
                  <span className="h-px w-8 bg-brand-500" />
                  Product Overview
                </p>
                <h2 className="mt-4 text-2xl font-bold text-charcoal-900">
                  Key information
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                  Specifications are confirmed with each buyer based on requirements,
                  quantity, and destination.
                </p>
              </div>
              <div className="lg:col-span-8">
                <dl className="grid gap-px overflow-hidden rounded-2xl border border-charcoal-100 bg-charcoal-100 sm:grid-cols-2">
                  {overviewFields.map((field) => (
                    <div key={field.label} className="bg-white p-5">
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-400">
                        {field.label}
                      </dt>
                      <dd className="mt-1.5 text-sm font-medium text-charcoal-800">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Buyer Specifications */}
        <section className="bg-white py-14">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <ScanSearch className="h-5 w-5" strokeWidth={2} />
                </span>
                <h2 className="mt-5 text-2xl font-bold text-charcoal-900">
                  Buyer Specifications
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                  Buyers can specify the following requirements when submitting an enquiry.
                  Each order is confirmed based on agreed specifications.
                </p>
              </div>
              <div className="lg:col-span-7">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {product.specifications.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-center gap-3 rounded-xl border border-charcoal-100 bg-white p-4"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" strokeWidth={2} />
                      <span className="text-sm font-medium text-charcoal-800">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Packaging & Quality */}
        <section className="bg-charcoal-50 py-14">
          <div className="container-page">
            <div className="grid gap-6 lg:grid-cols-2">
              <InfoCard icon={Package} title="Packaging Options" text={product.packagingNote} />
              <InfoCard icon={PackageCheck} title="Quality & Inspection" text={product.qualityNote} />
            </div>
          </div>
        </section>

        {/* Buyer Requirements */}
        <section className="bg-white py-14">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <FileCheck2 className="h-5 w-5" strokeWidth={2} />
                </span>
                <h2 className="mt-5 text-2xl font-bold text-charcoal-900">
                  Buyer Requirements
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                  Product specifications can vary according to the destination market,
                  buyer requirements, and applicable regulations. The following factors
                  are confirmed for each enquiry.
                </p>
              </div>
              <div className="lg:col-span-8">
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {BUYER_REQUIREMENT_FACTORS.map((factor) => (
                    <li
                      key={factor.title}
                      className="rounded-xl border border-charcoal-100 bg-white p-5"
                    >
                      <factor.icon className="h-5 w-5 text-brand-600" strokeWidth={2} />
                      <h3 className="mt-3 text-sm font-semibold text-charcoal-900">
                        {factor.title}
                      </h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-charcoal-600">
                        {factor.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Export Information */}
        <section className="bg-charcoal-50 py-14">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Ship className="h-5 w-5" strokeWidth={2} />
                </span>
                <h2 className="mt-5 text-2xl font-bold text-charcoal-900">
                  Export Information
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                  Export terms and documentation are confirmed per shipment based on
                  the destination country and product.
                </p>
              </div>
              <div className="lg:col-span-8">
                <dl className="grid gap-px overflow-hidden rounded-2xl border border-charcoal-100 bg-charcoal-100 sm:grid-cols-2">
                  {exportFields.map((field) => (
                    <div key={field.label} className="bg-white p-5">
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-400">
                        {field.label}
                      </dt>
                      <dd className="mt-1.5 text-sm font-medium text-charcoal-800">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Request a Quote CTA */}
        <section className="bg-brand-950 py-16">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow text-brand-300 justify-center">
                <span className="h-px w-8 bg-brand-400" />
                Buyer Enquiry
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Looking for this product?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-brand-200">
                Share your required quantity, specifications and destination. We can review
                your requirement and discuss the applicable commercial terms.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to={`/request-quote?product=${product.slug}`} className="btn-primary text-base">
                  Request a Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="btn border border-brand-700 bg-brand-900/40 px-5 py-3 text-base text-white hover:bg-brand-800/60"
                >
                  <FileText className="h-4 w-4" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="bg-white py-14">
            <div className="container-page">
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-charcoal-900">Related Products</h2>
                <Link
                  to={`/products?category=${product.categorySlug}`}
                  className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900 sm:inline-flex"
                >
                  View all {product.category}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((rel, i) => (
                  <ProductCard
                    key={rel.slug}
                    item={{
                      id: rel.slug,
                      name: rel.name,
                      description: rel.description,
                      image: rel.image,
                      routeSlug: rel.slug,
                    }}
                    categoryName={rel.category}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}

const BUYER_REQUIREMENT_FACTORS = [
  {
    icon: Globe2,
    title: 'Destination Market',
    text: 'Requirements may vary according to the destination country and its applicable regulations.',
  },
  {
    icon: ScanSearch,
    title: 'Buyer Requirements',
    text: 'Product specifications, quantity, and quality parameters are confirmed with each buyer.',
  },
  {
    icon: Scale,
    title: 'Quantity',
    text: 'Order quantity is discussed and confirmed based on availability and buyer needs.',
  },
  {
    icon: Layers,
    title: 'Grade & Size',
    text: 'Grade and size specifications are agreed according to buyer and market requirements.',
  },
  {
    icon: Package,
    title: 'Packaging',
    text: 'Packaging is discussed according to product type, destination, and buyer specifications.',
  },
  {
    icon: FileCheck2,
    title: 'Applicable Regulations',
    text: 'Destination-country regulations and documentation requirements are reviewed per shipment.',
  },
];

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Package;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-7">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-charcoal-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{text}</p>
    </div>
  );
}

function ProductNotFound() {
  useEffect(() => {
    document.title = 'Product Not Found | Setu Trade';
  }, []);

  return (
    <>
      <Header />
      <div className="flex min-h-[70vh] items-center justify-center bg-white pt-[4.5rem]">
        <div className="container-page max-w-lg text-center">
          <span className="text-6xl font-extrabold text-brand-200">404</span>
          <h1 className="mt-4 text-2xl font-bold text-charcoal-900">Product Not Found</h1>
          <p className="mt-3 text-base leading-relaxed text-charcoal-600">
            The product you are looking for may not be available or the link may be incorrect.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/products" className="btn-primary">
              Browse All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
