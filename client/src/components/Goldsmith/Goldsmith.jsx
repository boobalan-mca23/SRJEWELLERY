
import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete
  
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Goldsmith.css";
import { Link } from "react-router-dom";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import axios from "axios";
import NewJobCard from "./Newjobcard";

const Goldsmith = () => {
  const [goldsmith, setGoldsmith] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedGoldsmith, setSelectedGoldsmith] = useState(null);
  const [goldRows,setGoldRows]=useState([])
  const [itemRows,setItemRows]=useState([])
  const [deductionRows,setDeductionRows]=useState([])
  const [received,setReceived]=useState([])
  const [open,setOpen]=useState(false)
  const [edit,setEdit]=useState(false)
  const [jobCardError,setJobCardError]=useState({})
  const [jobCardId,setJobCardId]=useState(null)
  const [jobCardTotal,setJobCardTotal]=useState([])
  const [jobCardBalance,setJobCardBalance]=useState(0)
  const [selectedName,setSelectedName]=useState({})
  const [masterItems,setMasterItems]=useState([])
  const [noJobCard,setNoJobCard]=useState({})
  const [formData, setFormData] = useState({ 
    name: "",
    phone: "",
    address: "",
    wastage:""
  });

  useEffect(() => {
    const fetchGoldsmiths = async () => {
      try {
        const response = await fetch(`${BACKEND_SERVER_URL}/api/goldsmith`);
        const data = await response.json();
        setGoldsmith(data);
      } catch (error) {
        console.error("Error fetching goldsmith data:", error);
      }
    };
    const fetchMasterItem=async()=>{
               const res=await axios.get(`${BACKEND_SERVER_URL}/api/master-items`)
               console.log('res',res.data)
               setMasterItems(res.data)
      }

    fetchGoldsmiths();
    fetchMasterItem()
  }, []);

  const handleEditClick = (goldsmith) => {
    setSelectedGoldsmith(goldsmith);
    setFormData({
      name: goldsmith.name,
      phone: goldsmith.phone,
      address: goldsmith.address,
      wastage:goldsmith.wastage
    });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `${BACKEND_SERVER_URL}/api/goldsmith/${selectedGoldsmith.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Goldsmith updated successfully");

        setGoldsmith((prev) =>
          prev.map((g) =>
            g.id === selectedGoldsmith.id ? { ...g, ...formData } : g
          )
        );

        setOpenEditDialog(false);
      } else {
        toast.error("Failed to update goldsmith");
      }
    } catch (error) {
      toast.error("Error updating goldsmith");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goldsmith?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BACKEND_SERVER_URL}/api/goldsmith/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGoldsmith((prev) => prev.filter((g) => g.id !== id));
        toast.success("Goldsmith deleted successfully");
      } else {
        toast.error("Failed to delete goldsmith");
      }
    } catch (error) {
      toast.error(responseData.message);

    }
  };

  const handleUpdateJobCard=async(totalGoldWt,totalItemWt,totalDeductionWt,totalWastage,totalBalance,openBal)=>{
      console.log('update')
          
        const payload={
        'goldRows':goldRows,
        'itemRow':itemRows,
        'deductionRows':deductionRows,
        'receivedAmount':received,
        'goldSmithBalance':{
         'id':selectedName.id,
         'balance':totalBalance
        },
        'total':{
          'id':jobCardTotal[0]?.id,
          'givenWt':totalGoldWt,
          'itemWt':totalItemWt,
          'stoneWt':totalDeductionWt,
          'wastage':totalWastage,
          'balance':totalBalance,
          'openBal':openBal
        }
       }
       console.log('payload update',payload)
       
      try {
            const response = await axios.put(`${BACKEND_SERVER_URL}/api/job-cards/${selectedName.id}/${jobCardId}`, payload, {
                    headers: {
                     'Content-Type': 'application/json',
                   },
             });
             if(response.status===400){
                alert(response.data.message)
             }
              console.log('Response:', response.data.jobCards); // success response
             
              setOpen(false)
              setEdit(false)
             
              toast.success(response.data.message)

       } catch (err) {
                 console.error('POST Error:', err.response?.data || err.message);
                toast.error(err.message || 'An error occurred while creating the job card'); 
             }
       }

  const filteredGoldsmith = goldsmith.filter((gs) => {
    const nameMatch =
      gs.name && gs.name.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = gs.phone && gs.phone.includes(searchTerm);
    const addressMatch =
      gs.address && gs.address.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || phoneMatch || addressMatch;
  });

  const handleJobCardId=(id)=>{
    const num=Number(id)
    if(isNaN(num)){
      setJobCardError({'err':"Please Enter Vaild Input"})
    }else{
      setJobCardError({}) 
      setJobCardId(num)
    }
   
  }
  const handleSearch =()=>{
    if (!jobCardError.err && !isNaN(jobCardId) && jobCardId!==null) {
         const fetchJobCardById=async()=>{
            try{
               const res= await fetch(`${BACKEND_SERVER_URL}/api/job-cards/${jobCardId}/jobcard`, {
                 method: "GET",
                 headers: {
                 "Content-Type": "application/json"
                }
               })
               const data=await res.json()
               if(res.status===404){
                setOpen(false)
                setEdit(false)
                setNoJobCard({err:"No Job Card For This Id"})
               }else{
                console.log('data',data)
               setGoldRows(data.jobcard[0].givenGold)
               setItemRows(data.jobcard[0].deliveryItem.length>=1?data.jobcard[0].deliveryItem:[{ weight: "", itemName: "" }])
               setDeductionRows(data.jobcard[0].additionalWeight.length>=1?data.jobcard[0].additionalWeight:[{ type: "Stone", customType: "", weight: "" }])
               setReceived(data.jobcard[0].goldSmithReceived)
               setSelectedName(data.jobcard[0].goldsmith)
               setJobCardTotal(data.jobcard[0].jobCardTotal)
               setJobCardBalance(data.jobCardBalance)
               setOpen(true)
               setEdit(true)
               setNoJobCard({})
               }
               

            }catch(err){
                toast.error(err.message)
            }
         }
         fetchJobCardById()
      }
  }


  return (
     <div className="homeContainer">
      
      <Paper className="customer-details-container" elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Goldsmith Details
        </Typography>

        <TextField
          label="Search Goldsmith Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              width: "18rem",
              backgroundColor: "#f8f9fa",
              "&.Mui-focused": {
                backgroundColor: "#ffffff",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "#777" }} />
              </InputAdornment>
            ),
          }}
        />

        <Table>
          <TableHead
            sx={{
              backgroundColor: "#e3f2fd",
              "& th": {
                backgroundColor: "#e3f2fd",
                color: "#0d47a1",
                fontWeight: "bold",
                fontSize: "1rem",
              },
            }}
          >
            <TableRow>
              <TableCell align="center">
                <strong>Goldsmith Name</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Phone Number</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Address</strong>
              </TableCell>
              <TableCell align="center">
                <strong>GoldSmith Wastage</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGoldsmith.length > 0 ? (
              filteredGoldsmith.map((goldsmith, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{goldsmith.name}</TableCell>
                  <TableCell align="center">{goldsmith.phone}</TableCell>
                  <TableCell align="center">{goldsmith.address}</TableCell>
                   <TableCell align="center">{goldsmith.wastage}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Jobcard">
                      <Link
                        to={`/jobcard/${goldsmith.id}/${goldsmith.name}`}
                        state={{
                          phone: goldsmith.phone,
                          address: goldsmith.address,
                        }}
                        style={{ marginRight: "10px", color: "#1976d2" }}
                      >
                        <AssignmentIndOutlinedIcon
                          style={{ cursor: "pointer" }}
                        />
                      </Link>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <EditIcon
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                          color: "#388e3c",
                        }}
                        onClick={() => handleEditClick(goldsmith)}
                      />
                    </Tooltip>

                    {/* <Tooltip title="Delete">
                      <DeleteIcon
                        style={{ cursor: "pointer", color: "#d32f2f" }}
                        onClick={() => handleDelete(goldsmith.id)}
                      />
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No goldsmith details available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

    <div className="customer-details-container">
            <Typography variant="h6" gutterBottom>
                Search Job Card
            </Typography>
        <div className="searchBox">
          <div className="inputWithError">
                   <TextField
                   id="outlined-basic"
                   label="JobCard Id"
                   onChange={(e) => handleJobCardId(e.target.value)}
                   variant="outlined"
                   autoComplete="off"
                    />
                {jobCardError.err && <p className="errorText">{jobCardError.err}</p>}
                {noJobCard.err && <p className="errorText">{noJobCard.err}</p>}
           </div>

                  <Button
                  className="searchBtn"
                  variant="contained"
                  onClick={handleSearch}
                  disabled={!!jobCardError.err}
                   >
                  Search
                  </Button>
               </div>

    </div>
     
      {open&&  
      <NewJobCard
      name={selectedName.name}
      goldSmithWastage={selectedName.wastage}
      setGoldSmith={setGoldsmith}
      balance={jobCardBalance}
      goldRows={goldRows}
      setGoldRows={setGoldRows}
      itemRows={itemRows}
      setItemRows={setItemRows}
      deductionRows={deductionRows}
      setDeductionRows={setDeductionRows}
      received={received}
      setReceived={setReceived}
      masterItems={masterItems}
      handleUpdateJobCard={handleUpdateJobCard}
      jobCardId={jobCardId}
      onclose={()=>{setOpen(false)}}
      open={open}
      edit={edit}
      
      />}

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Goldsmith</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={formData.name}
            fullWidth
            margin="normal"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Phone"
            value={formData.phone}
            fullWidth
            margin="normal"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <TextField
            label="Address"
            value={formData.address}
            fullWidth
            margin="normal"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
           <TextField
            label="Wastage"
            value={formData.wastage}
            fullWidth
            margin="normal"
            type="number"
            onChange={(e) =>
              setFormData({ ...formData, wastage: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
      </div>
  );
};

export default Goldsmith;
