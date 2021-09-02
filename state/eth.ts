// Imports
import { ethers } from "ethers"; // Ethers
import Onboard from "bnc-onboard"; // BNC Onboard
import { toast } from "react-toastify"; // Toast notifications
import { createContainer } from "unstated-next"; // Global state provider
import { useState, useMemo, useCallback } from "react"; // Local state management
import { Web3Provider } from "@ethersproject/providers"; // Providers

// Types
import type {
  WalletInitOptions,
  WalletModule,
} from "bnc-onboard/dist/src/interfaces";

// Onboarding wallet providers
const wallets: (WalletModule | WalletInitOptions)[] = [
  { walletName: "metamask" },
  {
    walletName: "walletConnect",
    infuraKey: process.env.NEXT_PUBLIC_INFURA_RPC,
  },
];

function useETH() {
  const [address, setAddress] = useState<string | null>(null); // User address
  const [provider, setProvider] = useState<Web3Provider | null>(null); // Ethers provider

  /**
   * Returns memoized onboard.js provider
   */
  const onboard = useMemo(() => {
    // Onboard provider
    return Onboard({
      // Ethereum network
      networkId: 4,
      // Hide Blocknative branding
      hideBranding: true,
      // Dark mode
      darkMode: true,
      // Setup custom wallets for selection
      walletSelect: {
        heading: "Connect to LootLoose",
        description: "Please select a wallet to authenticate with LootLoose.",
        wallets: wallets,
      },
      // Track subscriptions
      subscriptions: {
        // On address update
        address: async (account: string) => {
          if (account === undefined) {
            setProvider(null);
            setAddress(null);
          } else {
            setAddress(account);
          }
        },
        // On wallet update
        wallet: async (wallet) => {
          // If wallet provider exists
          if (wallet.provider) {
            // Collect ethers provider
            const provider = new ethers.providers.Web3Provider(wallet.provider);

            // Update provider, address, and raw address
            setProvider(provider);
          } else {
            // Nullify data
            setProvider(null);
          }
        },
      },
      // Force wallet checks
      walletCheck: [{ checkName: "connect" }, { checkName: "accounts" }],
    });
  }, []);

  /**
   * Unlock wallet, store ethers provider and address
   */
  const unlock = useCallback(async () => {
    // Select wallet
    await onboard.walletSelect();

    let checkPassed: boolean = false;

    try {
      // Run checks
      checkPassed = await onboard.walletCheck();
    } catch (error) {
      // If checks fail, throw error
      console.error(error);
    }

    if (checkPassed) {
      // If checks pass, show success authentication
      toast.success("Successfully connected!");
    } else {
      // Else, show failure
      toast.error("Error when connecting wallet.");
    }
  }, [onboard]);

  return {
    provider,
    address,
    unlock,
  };
}

// Create unstated-next container
const eth = createContainer(useETH);
export default eth;
