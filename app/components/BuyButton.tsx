import { Price } from '@commercetools/platform-sdk';
import './buy.css';

export function BuyButton({ prices }: { prices: Price[] | undefined }) {
  const priceObject = prices?.find(price => price.value.currencyCode == 'USD');

  let priceTxt: string;

  if (!priceObject) priceTxt = 'unavailable';
  else {
    const price =
      priceObject?.value.centAmount /
      Math.pow(10, priceObject?.value.fractionDigits);

    priceTxt = price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  return (
    <button className="buy">
      <span>{priceTxt}</span>
      <span>|</span>
      <span>Add to cart</span>
    </button>
  );
}
