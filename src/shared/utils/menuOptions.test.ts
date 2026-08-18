import { describe, it, expect } from 'vitest';
import { flattenMenuGroups } from './menuOptions';

describe('flattenMenuGroups', () => {
  it('returns empty array when given empty options', () => {
    expect(flattenMenuGroups([])).toEqual([]);
    expect(flattenMenuGroups(undefined as any)).toEqual([]);
  });

  it('leaves a list with no groups untouched', () => {
    const items = [
      { label: 'بازار', key: '/marketplace' },
      { label: 'پروفایل', key: '/me' }
    ];
    const result = flattenMenuGroups(items);
    expect(result).toEqual(items);
    expect(result).not.toBe(items); // Ensures shallow clone
  });

  it('extracts children from groups and drops group wrappers', () => {
    const input = [
      { label: 'بازار', key: '/marketplace' },
      {
        type: 'group',
        label: 'مدیریت چک',
        children: [
          { label: 'ثبت آگهی', key: '/listings/create' },
          { label: 'آگهی‌های من', key: '/listings/my' }
        ]
      },
      {
        type: 'group',
        label: 'حساب کاربری',
        children: [
          { label: 'کیف پول', key: '/account' }
        ]
      }
    ];

    const result = flattenMenuGroups(input as any);

    expect(result).toEqual([
      { label: 'بازار', key: '/marketplace' },
      { label: 'ثبت آگهی', key: '/listings/create' },
      { label: 'آگهی‌های من', key: '/listings/my' },
      { label: 'کیف پول', key: '/account' }
    ]);
  });

  it('does not mutate the input array or its nested groups', () => {
    const input = [
      { label: 'Item 1', key: '1' },
      {
        type: 'group',
        label: 'Group A',
        children: [{ label: 'Item 2', key: '2' }]
      }
    ];

    const frozenInput = Object.freeze([...input]);
    const result = flattenMenuGroups(frozenInput as any);

    expect(result).toHaveLength(2);
    expect(result[0].key).toBe('1');
    expect(result[1].key).toBe('2');
  });

  it('matches AppSidebar shape with standalone leaf plus multiple groups', () => {
    const appSidebarOptions = [
      { label: 'بازار معامله چک (مارکت‌پلیس)', key: '/marketplace' },
      {
        type: 'group',
        label: 'مدیریت چک و مطالبات',
        children: [
          { label: 'ثبت آگهی جدید چک', key: '/listings/create' },
          { label: 'آگهی‌های من', key: '/listings/my' },
          { label: 'تطابق‌ها و توافقات من', key: '/matches' }
        ]
      },
      {
        type: 'group',
        label: 'حساب کاربری و اطلاعات',
        children: [
          { label: 'پروفایل هویت', key: '/me' },
          { label: 'کیف پول و حساب بانکی', key: '/account' },
          { label: 'گزارش‌ها و تحلیل‌ها', key: '/reports' },
          { label: 'اعلامیه‌ها و پیام‌ها', key: '/notifications' }
        ]
      }
    ];

    const flattened = flattenMenuGroups(appSidebarOptions as any);

    expect(flattened).toHaveLength(8);
    expect(flattened.map(item => item.key)).toEqual([
      '/marketplace',
      '/listings/create',
      '/listings/my',
      '/matches',
      '/me',
      '/account',
      '/reports',
      '/notifications'
    ]);
    expect(flattened.every(item => !(item as any).type)).toBe(true);
  });
});
