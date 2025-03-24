import { useCallback, useState } from "react";
import { useCustomFetch } from "src/hooks/useCustomFetch";
import { SetTransactionApprovalParams } from "src/utils/types";
import { TransactionPane } from "./TransactionPane";
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types";

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch();
  const [selectedEmployee, setSelectedEmployee] = useState(""); // Employee filter
  const [selectedTransactions, setSelectedTransactions] = useState<Record<string, boolean>>({}); // Tracks selected checkboxes
  const [transactionStatus, setTransactionStatus] = useState<Record<string, string>>({}); // Tracks approved/declined status

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, value }) => {
      try {
        await fetchWithoutCache<void, SetTransactionApprovalParams>(
          "setTransactionApproval",
          { transactionId, value }
        );
        console.log(`Transaction ${transactionId} set to ${value}`);
      } catch (error) {
        console.error("Approval update failed:", error);
      }
    },
    [fetchWithoutCache]
  );

  // Get unique employee names for filtering
  const employeeNames = Array.from(
    new Set(transactions?.map((t) => `${t.employee.firstName} ${t.employee.lastName}`) || [])
  );

  // Filter transactions based on selected employee
  const filteredTransactions = selectedEmployee
    ? transactions?.filter(
        (t) =>
          `${t.employee.firstName} ${t.employee.lastName}` === selectedEmployee
      )
    : transactions;

  // Handle "Select All" checkbox toggle
  const handleSelectAll = () => {
    const newSelectAllState = Object.values(selectedTransactions).length !== filteredTransactions?.length;
    setSelectedTransactions(
      (filteredTransactions || []).reduce((acc, transaction) => {
        acc[transaction.id] = newSelectAllState;
        return acc;
      }, {} as Record<string, boolean>)
    );
  };

  // Handle bulk approval or decline
  const handleBulkAction = async (approve: boolean) => {
    const action = approve ? "Approved" : "Declined";

    for (const transactionId in selectedTransactions) {
      await setTransactionApproval({ transactionId, value: approve });
    }

    // Show alert
    alert(`Selected transactions have been ${action.toLowerCase()}.`);

    // Update UI to replace checkboxes with status
    setTransactionStatus((prev) => ({
      ...prev,
      ...Object.keys(selectedTransactions).reduce(
        (acc, transactionId) => ({
          ...acc,
          [transactionId]: action,
        }),
        {}
      ),
    }));

    // Clear selected transactions
    setSelectedTransactions({});
  };

  if (!transactions) {
    return <div className="RampLoading--container">Loading...</div>;
  }

  return (
    <div>
      {/* Employee Filter Dropdown */}
      <select
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
      >
        <option value="">All Employees</option>
        {employeeNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {/* "Select All" Checkbox */}
      <div>
        <input
          type="checkbox"
          id="selectAll"
          checked={Object.values(selectedTransactions).length === filteredTransactions?.length}
          onChange={handleSelectAll}
          disabled={Object.values(transactionStatus).length === transactions?.length} // Disable if all transactions are processed
        />
        <label htmlFor="selectAll">Select All Transactions</label>
      </div>

      {/* Transaction List */}
      <div data-testid="transaction-container">
        {(filteredTransactions || []).map((transaction) => (
          <TransactionPane
            key={transaction.id}
            transaction={transaction}
            loading={loading}
            setTransactionApproval={setTransactionApproval}
            isChecked={selectedTransactions[transaction.id] || false}
            status={transactionStatus[transaction.id] || null} // Show status if transaction is approved/declined
            onCheckboxChange={(value: boolean) =>
              setSelectedTransactions((prev) => ({
                ...prev,
                [transaction.id]: value,
              }))
            }
          />
        ))}
      </div>

      {/* Approve & Decline Buttons */}
      <div className="button-container">
        <button className="RampButton approve" onClick={() => handleBulkAction(true)}>
          Approve Selected Transactions
        </button>
        <button className="RampButton decline" onClick={() => handleBulkAction(false)}>
          Decline Selected Transactions
        </button>
      </div>
    </div>
  );
};
