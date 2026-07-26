// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';

import TagChip from './TagChip.astro';

describe('TagChip', () => {
  it('renders the tag name as visible text', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TagChip, { props: { name: 'meta' } });

    expect(html).toContain('meta');
  });

  it('renders as a non interactive span, not a link or button', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TagChip, { props: { name: 'meta' } });

    expect(html).toMatch(/<span[^>]*>meta<\/span>/);
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('<button');
  });

  it('escapes a tag name containing markup instead of injecting it raw', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TagChip, {
      props: { name: '<script>alert(1)</script>' },
    });

    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
