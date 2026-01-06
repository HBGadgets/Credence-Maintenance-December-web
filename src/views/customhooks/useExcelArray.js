import { useCallback } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const useExcelArray = () => {
    const exportToExcel = useCallback(
        async ({
            title,
            columns = [],
            data = [],
            metaData = {},
            fileName,
            config = {},
            includeProducts = true,
            productsLabel = 'Products',
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
                        success: 'FF28a745',
                        danger: 'FFdc3545',
                        warning: 'FFfd7e14',
                        info: 'FF17a2b8',
                    },
                    borderStyle: 'thin',
                    companyName: 'FMS (Fleet Management System)',
                    ...config,
                };

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet(title || 'Sheet 1');

                // Get ALL columns for export (don't filter hidden ones)
                const exportColumns = columns;
                const columnCount = exportColumns.length + 1; // +1 for SN column
                const lastColumnLetter = String.fromCharCode(64 + Math.min(columnCount, 26));

                // --- COMPANY NAME ---
                const companyRow = worksheet.addRow([CONFIG.companyName]);
                companyRow.font = { bold: true, size: 14, color: { argb: CONFIG.colors.text } };
                companyRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: CONFIG.colors.primary },
                };
                companyRow.alignment = { horizontal: 'center' };
                worksheet.mergeCells(`A${companyRow.number}:${lastColumnLetter}${companyRow.number}`);

                // --- TITLE ---
                const titleRow = worksheet.addRow([title || 'Export']);
                titleRow.font = { bold: true, size: 16 };
                titleRow.alignment = { horizontal: 'center' };
                worksheet.mergeCells(`A${titleRow.number}:${lastColumnLetter}${titleRow.number}`);

                // Add export date row instead of username
                const exportDateRow = worksheet.addRow([`Exported on: ${new Date().toLocaleDateString()}`]);
                exportDateRow.font = { italic: true, size: 12, color: { argb: 'FF555555' } };
                exportDateRow.alignment = { horizontal: 'center' };
                worksheet.mergeCells(`A${exportDateRow.number}:${lastColumnLetter}${exportDateRow.number}`);

                // Spacer Row
                worksheet.addRow([]);

                // --- HEADER ROW ---
                const tableColumns = ['SN', ...exportColumns.map((col) => col.label)];
                const headerRow = worksheet.addRow(tableColumns);
                headerRow.eachCell((cell) => {
                    cell.font = { bold: true, size: 12, color: { argb: CONFIG.colors.text } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: CONFIG.colors.secondary },
                    };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    cell.border = {
                        top: { style: CONFIG.borderStyle },
                        left: { style: CONFIG.borderStyle },
                        bottom: { style: CONFIG.borderStyle },
                        right: { style: CONFIG.borderStyle },
                    };
                });

                // Set column widths
                worksheet.getColumn(1).width = 8; // SN column
                exportColumns.forEach((col, index) => {
                    const column = worksheet.getColumn(index + 2);
                    if (col.minWidth) {
                        column.width = Math.max(col.minWidth / 7, 15);
                    } else if (col.key === 'name' || col.key === 'productName' || col.key === 'customerName') {
                        column.width = 25;
                    } else if (col.key === 'address' || col.key === 'description') {
                        column.width = 40;
                    } else if (col.key === 'email') {
                        column.width = 30;
                    } else if (col.key.includes('Address')) {
                        column.width = 35;
                    } else if (col.key.includes('Rate') || col.key.includes('Amount') || col.key.includes('Freight')) {
                        column.width = 20;
                    } else {
                        column.width = 18;
                    }
                });

                // --- CLEAN AND ADD DATA ROWS ---
                const cleanedData = data.map((item, index) => {
                    const cleanedItem = { SN: index + 1 };

                    exportColumns.forEach((col) => {
                        let value = item[col.key];

                        // Handle custom render functions
                        if (col.render) {
                            try {
                                // Extract text from React elements if needed
                                const renderedValue = col.render(item);
                                if (typeof renderedValue === 'string') {
                                    value = renderedValue;
                                } else if (renderedValue && renderedValue.props) {
                                    // For React elements, try to get text content
                                    if (renderedValue.props.children) {
                                        if (typeof renderedValue.props.children === 'string') {
                                            value = renderedValue.props.children;
                                        } else if (Array.isArray(renderedValue.props.children)) {
                                            // Join array of children
                                            value = renderedValue.props.children
                                                .map(child => typeof child === 'string' ? child : String(child))
                                                .join('');
                                        } else {
                                            value = String(renderedValue.props.children);
                                        }
                                    } else if (renderedValue.props.title) {
                                        value = renderedValue.props.title;
                                    } else {
                                        value = 'N/A';
                                    }
                                } else {
                                    value = renderedValue || 'N/A';
                                }
                            } catch (error) {
                                console.warn(`Error rendering column ${col.key}:`, error);
                                value = item[col.key] || 'N/A';
                            }
                        }

                        // Convert to string and clean
                        if (value === null || value === undefined) {
                            value = '';
                        } else if (typeof value === 'object') {
                            try {
                                value = JSON.stringify(value);
                            } catch (error) {
                                value = '[Object]';
                            }
                        }

                        cleanedItem[col.label] = String(value);
                    });

                    return cleanedItem;
                });

                // Add main data rows
                cleanedData.forEach((item, rowIndex) => {
                    const row = worksheet.addRow(Object.values(item));

                    // Format numeric columns
                    row.eachCell((cell, colNumber) => {
                        const columnLabel = exportColumns[colNumber - 2]?.label;
                        if (columnLabel && (
                            columnLabel.includes('Rate') ||
                            columnLabel.includes('Amount') ||
                            columnLabel.includes('Freight')
                        )) {
                            const numValue = parseFloat(cell.value?.replace(/[^0-9.-]+/g, ''));
                            if (!isNaN(numValue)) {
                                cell.value = numValue;
                                cell.numFmt = '#,##0.00';
                            }
                        }
                    });

                    // Add borders
                    row.eachCell((cell) => {
                        cell.border = {
                            left: { style: CONFIG.borderStyle },
                            right: { style: CONFIG.borderStyle },
                            bottom: { style: CONFIG.borderStyle },
                        };
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    });
                });

                // --- PRODUCTS SECTION ---
                if (includeProducts) {
                    // Get all records with products
                    const recordsWithProducts = data.filter(item =>
                        item.products &&
                        Array.isArray(item.products) &&
                        item.products.length > 0
                    );

                    if (recordsWithProducts.length > 0) {
                        // Add spacer
                        worksheet.addRow([]);
                        worksheet.addRow([]);

                        // Products Section Title
                        const productsTitleRow = worksheet.addRow([`${productsLabel} Details`]);
                        productsTitleRow.font = {
                            bold: true,
                            size: 14,
                            color: { argb: CONFIG.colors.primary }
                        };
                        productsTitleRow.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFF8F9FA' },
                        };
                        productsTitleRow.alignment = { horizontal: 'center' };
                        worksheet.mergeCells(`A${productsTitleRow.number}:G${productsTitleRow.number}`);

                        // Process each record's products
                        recordsWithProducts.forEach((record, recordIndex) => {
                            // Add record header
                            worksheet.addRow([]);
                            const recordHeader = worksheet.addRow([
                                `Record ${recordIndex + 1}: ${record.receiptNo || record.id || record._id || `Record #${recordIndex + 1}`}`
                            ]);
                            recordHeader.font = { bold: true, italic: true, size: 12 };
                            recordHeader.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFE9ECEF' },
                            };
                            worksheet.mergeCells(`A${recordHeader.number}:G${recordHeader.number}`);

                            // Products table header
                            const productHeaders = [
                                'Product Name',
                                'Warehouse',
                                'Quantity (Kg)',
                                'Bag Size',
                                'Total Bags',
                            ];

                            const productHeaderRow = worksheet.addRow(productHeaders);
                            productHeaderRow.eachCell((cell) => {
                                cell.font = { bold: true, size: 11, color: { argb: CONFIG.colors.text } };
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: CONFIG.colors.secondary },
                                };
                                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                                cell.border = {
                                    top: { style: CONFIG.borderStyle },
                                    left: { style: CONFIG.borderStyle },
                                    bottom: { style: CONFIG.borderStyle },
                                    right: { style: CONFIG.borderStyle },
                                };
                            });

                            // Set column widths for products
                            ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col, idx) => {
                                const widths = [25, 20, 15, 12, 12, 15, 15];
                                worksheet.getColumn(col).width = widths[idx];
                            });

                            // Add product rows
                            record.products.forEach((product, productIndex) => {
                                const productRow = worksheet.addRow([
                                    product.productName || '-',
                                    product.warehouseName || '-',
                                    product.quantityKg || '0',
                                    product.bagSize || '0',
                                    product.totalBags || '0',
                                ]);

                                // Alternate row colors
                                if (productIndex % 2 === 0) {
                                    productRow.fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'FFFFFFFF' },
                                    };
                                } else {
                                    productRow.fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'FFF8F9FA' },
                                    };
                                }

                                // Format cells
                                productRow.eachCell((cell, colNumber) => {
                                    cell.alignment = {
                                        horizontal: colNumber <= 2 ? 'left' : 'center',
                                        vertical: 'middle'
                                    };
                                    cell.border = {
                                        left: { style: CONFIG.borderStyle },
                                        right: { style: CONFIG.borderStyle },
                                        bottom: { style: CONFIG.borderStyle },
                                    };

                                    // Format numeric cells (columns C, D, E, F, G)
                                    if (colNumber >= 3 && colNumber <= 7) {
                                        const numValue = parseFloat(cell.value);
                                        if (!isNaN(numValue)) {
                                            cell.value = numValue;
                                            cell.numFmt = colNumber === 6 || colNumber === 7 ? '#,##0.00' : '#,##0';
                                        }
                                    }
                                });
                            });

                            // Add totals row for this record
                            const totalQuantity = record.products.reduce((sum, product) =>
                                sum + (parseFloat(product.quantityKg) || 0), 0
                            );
                            const totalBags = record.products.reduce((sum, product) =>
                                sum + (parseFloat(product.totalBags) || 0), 0
                            );

                            const totalRow = worksheet.addRow([
                                'TOTAL',
                                '',
                                totalQuantity.toFixed(2),
                                '',
                                totalBags.toFixed(0),
                            ]);

                            totalRow.font = { bold: true };
                            totalRow.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFE9ECEF' },
                            };
                            totalRow.eachCell((cell, colNumber) => {
                                cell.alignment = {
                                    horizontal: colNumber <= 2 ? 'left' : 'center',
                                    vertical: 'middle'
                                };
                                cell.border = {
                                    top: { style: 'medium' },
                                    bottom: { style: CONFIG.borderStyle },
                                    left: { style: CONFIG.borderStyle },
                                    right: { style: CONFIG.borderStyle },
                                };

                                // Format numeric totals
                                if (colNumber >= 3 && colNumber <= 7) {
                                    const numValue = parseFloat(cell.value);
                                    if (!isNaN(numValue)) {
                                        cell.value = numValue;
                                        cell.numFmt = colNumber === 6 || colNumber === 7 ? '#,##0.00' : '#,##0';
                                    }
                                }
                            });

                            worksheet.addRow([]);
                        });

                        // Add overall summary
                        const allProducts = recordsWithProducts.flatMap(record => record.products);
                        const overallTotalQuantity = allProducts.reduce((sum, product) =>
                            sum + (parseFloat(product.quantityKg) || 0), 0
                        );
                        const overallTotalBags = allProducts.reduce((sum, product) =>
                            sum + (parseFloat(product.totalBags) || 0), 0
                        );

                        const summaryRow = worksheet.addRow([
                            'OVERALL SUMMARY',
                            '',
                            `Total Quantity: ${overallTotalQuantity.toFixed(2)} kg`,
                            '',
                            `Total Bags: ${overallTotalBags.toFixed(0)}`,
                            '',
                        ]);

                        summaryRow.font = { bold: true, size: 12, color: { argb: CONFIG.colors.primary } };
                        summaryRow.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFD4EDDA' },
                        };
                        worksheet.mergeCells(`A${summaryRow.number}:G${summaryRow.number}`);
                    }
                }

                // --- METADATA ---
                if (Object.keys(metaData).length > 0) {
                    worksheet.addRow([]);
                    Object.entries(metaData).forEach(([key, value]) => {
                        const row = worksheet.addRow([`${key}: ${value}`]);
                        row.font = { italic: true, size: 10 };
                        row.alignment = { horizontal: 'left' };
                        worksheet.mergeCells(`A${row.number}:${lastColumnLetter}${row.number}`);
                    });
                }

                // --- FOOTER ---
                worksheet.addRow([]);
                const totalRecordsRow = worksheet.addRow([`Total Records: ${data.length}`]);
                totalRecordsRow.font = { bold: true, size: 11 };
                totalRecordsRow.alignment = { horizontal: 'left' };
                worksheet.mergeCells(`A${totalRecordsRow.number}:${lastColumnLetter}${totalRecordsRow.number}`);

                const footerRow = worksheet.addRow([`© ${new Date().getFullYear()} ${CONFIG.companyName}`]);
                footerRow.font = { italic: true, size: 10 };
                footerRow.alignment = { horizontal: 'right' };
                worksheet.mergeCells(`A${footerRow.number}:${lastColumnLetter}${footerRow.number}`);

                // --- EXPORT ---
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                const timestamp = new Date().toISOString().split('T')[0];
                const safeFileName = (fileName || title || 'export').replace(/[^a-z0-9]/gi, '_');
                saveAs(blob, `${safeFileName}_${timestamp}.xlsx`);

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

export default useExcelArray;