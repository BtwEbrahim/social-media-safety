import { useState } from 'react'
import ExifReader from 'exifreader'

// Real, working metadata reader — uses ExifReader (actively maintained,
// handles JPEG/HEIC/PNG/WebP/AVIF) to pull out whatever a file actually
// carries. Everything happens locally via FileReader; nothing is
// uploaded anywhere. Video files don't carry EXIF at all — that's a
// different container format (QuickTime/MP4 metadata atoms), so we
// tell the user that plainly instead of pretending to support it.

const GPS_TAGS = ['GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSImgDirection']

const FIELD_GROUPS = [
  {
    label: 'Camera / device',
    fields: [
      ['Make', 'Camera make'],
      ['Model', 'Camera model'],
      ['LensModel', 'Lens'],
      ['Software', 'Software'],
    ],
  },
  {
    label: 'When',
    fields: [
      ['DateTimeOriginal', 'Date taken'],
      ['DateTime', 'Date modified'],
      ['OffsetTimeOriginal', 'Timezone offset'],
    ],
  },
  {
    label: 'Shot settings',
    fields: [
      ['ExposureTime', 'Exposure time'],
      ['FNumber', 'Aperture'],
      ['ISOSpeedRatings', 'ISO'],
      ['FocalLength', 'Focal length'],
      ['Flash', 'Flash'],
      ['ExposureMode', 'Exposure mode'],
      ['WhiteBalance', 'White balance'],
    ],
  },
  {
    label: 'Image',
    fields: [
      ['ImageWidth', 'Width'],
      ['ImageHeight', 'Height'],
      ['Orientation', 'Orientation'],
      ['ColorSpace', 'Color space'],
    ],
  },
]

function describe(tag) {
  if (!tag) return null
  if (typeof tag.description === 'string' && tag.description.trim()) return tag.description
  if (tag.value !== undefined) {
    return Array.isArray(tag.value) ? tag.value.join(', ') : String(tag.value)
  }
  return null
}

function extractGps(tags) {
  const lat = tags.GPSLatitude
  const lon = tags.GPSLongitude
  if (!lat?.description || !lon?.description) return null

  let latVal = parseFloat(lat.description)
  let lonVal = parseFloat(lon.description)
  if (tags.GPSLatitudeRef?.value?.[0] === 'S') latVal = -Math.abs(latVal)
  if (tags.GPSLongitudeRef?.value?.[0] === 'W') lonVal = -Math.abs(lonVal)
  if (Number.isNaN(latVal) || Number.isNaN(lonVal)) return null

  return { lat: latVal, lon: lonVal }
}

export default function MetadataReveal() {
  const [tags, setTags] = useState(null)
  const [gps, setGps] = useState(null)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isVideo, setIsVideo] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)
    setError(null)
    setTags(null)
    setGps(null)
    setIsVideo(false)

    if (file.type.startsWith('video/')) {
      setIsVideo(true)
      return
    }

    setLoading(true)
    try {
      const result = await ExifReader.load(file, { expanded: true })
      const flat = { ...result.exif, ...result.gps, ...result.file }
      const hasAny = Object.keys(flat).length > 0
      setTags(hasAny ? flat : {})
      setGps(extractGps(flat))
    } catch {
      setError('Could not read this file — it may be corrupted, or in a format this reader doesn\'t recognize.')
    } finally {
      setLoading(false)
    }
  }

  const hasData = tags && Object.keys(tags).length > 0

  return (
    <div className="border border-ink-line rounded-lg bg-ink-raised p-5">
      <p className="font-data text-xs text-paper-dim uppercase tracking-wider mb-3">
        Upload a photo — checked entirely in your browser, nothing is sent anywhere
      </p>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFile}
        className="font-data text-xs text-paper-dim file:mr-3 file:px-3 file:py-1.5 file:rounded file:border file:border-ink-line file:bg-ink file:text-paper file:text-xs file:cursor-pointer cursor-pointer"
      />

      {fileName && (
        <p className="text-xs text-paper-dim mt-3 font-data">Checked: {fileName}</p>
      )}

      {loading && (
        <p className="text-xs text-paper-dim mt-3 font-data">Reading file…</p>
      )}

      {isVideo && (
        <div className="mt-4 p-3 rounded border border-ink-line bg-ink/40">
          <p className="text-xs text-paper-dim leading-relaxed">
            Video files don't carry EXIF — that's a still-image format.
            Video metadata (creation time, device model, sometimes GPS)
            lives in a different container, inside MP4/MOV atoms, and
            needs a separate reader. Worth knowing: it's often just as
            revealing, and just as commonly still present in files people
            share.
          </p>
        </div>
      )}

      {error && <p className="text-signal-amber text-xs mt-3">{error}</p>}

      {tags && !hasData && !error && (
        <div className="mt-4 p-3 rounded border border-signal-teal/30 bg-signal-teal/5">
          <p className="text-signal-teal text-xs">
            No metadata found — either this platform already stripped it,
            or the file never had it (screenshots, for instance, carry
            different metadata entirely).
          </p>
        </div>
      )}

      {hasData && (
        <div className="mt-4 space-y-4">
          {gps && (
            <div className="p-3 rounded border border-signal-amber/30 bg-signal-amber/5">
              <p className="font-data text-[11px] text-signal-amber uppercase tracking-wider mb-2">
                GPS location found in this file
              </p>
              <p className="font-data text-xs text-paper">
                {gps.lat.toFixed(5)}, {gps.lon.toFixed(5)}
              </p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${gps.lat}&mlon=${gps.lon}#map=15/${gps.lat}/${gps.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-data text-[11px] text-signal-amber underline underline-offset-2 mt-2 inline-block"
              >
                View this exact spot on a map →
              </a>
            </div>
          )}

          {FIELD_GROUPS.map((group) => {
            const rows = group.fields
              .map(([key, label]) => [label, describe(tags[key])])
              .filter(([, val]) => val)
            if (rows.length === 0) return null
            return (
              <div key={group.label}>
                <p className="font-data text-[11px] text-paper-dim uppercase tracking-wider mb-1.5">
                  {group.label}
                </p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 font-data text-xs">
                  {rows.map(([label, val]) => (
                    <p key={label}>
                      <span className="text-paper-dim">{label}: </span>
                      <span className="text-paper">{val}</span>
                    </p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
