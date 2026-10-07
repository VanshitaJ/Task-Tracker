import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { STATUSES } from '../constants'
import Icon from './Icon'

const MENU_GAP = 6
const MENU_MIN_WIDTH = 145
const MENU_HEIGHT = 112 // 3 options + padding, used to decide whether to open up or down

function StatusSelect({ value, disabled, onChange }) {
  const [menuStyle, setMenuStyle] = useState(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const open = menuStyle !== null

  // Close on outside click, Escape, scroll or resize.
  useEffect(() => {
    if (!open) return undefined
    const close = () => setMenuStyle(null)
    const closeOnOutside = (event) => {
      if (triggerRef.current?.contains(event.target)) return
      if (menuRef.current?.contains(event.target)) return
      close()
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const toggleMenu = (event) => {
    event.stopPropagation()
    if (open) {
      setMenuStyle(null)
      return
    }
    const rect = triggerRef.current.getBoundingClientRect()
    const width = Math.max(rect.width, MENU_MIN_WIDTH)
    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < MENU_HEIGHT + MENU_GAP + 8 && rect.top > spaceBelow
    setMenuStyle({
      position: 'fixed',
      top: openUp ? rect.top - MENU_HEIGHT - MENU_GAP : rect.bottom + MENU_GAP,
      left: Math.max(8, rect.right - width),
      right: 'auto',
      minWidth: width,
      zIndex: 50,
    })
  }

  const selectStatus = (status) => {
    setMenuStyle(null)
    if (status !== value) onChange(status)
  }

  return (
    <div className="status-select">
      <button
        ref={triggerRef}
        className={`status-trigger ${value.toLowerCase().replace(' ', '-')}`}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={toggleMenu}
      >
        <span className="status-dot-indicator" />
        {value}
        <Icon name="arrow" size={13} />
      </button>
      {open && createPortal(
        <div
          className="status-menu"
          ref={menuRef}
          role="listbox"
          aria-label="Task status"
          style={menuStyle}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {STATUSES.map((status) => (
            <button
              className={status === value ? 'selected' : ''}
              key={status}
              role="option"
              aria-selected={status === value}
              type="button"
              onClick={() => selectStatus(status)}
            >
              <span className={`status-dot-indicator ${status.toLowerCase().replace(' ', '-')}`} />
              {status}
              {status === value && <Icon name="check" size={13} />}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )  
}

export default StatusSelect