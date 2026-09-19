import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={scrolled ? 'nav-scrolled' : ''}>
      <div className="wrap">
        <div className="logo">विधि<span>.</span></div>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#modules">Modules</a>
          <a href="#features">Features</a>
        </div>
        <a className="nav-cta" href="#upload">Upload a notice</a>
      </div>
    </nav>
  )
}
