import { DepositPropsT } from "./interfaces";
import { SelectBetForm } from "./SelectBetForm";
import { fetchBetInfo } from "./operations";

export const Deposit = (props: DepositPropsT) => {
  return (
    <>
      <SelectBetForm isDisabled={false} onSubmit={(vals) => {
        fetchBetInfo(+vals.betId, props.state.provider!)
      }} />
    </>
  );
};
