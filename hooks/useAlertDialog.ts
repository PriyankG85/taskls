import { AlertDialogContext } from "@/components/ui/alert-dialog-provider";
import { useContext } from "react";

export const useAlertDialog = (): {
  show: (
    title: string,
    action: () => void,
    description?: string,
    confirmText?: string
  ) => void;
} => {
  const context = useContext(AlertDialogContext);
  if (context === undefined) {
    throw new Error(
      "useAlertDialog must be used within an AlertDialogProvider"
    );
  }
  return context;
};
