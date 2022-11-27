import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Formik, FormikErrors } from "formik";
import { useState } from "react";

import { validateUint } from "../utils/utils";
import {
  SelectBetFormInitVals,
  SelectBetFormPropsT,
  SelectBetFormValsT,
} from "./interfaces";
//import * as Yup from 'yup';

const validate = (values: SelectBetFormValsT): FormikErrors<SelectBetFormValsT> => {
  const errors = {} as FormikErrors<SelectBetFormValsT>;

  if (!values.betId) {
    errors.betId = "Required";
  } else errors.betId = validateUint(values.betId);

  //now need to remove properties of errors for which there were no errors,
  //otherwise formik won't submit the form (can't leave them even if they are undefined)
  //let o = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
  Object.keys(errors).forEach(
    (k) =>
      !errors[k as keyof typeof errors] &&
      delete errors[k as keyof typeof errors]
  );
  return errors;
};

export const SelectBetForm = (props: SelectBetFormPropsT) => {
  const [showErrs, setShowErrs] = useState(false);
  return (
    <Formik<SelectBetFormValsT>
      initialValues={SelectBetFormInitVals}
      validate={validate}
      onSubmit={(values, actions) => {
        props.onSubmit(values);
        actions.setSubmitting(false);
        //actions.resetForm() //https://formik.org/docs/api/formik#resetform-nextstate-partialformikstatevalues--void
      }}
    >
      {(
        formik //formik obj is the same as would be returned by useFormik
      ) => (
        <form
          onSubmit={(e) => {
            setShowErrs(true);
            formik.handleSubmit(e);
          }}
        >
          <Stack gap="0px">
            <Stack
              direction="row"
              flexWrap="wrap"
              sx={{ gridColumnGap: "8px" }}
            >
              <TextField
                id="betId"
                name="betId" //name must match field name (as in formik.errors.betId
                label="Bet Id"
                //have to target a subcomponent to set the width of the input box,
                //because if I set the overall width instead then error messages 
                //won't fit in one line
                sx={{  maxWidth: "100%", "& .MuiInputBase-root": {maxWidth:"10ch"}}}
                value={formik.values.betId}
                onChange={formik.handleChange}
                error={showErrs && Boolean(formik.errors.betId)}
                helperText={
                  /*formik.touched.email*/ showErrs
                    ? formik.errors.betId ?? " "
                    : " "
                }
              />
            </Stack>

            <Stack direction="row" justifyContent="left">
              <Button
                variant="outlined"
                type="submit"
                disabled={props.isDisabled}
              >
                Select
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Formik>
  );
};
