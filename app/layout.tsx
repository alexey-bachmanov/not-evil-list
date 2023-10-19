// imports
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

// Material UI imports

// import Roboto font using Next.js
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

// set up global metadata
export const metadata: Metadata = {
  title: 'Not-Evil-List',
  description: "A directory of Philadelphia's lawful-good businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
