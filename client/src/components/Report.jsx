import React from "react";

const Report = () => {
  const downloadReport = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/expenses/report", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expense-report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <div>
      <button
        onClick={downloadReport}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl mt-4 hover:bg-blue-700"
      >
        Download Report
      </button>
    </div>
  );
};

export default Report;
