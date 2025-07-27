const { PrismaClient } = require("@prisma/client");
const { all } = require("../Routes/jobcard.routes");
const prisma = new PrismaClient();

// const createJobCard = async (req, res) => {
//   try {
//     const { date, description, goldsmithId, items } = req.body;

//     if (!date || !goldsmithId || !items || items.length === 0) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const goldsmithExists = await prisma.goldsmith.findUnique({
//       where: { id: parseInt(goldsmithId) },
//     });

//     if (!goldsmithExists) {
//       return res.status(400).json({ error: "Goldsmith not found" });
//     }

//     const jobCard = await prisma.jobCard.create({
//       data: {
//         date: new Date(date),
//         description: description || null,
//         goldsmithId: parseInt(goldsmithId),
//         items: {
//           create: items.map((item) => ({
//             masterItemId: parseInt(item.selectedItem),
//             originalGivenWeight: parseFloat(item.originalGivenWeight),
//             givenWeight: parseFloat(item.givenWeight),
//             touch: parseFloat(item.touch),
//             estimateWeight: parseFloat(item.estimateWeight),
//           })),
//         },
//       },
//       include: {
//         items: true,
//         goldsmith: true,
//       },
//     });

//     res.status(201).json(jobCard);
//   } catch (error) {
//     console.error("Error creating job card:", error);
//     res.status(500).json({
//       error: "Failed to create job card",
//       details: error.message,
//     });
//   }
// };

// const updateJobCardItem = async (req, res) => {
//   const { itemId } = req.params;

//   if (!itemId || isNaN(itemId)) {
//     return res.status(400).json({ error: "Invalid item ID" });
//   }

//   const { finalWeight, wastage, purity, additionalWeights } = req.body;

//   try {
//     const updatedItem = await prisma.item.update({
//       where: {
//         id: parseInt(itemId),
//       },
//       data: {
//         finalWeight: finalWeight ? parseFloat(finalWeight) : null,
//         wastage: wastage ? parseFloat(wastage) : null,
//         purity: purity ? parseFloat(purity) : null,
//         additionalWeights: additionalWeights
//           ? {
//               createMany: {
//                 data: additionalWeights.map((weight) => ({
//                   name: weight.name,
//                   weight: parseFloat(weight.weight),
//                   operators: weight.operators,
//                 })),
//               },
//             }
//           : undefined,
//       },
//       include: {
//         additionalWeights: true,
//       },
//     });
//     res.json(updatedItem);
//   } catch (error) {
//     console.error("Error updating job card item:", error);
//     res.status(500).json({ error: "Failed to update job card item" });
//   }
// };

// const getJobCardById = async (req, res) => {
//   const { id } = req.params;

//   if (!id || isNaN(parseInt(id))) {
//     return res.status(400).json({ error: "Invalid job card ID" });
//   }

//   try {
//     const jobCard = await prisma.jobCard.findUnique({
//       where: { id: parseInt(id) },
//       include: {
//         goldsmith: true,
//         items: { include: { masterItem: true, additionalWeights: true } },
//       },
//     });

//     if (!jobCard) {
//       return res.status(404).json({ error: "Job card not found" });
//     }
//     console.log("Fetched Job Card:", {
//       id: jobCard.id,
//       goldsmithId: jobCard.goldsmithId,
//       goldsmithName: jobCard.goldsmith?.name,
//     });

//     res.json(jobCard);
//   } catch (error) {
//     console.error("Error fetching job card:", error);
//     res.status(500).json({ error: "Failed to fetch job card" });
//   }
// };

// const getAllJobCards = async (req, res) => {
//   try {
//     const jobCards = await prisma.jobCard.findMany({
//       include: {
//         goldsmith: true,
//         items: { include: { masterItem: true, additionalWeights: true } },
//       },
//       orderBy: {
//         date: "desc",
//       },
//     });
//     res.json(jobCards);
//   } catch (error) {
//     console.error("Error fetching all job cards:", error);
//     res.status(500).json({ error: "Failed to fetch all job cards" });
//   }
// };

// module.exports = {
//   createJobCard,
//   updateJobCardItem,
//   getJobCardById,
//   getAllJobCards,
// };




// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// const createJobCard = async (req, res) => {
//   try {
//     console.log("its a new commit");
//     const { id, date, description, goldsmithId, items } = req.body;

