import { ScopedPrice, TypedMoney } from '@commercetools/platform-sdk';
import { formatter } from '../utility';
import './buy.css';

function formatPrice(price: TypedMoney) {
  return formatter.format(
    price.centAmount / Math.pow(10, price.fractionDigits)
  );
}

export function BuyButton({
  price,
  discounted,
}: {
  price: ScopedPrice;
  discounted: boolean;
}) {
  const discountPrice = discounted
    ? formatPrice(price.currentValue)
    : undefined;
  const fullPrice = formatPrice(price.value);

  return (
    <button className="buy">
      <span>
        <span className={discounted ? 'discount' : ''}>
          {discounted ? `${discountPrice}` : null}
          <span>{fullPrice}</span>
        </span>
      </span>
      <span>|</span>
      <span>Add to cart</span>
    </button>
  );
}
