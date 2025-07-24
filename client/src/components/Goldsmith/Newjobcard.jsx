
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { MdDeleteForever } from "react-icons/md";
import "./NewJobCard.css";
import { goldRowValidation,receiveRowValidation,itemValidation,deductionValidation,wastageValidation} from "./JobcardValidation";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const format = (val) =>
  isNaN(parseFloat(val)) ? "" : parseFloat(val).toFixed(3);

const NewJobCard = ({ open, onclose, edit, name,goldSmithWastage,balance,goldRows,setGoldRows,itemRows,setItemRows,deductionRows,setDeductionRows,
 masterItems,handleSaveJobCard,handleUpdateJobCard,jobCardId,received,setReceived,jobCardLength,setGoldSmithWastage,balanceDifference,setBalanceDifference}) => {
  
  const today = new Date().toLocaleDateString("en-IN");
 // const [description, setDescription] = useState("");
  const[formErrors,setFormErrors]=useState([])
  const[receivedErrors,setReceivedErrors]=useState([])
  const[itemErrors,setItemErrors]=useState([])
  const[deductionErrors,setDeductionErrors]=useState([])
  const[wastageErrors,setWastageErrors]=useState({})
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
     // check validation
    goldRowValidation(goldRows,setFormErrors)
    
  };
  const handleRecivedChange = (i, field, val) => {
    const copy = [...received];
    copy[i][field] = val;
    //  copy[i].purity = calculatePurity(
    //   parseFloat(copy[i].weight),
    //   parseFloat(copy[i].touch)
    // );
    
    setReceived(copy);
    //check validation
    receiveRowValidation(received,setReceivedErrors)

  };

  const handleItemRowChange = (i, field, val) => {
    const updated = [...itemRows];
    updated[i][field] = val;
    setItemRows(updated);
     // check validation
    itemValidation(itemRows,setItemErrors)
         
  };

  const handleDeductionChange = (i, field, val) => {
    const updated = [...deductionRows];
    updated[i][field] = val;
    setDeductionRows(updated);
    // check validation
    deductionValidation(deductionRows,setDeductionErrors)
  };
  const handleGoldSmithChange = (e) => {
    
    setGoldSmithWastage(e.target.value)
       if (!isNaN(e.target.value) && e.target.value !== "") {
              wastageValidation(e.target.value, setWastageErrors);
              setWastage(netWeight * parseFloat(e.target.value) / 100);
              let calculatedFinalTotal = parseFloat(netWeight) + (netWeight * parseFloat(e.target.value) / 100);
              setFinalTotal(format(calculatedFinalTotal));
          }else{
            wastageValidation(e.target.value, setWastageErrors);
      }};

  const totalGoldWeight = goldRows.reduce(
    (sum, row) => sum + parseFloat(row.weight || 0),
    0
  );
  const totalReceivedWeight = received.reduce(
    (sum, row) => sum + parseFloat(row.weight || 0),
    0
  );

  const totalBalance = balance>=0? parseFloat(totalGoldWeight)+parseFloat(balance): parseFloat(balance)+parseFloat(totalGoldWeight);

  const totalItemWeight = itemRows.reduce(
    (sum, item) => sum + parseFloat(item.weight || 0),
    0
  );

  const totalDeductionWeight = deductionRows.reduce(
    (sum, deduction) => sum + parseFloat(deduction.weight || 0),
    0
  );
  const ownerGivesBalance =
   ( parseFloat(totalBalance) - parseFloat(finalTotal))>=0;

  
  const stoneOptions = ["Stone", "Enamel", "Beads", "Others"];


  const handleRemoveReceived=(removeIndex)=>{
       const isTrue=window.confirm("Are you sure you want to remove this received row?")
       if(isTrue){
       const receivedItems=received.filter((_,index)=>index!=removeIndex)
       setReceived(receivedItems)
       }
      }
  const handleRemovegold=(removeIndex)=>{
    
     const isTrue=window.confirm("Are you sure you want to remove this gold row?")
       if(isTrue){
       const goldItems=goldRows.filter((_,index)=>index!=removeIndex)
       setGoldRows(goldItems)
       }
  } 
  const handleRemoveItem=(removeIndex)=>{ 
    
    const isTrue=window.confirm("Are you sure you want to remove this Item row?")
       if(isTrue){
       const removeItems=itemRows.filter((_,index)=>index!=removeIndex)
       setItemRows(removeItems)
       }
      }
  const handleRemovededuction=(removeIndex)=>{
     
    const isTrue=window.confirm("Are you sure you want to deduction this Item row?")
       if(isTrue){
       const removeItems=deductionRows.filter((_,index)=>index!=removeIndex)
       setDeductionRows(removeItems)
       }
  }     
     
  useEffect(() => {
    setItemPurity(calculatePurity(totalItemWeight, parseFloat(itemTouch)));
  }, [totalItemWeight, itemTouch]);

  const safeParse = (val) => (isNaN(parseFloat(val)) ? 0 : parseFloat(val));

