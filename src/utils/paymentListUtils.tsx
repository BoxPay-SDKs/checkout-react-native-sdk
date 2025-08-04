import type { PaymentMethod, PaymentClass } from '../interface';

export function transformAndFilterList(
  data: PaymentMethod[],
  filterType: string
): PaymentClass[] {
  const filteredList = data
    .filter((item) => item.type === filterType)
    .sort((a, b) => a.title?.trim().localeCompare(b.title?.trim() ?? ''))
    .map((item) => ({
      type: filterType,
      id: item.id,
      displayName: item.title,
      displayValue: item.title,
      iconUrl: item.logoUrl,
      instrumentTypeValue: item.instrumentTypeValue,
      isSelected: false,
    }));

  return filteredList;
}
