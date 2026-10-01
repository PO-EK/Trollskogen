export type TransactionResult =
  | { success: true }
  | {
      success: false;
      reason: "not_enough_gold" | "destination_full" | "invalid_transaction";
    };
