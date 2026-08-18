/**
 * Masks display names for issuer privacy on public landing pages.
 * - Empty / falsy / whitespace: returns ''
 * - Single word: returns the word as-is
 * - Company names starting with 'شرکت':
 *     - 'شرکت' -> 'شرکت'
 *     - 'شرکت پارس' -> 'شرکت پارس'
 *     - 'شرکت پارس گستر' -> 'شرکت پارس …'
 * - Other multi-word names:
 *     - 'علی محمدی' -> 'علی …'
 *     - 'محمد رضا احمدی' -> 'محمد …'
 */
export function maskDisplayName(name?: string | null): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (!trimmed) return '';

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0];

  if (words[0] === 'شرکت') {
    if (words.length === 2) return `${words[0]} ${words[1]}`;
    return `${words[0]} ${words[1]} …`;
  }

  return `${words[0]} …`;
}
