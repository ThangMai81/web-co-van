import Image from "next/image";

export default function ProgramGallery({ images }: { images: string[] }) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 font-bold text-blue">📷 Thư viện ảnh</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, idx) => (
          <a
            key={idx}
            href={src}
            target="_blank"
            rel="noreferrer"
            className="relative block aspect-square overflow-hidden rounded-lg border border-blue/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Image
              src={src}
              alt={`Ảnh ${idx + 1}`}
              fill
              sizes="(min-width: 896px) 275px, (min-width: 640px) 30vw, 40vw"
              className="object-cover transition hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
