import { useEffect, useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
  Paper
} from '@mui/material';
import { BACKEND_SERVER_URL } from "../../Config/Config";
import axios from "axios";
import './SrReport.css';

const JobCardReport = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [jobCard, setJobCard] = useState([]);
  const [goldSmith, setGoldSmith] = useState([]);
  const [selectedGoldSmith, setSelectedGoldSmith] = useState({ id: null, name: "ALL" });
  const [page, setPage] = useState(0); // 0-indexed for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedData = jobCard.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


// Calculate totals for current page
const currentPageTotal = paginatedData.reduce(
  (acc, job) => {
    acc.givenWt += job.jobCardTotal[0]?.givenWt || 0;
    acc.itemWt += job.jobCardTotal[0]?.itemWt || 0;
    acc.stoneWt += job.jobCardTotal[0]?.stoneWt || 0;
    acc.wastage += job.jobCardTotal[0]?.wastage || 0;
    return acc;
  },
  { givenWt: 0, itemWt: 0, stoneWt: 0, wastage: 0 }
);


  const handleDateClear = () => {
    setFromDate(null);
    setToDate(null);
  };

  const handleGoldSmith = (newValue) => {
    if (newValue && newValue.id === null) {
      setSelectedGoldSmith({ id: null, name: "ALL" });
    } else {
      setSelectedGoldSmith(newValue);
    }

    const fetchJobCards = async () => {
      try {
        const from = fromDate ? fromDate.format("YYYY-MM-DD") : "";
        const to = toDate ? toDate.format("YYYY-MM-DD") : "";

        const response = await axios.get(
          `${BACKEND_SERVER_URL}/api/job-cards/${newValue.id}/goldsmithCard`,
          { params: { fromDate: from, toDate: to } }
        );

        setJobCard(response.data);
        handleTotalCalculation(response.data || []);
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
        const allOption = { id: null, name: "ALL" };
        setGoldSmith([allOption, ...data]);
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
      <div>
        <h3 className="reportHead">Job Card Report</h3>
      </div>
      <div className="report">
        {/* Date Pickers */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker value={fromDate} label="From Date" onChange={(newValue) => setFromDate(newValue)} />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker value={toDate} label="To Date" onChange={(newValue) => setToDate(newValue)} />
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
          renderInput={(params) => <TextField {...params} label="Select GoldSmith" />}
        />

        <Button className="clrBtn" onClick={handleDateClear}>Clear</Button>
      </div>

      <div className="jobcardTable">
        {jobCard.length >= 1 ? (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="jobCardHead">
                    <TableCell rowSpan={2}>S.No</TableCell>
                    <TableCell rowSpan={2}>Date</TableCell>
                    <TableCell rowSpan={2}>JobCard Id</TableCell>
                    <TableCell colSpan={5}>Given Wt</TableCell>
                    <TableCell colSpan={2}>Item Wt</TableCell>
                    <TableCell rowSpan={2}>Stone Wt</TableCell>
                    <TableCell rowSpan={2}>After Wastage</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Item Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>GivenTotal</TableCell>
                    <TableCell>Touch</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Weight</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((job, jobIndex) => {
                    const given = job.givenGold;
                    const delivery = job.deliveryItem;
                    const maxRows = Math.max(given.length, delivery.length) || 1;

                    return [...Array(maxRows)].map((_, i) => {
                      const g = given[i];
                      const d = delivery[i];
                      const total = job.jobCardTotal?.[0];

                      return (
                        <TableRow key={`${job.id}-${i}`}>
                          {i === 0 && (
                            <>
                              <TableCell rowSpan={maxRows}>{page * rowsPerPage + jobIndex + 1}</TableCell>
                              <TableCell rowSpan={maxRows}>
                                {new Date(job.createdAt).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </TableCell>
                              <TableCell rowSpan={maxRows}>{job.id}</TableCell>
                            </>
                          )}
                          <TableCell>{g?.createdAt ? new Date(g?.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }) : "-"}</TableCell>
                          <TableCell>{g?.itemName || "-"}</TableCell>
                          <TableCell>{g?.weight || "-"}</TableCell>
                          {i === 0 && <TableCell rowSpan={maxRows}>{total?.givenWt || "-"}</TableCell>}
                          <TableCell>{g?.touch || "-"}</TableCell>
                          <TableCell>{d?.itemName || "-"}</TableCell>
                          <TableCell>{d?.weight || "-"}</TableCell>
                          {i === 0 && (
                            <>
                              <TableCell rowSpan={maxRows}>{(total?.stoneWt).toFixed(3) ?? "-"}</TableCell>
                              <TableCell rowSpan={maxRows}>{(total?.wastage).toFixed(3) ?? "-"}</TableCell>
                            </>
                          )}
                        </TableRow>
                      );
                    });
                  })}
                  <TableRow>
                    <TableCell colSpan={5}></TableCell>
                    <TableCell><strong>Total Given Weight:</strong> {currentPageTotal.givenWt}</TableCell>
                    <TableCell colSpan={3}></TableCell>
                    <TableCell><strong>Total Item Weight:</strong> {(currentPageTotal.itemWt).toFixed(3)}</TableCell>
                    <TableCell><strong>Total Stone Weight:</strong> {(currentPageTotal.stoneWt).toFixed(3)}</TableCell>
                    <TableCell><strong>Total Wastage:</strong> {(currentPageTotal.wastage).toFixed(3)}</TableCell>
                  </TableRow>
                  
                </TableBody>
              </Table>
            </TableContainer>

            {/* MUI Table Pagination */}
            <TablePagination
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
          <span style={{ display: "block", textAlign: "center" }}>No JobCard For this GoldSmith</span>
        )}
      </div>
    </>
  );
};

export default JobCardReport;
