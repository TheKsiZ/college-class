import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { ThemeProvider, CircularProgress, Box } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import NaviagtionRoom from "../../components/NavigationRoom";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { IsCodeActive, GetStatistics, RemoveTestCode } from '../../Data/db';

import "../../styles/statistics.css";
import { isNumber } from '@mui/x-data-grid/internals';

const Statistics = () => {
    IsCodeActive();
    RemoveTestCode();    
    
    const { t, i18n } = useTranslation();

    const [users, setUsers] = useState([]);
    const [progress, setProgress] = useState(false);

    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    const LoadRows = async () => {
        const users = await GetStatistics();
        setUsers(users);

        const rows = [];
        const columns = [];
        if(users.length === 0){
            const row = {
                id: 1,
                name: t("empty_stat"),
            }
            rows.push(row);
            setRows(rows);

            const column = {
                field: 'name',
                headerName: t("stat_name"),                
            }
            columns.push(column);
            setColumns(columns);

            setProgress(true); 
            return;
        }
        
        users.map((item, index) => {
            const row = {
                id: index,
                name: item.name,             
            }

            let summary = 0;
            let count = 0;
            users[index].marks.map((item, index) => {
                row[`mark${index}`] = item.value;    
                if(isNumber(item.value)){
                    summary += item.value;
                    count++;                    
                }
                else
                {
                    row[`mark${index}`] = t(item.value);
                }
            });

            row["summary"] = (summary / count).toFixed(2);
            if(isNaN(row["summary"])) row["summary"] = 0;
            rows.push(row);
        })
        setRows(rows);

        
        const headcolumn = {
            field: 'name',
            headerName: t("stat_name"),
            width: 150
        }
        columns.push(headcolumn);

        users[0].marks.map((item, index) => {            
            const column = {
                field: `mark${index}`,
                headerName: `${t(item.type)}${item.index}`,
            }
            columns.push(column);
        })

        const footercolumn = {
            field: 'summary',
            headerName: t("summary"),
            width: 150,
        }
        columns.push(footercolumn);
        setColumns(columns);

        setProgress(true);   
    }    

    useEffect(() => {
        LoadRows();
    }, []);

    return(
            <ThemeProvider theme={Theme}>
                <NaviagtionRoom/>  
            {!progress ? <CircularProgress className="stat-progress" /> : (                
                   <>                    
                    <Box
                        className="stat-div"
                        margin="auto"
                        sx={{borderRadius: 5, mt: 10}}
                    >
                        <DataGrid
                            slots={{ toolbar: GridToolbar }}
                            sx={{borderRadius: 5}}
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 30 } },
                              }}
                            pageSizeOptions={[10, 15, 20, 25, 30, 50, 100]}
                        />                                                 
                    </Box>
                   </>           
            )}
            </ThemeProvider>        
    )
}

export default Statistics;