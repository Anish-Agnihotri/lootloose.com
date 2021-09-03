// Imports
import loot from "@state/loot"; // Loot functions
import { useState } from "react"; // State management
import CTA from "@components/CTA"; // CTA component
import Layout from "@components/Layout"; // Layout wrapper
import Bundler from "@components/Bundler"; // Bundler component
import styles from "@styles/pages/Home.module.scss"; // Page styles

// Types
import type { NextPage } from "next";

/**
 * Home page
 * @returns {NextPage}
 */
const Home: NextPage = () => {
  // Loot functions
  const {
    unbundleLoot,
    rebundleLoot,
  }: { unbundleLoot: Function; rebundleLoot: Function } = loot.useContainer();
  // Quickfix: reloader
  // This is the only temporary hack to ensure reloading cross components
  const [reload, setReload] = useState<number>(0);

  return (
    <Layout>
      {/* Page CTA */}
      <CTA
        title="Unbundle and Bundle Loot"
        description="LootLoose lets you unbundle your Loot Bags into individual item NFTs
          or rebundle items into their original Loot Bags."
      />

      <div className={styles.home}>
        {/* Unbundle loot bags */}
        <div>
          <Bundler
            unbundle={true}
            functionHandler={unbundleLoot}
            reload={reload}
            setReload={setReload}
          />
        </div>

        {/* Rebundle items to bags */}
        <div>
          <Bundler
            unbundle={false}
            functionHandler={rebundleLoot}
            reload={reload}
            setReload={setReload}
          />
        </div>
      </div>
    </Layout>
  );
};

// Export page
export default Home;
