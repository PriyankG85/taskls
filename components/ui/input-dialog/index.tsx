import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  useCallback,
} from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../alert-dialog";
import { Input, InputField } from "../input";
import { Button, ButtonText } from "../button";
import { Text } from "react-native";

interface InputDialogProviderProps {
  children: ReactNode;
}

interface InputDialogContextType {
  prompt: (message: string) => Promise<string>;
}

const InputDialogContext = createContext<InputDialogContextType | undefined>(
  undefined
);

export const InputDialogProvider: React.FC<InputDialogProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const [resolvePrompt, setResolvePrompt] = useState<
    ((value: string) => void) | null
  >(null);

  const prompt = useCallback((promptMessage: string): Promise<string> => {
    return new Promise((resolve) => {
      setMessage(promptMessage);
      setInput("");
      setResolvePrompt(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolvePrompt) {
      resolvePrompt(input);
    }
    setIsOpen(false);
  }, [input, resolvePrompt]);

  const handleCancel = useCallback(() => {
    if (resolvePrompt) {
      resolvePrompt("");
    }
    setIsOpen(false);
  }, [resolvePrompt]);

  return (
    <InputDialogContext.Provider value={{ prompt }}>
      {children}
      <AlertDialog isOpen={isOpen} onClose={handleCancel}>
        <AlertDialogBackdrop />
        <AlertDialogContent className="gap-4">
          <AlertDialogHeader>
            <Text className="text-typography-950 text-lg">{message}</Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Input>
              <InputField
                value={input}
                onChangeText={setInput}
                placeholder="Enter your input"
              />
            </Input>
          </AlertDialogBody>
          <AlertDialogFooter className="mt-4">
            <Button variant="outline" action="secondary" onPress={handleCancel}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button action="primary" onPress={handleConfirm}>
              <ButtonText>Confirm</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </InputDialogContext.Provider>
  );
};

export const useInputDialog = (): InputDialogContextType => {
  const context = useContext(InputDialogContext);
  if (!context) {
    throw new Error(
      "useInputDialog must be used within an InputDialogProvider"
    );
  }
  return context;
};
