import type { MenuOption, MenuGroupOption } from 'naive-ui';

/**
 * Pure helper to flatten Naive UI menu options when rendered in collapsed icon rail mode.
 * Walks the options array and splices group children directly into the top-level list,
 * eliminating group headings and preventing text wrapping in compact rails.
 * 
 * Does NOT mutate the input array.
 */
export function flattenMenuGroups(options: (MenuOption | MenuGroupOption)[] = []): MenuOption[] {
  const result: MenuOption[] = [];

  for (const item of options) {
    if ((item as any).type === 'group' && Array.isArray((item as any).children)) {
      result.push(...flattenMenuGroups((item as any).children));
    } else {
      result.push(item as MenuOption);
    }
  }

  return result;
}
