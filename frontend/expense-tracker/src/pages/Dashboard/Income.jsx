import React, { useState, useEffect } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/income/IncomeOverview'
import axiosInstance from '../../utills/axiosInstance'
import { API_PATHS } from '../../utills/apiPaths'
import Modal from '../../components/Modal'
import AddIncomeForm from '../../components/income/AddIncomeForm'
import { toast } from 'react-hot-toast';
import IncomeList from '../../components/income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openEditIncomeModal, setOpenEditIncomeModal] = useState(false);

  //Fetch all income details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`);
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (err) {
      console.log("Error fetching income details: ", err);
    } finally {
      setLoading(false);
    }
  }

  //handle add income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;
    //Validation checks
    if (!source.trim()) {
      toast.error("Income source is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!date) {
      toast.error("Please select a date for the income");
      return;
    }

    try {
      const response = await axiosInstance.post(`${API_PATHS.INCOME.ADD_INCOME}`, {
        source,
        amount,
        date,
        icon
      });
    } catch (err) {
      console.error("Error adding income: ", err.response?.data?.message || err.message);
      toast.error("Failed to add income");
    } finally {
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    }
  }

  //Edit income source

  //Delete income
  const deleteIncome = async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_PATHS.INCOME.DELETE_INCOME(id)}`);
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income deleted successfully");
      fetchIncomeDetails();
    } catch (err) {
      console.error("Error deleting income: ", err.response?.data?.message || err.message);
      toast.error("Failed to delete income");
    }
  }

  //Download income details in excel
  const downloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.DOWNLOAD_INCOME}`, {
        responseType: 'blob', // Important for file download
      });
      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Error downloading income details: ", err.response?.data?.message || err.message);
      toast.error("Failed to download income details");
    }
  }

  useEffect(() => {
    fetchIncomeDetails();
    return () => { };
  }, [])


  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownLoad={downloadIncomeDetails}
          />
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Confirm Delete"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income entry?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Income
