import QuestLog from '@/components/QuestLog';
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
  const [userQuests, setUserQuests] = useState([]);

  useEffect(() => {
    const user = sessionStorage.getItem('user');

    // listener for user update
    supabaseClient
      .channel('profiles')
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

  useEffect(() => {
    if (currentUser) {
      // listener for userQuests update
      supabaseClient
        .channel('profilesquests')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profilesquests',
          },
          (payload) => {
            // update a quest of currentUser from userQuests
            const updatedUserQuests = userQuests.map((quest) => {
              if (quest.id === payload.new.id) {
                return { ...quest, ...payload.new };
              }
              return quest;
            });
            setUserQuests(updatedUserQuests);
          }
        )
        .subscribe();
    }
  }, [currentUser, userQuests]);

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
  };

  const updateUserQuests = (quests) => {
    setUserQuests(quests);
  };

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <AppContext.Provider
        value={{ currentUser, updateCurrentUser, userQuests, updateUserQuests }}
      >
        {router.pathname !== '/login' ? (
          <div className='flex relative'>
            <Sidebar />
            <Component {...pageProps} />
            {router.pathname.startsWith('/social') && (
              <>
                <QuestLog />
                <RpgZone />
              </>
            )}
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </AppContext.Provider>
    </SessionContextProvider>
  );
}
