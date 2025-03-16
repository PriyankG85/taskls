import {
  AlertDialogContext,
  AlertDialogContextType,
} from "@/components/ui/alert-dialog-provider";
import { useContext } from "react";

export const useAlertDialog = (): AlertDialogContextType => {
  const context = useContext(AlertDialogContext);
  if (context === undefined) {
    throw new Error(
      "useAlertDialog must be used within an AlertDialogProvider"
    );
  }
  return context;
};
