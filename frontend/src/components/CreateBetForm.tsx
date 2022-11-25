import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Formik, FormikErrors } from "formik";
import { useState } from "react";

import { validateAddr, validateAmt } from "../utils/utils";
import {
  CreateBetFormPropsT,
  CreateBetFormValsT,
  initVals,
} from "./interfaces";
//import * as Yup from 'yup';

const validate = (
  values: CreateBetFormValsT
): FormikErrors<CreateBetFormValsT> => {
  const errors = {} as FormikErrors<CreateBetFormValsT>;

  if (!values.bettor1) {
    errors.bettor1 = "Required";
  } else errors.bettor1 = validateAddr(values.bettor1);
  //need " " to fill the space where the helper string goes, otherwise if there
  //is no error the space will collapse (also, interestingly, specifying "  "
  //still makes the space collapse)

  if (!values.bettor2) {
    errors.bettor2 = "Required";
  } else errors.bettor2 = validateAddr(values.bettor2);

  if (!values.judge) {
    errors.judge = "Required";
  } else errors.judge = validateAddr(values.judge);

  if (!values.amt1) {
    errors.amt1 = "Required";
  } else errors.amt1 = validateAmt(values.amt1);

  if (!values.amt2) {
    errors.amt2 = "Required";
  } else errors.amt2 = validateAmt(values.amt2);

  //now need to remove properties of errors for which there were no errors,
  //otherwise formik won't submit the form (can't leave them even if they are undefined)
  //let o = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
  Object.keys(errors).forEach(
    (k) =>
      !errors[k as keyof typeof errors] &&
      delete errors[k as keyof typeof errors]
  );
  //console.log(errors);
  return errors;
};

export const CreateBetForm = (props: CreateBetFormPropsT) => {
  const [showErrs, setShowErrs] = useState(false);
  /*Seems to work without specifying type.
  Also, is this the right type? 
  See resetForm entry in https://formik.org/docs/api/formik#onsubmit-values-values-formikbag-formikbag--void--promiseany */
  return (
    <Formik<CreateBetFormValsT>
      initialValues={initVals}
      validate={validate}
      onSubmit={(values, actions) => {
        /*setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);*/
        console.log("submitting");
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
                id="bettor1"
                name="bettor1"
                label="Bettor 1"
                sx={{ width: "46ch", maxWidth: "100%" }}
                value={formik.values.bettor1}
                onChange={formik.handleChange}
                error={showErrs && Boolean(formik.errors.bettor1)}
                helperText={
                  /*formik.touched.email*/ showErrs
                    ? formik.errors.bettor1 ?? " "
                    : " "
                }
              />
              <TextField
                id="amt1"
                name="amt1"
                label="Bettor 1's wager"
                sx={{
                  width: "10ch",
                  flexGrow: "1",
                  maxWidth: "46ch",
                }}
                value={formik.values.amt1}
                onChange={formik.handleChange}
                error={showErrs && Boolean(formik.errors.amt1)}
                helperText={
                  /*formik.touched.email*/ showErrs
                    ? formik.errors.amt1 ?? " "
                    : " "
                }
              />
            </Stack>
            <Stack
              direction="row"
              flexWrap="wrap"
              sx={{ gridColumnGap: "8px" }}
            >
              <TextField
                id="bettor2"
                name="bettor2"
                label="Bettor 2"
                sx={{ width: "46ch", maxWidth: "100%" }}
                value={formik.values.bettor2}
                onChange={formik.handleChange}
                error={showErrs && Boolean(formik.errors.bettor2)}
                helperText={
                  /*formik.touched.email*/ showErrs
                    ? formik.errors.bettor2 ?? " "
                    : " "
                }
              />
              <TextField
                id="amt2"
                name="amt2"
                label="Bettor 2's wager"
                sx={{
                  width: "10ch",
                  flexGrow: "1",
                  maxWidth: "46ch",
                }}
                value={formik.values.amt2}
                onChange={formik.handleChange}
                error={showErrs && Boolean(formik.errors.amt2)}
                helperText={
                  /*formik.touched.email*/ showErrs
                    ? formik.errors.amt2 ?? " "
                    : " "
                }
              />
            </Stack>
            <Stack
              direction="row"
              flexWrap="wrap"
              sx={{ gridColumnGap: "8px" }}
            >
              <TextField
                id="judge"
                name="judge"
                label="Judge"
                sx={{ width: "46ch", maxWidth: "100%" }}
                value={formik.values.judge}
                onChange={formik.handleChange}
                error={showErrs && Boolean(formik.errors.judge)}
                helperText={
                  /*formik.touched.email*/ showErrs
                    ? formik.errors.judge ?? " "
                    : " "
                }
              />
            </Stack>
            <Stack direction="row" justifyContent="left">
              <Button variant="contained" type="submit">
                Create bet
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Formik>
  );
};
