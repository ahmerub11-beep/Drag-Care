import { Truck, ShieldCheck, HeartHandshake, CreditCard } from 'lucide-react';
import { useStorefront } from '../../../components/ProductCatalog';

export default function FeaturesBanner() {
  const { formatCurrency, t } = useStorefront();
  const features = [
    {
      icon: <Truck size={24} />,
      title: '2-Hour Express Delivery',
      desc: `Free cold-chain delivery on orders over ${formatCurrency(30)}`
    },
    {
      icon: <ShieldCheck size={24} />,
      title: '100% Genuine Medicines',
      desc: 'Sourced directly from licensed pharmaceutical manufacturers'
    },
    {
      icon: <HeartHandshake size={24} />,
      title: 'Free Pharmacist Consultation',
      desc: 'Talk with certified Doctor of Pharmacy for dosage & safety'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Safe & Flexible Payments',
      desc: 'Cash on Delivery, Debit/Credit Card, and Mobile Wallets'
    }
  ];

  return (
    <div className="container">
      <div className="features-ribbon card border-0 shadow-sm my-3">
        <div className="features-grid row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 p-3">
          {features.map((item, idx) => (
            <div key={idx} className="feature-item col d-flex align-items-start gap-3">
              <div className="feature-icon-circle text-primary flex-shrink-0">
                {item.icon}
              </div>
              <div className="feature-text">
                <h4>{t(item.title)}</h4>
                <p>{item.title === '2-Hour Express Delivery'
                  ? t('Free cold-chain delivery on orders over') + ` ${formatCurrency(30)}`
                  : t(item.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
