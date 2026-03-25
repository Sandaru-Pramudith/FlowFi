import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { MdAdd, MdDownload } from 'react-icons/md';
import { expenseAPI, downloadFile } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import TransactionItem from '../components/TransactionItem';
import AddExpenseModal from '../components/AddExpenseModal';
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await expenseAPI.getAll();
      setExpenses(data.expenses);
      setTotalExpense(data.totalExpense);
    } catch (err) {
      toast.error('Failed to load expense data');
    } finally {
      setFetching(false);
    }
  };

  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      await expenseAPI.add(formData);
      await fetchExpenses();
      setShowModal(false);
      toast.success('Expense added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await expenseAPI.delete(id);
      await fetchExpenses();
      toast.success('Expense deleted');
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const handleDownload = async () => {
    try {
      const { data } = await expenseAPI.download();
      downloadFile(data, 'expenses.xlsx');
      toast.success('Expense data downloaded!');
    } catch (err) {
      toast.error('Failed to download data');
    }
  };

  // Chart data - line chart
  const sorted = [...expenses].reverse().slice(-15);
  const chartData = {
    labels: sorted.map((e) => formatDate(e.date)),
    datasets: [{
      label: 'Expense Amount',
      data: sorted.map((e) => e.amount),
      borderColor: '#7B5EA7',
      backgroundColor: 'rgba(123, 94, 167, 0.1)',
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#7B5EA7',
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => {
            const idx = items[0].dataIndex;
            return sorted[idx]?.title || '';
          },
          label: (ctx) => ` Amount: ${formatCurrency(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { callback: (v) => `$${v}`, font: { size: 11 } },
      },
    },
  };

  if (fetching) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner" style={{ borderColor: 'var(--primary-light)', borderTopColor: 'var(--primary)', width: 40, height: 40, borderWidth: 3 }} />
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Expense Overview</h1>
          <p className="page-subtitle">Track your spending trends over time and gain insights into where your money goes.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd /> Add Expense
        </button>
      </div>

      {/* Line Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        {expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📉</div>
            <div className="empty-state-text">Add expenses to see your spending chart</div>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* All Expenses */}
      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">All Expenses</div>
            <div className="section-subtitle">Total: {formatCurrency(totalExpense)}</div>
          </div>
          <button className="btn-secondary" onClick={handleDownload}>
            <MdDownload /> Download
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💸</div>
            <div className="empty-state-text">No expense records yet. Add your first expense entry!</div>
          </div>
        ) : (
          <div className="sources-grid">
            {expenses.map((item) => (
              <TransactionItem key={item._id} item={item} type="expense" onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Expense;
