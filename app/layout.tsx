'use client';
// imports
import 'leaflet/dist/leaflet.css';
import { Roboto } from 'next/font/google';
import Providers from '@/store/providers';
import AlertBar from '@/components/AlertBar';
import HamburgerMenu from '@/components/HamburgerMenu';
import LoginDialog from '@/components/LoginDialog';

// MUI imports
import Box from '@mui/material/Box';

// import Roboto font using Next.js
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Not-Evil-List</title>
        <meta
          name="description"
          content="A directory of Philadelphia's lawful-good businesses"
        />
      </head>
      <body className={roboto.className}>
        <Providers>
          <Box component="main" sx={{ width: '100vw', height: '100vh' }}>
            {children}
            <LoginDialog />
            <AlertBar />
            <HamburgerMenu />
          </Box>
        </Providers>
      </body>
    </html>
  );
}
