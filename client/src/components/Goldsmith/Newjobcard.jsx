
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { MdDeleteForever } from "react-icons/md";
import "./NewJobCard.css";
import { goldRowValidation,receiveRowValidation } from "./JobcardValidation";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const format = (val) =>
  isNaN(parseFloat(val)) ? "" : parseFloat(val).toFixed(3);

const NewJobCard = ({ 
  open, onclose, edit, name,goldSmithWastage,balance,goldRows,setGoldRows,
 masterItems,handleSaveJobCard}) => {
  
  const today = new Date().toLocaleDateString("en-IN");
 // const [description, setDescription] = useState("");
  
  const [itemRows, setItemRows] = useState([{ weight: "", name: "" }]);
  const [deductionRows, setDeductionRows] = useState([
    { type: "Stone", customType: "", weight: "" },
  ]);
  const[received,setReceived]=useState([])
  const[formErrors,setFormErrors]=useState([])
  const[receivedErrors,setReceivedErrors]=useState([])
  const[netWeight, setNetWeight] = useState("0.000");
  const[wastage,setWastage]=useState(0)
  const[finalTotal,setFinalTotal]=useState(0)
  // const [touch, setTouch] = useState("");
  // const [percentageSymbol, setPercentageSymbol] = useState("Touch");

  const [itemTouch, setItemTouch] = useState("");
  const [itemPurity, setItemPurity] = useState("0.000");

  const calculatePurity = (w, t) =>
    !isNaN(w) && !isNaN(t) ? ((w * t) / 100).toFixed(3) : "";

  const handleGoldRowChange = (i, field, val) => {
    const copy = [...goldRows];
    copy[i][field] = val;
    // copy[i].purity = calculatePurity(
    //   parseFloat(copy[i].weight),
    //   parseFloat(copy[i].touch)
    // );
    setGoldRows(copy);
  };
  const handleRecivedChange = (i, field, val) => {
    const copy = [...received];
    copy[i][field] = val;
    //  copy[i].purity = calculatePurity(
    //   parseFloat(copy[i].weight),
    //   parseFloat(copy[i].touch)
    // );
    
    setReceived(copy);
  };

  const handleItemRowChange = (i, field, val) => {
    const updated = [...itemRows];
    updated[i][field] = val;
    setItemRows(updated);
  };

  const handleDeductionChange = (i, field, val) => {
    const updated = [...deductionRows];
    updated[i][field] = val;
    setDeductionRows(updated);
  };

  const totalGoldWeight = goldRows.reduce(
    (sum, row) => sum + parseFloat(row.weight || 0),
    0
  );
  const totalReceivedWeight = received.reduce(
    (sum, row) => sum + parseFloat(row.weight || 0),
    0
  );

  const totalBalance = parseFloat(balance) + totalGoldWeight;

  const totalItemWeight = itemRows.reduce(
    (sum, item) => sum + parseFloat(item.weight || 0),
    0
  );

  const totalDeductionWeight = deductionRows.reduce(
    (sum, deduction) => sum + parseFloat(deduction.weight || 0),
    0
  );

  useEffect(() => {
    setItemPurity(calculatePurity(totalItemWeight, parseFloat(itemTouch)));
  }, [totalItemWeight, itemTouch]);

  useEffect(() => {
    let calculatedNetWeight = totalItemWeight - totalDeductionWeight;
    setNetWeight(format(calculatedNetWeight));
    setWastage(format(calculatedNetWeight*goldSmithWastage/100))
    setFinalTotal(calculatedNetWeight+(calculatedNetWeight*goldSmithWastage)/100)
  }, [itemRows, deductionRows]);

  


  const ownerGivesBalance =
   ( parseFloat(totalBalance) - parseFloat(finalTotal))>0;

  const balanceDifference = Math.abs(
   parseFloat(totalBalance) - parseFloat(finalTotal)
  );

  // const symbolOptions = ["Touch", "%", "+"];
 
  const stoneOptions = ["Stone", "Enamel", "Beads", "Others"];
  
  const SaveJobCard=()=>{
     // form validation
      let goldIsTrue=goldRowValidation(goldRows,setFormErrors)
      let receivedIsTrue=receiveRowValidation(received,setReceivedErrors)
     if(goldIsTrue){
       handleSaveJobCard(totalGoldWeight,totalBalance)
    }
  }

 const handleRemoveReceived=(removeIndex)=>{
       const receivedItems=received.filter((_,index)=>index!=removeIndex)
       console.log('index',removeIndex)
       console.log('receivedItems',receivedItems)
       setReceived(receivedItems)
      
 }


  return (
      <Dialog open={open} onClose={onclose} maxWidth={false} PaperProps={{ className: "jobcard-dialog" }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {edit ? "Update Job Card" : "Add New Job Card"}
        <IconButton onClick={onclose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
    <div className="container">
      <div className="header">
        <div className="header-item">
          <span className="header-label">Name:</span> {name}
        </div>
        <div className="header-item">
          <span className="header-label">Date:</span> {today}
        </div>
      </div>

      {/* <div className="section">
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="textarea"
          placeholder="Enter job description..."
        />
      </div> */}

      <div className="section">
        <h3 className="section-title">Given Gold</h3>
        {goldRows.map((row, i) => (
          <div key={i} className="row">
            <div>
              <select
              value={row.itemName}
              
              onChange={(e) => handleGoldRowChange(i, "itemName", e.target.value)}
              className="select"
            >
              <option value="">Select Item</option>
              { masterItems.map((option,index) => (
                <option key={index} value={option.itemName}>
                  {option.itemName}
                </option>
              ))}
            </select> <br></br>
           {formErrors[i]?.itemName&& (<span style={{color:"red",fontSize:"16px"}}>{formErrors[i]?.itemName}</span>)}
            </div>
            <div>
              <input
              type="number"
              placeholder="Weight"
              value={row.weight}
              onChange={(e) => handleGoldRowChange(i, "weight", e.target.value)}
              className="input"
            /> <br></br>
            {formErrors[i]?.weight&& (<span style={{color:"red",fontSize:"16px"}}>{formErrors[i].weight}</span>)}
            </div>
             
            <span className="operator">x</span>
            <div>
                 <input
              type="number"
              placeholder="Touch"
              value={row.touch}
              onChange={(e) => handleGoldRowChange(i, "touch", e.target.value)}
              className="input"
            /><br></br>
             {formErrors[i]?.touch&& (<span style={{color:"red",fontSize:"16px"}}>{formErrors[i].touch}</span>)}
            </div>
            {/* <span className="operator">=</span>
            <input
              type="text"
              readOnly
              placeholder="Purity"
              value={format(row.purity)}
              className="input-read-only"
            /> */}
          </div>
        ))}
        <button
          onClick={() =>
            setGoldRows([...goldRows, { itemName:"",weight: "", touch: 91.7}])
          }
          className="circle-button"
        >
          +
        </button>
        <div className="total-gold-container">
          <span className="total-gold-label">Total:</span>
          <span className="total-gold-value">{format(totalGoldWeight)}</span>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Balance</h3>
        <div className="balance-block">
          <div className="balance-display-row">
            <span className="balance-label">Opening Balance:</span>
            <span className="balance-value">{format(balance)}</span>
          </div>
          <div className="balance-display-row">
            <span className="balance-label">Total:</span>
            <span className="balance-value">{format(totalGoldWeight)}</span>
          </div>
          <div>----------</div>
          <div className="balance-display-row">
            <span className="balance-label">Total Balance:</span>
            <span className="balance-value">{format(totalBalance)}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Item Delivery</h3>
        {itemRows.map((item, i) => (
          <div key={i} className="row">
            <input
              type="number"
              placeholder="Item Weight"
              value={item.weight}
              onChange={(e) => handleItemRowChange(i, "weight", e.target.value)}
              className="input"
              disabled={!edit}
            />
            <select
              value={item.name}
              onChange={(e) => handleItemRowChange(i, "name", e.target.value)}
              className="select"
              disabled={!edit}
            >
              <option value="">Select Item</option>
              { masterItems.map((option,index) => (
                <option key={index} value={option.itemName}>
                  {option.itemName}
                </option>
              ))}
             
            </select>
          </div>
        ))}
        <button
          onClick={() => setItemRows([...itemRows, { weight: "", name: "" }])}
          className="circle-button"
          disabled={!edit}
        >
          +
        </button>
        <div className="total-gold-container">
          <span className="total-gold-label">Total Item Weight:</span>
          <span className="total-gold-value">{format(totalItemWeight)}</span>
        </div>

        <div className="deduction-section">
          <h4>Stone Section </h4>
          {deductionRows.map((deduction, i) => (
            <div key={i} className="deduction-row">
              <select
                value={deduction.type}
                onChange={(e) =>
                  handleDeductionChange(i, "type", e.target.value)
                }
                className="deduction-select"
                disabled={!edit}
              >
                {stoneOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {deduction.type === "Others" && (
                <input
                  disabled={!edit}
                  type="text"
                  placeholder="Specify type"
                  value={deduction.customType}
                  onChange={(e) =>
                    handleDeductionChange(i, "customType", e.target.value)
                  }
                  className="deduction-input"
                />
              )}
              <input
                disabled={!edit}
                type="number"
                value={deduction.weight}
                onChange={(e) =>
                  handleDeductionChange(i, "weight", e.target.value)
                }
                className="deduction-input"
                placeholder="Weight"
              />
            </div>
          ))}
          <button
            onClick={() =>
              setDeductionRows([
                ...deductionRows,
                { type: "Stone", customType: "", weight: "" },
              ])
            }
            disabled={!edit}
            className="circle-button"
          >
            +
          </button>
          <div className="total-purity-container">
            <span className="total-purity-label">Total Stone Weight:</span>
            <span className="total-purity-value">
              {format(totalDeductionWeight)}
            </span>
          </div>
        </div>

        <div className="net-weight-display">
          <span className="header-label">Net Weight:</span>
          <span className="net-weight-value" style={{ color: "blue" }}>
            {netWeight}
          </span>
        </div>
        <div>
           <strong>Wastage Section</strong>
        </div>
        <div className="input-group-fluid" style={{ marginTop: "10px" }}>
           <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {/* <select style={{width:"6rem"}}
              value={percentageSymbol}
              onChange={(e) => setPercentageSymbol(e.target.value)}
              className="select-small"
            >
              {symbolOptions.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select> */}

            <input
              readOnly
              type="number"
              value={netWeight}
              className="inputwastage"
              
            />
            <span className="operator">x</span>
             <input
              readOnly
              type="number"
              value={goldSmithWastage}
              className="inputwastage"
             
            
            />
             <span className="operator">=</span>
           <input
              readOnly
              type="number"
              value={wastage}
              className="inputwastage"
           
            
            />
           <div className="calculationBox">
               <span><strong>Calculation:</strong></span> <br></br><br></br>
               <span>netWeight * wastage / 100 = total</span>
           </div>
          </div>
        </div>
        <div className="finalTotalContainer">
          
          <span className="finalTotal"><strong>Total</strong> = {netWeight} + {wastage}</span><br></br><br></br>
          <span className="finalTotal"> = <strong> {format(finalTotal)}</strong></span>
        </div>

         <div className="section">
        <h3 className="section-title">Received Section</h3>
           {received.map((row, i) => (
           <div key={i} className="row">
            <div>
              <input
              type="number"
              placeholder="Weight"
              value={row.weight}
              onChange={(e) => handleRecivedChange(i, "weight", e.target.value)}
              className="input"
            /><br></br>
            {receivedErrors[i]?.weight && (<span style={{color:"red",fontSize:"16px"}}>{receivedErrors[i].weight}</span>)}
            </div>
            <span className="operator">x</span>
             <div>
               <input
              type="number"
              placeholder="Touch"
              value={row.touch}
              onChange={(e) => handleRecivedChange(i, "touch", e.target.value)}
              className="input"
            />
             {receivedErrors[i]?.touch && (<span style={{color:"red",fontSize:"16px"}}>{receivedErrors[i].touch}</span>)}
             </div>
           <MdDeleteForever className="deleteIcon" onClick={()=>{handleRemoveReceived(i)}}/>
            {/* <span className="operator">=</span>
            <input
              type="text"
              readOnly
              placeholder="Purity"
              value={format(row.purity)}
              className="input-read-only"
            /> */}
          </div>
        ))}
        <button
         
          onClick={() =>
            setReceived([...received, { weight: 0, touch: 0}])
          }
          className="circle-button"
        >
          +
        </button>
        <div className="total-purity-container">
          <span className="total-purity-label">Total:</span>
          <span className="total-purity-value">{format(totalReceivedWeight)}</span>
        </div>
      </div>
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button variant="contained" color="success" onClick={()=>SaveJobCard()}>
          SAVE
        </Button>
      </div>

      {parseFloat(netWeight) !== 0 && (
        <div className="final-balance-section">
          {ownerGivesBalance ? (
           <p className="balance-text-goldsmith">
              Goldsmith should give balance:
              <span className="balance-amount">
                {format(balanceDifference)}
              </span>
            </p>
          ) : (
             <p className="balance-text-owner">
              Owner should give balance:
              <span className="balance-amount">
                {format(balanceDifference)}
              </span>
            </p>
            
          )}
        </div>
      )}
    </div>
      
    </DialogContent>
      </Dialog>
    
  );
};

export default NewJobCard;
