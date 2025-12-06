import { useEffect, useState } from 'react'
import { intervalToDuration, setYear, getYear, isPast } from 'date-fns'
import './countdown.css'

const Countdown = () => {
  const [days, setDays] = useState(0)
  const [time, setTime] = useState('')

  useEffect(() => {
    const getChristmas = () => {
      const now = new Date()
      let christmas = new Date(getYear(now), 11, 25)
      if (isPast(christmas)) christmas = setYear(christmas, getYear(now) + 1)
      return christmas
    }


    const updateTimer = () => {
      const duration = intervalToDuration({ start: new Date(), end: getChristmas() })
      const d = duration.days ?? 0
      const h = duration.hours ?? 0
      const m = duration.minutes ?? 0
      const s = duration.seconds ?? 0
      setDays(d)
      setTime(`${h}h ${m}m ${s}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  return <div className='countdown'>
    <span className='corner-snowflake top-left'>❅</span>
    <span className='corner-snowflake top-right'>❆</span>
    <span className='corner-snowflake bottom-left'>❆</span>
    <span className='corner-snowflake bottom-right'>❅</span>
    <h2>Countdown</h2>
    <div className='timer-days'>{days} {days === 1 ? 'day' : 'days'}</div>
    <div className='timer'>{time}</div>
  </div>
}

export default Countdown
