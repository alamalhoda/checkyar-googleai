import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Offline Asset Guard Tests', () => {
  it('ensures index.html does not contain Google Fonts CDN links', () => {
    const indexPath = path.resolve(process.cwd(), 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');

    expect(indexContent).not.toContain('fonts.googleapis.com');
    expect(indexContent).not.toContain('fonts.gstatic.com');
    expect(indexContent).toContain('/fonts/vazirmatn/vazirmatn-v33-latin-arabic-400.woff2');
  });

  it('ensures source files in src/ do not use external image CDN placeholders', () => {
    const srcPath = path.resolve(process.cwd(), 'src');
    const bannedDomains = [
      'placehold.co',
      'via.placeholder.com',
      'images.unsplash.com',
    ];

    function checkDirectory(dir: string) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          checkDirectory(fullPath);
        } else if (/\.(vue|ts|js|html|css)$/.test(file) && !file.endsWith('.test.ts')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          for (const domain of bannedDomains) {
            expect(
              content.includes(domain),
              `File ${fullPath} contains banned external CDN domain: ${domain}`
            ).toBe(false);
          }
        }
      }
    }

    checkDirectory(srcPath);
  });
});
