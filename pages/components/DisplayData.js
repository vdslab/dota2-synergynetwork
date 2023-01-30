export const DisplayData = (props) =>{
    const nodeState = props.nodeState
    const setNodeState= props.setNodeState
    let displayIcons = []
    nodeState.forEach((element)=>{
        if(element.selected){
            displayIcons.push(element.id)
        }
    })
    console.log(displayIcons)

    return (
        <svg>
            {
                
            }
        </svg>
    );
}