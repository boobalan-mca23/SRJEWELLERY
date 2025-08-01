import { useEffect, useState, useRef } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaCheck } from "react-icons/fa";
import { GrFormSubtract } from "react-icons/gr";
import {
  Autocomplete,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from "@mui/material";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import axios from "axios";
import "./SrReport.css";

const JobCardReport = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [jobCard, setJobCard] = useState([]);
  const [goldSmith, setGoldSmith] = useState([]);
  const [selectedGoldSmith, setSelectedGoldSmith] = useState({});
  const [page, setPage] = useState(0); // 0-indexed for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPrinting, setIsPrinting] = useState(true);
  const paginatedData = isPrinting
    ? jobCard
    : jobCard.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const reportRef = useRef();

  // Calculate totals for current page
  const currentPageTotal = paginatedData.reduce(
    (acc, job) => {
      acc.givenWt += job.jobCardTotal[0]?.givenWt || 0;
      acc.itemWt += job.jobCardTotal[0]?.itemWt || 0;
      acc.stoneWt += job.jobCardTotal[0]?.stoneWt || 0;
      acc.wastage += job.jobCardTotal[0]?.wastage || 0;
      acc.receive += job.jobCardTotal[0].receivedTotal;
      return acc;
    },
    { givenWt: 0, itemWt: 0, stoneWt: 0, wastage: 0,receive:0  }
  );

  const handleDownloadPdf = async () => {
    setIsPrinting(false); // show all rows
  const clearBtn = document.getElementById('clear');
  const printBtn = document.getElementById('print');
  const pagination=document.getElementById('pagination');

  clearBtn.style.visibility = 'hidden';
  printBtn.style.visibility="hidden";
  pagination.style.visibility="hidden";
    setTimeout(async () => {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "px", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("JobCard_Report.pdf");

      setIsPrinting(true);
       clearBtn.style.visibility = 'visible';
       printBtn.style.visibility="visible";
       pagination.style.visibility="visible";
       // restore pagination
    }, 1000); // delay to allow re-render
  };

  const handleDateClear = () => {
    setFromDate(null);
    setToDate(null);
  };

  const handleGoldSmith = (newValue) => {
    if (!newValue || newValue === null) {
      return;
    }
    setSelectedGoldSmith(newValue);

    const fetchJobCards = async () => {
      try {
        const from = fromDate ? fromDate.format("YYYY-MM-DD") : "";
        const to = toDate ? toDate.format("YYYY-MM-DD") : "";

        const response = await axios.get(
          `${BACKEND_SERVER_URL}/api/job-cards/${newValue.id}/goldsmithCard`,
          { params: { fromDate: from, toDate: to } }
        );
        console.log('data',response.data)
        setJobCard(response.data);

        setPage(0);
      } catch (error) {
        console.error("Error fetching goldsmith data:", error);
      }
    };
    fetchJobCards();
  };

  useEffect(() => {
    const fetchGoldsmiths = async () => {
      try {
        const response = await fetch(`${BACKEND_SERVER_URL}/api/goldsmith`);
        const data = await response.json();
        
        setGoldSmith(data || []);
      } catch (error) {
        console.error("Error fetching goldsmith data:", error);
      }
    };
    fetchGoldsmiths();
  }, []);

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div ref={reportRef}>
        <div>
          <h3 className="reportHead">SR Job Card Report</h3>
        </div>
        <div className={`report ${!isPrinting ? "print-mode" : ""}`}>
          {/* Date Pickers */}
            <label>From Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            
            <DemoContainer components={["DatePicker"]}>
            
              <DatePicker
                value={fromDate}
               
                onChange={(newValue) => setFromDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
           <label>To Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
             
              <DatePicker
                value={toDate}
            
                onChange={(newValue) => setToDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>

          {/* Autocomplete */}
          <Autocomplete
            disablePortal
            options={goldSmith}
            getOptionLabel={(option) => option.name || ""}
            sx={{ width: 300 }}
            value={selectedGoldSmith}
            onChange={(event, newValue) => handleGoldSmith(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select GoldSmith" />
            )}
          />

          {isPrinting && (
            <Button id="clear" className="clr noprint" onClick={handleDateClear}>
              Clear
            </Button>
          )}

          {isPrinting && (
            <div className="print-btn-wrapper noprint">
              <Button
              id="print"
                onClick={() => {
                  handleDownloadPdf();
                }}
              >
                Print
              </Button>
            </div>
          )}
        </div>
        {jobCard.length > 0 && jobCard.at(-1)?.jobCardTotal?.length > 0 && (
          <div className="jobInfo">
            {jobCard.at(-1).jobCardTotal[0].balance >= 0 ? 
            <span style={{color:"green"}}>Gold Smith Should Given {jobCard.at(-1).jobCardTotal[0].balance.toFixed(3)}g</span>:
              jobCard.at(-1).jobCardTotal[0].balance<0 ?  
             <span style={{color:"red"}}>Owner Should Given {jobCard
                    .at(-1)
                    .jobCardTotal[0].balance.toFixed(3)}g</span>
            :<span style={{color:"black"}}>balance 0</span>}

           
          </div>
        )}
        <div className="jobReportTable">
          {jobCard.length >= 1 ? (
            <Paper >
              <TableContainer className="reportContainer" >
                <Table>
                  <TableHead >
                    <TableRow >
                      <TableCell className="stickyHeader">S.No</TableCell>
                      <TableCell className="stickyHeader">Date</TableCell>
                      <TableCell className="stickyHeader">JobCard Id</TableCell>
                      <TableCell colSpan={5} className="stickyHeader">Given Wt</TableCell>
                      <TableCell colSpan={3} className="stickyHeader">Item Wt</TableCell>
                      <TableCell className="stickyHeader" rowSpan={2}>Stone Wt</TableCell>
                      <TableCell className="stickyHeader" rowSpan={2}>After Wastage</TableCell>
                      <TableCell className="stickyHeader" rowSpan={2}>Balance</TableCell>
                      <TableCell className="stickyHeader" colSpan={3}>ReceiveAmt</TableCell>
                      <TableCell className="stickyHeader" rowSpan={2}>Is Finished</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="stickyHeader"></TableCell>
                      <TableCell className="stickyHeader">Issue Date</TableCell>
                      <TableCell className="stickyHeader">Name</TableCell>
                      <TableCell className="stickyHeader">Weight</TableCell>
                      <TableCell className="stickyHeader">GivenTotal</TableCell>
                      <TableCell className="stickyHeader">Touch</TableCell>
                       <TableCell className="stickyHeader">Delivery Date</TableCell>
                      <TableCell className="stickyHeader">Name</TableCell>
                      <TableCell className="stickyHeader">Weight</TableCell>
                      <TableCell className="stickyHeader">Weight</TableCell>
                      <TableCell className="stickyHeader">Touch</TableCell>
                      <TableCell className="stickyHeader">ReceiveTotal</TableCell>
              
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map((job, jobIndex) => {
                      const given = job.givenGold;
                      const delivery = job.deliveryItem;
                      const receive=job.goldSmithReceived
                      const maxRows = Math.max(given?.length, delivery?.length,receive?.length) || 1;

                      return [...Array(maxRows)].map((_, i) => {
                       const g = given?.[i] || {};
                       const d = delivery?.[i] || {};
                       const r = receive?.[i] || {};
                       const total = job.jobCardTotal?.[0];

                        return (
                          <TableRow key={`${job.id}-${i}`}>
                            {i === 0 && (
                              <>
                                <TableCell rowSpan={maxRows}>
                                  {page * rowsPerPage + jobIndex + 1}
                                </TableCell>
                                <TableCell rowSpan={maxRows}>
                                  {new Date(job.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                                </TableCell>
                                <TableCell rowSpan={maxRows}>
                                  {job.id}
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                              {g?.createdAt
                            ? new Date(g?.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                            </TableCell>
                            <TableCell>{g?.itemName || "-"}</TableCell>
                            <TableCell>{g?.weight || "-"}</TableCell>
                          
                            {i === 0 && (
                              <TableCell rowSpan={maxRows}>
                                {total?.givenWt || "-"}
                              </TableCell>
                            )}
                            <TableCell>{g?.touch || "-"}</TableCell>
                               <TableCell>{d?.createdAt
                            ? new Date(d?.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "-"}</TableCell>
                            <TableCell>{d?.itemName || "-"}</TableCell>
                            <TableCell>{d?.weight || "-"}</TableCell>
                            {i === 0 && (
                              <>
                                <TableCell rowSpan={maxRows}>
                                  {(total?.stoneWt).toFixed(3) ?? "-"}
                                </TableCell>
                                <TableCell rowSpan={maxRows}>
                                  {(total?.wastage).toFixed(3) ?? "-"}
                                </TableCell>
                                 <TableCell rowSpan={maxRows}>
                                  {(total?.balance).toFixed(3) ?? "-"}
                                </TableCell>
                               </>
                            )} 
                            <TableCell >
                                 {r?.weight||"-"}
                                </TableCell>
                             <TableCell >
                                  {r?.touch||"-"}
                                </TableCell>   

                        {i===0 && (<>
                         <TableCell rowSpan={maxRows}>{total?.receivedTotal || "-"}</TableCell>
                         <TableCell rowSpan={maxRows}>
                                 {total.isFinished === "true" ? (
                                 <FaCheck />) : (<GrFormSubtract size={30} />)}
                                </TableCell>
                          </>)}
                            
                          </TableRow>
                        );
                      });
                    })}
                    <TableRow>
                      <TableCell colSpan={5}></TableCell>
                      <TableCell>
                        <strong>Total Given Weight:</strong>{" "}
                        {currentPageTotal.givenWt}
                      </TableCell>
                      <TableCell colSpan={4}></TableCell>
                      <TableCell>
                        <strong>Total Item Weight:</strong>{" "}
                        {currentPageTotal.itemWt.toFixed(3)}
                      </TableCell>
                      <TableCell>
                        <strong>Total Stone Weight:</strong>{" "}
                        {currentPageTotal.stoneWt.toFixed(3)}
                      </TableCell>
                      <TableCell>
                        <strong>Total Wastage:</strong>{" "}
                        {currentPageTotal.wastage.toFixed(3)}
                      </TableCell>
                      <TableCell colSpan={3}></TableCell>
                       <TableCell>
                        <strong>Total Received:</strong>{" "}
                        {currentPageTotal.receive.toFixed(3)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* MUI Table Pagination */}
              <TablePagination
                id="pagination"
                component="div"
                count={jobCard.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Paper>
          ) : (
            <span style={{ display: "block", textAlign: "center" }}>
              No JobCard For this GoldSmith
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default JobCardReport;
