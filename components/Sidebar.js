import Image from 'next/image';
import Link from 'next/link';

const Sidebar = () => {

  const styles = {
    sidebar: {
     paddingTop: '2%',
    },
    navbar: {
    border: '1px solid #8d8a8a',
     borderRadius: '8px',
     boxShadow: 'black 0px 0px 40px 0px',
     marginLeft: '2%',
     marginTop: '2%',
     height: '100vh',
     position: 'sticky',
    },
    logo: {
     textAllign: 'center',
     border:' 1px solid #8d8a8a',
     width: '90%',
     marginLeft: 'auto',
     marginRight: 'auto',
    }
  }
  return (
    <nav
     style={styles.sidebar}
    >
      <div style={styles.navbar}>
      <div className='space-y-8 logo' style={styles.logo}>
        <div className='h-20 flex items-center'>
          <Image alt='logo' src='/logo.png' width={270} height={270} />
        </div>
      </div>
        <ul className='flex flex-col space-y-2'>
          <li className='flex items-center space-x-2 li-side'>
            <Image
              alt='logo'
              src='/pictos/people-white.png'
              width={20}
              height={20}
              className='mx-4'
            />
            <Link href='/users'>Social</Link>
          </li>
          <li className='flex items-center space-x-2 li-side'>
            <Image
              alt='logo'
              src='/pictos/people-white.png'
              width={20}
              height={20}
              className='mx-4'
            />
            <Link href='/chat'>chat</Link>
          </li>
          <li className='flex items-center space-x-2 li-side'>
            <Image
              alt='logo'
              src='/pictos/people-white.png'
              width={20}
              height={20}
              className='mx-4'
            />
            <Link href='/quests'>Quêtes</Link>
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
  );
};

export default Sidebar;
