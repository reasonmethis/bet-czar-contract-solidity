import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function NewBetForm() {
  const [name, setName] = useState('Cat in the Hat');

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="bettor-1"
        label="Bettor 1"
      />
      <TextField
        id="amt-1"
        label="Bettor 1 amount"
      />
      <TextField
        id="bettor-2"
        label="Bettor 2"
      />
      <TextField
        id="amt-2"
        label="Bettor 2 amount"
      />
      <TextField
        id="judge"
        label="Judge"
      />
      <Button variant='contained' onClick={()=>{}}>Create bet</Button>
    </Box>
  );
}
