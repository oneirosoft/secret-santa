
import { useNavigate } from 'react-router'
import Countdown from './Countdown'
import Button from '@/components/Button'
import './home.css';
import PhraseInput from './PhraseInput';

const Home = () => {
  const navigate = useNavigate()

  return <div className='home'><h1>Secret Santa</h1>
  <PhraseInput />
  <Button variant='secondary' onClick={() => navigate('/create')}>Create Workshop</Button>
  <Countdown /></div>
}

export default Home
