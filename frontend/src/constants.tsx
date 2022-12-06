// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
export const supportedNetworks = [
    /*{
        name: "Sepolia",
        id: "1115511"
    },*/
    {
        name: "Goerli",
        id: "5",
        contractAddress: "0x497ff2D9CC6674b64e1619c87468EFE8692F0353"
    },
    {
        name: "Localhost: 8545",
        id: "1337",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
]

export const DT_POLLING_IN_MS = 20000;
export const DUR_SNACKBAR = 15000;

// This is an error code that indicates that the user canceled a transaction
export const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
export const ERR_ST_TX_REJECTED_BY_USER = "Transaction was rejected by user";