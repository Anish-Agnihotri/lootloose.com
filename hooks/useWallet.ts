// Imports
import { ethers } from "ethers"; // ethers
import { ERC721 } from "@utils/abi"; // ABI
import { useState, useEffect } from "react"; // React state

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

// Setup Rinkeby RPC provider
const rpc = new ethers.providers.JsonRpcProvider(
  `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_RPC}`
);

// Setup Loot contract via RPC
const loot = new ethers.Contract(
  process.env.NEXT_PUBLIC_LOOT_ADDRESS ?? "",
  ERC721,
  rpc
);

/**
 * Collects wallets Loot via RPC call
 * @param {string} address to collect
 * @returns {Promise<Record<string, string>[]>} loot bags
 */
async function collectWallets(
  address: string
): Promise<Record<string, string>[]> {
  // Collect total number of bags owned by address
  const numTokens: number = (await loot.balanceOf(address)).toNumber();

  // Collect tokens owned by address
  let tokenIds: number[] = [];
  for (let i = 0; i < numTokens - 1; i++) {
    // Collect by numTokens increment
    const tokenIndex = (await loot.tokenOfOwnerByIndex(address, i)).toNumber();
    tokenIds.push(tokenIndex);
  }

  // Collect token attributes
  let tokens: Record<string, string>[] = [];
  for (let i = 0; i < tokenIds.length; i++) {
    const [chest, foot, hand, head, neck, ring, waist, weapon] =
      await Promise.all([
        loot.getChest(tokenIds[i]),
        loot.getFoot(tokenIds[i]),
        loot.getHand(tokenIds[i]),
        loot.getHead(tokenIds[i]),
        loot.getNeck(tokenIds[i]),
        loot.getRing(tokenIds[i]),
        loot.getWaist(tokenIds[i]),
        loot.getWeapon(tokenIds[i]),
      ]);
    tokens.push({
      chest,
      foot,
      hand,
      head,
      neck,
      ring,
      waist,
      weapon,
      id: tokenIds[i].toString(),
    });
  }

  return tokens;
}

/**
 * Hook: useWallet
 * Returns Loot held by a wallet address
 * @param {string} address to check
 * @returns {WalletQuery} results about wallet
 */
export default function useWallet(address: string): WalletQuery {
  const [data, setData] = useState<Record<string, string>[]>([]); // Loot held
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
    collectWallets(address.toLowerCase())
      .then((data) => {
        setData(data);
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
