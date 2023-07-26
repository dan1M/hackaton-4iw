import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHome } from 'react-icons/ai';


const Sidebar = () => {
  return (
    <>
      <nav
        className='sm:w-1/5 w-1/5 bg-white shadow-md sidebar'
        style={{
          height: '790px',
          width: '15%',
          boxShadow: '10px 5px 5px black',
          position: 'fixed',
          borderRadius: '5px',
        }}
      >
        <div className='sticky top-0 space-y-8 bg-white'>
          <div className='h-20 flex items-center px-4 border-b'>
            <Image
              alt='logo'
              src='next.svg'
              width={140}
              height={140}
              className='mx-auto'
            />
          </div>
        </div>
        <div>
          <ul className='flex flex-col space-y-2'>
            <li className='flex items-center space-x-2 li-side'>
              <Image
                alt='logo'
                src='/pictos/people.png'
                width={20}
                height={20}
                className='mr-4 bg-white icon-sidebar'
              />
              <Link href='/'>Social</Link>
            </li>
            <li className='flex items-center space-x-2 li-side'>
              <AiOutlineHome className='icon-sidebar' />
              <Link href='/clients'>Clients</Link>
            </li>
            <li className='flex items-center space-x-2 li-side'>
              <AiOutlineHome className='icon-sidebar' />
              <Link href='/projects'>Projects</Link>
            </li>
            <li className='flex items-center space-x-2 li-side'>
              <AiOutlineHome className='icon-sidebar' />
              <Link href='/users'>Users</Link>
            </li>
            <li className='flex items-center space-x-2 li-side'>
              <AiOutlineHome className='icon-sidebar' />
              <Link href='/events'>Settings</Link>
            </li>

          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
