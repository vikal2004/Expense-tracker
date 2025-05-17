import React from 'react';
import moment from 'moment';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-6 text-left">{expense.title}</td>
      <td className="py-3 px-6 text-left text-green-600 font-semibold">₹{expense.amount}</td>
      <td className="py-3 px-6 text-left">{expense.category}</td>
      <td className="py-3 px-6 text-left">{moment(expense.date).format('DD MMM YYYY')}</td>
      <td className="py-3 px-6 text-center">
        <button
          className="bg-yellow-500 text-white py-1 px-3 rounded mr-2 hover:bg-yellow-600"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
          onClick={onDelete}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ExpenseItem;
