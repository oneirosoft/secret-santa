import { useNavigate, useLocation } from 'react-router'
import './header.css'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className='app-header'>
      {!isHome && (
        <button className='home-link' onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      )}
    </header>
  )
}

export default Header
