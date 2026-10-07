import { formatDate } from '../utils'
import Icon from './Icon'
import StatusSelect from './StatusSelect'

function TaskCard({ task, actionId, onStatusChange, onDelete, onSelect }) {
  const isDone = task.status === 'Done'
  const statusClass = task.status.toLowerCase().replace(' ', '-')

  return (
    <article
      className={`task-card ${isDone ? 'completed' : ''}`}
      onClick={() => onSelect(task)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect(task)
      }}
      role="button"
      tabIndex="0"
    >
      <div className={`task-check ${isDone ? 'checked' : ''}`}><span>{isDone && <Icon name="check" size={14} />}</span></div>
      <div className="task-main">
        <div className="task-title-row"><h3>{task.title}</h3><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta"><span><Icon name="calendar" size={13} /> {formatDate(task.createdAt)}</span><span className={`status-pill ${statusClass}`}>{task.status}</span></div>
      </div>
      <div className="task-actions">
        {!isDone && <StatusSelect disabled={actionId === task._id} value={task.status} onChange={(status) => onStatusChange(task._id, status)} />}
        <button className="icon-button danger" type="button" aria-label={`Delete ${task.title}`} disabled={actionId === task._id} onClick={(event) => { event.stopPropagation(); onDelete(task) }}><Icon name="trash" size={16} /></button>
      </div>
    </article>
  )
}

export default TaskCard
