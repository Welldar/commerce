import { ProductVariant } from '@commercetools/platform-sdk';
import styles from './attributes.module.css';

export function Attr({
  displayedVariant,
}: {
  displayedVariant: ProductVariant;
}) {
  const locale = 'en-US';

  const productSpec = (
    displayedVariant.attributes?.find(attr => attr.name == 'productspec')
      ?.value[locale] as string
  )
    ?.split('\n')
    .map(spec => <div key={spec}>{spec}</div>);

  const colorLabel = displayedVariant.attributes?.find(
    attr => attr.name == 'colorlabel'
  )?.value[locale];

  const color = displayedVariant.attributes?.find(attr => attr.name == 'color')
    ?.value[locale];

  return (
    <div className={styles.attr}>
      <div className={styles.productSpec}>
        {productSpec ? productSpec : null}
      </div>
      <div>
        {colorLabel ? (
          <>
            <span className={styles.colorLabel}>Color: {colorLabel}</span>
            {color ? (
              <span
                className={styles.color}
                style={{ backgroundColor: color }}
              ></span>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