//     if (!date || !goldsmithId || !items || items.length === 0) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const goldsmithExists = await prisma.goldsmith.findUnique({
//       where: { id: parseInt(goldsmithId) },
//     });

//     if (!goldsmithExists) {
//       return res.status(400).json({ error: "Goldsmith not found" });
//     }

//     let jobCardExists;

//     if (id) {
//       jobCardExists = await prisma.jobCard.findUnique({
//         where: { id: parseInt(id) },
//       });
//     }

//     let jobCard;

//     if (jobCardExists) {
//       jobCard = await prisma.item.create({
//         data: {
//           jobCardId: parseInt(id),
//           masterItemId: parseInt(items[0].selectedItem),
//           originalGivenWeight: parseFloat(items[0].originalGivenWeight),
//           givenWeight: parseFloat(items[0].givenWeight),
//           touch: parseFloat(items[0].touch),
//           estimateWeight: parseFloat(items[0].estimateWeight),
//         },
//       });
//     } else {
//       jobCard = await prisma.jobCard.create({
//         data: {
//           date: new Date(date),
//           description: description || null,
//           goldsmithId: parseInt(goldsmithId),
//           items: {
//             create: items.map((item) => ({
//               masterItemId: parseInt(item.selectedItem),
//               originalGivenWeight: parseFloat(item.originalGivenWeight),
//               givenWeight: parseFloat(item.givenWeight),
//               touch: parseFloat(item.touch),
//               estimateWeight: parseFloat(item.estimateWeight),
//             })),
//           },
//         },
//         include: {
//           items: true,
//           goldsmith: true,
//         },
//       });
//     }

//     res.status(201).json(jobCard);
//   } catch (error) {
//     console.error("Error creating job card:", error);
//     res.status(500).json({
//       error: "Failed to create job card",
//       details: error.message,
//     });
//   }
// };

// const updateJobCardItem = async (req, res) => {
//   const { itemId } = req.params;

//   if (!itemId || isNaN(itemId)) {
//     return res.status(400).json({ error: "Invalid item ID" });
//   }

//   const { finalWeight, wastage, purity, additionalWeights } = req.body;

//   try {
//     const updatedItem = await prisma.item.update({
//       where: {
//         id: parseInt(itemId),
//       },
//       data: {
//         finalWeight: finalWeight ? parseFloat(finalWeight) : null,
//         wastage: wastage ? parseFloat(wastage) : null,
//         purity: purity ? parseFloat(purity) : null,
//         additionalWeights: additionalWeights
//           ? {
//               createMany: {
//                 data: additionalWeights.map((weight) => ({
//                   name: weight.name,
//                   weight: parseFloat(weight.weight),
//                   operators: weight.operators,
//                 })),
//               },
//             }
//           : undefined,
//       },
//       include: {
//         additionalWeights: true,
//       },
//     });
//     res.json(updatedItem);
//   } catch (error) {
//     console.error("Error updating job card item:", error);
//     res.status(500).json({ error: "Failed to update job card item" });
//   }
// };

// const getJobCardById = async (req, res) => {
//   const { id } = req.params;

//   if (!id || isNaN(parseInt(id))) {
//     return res.status(400).json({ error: "Invalid job card ID" });
//   }

//   try {
//     const jobCard = await prisma.jobCard.findMany({
//       where: { goldsmithId: parseInt(id) },
//       include: {
//         goldsmith: true,
//         items: { include: { masterItem: true, additionalWeights: true } },
//       },
//     });

//     if (!jobCard) {
//       return res.status(404).json({ error: "Job card not found" });
//     }
//     /*  console.log("Fetched Job Card:", {
//       id: jobCard.id,
//       goldsmithId: jobCard.goldsmithId,
//       goldsmithName: jobCard.goldsmith?.name,
//     });
//  */
//     res.json(jobCard);
//   } catch (error) {
//     console.error("Error fetching job card:", error);
//     res.status(500).json({ error: "Failed to fetch job card" });
//   }
// };

// const getAllJobCards = async (req, res) => {
//   try {
//     const jobCards = await prisma.jobCard.findMany({
//       include: {
//         goldsmith: true,
//         items: { include: { masterItem: true, additionalWeights: true } },
//       },
//       orderBy: {
//         date: "desc",
//       },
//     });
//     res.json(jobCards);
//   } catch (error) {
//     console.error("Error fetching all job cards:", error);
//     res.status(500).json({ error: "Failed to fetch all job cards" });
//   }
// };

