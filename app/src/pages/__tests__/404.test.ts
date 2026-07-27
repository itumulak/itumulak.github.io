// @vitest-environment node
import reactRenderer from '@astrojs/react/server.js';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';

import NotFoundPage from '../404.astro';

async function createContainer() {
  const container = await AstroContainer.create();
  container.addServerRenderer({ name: '@astrojs/react', renderer: reactRenderer });
  return container;
}

describe('404 page', () => {
  it('renders a not found heading and explanatory message', async () => {
    const container = await createContainer();
    const html = await container.renderToString(NotFoundPage);

    expect(html).toContain('Post not found');
    expect(html).toContain("The page you're looking for doesn't exist, or may have moved.");
  });

  it('renders a link back to home with a correct, base aware href', async () => {
    const container = await createContainer();
    const html = await container.renderToString(NotFoundPage);

    expect(html).toMatch(/<a href="\/"[^>]*>\s*Back to home\s*<\/a>/);
  });

  it('sets a per page title and description instead of a generic one', async () => {
    const container = await createContainer();
    const html = await container.renderToString(NotFoundPage);

    expect(html).toContain('<title>Post not found — Ian Tumulak</title>');
    expect(html).toContain('content="The page you\'re looking for doesn\'t exist."');
  });
});
