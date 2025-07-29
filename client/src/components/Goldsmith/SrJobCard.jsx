import { useState,useEffect} from "react"
import './SrJobCard.css'
import { FaEye } from "react-icons/fa";
import axios from "axios";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import NewJobCard from "./Newjobcard";
import {TablePagination} from "@mui/material"
import { useParams,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SrJobCard=()=>{
  const navigate=useNavigate()
    const { id, goldsmithname } = useParams();
    const [masterItems,setMasterItems]=useState([])
    const [goldSmith,setGoldSmith]=useState(
        {
            goldSmithInfo:{
              id:"",
              name:"",
              address:"",
              phoneNo:"",
              wastage:"",
              balance:""
           }
        }
       
    )
    const [goldSmithWastage,setGoldSmithWastage]=useState(0)
    const [jobCards,setJobCard]=useState([])
    const [openingBal,setOpeningBal]=useState()
    const [jobCardId,setJobCardId]=useState(null)
    const [jobCardLength,setJobCardLength]=useState(null)
    const [goldRows, setGoldRows] = useState([{ itemName:"",weight: "", touch: 91.7, }]);
    const [itemRows, setItemRows] = useState([{ weight: "", itemName: "" }]);
    const [deductionRows, setDeductionRows] = useState([{ type: "Stone", customType: "", weight: "" }]);
    const [received,setReceived]=useState([])
    const [open,setopen]=useState(false)
    const [edit,setEdit]=useState(false)
    const [jobCardIndex,setJobCardIndex]=useState(0)
    
    const [page, setPage] = useState(0); // 0-indexed for TablePagination
    const [rowsPerPage, setRowsPerPage] = useState(5);
    
    const paginatedData = jobCards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
    
    const roundTo3 = (value) => Number(parseFloat(value).toFixed(3));

   const currentPageTotal = paginatedData.reduce(
    (acc, job) => {
      acc.givenWt += job.jobCardTotal[0].givenWt;
      acc.itemWt += job.jobCardTotal[0].itemWt;
      acc.stoneWt += job.jobCardTotal[0].stoneWt;
      acc.wastage += job.jobCardTotal[0].wastage;
      return acc;
    },
    { givenWt: 0, itemWt: 0, stoneWt: 0, wastage: 0 } // Initial accumulator
  );
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };




    const handleFilterJobCard=(id,jobindex)=>{
             setJobCardId(id)
             setJobCardIndex(jobindex)
            const tempJobCard=[...jobCards]
            const filteredJobcard=tempJobCard.filter((_,index)=>index===jobindex)
            console.log('filter',filteredJobcard)
            setGoldRows(JSON.parse(JSON.stringify(filteredJobcard[0]?.givenGold || [])));
            setItemRows(JSON.parse(JSON.stringify(filteredJobcard[0]?.deliveryItem || [])));
            setDeductionRows(JSON.parse(JSON.stringify(filteredJobcard[0]?.additionalWeight || [])));
            setReceived(JSON.parse(JSON.stringify(filteredJobcard[0]?.goldSmithReceived || [])));
            setGoldSmithWastage(goldSmith.goldSmithInfo.wastage)
           
            let lastBalance=jobindex !=0 ? tempJobCard[jobindex].jobCardTotal[0].openBal: 0
            console.log('lastBalance',lastBalance)
            setOpeningBal(lastBalance)
            setopen(true)
            setEdit(true)

    }
    const handleUpdateJobCard=async(totalGoldWt,totalItemWt,totalDeductionWt,totalWastage,totalBalance,openBal)=>{
      console.log('update')
          
        const payload={
        'goldRows':goldRows,
        'itemRow':itemRows,
        'deductionRows':deductionRows,
        'receivedAmount':received,
        'goldSmithBalance':{
         'id':goldSmith.goldSmithInfo.id,
         'balance':totalBalance
        },
        'total':{
          'id':jobCards[jobCardIndex]?.jobCardTotal[0]?.id,
           'givenWt':roundTo3(totalGoldWt),
           'itemWt':roundTo3(totalItemWt),
           'stoneWt':roundTo3(totalDeductionWt),
           'wastage':roundTo3(totalWastage),
           'balance':roundTo3(totalBalance),
           'openBal':roundTo3(openBal)
        }
       }
       console.log('payload update',payload)
       
      try {
            const response = await axios.put(`${BACKEND_SERVER_URL}/api/job-cards/${goldSmith.goldSmithInfo.id}/${jobCardId}`, payload, {
                    headers: {
                     'Content-Type': 'application/json',
                   },
             });
             if(response.status===400){
                alert(response.data.message)
             }
              console.log('Response:', response.data.jobCards); // success response
              setJobCard( response.data.jobCards)
              setJobCardLength(response.data.jobCardLength) 
                    setGoldSmith(prev => ({
                 ...prev,
                 goldSmithInfo: {
                 ...prev.goldSmithInfo,
                balance: response.data.goldSmithBalance.balance
                }
          }))
              setopen(false)
              setEdit(false)
              setGoldRows([{ itemName:"",weight: "", touch: 91.7}])
              setItemRows([{ weight: "", itemName: "" }])
              setDeductionRows([{ type: "Stone", customType: "", weight: "" }])
              setReceived([])
              toast.success(response.data.message)

       } catch (err) {
                 console.error('POST Error:', err.response?.data || err.message);
                toast.error(err.message || 'An error occurred while creating the job card'); 
             }
       }
    const handleSaveJobCard=async(totalGoldWt,totalItemWt,totalDeductionWt,totalWastage,totalBalance,openBal)=>{
         const payload={
        'goldsmithId': goldSmith.goldSmithInfo.id,   
        'goldRows':goldRows,
        'receivedAmount':received,
        'goldSmithBalance':{
        'id':goldSmith.goldSmithInfo.id,
        'balance':totalBalance
        },
        'total':{
           'givenWt':roundTo3(totalGoldWt),
           'itemWt':roundTo3(totalItemWt),
           'stoneWt':roundTo3(totalDeductionWt),
           'wastage':roundTo3(totalWastage),
           'balance':roundTo3(totalBalance),
           'openBal':roundTo3(openBal)
        }
        
       }
       console.log('payload',payload)
      try {
            const response = await axios.post(`${BACKEND_SERVER_URL}/api/job-cards/`, payload, {
                    headers: {
                     'Content-Type': 'application/json',
                   },
             });
               console.log('Response:', response.data.goldSmithBalance); // success response
               setJobCard( response.data.jobCards)
               setJobCardLength(response.data.jobCardLength) 
               setGoldSmith(prev => ({
                 ...prev,
                 goldSmithInfo: {
                 ...prev.goldSmithInfo,
                balance: response.data.goldSmithBalance.balance
                }
                
          }))
              setGoldRows([{ itemName:"",weight: "", touch: 91.7}])
              setItemRows([{ weight: "", itemName: "" }])
              setDeductionRows([{ type: "Stone", customType: "", weight: "" }])
              setReceived([])
              setopen(false)
               toast.success(response.data.message)
       } catch (err) {
                 console.error('POST Error:', err.response?.data || err.message);
                  toast.error(err.message|| 'An error occurred while creating the job card');
                
             }
        }
    
    useEffect(()=>{
        const fetchJobCards=async()=>{
              try{
                   const res=await axios.get(`${BACKEND_SERVER_URL}/api/job-cards/${id}`)
                   console.log(res.data)
                 const goldSmithRes=res.data.goldsmith
                 const newGoldSmith={
                    goldSmithInfo:{
                        id:goldSmithRes?.id||"",
                        name:goldSmithRes?.name||"",
                        phoneNo:goldSmithRes?.phoneNo ||"",
                        address:goldSmithRes?.address ||"",
                        wastage:goldSmithRes?.wastage ||"",
                        balance:goldSmithRes?.balance[0]?.balance
                     }}
                        console.log('res',res.data.jobCards)
                setGoldSmith(newGoldSmith) 
                setJobCard(res.data.jobCards) 
                console.log('res',res.data.jobCards)
                setJobCardLength(res.data.jobCardLength)      
            }catch(err){
               alert(err.message)
                toast.error("Something went wrong.");
             }
        }
        const fetchMasterItem=async()=>{
           const res=await axios.get(`${BACKEND_SERVER_URL}/api/master-items`)
           setMasterItems(res.data)
        }
       fetchJobCards()
       fetchMasterItem()
       
    },[])
    const handleClosePop=()=>{
              setopen(false)
              setGoldRows([{ itemName:"",weight: "", touch: 91.7}])
              setItemRows([{ weight: "", itemName: "" }])
              setDeductionRows([{ type: "Stone", customType: "", weight: "" }])
              setReceived([])
    }
    const handleOpenJobCard=async()=>{
        setopen(true) 
        setEdit(false) 
        setGoldSmithWastage(goldSmith.goldSmithInfo.wastage)
        try{
                   const res=await axios.get(`${BACKEND_SERVER_URL}/api/job-cards/${id}/lastBalance`)
                  //  setOpeningBal(res.data)
            res.data.status==="nobalance"? setOpeningBal(res.data.balance):setOpeningBal(res.data.balance)

                       
            }catch(err){
                alert(err.message)
                toast.error("Something went wrong.");
             }

    }

     return(
            
            <>
              <div >
                <ToastContainer
                        position="top-right"
                        autoClose={1000}
                        hideProgressBar={true}
                        closeOnClick
                        pauseOnHover={false}
                        draggable={false}
                    />
                    
                  <div className="goldSmith">
                      <div>
                         <h3 className="goldsmithhead">Gold Smith Information</h3>
                         <p><strong>Name:</strong> {goldSmith?.goldSmithInfo?.name}</p>
                         <p><strong>Phone Number:</strong> {goldSmith?.goldSmithInfo?.phoneNo}</p>
                         <p><strong>Address:</strong> {goldSmith?.goldSmithInfo?.address}</p>
                      </div>
                     
                      <div className="addjobcard">
                            <button className="addbtn" onClick={()=>{
                              handleOpenJobCard()
                              }}>Add New JobCard</button>
                      </div>
                  </div>
              {jobCards.length > 0 && jobCards.at(-1)?.jobCardTotal?.length > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <p className="balanceInfo">
                {jobCards.at(-1).jobCardTotal[0].balance >= 0
                 ? `Gold Smith Should Given ${jobCards.at(-1).jobCardTotal[0].balance.toFixed(3)}`
                : `Owner Should Given ${jobCards.at(-1).jobCardTotal[0].balance.toFixed(3)}`}
             </p>
             </div>
              )}

                 <div className="jobcardTable">
              {jobCards.length >= 1 ? (
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
          <th rowSpan={2}>Action</th>
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
        {jobCards.map((job, jobIndex) => {
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
                <td>{(g?.weight).toFixed(3) || "-"}</td>
                 {i === 0 && <td rowSpan={maxRows}>{total?.givenWt || "-"}</td>}
                <td>{g?.touch || "-"}</td>
                <td>{d?.itemName || "-"}</td>
                <td>{d?.weight || "-"}</td>

                {i === 0 && (
                  <>
                    <td rowSpan={maxRows}>{(total?.stoneWt).toFixed(3) ?? "-"}</td>
                    <td rowSpan={maxRows}>{(total?.wastage).toFixed(3) ?? "-"}</td>
                    <td rowSpan={maxRows}>{(total?.balance).toFixed(3) ?? "-"}</td>
                    <td rowSpan={maxRows}>
                      <button style={{color:"white",backgroundColor:"green",fontSize:"18px"}}onClick={()=>handleFilterJobCard(job.id,jobIndex)}>View</button>
                    </td>
                  </>
                )}
              </tr>
            
            );
          });
        })}
         <tr>
          <td colSpan={5}></td>
          <td><strong>Total Given Weight:</strong> {currentPageTotal.givenWt}</td>
          <td colSpan={3}></td>
          <td><strong>Total Item Weight:</strong> {(currentPageTotal.itemWt).toFixed(3)}</td>
          <td><strong>Total Stone Weight:</strong> {(currentPageTotal.stoneWt).toFixed(3)}</td>
          <td><strong>Total Wastage:</strong> {(currentPageTotal.wastage).toFixed(3)}</td>
          <td colSpan={2}></td>
         
        </tr>
        
      </tbody>
    </table>
    
  ) : (
    <span className="noJobCard">No JobCard For this GoldSmith</span>
  )}
       {jobCards.length>=1 && <TablePagination
              component="div"
              count={jobCards.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />}
</div>

                 </div>
             {open && 
        
              <NewJobCard
                name={goldSmith?.goldSmithInfo?.name}
                goldSmithWastage={goldSmithWastage}
                setGoldSmithWastage={setGoldSmithWastage}
                balance={openingBal}
                goldRows={goldRows}
                setGoldRows={setGoldRows}
                itemRows={itemRows}
                setItemRows={setItemRows}
                deductionRows={deductionRows}
                setDeductionRows={setDeductionRows}
                received={received}
                setReceived={setReceived}
                masterItems={masterItems}
                handleSaveJobCard={handleSaveJobCard}
                handleUpdateJobCard={handleUpdateJobCard}
                jobCardLength={jobCardLength}
                jobCardId={jobCardId}
                open={open}
                onclose={()=>handleClosePop()}
                edit={edit}
                ></NewJobCard>
        
                }
            </>      
        )
}
export default SrJobCard