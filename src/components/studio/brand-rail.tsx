import Link from "next/link";

export function BrandRail({
  href = "/",
  note = "A little less ordinary",
}: {
  href?: string;
  note?: string;
}) {
  return (
    <aside className="studio-rail" aria-label="Soggy Roll">
      <Link href={href} className="studio-rail-mark" aria-label="Soggy Roll home">
        <span aria-hidden="true">✳</span>
      </Link>
      <Link href={href} className="studio-wordmark" aria-label="Soggy Roll home">
        soggyroll.
      </Link>
      <p className="studio-rail-note">{note}</p>
    </aside>
  );
}
