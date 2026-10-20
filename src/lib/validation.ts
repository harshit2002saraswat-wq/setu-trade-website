export interface FieldError {
  field: string;
  message: string;
}

export interface RfqFormData {
  full_name: string;
  company: string;
  country: string;
  city: string;
  email: string;
  phone: string;
  buyer_type: string;
  product: string;
  variety_grade: string;
  quantity: string;
  unit: string;
  packaging: string;
  destination: string;
  delivery_date: string;
  specifications: string;
  message: string;
  incoterm: string;
  payment_terms: string;
}

export const EMPTY_FORM: RfqFormData = {
  full_name: '',
  company: '',
  country: '',
  city: '',
  email: '',
  phone: '',
  buyer_type: '',
  product: '',
  variety_grade: '',
  quantity: '',
  unit: '',
  packaging: '',
  destination: '',
  delivery_date: '',
  specifications: '',
  message: '',
  incoterm: '',
  payment_terms: '',
};

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const MAX_LENGTHS: Record<keyof RfqFormData, number> = {
  full_name: 100,
  company: 200,
  country: 100,
  city: 100,
  email: 200,
  phone: 50,
  buyer_type: 100,
  product: 200,
  variety_grade: 200,
  quantity: 12,
  unit: 20,
  packaging: 200,
  destination: 200,
  delivery_date: 10,
  specifications: 5000,
  message: 5000,
  incoterm: 50,
  payment_terms: 200,
};

export function validateRfqForm(data: RfqFormData): FieldError[] {
  const errors: FieldError[] = [];

  // Required: full_name
  if (!data.full_name.trim()) {
    errors.push({ field: 'full_name', message: 'Full name is required.' });
  } else if (data.full_name.trim().length < 2) {
    errors.push({ field: 'full_name', message: 'Full name must be at least 2 characters.' });
  } else if (data.full_name.trim().length > MAX_LENGTHS.full_name) {
    errors.push({ field: 'full_name', message: `Full name must be under ${MAX_LENGTHS.full_name} characters.` });
  }

  // Required: email + valid format
  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required.' });
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  } else if (data.email.trim().length > MAX_LENGTHS.email) {
    errors.push({ field: 'email', message: `Email must be under ${MAX_LENGTHS.email} characters.` });
  }

  // Required: country
  if (!data.country.trim()) {
    errors.push({ field: 'country', message: 'Country is required.' });
  } else if (data.country.trim().length < 2) {
    errors.push({ field: 'country', message: 'Country must be at least 2 characters.' });
  }

  // Required: product
  if (!data.product.trim()) {
    errors.push({ field: 'product', message: 'Product is required.' });
  }

  // Required: quantity + positive number
  if (!data.quantity.trim()) {
    errors.push({ field: 'quantity', message: 'Quantity is required.' });
  } else {
    const qty = Number(data.quantity);
    if (isNaN(qty) || qty <= 0) {
      errors.push({ field: 'quantity', message: 'Quantity must be a positive number.' });
    }
  }

  // Required: unit
  if (!data.unit.trim()) {
    errors.push({ field: 'unit', message: 'Unit is required.' });
  }

  // Required: destination
  if (!data.destination.trim()) {
    errors.push({ field: 'destination', message: 'Destination is required.' });
  } else if (data.destination.trim().length < 2) {
    errors.push({ field: 'destination', message: 'Destination must be at least 2 characters.' });
  }

  // Optional field length checks
  const optionalFields: (keyof RfqFormData)[] = [
    'company', 'city', 'phone', 'buyer_type', 'variety_grade',
    'packaging', 'specifications', 'message', 'incoterm', 'payment_terms',
  ];
  for (const field of optionalFields) {
    const value = data[field].trim();
    if (value && value.length > MAX_LENGTHS[field]) {
      errors.push({ field, message: `${field.replace(/_/g, ' ')} must be under ${MAX_LENGTHS[field]} characters.` });
    }
  }

  // Delivery date: if provided, must not be in the past
  if (data.delivery_date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(data.delivery_date);
    if (isNaN(delivery.getTime())) {
      errors.push({ field: 'delivery_date', message: 'Please enter a valid date.' });
    } else if (delivery < today) {
      errors.push({ field: 'delivery_date', message: 'Delivery date cannot be in the past.' });
    }
  }

  return errors;
}

export function getFirstError(field: string, errors: FieldError[]): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}
