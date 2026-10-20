export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'quoted'
  | 'negotiating'
  | 'confirmed'
  | 'closed'
  | 'rejected';

export type EmailStatus = 'pending' | 'sent' | 'failed' | 'not_configured';

export interface Enquiry {
  id: string;
  created_at: string;
  full_name: string;
  company: string | null;
  country: string;
  city: string | null;
  email: string;
  phone: string | null;
  buyer_type: string | null;
  product: string;
  product_slug: string | null;
  variety_grade: string | null;
  quantity: number;
  unit: string;
  packaging: string | null;
  destination: string;
  delivery_date: string | null;
  specifications: string | null;
  message: string | null;
  incoterm: string | null;
  payment_terms: string | null;
  status: EnquiryStatus;
  email_status: EmailStatus;
}

export interface EnquiryInsert {
  full_name: string;
  company: string | null;
  country: string;
  city: string | null;
  email: string;
  phone: string | null;
  buyer_type: string | null;
  product: string;
  product_slug: string | null;
  variety_grade: string | null;
  quantity: number;
  unit: string;
  packaging: string | null;
  destination: string;
  delivery_date: string | null;
  specifications: string | null;
  message: string | null;
  incoterm: string | null;
  payment_terms: string | null;
}

export const ENQUIRY_STATUSES: EnquiryStatus[] = [
  'new',
  'contacted',
  'quoted',
  'negotiating',
  'confirmed',
  'closed',
  'rejected',
];

export const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  negotiating: 'Negotiating',
  confirmed: 'Confirmed',
  closed: 'Closed',
  rejected: 'Rejected',
};

export const STATUS_COLORS: Record<EnquiryStatus, string> = {
  new: 'bg-brand-100 text-brand-800 border-brand-200',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200',
  quoted: 'bg-amber-100 text-amber-800 border-amber-200',
  negotiating: 'bg-purple-100 text-purple-800 border-purple-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-charcoal-100 text-charcoal-700 border-charcoal-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};
