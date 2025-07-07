import { useState,useEffect} from "react"
import './SrJobCard.css'
import { FaEye } from "react-icons/fa";
import axios from "axios";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import NewJobCard from "./Newjobcard";
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
    const [jobCards,setJobCard]=useState([])
    const [jobCardId,setJobCardId]=useState(null)
    const [jobCardLength,setJobCardLength]=useState(null)
    const [goldRows, setGoldRows] = useState([{ itemName:"",weight: "", touch: 91.7, }]);
    const [itemRows, setItemRows] = useState([{ weight: "", itemName: "" }]);
    const [deductionRows, setDeductionRows] = useState([{ type: "Stone", customType: "", weight: "" }]);
    const [open,setopen]=useState(false)
    const [edit,setEdit]=useState(false)
    
    const handleFilterJobCard=(id,jobCardindex)=>{
             setJobCardId(id)
             const tempJobCard=[...jobCards]
             const filteredJobcard=tempJobCard.filter((_,index)=>index===jobCardindex)
             console.log('filter',filteredJobcard)
            setGoldRows(filteredJobcard[0].givenGold)
            setItemRows(filteredJobcard[0].deliveryItem)
            setDeductionRows(filteredJobcard[0].additionalWeight)
            setopen(true)
            setEdit(true)

    }
    const handleUpdateJobCard=async(totalGoldWt,totalItemWt,totalDeductionWt,totalWastage,totalBalance)=>{
      console.log('update')
          
        const payload={
        'goldRows':goldRows,
        'itemRow':itemRows,
        'deductionRows':deductionRows,
        'total':{
          'id':jobCards[0]?.jobCardTotal[0]?.id,
          'givenWt':totalGoldWt,
          'itemWt':totalItemWt,
          'stoneWt':totalDeductionWt,
          'wastage':totalWastage,
          'balance':totalBalance
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
              setopen(false)
              setEdit(false)
              toast.success(response.data.message)

       } catch (err) {
                 console.error('POST Error:', err.response?.data || err.message);
                alert(err.response?.data?.error || 'An error occurred while creating the job card'); 
             }
       }
    const handleSaveJobCard=async(totalGoldWt,totalItemWt,totalDeductionWt,totalWastage,totalBalance)=>{
         const payload={
        'goldsmithId': goldSmith.goldSmithInfo.id,   
        'goldRows':goldRows,
        'total':{
           'givenWt':totalGoldWt,
           'itemWt':totalItemWt,
           'stoneWt':totalDeductionWt,
           'wastage':totalWastage,
           'balance':totalBalance
        }
        
       }
       console.log('payload',payload)
      try {
            const response = await axios.post(`${BACKEND_SERVER_URL}/api/job-cards/`, payload, {
                    headers: {
                     'Content-Type': 'application/json',
                   },
             });
               console.log('Response:', response.data.jobCards); // success response
               setJobCard( response.data.jobCards)
               setJobCardLength(response.data.jobCardLength) 
               setopen(false)
               toast.success(response.data.message)
       } catch (err) {
                 console.error('POST Error:', err.response?.data || err.message);
                  toast.error(err.response?.data?.error || 'An error occurred while creating the job card');
                
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
                setGoldSmith(newGoldSmith) 
                setJobCard(res.data.jobCards) 
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

     return(
            
            <>
              <div>
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
                            <button className="addbtn" onClick={()=>{setopen(true) 
                                setEdit(false)}}>Add New JobCard</button>
                      </div>
                  </div>
                   <div className="jobcardTable">
                          {jobCards.length>=1?(
                        <table >
                              <thead className="jobCardHead">
                                  <tr>
                                  <th>S.no</th>
                                  <th>Givenwt</th>
                                  <th>Itemwt</th>
                                  <th>Stonewt</th>
                                  <th>Action</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {jobCards.map((item,index)=>(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td> 
                                        {jobCards[index]?.givenGold.length>=1 ? (
                                          <table>
                                            <thead>
                                                <tr>
                                                <th>S.no</th>
                                                <th>itemName</th>
                                                <th>weight</th>
                                                <th>touch</th>
                                               </tr>
                                         </thead>
                                         <tbody>
                                            {
                                               jobCards[index]?.givenGold.map((item,indexGold)=>(
                                                <tr key={indexGold}>
                                                     <td>{index+1}</td>
                                                    <td>{item?.itemName}</td>
                                                    <td>{item?.weight}</td>
                                                    <td>{item?.touch}</td>
                                                </tr>
                                               ))

                                            }
                                         </tbody>
                                        </table>):<span>No Given Gold</span>}
                                       </td>
                                        <td> 
                                        {jobCards[index]?.deliveryItem.length>=1 ? (
                                          <table>
                                            <thead>
                                                <tr>
                                                <th>S.no</th>
                                                <th>itemName</th>
                                                <th>weight</th>
                                               
                                               </tr>
                                         </thead>
                                         <tbody>
                                            {jobCards[index]?.deliveryItem.map((item,indexItem)=>(
                                                <tr key={indexItem}>
                                                    <td>{index+1}</td>
                                                    <td>{item?.itemName}</td>
                                                    <td>{item?.weight}</td>
                                                    
                                                </tr>
                                               ))

                                            }
                                         </tbody>
                                        </table>):<span>No delivery Item</span>}
                                       </td>
                                        <td> 
                                        {jobCards[index]?.additionalWeight.length>=1 ? (
                                          <table>
                                            <thead>
                                                <tr>
                                                <th>S.no</th>
                                                <th>itemName</th>
                                                <th>weight</th>
                                                
                                               </tr>
                                         </thead>
                                         <tbody>
                                            {
                                               jobCards[index]?.additionalWeight.map((item,indexadditional)=>(
                                                <tr key={indexadditional}>
                                                     <td>{index+1}</td>
                                                    <td>{item?.type}</td>
                                                    <td>{item?.weight}</td>
                                                    </tr>
                                               ))

                                            }
                                         </tbody>
                                        </table>):<span>No Stone weight </span>}
                                       </td>
                                       <td><FaEye className="eyeIcon" onClick={()=>handleFilterJobCard(item.id,index)}/></td>
                                        
                                    </tr>
                                  ))}
                              </tbody>
                          </table>):<span>No JobCard For this GoldSmith</span>}
                  </div> 
                 
              </div>
             {open && 
              <NewJobCard
                name={goldSmith?.goldSmithInfo?.name}
                goldSmithWastage={goldSmith?.goldSmithInfo.wastage}
                goldSmith={goldSmith}
                setGoldSmith={setGoldSmith}
                balance={goldSmith?.goldSmithInfo.balance}
                goldRows={goldRows}
                setGoldRows={setGoldRows}
                itemRows={itemRows}
                setItemRows={setItemRows}
                deductionRows={deductionRows}
                setDeductionRows={setDeductionRows}
                masterItems={masterItems}
                handleSaveJobCard={handleSaveJobCard}
                handleUpdateJobCard={handleUpdateJobCard}
                jobCardLength={jobCardLength}
                jobCardId={jobCardId}
                open={open}
                onclose={()=>setopen(false)}
                edit={edit}
              ></NewJobCard>}
            </>
            
            
        )
}
export default SrJobCard