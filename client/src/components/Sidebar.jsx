import Icon from './Icon'

function Sidebar({ completed, total }) {
  const progress = total ? (completed / total) * 100 : 0
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12
    ? 'Good morning'
    : hour < 17
      ? 'Good afternoon'
      : 'Good evening'
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now)

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark"><Icon name="check" size={19} /></span>
        <span>taskflow</span>
      </div>
      <div className="sidebar-copy">
        <p className="eyebrow">{currentDate}</p>
        <h1>{greeting}, <em>let&apos;s get things done.</em></h1>
      </div>
      <nav className="side-nav" aria-label="Workspace navigation">
        <span className="nav-item active"><Icon name="inbox" /> My tasks</span>
      </nav>
      <div className="sidebar-footer">
        <div className="progress-label"><span>Weekly focus</span><strong>{completed}/{total || 0}</strong></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <p>Keep moving forward, one task at a time.</p>
      </div>
    </aside>
  )
}

export default Sidebar
