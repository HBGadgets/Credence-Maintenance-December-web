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

                // Check if we need to expand products into separate rows
                let exportData = [...data];
                let hasProductsToExpand = false;

                if (includeProducts) {
                    // Expand data: create separate row for each product
                    const expandedData = [];
                    data.forEach((item) => {
                        if (item.products && Array.isArray(item.products) && item.products.length > 0) {
                            hasProductsToExpand = true;
                            // Create a row for each product
                            item.products.forEach((product) => {
                                expandedData.push({
                                    ...item,
                                    _productData: product, // Store product data separately
                                });
                            });
                        } else {
                            // No products, keep as is
                            expandedData.push({
                                ...item,
                                _productData: null,
                            });
                        }
                    });
                    exportData = expandedData;
                }

                // Add product-specific columns to the columns array
                let exportColumns = [...columns];
                if (includeProducts && hasProductsToExpand) {
                    // Find the index of Products column or add at the end
                    const productsIndex = exportColumns.findIndex(col => col.key === 'products');

                    // Remove the original products column if it exists
                    if (productsIndex !== -1) {
                        exportColumns.splice(productsIndex, 1);
                    }

                    // Add product detail columns
                    const productColumns = [
                        { label: 'Product Name', key: 'productName' },
                        { label: 'Warehouse', key: 'warehouseName' },
                        { label: 'Quantity (MT)', key: 'quantityMT' },
                        { label: 'Bag Size (KG)', key: 'bagSize' },
                        { label: 'Total Bags', key: 'totalBags' },
                        { label: 'Updated Quantity (MT)', key: 'updatedQuantityMT' },
                    ];

                    exportColumns.push(...productColumns);
                }

                // Get ALL columns for export
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

                // Add export date row
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
                    } else if (col.key === 'warehouseName') {
                        column.width = 20;
                    } else if (col.key === 'quantityMT' || col.key === 'updatedQuantityMT' || col.key === 'balanceMT') {
                        column.width = 18;
                    } else if (col.key === 'bagSize') {
                        column.width = 15;
                    } else if (col.key === 'totalBags') {
                        column.width = 12;
                    } else {
                        column.width = 18;
                    }
                });

                // --- CLEAN AND ADD DATA ROWS (with product expansion) ---
                const cleanedData = exportData.map((item, index) => {
                    const cleanedItem = { SN: index + 1 };

                    exportColumns.forEach((col) => {
                        let value;

                        // Check if this is a product-related column
                        if (includeProducts && hasProductsToExpand && item._productData) {
                            // Get value from product data for product columns
                            if (col.key === 'productName') {
                                value = item._productData.productName || '-';
                            } else if (col.key === 'warehouseName') {
                                value = item._productData.warehouseName || '-';
                            } else if (col.key === 'quantityMT') {
                                value = parseFloat(item._productData.quantityMT) || 0;
                            } else if (col.key === 'bagSize') {
                                value = parseFloat(item._productData.bagSize) || 0;
                            } else if (col.key === 'totalBags') {
                                const bagSize = parseFloat(item._productData.bagSize) || 0;
                                const quantityMT = parseFloat(item._productData.quantityMT) || 0;
                                value = bagSize > 0 ? Math.round(quantityMT * 1000 / bagSize) : 0;
                            } else if (col.key === 'updatedQuantityMT') {
                                value = parseFloat(item._productData.updatedQuantityMT) || 0;
                            } else if (col.key === 'balanceMT') {
                                const originalQty = parseFloat(item._productData.quantityMT) || 0;
                                const updatedQty = parseFloat(item._productData.updatedQuantityMT) || 0;
                                value = Math.max(0, originalQty - updatedQty);
                            } else {
                                // Get from main item
                                value = item[col.key];
                            }
                        } else {
                            // Get from main item
                            value = item[col.key];
                        }

                        // Handle custom render functions
                        if (col.render && !col.key.startsWith('_')) {
                            try {
                                const renderedValue = col.render(item);
                                if (typeof renderedValue === 'string') {
                                    value = renderedValue;
                                } else if (renderedValue && renderedValue.props) {
                                    if (renderedValue.props.children) {
                                        if (typeof renderedValue.props.children === 'string') {
                                            value = renderedValue.props.children;
                                        } else if (Array.isArray(renderedValue.props.children)) {
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
                            columnLabel.includes('Freight') ||
                            columnLabel.includes('Quantity') ||
                            columnLabel.includes('Bag Size') ||
                            columnLabel.includes('Total Bags') ||
                            columnLabel.includes('Balance')
                        )) {
                            const numValue = parseFloat(cell.value?.toString().replace(/[^0-9.-]+/g, ''));
                            if (!isNaN(numValue)) {
                                cell.value = numValue;
                                if (columnLabel.includes('Bag Size') || columnLabel.includes('Total Bags')) {
                                    cell.numFmt = '#,##0';
                                } else {
                                    cell.numFmt = '#,##0.00';
                                }
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

                // Remove the old PRODUCTS SECTION since we're now showing products in main rows
                // The includeProducts parameter now only controls whether to expand products into separate rows

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
                const totalRecordsRow = worksheet.addRow([`Total Records: ${exportData.length}`]);
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