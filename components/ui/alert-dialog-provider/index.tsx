import { GestureResponderEvent, Pressable, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Input, InputField } from "../input";
import CheckBox from "@/components/global/CheckBox";

type AlertDialogOptionCheckbox = {
  type: "checkbox";
  text: string; //* required for checkbox
  inputPlaceholder?: string;
  value?: any;
};

type AlertDialogOptionInput = {
  type: "input";
  inputPlaceholder?: string;
  value?: any;
  //* text is omitted or prohibited
};

type CustomInputOption = AlertDialogOptionCheckbox | AlertDialogOptionInput;

export interface AlertDialogContextType {
  show: (
    title: string,
    action: (
      event: GestureResponderEvent,
      customInputOptionsValues?: any
    ) => void,
    description?: string,
    confirmText?: string,
    showCancelButton?: boolean,
    customInputOptions?: Array<CustomInputOption>
  ) => void;
}

interface AlertDialogState {
  isOpen: boolean;
  showCancelButton?: boolean;
  title: string;
  description?: string;
  confirmText: string;
  action: (
    event: GestureResponderEvent,
    customInputOptionsValues?: any
  ) => void;
  customInputOptions?: Array<CustomInputOption>;
}

export const AlertDialogContext = React.createContext<
  AlertDialogContextType | undefined
>(undefined);

const AlertDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogState, setDialogState] = useState<AlertDialogState>({
    isOpen: false,
    showCancelButton: true,
    title: "",
    confirmText: "Confirm",
    action: () => {},
  });

  const handleClose = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const show = useCallback(
    (
      title: string,
      action: (
        event: GestureResponderEvent,
        customInputOptionsValues?: any
      ) => void,
      description?: string,
      confirmText: string = "Confirm",
      showCancelButton: boolean = true,
      customInputOptions?: Array<CustomInputOption>
    ) => {
      setDialogState({
        isOpen: true,
        title,
        description,
        confirmText,
        action,
        customInputOptions,
        showCancelButton,
      });
    },
    []
  );

  return (
    <AlertDialogContext.Provider value={{ show }}>
      {children}

      <AlertDialog isOpen={dialogState.isOpen} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent className="gap-3">
          <AlertDialogHeader>
            <Text className="text-typography-950 font-semibold text-lg">
              {dialogState.title}
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody
            contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
          >
            {dialogState.description && (
              <Text className="text-typography-700 text-sm">
                {dialogState.description}
              </Text>
            )}

            {dialogState.customInputOptions?.map((option, index) => {
              if (option.type === "checkbox") {
                return (
                  <View className="flex-row gap-2 items-end">
                    <CheckBox
                      checked={option.value ?? false}
                      setChecked={(val) =>
                        setDialogState((prev) => ({
                          ...prev,
                          customInputOptions: prev.customInputOptions?.map(
                            (option, index) => {
                              if (index === index) {
                                option.value = val;
                              }
                              return option;
                            }
                          ),
                        }))
                      }
                      size={20}
                    />
                    <Text className="font-Metamorphous dark:text-dark-text-100 text-light-text-100">
                      {option.text}
                    </Text>
                  </View>
                );
              } else if (option.type === "input") {
                return (
                  <Input>
                    <InputField
                      key={index}
                      placeholder={option.inputPlaceholder}
                      value={option.value}
                      onChangeText={(val) => (option.value = val)}
                      className="mb-2"
                      variant="underlined"
                      size="md"
                    />
                  </Input>
                );
              }
            })}
          </AlertDialogBody>
          <AlertDialogFooter className="mt-5">
            {dialogState.showCancelButton && (
              <Pressable
                className="border border-outline-300 rounded-md py-2 px-4"
                onPress={handleClose}
              >
                <Text className="text-outline-700">Cancel</Text>
              </Pressable>
            )}
            <Pressable
              onPress={(e) => {
                handleClose();
                dialogState.action(
                  e,
                  dialogState.customInputOptions?.map((option) => option.value)
                );
              }}
              className="bg-primary-500 rounded-md py-2 px-4"
            >
              <Text className="text-typography-50">
                {dialogState.confirmText}
              </Text>
            </Pressable>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};

export default AlertDialogProvider;
