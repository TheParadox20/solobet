import {
    Address,
    ContractFunctionParameters,
    createPublicClient,
    encodePacked,
    http,
    keccak256,
    namehash,
  } from "viem";
  import { baseSepolia, base } from 'wagmi/chains';
  import {L2ResolverAbi} from '@/app/abis/L2ResolverAbi.json';
  
  export type Basename = `${string}.base.eth`;
  
  export const BASENAME_L2_RESOLVER_ADDRESS = "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA";
  
  export enum BasenameTextRecordKeys {
    Description = "description",
    Keywords = "keywords",
    Url = "url",
    Email = "email",
    Phone = "phone",
    Github = "com.github",
    Twitter = "com.twitter",
    Farcaster = "xyz.farcaster",
    Lens = "xyz.lens",
    Telegram = "org.telegram",
    Discord = "com.discord",
    Avatar = "avatar",
  }
  
  export const textRecordsKeysEnabled = [
    BasenameTextRecordKeys.Description,
    BasenameTextRecordKeys.Keywords,
    BasenameTextRecordKeys.Url,
    BasenameTextRecordKeys.Github,
    BasenameTextRecordKeys.Email,
    BasenameTextRecordKeys.Phone,
    BasenameTextRecordKeys.Twitter,
    BasenameTextRecordKeys.Farcaster,
    BasenameTextRecordKeys.Lens,
    BasenameTextRecordKeys.Telegram,
    BasenameTextRecordKeys.Discord,
    BasenameTextRecordKeys.Avatar,
  ];
  
  const baseClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://base-sepolia.infura.io/v3/b915c6cb5ec147919d05ca756a490a6f'),
  });
  
  export async function getBasenameAvatar(basename: Basename) {
    const avatar = await baseClient.getEnsAvatar({
      name: basename,
      universalResolverAddress: BASENAME_L2_RESOLVER_ADDRESS,
    });
  
    return avatar;
  }
  
// export function buildBasenameTextRecordContract(
//   basename: Basename,
//   key: BasenameTextRecordKeys
// ): ContractFunctionParameters {
//   return {
//     abi: L2ResolverAbi,
//     address: BASENAME_L2_RESOLVER_ADDRESS,
//     args: [namehash(basename), key],
//     functionName: "text",
//   };
// }

// // Get a single TextRecord
// export async function getBasenameTextRecord(
//   basename: Basename,
//   key: BasenameTextRecordKeys
// ) {
//   try {
//     const contractParameters = buildBasenameTextRecordContract(basename, key);
//     const textRecord = await baseClient.readContract(contractParameters);
//     return textRecord as string;
//   } catch (error) {}
// }
  
  // // Get a all TextRecords
  // export async function getBasenameTextRecords(basename: Basename) {
  //   try {
  //     const readContracts: ContractFunctionParameters[] =
  //       textRecordsKeysEnabled.map((key) =>
  //         buildBasenameTextRecordContract(basename, key)
  //       );
  //     const textRecords = await baseClient.multicall({
  //       contracts: readContracts,
  //     });
  
  //     return textRecords;
  //   } catch (error) {}
  // }
  
  /**
   * Convert an chainId to a coinType hex for reverse chain resolution
   */
  export const convertChainIdToCoinType = (chainId: number): string => {
    // L1 resolvers to addr
    if (chainId === baseSepolia.id) {
      return "addr";
    }
  
    const cointype = (0x80000000 | chainId) >>> 0;
    return cointype.toString(16).toLocaleUpperCase();
  };
  
  /**
   * Convert an address to a reverse node for ENS resolution
   */
export const convertReverseNodeToBytes = (
  address: Address,
  chainId: number
) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(
    `${chainCoinType.toLocaleUpperCase()}.reverse`
  );
  const addressReverseNode = keccak256(
    encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode])
  );
  return addressReverseNode;
};
  
export async function getBasename([address]) {
  const addressReverseNode = convertReverseNodeToBytes(address, baseSepolia.id);
  console.log(`!!!! ${addressReverseNode} !!!!`);
  return baseClient.readContract({
    abi: L2ResolverAbi,
    address: BASENAME_L2_RESOLVER_ADDRESS,
    functionName: "name",
    args: [addressReverseNode],
  })
}