import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe2, Leaf, ShieldCheck } from 'lucide-react';

const HERO_IMAGE =
  'https://images.pexels.com/photos/2382904/pexels-photo-2382904.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const PILLARS = [
  { icon: Leaf, title: 'Sourced from India', text: 'From major growing regions across the country.' },
  { icon: ShieldCheck, title: 'Buyer-specified', text: 'Specifications discussed according to buyer needs.' },
  { icon: Globe2, title: 'Export-oriented', text: 'Documentation and logistics coordination support.' },
];

export function Hero() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (hash: string) => {
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
    } else {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative isolate overflow-hidden bg-brand-950 pt-28">
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMAGE}
          alt="Indian agricultural field at harvest"
          className="h-full w-full object-cover opacity-35 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-950/80 to-brand-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-transparent" />
      </div>

      <div className="container-page py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <p className="eyebrow text-brand-300 animate-fade-up">
            <span className="h-px w-8 bg-brand-400" />
            Indian Agro Products &amp; Global Trade
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: '0.08s' }}>
            Bridging Indian Agriculture
            <span className="block text-brand-400">to the World.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100 animate-fade-up" style={{ animationDelay: '0.16s' }}>
            Setu Trade connects international buyers with fresh vegetables, agro products,
            millets and organic produce sourced from India.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: '0.24s' }}>
            <Link to="/request-quote" className="btn-primary text-base">
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => scrollTo('#products')}
              className="btn border border-brand-700 bg-brand-900/40 px-5 py-3 text-base text-white hover:bg-brand-800/60"
            >
              Explore Products
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-brand-900 bg-brand-900 sm:grid-cols-3 animate-fade-up" style={{ animationDelay: '0.32s' }}>
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-brand-950/60 p-6 backdrop-blur-sm">
              <p.icon className="h-7 w-7 text-brand-400" strokeWidth={1.8} />
              <h3 className="mt-4 text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-200">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