// module.exports = {
//   createJobCard,
//   updateJobCardItem,
//   getJobCardById,
//   getAllJobCards,
// };


//createJobCard

 const clearBalance=async(goldSmithId,receivedTotal)=>{
     let receivedAmount=receivedTotal;
     console.log('receive',receivedTotal)

     let jobCardTotal=await prisma.jobcardTotal.findMany({
      where:{
        goldsmithId:parseInt(goldSmithId),
        isFinished:"false" 
        }
    })
    
    if (jobCardTotal.length >= 1) {
         // Helper function to update jobcard
        const updateJobCard = async (id, data) =>{
          await prisma.jobcardTotal.update({  where: { id:id },data:{balance:data.balance,isFinished:data.isFinished}})
        // again we need to fetch updated data
           jobCardTotal=await prisma.jobcardTotal.findMany({where:{goldsmithId:parseInt(goldSmithId),isFinished:"false"}})

        }

        // Helper function to update next jobs' balances
           const updateNextJobs = async () => {
               console.log('updatedJobcards',jobCardTotal)

            for (let i = 0; i < jobCardTotal.length; i++) {
                const current = jobCardTotal[i];
                const prev = await prisma.jobcardTotal.findUnique({where:{id:jobCardTotal[i].id-1}})
                 console.log('prevJob',prev)
               
                console.log('currGiven and prevBal',current.givenWt , prev.balance)
                let nextBalance=((current.givenWt + prev.balance)-current.wastage).toFixed(3)
                 const next= await prisma.jobcardTotal.update({
                    where: { id: current.id },
                         data: {
                          openBal:parseFloat(prev.balance),
                          balance:parseFloat(nextBalance)
                     }
                   });
                   console.log('updatedNext',next)
            }
          };
            while (jobCardTotal.length>0 && receivedAmount > 0) {
                      let item = jobCardTotal[0];

                  if (item.givenWt >= 0.001 || item.itemWt >= 0.001 || item.balance>0 ) {
                    // This Time we close the balance
                          if (receivedAmount >= item.balance) {
                                await updateJobCard(item.id, { balance: 0, isFinished: "true" });
                                receivedAmount = parseFloat((receivedAmount - item.balance).toFixed(3));
                                console.log('AfterReceived',receivedAmount)  
                                await updateNextJobs();
                              
                // Re-fetch updated jobCardTotal to get fresh balances
                            jobCardTotal = await prisma.jobcardTotal.findMany({
                              where: { goldsmithId: parseInt(goldSmithId), isFinished: "false" },
                            });
                   } 
                else { // if we have extra amount its stored after the subtract value
             await updateJobCard(item.id, { 
              balance: parseFloat((item.balance - receivedAmount).toFixed(3)), 
              isFinished: "false" 
              });
              // await prisma.jobCardReceived.update({
              //   where:{
              //   jobcardId:item.id
              // },
              //   data:{
              //     received:parseFloat((item.balance - receivedAmount).toFixed(3)),
              //   }})
      receivedAmount = 0;
      await updateNextJobs();
      break;
    }
  }

}
    if(receivedAmount>0){  // maybe we have extra balance we store to last jobcard
            let lastJobCard=await prisma.jobcardTotal.findMany()
            let last=lastJobCard.at(-1)
            await prisma.jobcardTotal.update({where:{id:last.id},data:{balance:(-receivedAmount)}})
          }}
      }




