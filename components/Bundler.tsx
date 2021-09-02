// Imports
import eth from "@state/eth"; // ETH state
import { useState } from "react"; // State mgmt.
import useWallet from "@hooks/useWallet"; // Loot by wallet
import { rarityImageFromItems } from "loot-rarity"; // Loot images
import styles from "@styles/components/Bundles.module.scss"; // Component styles

// Types
import type { ReactElement } from "react";

/**
 * Bundler handling component
 * @param {bool} unbundle true if unbundling, false if rebundling
 * @param {Function} functionHandler to call on button submit state
 * @returns {ReactElement}
 */
export default function Bundler({
  unbundle,
  functionHandler,
}: {
  unbundle: boolean;
  functionHandler: Function;
}): ReactElement {
  // Global providers
  const { unlock, address }: { unlock: Function; address: string | null } =
    eth.useContainer(); // Address + unlock function

  // Local providers
  const [bag, setBag] = useState<string | null>(null); // Selected bag id
  const [buttonLoading, setButtonLoading] = useState<boolean>(false); // Button loading

  /**
   * Collects wallet details
   */
  const { data, loading, error, collect } = useWallet(
    // If unbundle, use authed address, else contract address
    (unbundle
      ? /*address*/ "0x0A4dE0bE3CdDe71C8D7b67f1eC8A79aa05142619"
      : process.env.NEXT_PUBLIC_BUNDLER_ADDRESS) ?? ""
  );

  /**
   * Runs functionHandler() with loading toggle, passing required id params
   */
  const runFunctionWithLoading = async (): Promise<void> => {
    setButtonLoading(true); // Toggle loading

    try {
      // Call functionHandler
      await functionHandler(bag);
      // Recollect bags
      await collect();
    } catch (e) {
      // Log error
      console.error(e);
    }

    setButtonLoading(false); // Toggle loading
  };

  return (
    <div className={styles.bundle}>
      <h3>{unbundle ? "Unbundle" : "Bundle"} Items</h3>
      <p>
        {unbundle
          ? "Unbundle loot bags into individual items."
          : "Rebundle items into loot bags."}
      </p>
      <div className={styles.items__container}>
        {!address ? (
          <span className={styles.items__container_empty}>
            Please authenticate first
          </span>
        ) : loading || buttonLoading ? (
          <span className={styles.items__container_empty}>Loading...</span>
        ) : error ? (
          <span className={styles.items__container_empty}>{error}</span>
        ) : data.length === 0 ? (
          <span className={styles.items__container_empty}>
            No bags {unbundle ? "in inventory" : "in contract"}
          </span>
        ) : (
          <div className={styles.items__container_filled}>
            {data.map((loot, i) => {
              const { id, ...attributes } = loot;
              const attributeStrings = Object.values(attributes);

              return (
                <button
                  key={i}
                  onClick={() => setBag(id)}
                  className={bag === id ? styles.item__selected : undefined}
                >
                  <img
                    src={rarityImageFromItems(attributeStrings)}
                    alt={`Bag #${id}`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Button states */}
      {!address ? (
        <button onClick={() => unlock()}>Authenticate</button>
      ) : loading ? (
        <button disabled>Loading wallet...</button>
      ) : error ? (
        <button disabled>{error}</button>
      ) : !bag ? (
        <button disabled>
          Select bag to {unbundle ? "unbundle" : "reclaim"}
        </button>
      ) : (
        <button onClick={runFunctionWithLoading}>
          {unbundle ? "Unbundle" : "Reclaim"} bag #{bag}
        </button>
      )}
    </div>
  );
}
