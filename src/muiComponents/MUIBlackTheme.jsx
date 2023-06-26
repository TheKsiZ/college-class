import { createTheme } from "@mui/material"

const MUIBlackTheme = createTheme({
    typography:{
        fontFamily:[
            'Nunito',
            'sans-serif',
        ].join(','),
    },
    palette:{
        primary:{
            main: '#000000',
        },
    }
})

export default MUIBlackTheme;