
import { useEffect, useState } from "react"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Autocomplete,Button,TextField} from '@mui/material';
import { BACKEND_SERVER_URL } from "../../Config/Config";
import axios from "axios";
import './SrReport.css'
 
const JobCardReport=()=>{
    const [fromDate,setFromDate]=useState(null)
    const [toDate,setToDate]=useState(null)
    const [jobCard,setJobCard]=useState([])
    const [goldSmith,setGoldSmith]=useState([])
    const [selectedGoldSmith,setSelectedGoldSmith]=useState({ id: null, name: "ALL" })
    const[jobCardTotal,setJobCardTotal]=useState({})

  const handleTotalCalculation = (jobcard) => {
      console.log('total',jobcard)

      const totalObj = jobcard.reduce(
    (acc, job) => {
      acc.givenWt += job.jobCardTotal[0].givenWt;
      acc.itemWt += job.jobCardTotal[0].itemWt;
      acc.stoneWt += job.jobCardTotal[0].stoneWt;
      acc.wastage += job.jobCardTotal[0].wastage;
      return acc;
    },
    { givenWt: 0, itemWt: 0, stoneWt: 0, wastage: 0 } // Initial accumulator
  );

     console.log('total',totalObj)
     setJobCardTotal(totalObj);
};
  const handleDateClear=()=>{
      setFromDate(null)
      setToDate(null)
    }

  const handleGoldSmith = (newValue) => {
     if (newValue && newValue.id === null) {
        setSelectedGoldSmith({ id: null, name: "ALL" });  // Keep "ALL" as the value
    } else {
       setSelectedGoldSmith(newValue);
  }
 
  const fetchJobCards = async () => {
        try {
      const from = fromDate ? fromDate.format("YYYY-MM-DD") : "";
      const to = toDate ? toDate.format("YYYY-MM-DD") : "";

      const response = await axios.get(
        `${BACKEND_SERVER_URL}/api/job-cards/${newValue.id}/goldsmithCard`,
        {
          params: {
            fromDate: from,
            toDate: to,
          },
        }
      );

      console.log("data", response.data);
      setJobCard(response.data);
      handleTotalCalculation(response.data||[])
    } catch (error) {
      console.error("Error fetching goldsmith data:", error);
    }
  

    };
         fetchJobCards()

};


    useEffect(()=>{
     const fetchGoldsmiths = async () => {
           try {
             const response = await fetch(`${BACKEND_SERVER_URL}/api/goldsmith`);
             const data = await response.json();
             console.log('data',data)
                const allOption = { id: null, name: "ALL" };
             setGoldSmith([allOption, ...data]);
  
           } catch (error) {
             console.error("Error fetching goldsmith data:", error);
           }
         };
         fetchGoldsmiths()
    },[])
    return(
     <>
     <div>
            <h3 className="reportHead">Job Card Report</h3>
      </div>
       <div className="report">
        
      <LocalizationProvider dateAdapter={AdapterDayjs}>
             <DemoContainer components={['DatePicker']}>
                <DatePicker value={fromDate} label="From Date" onChange={(newValue)=>setFromDate(newValue)}/>
             </DemoContainer>
             
      </LocalizationProvider>
     <LocalizationProvider dateAdapter={AdapterDayjs}>
             <DemoContainer components={['DatePicker']}>
                <DatePicker value={toDate} label="To Date" onChange={(newValue)=>setToDate(newValue)}/>
             </DemoContainer>
      </LocalizationProvider>
               <Autocomplete
               disablePortal
               options={goldSmith}
               getOptionLabel={(option) => option.name || ""}
               sx={{ width: 300 }}
               value={selectedGoldSmith}
               onChange={(event, newValue) => handleGoldSmith(newValue)}
               renderInput={(params) => (
               <TextField {...params} label="Select GoldSmith" />
           )}
        />

        <Button className="clrBtn" onClick={handleDateClear}>Clear</Button>
        </div>


         <div className="jobcardTable">
                        {jobCard.length >= 1 ? (
              <table>
                <thead className="jobCardHead">
                  <tr>
                    <th rowSpan={2}>S.No</th>
                    <th rowSpan={2}>Date</th>
                    <th rowSpan={2}>JobCard Id</th>
                    <th colSpan={5}>Given Wt</th>
                    <th colSpan={2}>Item Wt</th>
                    <th rowSpan={2}>Stone Wt</th>
                    <th rowSpan={2}>After Wastage</th>
                    <th rowSpan={2}>Balance</th>
                    {/* <th rowSpan={2}>Action</th> */}
                  </tr>
                  <tr>
                    <th>Item Date</th>
                    <th>Name</th>
                    <th>Weight</th>
                    <th>GivenTotal</th>
                    <th>Touch</th>
                    <th>Name</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {jobCard.map((job, jobIndex) => {
                    const given = job.givenGold;
                    const delivery = job.deliveryItem;
                    const maxRows = Math.max(given.length, delivery.length) || 1;
          
                    return [...Array(maxRows)].map((_, i) => {
                      const g = given[i];
                      const d = delivery[i];
                      const total = job.jobCardTotal?.[0];
          
                      return (
                        <tr key={`${job.id}-${i}`}>
                          {i === 0 && (
                            <>
                              <td rowSpan={maxRows}>{jobIndex + 1}</td>
                              <td rowSpan={maxRows}>
                                {new Date(job.createdAt).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td rowSpan={maxRows}>{job.id}</td>
                            </>
                          )}
                         
                          <td>{g?.createdAt? new Date(g?.createdAt).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }):"-"}</td>
                          <td>{g?.itemName || "-"}</td>
                          <td>{g?.weight || "-"}</td>
                         {i === 0 && <td rowSpan={maxRows}>{total?.givenWt || "-"}</td>}
                          <td>{g?.touch || "-"}</td>
                          <td>{d?.itemName || "-"}</td>
                          <td>{d?.weight || "-"}</td>
          
                          {i === 0 && (
                            <>
                              <td rowSpan={maxRows}>{(total?.stoneWt).toFixed(3) ?? "-"}</td>
                              <td rowSpan={maxRows}>{(total?.wastage).toFixed(3) ?? "-"}</td>
                              <td rowSpan={maxRows}>{(total?.balance).toFixed(3) ?? "-"}</td>
                             
                            </>
                          )}
                        </tr>
                      
                      );
                    });
                  })}
                   <tr>
                    <td colSpan={5}></td>
                    <td><strong>Total Given Weight:</strong> {jobCardTotal.givenWt}</td>
                    <td colSpan={2}></td>
                    <td><strong>Total Item Weight:</strong> {(jobCardTotal.itemWt).toFixed(3)}</td>
                    <td><strong>Total Stone Weight:</strong> {(jobCardTotal.stoneWt).toFixed(3)}</td>
                    <td><strong>Total Wastage:</strong> {(jobCardTotal.wastage).toFixed(3)}</td>
                    <td colSpan={2}></td>
                   
                  </tr>
                </tbody>
              </table>
            ) : (
              <span style={{display:"block",textAlign:"center"}}>No JobCard For this GoldSmith</span>
            )}
          </div>
          
     </>

   )
}

export default JobCardReport