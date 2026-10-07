import { PRIORITIES } from '../constants'
import Icon from './Icon'

function NewTaskForm({ form, formError, saving, onChange, onSubmit }) {
  return (
    <section className="new-task-card">
      <div className="new-task-heading"><span className="add-icon"><Icon name="plus" size={18} /></span><div><p className="eyebrow">New task</p><h2>Add something new</h2></div></div>
      <form onSubmit={onSubmit}>
        <label>
          Title
          <span>required</span>
          <input autoFocus maxLength="100" placeholder="What needs to be done?" value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} />
          <small className={`title-counter ${form.title.length >= 90 ? 'near-limit' : ''} ${form.title.length === 100 ? 'at-limit' : ''}`}>
            {form.title.length}/100 characters
          </small>
        </label>
        <label>Description <span>optional</span><textarea placeholder="Add a little context..." rows="4" value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} /></label>
        <label>Priority<select value={form.priority} onChange={(event) => onChange({ ...form, priority: event.target.value })}>{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <button className="primary-button" type="submit" disabled={saving}>{saving ? <><Icon name="spinner" size={17} /> Adding task...</> : <><Icon name="plus" size={17} /> Add task</>}</button>
      </form>
    </section>
  )
}

export default NewTaskForm
