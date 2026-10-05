// Shared page opener: small icon chip, headline, intro. Same entrance as Home.
export default function PageHeader({ icon: Icon, label, title, children, narrow = false }) {
  return (
    <header>
      <p
        className="rise-in inline-flex items-center gap-2 glass rounded-full pl-2 pr-4 py-1.5 text-sm text-paper-dim mb-6"
        style={{ animationDelay: '0ms' }}
      >
        <span className="grid place-items-center w-6 h-6 rounded-full bg-white/10 text-safe">
          <Icon size={15} weight="bold" />
        </span>
        {label}
      </p>
      <h1
        className={`rise-in text-4xl md:text-5xl font-semibold leading-[1.08] ${narrow ? '' : 'max-w-3xl'}`}
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
