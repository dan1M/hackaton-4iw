import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import Button from '@/components/Button';
import ProfileInfos from '@/components/profile/ProfileInfos';
import ProfileSkills from '@/components/profile/ProfileSkills';
import ProfileHistory from '@/components/profile/ProfileHistory';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const { supabaseClient } = useSessionContext();
  const [profile, setProfile] = useState(null);
  const [activePage, setActivePage] = useState('infos');

  const fetchProfile = async () => {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select()
      .eq('id', id)
      .single();

    if (data) {
      console.log(data);
      setProfile(data);
    }
  };

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  return (
    <main className='w-full text-white'>
      <div className='w-full h-28 bg-opacity-10 bg-slate-300 flex relative '>
        <div className='flex items-center absolute -bottom-2/3 left-1/2 -translate-x-1/2 z-10'>
          <Image
            className='w-24 h-24 rounded-full shadow-lg bg-white'
            src={'/next.svg'}
            alt='Bonnie image'
            width={20}
            height={20}
          />
          <div className='ml-4'>
            <h2 className='text-white text-3xl font-semibold '>
              {profile?.full_name}
            </h2>
            <p className='text-sm text-slate-400 mt-1'>{profile?.job_title}</p>
          </div>
        </div>
      </div>
      <div className='w-full max-w-xl h-1/3 flex-col mx-auto mt-24 justify-center'>
        <ul className='flex justify-center text-sm font-medium text-center text-gray-500 dark:text-white'>
          <li className='mr-2'>
            <Button
              type={activePage === 'infos' ? 'active' : 'unstyled'}
              onClick={() => setActivePage('infos')}
              text='Infos'
            />
          </li>
          <li className='mr-2'>
            <Button
              type={activePage === 'skill' ? 'active' : 'unstyled'}
              onClick={() => setActivePage('skill')}
              text='Compétences'
            />
          </li>
          <li className='mr-2'>
            <Button
              onClick={() => setActivePage('quest')}
              type={activePage === 'quest' ? 'active' : 'unstyled'}
              text='Quêtes accomplies'
            />
          </li>
        </ul>

        {activePage === 'infos' && <ProfileInfos profile={profile} />}
        {activePage === 'skill' && <ProfileSkills profile={profile} />}
        {activePage === 'quest' && <ProfileHistory profile={profile} />}
      </div>
    </main>
  );
}
