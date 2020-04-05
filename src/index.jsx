import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import PDF from './assets/resume.pdf'
import './styles.css'

const cards = [
  {
    'color': '#4E008E',
    'title': 'RESUME',
    'resume': 'View',
  },
  {
    'color': '#151F6D',
    'title': 'CONTACT',
    'phone': '+1 (647) 922-1388',
    'email': 'oscar@oscarkwan.ca',
  },
  {
    'color': '#97999B',
    'title': 'GITHUB',
    'link': 'https://github.com/oscar-kwan',
  },
  {    
    'color': '#0072CE',
    'title': 'LINKEDIN',
    'link': 'https://linkedin.com/in/okwan',
  },
  {    
    'color': '#FFBF3F',
    'title': 'LOCATION',
    'sub_header': 'Toronto, Ontario, Canada'
  },
  {    
    'color': '#CB2C30',
    'title': 'OSCAR KWAN',
    'sub_header': 'Front-End Engineer'
  }
]

const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })

const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
  const [gone] = useState(() => new Set())
  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) }))

  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 
    const dir = xDir < 0 ? -1 : 1 
    if (!down && trigger) gone.add(index) 
    set(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)
      const scale = down ? 1.1 : 1
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })

  return (
    <React.Fragment>
    {props.map(({ x, y, rot, scale }, i) => (
    <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
      <animated.div {...bind(i)} style={{ transform: interpolate([rot, scale], trans)}}>
        <div className="informationWrapper">
          <div className='colorBlock' style={{ backgroundColor: `${cards[i].color}`}}>{cards[i].color}</div>
          <div className='information'>
            <h2>{cards[i].title}</h2>
            {
              cards[i].sub_header && <p>{cards[i].sub_header}</p>
            }
            {
              cards[i].link && <a href={`${cards[i].link}`}>{cards[i].link}</a>
            }
            {
              cards[i].phone && <p>Phone: <a href={`tel:${cards[i].phone}`}>{cards[i].phone}</a></p>
            }
            {
              cards[i].email && <p>Email: <a href={`mailto:${cards[i].email}`}>{cards[i].email}</a></p>
            }
            {
              cards[i].resume && <p>View <a href={PDF}>Resume</a></p>
            }
          </div>
        </div>
      </animated.div>
    </animated.div>
  ))}
  </React.Fragment>
  )
}

render(<Deck />, document.getElementById('root'))
