/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fr', 'ar', 'sw', 'ha'],
    defaultLocale: 'en'
  }
};

module.exports = nextConfig;
