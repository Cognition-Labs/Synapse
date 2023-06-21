import { Link } from 'react-router-dom'
import styles from './Navigation.module.scss'

export function Navigation() {
  return (
    <nav>
      <ul className="flex items-center justify-start p-0 space-x-4 list-none">
        <li>
          <Link
            to="/auto-focus"
            className="px-4 py-2 text-gray-500 no-underline bg-transparent rounded-full hover:bg-gray-200 focus:bg-gray-200 hover:text-black focus:text-black focus:outline-none"
          >
            <span className="font-medium">Write</span>
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className="px-4 py-2 text-gray-500 no-underline bg-transparent rounded-full hover:bg-gray-200 focus:bg-gray-200 hover:text-black focus:text-black focus:outline-none"
          >
            <span className="font-medium">Edit</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
