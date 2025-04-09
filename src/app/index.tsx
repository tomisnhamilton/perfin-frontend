import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { WelcomeCard } from "@/components/features/welcome/WelcomeCard";
import { useRouter } from "expo-router";

export default function Index() {
    // Use router directly instead of custom hook for now
    const router = useRouter();

    const handleGetStarted = () => {
        console.log("Get Started pressed");
        // You can implement this once you have tabs setup
        // router.push("/(tabs)/dashboard");
    };

    return (
        <ScreenLayout>
            <View className="flex-1 justify-center items-center p-4">
                <WelcomeCard
                    title="Welcome to PerFin!"
                    subtitle="Your personal finance companion"
                />

                <View className="w-full max-w-sm gap-4 mt-8">
                    <Button
                        title="Get Started"
                        variant="primary"
                        onPress={handleGetStarted}
                    />

                    <Button
                        title="Learn More"
                        variant="outline"
                        className="mt-2"
                        onPress={() => console.log("Learn More pressed")}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
}