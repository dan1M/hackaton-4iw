import { AppContext } from '@/pages/_app';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useContext, useEffect, useState } from 'react';
import Card from './Card';

export default function QuestLog() {
  const { currentUser, userQuests, updateUserQuests } = useContext(AppContext);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (currentUser) fetchUserQuests();
  }, [currentUser]);

  const fetchUserQuests = async () => {
    const { data, error } = await supabaseClient
      .from('profilesquests')
      .select('*, quests(*)')
      .eq('profile_id', currentUser.id)
      .eq('isDone', false);

    if (data) {
      console.log(data);
      updateUserQuests(data);
    }
  };

  return (
    <div className='absolute bg-primary bg-opacity-30 h-full w-1/6 right-0  text-white px-4'>
      <h1 className='text-2xl font-bold tracking-wide text-center mt-4'>
        Quêtes en cours
      </h1>
      <h2 className='text-xl font-bold mt-2'>Journalière</h2>
      {userQuests.map((quest) => {
        return (
          quest.quests.frequency === 'journa' && (
            <Card key={quest.id} quest={quest} type='quests' />
          )
        );
      })}
      <h2 className='text-xl font-bold mt-2'>Hebdomadaire</h2>
      {userQuests.map((quest) => {
        return (
          quest.quests.frequency === 'hebdo' && (
            <Card key={quest.id} quest={quest} type='quests' />
          )
        );
      })}
    </div>
  );
}
