import Button from '@/components/Button';
import Card from '@/components/Card';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useState } from 'react';

const Users = () => {
  const [displayNewUser, setDisplayNewUser] = useState(false);

  const { supabaseClient } = useSessionContext();

  const handleCreateUser = async () => {
    console.log('create user');
    const { data, error } = await supabaseClient.auth.admin.createUser({
      email: 'example@email.com',
      password: 'example-password',
      email_confirm: true,
    });
    console.log(data, error);
  };

  return (
    <main>
      <Button
        text='+'
        onClick={() => {
          setDisplayNewUser(!displayNewUser);
        }}
      />

      {displayNewUser && (
        <div
          id='authentication-modal'
          tabIndex='-1'
          aria-hidden='true'
          className='fixed top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full'
        >
          <div className='relative w-full max-w-md max-h-full'>
            <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
              <button
                type='button'
                className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                onClick={() => setDisplayNewUser(!displayNewUser)}
              >
                <svg
                  className='w-3 h-3'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
              <div className='px-6 py-6 lg:px-8'>
                <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>
                  Ajouter un utilisateur
                </h3>
                <form className='space-y-6' onSubmit={handleCreateUser}>
                  <div>
                    <label
                      htmlFor='email'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      id='email'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      placeholder='name@company.com'
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='password'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Mot de passe
                    </label>
                    <input
                      type='password'
                      name='password'
                      id='password'
                      placeholder='••••••••'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='first_name'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Prénom
                    </label>
                    <input
                      name='first_name'
                      id='first_name'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      placeholder='John'
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='last_name'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Nom
                    </label>
                    <input
                      name='last_name'
                      id='last_name'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                      placeholder='Doe'
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='role'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Rôle
                    </label>
                    <select
                      value={'dev'}
                      id='role'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    >
                      <option value='com'>Commercial</option>
                      <option value='rh'>Ressource Humaines</option>
                      <option value='dev'>Consultant</option>
                      <option value='mgr'>Manager</option>
                    </select>
                  </div>

                  <button
                    type='submit'
                    className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                  >
                    Ajouter un utilisateur
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card />
    </main>
  );
};

export default Users;
