// Imports
import "@styles/global.scss"; // Global styles
import GlobalProvider from "@state/index"; // State provider
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import { ToastContainer } from "react-toastify"; // Toastify wrapper

// Types
import type { AppProps } from "next/app";

// Export app
export default function LootLoose({ Component, pageProps }: AppProps) {
  return (
    // State provider
    <GlobalProvider>
      {/* Toast notification provider */}
      <ToastContainer />

      <Component {...pageProps} />
    </GlobalProvider>
  );
}
