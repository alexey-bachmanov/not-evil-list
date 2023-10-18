// imports
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import store from '@/store/store';
import { Provider } from 'react-redux';

// Material UI imports
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/system';

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
      <CssBaseline />
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
