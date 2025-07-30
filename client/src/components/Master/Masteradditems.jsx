
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Masteradditems.css";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import EditIcon from "@mui/icons-material/Edit";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
 
} from "@mui/material";

const Masteradditems = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [editItemName,setEditItemName]=useState("")
  const [openEditDialog,setOpenEditDialog]=useState(false)
  const saveBtn=useRef()
  useEffect(() => {
    fetchItems();
  }, []);
 
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BACKEND_SERVER_URL}/api/master-items`);
       console.log("Fetched items:", res.data);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  };
  
   const handleEditItem=(id)=>{
       const filterItem=items.filter((item,)=>id===item.id)
       setEditItemName(filterItem[0].itemName)
       setOpenEditDialog(true)
   } 

  const handleAddItem = async () => {
    if (itemName) {
      try {
        await axios.post(`${BACKEND_SERVER_URL}/api/master-items/create`, {
          itemName,
        });
        setItemName("");
        fetchItems();
        toast.success("Item added successfully!");
      } catch (err) {
        console.error("Failed to add item", err);
        toast.error("Failed to add item. Please try again.");
      }
    } else {
      toast.warn("Please enter item name.");
    }
  };

  return (
    <>
   
      <div className="master-container">
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

        <div className="add-item-form">
          <h2 style={{ textAlign: "center" }}>Add Item</h2>
          <label>Item Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
           onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "ArrowDown") {
                saveBtn.current.focus();
                }
             }}

          />

          <button onClick={handleAddItem} ref={saveBtn}>Add Item</button>
        </div>

        <div className="item-list">
          <h2 style={{ textAlign: "center" }}>Added Items</h2>
          {items.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>SI.No</th>
                  <th>Item Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.itemName}</td>
                    <td> <EditIcon
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                          color: "#388e3c",
                        }}
                        onClick={() => handleEditItem(item.id)}
                      /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No items added</p>
          )}
        </div>
      </div>

       <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Master Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Item Name"
            value={editItemName}
            onChange={(e)=>{setEditItemName(e.target.value)}}
           
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            // onClick={handleEditSubmit}
            variant="contained"
            color="primary"
            // ref={(el) => (formRef.current.update = el)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>







    </>
  );
};

export default Masteradditems;



