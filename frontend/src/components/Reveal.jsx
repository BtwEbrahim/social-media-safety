import useReveal from '../hooks/useReveal'

// Scroll-triggered wrapper: fades/rises in once when it enters the
// viewport. `as` picks the element so sections stay <section>.
export default function Reveal({ as: Tag = 'section', className = '', children, ...rest }) {
  const ref = useReveal()
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
