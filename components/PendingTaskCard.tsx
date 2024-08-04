import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import toggleTaskCompleted from "@/hooks/useMarkTaskCompleted";
import { CheckCircle, Clock } from "lucide-react-native";
import TodosContext from "@/context/userTodos";

const PendingTaskCard = ({
  dark,
  taskId,
  notificationId,
  taskGroup,
  title,
  logo,
  dueDate,
}: {
  dark: boolean;
  taskId: string;
  notificationId?: string;
  taskGroup: string;
  title: string;
  logo?: string;
  dueDate?: string;
}) => {
  const bgcolors = [
    "#ff7f6770",
    "#3498DB70",
    "#9A73B570",
    "#F1C45470",
    "#E74C3C70",
    "#2ECC7170",
    "#FF573370",
    "#C7003970",
    "#900C3F70",
    "#58184570",
    "#1ABC9C70",
    "#2ECC7070",
    "#F39C1270",
    "#D3540070",
    "#8E44AD70",
    "#2980B970",
    "#27AE6070",
    "#E67E2270",
    "#EC706370",
    "#AF7AC570",
    "#5DADE270",
    "#48C9B070",
    "#F4D03F70",
    "#DC763370",
  ];
  const randomColor = bgcolors[Math.floor(Math.random() * bgcolors.length)];
  const { todos, setTodos } = useContext(TodosContext);

  return (
    <View
      className="flex-grow rounded-3xl p-4 min-w-[250px] max-w-[450px]"
      style={{ gap: 5, backgroundColor: randomColor }}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-2">
          {logo && (
            <Image
              source={{
                uri: logo,
              }}
              className="w-7 h-7 rounded-lg"
            />
          )}
          <Text
            className={`text-base ${
              dark ? "text-dark-accent-200/70" : "text-light-text-200/70"
            }`}
          >
            {taskGroup}
          </Text>
        </View>

        <TouchableOpacity
          className="p-2 rounded-full"
          onPress={() =>
            setTodos(toggleTaskCompleted(todos, taskId, notificationId, false))
          }
        >
          <CheckCircle size={20} color={"#9ca3afb3"} />
        </TouchableOpacity>
      </View>
      <Text
        className={`text-lg font-semibold leading-5 ${
          dark ? "text-dark-text-200" : "text-light-text-100"
        }`}
        numberOfLines={3}
      >
        {title}
      </Text>
      {dueDate && (
        <View className="flex-row items-center">
          <Clock size={16} color={dark ? "#9ca3afb3" : "#5c5c5c70"} />

          <Text
            className={`${
              dark ? "text-[#9ca3af]" : "text-light-text-200/70"
            } font-Montserrat text-xs`}
          >
            &nbsp;{dueDate}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PendingTaskCard;
