// Imports
import { eth } from "@state/index"; // Eth state container
import { toast } from "react-toastify"; // Toast notifications
import { createContainer } from "unstated-next"; // State management
import { Contract } from "@ethersproject/contracts"; // Ethers
import { ERC721, ERC1155_LootLoose } from "@utils/abi"; // ABIs

// Types
import type { BigNumber } from "@ethersproject/bignumber"; // BigNumber

// Constants
const LootAddress: string =
  process.env.NEXT_PUBLIC_LOOT_ADDRESS ??
  "0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7";
const BundlerAddress: string =
  process.env.NEXT_PUBLIC_BUNDLER_ADDRESS ??
  "0x5b03597e82ca9115f05bebae4bf8fae823ca5d9c";

function useLoot() {
  // Collect auth provider and user address
  const { provider, address, setAddress } = eth.useContainer();

  /**
   * Generates loot + bundler contract definitions
   * @returns {Record<{ loot: Contract, bundler: Contract}>} contract definitions
   */
  function collectContracts(): { loot: Contract; bundler: Contract } {
    return {
      // ERC721 Loot Contract
      loot: new Contract(LootAddress, ERC721, provider?.getSigner()),
      // ERC1155 + Mintable Bundler Contract
      bundler: new Contract(
        BundlerAddress,
        ERC1155_LootLoose,
        provider?.getSigner()
      ),
    };
  }

  /**
   * Simple work-around to refreshing all item
   * views by triggering address refresh
   */
  function reloadItems(): void {
    const tempAddr = address;
    setAddress(null);
    setAddress(tempAddr);
  }

  /**
   * Enables unbundling loot by sending Loot ERC721 NFT to contract
   * Loot must be owned by user to unbundle
   * @param {string} id of loot to unbundle
   */
  async function unbundleLoot(id: string): Promise<void> {
    // Collect loot contrat
    const { loot }: { loot: Contract } = collectContracts();

    try {
      // Collect user address
      if (!address) {
        throw new Error("User not authenticated.");
      }

      // Transfer id (quantity: 1) from user to Bundler contract
      const tx = await loot["safeTransferFrom(address,address,uint256)"](
        address,
        BundlerAddress,
        id
      );
      await tx.wait(1);
      // Reload item view
      reloadItems();
      // Toast success
      toast.success(`Successfully unbundled loot bag #${id}`);
    } catch (e) {
      // Else, toast and log error
      console.error(e);
      toast.error(`Error when unbundling loot bag #${id}`);
    }
  }

  /**
   * Enables rebundling individual Loose items to original Loot bag
   * Requires ownership of all 8 parameters for bag
   * @param {string} id of loot bag to rebundle
   */
  async function rebundleLoot(id: string): Promise<void> {
    // Collect bundler contract
    const { bundler }: { bundler: Contract } = collectContracts();

    try {
      // Collect user address
      if (!address) {
        throw new Error("User not authenticated.");
      }

      // Collect loot required items
      const components: BigNumber[] = (await bundler.ids(id)).slice(0, 8);
      // Check if user has all 8 required components
      const balances: BigNumber[] = await bundler.balanceOfBatch(
        // User (8-filled indices of address)
        new Array(8).fill(address),
        // Required components to check
        components
      );
      // Verify that balance of each required component
      const redeemable = balances.every(
        // is greater than 0
        (item: BigNumber) => item.toNumber() > 0
      );
      if (!redeemable) {
        toast.error("Insufficient items to reclaim bundle.");
        throw new Error("Insufficient items to reclaim bundle.");
      }

      // Check if bundler is approved
      const alreadyApproved: boolean = await bundler.isApprovedForAll(
        address,
        BundlerAddress
      );
      if (!alreadyApproved) {
        // Approve bundler to spend LootLoose
        const approve = await bundler.setApprovalForAll(BundlerAddress, true);
        await approve.wait(1);
      }

      // Reassemble loot bag from bundler
      const tx = await bundler.reassemble(id);
      await tx.wait(1);
      // Reload item view
      reloadItems();
      // Toast success
      toast.success(`Successfully reclaimed bag #${id}`);
    } catch (e) {
      // Else, log error and toast failure
      console.error(e);
      toast.error(`Error when bundling loot bag #${id}.`);
    }
  }

  return {
    unbundleLoot,
    rebundleLoot,
  };
}

// Create unstated-next container
const loot = createContainer(useLoot);
export default loot;
