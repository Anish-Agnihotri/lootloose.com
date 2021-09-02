// Imports
import { useState, useEffect } from "react"; // React state
import { request, gql } from "graphql-request"; // GQL requests

// Types
type WalletQuery = {
  // Loot data
  data: Record<string, string>[];
  // Loading status
  loading: boolean;
  // Error state
  error?: string;
  // Reload data function
  collect: Function;
};

// Constants
const SUBGRAPH: string = "https://api.thegraph.com/subgraphs/name/shahruz/loot";

// Collect wallet GQL query
const walletQuery = gql`
  query Wallet($id: String!) {
    wallet(id: $id) {
      bags {
        id
        weapon
        chest
        head
        waist
        foot
        hand
        neck
        ring
      }
    }
  }
`;

/**
 * Hook: useWallet
 * Returns Loot held by a wallet address
 * @param {string} address to check
 * @returns {WalletQuery} results about wallet
 */
export default function useWallet(address: string): WalletQuery {
  const [data, setData] = useState([]); // Loot held
  const [loading, setLoading] = useState(true); // Loading status
  const [error, setError] = useState(""); // Optional error

  const startLoading = () => setLoading(true); // Toggle loading true
  const stopLoading = () => setLoading(false); // Toggle loading false
  const clearError = () => setError(""); // Empty error

  /**
   * Collects data about address from subgraph
   */
  const collect = (): Promise<void> | void => {
    // If no address, error
    if (!address) {
      setData([]);
      return setError("No address provided");
    }

    // If invalid address, error
    if (address.length !== 42) {
      setData([]);
      return setError("Invalid address");
    }

    startLoading(); // Toggle loading

    // Collect wallet details from subgraph
    request(SUBGRAPH, walletQuery, {
      id: address.toLowerCase(),
    })
      .then((data) => {
        // If no bags in wallet, return error
        if (!data.wallet) {
          throw new Error("No bags found at this address.");
        }

        // Else, update bags
        setData(data.wallet.bags);
      })
      .then(stopLoading) // Toggle loading
      .then(clearError) // Clear errors
      .catch((err) => {
        // If error, set error and toggle loading
        setError(err.message);
        stopLoading();
      });
  };

  // Collect on authentication
  useEffect(() => {
    collect();
  }, [address]);

  return { data, loading, error, collect };
}
