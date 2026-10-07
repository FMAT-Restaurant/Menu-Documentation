const os = require('node:os');
const path = require('node:path');

const siteUrl = 'https://fmat-restaurant.github.io';
const baseUrl = '/Menu-Documentation/';
const stagingRoot = path.join(os.tmpdir(), 'fmat-menu-documentation-site');
const repositoryUrl = 'https://github.com/FMAT-Restaurant/Menu-Documentation';

module.exports = {
  title: 'Restaurant Platform',
  url: siteUrl,
  baseUrl,
  trailingSlash: true,
  organizationName: 'FMAT-Restaurant',
  projectName: 'Menu-Documentation',
  onBrokenLinks: 'throw',
  // Canonical ERS links are checked as errors during preparation;
  // keep historic reference-document links visible as warnings.
  onBrokenMarkdownLinks: 'warn',
  onBrokenAnchors: 'throw',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      {
        docs: {
          path: path.join(stagingRoot, 'docs'),
          routeBasePath: '/',
          sidebarPath: path.resolve('./sidebars.js'),
        },
        blog: false,
      },
    ],
  ],
  plugins: [
    function disableOptionalMermaidElk() {
      return {
        name: 'disable-optional-mermaid-elk',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                '@mermaid-js/layout-elk$': false,
              },
            },
          };
        },
      };
    },
    [
      '@scalar/docusaurus',
      {
        label: 'API Reference',
        route: '/api/',
        showNavLink: false,
        configuration: {
          url: `${baseUrl}api/openapi.yaml`,
          hideTestRequestButton: true,
        },
      },
    ],
  ],
  staticDirectories: [path.join(stagingRoot, 'static')],
  themeConfig: {
    colorMode: {
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: {
        light: 'neutral',
        dark: 'dark',
      },
      options: {
        layout: 'dagre',
      },
    },
    navbar: {
      title: 'Restaurant Platform',
      // Docusaurus prefixes these internal routes with baseUrl.
      items: [
        {
          to: '/specification/',
          label: 'Documentation',
          position: 'left',
        },
        {
          to: '/api/',
          label: 'API Reference',
          position: 'left',
        },
        {
          to: '/events/',
          label: 'Events',
          position: 'left',
        },
        {
          href: repositoryUrl,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
};
