import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";
import "./TransactionPane.css"; // Import CSS for custom styling

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
  isChecked,
  status,
  onCheckboxChange,
}) => {
  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant}</p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} -{" "}
          {transaction.date}
        </p>
      </div>

      {/* Show "Approved" or "Declined" Instead of Checkbox */}
      {status ? (
        <span className={`transaction-status ${status.toLowerCase()}`}>{status}</span>
      ) : (
        <InputCheckbox
          id={transaction.id}
          checked={isChecked}
          disabled={loading}
          onChange={onCheckboxChange}
        />
      )}
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
