
import Countdown from './Countdown'
import Input from '@/components/Input';
import './home.css';

const Home = () => {
  return <div className='home'><h1>Secret Santa</h1>
  <Input name='workshop-phrase' type='text' fullWidth label='Workshop Phrase' />
  <Countdown /></div>
}

export default Home
