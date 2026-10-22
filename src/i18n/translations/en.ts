/**
 * English source strings. This file defines the translation key schema;
 * every other locale is typed against it and falls back to it per key.
 * Product, category, market and blog content is translated separately via
 * the content dictionaries in src/i18n/content.
 */
export const en = {
  language: {
    label: 'Language',
    select: 'Select language',
  },
  common: {
    loading: 'Loading',
    requestQuote: 'Request a Quote',
    becomeSupplier: 'Become a Supplier',
    contactUs: 'Contact Us',
    viewAllProducts: 'View all products',
    viewDetails: 'View details',
    learnMore: 'Learn more',
    backToHome: 'Back to home',
    skipToContent: 'Skip to content',
    brandTagline: 'Agro Products • Global Trade',
    homeLabel: 'Setu Trade home',
  },
  nav: {
    primary: 'Primary',
    mobile: 'Mobile',
    home: 'Home',
    products: 'Products',
    about: 'About',
    insights: 'Insights',
    contact: 'Contact',
    suppliers: 'Suppliers',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    expand: 'Expand {label}',
    megaPrompt: 'Looking for a specific product or grade?',
  },
  footer: {
    about:
      'India-based exporter of fresh vegetables, agro products, millets, spices, dry fruits, nuts and organic produce — connecting international buyers with quality Indian agriculture.',
    location: 'India',
    contactLink: 'Contact us for enquiries',
    phone: 'Available on request',
    products: 'Products',
    company: 'Company',
    aboutUs: 'About Us',
    workWithUs: 'Work with us',
    rights: '© {year} Setu Trade. All rights reserved.',
    builtFor: 'Built for international agricultural trade.',
  },
  home: {
    seo: {
      title: 'Setu Trade — Indian Agro Products & Global Trade',
      description:
        'Setu Trade connects international buyers with Indian agricultural products including fresh vegetables, agro products, millets, spices, dry fruits, nuts and organic produce.',
    },
    hero: {
      imageAlt: 'Indian agricultural field at harvest',
      eyebrow: 'Indian Agro Products & Global Trade',
      titleLine1: 'Bridging Indian Agriculture',
      titleLine2: 'to the World.',
      subtitle:
        'Setu Trade connects international buyers with fresh vegetables, agro products, millets and organic produce sourced from India.',
      explore: 'Explore Products',
      pillars: {
        sourced: { title: 'Sourced from India', text: 'From major growing regions across the country.' },
        specified: { title: 'Buyer-specified', text: 'Specifications discussed according to buyer needs.' },
        export: { title: 'Export-oriented', text: 'Documentation and logistics coordination support.' },
      },
    },
    categories: {
      title: 'Explore Our Products',
      subtitle: 'Explore agricultural products sourced from India for international buyers and business requirements.',
      browseAll: 'Browse All Products',
    },
    featured: {
      eyebrow: 'Our Product Range',
      title: 'Featured Products',
      subtitle: 'A selection of agricultural products from our catalogue, available for international buyer enquiries.',
    },
    why: {
      eyebrow: 'Why Setu Trade',
      title: 'Why Work With Setu Trade?',
      subtitle: 'A practical approach to sourcing Indian agricultural products for international buyers.',
    },
    markets: {
      eyebrow: 'Target Markets',
      title: 'Connecting India With Global Markets',
      subtitle:
        'We work toward connecting Indian agricultural products with buyers across international markets, subject to product requirements and destination-country regulations.',
    },
    process: {
      eyebrow: 'How We Work',
      title: 'How We Work',
      subtitle: 'A clear process from buyer enquiry to shipment, adapted to the requirements of each transaction.',
    },
    about: {
      imageAlt: 'Indian farmer in an agricultural field',
      eyebrow: 'About Setu Trade',
      title: 'A bridge between Indian agriculture and international buyers',
      p1: 'Setu Trade is an India-based agricultural trading company. The word "Setu" means "bridge" — and that is what we aim to do: connect international buyers with Indian agricultural products including fresh vegetables, agro products, millets and organic produce.',
      p2: 'We work with buyer-specified requirements across product, quantity, packaging and destination, coordinating sourcing and export documentation according to each transaction.',
      contact: 'Contact Setu Trade',
    },
    cta: {
      buyerEyebrow: 'For Buyers',
      buyerTitle: 'Looking for Agricultural Products from India?',
      buyerText:
        'Tell us what product you need, the required quantity, specification and destination. Our team can review your requirement.',
      supplierEyebrow: 'For Suppliers',
      supplierTitle: 'Are You a Farmer, FPO, Trader or Supplier?',
      supplierText:
        'Share your available agricultural products and supply details with Setu Trade for potential sourcing opportunities.',
    },
  },
  notFound: {
    seoTitle: 'Page Not Found | Setu Trade',
    seoDescription: 'The page you are looking for could not be found.',
    title: 'Page Not Found',
    message: 'The page {path} could not be found.',
    browse: 'Browse Products',
  },
};
