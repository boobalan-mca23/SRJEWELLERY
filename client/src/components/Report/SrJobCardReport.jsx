
import { useEffect, useState } from "react"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Autocomplete,TextField} from '@mui/material';
import { BACKEND_SERVER_URL } from "../../Config/Config";

const JobCardReport=()=>{
    const [fromDate,setFromDate]=useState(null)
    const [toDate,setToDate]=useState(null)
    const [jobCard,setJobCard]=useState([])
    const [goldSmith,setGoldSmith]=useState([])
    const [selectedGoldSmith,setSelectedGoldSmith]=useState(null)

    const handleGoldSmith=(newValue)=>{
      console.log('newValue',newValue.id)
console.log(fromDate.format('DD-MM-YYYY'));
console.log(toDate.format('DD-MM-YYYY'));
       setSelectedGoldSmith(newValue)
    }
    useEffect(()=>{
     const fetchGoldsmiths = async () => {
           try {
             const response = await fetch(`${BACKEND_SERVER_URL}/api/goldsmith`);
             const data = await response.json();
             console.log('data',data)
             setGoldSmith(data);
           } catch (error) {
             console.error("Error fetching goldsmith data:", error);
           }
         };
         fetchGoldsmiths()
    },[])
    return(
     <>
       <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
             <DemoContainer components={['DatePicker']}>
                <DatePicker label="From Date" onChange={(newValue)=>setFromDate(newValue)}/>
             </DemoContainer>
             
      </LocalizationProvider>
     <LocalizationProvider dateAdapter={AdapterDayjs}>
             <DemoContainer components={['DatePicker']}>
                <DatePicker label="To Date" onChange={(newValue)=>setToDate(newValue)}/>
             </DemoContainer>
      </LocalizationProvider>
               <Autocomplete
                 disablePortal
                 options={goldSmith}
                 getOptionLabel={(option) => option.name}  // Show the name in dropdown
                 sx={{ width: 300 }}
                 value={selectedGoldSmith}
                 onChange={(event, newValue) =>handleGoldSmith(newValue)}
                 renderInput={(params) => (
                 <TextField {...params} label="Select GoldSmith" />
             )}
            />

       </div>
     </>

   )
}

export default JobCardReport