// Imports
import loot from "@state/loot"; // Loot functions
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

  return (
    <Layout>
      <div className={styles.home}>
        {/* Unbundle loot bags */}
        <div>
          <Bundler unbundle={true} functionHandler={unbundleLoot} />
        </div>

        {/* Rebundle items to bags */}
        <div>
          <Bundler unbundle={false} functionHandler={rebundleLoot} />
        </div>
      </div>
    </Layout>
  );
};

// Export page
export default Home;
