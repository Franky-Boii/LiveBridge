import '../styles/globals.css';
import { useEffect } from 'react';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW failed', err));
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>LiveBridge | AI Communication Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}