import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Export.module.css'
import supabase from '../supabase-client'
import { Export_Report } from '../components/Export_Report';
import { QRCodeProduct } from '../components/QRCodeProduct';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const Export = () => {
  const [exportReport, setExportReport] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [warehouseLocation, setWarehouseLocation] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [products, setProducts] = useState([]);
  const [reportCreateDate, setReportCreateDate] = useState();

  useEffect(() => {
    fetchExportReport();
    fetchingWarehouseAddress();
    fetchingEmployee();
  }, []);

  const fetchExportReport = async () => {
    const { data, error } = await supabase.from('report').select('*').like('report_id', 'EX%');
    if (error) {
      console.error('Error fetching export report:', error);
    } else {
      setExportReport(data);
      setFilteredReports(data);
    }
  }

  const fetchingWarehouseAddress = async () => {
    const { data, error } = await supabase
      .from('export_report_has_package')
      .select('export_report_id, package(package_id, branch_warehouse(branch_id, warehouse(w_location, w_area, w_name)))');
    if (error) {
      console.error('Error fetching warehouse locations:', error);
    } else {
      const locationMap = {};
      data.forEach((item) => {
        const reportId = item.export_report_id;
        const location = item.package?.branch_warehouse?.warehouse?.w_location || 'Unknown Location';
        const area = item.package?.branch_warehouse?.warehouse?.w_area || 'Unknown Area';
        const warehouse = item.package?.branch_warehouse?.warehouse;
        const name = warehouse?.w_name || 'Unknown Name';
        
        locationMap[reportId] = {
          location,
          area,
          name,
        };
      });
      setWarehouseLocation(locationMap);
    }
  };

  const fetchingEmployee = async () => {
    const { data, error } = await supabase.from('employee').select('*').like('e_id', 'EMP1%');
    if (error) {
      console.error('Error fetching Employee:', error);
    } else {
      setDrivers(data);
    }
  };

  const handleOpenModal = (reportId) => {
    setSelectedReportId(reportId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDriver("");
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = e.target.value.trim();
      if (query) {
        setFilteredReports(exportReport.filter((report) => report.report_id.includes(query)));
      } else {
        setFilteredReports(exportReport);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReportId || !selectedDriver) return;

    try {
      const { error } = await supabase
        .from('report')
        .update({ assign_employee_id: selectedDriver, status: "Assigned" })
        .eq('report_id', selectedReportId);

      if (error) {
        console.error('Error updating report:', error);
        return;
      }

      setFilteredReports((prev) =>
        prev.map((report) =>
          report.report_id === selectedReportId
            ? { ...report, assign_employee_id: selectedDriver }
            : report
        )
      );

      handleCloseModal();
    } catch (err) {
      console.error('Error during submission:', err);
    }
  };

  const handleDocOpenModal = (reportId) => {
    setIsDocModalOpen(true);
    fetchProductsForReport(reportId);
    setSelectedReportId(reportId);
    fetchReportCreateData(reportId);
  };

  const handleDocCloseModal = () => {
    setIsDocModalOpen(false);
  };

  const handleDocOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleDocCloseModal();
    }
  };

  const fetchProductsForReport = async (reportId) => {
    const { data, error } = await supabase.from('export_report_has_package').select('*, package(package_id, product_name, product_total)').eq('export_report_id', reportId);
  
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
  };

  const fetchReportCreateData = async (reportId) => {
    const {data, error} = await supabase.from('export_report_has_package').select('*, export_report(export_report_id, report(report_id, report_create_date))');

    if(error) {
      console.error('Error fetching report create date:', error);
    } else {
      setReportCreateDate(data[0]);
    }
  }

  const printRef = React.useRef(null);
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) {
      console.error("Element to print not found.");
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Export_Report.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleQROpenModal = (reportId) => {
    fetchProductsForReport(reportId); // Dùng khé khỏi tạo thêm useState();
    setIsQRModalOpen(true);
  };
  const handleQRCloseModal = () => {
    setIsQRModalOpen(false);
  };
  const handleQROverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleQRCloseModal();
    }
  };

  const printRefQR = React.useRef(null);
  const handleDownloadPdfQR = async () => {
    const element = printRefQR.current;
    if (!element) {
      console.error("Element to print not found.");
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('QRCode.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.Content}>
        <div className={styles.Wrapper}>
          <div className={styles.TableName}>EXPORT</div>
          <div className={styles.ActionButton}>
            <div className={styles.search_input_box}>
              <TfiSearch className={styles.icon} />
              <input
                type="text"
                className={styles.search_input}
                placeholder="Search report..."
                onKeyDown={handleSearch}
              />
            </div>
          </div>
        </div>
        <div className={styles.table_wrapper}>
          <div className={styles.divider}></div>
          <table className={styles.branch_product_table}>
            <thead>
              <tr>
                <th>Report's ID</th>
                <th>Destination</th>
                <th>Address</th>
                <th>Create Date</th>
                <th>Create Time</th>
                <th>QR</th>
                <th>View</th>
                <th>Status</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                const warehouseInfo = warehouseLocation[report.report_id] || {};
                return (
                  <tr key={report.report_id}>
                    <td>{report.report_id}</td>
                    <td>{warehouseInfo.name}</td>
                    <td>{`${warehouseInfo.location} - ${warehouseInfo.area}`}</td>
                    <td>{report.report_create_date}</td>
                    <td>{report.report_create_time}</td>
                    <td><button className={styles.ViewButton} onClick={() => handleQROpenModal(report.report_id)}>QR</button></td>
                    <td><button className={styles.ViewButton} onClick={() => handleDocOpenModal(report.report_id)}>View</button></td>
                    <td>{report.status}</td>
                    <td>
                      {report.assign_employee_id ? (
                        <button className={styles.assigned_button} disabled>
                          {drivers.find((d) => d.e_id === report.assign_employee_id)?.fullname || "Assigned"}
                        </button>
                      ) : (
                        <button
                          className={styles.plus_button}
                          onClick={() => handleOpenModal(report.report_id)}
                        >
                          +
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.AssginDriverModalOverlay} onClick={handleOverlayClick}>
          <div className={styles.AssginDriverModal}>
            <h2 className={styles.AssginDriverModalTitle}>Assign Driver</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.FormGroup}>
                <label className={styles.labelText}>Driver</label>
                <select
                  className={styles.SelectInput}
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                >
                  <option value="">Select a driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.e_id} value={driver.e_id}>
                      <p>{driver.fullname}</p>
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.ModalActions}>
                <button type="submit" className={styles.SaveButton}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDocModalOpen && (
        <div className={styles.DocModalOverlay} onClick={handleDocOverlayClick}>
          <div className={styles.DocModal}>
            <div className={styles.Export_Report} ref={printRef}>
              <Export_Report
                driverFullName={
                  drivers.find(
                    (d) =>
                      d.e_id ===
                      exportReport.find((report) => report.report_id === selectedReportId)?.assign_employee_id
                  )?.fullname || "Unassigned"
                }
                warehouseName={warehouseLocation[selectedReportId]?.name || "Unknown"}
                warehouseLocation={warehouseLocation[selectedReportId]?.location || "Unknown"}
                products={products}
                reportCreateDate={reportCreateDate?.export_report?.report?.report_create_date}
              />
            </div>
            <div className={styles.ButtonContainer}>
              <button onClick={handleDownloadPdf}>Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {isQRModalOpen && (
        <div className={styles.QRModalOverlay} onClick={handleQROverlayClick}>
          <div className={styles.QRModal}>
            <div className={styles.QR_Paper} ref={printRefQR}>
              <QRCodeProduct products = {products}/>
            </div>
            <div className={styles.ButtonContainer}>
              <button onClick={handleDownloadPdfQR}>Download PDF</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
