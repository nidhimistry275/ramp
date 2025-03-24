export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  approved: boolean;
  employee: {
    firstName: string;
    lastName: string;
  };
};

export type TransactionsComponent = React.FC<{
  transactions: Transaction[] | null;
}>;

export type SetTransactionApprovalParams = {
  transactionId: string;
  value: boolean;
};

export type SetTransactionApprovalFunction = (params: SetTransactionApprovalParams) => Promise<void>;

export type TransactionPaneComponent = React.FC<{
  transaction: Transaction;
  loading: boolean;
  setTransactionApproval: SetTransactionApprovalFunction;
  isChecked: boolean;
  status: string | null;
  onCheckboxChange: (value: boolean) => void;
}>;
