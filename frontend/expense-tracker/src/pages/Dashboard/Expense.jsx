import React, { useState, useEffect } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout'
import ExpenseOverview from '../../components/expense/ExpenseOverview'
import axiosInstance from '../../utills/axiosInstance'
import { API_PATHS } from '../../utills/apiPaths'
import Modal from '../../components/Modal'
import { toast } from 'react-hot-toast';
import AddExpenseForm from '../../components/expense/AddExpenseForm'
import ExpenseList from '../../components/expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  //Get all expense details
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (err) {
      console.log("Error fetching expense details: ", err);
    } finally {
      setLoading(false);
    }
  }

  //handle add expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    //validation checks
    if (!category.trim()) {
      toast.error("Expense category is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!date) {
      toast.error("Please select a date for the expense");
      return;
    }
    try {
      const response = await axiosInstance.post(`${API_PATHS.EXPENSE.ADD_EXPENSE}`, {
        category,
        amount,
        date,
        icon
      });
    } catch (err) {
      console.log("Error adding expense: ", err);
      toast.error("Failed to add expense");
    } finally {
      // Optionally, you can refresh the expense list after adding a new expense
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    }
  }
  //handle delete expense
  const deleteExpense = async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_PATHS.EXPENSE.DELETE_EXPENSE(id)}`);
      // Optionally, you can refresh the expense list after deleting an expense
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (err) {
      console.log("Error deleting expense: ", err);
      toast.error("Failed to delete income");
    }
  }

  //handle download expense details
  const downloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.DOWNLOAD_EXPENSE}`,
        {
          responseType: 'blob'
        }
      );

      //create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log("Error downloading expense details: ", err);
      toast.error("Failed to download expense details");
    }

  }

  useEffect(() => {
    fetchExpenseDetails();

    return () => { }
  }, [])

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={downloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm
            onAddExpense={handleAddExpense}
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense
