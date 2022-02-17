// import { CosmWasmClient, ExecuteResult } from "secretjs";
// import { StdFee } from "secretjs/types/types";
// import { AsyncSender } from "../asyncSender";
// import { Permit } from "../permit";
//
// export const unlockToken = "Unlock";
//
// export interface Snip20TokenInfo {
//     name: string;
//     symbol: string;
//     decimals: number;
//     total_supply?: string;
// }
//
// export const GetSnip20Params = async (params: {
//     secretjs: CosmWasmClient;
//     address: string;
// }): Promise<Snip20TokenInfo> => {
//     const { secretjs, address } = params;
//
//     try {
//         const paramsResponse = await secretjs.queryContractSmart(address, {
//             token_info: {},
//         });
//
//         return {
//             name: paramsResponse.token_info.name,
//             symbol: paramsResponse.token_info.symbol,
//             decimals: paramsResponse.token_info.decimals,
//             total_supply: paramsResponse.token_info?.total_supply,
//         };
//     } catch (e) {
//         throw Error("Failed to get info");
//     }
// };
//
// export const Snip20GetBalance = async (params: {
//     secretjs: CosmWasmClient;
//     token: string;
//     address: string;
//     auth?: {
//         permit?: Permit;
//         key?: string;
//     };
// }) => {
//     const { secretjs, address, token, auth } = params;
//     let balanceResponse;
//
//     let request;
//     if (auth?.permit) {
//         request = {
//             with_permit: {
//                 query: { balance: { address: address } },
//                 permit: auth.permit,
//             },
//         };
//     } else {
//         request = {
//             balance: {
//                 address: address,
//                 key: auth?.key,
//             },
//         };
//     }
//
//     try {
//         balanceResponse = await secretjs.queryContractSmart(token, request);
//     } catch (e) {
//         console.log(e);
//         return unlockToken;
//     }
//
//     // if (balanceResponse.viewing_key_error) {
//     //     return 'Fix Unlock';
//     // }
//
//     if (Number(balanceResponse.balance.amount) === 0) {
//         return "0";
//     }
//     return balanceResponse.balance.amount;
// };
//
// export const Snip20Send = async (params: {
//     secretjs: AsyncSender;
//     address: string;
//     amount: string;
//     msg: string;
//     recipient: string;
//     fee?: StdFee;
// }): Promise<ExecuteResult> => {
//     const { secretjs, address, amount, msg, recipient, fee } = params;
//
//     return await secretjs.asyncExecute(
//         address,
//         {
//             send: {
//                 amount,
//                 recipient,
//                 msg,
//             },
//         },
//         "",
//         [],
//         fee,
//     );
// };
