import jsPDF from 'jspdf';
import 'jspdf-autotable';

function PdfExport({ location, assessment, historicalData }) {
  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Weather Peril Assessment Report', 14, 22);
    doc.setFontSize(10);
    doc.text('Insurance Risk Intelligence', 14, 30);
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);
    doc.text('Location Details', 14, 55);
    doc.setFontSize(10);
    doc.text(`Address: ${location.address}`, 14, 63);
    doc.text(`Coordinates: ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`, 14, 70);

    if (assessment?.assessment) {
      const perils = assessment.assessment;
      doc.setFontSize(12);
      doc.text('Risk Assessment', 14, 85);

      const riskData = [
        ['Wind Speed', perils.wind?.value ? `${perils.wind.value} ${perils.wind.unit}` : 'N/A', perils.wind?.level || 'N/A'],
        ['Precipitation', perils.precipitation?.value ? `${perils.precipitation.value} ${perils.precipitation.unit}` : 'N/A', perils.precipitation?.level || 'N/A'],
        ['Hail', perils.hail?.detected ? 'Detected' : 'Not detected', perils.hail?.level || 'N/A'],
        ['Temperature', perils.temperature?.value ? `${perils.temperature.value} ${perils.temperature.unit}` : 'N/A', perils.temperature?.level || 'N/A'],
        ['Storm Activity', perils.storm?.description || 'N/A', perils.storm?.level || 'N/A'],
        ['Overall Risk', '', perils.overall || 'N/A'],
      ];

      doc.autoTable({
        startY: 90,
        head: [['Peril', 'Value', 'Risk Level']],
        body: riskData,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
      });
    }

    if (historicalData && historicalData.length > 0) {
      const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 160;
      doc.setFontSize(12);
      doc.text('3-Year Historical Comparison', 14, startY);

      const histData = historicalData.map(item => [
        item.year.toString(),
        `${item.data?.daily?.temperature_2m_max?.[0] || 'N/A'}\u00b0F / ${item.data?.daily?.temperature_2m_min?.[0] || 'N/A'}\u00b0F`,
        `${item.data?.daily?.wind_speed_10m_max?.[0] || 'N/A'} mph`,
        `${item.data?.daily?.precipitation_sum?.[0] || 'N/A'} in`,
      ]);

      doc.autoTable({
        startY: startY + 5,
        head: [['Year', 'Temp (High/Low)', 'Max Wind', 'Precipitation']],
        body: histData,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
      });
    }

    doc.setFontSize(7);
    doc.setTextColor(128, 128, 128);
    doc.text('Weather data provided by Open-Meteo (open-meteo.com). Geocoding by OpenStreetMap Nominatim.', 14, doc.internal.pageSize.getHeight() - 10);

    doc.save(`weather-report-${location.lat.toFixed(2)}_${location.lon.toFixed(2)}.pdf`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/20 rounded-xl text-xs font-medium hover:from-blue-500/30 hover:to-cyan-500/30 transition-all shadow-lg shadow-blue-500/5"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export PDF
    </button>
  );
}

export default PdfExport;
