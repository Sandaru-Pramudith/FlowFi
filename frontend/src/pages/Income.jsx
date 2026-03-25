import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { MdAdd, MdDownload } from 'react-icons/md';
import { incomeAPI, downloadFile } from '../utils/api';
import { formatCurrency, formatDate, CATEGORY_ICONS } from '../utils/helpers';
import TransactionItem from '../components/TransactionItem';
import AddIncomeModal from '../components/AddIncomeModal';
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Income = () => {
  const [income, setIncome] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { fetchIncome(); }, []);

  const fetchIncome = async () => {
    try {
      const { data } = await incomeAPI.getAll();
      setIncome(data.income);
      setTotalIncome(data.totalIncome);
    } catch (err) {
      toast.error('Failed to load income data');
    } finally {
      setFetching(false);
    }
  };

  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      await incomeAPI.add(formData);
      await fetchIncome();
      setShowModal(false);
      toast.success('Income added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await incomeAPI.delete(id);
      await fetchIncome();
      toast.success('Income deleted');
    } catch (err) {
      toast.error('Failed to delete income');
    }
  };

  const handleDownload = async () => {
    try {
      const { data } = await incomeAPI.download();
      downloadFile(data, 'income.xlsx');
      toast.success('Income data downloaded!');
    } catch (err) {
      toast.error('Failed to download data');
    }
  };

  // Chart data - last 10 entries
  const chartData = {
    labels: income.slice(0, 10).reverse().map((i) => formatDate(i.date)),
    datasets: [{
      label: 'Income Amount',
      data: income.slice(0, 10).reverse().map((i) => i.amount),
      backgroundColor: income.slice(0, 10).reverse().map((_, idx) =>
        idx % 2 === 0 ? '#7B5EA7' : '#c4b0e0'
      ),
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
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
          <h1 className="page-title">Income Overview</h1>
          <p className="page-subtitle">Track your earnings over time and analyze your income trends.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd /> Add Income
        </button>
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        {income.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📈</div>
            <div className="empty-state-text">Add income to see your chart</div>
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>

      {/* Income Sources */}
      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">Income Sources</div>
            <div className="section-subtitle">Total: {formatCurrency(totalIncome)}</div>
          </div>
          <button className="btn-secondary" onClick={handleDownload}>
            <MdDownload /> Download
          </button>
        </div>

        {income.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💰</div>
            <div className="empty-state-text">No income records yet. Add your first income entry!</div>
          </div>
        ) : (
          <div className="sources-grid">
            {income.map((item) => (
              <TransactionItem key={item._id} item={item} type="income" onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddIncomeModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Income;
