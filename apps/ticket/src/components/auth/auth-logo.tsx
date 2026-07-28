// oxlint-disable react-doctor/nextjs-no-img-element
import { Link } from "@tanstack/react-router";

export function AuthLogo() {
  return (
    <Link to="/">
      <img src="/logo.png" alt="TOPSUN Energia" className="mx-auto w-42" />
    </Link>
  );
}
