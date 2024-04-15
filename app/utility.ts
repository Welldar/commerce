export const formatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  trailingZeroDisplay: 'stripIfInteger',
});
