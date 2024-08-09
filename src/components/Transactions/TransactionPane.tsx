import { useState } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved)

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        // Updated the onChange function to immediately reflect the UI change before making the async request.
        //
        // Before:
        // onChange={async (newValue) => {
        //   const response = await consumerSetTransactionApproval({
        //     transactionId: transaction.id,
        //     newValue,
        //   })
        //   setApproved(newValue)
        // }}
        //
        // - The approval status was only updated in the UI after the async operation was completed.
        // - This caused a delay in the UI response, making the application feel sluggish.
        //
        // - The approval status is now updated immediately in the UI before the async operation is completed.
        // - This makes the application feel more responsive, as the user sees the change instantly, even while the async request is still being processed.

        onChange={async (newValue) => {
          setApproved(newValue)

          await consumerSetTransactionApproval({
            transactionId: transaction.id,
            newValue,
          })
        }}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
