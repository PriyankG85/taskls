import React from "react";
import { ListRenderItem } from "react-native";
import Animated, {
  SharedValue,
  LinearTransition,
  ILayoutAnimationBuilder,
} from "react-native-reanimated";

interface Props extends React.ComponentProps<typeof Animated.FlatList> {
  ListEmptyComponent?: React.ReactElement;
  itemLayoutAnimation?: ILayoutAnimationBuilder;
  data: any[];
  renderItem:
    | ListRenderItem<any>
    | SharedValue<ListRenderItem<any> | null | undefined>
    | null
    | undefined;
  keyExtractor?:
    | ((item: any, index: number) => string)
    | SharedValue<((item: any, index: number) => string) | undefined>
    | undefined;
}

const AnimatedHorizontalList = ({
  ListEmptyComponent,
  itemLayoutAnimation = LinearTransition,
  data,
  renderItem,
  keyExtractor,
  ...props
}: Props) => {
  const flatListRef = React.useRef<Animated.FlatList<any> | null>(null);
  const [scrollPosition, setScrollPosition] = React.useState(0);

  // Track scroll position changes
  const handleScroll = (event: any) => {
    const position = event.nativeEvent.contentOffset.x;
    setScrollPosition(position);
  };

  // Restore position after data changes
  React.useEffect(() => {
    if (flatListRef.current && scrollPosition > 0) {
      // Use a small timeout to ensure the list has updated first
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: scrollPosition,
          animated: false,
        });
      }, 50);
    }
  }, [data.length]);

  return (
    <Animated.FlatList
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      maxToRenderPerBatch={10}
      initialNumToRender={15}
      contentContainerClassName="flex-row items-center p-5 gap-2"
      itemLayoutAnimation={itemLayoutAnimation}
      data={data}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      {...props}
    />
  );
};

export default AnimatedHorizontalList;
