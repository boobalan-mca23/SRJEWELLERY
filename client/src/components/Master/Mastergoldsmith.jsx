import React, { use, useState } from "react";
import "./Mastergoldsmith.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
} from "@mui/material";
import axios from "axios";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";

function Mastergoldsmith() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goldsmithName, setgoldsmithName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [wastage, setWastage] = useState(0);
  const [wastageErr,setWastageErr]=useState({})
  const [address, setAddress] = useState("");
  const [goldsmith, setGoldsmith] = useState([]);
  const goldSmithRef=useRef()
  const phoneRef=useRef()
  const wastageRef=useRef()
  const addressRef=useRef()

  const openModal = () => {
    setIsModalOpen(true);
    setgoldsmithName("");
    setPhoneNumber("");
    setAddress("");
    setWastage("")
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveGoldsmith = async () => {
    if (goldsmithName.trim()) {
      const newGoldsmith = {
        name: goldsmithName,
        phonenumber: phoneNumber || null,
        address: address || null,
        wastage:wastage || null
      };
       if(wastageErr.err){
         toast.warn('Enter Valid Wastage')
         return;
       }
      try {
        const response = await axios.post(
          `${BACKEND_SERVER_URL}/api/goldsmith`,
          newGoldsmith
        );

        setGoldsmith([...goldsmith, response.data]);
        closeModal();
        toast.success("Goldsmith added successfully!");
      } catch (error) {
        console.error("Error creating goldsmith:", error);
        toast.error("Failed to add goldsmith. Please try again.");
      }
    } else {
      toast.warn("Please enter the goldsmith's name.");
    }
  };
  const handleWastage = (val) => {
  // Check if val is a valid number (including decimal)
  if (!/^\d*\.?\d*$/.test(val)) {
    setWastageErr({ err: "Please enter a valid number" });
    setWastage(val); // still update input so user can correct it
    return;
  }

  // Valid input
  setWastage(val);
  setWastageErr({});
};


  return (
    <div className="customer-container">
      <Button
        style={{
          backgroundColor: "#F5F5F5",
          color: "black",
          borderColor: "#25274D",
          borderStyle: "solid",
          borderWidth: "2px",
        }}
        variant="contained"
        onClick={openModal}
      >
        Add Goldsmith
      </Button>

      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Add New Goldsmith</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Goldsmith Name"
            type="text"
            fullWidth
            inputRef={goldSmithRef}
            onKeyDown={(e)=>{
              if(e.key==="Enter" || e.key==="ArrowDown"){
                phoneRef.current.focus()
              }
            }}
            value={goldsmithName}
            onChange={(e) => setgoldsmithName(e.target.value)}
            autoComplete="off"
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            inputRef={phoneRef}
            onKeyDown={(e)=>{
              if(e.key==="Enter" || e.key==="ArrowDown"){
                addressRef.current.focus()
              }
              if(e.key==="ArrowUp"){
                goldSmithRef.current.focus()
              }
            }}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            autoComplete="off"
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            multiline
            rows={4}
            inputRef={addressRef}
             onKeyDown={(e)=>{
              if(e.key==="Enter"||e.key==="ArrowDown"){
                wastageRef.current.focus()
              }
              if(e.key==="ArrowUp"){
                phoneRef.current.focus()
              }
            }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="off"
          />

          <TextField
            autoFocus
            margin="dense"
            label="Goldsmith Wastage"
            type="text"
            fullWidth
            inputRef={wastageRef}
             onKeyDown={(e)=>{
              if(e.key==="Enter"||e.key==="ArrowDown"){
                goldSmithRef.current.focus()
              }
              if(e.key==="ArrowUp"){
                addressRef.current.focus()
              }
            }}
            value={wastage}
            onChange={(e) => handleWastage(e.target.value)}
            autoComplete="off"
            
          />
          {wastageErr.err&&<p style={{color:"red"}}>{wastageErr.err}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveGoldsmith} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {goldsmith.length > 0 && (
        <Paper className="customer-table">
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Goldsmith Name</th>
                <th>Phone Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {goldsmith.map((goldsmith, index) => (
                <tr key={index}>
                  <td>{goldsmith.name}</td>
                  <td>{goldsmith.phone}</td>
                  <td>{goldsmith.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
    </div>
  );
}

export default Mastergoldsmith;
