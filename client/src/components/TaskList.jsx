
import Icon from './Icon'
import TaskCard from './TaskCard'

function TaskList({ tasks, filter, loading, error, actionId, onRetry, onStatusChange, onDelete, onSelect }) {
  return (
    <div className="tasks-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Task list</p>
          <h2>What&apos;s on your plate?</h2>
        </div>
        {/* <label className="filter-select">
          <span className="sr-only">Filter tasks by status</span>
          <select value={filter} onChange={(event) => onFilter(event.target.value)}>
            <option>All tasks</option>
            {STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
          <Icon name="arrow" size={15} />
        </label> */}
      </div>

      {error && <div className="error-banner" role="alert">{error}<button type="button" onClick={onRetry}>Retry</button></div>}
      {loading ? (
        <div className="state-card"><Icon name="spinner" size={25} /><p>Loading your tasks...</p></div>
      ) : tasks.length === 0 ? (
        <div className="state-card empty-state"><span className="empty-icon"><Icon name="check" size={22} /></span><h3>No tasks here yet</h3><p>{filter === 'All tasks' ? 'Create your first task to get started.' : `There are no ${filter.toLowerCase()} tasks.`}</p></div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => <TaskCard key={task._id} task={task} actionId={actionId} onStatusChange={onStatusChange} onDelete={onDelete} onSelect={onSelect} />)}
        </div>
      )}
    </div>
  )
}

export default TaskList
