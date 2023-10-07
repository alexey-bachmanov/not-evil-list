// imports
import '../styles/globals.css';
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

// setup theme
const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
    success: {
      dark: '#009688',
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <body className={roboto.className}>
          <main>
            <CssBaseline />
            {children}
          </main>
        </body>
      </html>
    </ThemeProvider>
  );
}
