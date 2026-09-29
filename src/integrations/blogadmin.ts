import type { AstroIntegration } from 'astro';

/**
 * Local-only blog editor. Routes are injected ONLY for `astro dev`, so the
 * production build contains no /blogadmin page, endpoints or JS.
 */
export default function blogadmin(): AstroIntegration {
  return {
    name: 'blogadmin',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return;
        injectRoute({ pattern: '/blogadmin', entrypoint: './src/blogadmin/BlogAdmin.astro' });
        for (const name of ['posts', 'post', 'preview', 'image', 'publish']) {
          injectRoute({
            pattern: `/blogadmin/api/${name}`,
            entrypoint: `./src/blogadmin/api/${name}.ts`,
          });
        }
      },
    },
  };
}
