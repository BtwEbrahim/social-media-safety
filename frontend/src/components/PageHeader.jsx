// Shared page opener: icon + label, headline, intro. Uses the same
// staggered rise-in as Home so every page enters the same way.
export default function PageHeader({ icon: Icon, label, title, children, narrow = false }) {
  return (
    <header>
      <p
        className="rise-in flex items-center gap-2 font-data text-signal-amber text-xs mb-4"
        style={{ animationDelay: '0ms' }}
      >
        <Icon size={18} weight="duotone" />
        {label}
      </p>
      <h1
        className={`rise-in font-serif text-3xl md:text-4xl font-semibold leading-tight ${narrow ? '' : 'max-w-2xl'}`}
        style={{ animationDelay: '80ms' }}
      >
        {title}
      </h1>
      <p
        className={`rise-in text-paper-dim text-lg mt-5 leading-relaxed ${narrow ? '' : 'max-w-2xl'}`}
        style={{ animationDelay: '160ms' }}
      >
        {children}
      </p>
    </header>
  )
}
