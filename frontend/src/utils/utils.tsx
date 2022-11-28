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

export const validateUint = (numStr: string): string | undefined => {
    const num = +numStr
    if (Number.isNaN(num)) { 
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
        return "Invalid number"
    }
    if (num < 0 || !Number.isInteger(num)) {
        return "Number must be a non-negative integer"
    }
}
export const sleep = async (delay: number) => new Promise((r) => setTimeout(r, delay))

export const shortenHash = (st: string) => {
    return st.slice(0, 4) + "..." + st.slice(st.length - 4)
}