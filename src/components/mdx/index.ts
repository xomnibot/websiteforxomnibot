import Callout from './Callout.astro';
import Figure from './Figure.astro';
import YouTube from './YouTube.astro';
import Kbd from './Kbd.astro';
import Steps from './Steps.astro';

/**
 * Global components available inside every .mdx file WITHOUT importing them.
 * Pass to the rendered `<Content />` component:
 *
 *   import { render } from 'astro:content';
 *   import { mdxComponents } from '@/components/mdx';
 *   const { Content } = await render(entry);
 *   ...
 *   <Content components={mdxComponents} />
 *
 * Plain .md files ignore this (no components, standard markdown only).
 */
export const mdxComponents = {
  Callout,
  Figure,
  YouTube,
  Kbd,
  Steps,
};

export { Callout, Figure, YouTube, Kbd, Steps };
