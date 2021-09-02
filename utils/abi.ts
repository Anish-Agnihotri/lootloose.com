// ERC721 (safeTransferFrom)
export const ERC721 = [
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// ERC1155 + LootLoose
export const ERC1155_LootLoose = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "reassemble",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "accounts", type: "address[]" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    ],
    name: "balanceOfBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ids",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "weapon", type: "uint256" },
          { internalType: "uint256", name: "chest", type: "uint256" },
          { internalType: "uint256", name: "head", type: "uint256" },
          { internalType: "uint256", name: "waist", type: "uint256" },
          { internalType: "uint256", name: "foot", type: "uint256" },
          { internalType: "uint256", name: "hand", type: "uint256" },
          { internalType: "uint256", name: "neck", type: "uint256" },
          { internalType: "uint256", name: "ring", type: "uint256" },
        ],
        internalType: "struct LootTokensMetadata.ItemIds",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];
