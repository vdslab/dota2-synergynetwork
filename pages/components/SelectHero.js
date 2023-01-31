import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
export const SelectHero = ({hero, id, displayHero, setDisplayHero, posData}) =>{
    const [ id1, setId] = useState(null)
    return (
        <Box sx={{ width: 200 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{hero}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={id}
          label="Age"
          onChange={()=>{}}
        >
        </Select>
      </FormControl>
    </Box>
    )
}

export default function Home() {
  return (<div></div>)
}