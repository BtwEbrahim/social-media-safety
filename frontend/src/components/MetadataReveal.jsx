import { useState } from 'react'
import ExifReader from 'exifreader'

// Real metadata reader built on ExifReader (JPEG, HEIC/HEIF, PNG, WebP,
// AVIF, TIFF, GIF). It reads the file locally with FileReader and shows
// EVERY group the file carries: Exif, XMP, IPTC, ICC, maker notes, MPF,
// file details and the embedded thumbnail. Nothing is uploaded.
//
// Two things matter for phone photos (Samsung, iPhone):
//  1. The file input must NOT set accept="image/*". On Android and iOS
//     that makes the picker hand the browser a copy with GPS removed
//     (ExifReader's own docs call this out).
//  2. Phones keep much of their data in XMP and maker notes, not only
//     in plain Exif, so we read every group instead of a fixed list.

const GROUP_LABELS = {
  file: 'File details',
  jfif: 'JFIF',
  exif: 'Exif (camera, time, settings, GPS tags)',
  gps: 'GPS (computed)',
  xmp: 'XMP (extra data written by phone and editing apps)',
  iptc: 'IPTC',
  icc: 'ICC colour profile',
  makerNotes: 'Maker notes (manufacturer-specific)',
  mpf: 'Multi-picture (MPF)',
  composite: 'Composite',
  photoshop: 'Photoshop',
  png: 'PNG',
  pngText: 'PNG text',
  riff: 'WebP (RIFF)',
  gif: 'GIF',
}

// The headline view. Anything not listed here still appears in the
// full dump underneath.
const SUMMARY_GROUPS = [
  {
    label: 'Device',
    fields: [
      ['Make', 'Make'],
      ['Model', 'Model'],
      ['LensMake', 'Lens make'],
      ['LensModel', 'Lens'],
      ['Software', 'Software'],
      ['HostComputer', 'Host device'],
    ],
  },
  {
    label: 'Identifiers',
    fields: [
      ['ImageUniqueID', 'Image unique ID'],
      ['BodySerialNumber', 'Body serial number'],
      ['LensSerialNumber', 'Lens serial number'],
      ['CameraOwnerName', 'Camera owner'],
      ['Artist', 'Artist'],
      ['Copyright', 'Copyright'],
      ['ImageDescription', 'Description'],
      ['UserComment', 'User comment'],
    ],
  },
  {
    label: 'When',
    fields: [
      ['DateTimeOriginal', 'Date taken'],
      ['DateTimeDigitized', 'Date digitized'],
      ['DateTime', 'Date modified'],
      ['SubSecTimeOriginal', 'Sub-second'],
      ['OffsetTimeOriginal', 'Timezone offset'],
      ['GPSDateStamp', 'GPS date'],
      ['GPSTimeStamp', 'GPS time (UTC)'],
    ],
  },
  {
    label: 'Shot settings',
    fields: [
      ['ExposureTime', 'Exposure time'],
      ['FNumber', 'Aperture'],
      ['ISOSpeedRatings', 'ISO'],
      ['FocalLength', 'Focal length'],
      ['FocalLengthIn35mmFilm', 'Focal length (35mm equiv.)'],
      ['BrightnessValue', 'Brightness'],
      ['Flash', 'Flash'],
      ['ExposureMode', 'Exposure mode'],
      ['WhiteBalance', 'White balance'],
      ['SceneCaptureType', 'Scene type'],
    ],
  },
  {
    label: 'Direction and movement',
    fields: [
      ['GPSAltitude', 'Altitude'],
      ['GPSImgDirection', 'Facing direction'],
      ['GPSSpeed', 'Speed'],
      ['GPSDestBearing', 'Bearing'],
    ],
  },
  {
    label: 'Image',
    fields: [
      ['ImageWidth', 'Width'],
      ['ImageHeight', 'Height'],
      ['Image Width', 'Width'],
      ['Image Height', 'Height'],
      ['Orientation', 'Orientation'],
      ['ColorSpace', 'Color space'],
    ],
  },
]

const MAX_VALUE_LENGTH = 300

