import { MdDelete } from 'react-icons/md';
import { formatCurrency, formatDate, CATEGORY_ICONS } from '../utils/helpers';

const TransactionItem = ({ item, type, onDelete }) => {
  const isIncome = type === 'income';
  const icon = item.icon || CATEGORY_ICONS[item.category] || (isIncome ? '💰' : '💸');

  return (
    <div className="transaction-item">
      <div className="tx-left">
        <div className="tx-icon">{icon}</div>
        <div>
          <div className="tx-title">{item.title}</div>
          <div className="tx-date">{formatDate(item.date)}</div>
        </div>
      </div>
      {onDelete && (
        <button className="delete-btn" onClick={() => onDelete(item._id)}>
          <MdDelete />
        </button>
      )}
      <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
        {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
      </div>
    </div>
  );
};

export default TransactionItem;
