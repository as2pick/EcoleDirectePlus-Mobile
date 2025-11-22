import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { routesNames } from "../../../router/config/routesNames";
import HomeworkDetails from "./HomeworkDetails";
import HomeworksContent from "./HomeworksContent";
import { HomeworksProvider } from "./custom/context/LocalContext";

const NativeStack = createNativeStackNavigator();

export default function HomeworksScreen() {
    const {
        client: {
            homeworks: { content, details },
        },
    } = routesNames;

    return (
        <HomeworksProvider>
            <NativeStack.Navigator
                initialRouteName={content}
                screenOptions={{
                    headerShown: false,
                    animation: "fade",
                }}
            >
                <NativeStack.Screen name={content} component={HomeworksContent} />
                <NativeStack.Screen name={details} component={HomeworkDetails} />
            </NativeStack.Navigator>
        </HomeworksProvider>
    );
}

