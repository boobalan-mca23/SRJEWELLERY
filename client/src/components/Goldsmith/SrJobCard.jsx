import { useState } from "react"
import './SrJobCard.css'
import { FaEye } from "react-icons/fa";
// import JobCardPopup from "../JobCardPopup/JobCardPopup";
import NewJobCard from "./Newjobcard";
const SrJobCard=()=>{

    const [jobCard,setJobCard]=useState([
        {
            "goldSmith":{
                "name":"Boobalan",
                "phoneNumber":9025005699,
                "address":"41/1 Anna nagar kinathukadavu"
            },
        },
        {

          
            "jobcardInfo":[{
                id:1,
                date:"25/06/2025",
                givenweightTotal:100,
                itemwtTotal:100,
                stoneweight:120,
                wastage:100
            },
            {
                id:2,
                date:"28/06/2025",
                givenweightTotal:100,
                itemwtTotal:100,
                stoneweight:120,
                wastage:100
            },
            {
                id:3,
                date:"30/06/2025",
                givenweightTotal:100,
                itemwtTotal:100,
                stoneweight:120,
                wastage:100
            }

        ]
    }  
    ])
    const [open,setopen]=useState(false)
    const [edit,setEdit]=useState(false)
    

     return(
            
            <>
              <div>
                  <div className="goldSmith">
                      <div>
                         <h3 className="goldsmithhead">Gold Smith Information</h3>
                         <p><strong>Name:</strong> {jobCard[0].goldSmith.name}</p>
                         <p><strong>Phone Number:</strong> {jobCard[0].goldSmith.phoneNumber}</p>
                         <p><strong>Address:</strong> {jobCard[0].goldSmith.address}</p>
                      </div>
                      <div className="addjobcard">
                            <button className="addbtn" onClick={()=>{setopen(true) 
                                setEdit(false)}}>Add New JobCard</button>
                      </div>
                  </div>
                  <div className="jobcardTable">
                          <table>
                              <thead>
                                  <tr>
                                  <th>S.no</th>
                                  <th>Date</th>
                                  <th>Given wtTotal</th>
                                  <th>Item wtTotal</th>
                                  <th>Stone wtTotal</th>
                                  <th>wastage</th>
                                  <th>Action</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {
                                  jobCard[1].jobcardInfo.map((item,index)=>(
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{item.date}</td>  
                                            <td>{item.givenweightTotal}</td>
                                            <td>{item.itemwtTotal}</td>
                                            <td>{item.stoneweight}</td>
                                            <td>{item.wastage}</td>
                                            <td>
                                          <button onClick={()=>{
                                                setopen(true)
                                                setEdit(true)}} ><FaEye style={{width:"20px",height:"20px"}}/></button></td>
                                        </tr>
                                    ))
                                  }
                              </tbody>
                          </table>
                  </div>
                 
              </div>
             {open && 
              <NewJobCard
                name={jobCard[0].goldSmith.name}
                open={open}
                onclose={()=>setopen(false)}
                edit={edit}
              ></NewJobCard>}
            </>
            
            
        )
}
export default SrJobCard