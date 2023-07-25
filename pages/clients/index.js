import Button from '@/components/Button';
import Card from '@/components/Card';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import CustomModal from '@/components/CustomModal';
import Sidebar from '@/components/Sidebar';

const Clients = () => {
  const { supabaseClient } = useSessionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
  });

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '8px',
      padding: '20px',
      border: 'none',
      maxWidth: '400px',
      backgroundColor: '#282B2A',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 1000,
    },
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data } = await supabaseClient.from('clients').select('*');
    setClients(data);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { error } = await supabaseClient
      .from('clients')
      .insert({ name: formData.name });
    handleCloseModal();
    fetchClients();
  };

  return (
    <main className='p-4'>
      <Button text='Ajouter un client' onClick={handleOpenModal} />

      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        styles={customStyles}
      >
        <div className='relative w-full max-w-md max-h-full'>
          <div className='relative'>
            <button
              type='button'
              className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={handleCloseModal}
            >
              <svg
                className='w-3 h-3'
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
                Ajouter un client
              </h3>
              <form className='space-y-6' onSubmit={handleCreateUser}>
                {
                  <div>
                    <label
                      htmlFor='name'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      className='bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white'
                      placeholder='Name'
                      onChange={handleChange}
                      required
                    />
                  </div>
                }

                <Button text='Ajouter un client' type='submit' />
              </form>
            </div>
          </div>
        </div>
      </CustomModal>
      <div className='flex flex-wrap'>
        {clients?.map((client) => {
          return (
            <Card
              key={client.id}
              id={client.id}
              title={client.name}
              imageUrl={'next.svg'}
              triggerFetch={(id) => {
                if (id) {
                  setClients(clients.filter((client) => client.id !== id));
                } else {
                  fetchClients();
                }
              }}
              type='client'
            />
          );
        })}
      </div>
    </main>
  );
};

export default Clients;
