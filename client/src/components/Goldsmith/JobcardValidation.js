const  goldRowValidation=(goldRows,setFormErrors)=>{
   
   const errors = goldRows.map((row) => {
    const rowErrors = {};
    if (!row.itemName) rowErrors.itemName = "Item Name is required";
    if (!row.weight) rowErrors.weight = "Weight is required";
    if(row.weight<0) rowErrors.weight= "Weight is negative value"
    if (row.touch<0)rowErrors.touch= "touch is negative value"
    if (!row.touch) rowErrors.touch = "Touch is required";
    return rowErrors;
  });

  setFormErrors(errors);

  // Return true if no errors found
  return errors.every(err => Object.keys(err).length === 0);
}
const receiveRowValidation=(received,setReceivedErrors)=>{
    const errors = received.map((row) => {
    const rowErrors = {};
    if (!row.weight) rowErrors.weight = "Weight is required";
    if (row.weight<0) rowErrors.weight= "Weight is negative value"
    if (row.touch<0)rowErrors.touch= "touch is negative value"
    if (!row.touch) rowErrors.touch = "Touch is required";
    return rowErrors;
  });

  setReceivedErrors(errors);

  // Return true if no errors found
  return errors.every(err => Object.keys(err).length === 0);
}
export {goldRowValidation,receiveRowValidation};