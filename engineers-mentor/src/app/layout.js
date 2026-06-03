import { Space_Grotesk, Poppins } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://engineersmentor.com'),
  title: "Engineer's Mentor — Building Final Year Projects That Stand Out",
  description:
    "Premium final year engineering project services across 13+ domains including AI, IoT, Web Development, Cybersecurity, and more. Expert guidance, full documentation, source code, and end-to-end support.",
  keywords: [
    'final year project',
    'engineering project',
    'AI project',
    'IoT project',
    'web development project',
    'mobile app project',
    'cybersecurity project',
    'college project',
    'project help',
    'engineering mentor',
    'embedded systems projects',
    'machine learning projects',
    'final year computer science projects',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Engineer's Mentor — Building Final Year Projects That Stand Out",
    description:
      'Premium final year engineering project services. From AI to Robotics, we deliver projects that impress.',
    url: 'https://engineersmentor.com',
    siteName: "Engineer's Mentor",
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/logo-seo-og.png', // Fallback or placeholder, we will ensure it is clean
        width: 1200,
        height: 630,
        alt: "Engineer's Mentor — Building Final Year Projects That Stand Out",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Engineer's Mentor — Final Year Engineering Projects",
    description: 'Premium engineering project services with source code, documentation, and live support.',
    images: ['/logo-seo-og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  // Structured Data Schema for Search Engines
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://engineersmentor.com/#service',
    'name': "Engineer's Mentor",
    'url': 'https://engineersmentor.com',
    'logo': 'https://engineersmentor.com/logo-seo-og.png',
    'image': 'https://engineersmentor.com/logo-seo-og.png',
    'description': 'Premium final year engineering project services across 13+ domains including AI, IoT, Web Development, Cybersecurity, and more. Expert guidance, full documentation, source code, and end-to-end support.',
    'telephone': '',
    'email': 'engineersmentorservices@gmail.com',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'IN',
    },
    'priceRange': '$$',
    'offers': {
      '@type': 'Offer',
      'description': 'Final Year Engineering Projects & Academic Guidance',
    },
    'provider': {
      '@type': 'Organization',
      'name': "Engineer's Mentor",
      'email': 'engineersmentorservices@gmail.com',
    }
  };

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${poppins.variable}`}>
      <body
        className="antialiased"
        style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        {children}
      </body>
    </html>
  );
}

