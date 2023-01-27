import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useState } from "react";
import { FormControl } from '@mui/material';
export const NewAppBar = () =>{
    const [ showValue, setShowValue] = useState("勝率差");
    const handleChange = (e)=>{
        setShowValue(e.target.value)
    }
    return( 
      <div>
        <h1>Dota2 SynergyNetwork</h1>
        <FormControl>
        <InputLabel id="demo-simple-select-label">Data</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={showValue}
          label="data"
          onChange={handleChange}
        >
            <MenuItem value={"勝率差"}>勝率差</MenuItem>
          <MenuItem value={"使用率"}>使用率</MenuItem>
          <MenuItem value={"勝率差*使用率"}>勝率差*使用率</MenuItem>
        </Select>
        </FormControl>
      </div>
    );
} 
