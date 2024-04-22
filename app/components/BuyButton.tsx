import { Price } from '@commercetools/platform-sdk';
import { formatPrice } from '../utility';
import './buy.css';

export function BuyButton({
  price,
  onClick,
}: {
  price: Price;
  onClick?: () => void;
}) {
  if (!price) return <div>no price</div>;

  const discounted = price.discounted;
  const discountPrice = discounted
    ? formatPrice(price.discounted.value)
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
