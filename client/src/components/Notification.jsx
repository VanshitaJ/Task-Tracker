function Notification({ notification, onDismiss }) {
  if (!notification) return null

  return (
    <div className={`notification ${notification.type}`} role="status">
      <span>{notification.type === 'success' ? '✓' : '!'}</span>
      <p>{notification.message}</p>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>×</button>
    </div>
  )
}

export default Notification