useEffect(() => {
  const jobCardBalance = safeParse(balance) >= 0
    ? safeParse(totalGoldWeight) + safeParse(balance)
    : safeParse(balance) + safeParse(totalGoldWeight);
  console.log('jobCardBalance',jobCardBalance)
  console.log('finalTotal',safeParse(finalTotal))
  const difference = jobCardBalance - safeParse(finalTotal);
  console.log('difference', difference);

  setBalanceDifference(difference);
}, [balance, goldRows, itemRows, deductionRows, wastage]);

  useEffect(() => {
    let calculatedNetWeight = totalItemWeight - totalDeductionWeight;
    setNetWeight(format(calculatedNetWeight));
    setWastage(format(calculatedNetWeight*goldSmithWastage/100))
    setFinalTotal(calculatedNetWeight+(calculatedNetWeight*goldSmithWastage)/100)
  }, [itemRows, deductionRows]);

  
  // const symbolOptions = ["Touch", "%", "+"];
 
  const SaveJobCard=()=>{
     // form validation
      let goldIsTrue=goldRowValidation(goldRows,setFormErrors)
      let itemIsTrue=""
      let deductionIsTrue=""
      if(edit){
         itemIsTrue=itemValidation(itemRows,setItemErrors)
         deductionIsTrue=deductionValidation(deductionRows,setDeductionErrors)
      }
      let receivedIsTrue=receiveRowValidation(received,setReceivedErrors)
     if(edit){ 

       if((goldIsTrue&&itemIsTrue&&deductionIsTrue&&receivedIsTrue)&&(!wastageErrors.wastage)){
          handleUpdateJobCard(totalGoldWeight,totalItemWeight,totalDeductionWeight,finalTotal,balanceDifference,balance)
        }else{
           toast.warn("Give Correct Information")
        }
     }else{
       if((goldIsTrue&&receivedIsTrue)&&(!wastageErrors.wastage)){
         handleSaveJobCard(totalGoldWeight,totalItemWeight,totalDeductionWeight,finalTotal,balanceDifference,balance)
        }else{
          toast.warn("Give Correct Information")
        }
     }    
  }

  return (
      <Dialog open={open} onClose={onclose} maxWidth={false} 
       PaperProps={{
        className:"jobcard-dialog"
       }}
      >
      <DialogTitle  className ="dialogTitle"sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {edit ? "Update Job Card" : "Add New Job Card"}
        <IconButton onClick={onclose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent >
    <div className="container">
       <h3>SR Jewellery </h3>
      <div className="header">
       
        <div className="header-item">
          <span className="header-label">ID:</span> {edit?jobCardId:jobCardLength}
        </div>
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
           {formErrors[i]?.itemName&& (<span className="error">{formErrors[i]?.itemName}</span>)}
            </div>
            <div>
              <input
              type="text"
              placeholder="Weight"
              value={row.weight}
              onChange={(e) => handleGoldRowChange(i, "weight", e.target.value)}
              className="input"
            /> <br></br>
            {formErrors[i]?.weight&& (<span className="error">{formErrors[i].weight}</span>)}
            </div>
             
            <span className="operator">x</span>
            <div>
              <input
              type="text"
              placeholder="Touch"
              value={row.touch}
              onChange={(e) => handleGoldRowChange(i, "touch", e.target.value)}
              className="input"
            /><br></br>
             {formErrors[i]?.touch&& (<span className="error">{formErrors[i].touch}</span>)}
            </div>
            {!row.id && <MdDeleteForever className="deleteIcon" onClick={()=>{handleRemovegold(i)}}/>}
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
            <span className="balance-label">{balance>=0 ?"Opening Balance":"ExceesBalance"}:</span>
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

      <div className="section itemDelivery">
        <h3 className="section-title">Item Delivery</h3>
        {itemRows.map((item, i) => (
          <div key={i} className="row">
           <div>
             <input
              type="text"
              placeholder="Item Weight"
              value={item.weight}
              onChange={(e) => handleItemRowChange(i, "weight", e.target.value)}
              className="input"
              disabled={!edit}
            /><br></br>
            {itemErrors[i]?.weight&& (<span className="error">{itemErrors[i]?.weight}</span>)}
           </div>
           <div>
              <select
              value={item.itemName}
              onChange={(e) => handleItemRowChange(i, "itemName", e.target.value)}
              className="select"
              disabled={!edit}
            >
              <option value="">Select Item</option>
              { masterItems.map((option,index) => (
                <option key={index} value={option.itemName}>
                  {option.itemName}
                </option>
              ))}
             
            </select><br></br>
            {itemErrors[i]?.itemName&&(<span className="error">{itemErrors[i]?.itemName}</span>)}
           </div>
            {!item.id && <MdDeleteForever className="deleteIcon" onClick={()=>{handleRemoveItem(i)}}/>}
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
              <div>
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
              </select><br></br>
                {deductionErrors[i]?.type && (<span className="error">{deductionErrors[i]?.type}</span>)}
              </div>
              <div>
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
               <br></br>
               {deductionErrors[i]?.customType && (<span className="error">{deductionErrors[i]?.customType}</span>)}
              </div>
             <div>
               <input
                disabled={!edit}
                type="text"
                value={deduction.weight}
                onChange={(e) =>
                  handleDeductionChange(i, "weight", e.target.value)
                }
                className="deduction-input"
                placeholder="Weight"
              /><br></br>
              {deductionErrors[i]?.weight&&(<span className="error">{deductionErrors[i]?.weight}</span>)}
             </div>
              {!deduction.id && <MdDeleteForever className="deleteIcon" onClick={()=>{handleRemovededuction(i)}}/>}
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
          > {/* <select style={{width:"6rem"}}
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
             <div>
                  <input
              type="text"
              value={goldSmithWastage}
              className="inputwastage"
              onChange={(e) => {handleGoldSmithChange(e)}}

              /> <br></br>

               {wastageErrors?.wastage && (<span className="error">{wastageErrors?.wastage}</span>)}
             </div>
             
             <span className="operator">=</span>
           <input
              readOnly
              type="number"
              value={wastage}
              className="inputwastage"
            />
          
          </div>
        </div>
        <div className="finalTotalContainer">
          
          <span className="finalTotal"><strong>Total</strong> = {netWeight} + {parseFloat(wastage).toFixed(3)}</span><br></br><br></br>
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
             {!row.id && <MdDeleteForever className="deleteIcon" onClick={()=>{handleRemoveReceived(i)}}/>}
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
            setReceived([...received, { weight: 0, touch: 91.7}])
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
        style={{ display: "flex", justifyContent: "center", marginTop: "20px", }}
        className="button"
      >
        <Button variant="contained" color="success" style={{marginRight:"15px"}} onClick={()=>SaveJobCard()}>
          SAVE
        </Button>
         <Button variant="contained" style={{backgroundColor:"blue"}} onClick={()=>window.print()}>
          PRINT
        </Button>
      </div>

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
      
    </div>
      
    </DialogContent>
      </Dialog>
    
  );
};

export default NewJobCard;
