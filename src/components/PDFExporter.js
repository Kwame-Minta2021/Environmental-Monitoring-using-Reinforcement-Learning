import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

class PDFExporter {
  constructor() {
    this.doc = new jsPDF();
  }

  generateHeader() {
    this.doc.setFontSize(20);
    this.doc.text('Environmental Monitoring Report', 15, 20);
    
    this.doc.setFontSize(12);
    this.doc.text(`Generated on: ${format(new Date(), 'PPP pp')}`, 15, 30);
  }

  addSensorData(sensors) {
    const tableData = Object.entries(sensors).map(([id, data]) => [
      data.type,
      data.value.toString(),
      data.unit,
      data.status.toUpperCase(),
      format(new Date(), 'HH:mm:ss')
    ]);

    this.doc.autoTable({
      startY: 40,
      head: [['Sensor Type', 'Value', 'Unit', 'Status', 'Time']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
  }

  addHealthImpacts(sensors) {
    const startY = this.doc.previousAutoTable.finalY + 15;
    
    this.doc.setFontSize(16);
    this.doc.text('Health Impact Analysis', 15, startY);

    const healthData = Object.entries(sensors).map(([id, data]) => {
      let impact = 'Normal';
      let recommendations = 'No action needed';

      if (data.status === 'critical') {
        impact = 'Severe';
        recommendations = 'Immediate evacuation recommended';
      } else if (data.status === 'warning') {
        impact = 'Moderate';
        recommendations = 'Increased ventilation recommended';
      }

      return [
        data.type,
        impact,
        recommendations
      ];
    });

    this.doc.autoTable({
      startY: startY + 10,
      head: [['Sensor Type', 'Health Impact', 'Recommendations']],
      body: healthData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
  }

  addAlertHistory(alerts) {
    const startY = this.doc.previousAutoTable.finalY + 15;
    
    this.doc.setFontSize(16);
    this.doc.text('Recent Alert History', 15, startY);

    const alertData = alerts.map(alert => [
      alert.title,
      alert.message,
      alert.time,
      alert.type.toUpperCase()
    ]);

    this.doc.autoTable({
      startY: startY + 10,
      head: [['Alert Title', 'Message', 'Time', 'Type']],
      body: alertData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
  }

  generateReport(data) {
    const { sensors, alerts } = data;
    
    this.generateHeader();
    this.addSensorData(sensors);
    this.addHealthImpacts(sensors);
    this.addAlertHistory(alerts);

    // Save the PDF
    this.doc.save(`environmental-report-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.pdf`);
  }
}

export default new PDFExporter(); 