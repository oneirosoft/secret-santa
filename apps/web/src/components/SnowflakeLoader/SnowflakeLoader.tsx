import './snowflake-loader.css'

interface SnowflakeLoaderProps {
  size?: 'xs' | 'small' | 'medium' | 'large'
  message?: string
}

const SnowflakeLoader = ({ size = 'medium', message }: SnowflakeLoaderProps) => {
  return (
    <div className={`snowflake-loader snowflake-loader-${size}`}>
      <div className="snowflake">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g className="snowflake-group">
            {/* Main vertical line */}
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            {/* Diagonal lines */}
            <line x1="20" y1="25" x2="80" y2="75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="25" x2="20" y2="75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            {/* Horizontal line */}
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            {/* Top branches */}
            <line x1="50" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="10" x2="60" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Bottom branches */}
            <line x1="50" y1="90" x2="40" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="90" x2="60" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Left branches */}
            <line x1="10" y1="50" x2="20" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="50" x2="20" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Right branches */}
            <line x1="90" y1="50" x2="80" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="90" y1="50" x2="80" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Top-left diagonal branches */}
            <line x1="20" y1="25" x2="15" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="25" x2="25" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Top-right diagonal branches */}
            <line x1="80" y1="25" x2="75" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="80" y1="25" x2="85" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Bottom-left diagonal branches */}
            <line x1="20" y1="75" x2="15" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="75" x2="25" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Bottom-right diagonal branches */}
            <line x1="80" y1="75" x2="75" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="80" y1="75" x2="85" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            
            {/* Center circle */}
            <circle cx="50" cy="50" r="6" fill="currentColor" />
          </g>
        </svg>
      </div>
      {message && <div className="snowflake-loader-message">{message}</div>}
    </div>
  )
}

export default SnowflakeLoader
