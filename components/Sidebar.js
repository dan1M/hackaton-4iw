import Image from 'next/image';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <>
      <nav
        className='sm:w-1/5 w-1/5 bg-white shadow-md sidebar'
        style={{
          height: '790px',
          width: '15%',
          boxShadow: '10px 5px 5px black',
          borderRadius: '5px',
        }}
      >
        <div className='sticky top-0 space-y-8 bg-white'>
          <div className='h-20 flex items-center border-b'>
            <Image alt='logo' src='/logo.png' width={270} height={270} />
          </div>
        </div>
        <div>
          <ul className='flex flex-col space-y-2'>
            <li className='flex items-center space-x-2 li-side'>
              <Image
                alt='logo'
                src='/pictos/people-white.png'
                width={20}
                height={20}
                className='mx-4'
              />
              <Link href='/social'>Social</Link>
            </li>
            <li className='flex items-center space-x-2 li-side'>
              <Image
                alt='logo'
                src='/pictos/client.png'
                width={20}
                height={20}
                className='mx-4'
              />
              <Link href='/clients'>Clients</Link>
            </li>
            <li className='flex items-center space-x-2 li-side'>
              <Image
                alt='logo'
                src='/pictos/formation.png'
                width={20}
                height={20}
                className='mx-4'
              />

              <Link href='/formations'>Formations</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
