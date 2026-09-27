import PhosphorIcon from './PhosphorIcon'

export default function PageHeader({ number, label, icon, title, intro, narrow = false }) {
  return (
    <header className="mb-14">
      <div className="flex items-center gap-2 mb-4">
        <PhosphorIcon name={icon} size={18} className="text-signal-amber shrink-0" />
        <p className="font-data text-signal-amber text-xs uppercase tracking-widest">
          {number} — {label}
        </p>
      </div>
      <h1 className={`font-serif text-3xl md:text-4xl font-semibold leading-tight ${narrow ? 'max-w-2xl' : 'max-w-3xl'}`}>
        {title}
      </h1>
      {intro && (
        <p className="text-paper-dim text-lg mt-5 max-w-2xl leading-relaxed">
          {intro}
        </p>
      )}
    </header>
  )
}
