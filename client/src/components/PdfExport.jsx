
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function PdfExport({ location, assessment, historicalData }) {
  const generatePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text('Weather Peril Assessment Report', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });

    doc.setDrawColor(200);
    doc.line(14, 32, pageWidth - 14, 32);

    let y = 40;

    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text('Location Details', 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Address: ${location.address}`, 14, y); y += 6;
    doc.text(`Coordinates: ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`, 14, y); y += 6;
    doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 14, y); y += 12;

    if (assessment?.assessment) {
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text('Risk Assessment', 14, y);
      y += 4;

      const perils = assessment.assessment;
      const tableData = [];

      if (perils.wind) tableData.push(['Wind Speed', `${perils.wind.value?.toFixed(1)} mph`, perils.wind.level]);
      if (perils.precipitation) tableData.push(['Precipitation', `${perils.precipitation.value?.toFixed(2)} in`, perils.precipitation.level]);
      if (perils.hail) tableData.push(['Hail', perils.hail.detected ? 'Detected' : 'Not detected', perils.hail.level]);
      if (perils.temperature) tableData.push(['Temperature', `${perils.temperature.value?.toFixed(1)} °F`, perils.temperature.level]);
      if (perils.storm) tableData.push(['Storm', perils.storm.description, perils.storm.level]);

      tableData.push(['OVERALL RISK', '', perils.overall]);

      doc.autoTable({
        startY: y,
        head: [['Peril', 'Value', 'Risk Level']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      });

      y = doc.lastAutoTable.finalY + 12;
    }

    if (historicalData && historicalData.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text('3-Year Historical Comparison', 14, y);
      y += 4;

      const histTableData = historicalData.map((yearData) => {
        const daily = yearData.data?.daily;
        return [
          yearData.year.toString(),
          `${daily?.wind_speed_10m_max?.[0]?.toFixed(1) || 'N/A'} mph`,
          `${daily?.precipitation_sum?.[0]?.toFixed(2) || 'N/A'} in`,
          `${daily?.temperature_2m_max?.[0]?.toFixed(0) || 'N/A'}°F`,
          `${daily?.temperature_2m_min?.[0]?.toFixed(0) || 'N/A'}°F`
        ];
      });

      doc.autoTable({
        startY: y,
        head: [['Year', 'Max Wind', 'Precipitation', 'High Temp', 'Low Temp']],
        body: histTableData,
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      });
    }

    const finalY = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Data provided by Open-Meteo (open-meteo.com). For insurance assessment purposes only.', pageWidth / 2, finalY, { align: 'center' });

    doc.save(`weather-report-${location.lat.toFixed(2)}_${location.lon.toFixed(2)}.pdf`);
  };

  return (
    <button
      onClick={generatePdf}
      className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export PDF
    </button>
  );
}

export default PdfExport;
