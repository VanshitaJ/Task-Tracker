function Icon({ name, size = 18 }) {
  const paths = {
    check: <path d="m5 12 4 4L19 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    trash: <path d="M4 7h16m-10 4v5m4-5v5M6 7l1 13h10l1-13M9 7V4h6v3" />,
    inbox: <><path d="M4 4h16v16H4z" /><path d="M4 13h4l1.5 2h5L16 13h4" /></>,
    spinner: <path d="M12 3a9 9 0 1 0 9 9" />,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    arrow: <path d="m7 10 5 5 5-5" />,
  }

  return (
    <svg
      aria-hidden="true"
      className={name === 'spinner' ? 'spin' : ''}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  )
}

export default Icon
