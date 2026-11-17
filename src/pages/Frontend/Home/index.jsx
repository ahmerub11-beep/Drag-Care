import Header from '../../../components/Header';
import Navbar from '../../../components/Navbar';
import HeroSlider from './HeroSlider';
import FeaturesBanner from './FeaturesBanner';
import PrescriptionUploadBanner from './PrescriptionUploadBanner';
import CategoryList from './CategoryList';
import FlashDeals from './FlashDeals';
import ProductCatalog from '../../../components/ProductCatalog';
import TrustSection from './TrustSection';
import TestimonialsSection from './TestimonialsSection';
import HealthTips from './HealthTips';
import Footer from '../../../components/Footer';
import CartDrawer from '../../../components/CartDrawer';
import PrescriptionModal from '../../../components/PrescriptionModal';
import QuickViewModal from '../../../components/QuickViewModal';
import CheckoutModal from '../../../components/CheckoutModal';
import ConsultPharmacistModal from '../../../components/ConsultPharmacistModal';

export default function Frontend() {
  return (
    <div className="app-root min-vh-100">
      <Header />
      <Navbar />

      <main>
        <HeroSlider />
        <FeaturesBanner />
        <CategoryList />
        <FlashDeals />
        <PrescriptionUploadBanner />
        <ProductCatalog />
        <TrustSection />
        <TestimonialsSection />
        <HealthTips />
      </main>

      <Footer />
      <CartDrawer />
      <PrescriptionModal />
      <QuickViewModal />
      <CheckoutModal />
      <ConsultPharmacistModal />
    </div>
  );
}
