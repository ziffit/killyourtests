import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const test = base.extend<{ specAttachment: void }>({
  specAttachment: [async ({}, use, testInfo) => {
    const specFile = testInfo.file
      .replace(path.sep + 'tests' + path.sep, path.sep + 'specs' + path.sep)
      .replace('.spec.ts', '.spec.md');
    try {
      const content = fs.readFileSync(specFile, 'utf-8');
      testInfo.attachments.push({
        name: 'Specification',
        contentType: 'text/markdown',
        body: Buffer.from(content),
      });
    } catch (e) {
      console.error(`[specAttachment] FAIL: ${specFile}, ${(e as Error).message}`);
    }
    await use();
  }, { auto: true }],
});
export { expect };
