import "@/styles/globals.css";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Weathery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen w-full flex flex-col bg-primary">
        {router.pathname === "/dashboard" && <Navbar />}
        <div className="container flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 my-10">
          <Component {...pageProps} />;
        </div>
      </div>
    </>
  );
}
