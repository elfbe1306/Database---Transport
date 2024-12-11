import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { TfiSearch } from "react-icons/tfi";
import styles from '../Styles/Export.module.css'
import supabase from '../supabase-client'
import { Export_Report } from '../components/Export_Report';

export const Export = () => {
  const [exportReport, setExportReport] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [warehouseLocation, setWarehouseLocation] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");

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
      .select('export_report_id, package(package_id, branch_warehouse(branch_id, warehouse(w_location, w_area)))');
    if (error) {
      console.error('Error fetching warehouse locations:', error);
    } else {
      const locationMap = {};
      data.forEach((item) => {
        const reportId = item.export_report_id;
        const location = item.package?.branch_warehouse?.warehouse?.w_location || 'Unknown Location';
        const area = item.package?.branch_warehouse?.warehouse?.w_area || 'Unknown Area';
        locationMap[reportId] = `${location} - ${area}`;
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

  const handleDocOpenModal = () => {
    setIsDocModalOpen(true);
  };

  const handleDocCloseModal = () => {
    setIsDocModalOpen(false);
  };

  const handleDocOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleDocCloseModal();
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
                <th>Create Date</th>
                <th>Create Time</th>
                <th>View</th>
                <th>Status</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.report_id}>
                  <td>{report.report_id}</td>
                  <td>{warehouseLocation[report.report_id]}</td>
                  <td>{report.report_create_date}</td>
                  <td>{report.report_create_time}</td>
                  <td><button onClick={() => handleDocOpenModal()}>View</button></td>
                  <td>{report.status}</td>
                  <td>
                    {report.assign_employee_id ? (
                      <button className={styles.assigned_button} disabled>
                        {drivers.find((d) => d.e_id === report.assign_employee_id)?.e_fullname || "Assigned"}
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
              ))}
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
            <Export_Report/>
          </div>
        </div>
      )}

    </div>
  );
};
