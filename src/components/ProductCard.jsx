import { useState } from 'react';
import { 
  Heart, 
  Eye, 
  ShoppingBag, 
  Star, 
  Check, 
  Plus,
  Minus
} from 'lucide-react';
import { resolveImageUrl } from '../api';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted, 
  onQuickView,
  formatCurrency,
  t
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="product-card col">
      <div className="card h-100 p-3">
      {/* Badges */}
      <div className="product-badges">
        {product.discountPercent > 0 && (
          <span className="badge-tag badge-discount">-{product.discountPercent}%</span>
        )}
        {product.isRxRequired && (
          <span className="badge-tag badge-rx">Rx Required</span>
        )}
        {product.isColdChain && (
          <span className="badge-tag badge-cold" title="Store at 2°C to 8°C">
            ❄ Cold Chain
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
        onClick={() => onToggleWishlist(product.id)}
        title={t(isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist')}
      >
        <Heart size={16} fill={isWishlisted ? '#DB4444' : 'none'} color={isWishlisted ? '#DB4444' : 'currentColor'} />
      </button>

      {/* Product Image */}
      <div className="product-image-container ratio ratio-1x1 bg-light mb-3">
        <img 
          src={resolveImageUrl(product.image)} 
          alt={product.name} 
          className="product-image position-absolute top-0 start-0 w-100 h-100 object-fit-contain"
          loading="lazy" 
        />
        <button 
          className="product-quickview-btn"
          onClick={() => onQuickView(product)}
        >
          <Eye size={13} />
          <span>{t('Quick View')}</span>
        </button>
      </div>

      {/* Content Details */}
      <div className="flex-grow-1">
        <div className="product-brand">{product.manufacturer}</div>
        <h3 
          className="product-title" 
          title={product.name}
          onClick={() => onQuickView(product)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h3>
        <div className="product-salt-formula" title={product.genericSalt}>
          {t('Formula:')} {product.genericSalt}
        </div>

        <div className="product-meta-row">
          <span className="product-expiry">Exp: {product.expiryDate}</span>
          <div className="product-rating">
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            <span>{product.rating}</span>
            <span style={{ color: '#94A3B8', fontSize: '10.5px' }}>({product.reviewsCount})</span>
          </div>
        </div>

        <div className="product-price-row">
          <span className="product-curr-price">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="product-old-price">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
      </div>

      {/* Action Row */}
      <div className="product-action-row d-flex justify-content-between align-items-center gap-2 mt-3">
        <div className="qty-stepper input-group input-group-sm w-auto">
          <button 
            className="qty-btn btn btn-outline-secondary"
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            title={t('Decrease quantity')}
          >
            <Minus size={12} />
          </button>
          <span className="qty-val input-group-text">{quantity}</span>
          <button 
            className="qty-btn btn btn-outline-secondary"
            onClick={() => setQuantity(prev => prev + 1)}
            title={t('Increase quantity')}
          >
            <Plus size={12} />
          </button>
        </div>

        <button 
          className="btn-add-cart btn btn-primary d-flex align-items-center gap-2"
          onClick={handleAdd}
          style={{ background: isAdded ? '#10B981' : undefined }}
        >
          {isAdded ? (
            <>
              <Check size={15} />
              <span>{t('Added!')}</span>
            </>
          ) : (
            <>
              <ShoppingBag size={15} />
              <span>{t('Add')}</span>
            </>
          )}
        </button>
      </div>
      </div>
    </div>
  );
}
