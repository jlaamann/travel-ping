import Head from "next/head";
import PhotoMap from "./components/photo-map";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div className="relative min-h-screen">
        <PhotoMap />
      </div>
    </main>
  );
}
