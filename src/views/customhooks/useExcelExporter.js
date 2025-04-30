import { useCallback } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const useExcelExporter = () => {
    const exportToExcel = useCallback(
        async ({
            title,
            columns = [],
            data = [],
            metaData = {},
            fileName,
            config = {},
        }) => {
            try {
                if (!Array.isArray(data) || data.length === 0) {
                    toast.error('No data available for Excel export');
                    return;
                }

                const CONFIG = {
                    colors: {
                        primary: 'FF0A2D63',
                        secondary: 'FF6C757D',
                        text: 'FFFFFFFF',
                    },
                    borderStyle: 'thin',
                    companyName: 'Credence Tracker',
                    ...config,
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
                worksheet.mergeCells(`A${titleRow.number}:${String.fromCharCode(65 + columns.length)}${titleRow.number}`);
                worksheet.addRow([]); // Spacer Row

                // --- HEADER ROW ---
                const tableColumns = ['SN', ...columns.map((col) => col.label)];
                const headerRow = worksheet.addRow(tableColumns);
                headerRow.eachCell((cell) => {
                    cell.font = { bold: true, size: 12, color: { argb: CONFIG.colors.text } };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CONFIG.colors.secondary } };
                    cell.alignment = { horizontal: 'center' };
                    cell.border = { top: { style: CONFIG.borderStyle }, left: { style: CONFIG.borderStyle }, bottom: { style: CONFIG.borderStyle }, right: { style: CONFIG.borderStyle } };
                });

                // --- CLEAN DATA FUNCTION ---
                const cleanData = (data) => {
                    return data.map((item, index) => {
                        const cleanedItem = { SN: index + 1 }; // Add SN column
                        columns.forEach((col) => {
                            let value = item[col.key];

                            // Remove circular references
                            try {
                                JSON.stringify(value); // Test if value is serializable
                            } catch (error) {
                                value = '[Circular]'; // Replace circular objects with a placeholder
                            }

                            cleanedItem[col.label] = typeof value === 'object' ? JSON.stringify(value) : value || 'N/A';
                        });
                        return cleanedItem;
                    });
                };

                const cleanedData = cleanData(data);
                cleanedData.forEach((item) => {
                    worksheet.addRow(Object.values(item));
                });


                // --- METADATA SECTION ---
                if (Object.keys(metaData).length > 0) {
                    worksheet.addRow([]);
                    Object.entries(metaData).forEach(([key, value]) => {
                        const row = worksheet.addRow([`${key}: ${value}`]);
                        row.font = { italic: true, size: 10 };
                        worksheet.mergeCells(`A${row.number}:${String.fromCharCode(65 + columns.length)}${row.number}`);
                    });
                }

                // --- FOOTER ---
                worksheet.addRow([]);
                const footerRow = worksheet.addRow([`© ${new Date().getFullYear()} ${CONFIG.companyName}`]);
                footerRow.font = { italic: true, size: 10 };
                footerRow.alignment = { horizontal: 'right' };
                worksheet.mergeCells(`A${footerRow.number}:${String.fromCharCode(65 + columns.length)}${footerRow.number}`);

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
