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
  ],
  openGraph: {
    title: "Engineer's Mentor — Building Final Year Projects That Stand Out",
    description:
      'Premium final year engineering project services. From AI to Robotics, we deliver projects that impress.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Engineer's Mentor",
    description: 'Building Final Year Projects That Stand Out',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${poppins.variable}`}>
      <body
        className="antialiased"
        style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
