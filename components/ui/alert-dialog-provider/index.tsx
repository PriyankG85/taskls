import { GestureResponderEvent, Text } from "react-native";
import React, { useCallback, useState } from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "../button";

export interface AlertDialogContextType {
  show: (
    title: string,
    action: (event: GestureResponderEvent) => void,
    description?: string,
    confirmText?: string
  ) => void;
}

export const AlertDialogContext = React.createContext<
  AlertDialogContextType | undefined
>(undefined);

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText: string;
  action: (event: GestureResponderEvent) => void;
}

const AlertDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogState, setDialogState] = useState<AlertDialogState>({
    isOpen: false,
    title: "",
    description: undefined,
    confirmText: "Confirm",
    action: () => {},
  });

  const handleClose = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const show = useCallback(
    (
      title: string,
      action: (event: GestureResponderEvent) => void,
      description?: string,
      confirmText: string = "Confirm"
    ) => {
      setDialogState({
        isOpen: true,
        title,
        description,
        confirmText,
        action,
      });
    },
    []
  );

  return (
    <AlertDialogContext.Provider value={{ show }}>
      {children}
      <AlertDialog isOpen={dialogState.isOpen} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent className="gap-5">
          <AlertDialogHeader>
            <Text className="text-typography-950 font-semibold text-lg">
              {dialogState.title}
            </Text>
          </AlertDialogHeader>
          {dialogState.description && (
            <AlertDialogBody className="mt-3 mb-4">
              <Text className="text-typography-700 text-sm">
                {dialogState.description}
              </Text>
            </AlertDialogBody>
          )}
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="sm"
              onPress={(e) => {
                handleClose();
                dialogState.action(e);
              }}
            >
              <ButtonText>{dialogState.confirmText}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};

export default AlertDialogProvider;
