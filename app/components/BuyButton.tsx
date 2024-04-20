import { ScopedPrice, TypedMoney } from '@commercetools/platform-sdk';
import { formatPrice } from '../utility';
import './buy.css';

export function BuyButton({
  price,
  discounted,
  onClick,
}: {
  price: ScopedPrice;
  discounted: boolean;
  onClick: () => void;
}) {
  const discountPrice = discounted
    ? formatPrice(price.currentValue)
    : undefined;
  const fullPrice = formatPrice(price.value);

  return (
    <button className="buy" onClick={onClick}>
      <span>
        <span className={discounted ? 'discount' : ''}>
          {fullPrice}
          <span>{discounted ? `${discountPrice}` : null}</span>
        </span>
      </span>
      <span>|</span>
      <span>Add to cart</span>
    </button>
  );
}
