export const formatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  trailingZeroDisplay: 'stripIfInteger',
});

export const parseParams = function (
  searchParams: {
    [key: string]: string | string[] | undefined;
  } = {}
) {
  const query = new URLSearchParams();

  for (let [q, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach(v => query.append(q, v));
    } else query.append(q, value ?? '');
  }

  return query;
};
