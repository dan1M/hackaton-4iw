import { AppContext } from '@/pages/_app';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useContext, useEffect, useState } from 'react';

export default function ProfileSkills({ profile }) {
  const { currentUser } = useContext(AppContext);
  const { supabaseClient } = useSessionContext();
  const [profileSkills, setProfileSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (profile) fetchProfileSkills();
  }, [profile]);

  const fetchProfileSkills = async () => {
    const { data, error } = await supabaseClient
      .from('profiles_skills')
      .select('skill_id(id,name), status')
      .eq('profile_id', profile.id);

    if (data) {
      setProfileSkills(data);
    }
  };

  const createProfileSkill = async () => {
    if (newSkillName.length < 3) return;
    // Check if skill already exists
    const { data: skillData, error: skillError } = await supabaseClient
      .from('competences')
      .select()
      .ilike('name', newSkillName);

    if (
      skillData.length > 0 &&
      !profileSkills.map((skill) => skill.skill_id.id).includes(skillData[0].id)
    ) {
      const { data, error } = await supabaseClient
        .from('profiles_skills')
        .insert([
          {
            profile_id: profile.id,
            skill_id: skillData[0].id,
            status: 'pending',
          },
        ])
        .select();

      if (data) {
        fetchProfileSkills();
        setIsAdding(!isAdding);
        setNewSkillName('');
      }
    } else {
      // Create new skill
      const { data, error } = await supabaseClient
        .from('competences')
        .insert([{ name: newSkillName }])
        .select();

      if (data) {
        const { data: profileSkillData, error: profileSkillError } =
          await supabaseClient
            .from('profiles_skills')
            .insert([
              {
                profile_id: profile.id,
                skill_id: data[0].id,
                status: 'pending',
              },
            ])
            .select();
        if (profileSkillData) {
          fetchProfileSkills();
          setIsAdding(!isAdding);
          setNewSkillName('');
        }
      }
    }
  };
  const validateProfileSkill = async (skillId) => {
    const { data, error } = await supabaseClient
      .from('profiles_skills')
      .update({ status: 'valid' })
      .eq('skill_id', skillId)
      .select();

    if (data) {
      fetchProfileSkills();
    }
  };

  const deleteProfileSkill = async (skillId) => {
    const { data, error } = await supabaseClient
      .from('profiles_skills')
      .delete()
      .eq('skill_id', skillId)
      .select();

    if (data) {
      fetchProfileSkills();
    }
  };
  return (
    <section>
      <div className='py-8'>
        <h1 className='text-2xl font-bold tracking-wide text-center mt-4'>
          Compétences
        </h1>
        <div className='flex  py-4 flex-wrap'>
          {profileSkills.map((skill) => {
            return (
              <div
                key={skill.skill_id.id}
                className={
                  'text-sm inline-flex items-center font-bold leading-sm uppercase px-3 py-1 m-1.5 rounded-full ' +
                  (skill.status === 'valid'
                    ? 'bg-blue-200 text-blue-700'
                    : 'bg-orange-200 text-orange-700')
                }
              >
                {skill.skill_id.name}

                {currentUser &&
                  (currentUser.role === 'rh' || currentUser.role === 'mgr') && (
                    <>
                      {skill.status !== 'valid' && (
                        <button
                          className={
                            'text-sm inline-flex items-center font-bold leading-sm uppercase px-1 ml-2 rounded-full hover:bg-orange-400'
                          }
                          onClick={() =>
                            validateProfileSkill(skill.skill_id.id)
                          }
                        >
                          {'✔'}
                        </button>
                      )}
                      <button
                        className={
                          'text-sm inline-flex items-center font-bold leading-sm uppercase px-1 ml-2 rounded-full hover:bg-orange-400'
                        }
                        onClick={() => deleteProfileSkill(skill.skill_id.id)}
                      >
                        {'❌'}
                      </button>
                    </>
                  )}
              </div>
            );
          })}
          {isAdding && (
            <div className='flex items-center'>
              <input
                type='text'
                name='newSkillName'
                id='newSkillName'
                className='text-sm font-semibold bg-transparent border-b outline-none'
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                required
              />
              <button
                className={
                  'text-sm inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-white text-gray-700 rounded-full '
                }
                onClick={createProfileSkill}
              >
                {'✔'}
              </button>
            </div>
          )}
          {profile && currentUser && profile.id === currentUser.id && (
            <button
              className={
                'text-sm inline-flex items-center font-bold leading-sm uppercase px-3 py-1  m-1.5  bg-white text-gray-700 rounded-full '
              }
              onClick={() => {
                setIsAdding(!isAdding);
                setNewSkillName('');
              }}
            >
              {!isAdding ? '➕' : '❌'}
            </button>
          )}
        </div>
      </div>
      <div className='py-8'>
        <h1 className='text-2xl font-bold tracking-wide text-center mt-4'>
          Formations
        </h1>
      </div>
    </section>
  );
}
