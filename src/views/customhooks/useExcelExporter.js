import { useCallback } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const useExcelExporter = () => {
    const exportToExcel = useCallback(
        async ({
            title, // Custom Title
            columns = [], // Table Columns [{ label: "ID", key: "id" }]
            data = [], // Table Data [{ id: 1, name: "John" }]
            metaData = {}, // Extra Metadata (e.g., User, Date Range)
            fileName, // Excel File Name
            config = {}, // Custom Configurations
        }) => {
            try {
                if (!Array.isArray(data) || data.length === 0) {
                    toast.error('No data available for Excel export');
                    return;
                }

                // Default Styles (Can be overridden)
                const CONFIG = {
                    colors: {
                        primary: 'FF0A2D63', // Dark Blue
                        secondary: 'FF6C757D', // Gray
                        text: 'FFFFFFFF', // White
                    },
                    borderStyle: 'thin',
                    companyName: 'Credence Tracker',
                    ...config, // Merge user-defined config
                };

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet(title);

                // --- HEADER SECTION ---
                const titleRow = worksheet.addRow([CONFIG.companyName]);
                titleRow.font = { bold: true, size: 16, color: { argb: CONFIG.colors.text } };
                titleRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: CONFIG.colors.primary },
                };
                titleRow.alignment = { horizontal: 'center' };
                worksheet.mergeCells(`A${titleRow.number}:${String.fromCharCode(65 + columns.length - 1)}${titleRow.number}`);
                worksheet.addRow([]); // Spacer Row

                // --- HEADER ROW ---
                const headerRow = worksheet.addRow(columns.map((col) => col.label));
                headerRow.eachCell((cell) => {
                    cell.font = { bold: true, size: 12, color: { argb: CONFIG.colors.text } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: CONFIG.colors.secondary },
                    };
                    cell.alignment = { horizontal: 'center' };
                    cell.border = { top: { style: CONFIG.borderStyle }, left: { style: CONFIG.borderStyle }, bottom: { style: CONFIG.borderStyle }, right: { style: CONFIG.borderStyle } };
                });

                // --- DATA ROWS ---
                data.forEach((item, index) => {
                    const row = worksheet.addRow([
                        index + 1, // Auto SN
                        ...columns.map((col) => item[col.key] || 'N/A'), // Extract data dynamically
                    ]);
                    row.eachCell((cell) => {
                        cell.border = { top: { style: CONFIG.borderStyle }, left: { style: CONFIG.borderStyle }, bottom: { style: CONFIG.borderStyle }, right: { style: CONFIG.borderStyle } };
                    });
                });

                // --- METADATA SECTION ---
                if (Object.keys(metaData).length > 0) {
                    worksheet.addRow([]); // Spacer Row
                    Object.entries(metaData).forEach(([key, value]) => {
                        const row = worksheet.addRow([`${key}: ${value}`]);
                        row.font = { italic: true, size: 10 };
                        worksheet.mergeCells(`A${row.number}:${String.fromCharCode(65 + columns.length - 1)}${row.number}`);
                    });
                }

                // --- FOOTER ---
                worksheet.addRow([]);
                const footerRow = worksheet.addRow([`© ${new Date().getFullYear()} ${CONFIG.companyName}`]);
                footerRow.font = { italic: true, size: 10 };
                footerRow.alignment = { horizontal: 'right' };
                worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + columns.length - 1)}${footerRow.number}`);

                // --- EXPORT FILE ---
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);

                toast.success('Excel file downloaded successfully');
            } catch (error) {
                console.error('Excel Export Error:', error);
                toast.error(error.message || 'Failed to export Excel file');
            }
        },
        []
    );

    return { exportToExcel };
};

export default useExcelExporter;
