import contractAddress from "../contracts/contract-address.json";

export const ADDR_LEN = contractAddress.BetCzar.length

export const validateAddr = (addr: string): string | undefined  => {
   if (addr.length != ADDR_LEN) {
    return `Address must have ${ADDR_LEN} characters` 
   }
}

export const validateAmt = (numStr: string): string | undefined => {
    const num = +numStr
    if (Number.isNaN(num)) { 
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
        return "Invalid number"
    }
    if (num < 0) {
        return "Amount cannot be negative"
    }
}
