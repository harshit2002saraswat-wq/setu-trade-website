import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EnquiryRow {
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
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { enquiryId } = await req.json();

    if (!enquiryId || typeof enquiryId !== 'string') {
      return new Response(JSON.stringify({ error: 'enquiryId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ status: 'not_configured', message: 'Missing server configuration' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: enquiry, error: fetchError } = await supabase
      .from('enquiries')
      .select(
        'id, created_at, full_name, company, country, city, email, phone, buyer_type, product, product_slug, variety_grade, quantity, unit, packaging, destination, delivery_date, specifications, message, incoterm, payment_terms',
      )
      .eq('id', enquiryId)
      .single<EnquiryRow>();

    if (fetchError || !enquiry) {
      return new Response(JSON.stringify({ error: 'Enquiry not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const adminEmail = Deno.env.get('ADMIN_NOTIFY_EMAIL');
    const emailFromAddress = Deno.env.get('EMAIL_FROM_ADDRESS');
    const appUrl = Deno.env.get('APP_URL') || supabaseUrl;

    if (!resendApiKey || !adminEmail || !emailFromAddress) {
      await supabase.from('enquiries').update({ email_status: 'not_configured' }).eq('id', enquiryId);

      return new Response(
        JSON.stringify({ status: 'not_configured', message: 'Email notification is not configured' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const submissionDate = new Date(enquiry.created_at).toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const adminLink = `${appUrl}/admin/enquiries/${enquiry.id}`;
    const subject = `New RFQ: ${enquiry.product} — ${enquiry.full_name}`;
    const emailBody = buildEmailBody(enquiry, submissionDate, adminLink);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Setu Trade RFQ <${emailFromAddress}>`,
        to: [adminEmail],
        subject,
        text: emailBody,
      }),
    });

    if (!response.ok) {
      await supabase.from('enquiries').update({ email_status: 'failed' }).eq('id', enquiryId);

      return new Response(
        JSON.stringify({ status: 'failed', message: 'Email delivery failed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    await supabase.from('enquiries').update({ email_status: 'sent' }).eq('id', enquiryId);

    return new Response(JSON.stringify({ status: 'sent', message: 'Notification email sent' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal server error', detail: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildEmailBody(enquiry: EnquiryRow, submissionDate: string, adminLink: string): string {
  const na = 'N/A';
  const lines: string[] = [
    'New Buyer Enquiry (RFQ) — Setu Trade',
    '========================================',
    '',
    '--- Buyer Information ---',
    `Name:            ${enquiry.full_name}`,
    `Company:         ${enquiry.company || na}`,
    `Country:         ${enquiry.country}`,
    `City:            ${enquiry.city || na}`,
    `Email:           ${enquiry.email}`,
    `Phone/WhatsApp:  ${enquiry.phone || na}`,
    `Buyer Type:      ${enquiry.buyer_type || na}`,
    '',
    '--- Product Requirements ---',
    `Product:         ${enquiry.product}`,
    `Variety/Grade:   ${enquiry.variety_grade || na}`,
    `Quantity:        ${enquiry.quantity} ${enquiry.unit}`,
    `Packaging:       ${enquiry.packaging || na}`,
    '',
    '--- Delivery & Commercial Terms ---',
    `Destination:     ${enquiry.destination}`,
    `Delivery Date:   ${enquiry.delivery_date || na}`,
    `Incoterm:        ${enquiry.incoterm || na}`,
    `Payment Terms:   ${enquiry.payment_terms || na}`,
    '',
    '--- Specifications ---',
    enquiry.specifications || na,
    '',
    '--- Additional Message ---',
    enquiry.message || na,
    '',
    `Submission Date: ${submissionDate} (UTC)`,
    '',
    `View in admin dashboard: ${adminLink}`,
    '',
    'This is an automated notification from Setu Trade.',
  ];
  return lines.join('\n');
}
