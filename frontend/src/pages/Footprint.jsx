import { Fingerprint } from '@phosphor-icons/react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import MetadataReveal from '../components/MetadataReveal'

export default function Footprint() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <PageHeader icon={Fingerprint} label="Your Digital Footprint" title="The photo is the message. The metadata is what you sent by accident.">
        Every photo your phone takes carries a second, invisible layer
        alongside the image — camera model, timestamp, and often the exact
        GPS coordinates of where it was shot.
      </PageHeader>

      <Reveal className="mt-14">
        <h2 className="text-2xl font-semibold mb-4">
          Try it on your own photo
        </h2>
        <p className="text-paper-dim text-sm mb-5 max-w-2xl leading-relaxed">
          Upload a JPEG straight from a camera roll (not one already posted
          to social media — most platforms strip this data on upload).
          This reads the file locally in your browser only.
        </p>
        <MetadataReveal />
      </Reveal>

      <Reveal className="mt-14 grid md:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-6 md:p-7">
          <h2 className="text-2xl font-semibold mb-3">
            A real case
          </h2>
          <p className="text-paper-dim leading-relaxed">
            In 2010, a stalker used GPS data embedded in a celebrity's own
            social media photos to locate their home within hours. The
            photos looked private and ordinary — the coordinates were
            never visible in the image itself, only in the metadata
            underneath it.
          </p>
          <p className="text-paper-dim leading-relaxed mt-3">
            Most major platforms strip GPS data automatically now. But
            smaller platforms, direct messaging apps, email attachments,
            and marketplace listings often don't — and the original file
            can sometimes still be recovered through certain download
            paths even where display copies are stripped.
          </p>
        </div>
        <div className="glass rounded-3xl p-6 md:p-7">
          <h2 className="text-2xl font-semibold mb-3">
            IP addresses & rough location
          </h2>
          <p className="text-paper-dim leading-relaxed">
            Separately from photo metadata, every device connecting to the
            internet exposes an IP address to whatever it connects to.
            This alone can usually place someone within a city or ISP
            region — not an exact address, but combined with other data
            (posted times, tagged locations, mutual friends) it narrows
            things fast.
          </p>
          <p className="text-paper-dim leading-relaxed mt-3">
            5G networks add a further wrinkle: standalone 5G towers and a
            technique called network slicing can, in principle, locate a
            connected device within meters rather than the kilometers
            typical of older cell triangulation. This capability sits with
            network operators and isn't something an app or website gets
            direct access to — but it's part of why "my location is
            approximate anyway" is less true than it used to be.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="text-2xl font-semibold mb-3">
          The bigger picture: where the data actually goes
        </h2>
        <p className="text-paper-dim leading-relaxed max-w-3xl">
          Individual posts and photos are one thing. At scale, companies
          called data brokers aggregate exactly this kind of information —
          location history, purchase patterns, social connections — from
          hundreds of sources into detailed profiles, which get sold to
          advertisers, insurers, and in some cases government agencies.
          Palantir and BlackRock are two names that come up often in
          reporting on this industry: Palantir builds data-analysis
          infrastructure used by governments and corporations, while
          BlackRock's scale as an asset manager gives it visibility into
          consumer data trends most people never think about. Neither
          company is unique in doing this — they're simply large and
          visible examples of an industry that mostly operates without
          public attention.
        </p>
      </Reveal>
    </div>
  )
}
