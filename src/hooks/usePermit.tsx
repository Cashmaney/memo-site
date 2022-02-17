import { getFromLS, setToLS } from "../utils/storage";
// import { Permit } from "./scrt/permit";
//
// // import { TokenID } from "../utils/nft";
//
// export class PermitManager {
//     readonly permits: object;
//
//     constructor() {
//         this.permits = {};
//     }
//
//     storagePermitName = (name: string, account: string) => {
//         return `query_permit_${account}_${name}`;
//     };
//
//     has = (permitName: string, account: string) => {
//         const accPermitName = this.storagePermitName(permitName, account);
//         const permitFromLs = getFromLS(accPermitName);
//         console.log(`permitManager has: ${permitFromLs}`);
//         return !!permitFromLs;
//     };
//
//     get = (permitName: string, account: string): Permit | undefined => {
//         const accPermitName = this.storagePermitName(permitName, account);
//         console.log(`permitManager get reading permit ${accPermitName}`);
//
//         const permit = this.permits[accPermitName];
//         if (permit) {
//             console.log(`permitManager get: ${permit}`);
//             return permit;
//         }
//         const permitFromLs = getFromLS(accPermitName);
//         if (permitFromLs) {
//             this.permits[accPermitName] = permit;
//             console.log(`setting permit`);
//             console.log(`permitManager set: ${permitFromLs}`);
//             return JSON.parse(permitFromLs);
//         }
//         console.log(`permitManager set as undefined: ${permitName}`);
//         return undefined;
//     };
//
//     set = (permitName: string, account: string, value: Permit) => {
//         const accPermitName = this.storagePermitName(permitName, account);
//         console.log(`permitManager set setting permit ${accPermitName}`);
//
//         setToLS(accPermitName, JSON.stringify(value));
//         return (this.permits[accPermitName] = value);
//     };
//
//     delete = (permitName: string, account: string) => {
//         const accPermitName = this.storagePermitName(permitName, account);
//         console.log(`permitManager del deleting permit ${accPermitName}`);
//
//         setToLS(accPermitName, "");
//         delete this.permits[accPermitName];
//     };
// }
//
// const usePermits = (initialState = false) => {
//     return {
//         getAddressFromPermit(permitName: string) {
//             const permit = PermitManager.get(permitName);
//
//             if (!permit) {
//                 return undefined;
//             }
//
//             permit.signature.pub_key;
//         },
//     };
// };
