import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { MdWallet, MdTrendingUp, MdTrendingDown, MdArrowForward } from 'react-icons/md';
import { incomeAPI, expenseAPI } from '../utils/api';
import { formatCurrency, formatDate, CATEGORY_ICONS } from '../utils/helpers';
import TransactionItem from '../components/TransactionItem';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incRes, expRes] = await Promise.all([incomeAPI.getAll(), expenseAPI.getAll()]);
      setIncome(incRes.data.income);
      setTotalIncome(incRes.data.totalIncome);
      setExpenses(expRes.data.expenses);
      setTotalExpense(expRes.data.totalExpense);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = totalIncome - totalExpense;

  // Combine and sort recent transactions
  const allTransactions = [
    ...income.map((i) => ({ ...i, type: 'income' })),
    ...expenses.map((e) => ({ ...e, type: 'expense' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const donutData = {
    labels: ['Total Balance', 'Total Expenses', 'Total Income'],
    datasets: [{
      data: [
        Math.max(totalBalance, 0),
        totalExpense,
        totalIncome,
      ],
      backgroundColor: ['#7B5EA7', '#FF4757', '#FF8C42'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const donutOptions = {
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${formatCurrency(ctx.raw)}` } },
    },
  };

  // Last 30 days expenses by category
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentExpenses = expenses.filter((e) => new Date(e.date) >= thirtyDaysAgo);

  const categoryTotals = recentExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner" style={{ borderColor: 'var(--primary-light)', borderTopColor: 'var(--primary)', width: 40, height: 40, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div>
      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon balance"><MdWallet /></div>
          <div>
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">{formatCurrency(totalBalance)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon income"><MdTrendingUp /></div>
          <div>
            <div className="stat-label">Total Income</div>
            <div className="stat-value">{formatCurrency(totalIncome)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon expense"><MdTrendingDown /></div>
          <div>
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">{formatCurrency(totalExpense)}</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions + Donut */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Recent Transactions</div>
            </div>
            <Link to="/income" className="see-all-btn">
              See All <MdArrowForward />
            </Link>
          </div>
          <div className="transactions-list">
            {allTransactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💳</div>
                <div className="empty-state-text">No transactions yet</div>
              </div>
            ) : (
              allTransactions.map((tx) => (
                <TransactionItem key={tx._id} item={tx} type={tx.type} />
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title">Financial Overview</div>
          </div>
          <div style={{ position: 'relative', maxWidth: 260, margin: '0 auto' }}>
            <Doughnut data={donutData} options={donutOptions} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Balance</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(totalBalance)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Balance', color: '#7B5EA7' },
              { label: 'Total Expenses', color: '#FF4757' },
              { label: 'Total Income', color: '#FF8C42' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses List + Chart */}
      <div className="dashboard-grid" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="section-header">
            <div className="section-title">Expenses</div>
            <Link to="/expense" className="see-all-btn">
              See All <MdArrowForward />
            </Link>
          </div>
          <div className="transactions-list">
            {expenses.slice(0, 5).map((exp) => (
              <TransactionItem key={exp._id} item={exp} type="expense" />
            ))}
            {expenses.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">💸</div>
                <div className="empty-state-text">No expenses yet</div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title">Last 30 Days Expenses</div>
          </div>
          {Object.keys(categoryTotals).length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">No expense data for last 30 days</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([cat, amount]) => {
                  const maxVal = Math.max(...Object.values(categoryTotals));
                  const pct = (amount / maxVal) * 100;
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                        <span style={{ fontWeight: 600 }}>{CATEGORY_ICONS[cat]} {cat}</span>
                        <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{formatCurrency(amount)}</span>
                      </div>
                      <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: 4, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Income section */}
      <div className="dashboard-grid" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="section-header">
            <div className="section-title">Last 60 Days Income</div>
          </div>
          {income.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💰</div>
              <div className="empty-state-text">No income data</div>
            </div>
          ) : (() => {
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
            const recentIncome = income.filter((i) => new Date(i.date) >= sixtyDaysAgo);
            const incomeCats = recentIncome.reduce((acc, i) => {
              acc[i.category] = (acc[i.category] || 0) + i.amount;
              return acc;
            }, {});

            const colors = ['#7B5EA7', '#FF4757', '#FF8C42', '#2ED573', '#1e90ff', '#ff6b9d'];
            const cats = Object.entries(incomeCats);

            if (cats.length === 0) return (
              <div className="empty-state">
                <div className="empty-state-icon">💰</div>
                <div className="empty-state-text">No income in last 60 days</div>
              </div>
            );

            const totalInc60 = cats.reduce((s, [, v]) => s + v, 0);
            const donutIncome = {
              labels: cats.map(([k]) => k),
              datasets: [{
                data: cats.map(([, v]) => v),
                backgroundColor: colors.slice(0, cats.length),
                borderWidth: 0,
              }],
            };

            return (
              <>
                <div style={{ position: 'relative', maxWidth: 220, margin: '0 auto' }}>
                  <Doughnut data={donutIncome} options={{ ...donutOptions, plugins: { ...donutOptions.plugins, legend: { display: false } } }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Income</div>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{formatCurrency(totalInc60)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 16px', marginTop: 16 }}>
                  {cats.map(([cat], i) => (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: colors[i], display: 'inline-block' }} />
                      {cat}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title">Income</div>
            <Link to="/income" className="see-all-btn">
              See All <MdArrowForward />
            </Link>
          </div>
          <div className="transactions-list">
            {income.slice(0, 5).map((inc) => (
              <TransactionItem key={inc._id} item={inc} type="income" />
            ))}
            {income.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">💰</div>
                <div className="empty-state-text">No income yet</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