const createJobCard = async (req, res) => {
  const { goldsmithId,goldRows,total,receivedAmount,goldSmithBalance} = req.body;

  try {
    //  Validate Goldsmith
    const goldsmithInfo = await prisma.goldsmith.findUnique({
       where: { id: parseInt(goldsmithId) },
    });

    if (!goldsmithInfo) {
      return res.status(404).json({ error: "Goldsmith not found" });
    }

    if (goldRows.length < 1) {
      return res.status(400).json({ error: "Given gold data is required" });
    }
    // recevied Amount
    let receivedAmountArr;
    if(receivedAmount.length>=1){
      receivedAmountArr = receivedAmount.map((item) => ({
      weight: parseFloat(item.weight),
      touch: parseFloat(item.touch)||null,
      
      
    }));
    }

    // GivenGold data
    const givenGoldArr = goldRows.map((item) => ({
     
      itemName: item.itemName || null,
      weight:parseFloat(item.weight),
      touch: parseFloat(item.touch)||null,
      
    }));

   // Job Card Total
    const jobCardTotal={
       "goldsmithId":parseInt(goldsmithId),
       "givenWt" :parseFloat(total?.givenWt)||0,
       "itemWt"  :parseFloat(total?.itemWt)||0, 
       "stoneWt" :parseFloat(total?.stoneWt)||0,
       "wastage" :parseFloat(total?.wastage)||0,
       "balance" :parseFloat(total?.balance)||0,
       "openBal" :parseFloat(total?.openBal)||0,
       "isFinished" :"false"

    }
    // update GoldSmith balance
    const goldSmithBalanceAmt=await prisma.goldSmithBalance.update({
      where:{
        id:goldSmithBalance?.id
      },
      data:{
        balance:parseFloat(goldSmithBalance?.balance)
      }
    })
    // Create JobCard with nested Tables
   await prisma.jobCard.create({
           data: {
            goldsmithId: parseInt(goldsmithId),
            givenGold: {
               create: givenGoldArr,
             },
           jobCardTotal: {
             create: jobCardTotal,
           },
            goldSmithReceived: {
            create: receivedAmountArr,
            },
           JobCardReceived: {
             create: {
              goldsmithId: parseInt(goldsmithId),
              balance: jobCardTotal.balance,
              received: 0,
           
          },
    },
  },
});


    // clear jobcard balance 

       let receiveTotal=0;
          if(receivedAmount.length>=1){
            receiveTotal = receivedAmount.reduce((acc,item)=>{
            return acc+Number(item.weight)||0
      },0)
        await clearBalance(goldsmithId,parseFloat(receiveTotal));
    }
    


    // //  Fetch and return all JobCards for this goldsmith
    const allJobCards = await prisma.jobCard.findMany({
      where: {
        goldsmithId: parseInt(goldsmithId),
      },
      include: {
        givenGold: true,
        deliveryItem: true,
        additionalWeight: true,
        jobCardTotal:true,
        goldSmithReceived:true,
        JobCardReceived:true
       },
     
    }); 
    let jobCardLength=await prisma.jobCard.findMany()
          
     console.log('createdJobCards',allJobCards)
    return res.status(200).json({
      message: "JobCard created successfully",
      jobCards: allJobCards,
      goldSmithBalance:goldSmithBalanceAmt,
      jobCardLength:jobCardLength.length+1
    });
  } catch (err) {
    console.error("Create JobCard Error:", err);
    return res.status(500).json({ error: err.message });
  }
};



//update Jobcard 

