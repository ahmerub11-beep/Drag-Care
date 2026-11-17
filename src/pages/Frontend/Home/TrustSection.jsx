import { ThermometerSnowflake, ShieldCheck, UserCheck } from 'lucide-react';

export default function TrustSection() {
  const points = [
    {
      icon: <ThermometerSnowflake size={28} />,
      title: 'Certified Cold-Chain Storage',
      desc: 'Insulins, biologics, and vaccines are stored in continuous IoT temperature sensors (2°C - 8°C) and shipped in insulated ice coolers.'
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Batch Expiry & Source Tracking',
      desc: 'Zero counterfeit policy. We only source directly from multinational and DRAP licensed pharma laboratories with guaranteed 1+ year shelf life.'
    },
    {
      icon: <UserCheck size={28} />,
      title: 'Doctor of Pharmacy (Pharm-D) On Call',
      desc: 'Every prescription is checked for therapeutic dosage, duplicate therapies, and food-drug interactions before being packed.'
    }
  ];

  return (
    <div className="container">
      <div className="trust-section card border-0 shadow-sm p-3 p-md-5 my-4">
        <div className="text-center mx-auto mb-4" style={{ maxWidth: '700px' }}>
          <span style={{ color: '#7A45A9', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Unmatched Clinical Standards
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#1D395F', marginTop: '6px' }}>
            Why Families & Doctors Rely on Drag Care
          </h2>
        </div>

        <div className="trust-grid row row-cols-1 row-cols-md-3 g-3">
          {points.map((p, idx) => (
            <div key={idx} className="trust-card card h-100 text-center p-3">
              <div className="trust-icon-box">
                {p.icon}
              </div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
