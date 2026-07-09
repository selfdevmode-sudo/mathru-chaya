import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap not-found">
      <h1>Page not found</h1>
      <p>The page you are looking for may have moved or no longer exists.</p>
      <Link href="/" className="btn">
        Back to home
      </Link>
    </div>
  );
}
