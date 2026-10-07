function StatsGrid({ total, todo, active, completed, selectedFilter, onFilter }) {
  const cards = [
    ['All tasks', total, 'in your workspace', 'accent'],
    ['To Do', todo, 'ready to begin', 'todo'],
    ['In Progress', active, 'keep the momentum', 'progress'],
    ['Completed', completed, 'nice work so far', 'done'],
  ]

  return (
    <section className="stats-grid" aria-label="Task summary">
      {cards.map(([label, count, hint, tone]) => (
        <button
          className={`stat-card ${tone} ${selectedFilter === label ? 'selected' : ''}`}
          key={label}
          onClick={() => onFilter(label)}
          type="button"
        >
          <span className="stat-label">{label}</span>
          <strong>{count}</strong>
          <span className="stat-hint">{hint}</span>
        </button>
      ))}
    </section>
  )
}

export default StatsGrid
