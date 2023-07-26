import Sidebar from '@/components/Sidebar';
import '@/styles/globals.css';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      {router.pathname !== '/login' && (
        <div className='flex'>
          <Sidebar />
          <Component {...pageProps} />
        </div>
      )}
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
