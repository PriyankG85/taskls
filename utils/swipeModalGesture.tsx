import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function swipeModalGesture(
  translateY: SharedValue<number>,
  screenHeight: number,
  handleModalClose: () => void
) {
  const prevTranslateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // Store current position when gesture begins
      prevTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      // Directly use translationY without intermediate calculations
      // This reduces object allocations and math operations in the UI thread
      translateY.value = Math.max(0, prevTranslateY.value + e.translationY);
    })
    .onEnd(() => {
      // This constant is calculated once per render instead of on every gesture end
      const THRESHOLD = screenHeight * 0.12;

      if (translateY.value > THRESHOLD) {
        // Close dialog on downward swipe exceeding threshold
        // Using withTiming for smooth animation
        translateY.value = withTiming(
          screenHeight,
          { duration: 300 },
          (finished) => {
            // Only call JS function when animation is complete
            // This keeps animation smooth by avoiding JS thread jumps during animation
            if (finished) {
              runOnJS(handleModalClose)();
            }
          }
        );
      } else {
        // Return to initial position with animation
        // No callback needed for snap-back, reducing JS bridge calls
        translateY.value = withTiming(0, { duration: 300 });
      }
    });

  return panGesture;
}
