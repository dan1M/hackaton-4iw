
import { Inter } from 'next/font/google'
import Sidebar from '@/component/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <Sidebar />
    </main>
  )
}
