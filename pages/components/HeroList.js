import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
export const HeroList = ({posData}) =>{
    const imageSize=5;
    return(
    <Box sx={{width:400, height:400}}>
        <Grid container spacing={2}>
            {
                posData.map((element)=>{
                    return(
                        <img
                src={element.image}
                height={imageSize * 9}
                width={imageSize * 16}
                alt=""
                // style={trimmingIcon(data.image, index, imageSize)}
              />
                    )
                })
            }
        </Grid>
    </Box>

    )
}