// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '🌩️ 먹구름',
  tagline: '지식 창고',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://rieul.tech',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jwonylee', // Usually your GitHub org/user name.
  projectName: 'rieul.tech', // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'knowledge',
          routeBasePath: '/', // 사이트 루트에서 문서 제공
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/jwonylee/rieul.tech/tree/main/',
          showLastUpdateTime: true,
        },
        blog: {
          path: 'thought',
          routeBasePath: '/thought',
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/jwonylee/rieul.tech/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'daily',
        path: 'daily',
        routeBasePath: 'daily',
        editUrl: 'https://github.com/jwonylee/rieul.tech/tree/main/',
        sidebarPath: require.resolve('./daily-sidebars.js'),
        showLastUpdateTime: true,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '🌩️ 먹구름',
        logo: {
          alt: '🌩️ 먹구름 Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/daily/33f65ee5-60a0-24b4-91cf-218567520559',
            label: 'daily',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'knowledge',
          },
          {to: '/thought', label: 'thought', position: 'left'},
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} rieul.tech Built with Docusaurus.`,
      },
      prism: {
        additionalLanguages: ['swift'],
      },
    }),
};

async function createConfig() {
  const lightTheme = (await import('./src/utils/prismLight.mjs')).default;
  const darkTheme = (await import('./src/utils/prismDark.mjs')).default;
  // @ts-ignore
  config.themeConfig.prism.theme = lightTheme;
  // @ts-expect-error: we know it exists, right
  config.themeConfig.prism.darkTheme = darkTheme;
  return config;
}

module.exports = createConfig;