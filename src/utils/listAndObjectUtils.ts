import type { PaymentMethod, PaymentClass } from '../interface';
import { Platform } from 'react-native';

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


export function getDeviceDetails() {
  return {
    browser: Platform.OS,
    platformVersion: Platform.Version.toString(),
    deviceType: Platform.OS === 'ios' || Platform.OS === 'android' ? 'Phone' : 'Web',
    deviceName: Platform.OS === 'ios' ? 'iOS Device' : 'Android Device',
    deviceBrandName: Platform.OS === 'ios' ? 'Apple' : 'Android'
  };
}