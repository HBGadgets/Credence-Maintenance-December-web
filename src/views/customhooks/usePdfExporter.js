import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

const usePdfExporter = () => {
    const exportToPDF = useCallback(
        ({
            title, // Custom Title
            columns = [], // Table Columns
            data = [], // Table Data
            metaData = {}, // Extra Metadata (e.g., User, Date Range)
            fileName, // PDF File Name
            config = {}, // Custom Configurations
        }) => {
            try {
                if (!Array.isArray(data) || data.length === 0) {
                    toast.error('No data available for PDF export');
                    return;
                }

                // Default Configuration (Can be overridden)
                const CONFIG = {
                    colors: {
                        primary: [10, 45, 99],
                        border: [220, 220, 220],
                        background: [249, 250, 251],
                    },
                    company: {
                        name: 'Credence Tracker',
                        logo: { x: 15, y: 15, size: 8 },
                    },
                    layout: {
                        margin: 16,
                    },
                    fonts: {
                        primary: 'helvetica',
                    },
                    orientation: 'landscape', // Default Orientation
                    ...config, // Merge User Config
                };

                const doc = new jsPDF({
                    orientation: CONFIG.orientation,
                    unit: 'mm',
                    format: 'a4',
                });

                // --- Header ---
                doc.setFillColor(...CONFIG.colors.primary);
                doc.rect(CONFIG.company.logo.x, CONFIG.company.logo.y, CONFIG.company.logo.size, CONFIG.company.logo.size, 'F');
                doc.setFont(CONFIG.fonts.primary, 'bold');
                doc.setFontSize(16);
                doc.text(CONFIG.company.name, 28, 21);
                doc.setDrawColor(...CONFIG.colors.primary);
                doc.line(CONFIG.layout.margin, 25, doc.internal.pageSize.width - CONFIG.layout.margin, 25);

                // --- Title & Date ---
                doc.setFontSize(24);
                doc.text(title, CONFIG.layout.margin, 35);
                const currentDate = new Date().toLocaleDateString('en-GB');
                const dateText = `Generated: ${currentDate}`;
                doc.setFontSize(10);
                doc.text(dateText, doc.internal.pageSize.width - CONFIG.layout.margin - doc.getTextWidth(dateText), 21);

                // --- Table Data ---
                const tableColumns = ['SN', ...columns.map((col) => col.label)]; // Added "SN"
                const tableRows = data.map((row, index) => [
                    index + 1, // Auto SN
                    ...columns.map((col) => row[col.key] || 'N/A'), // Extracting Data Dynamically
                ]);

                doc.autoTable({
                    startY: 45,
                    head: [tableColumns],
                    body: tableRows,
                    theme: 'grid',
                    styles: {
                        fontSize: 10,
                        halign: 'center',
                        lineColor: CONFIG.colors.border,
                        lineWidth: 0.1,
                    },
                    headStyles: {
                        fillColor: CONFIG.colors.primary,
                        textColor: 255,
                        fontStyle: 'bold',
                    },
                    alternateRowStyles: {
                        fillColor: CONFIG.colors.background,
                    },
                    margin: { left: CONFIG.layout.margin, right: CONFIG.layout.margin },
                });

                // --- Metadata ---
                if (metaData) {
                    doc.setFontSize(10);
                    doc.setFont(CONFIG.fonts.primary, 'bold');
                    let yPosition = doc.lastAutoTable.finalY + 10;
                    const xPosition = 15;
                    Object.keys(metaData).forEach((key) => {
                        doc.text(`${key}: ${metaData[key]}`, xPosition, yPosition);
                        yPosition += 6;
                    });
                }

                // --- Footer ---
                const pageCount = doc.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setDrawColor(...CONFIG.colors.border);
                    doc.line(CONFIG.layout.margin, doc.internal.pageSize.height - 15, doc.internal.pageSize.width - CONFIG.layout.margin, doc.internal.pageSize.height - 15);
                    doc.setFontSize(9);
                    doc.text(`© ${CONFIG.company.name}`, CONFIG.layout.margin, doc.internal.pageSize.height - 10);
                    const pageNumber = `Page ${i} of ${pageCount}`;
                    doc.text(pageNumber, doc.internal.pageSize.width - CONFIG.layout.margin - doc.getTextWidth(pageNumber), doc.internal.pageSize.height - 10);
                }

                doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
                toast.success('PDF downloaded successfully');
            } catch (error) {
                console.error('PDF Export Error:', error);
                toast.error(error.message || 'Failed to export PDF');
            }
        },
        []
    );

    return { exportToPDF };
};

export default usePdfExporter;