function describe(tag) {
  if (tag === null || tag === undefined) return null
  if (typeof tag === 'string' || typeof tag === 'number' || typeof tag === 'boolean') {
    return String(tag)
  }
  let out = null
  if (typeof tag.description === 'string' && tag.description.trim()) {
    out = tag.description
  } else if (tag.value !== undefined && tag.value !== null) {
    out = Array.isArray(tag.value) ? tag.value.join(', ') : String(tag.value)
  }
  if (out && out.length > MAX_VALUE_LENGTH) {
    out = `${out.slice(0, MAX_VALUE_LENGTH)}… (${out.length} characters in total)`
  }
  return out
}

function extractGps(result) {
  const g = result.gps
  if (g && Number.isFinite(g.Latitude) && Number.isFinite(g.Longitude)) {
    return { lat: g.Latitude, lon: g.Longitude, alt: g.Altitude }
  }
  return null
}

// Phone cameras that record a video clip inside the photo say so in XMP.
function hasMotionClip(xmp) {
  if (!xmp) return false
  return Object.keys(xmp).some((k) => /MotionPhoto|MicroVideo/i.test(k))
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

export default function MetadataReveal() {
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)
  const [isVideo, setIsVideo] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFile = async (e) => {
    const picked = e.target.files[0]
    if (!picked) return

    setFile(picked)
    setError(null)
    setReport(null)
    setIsVideo(false)

    if (picked.type.startsWith('video/')) {
      setIsVideo(true)
      return
    }

    setLoading(true)
    try {
      const result = await ExifReader.load(picked, {
        expanded: true,
        includeUnknown: true,
        async: true,
      })

      const groups = []
      for (const [key, tags] of Object.entries(result)) {
        if (key === 'Thumbnail' || !tags || typeof tags !== 'object') continue
        const rows = Object.entries(tags)
          .filter(([name]) => !name.startsWith('_'))
          .map(([name, tag]) => [name, describe(tag)])
          .filter(([, val]) => val)
        if (rows.length > 0) groups.push({ key, rows })
      }

      // Flat lookup for the summary. Later groups win only where the
      // earlier ones had nothing, so Exif stays the first choice.
      const flat = {}
      for (const key of ['exif', 'composite', 'file', 'xmp', 'makerNotes']) {
        for (const [name, tag] of Object.entries(result[key] || {})) {
          if (!(name in flat)) flat[name] = describe(tag)
        }
      }

      setReport({
        groups,
        flat,
        gps: extractGps(result),
        thumb: result.Thumbnail?.base64 || null,
        motion: hasMotionClip(result.xmp),
        total: groups.reduce((n, g) => n + g.rows.length, 0),
      })
    } catch {
      setError("Could not read this file. It may be corrupted, or in a format this reader doesn't recognise.")
    } finally {
      setLoading(false)
    }
  }

  const hasData = report && report.total > 0

  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-sm text-paper-dim mb-3">
        Upload a photo. It is read entirely in your browser, nothing is sent anywhere
      </p>
      {/* No accept attribute on purpose: accept="image/*" makes Android
          and iOS strip GPS before the browser ever sees the file. */}
      <input
        type="file"
        onChange={handleFile}
        className="font-data text-xs text-paper-dim file:mr-3 file:px-4 file:py-2 file:rounded-full file:border file:border-white/20 file:bg-white/10 file:text-paper file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-white/20 cursor-pointer"
      />

      {file && (
        <p className="text-xs text-paper-dim mt-3 font-data break-all">
          Checked: {file.name} · {formatBytes(file.size)}
          {file.type ? ` · ${file.type}` : ''}
        </p>
      )}

      {loading && <p className="text-xs text-paper-dim mt-3 font-data">Reading file…</p>}

      {isVideo && (
        <div className="mt-4 p-4 rounded-2xl border border-white/10 bg-white/5">
          <p className="text-xs text-paper-dim leading-relaxed">
            Video files don't use Exif. Their metadata (creation time, device
            model, sometimes GPS) sits in a different container, inside
            MP4/MOV atoms, and needs a separate reader. It is often just as
            revealing as a photo's.
          </p>
        </div>
      )}

      {error && <p className="text-exposed text-xs mt-3">{error}</p>}

      {report && !hasData && !error && (
        <div className="mt-4 p-4 rounded-2xl glass-safe border">
          <p className="text-safe text-xs leading-relaxed">
            No metadata found. Either an app already stripped it (messaging
            apps and most social platforms do), or the file never had any
            (screenshots, for instance). On a phone, also try choosing the
            file through the Files app or a file manager rather than the
            Photos or Gallery picker, because those pickers can hand over a
            copy with location removed. A photo copied straight from the
            phone over USB keeps everything.
          </p>
        </div>
      )}

      {hasData && (
        <div className="mt-4 space-y-5">
          <p className="font-data text-xs text-paper-dim">
            {report.total} fields found across {report.groups.length} groups
          </p>

          {report.gps ? (
            <div className="p-4 rounded-2xl glass-exposed border">
              <p className="font-data text-[11px] text-exposed mb-2">
                GPS location found in this file
              </p>
              <p className="font-data text-xs text-paper">
                {report.gps.lat.toFixed(6)}, {report.gps.lon.toFixed(6)}
                {Number.isFinite(report.gps.alt) && ` · altitude ${report.gps.alt.toFixed(1)} m`}
              </p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${report.gps.lat}&mlon=${report.gps.lon}#map=17/${report.gps.lat}/${report.gps.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-data text-[11px] text-exposed underline underline-offset-2 mt-2 inline-block"
              >
                View this exact spot on a map →
              </a>
            </div>
          ) : (
            <p className="text-xs text-paper-dim leading-relaxed">
              No GPS coordinates in this copy. Location may have been off
              when the photo was taken, an app may have removed it, or the
              picker on your phone may have stripped it.
            </p>
          )}

          {report.motion && (
            <div className="p-4 rounded-2xl glass-exposed border">
              <p className="text-xs text-exposed leading-relaxed">
                This is a motion photo: a short video clip is tagged as part
                of this file, so sharing the photo can share the clip too.
              </p>
            </div>
          )}

          {SUMMARY_GROUPS.map((group) => {
            const seen = new Set()
            const rows = group.fields
              .map(([key, label]) => [label, report.flat[key]])
              .filter(([label, val]) => {
                if (!val || seen.has(label)) return false
                seen.add(label)
                return true
              })
            if (rows.length === 0) return null
            return (
              <div key={group.label}>
                <p className="font-data text-[11px] text-paper-dim mb-1.5">
                  {group.label}
                </p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 font-data text-xs">
                  {rows.map(([label, val]) => (
                    <p key={label} className="break-words">
                      <span className="text-paper-dim">{label}: </span>
                      <span className="text-paper">{val}</span>
                    </p>
                  ))}
                </div>
              </div>
            )
          })}

          {report.thumb && (
            <div>
              <p className="font-data text-[11px] text-paper-dim mb-1.5">
                Embedded thumbnail
              </p>
              <img
                src={`data:image/jpeg;base64,${report.thumb}`}
                alt="Thumbnail stored inside the file"
                className="rounded-xl border border-white/15 max-h-32"
              />
              <p className="text-xs text-paper-dim mt-1.5 leading-relaxed">
                A small copy stored inside the file. Some editing tools
                forget to update it after a crop.
              </p>
            </div>
          )}

          <div>
            <p className="font-data text-[11px] text-paper-dim mb-2">
              Everything embedded in the file
            </p>
            <div className="space-y-2">
              {report.groups.map((g) => (
                <details key={g.key} className="border border-white/10 rounded-2xl bg-white/5">
                  <summary className="cursor-pointer px-3 py-2 font-data text-xs text-paper">
                    {GROUP_LABELS[g.key] || g.key}
                    <span className="text-paper-dim"> · {g.rows.length}</span>
                  </summary>
                  <div className="px-3 pb-3 pt-1 grid gap-y-1 font-data text-xs">
                    {g.rows.map(([name, val]) => (
                      <p key={name} className="break-words">
                        <span className="text-paper-dim">{name}: </span>
                        <span className="text-paper">{val}</span>
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
