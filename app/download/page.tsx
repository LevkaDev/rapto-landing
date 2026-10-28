import type { Metadata } from "next";
import DownloadStarter from "./DownloadStarter";

export const metadata: Metadata = {
  title: "Downloading Rapto",
  robots: { index: false, follow: true },
};

export default function DownloadPage() {
  return <DownloadStarter />;
}
