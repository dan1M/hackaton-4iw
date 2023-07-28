import RpgZone from '@/components/RpgZone';
import Sidebar from '@/components/Sidebar';
import '@/styles/globals.css';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';

export const AppContext = createContext(null);

export default function App({ Component, pageProps }) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem('user');

    supabaseClient
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          const dataUser = JSON.stringify(payload.new);
          sessionStorage.setItem('user', dataUser);
          setCurrentUser(payload.new);
        }
      )
      .subscribe();

    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <AppContext.Provider value={{ currentUser, updateCurrentUser }}>
        {router.pathname !== '/login' ? (
          <div className='flex'>
            <Sidebar />
            <Component {...pageProps} />
            {router.pathname.startsWith('/social') && <RpgZone />}
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </AppContext.Provider>
    </SessionContextProvider>
  );
}