const updateJobCard = async (req, res) => {
  const {goldSmithId,jobCardId}=req.params
  const {goldRows =[],itemRow=[],deductionRows=[],total,receivedAmount,goldSmithBalance} = req.body;
  console.log('update id',req.body)

  try {
    //  Validate Goldsmith
    const goldsmithInfo = await prisma.goldsmith.findUnique({
      where: { id: parseInt(goldSmithId) },
    });

    if (!goldsmithInfo) {
      return res.status(404).json({ error: "Goldsmith not found" });
    }

    if (goldRows.length < 1) {
      return res.status(400).json({ error: "Jobcard information is required" });
    }
    if(!total){
      return res.status(400).json({ error: "Total information is required" });
    }
    // update GoldSmith balance
    const goldSmithInfo=await prisma.goldSmithBalance.update({
      where:{
        id:goldSmithBalance?.id
      },
      data:{
        balance:parseFloat(goldSmithBalance?.balance)
      }
    })
    // update total values
   await prisma.jobcardTotal.update({
        where:{
          id:total?.id
        },
        data:{
          givenWt:parseFloat(total?.givenWt)||0,
          itemWt: parseFloat(total?.itemWt)||0,
          stoneWt:parseFloat(total?.stoneWt)||0,
          wastage:parseFloat(total?.wastage)||0,
          balance:parseFloat(total?.balance)||0,
          openBal:parseFloat(total?.openBal)||0
        }
    })
    // this is used for jobcard balance
    await prisma.jobCardReceived.update({where:{id:parseInt(jobCardId)},data:{balance:total?.balance,received:total?.balance}})
    
    
    for(const gold of goldRows){
      if(gold?.id){ //if id is there update or create
           await prisma.givenGold.update({
              where:{
               id:gold.id,
            },
          data:{
            itemName:gold.itemName|| null,
            weight:parseFloat(gold.weight),
            touch: parseFloat(gold.touch),
           }
        })
      }else{
        await prisma.givenGold.create({
         data:{
            jobcardId:parseInt(jobCardId),
            itemName:gold.itemName|| null,
            weight: parseFloat(gold.weight),
            touch: parseFloat(gold.touch),
           }
        })
      }
        
    }
      if(itemRow.length>=1){
        for(const item of itemRow){
          if(item?.id){ //if id is there update or create
           await prisma.deliveryItem.update({
              where:{
               id:item.id,
           },
          data:{
            itemName:item.itemName|| null,
            weight: parseFloat(item.weight),
           
          }
        })
      }else{
        await prisma.deliveryItem.create({
            data:{
            jobcardId:parseInt(jobCardId),
            itemName:item.itemName|| null,
            weight: parseFloat(item.weight),   
           }
        })
      }
        
    }
  }
     if(deductionRows.length>=1){
           for(const item of deductionRows){
      if(item?.id){ //if id is there update or create
           await prisma.additionalWeight.update({
              where:{
               id:item.id,
             
          },
          data:{
            type:item.type|| null,
            customType:item.customType||null,
            weight: parseFloat(item.weight),
           
          }
        })
      }else{
        await prisma.additionalWeight.create({
            data:{
            jobcardId:parseInt(jobCardId),
            type:item.type|| null,
            customType:item.customType||null,
            weight: parseFloat(item.weight),   
            
           }
        })
      }
        
    }
     }
     
     // update next jobCard openBal
       let goldSmithJob=await prisma.jobcardTotal.findMany({
      where:{
        id:{gte:total?.id},
        goldsmithId:parseInt(goldSmithId)
      }
    })
  
    while(goldSmithJob.length!=1){
         const prevJob=goldSmithJob[0]
        const currentJob=goldSmithJob[1]
   
       await prisma.jobcardTotal.update({
              where:{
                id:currentJob.id,
                goldsmithId:parseFloat(goldSmithId)
              },
           data:{ 
             openBal:prevJob.balance,
             balance:(currentJob.givenWt+prevJob.balance)-currentJob.wastage
            }
        })
    
     goldSmithJob=await prisma.jobcardTotal.findMany({
         where:{
          id:{gt:prevJob.id},
          goldsmithId:parseFloat(goldSmithId)
      }
    })
      
    }
    // received Amount save
    
  if (receivedAmount.length >= 1) {
    for (const item of receivedAmount) {
    const data = {
      jobCardId: parseInt(jobCardId),
      weight: parseFloat(item.weight) || 0,
      touch: parseFloat(item.touch) || null,
    };

    if (item.id) {
      await prisma.goldSmithReceived.update({
        where: { id: parseInt(item.id) },
        data,
      });
    } else {
      await prisma.goldSmithReceived.create({ data });
    }
  }
}  

    // clear jobcard balance 

       let receiveTotal=0;
          if(receivedAmount.length>=1){
            receiveTotal = receivedAmount.reduce((acc,item)=>{
            return acc+Number(item.weight)||0
      },0)
        await clearBalance(goldSmithId,parseFloat(receiveTotal));
    }
    //  Fetch and return all JobCards for this goldsmith
    const allJobCards = await prisma.jobCard.findMany({
      where: {
        goldsmithId: parseInt(goldSmithId),
      },
      include: {
        givenGold: true,
        deliveryItem: true,
        additionalWeight: true,
        jobCardTotal:true,
        goldSmithReceived:true,
        JobCardReceived:true
      },
     
    });
    let jobCardLength=await prisma.jobCard.findMany()
    return res.status(200).json({
      message: "JobCard Updated successfully",
      jobCards: allJobCards,
      goldSmithBalance:goldSmithInfo,
      jobCardLength:jobCardLength.length+1
    });
  } catch (err) {
    console.error("Create JobCard Error:", err);
    return res.status(500).json({ error: err.message });
  }
};




