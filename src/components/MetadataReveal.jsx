import { useState } from 'react'

// Real, working EXIF parser — reads the actual metadata bytes out of a
// JPEG the user uploads, entirely in the browser. Nothing is uploaded
// anywhere; the File is read locally with FileReader. This is a genuine
// tool, not a mock, which is the point: the danger isn't hypothetical.

function parseExif(buffer) {
  const view = new DataView(buffer)
  if (view.getUint16(0) !== 0xffd8) return null // not a JPEG

  let offset = 2
  while (offset < view.byteLength) {
    const marker = view.getUint16(offset)
    if (marker === 0xffe1) {
      // APP1 marker — this is where EXIF lives
      const exifStart = offset + 4
      if (
        view.getUint32(exifStart) === 0x45786966 // "Exif"
      ) {
        return extractFields(view, exifStart + 6)
      }
    }
    if ((marker & 0xff00) !== 0xff00) break
    offset += 2 + view.getUint16(offset + 2)
  }
  return null
}

function extractFields(view, tiffStart) {
  const little = view.getUint16(tiffStart) === 0x4949
  const getU16 = (o) => view.getUint16(o, little)
  const getU32 = (o) => view.getUint32(o, little)

  const ifdOffset = tiffStart + getU32(tiffStart + 4)
  const entries = getU16(ifdOffset)
  const found = {}

  for (let i = 0; i < entries; i++) {
    const entryOffset = ifdOffset + 2 + i * 12
    const tag = getU16(entryOffset)
    const type = getU16(entryOffset + 2)
    const valueOffset = entryOffset + 8

    if (tag === 0x0110) found.model = readAscii(view, tiffStart, type, valueOffset, little)
    if (tag === 0x010f) found.make = readAscii(view, tiffStart, type, valueOffset, little)
    if (tag === 0x0132) found.date = readAscii(view, tiffStart, type, valueOffset, little)
  }
  return found
}

function readAscii(view, tiffStart, type, valueOffset, little) {
  try {
    const count = view.getUint32(valueOffset - 4, little)
    const offset = count > 4 ? tiffStart + view.getUint32(valueOffset, little) : valueOffset
    let str = ''
    for (let i = 0; i < count - 1; i++) {
      str += String.fromCharCode(view.getUint8(offset + i))
    }
    return str.trim()
  } catch {
    return null
  }
}

export default function MetadataReveal() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    setError(null)
    setResult(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = parseExif(ev.target.result)
        if (!data || Object.keys(data).length === 0) {
          setResult({ empty: true })
        } else {
          setResult(data)
        }
      } catch {
        setError('Could not parse this file — try a JPEG straight from a camera or phone.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="border border-ink-line rounded-lg bg-ink-raised p-5">
      <p className="font-data text-xs text-paper-dim uppercase tracking-wider mb-3">
        Upload a photo — checked entirely in your browser, nothing is sent anywhere
      </p>
      <input
        type="file"
        accept="image/jpeg"
        onChange={handleFile}
        className="font-data text-xs text-paper-dim file:mr-3 file:px-3 file:py-1.5 file:rounded file:border file:border-ink-line file:bg-ink file:text-paper file:text-xs file:cursor-pointer cursor-pointer"
      />

      {fileName && (
        <p className="text-xs text-paper-dim mt-3 font-data">Checked: {fileName}</p>
      )}

      {error && (
        <p className="text-signal-amber text-xs mt-3">{error}</p>
      )}

      {result && !result.empty && (
        <div className="mt-4 p-3 rounded border border-signal-amber/30 bg-signal-amber/5">
          <p className="font-data text-[11px] text-signal-amber uppercase tracking-wider mb-2">
            Found in this file
          </p>
          <div className="space-y-1 font-data text-xs">
            {result.make && <p><span className="text-paper-dim">Camera make: </span>{result.make}</p>}
            {result.model && <p><span className="text-paper-dim">Camera model: </span>{result.model}</p>}
            {result.date && <p><span className="text-paper-dim">Date taken: </span>{result.date}</p>}
          </div>
        </div>
      )}

      {result && result.empty && (
        <div className="mt-4 p-3 rounded border border-signal-teal/30 bg-signal-teal/5">
          <p className="text-signal-teal text-xs">
            No EXIF metadata found — either this platform already stripped
            it, or the file never had it (screenshots, for instance, carry
            different metadata entirely).
          </p>
        </div>
      )}
    </div>
  )
}
