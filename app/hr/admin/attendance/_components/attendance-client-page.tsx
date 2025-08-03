"use client";

import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, AlertTriangle, Search } from "lucide-react";
import { saveAttendanceRecords } from "../actions";
import { attendanceRowSchema, ParsedAttendanceRecord } from "../schema";

type AttendanceClientPageProps = {
  previousAttendances?: ParsedAttendanceRecord[];
};

export function AttendanceClientPage({
  previousAttendances = [],
}: AttendanceClientPageProps) {
  const [records, setRecords] =
    useState<ParsedAttendanceRecord[]>(previousAttendances);
  const [isInitialData, setIsInitialData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success?: string;
    error?: string;
  } | null>(null);

  // Helper function to format punch time for display
  function formatPunchTime(punch: number | string): string {
    if (typeof punch === "string") {
      return punch; // Already formatted
    }
    if (typeof punch !== "number" || punch < 0 || punch > 1) {
      return "Invalid Time";
    }
    // Convert fraction of a day to HH:MM AM/PM
    const totalSeconds = Math.round(punch * 86400);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Memoized values for performance
  const availableYears = useMemo(() => {
    const years = new Set(
      records
        .map((r) => {
          const date = new Date(r.Date);
          return !isNaN(date.getTime()) ? date.getFullYear().toString() : "";
        })
        .filter(Boolean)
    );
    return ["all", ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return records.filter((record) => {
      const recordDate = new Date(record.Date);
      if (isNaN(recordDate.getTime())) return false;

      const yearMatch =
        yearFilter === "all" ||
        recordDate.getFullYear().toString() === yearFilter;
      const monthMatch =
        monthFilter === "all" ||
        (recordDate.getMonth() + 1).toString() === monthFilter;

      const searchMatch =
        searchQuery === "" ||
        record["Employee ID"].toString().toLowerCase().includes(lowercasedQuery) ||
        record["First Name"].toLowerCase().includes(lowercasedQuery) ||
        record.Department.toLowerCase().includes(lowercasedQuery);

      return yearMatch && monthMatch && searchMatch;
    });
  }, [records, yearFilter, monthFilter, searchQuery]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [yearFilter, monthFilter, searchQuery, itemsPerPage]);

  // File Upload Handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSubmissionStatus(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawData.length < 2) {
            throw new Error("Excel file must have at least 2 rows (header + data).");
        }

        const headers = rawData[0] as string[];
        const expectedHeaders = ["Employee ID", "First Name", "Department", "Date", "Weekday", "First Punch", "Last Punch"];
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
        }

        const dataRows = rawData.slice(1) as any[][];

        const parsedData = dataRows.map((row, rowIndex) => {
            const rowObj: any = {};
            headers.forEach((header, colIndex) => {
                rowObj[header] = row[colIndex];
            });

            // Handle Excel date serial number
            const dateValue = rowObj["Date"];
            let parsedDate;
            if (typeof dateValue === 'number') {
                parsedDate = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
            } else if (typeof dateValue === 'string') {
                parsedDate = new Date(dateValue);
            } else {
                 throw new Error(`Invalid date format in row ${rowIndex + 2}. Date must be a number or a string.`);
            }

            if (isNaN(parsedDate.getTime())) {
                throw new Error(`Invalid or empty date found in row ${rowIndex + 2}`);
            }

            const parsedRow = {
                "Employee ID": Number(rowObj["Employee ID"]),
                "First Name": rowObj["First Name"],
                Department: rowObj["Department"],
                Date: parsedDate,
                Weekday: rowObj["Weekday"],
                "First Punch": rowObj["First Punch"],
                "Last Punch": rowObj["Last Punch"],
            };

            const validation = attendanceRowSchema.safeParse(parsedRow);
            if (!validation.success) {
                const errorField = validation.error.issues[0].path.join(".");
                const errorMessage = validation.error.issues[0].message;
                throw new Error(
                `Validation error in row ${rowIndex + 2}: [${errorField}] - ${errorMessage}`
                );
            }
            return validation.data;
        });

        setRecords(parsedData as ParsedAttendanceRecord[]);
        setIsInitialData(false);
        setCurrentPage(1);
        setYearFilter("all");
        setMonthFilter("all");
        setSearchQuery("");
      } catch (err: any) {
        console.error("Parsing error:", err);
        setError(`Failed to parse Excel file. ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Data Submission Handler
  const handleSubmit = async () => {
    if (records.length === 0 || isInitialData) {
      setError("No new records from an uploaded file to submit.");
      return;
    }
    setIsSubmitting(true);
    setSubmissionStatus(null);
    try {
      const result = await saveAttendanceRecords(records);
      if (result.error) {
        setSubmissionStatus({ error: result.error });
      } else {
        setSubmissionStatus({ success: result.success });
        setRecords([]);
        setIsInitialData(true);
      }
    } catch (err) {
      setSubmissionStatus({
        error: "An unexpected error occurred during submission.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Import Attendance
        </h1>
        <p className="text-neutral-500">
          Upload an Excel sheet to add new records, or view previously imported
          attendance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-neutral-50">
        <div>
          <label htmlFor="file-upload" className="font-medium">
            Upload New Excel File
          </label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            className="mt-1"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Required headers: Employee ID, First Name, Department, Date,
            Weekday, First Punch, Last Punch.
          </p>
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || records.length === 0 || isInitialData}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Save Records to Database"
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-5 w-5" /> <p>{error}</p>
        </div>
      )}
      {submissionStatus?.error && (
        <div className="flex items-center gap-2 text-red-600 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-5 w-5" /> <p>{submissionStatus.error}</p>
        </div>
      )}
      {submissionStatus?.success && (
        <div className="flex items-center gap-2 text-green-600 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5" /> <p>{submissionStatus.success}</p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {isInitialData
            ? "Previous Attendance Records"
            : "Uploaded Records Preview"}
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                    type="search"
                    placeholder="Search by ID, Name, Dept..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-full md:w-[250px]"
                />
            </div>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === "all" ? "All Years" : year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Weekday</TableHead>
                <TableHead>First Punch</TableHead>
                <TableHead>Last Punch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, index) => (
                  <TableRow
                    key={`${record["Employee ID"]}-${record.Date.toString()}-${index}`}
                  >
                    <TableCell>{record["Employee ID"]}</TableCell>
                    <TableCell>{record["First Name"]}</TableCell>
                    <TableCell>{record.Department}</TableCell>
                    <TableCell>
                      {new Date(record.Date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{record.Weekday}</TableCell>
                    <TableCell>
                      {formatPunchTime(record["First Punch"])}
                    </TableCell>
                    <TableCell>
                      {formatPunchTime(record["Last Punch"])}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    {searchQuery && filteredRecords.length === 0
                      ? "No records match your search."
                      : records.length === 0
                      ? "No records to display. Upload a file to begin."
                      : "No records match the current filters."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredRecords.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span>Rows per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-neutral-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}