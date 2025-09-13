// import { Dimensions, View } from "react-native";
// import {
//     Gesture,
//     GestureDetector,
//     GestureHandlerRootView,
// } from "react-native-gesture-handler";
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withSpring,
// } from "react-native-reanimated";

import { DotIndicator } from "../../../components";

// export default function App() {
//     const screenHeight = Dimensions.get("window").height;
//     const { height } = Dimensions.get("screen");

//     // Position Y du panneau (commence à 400px du haut)
//     const translateY = useSharedValue(0);
//     const savedPosition = useSharedValue(0); // Sauvegarde la position finale
//     const initialTop = screenHeight * 0.38;

//     const animatedStyle = useAnimatedStyle(() => {
//         return {
//             transform: [{ translateY: translateY.value }],
//         };
//     });

//     const gesture = Gesture.Pan()
//         .onUpdate((event) => {
//             // Ajouter la translation actuelle à la position sauvegardée
//             translateY.value = withSpring(savedPosition.value + event.translationY);
//         })
//         .onEnd((event) => {
//             // Sauvegarder la position finale pour le prochain geste
//             savedPosition.value = savedPosition.value + event.translationY;
//             translateY.value = savedPosition.value;
//         });

//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <GestureDetector gesture={gesture}>
//                 <View style={{ flex: 1 }}>
//                     <Animated.View
//                         style={[
//                             {
//                                 width: "100%",
//                                 height: height,
//                                 backgroundColor: "rgb(0, 200, 255)",
//                                 position: "absolute",
//                                 top: initialTop, // Position de base à 400px
//                                 borderTopRightRadius: 24,
//                                 borderTopLeftRadius: 24,
//                             },
//                             animatedStyle,
//                         ]}
//                     />
//                 </View>
//             </GestureDetector>
//         </GestureHandlerRootView>
//     );
// }

export default function MessagingScreen() {
    return (
        // <BottomSheet
        //     displayLine={true}
        //     style={{
        //         backgroundColor: "blue",
        //         borderTopRightRadius: 42,
        //         borderTopLeftRadius: 42,
        //     }}
        // >
        //     {/* <View style={{ backgroundColor: "cyan" }}> */}
        //     <Text style={{ position: "absolute", right: 0, bottom: 0 }}>
        //         Ceci est un texte
        //     </Text>
        //     {/* </View> */}
        // </BottomSheet>
        <DotIndicator />
    );
}

