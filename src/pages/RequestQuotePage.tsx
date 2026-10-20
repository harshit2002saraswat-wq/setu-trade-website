import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Package,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Send,
  Truck,
  Globe2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSeo } from '@/hooks/useSeo';
import { supabase } from '@/lib/supabase';
import { validateRfqForm, getFirstError, EMPTY_FORM, type RfqFormData, type FieldError } from '@/lib/validation';
import { PRODUCT_CATEGORIES } from '@/data/site';
import type { EnquiryInsert } from '@/types/enquiry';

const BUYER_TYPES = [
  'Importer',
  'Wholesaler',
  'Distributor',
  'Retailer',
  'Trading Company',
  'Food Processor',
  'Other',
];

const UNITS = ['MT', 'KG', 'Tons', 'Quintal', 'Bags', 'Cartons', 'Containers', 'Other'];

const INCOTERMS = ['FOB', 'CIF', 'CFR', 'EXW', 'FCA', 'DAP', 'DDP', 'Other'];
const PAYMENT_TERMS = ['Advance', 'LC', 'TT', 'DP', 'DA', 'Other'];

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function RequestQuotePage() {
  useSeo({
    title: 'Request a Quote | Setu Trade',
    description:
      'Submit a Request for Quote to Setu Trade. Share your product, quantity, specification, destination and commercial requirements.',
    canonicalPath: '/request-quote',
  });

  const [searchParams] = useSearchParams();
  const productSlug = searchParams.get('product');

  const initialForm = useMemo<RfqFormData>(() => {
    if (!productSlug) return EMPTY_FORM;
    const product = findProductBySlug(productSlug);
    if (product) {
      return { ...EMPTY_FORM, product: product.name };
    }
    return EMPTY_FORM;
  }, [productSlug]);

  const [form, setForm] = useState<RfqFormData>(initialForm);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string>('');

  const updateField = (field: keyof RfqFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitState('idle');
    if (errors.length > 0) {
      setErrors((prev) => prev.filter((e) => e.field !== field));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRfqForm(form);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitState('submitting');
    setSubmitError('');

    const insertData: EnquiryInsert = {
      full_name: form.full_name.trim(),
      company: form.company.trim() || null,
      country: form.country.trim(),
      city: form.city.trim() || null,
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      buyer_type: form.buyer_type.trim() || null,
      product: form.product.trim(),
      product_slug: productSlug || null,
      variety_grade: form.variety_grade.trim() || null,
      quantity: Number(form.quantity),
      unit: form.unit.trim(),
      packaging: form.packaging.trim() || null,
      destination: form.destination.trim(),
      delivery_date: form.delivery_date || null,
      specifications: form.specifications.trim() || null,
      message: form.message.trim() || null,
      incoterm: form.incoterm.trim() || null,
      payment_terms: form.payment_terms.trim() || null,
    };

    const { data, error } = await supabase.from('enquiries').insert(insertData).select('id').single();

    if (error) {
      setSubmitState('error');
      setSubmitError(
        'We could not submit your enquiry at this time. Please check your details and try again, or contact us directly.'
      );
      return;
    }

    if (data?.id) {
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-enquiry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ enquiryId: data.id }),
        });
      } catch {
        // Email notification failure does NOT fail the buyer submission.
      }
    }

    setSubmitState('success');
    window.scrollTo(0, 0);
  };

  if (submitState === 'success') {
    return <SuccessView />;
  }

  const preselectedProduct = productSlug ? findProductBySlug(productSlug) : null;

  return (
    <>
      <Header />
      <div className="pt-[4.5rem]">
        <section className="border-b border-charcoal-100 bg-white">
          <div className="container-page py-10 sm:py-14">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-brand-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Products
            </Link>
            <p className="eyebrow mt-5">
              <span className="h-px w-8 bg-brand-500" />
              Buyer Enquiry
            </p>
            <h1 className="section-title mt-4">Request a Quote</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-charcoal-600">
              Share your product, quantity, specification and destination. Setu Trade will
              review your requirement and contact you.
            </p>
            {preselectedProduct && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800">
                <Package className="h-4 w-4" />
                Pre-selected: {preselectedProduct.name}
              </div>
            )}
          </div>
        </section>

        <section className="bg-charcoal-50 py-12 sm:py-16">
          <div className="container-page max-w-4xl">
            {submitState === 'error' && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm leading-relaxed text-red-800">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              <FormSection
                title="Contact Information"
                icon={User}
                description="Tell us who you are and how we can reach you."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" required error={getFirstError('full_name', errors)}>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={(e) => updateField('full_name', e.target.value)}
                      maxLength={100}
                      className={inputClass(!!getFirstError('full_name', errors))}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Company" error={getFirstError('company', errors)}>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      maxLength={200}
                      className={inputClass(false)}
                      placeholder="Company name"
                      autoComplete="organization"
                    />
                  </Field>
                  <Field label="Country" required error={getFirstError('country', errors)}>
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      maxLength={100}
                      className={inputClass(!!getFirstError('country', errors))}
                      placeholder="Your country"
                      autoComplete="country-name"
                    />
                  </Field>
                  <Field label="City" error={getFirstError('city', errors)}>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      maxLength={100}
                      className={inputClass(false)}
                      placeholder="Your city"
                    />
                  </Field>
                  <Field label="Email" required error={getFirstError('email', errors)}>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        maxLength={200}
                        className={`${inputClass(!!getFirstError('email', errors))} pl-9`}
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                    </div>
                  </Field>
                  <Field label="Phone / WhatsApp" error={getFirstError('phone', errors)}>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        maxLength={50}
                        className={`${inputClass(false)} pl-9`}
                        placeholder="+1 555 000 0000"
                        autoComplete="tel"
                      />
                    </div>
                  </Field>
                  <Field label="Buyer Type" error={getFirstError('buyer_type', errors)}>
                    <select
                      value={form.buyer_type}
                      onChange={(e) => updateField('buyer_type', e.target.value)}
                      className={selectClass(false)}
                    >
                      <option value="">Select buyer type</option>
                      {BUYER_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </FormSection>

              <FormSection
                title="Product Requirements"
                icon={Package}
                description="What product are you looking for and in what quantity?"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Product" required error={getFirstError('product', errors)}>
                    <select
                      value={form.product}
                      onChange={(e) => updateField('product', e.target.value)}
                      className={selectClass(!!getFirstError('product', errors))}
                    >
                      <option value="">Select a product</option>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <optgroup key={cat.slug} label={cat.name}>
                          {cat.items.map((item) => (
                            <option key={item.id} value={item.name}>{item.name}</option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="Other">Other (specify in specifications)</option>
                    </select>
                  </Field>
                  <Field label="Variety / Grade" error={getFirstError('variety_grade', errors)}>
                    <input
                      type="text"
                      value={form.variety_grade}
                      onChange={(e) => updateField('variety_grade', e.target.value)}
                      maxLength={200}
                      className={inputClass(false)}
                      placeholder="e.g. Grade A, Basmati"
                    />
                  </Field>
                  <Field label="Quantity" required error={getFirstError('quantity', errors)}>
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={(e) => updateField('quantity', e.target.value)}
                      min="0"
                      step="any"
                      className={inputClass(!!getFirstError('quantity', errors))}
                      placeholder="e.g. 100"
                    />
                  </Field>
                  <Field label="Unit" required error={getFirstError('unit', errors)}>
                    <select
                      value={form.unit}
                      onChange={(e) => updateField('unit', e.target.value)}
                      className={selectClass(!!getFirstError('unit', errors))}
                    >
                      <option value="">Select unit</option>
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Packaging" error={getFirstError('packaging', errors)}>
                    <input
                      type="text"
                      value={form.packaging}
                      onChange={(e) => updateField('packaging', e.target.value)}
                      maxLength={200}
                      className={inputClass(false)}
                      placeholder="e.g. 25kg bags, jute sacks"
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                title="Delivery & Commercial Terms"
                icon={Truck}
                description="Where should the product be delivered and under what terms?"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Destination Country / City / Port"
                    required
                    error={getFirstError('destination', errors)}
                  >
                    <div className="relative">
                      <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                      <input
                        type="text"
                        value={form.destination}
                        onChange={(e) => updateField('destination', e.target.value)}
                        maxLength={200}
                        className={`${inputClass(!!getFirstError('destination', errors))} pl-9`}
                        placeholder="e.g. Dubai, UAE"
                      />
                    </div>
                  </Field>
                  <Field label="Required Delivery Date" error={getFirstError('delivery_date', errors)}>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                      <input
                        type="date"
                        value={form.delivery_date}
                        onChange={(e) => updateField('delivery_date', e.target.value)}
                        className={`${inputClass(!!getFirstError('delivery_date', errors))} pl-9`}
                      />
                    </div>
                  </Field>
                  <Field label="Incoterm" error={getFirstError('incoterm', errors)}>
                    <select
                      value={form.incoterm}
                      onChange={(e) => updateField('incoterm', e.target.value)}
                      className={selectClass(false)}
                    >
                      <option value="">Select incoterm</option>
                      {INCOTERMS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Payment Terms" error={getFirstError('payment_terms', errors)}>
                    <select
                      value={form.payment_terms}
                      onChange={(e) => updateField('payment_terms', e.target.value)}
                      className={selectClass(false)}
                    >
                      <option value="">Select payment terms</option>
                      {PAYMENT_TERMS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </FormSection>

              <FormSection
                title="Additional Details"
                icon={FileText}
                description="Share any further specifications or a message for our team."
              >
                <div className="space-y-5">
                  <Field label="Product Specifications" error={getFirstError('specifications', errors)}>
                    <textarea
                      value={form.specifications}
                      onChange={(e) => updateField('specifications', e.target.value)}
                      maxLength={5000}
                      rows={4}
                      className={textareaClass(false)}
                      placeholder="Size, grade, moisture content, quality standards, certifications, etc."
                    />
                  </Field>
                  <Field label="Additional Message" error={getFirstError('message', errors)}>
                    <textarea
                      value={form.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      maxLength={5000}
                      rows={4}
                      className={textareaClass(false)}
                      placeholder="Any additional information you would like to share."
                    />
                  </Field>
                </div>
              </FormSection>

              <div className="flex flex-col gap-4 border-t border-charcoal-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-charcoal-500">
                  By submitting this enquiry, you agree to be contacted by Setu Trade regarding your requirement.
                </p>
                <button
                  type="submit"
                  disabled={submitState === 'submitting'}
                  className="btn-primary text-base"
                >
                  {submitState === 'submitting' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Enquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

function SuccessView() {
  return (
    <>
      <Header />
      <div className="flex min-h-[80vh] items-center justify-center bg-white pt-[4.5rem]">
        <div className="container-page max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700 animate-fade-in">
            <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-charcoal-900 sm:text-4xl animate-fade-up">
            Thank you for your enquiry.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-charcoal-600 animate-fade-up" style={{ animationDelay: '0.08s' }}>
            Setu Trade will review your requirement and contact you. We do not guarantee a
            specific response time, but our team aims to respond to all genuine enquiries.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: '0.16s' }}>
            <Link to="/products" className="btn-secondary text-base">
              <ArrowLeft className="h-4 w-4" />
              Browse Products
            </Link>
            <Link to="/" className="btn-primary text-base">
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Package;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-charcoal-900">{title}</h2>
          <p className="mt-1 text-sm text-charcoal-500">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-charcoal-700">
        {label}
        {required && <span className="ml-0.5 text-brand-600">*</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </span>
      )}
    </label>
  );
}

function inputClass(hasError: boolean): string {
  return `w-full rounded-lg border bg-white py-2.5 px-3.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-charcoal-200 focus:border-brand-400 focus:ring-brand-100'
  }`;
}

function selectClass(hasError: boolean): string {
  return inputClass(hasError);
}

function textareaClass(hasError: boolean): string {
  return `${inputClass(hasError)} resize-y leading-relaxed`;
}

function findProductBySlug(slug: string): { name: string } | null {
  for (const cat of PRODUCT_CATEGORIES) {
    const item = cat.items.find((i) => i.routeSlug === slug);
    if (item) return { name: item.name };
  }
  return null;
}
