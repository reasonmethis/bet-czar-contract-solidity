export const initVals = {
    bettor1: "",
    amt1: "",
    bettor2: "",
    amt2: "",
    judge: "",
  };
export type CreateBetFormValsT = typeof initVals;
  
export type CreateBetFormPropsT = {
    onSubmit: (vals: CreateBetFormValsT) => void
}