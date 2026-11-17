import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import ProductCatalog from '../../components/ProductCatalog';
import Footer from '../../components/Footer';
import CartDrawer from '../../components/CartDrawer';
import PrescriptionModal from '../../components/PrescriptionModal';
import QuickViewModal from '../../components/QuickViewModal';
import CheckoutModal from '../../components/CheckoutModal';
import ConsultPharmacistModal from '../../components/ConsultPharmacistModal';

export default function Medicines() {
  return (
    <div className="app-root min-vh-100">
      <Header />
      <Navbar />

      <main className="py-4">
        <ProductCatalog title="All Medicines" />
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
