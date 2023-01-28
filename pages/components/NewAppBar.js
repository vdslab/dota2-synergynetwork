import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useState } from "react";
import { FormControl, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import NorthWestIcon from '@mui/icons-material/NorthWest';
export const NewAppBar = () =>{
    const [ showValue, setShowValue] = useState("勝率差");
    const handleChange = (e)=>{
        setShowValue(e.target.value)
    }
    const hideMenu = () =>{
      
    }
    return( 
        <Box position="fixed" style={{boxShadow:"5px 5px 5px rgba(0,0,0,0.3)", borderRadius:"2px"}}  sx = {{
        width:400,
        height:400,
        margin: 1,
        backgroundColor:"#FFFFFF"
      }}>
          <h1>Dota2 SynergyNetwork</h1>
          <Box sx={{
            margin:1
          }}>
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
          </Box>
          <IconButton position="absolute" size="large" style={{left:340, top:190}} onChange={hideMenu}>
            <NorthWestIcon fontSize="inherit"/>
          </IconButton>
        </Box>
    );
} 
