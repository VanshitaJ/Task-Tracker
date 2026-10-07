import { formatDate } from '../utils'

function TaskDetailsModal({ task, onClose }) {
  if (!task) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section className="details-modal" aria-labelledby="task-details-title" onClick={(event) => event.stopPropagation()} role="dialog">
        <button className="modal-close" type="button" aria-label="Close task details" onClick={onClose}>×</button>
        <p className="eyebrow">Task details</p>
        <h2 id="task-details-title">{task.title}</h2>
        <div className="details-badges">
          <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span>
          <span className={`status-pill ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
        </div>
        <div className="detail-row"><span>Description</span><p>{task.description || 'No description provided.'}</p></div>
        <div className="detail-row"><span>Created</span><p>{formatDate(task.createdAt)}</p></div>
        <button className="modal-done" type="button" onClick={onClose}>Close details</button>
      </section>
    </div>
  )
}

export default TaskDetailsModal
