import { useState,useEffect} from "react"
import './SrJobCard.css'
import { FaEye } from "react-icons/fa";
import axios from "axios";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import NewJobCard from "./Newjobcard";
import { useParams } from "react-router-dom";
const SrJobCard=()=>{
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
    const [jobCardId,setJobCardId]=useState(0)
    const [goldRows, setGoldRows] = useState([{ itemName:"",weight: "", touch: 91.7, }]);
    const [open,setopen]=useState(false)
    const [edit,setEdit]=useState(false)


    const handleSaveJobCard=async(total,totalBalance)=>{
        
        const payload={
        'goldsmithId': goldSmith.goldSmithInfo.id,   
        'goldRows':goldRows,
        'goldTotal':total,
        'goldTotalBalance':totalBalance
       }
       console.log('payload',payload)
      try {
            const response = await axios.post(`${BACKEND_SERVER_URL}/api/job-cards/`, payload, {
                    headers: {
                     'Content-Type': 'application/json',
                   },
             });
               console.log('Response:', response.data); // success response
       } catch (err) {
                 console.error('POST Error:', err.response?.data || err.message);
                alert(err.response?.data?.error || 'An error occurred while creating the job card'); 
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
            }catch(err){
               alert(err.message)
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
                        <table>
                              <thead>
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
                                               jobCards[index]?.givenGold.map((item,index)=>(
                                                <tr key={index}>
                                                     <td>{index+1}</td>
                                                    <td>{item?.itemName}</td>
                                                    <td>{item?.weight}</td>
                                                    <td>{item?.touch}</td>
                                                </tr>
                                               ))

                                            }
                                         </tbody>
                                        </table>
                                       </td>
                                        
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
                balance={goldSmith?.goldSmithInfo.balance}
                goldRows={goldRows}
                setGoldRows={setGoldRows}
                masterItems={masterItems}
                handleSaveJobCard={handleSaveJobCard}
                open={open}
                onclose={()=>setopen(false)}
                edit={edit}
              ></NewJobCard>}
            </>
            
            
        )
}
export default SrJobCard