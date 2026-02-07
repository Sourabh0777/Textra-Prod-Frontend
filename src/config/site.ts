export const siteConfig = {
  name: 'Textra',
  description: 'Whatsapp remminder Solution',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://textra.in',
  ogImage: 'https://textra.in/og.jpg',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Privacy',
      href: '/privacy',
    },
    {
      title: 'Terms',
      href: '/terms',
    },
  ],
};

export type SiteConfig = typeof siteConfig;
