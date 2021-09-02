// Imports
import eth from "@state/eth"; // Network state
import Link from "next/link"; // Routing
import { default as NextHead } from "next/head"; // Head
import styles from "@styles/components/Layout.module.scss"; // Layout styles

// Types
import type { ReactElement } from "react";

/**
 * Layout wrapper component
 * @param {ReactElement} children to pass as page content
 * @returns {ReactElement} of content
 */
export default function Layout({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  return (
    <div>
      {/* HTML Head */}
      <Head />

      {/* Page header */}
      <Header />

      {/* CTA section */}
      <CTA />

      {/* Render page children */}
      <div>{children}</div>
    </div>
  );
}

/**
 * HTML Head
 * @returns {ReactElement} Head
 */
function Head(): ReactElement {
  return (
    <NextHead>
      {/* Meta: Primary */}
      <title>LootLoose — Unbundle Loot Items</title>
      <meta name="title" content="LootLoose — Unbundle Loot Items" />
      <meta
        name="description"
        content="LootLoose lets you unbundle your Loot Bags into individual item NFTs
          or rebundle items into their original Loot Bags."
      />

      {/* Meta: OG + Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://lootloose.com/" />
      <meta property="og:title" content="LootLoose — Unbundle Loot Items" />
      <meta
        property="og:description"
        content="LootLoose lets you unbundle your Loot Bags into individual item NFTs
          or rebundle items into their original Loot Bags."
      />
      <meta property="og:image" content="https://lootloose.com/meta.png" />

      {/* Meta: Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://lootloose.com" />
      <meta
        property="twitter:title"
        content="LootLoose — Unbundle Loot Items"
      />
      <meta
        property="twitter:description"
        content="LootLoose lets you unbundle your Loot Bags into individual item NFTs
          or rebundle items into their original Loot Bags."
      />
      <meta property="twitter:image" content="https://lootloose.com/meta.png" />

      {/* Favicon */}
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Open+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </NextHead>
  );
}

/**
 * Page Header
 * @returns {ReactElement} header
 */
function Header(): ReactElement {
  // Network state
  const { address, unlock }: { address: string | null; unlock: Function } =
    eth.useContainer();

  return (
    <div className={styles.header}>
      {/* Logo */}
      <div className={styles.header__logo}>
        <Link href="/">
          <a>
            <img src="/logo.png" alt="Logo" width="36px" height="36px" />
          </a>
        </Link>
      </div>

      {/* Auth button */}
      <div className={styles.header__auth}>
        <button onClick={() => unlock()}>
          {address
            ? // Truncate address if authenticated
              address.substr(0, 6) + "..." + address.slice(address.length - 4)
            : "Authenticate"}
        </button>
      </div>
    </div>
  );
}

/**
 * Call-to-action subheader
 * @returns {ReactElement} CTA
 */
function CTA(): ReactElement {
  return (
    <div className={styles.cta}>
      <div className={styles.cta__content}>
        <h1>Unbundle and Bundle Loot</h1>
        <p>
          LootLoose lets you unbundle your Loot Bags into individual item NFTs
          or rebundle items into their original Loot Bags.
        </p>
      </div>
    </div>
  );
}