const getPreviousJobCardBal=async(req,res)=>{
     const{id}=req.params
     
     try{
        const jobCards = await prisma.jobcardTotal.findMany({
            where:{
            goldsmithId:parseInt(id)
           }
        });
       
        if(jobCards.length>=1){
           const jobCard=jobCards.at(-1)
           
            res.status(200).json({"status":"balance",balance:jobCard.balance})
        }else{
          res.status(200).json({"status":"nobalance",balance:0})
        }
        
      }catch(err){
         console.error("Previous Balance Error:", err);
         return res.status(500).json({ error: err.message });
      
     }
     
   
}





const getJobCardById=async(req,res)=>{
    const {id}=req.params
   try{
    
      const goldSmithInfo = await prisma.jobCard.findUnique({where:{id:parseInt(id)}}); 

        if (!goldSmithInfo) {
         return res.status(404).json({ error: "Job Card not found" }); 
        }
      
      
        const jobCardInfo=await prisma.jobCard.findMany({
          where:{
            id:parseInt(id)
          },
          include:{
            goldsmith:true,
            givenGold:true,
            deliveryItem:true,
            additionalWeight:true,
            goldSmithReceived:true,
            jobCardTotal:true,
            JobCardReceived:true
           }
        })
        const jobCardTotal= await prisma.jobcardTotal.findMany({
            where:{
              id:parseInt(id-1)
            }
        })
        let balance=parseInt(id)===1 ? 0 :jobCardTotal[0].balance
       return res.status(200).json({"jobcard":jobCardInfo,"jobCardBalance":balance})

      } catch(err){
      return res.status(500).json({err:"Server Error"})
   }
     
   
   


}

 // getAllJobCardByGoldsmithId
const getAllJobCardByGoldsmithId = async (req, res) => {
  try {
    const { id } = req.params;
    const goldsmithInfo = await prisma.goldsmith.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        goldSmithBalance: true, 
      },
    });

    if (!goldsmithInfo) {
      return res.status(404).json({ error: "Goldsmith not found" });
    }

    const allJobCards = await prisma.jobCard.findMany({
      where: {
        goldsmithId: parseInt(id),
      },
      include: {
        givenGold: true,
        deliveryItem: true,
        additionalWeight: true,
        jobCardTotal:true,
        goldSmithReceived:true,
        JobCardReceived:true
      },
     
    });
    let jobCardLength=await prisma.jobCard.findMany()

    return res.status(200).json({
      goldsmith: {
        id: goldsmithInfo.id,
        name: goldsmithInfo.name,
        address:goldsmithInfo.address,
        phoneNo:goldsmithInfo.phone,
        wastage: goldsmithInfo.wastage,
        balance: goldsmithInfo.goldSmithBalance, // can be an array
      },
      jobCards: allJobCards,
      jobCardLength:jobCardLength.length+1
    });
  } catch (err) {
    console.error("Error fetching job card info:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};


const formatDate = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

const jobCardFilter = async (req, res) => {
  const { fromDate, toDate } = req.query;
  const { id } = req.params;
  console.log('reqquery',req.query)

  try {
    let whereCondition = {};

    // If id exists and not "null", add goldsmith filter
    if (id && id !== "null") {
      whereCondition.goldsmithId = parseInt(id);
    }

    // If fromDate and toDate exist and not "null", add date filter
    if (fromDate && toDate && fromDate !== "null" && toDate !== "null") {
      const parsedFromDate = new Date(formatDate(fromDate));
      const parsedToDate = new Date(formatDate(toDate));

      // Adjust toDate to include the entire day
      parsedToDate.setHours(23, 59, 59, 999);

      if (isNaN(parsedFromDate.getTime()) || isNaN(parsedToDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      whereCondition.createdAt = {
        gte: parsedFromDate,
        lte: parsedToDate,
      };
    }

    // If both id = null and dates = null → whereCondition = {} (fetch all)
    const filterJobCards = await prisma.jobCard.findMany({
      where: whereCondition,
      include: {
        goldsmith:true,
        givenGold: true,
        deliveryItem: true,
        additionalWeight: true,
        jobCardTotal: true,
       
      },
    });

    res.json(filterJobCards);
  } catch (error) {
    console.error("Error filtering job cards:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};






 module.exports={createJobCard,
  updateJobCard,
  getAllJobCardByGoldsmithId,
  getPreviousJobCardBal,getJobCardById,
jobCardFilter}