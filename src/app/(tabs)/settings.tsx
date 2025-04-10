import React from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

// Mock settings
const SETTING_SECTIONS = [
    {
        id: "1",
        title: "Account",
        settings: [
            {
                id: "profile",
                title: "Profile Information",
                icon: "person-outline",
                type: "navigate",
                color: "blue",
            },
            {
                id: "security",
                title: "Security",
                icon: "shield-checkmark-outline",
                type: "navigate",
                color: "green",
            },
            {
                id: "notifications",
                title: "Notifications",
                icon: "notifications-outline",
                type: "toggle",
                value: true,
                color: "red",
            },
        ],
    },
    {
        id: "2",
        title: "Preferences",
        settings: [
            {
                id: "currency",
                title: "Currency",
                icon: "cash-outline",
                type: "navigate",
                value: "USD",
                color: "yellow",
            },
            {
                id: "language",
                title: "Language",
                icon: "language-outline",
                type: "navigate",
                value: "English",
                color: "purple",
            },
            {
                id: "theme",
                title: "Dark Mode",
                icon: "moon-outline",
                type: "toggle",
                value: true,
                color: "indigo",
            },
        ],
    },
    {
        id: "3",
        title: "Data",
        settings: [
            {
                id: "export",
                title: "Export Data",
                icon: "download-outline",
                type: "navigate",
                color: "blue",
            },
            {
                id: "sync",
                title: "Sync with Cloud",
                icon: "cloud-upload-outline",
                type: "toggle",
                value: true,
                color: "teal",
            },
            {
                id: "delete",
                title: "Delete All Data",
                icon: "trash-outline",
                type: "navigate",
                color: "red",
            },
        ],
    },
];

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    // Get icon color based on setting color and theme
    const getIconColor = (color: string) => {
        const colorMap = {
            blue: isDarkMode ? "#93c5fd" : "#3b82f6",
            green: isDarkMode ? "#86efac" : "#22c55e",
            red: isDarkMode ? "#fca5a5" : "#ef4444",
            yellow: isDarkMode ? "#fde68a" : "#f59e0b",
            purple: isDarkMode ? "#d8b4fe" : "#8b5cf6",
            indigo: isDarkMode ? "#a5b4fc" : "#6366f1",
            teal: isDarkMode ? "#5eead4" : "#14b8a6",
        };
        return colorMap[color as keyof typeof colorMap] || colorMap.blue;
    };

    // Get background color for icon container
    const getIconBgColor = (color: string) => {
        const colorMap = {
            blue: isDarkMode ? "bg-blue-800" : "bg-blue-100",
            green: isDarkMode ? "bg-green-800" : "bg-green-100",
            red: isDarkMode ? "bg-red-800" : "bg-red-100",
            yellow: isDarkMode ? "bg-yellow-800" : "bg-yellow-100",
            purple: isDarkMode ? "bg-purple-800" : "bg-purple-100",
            indigo: isDarkMode ? "bg-indigo-800" : "bg-indigo-100",
            teal: isDarkMode ? "bg-teal-800" : "bg-teal-100",
        };
        return colorMap[color as keyof typeof colorMap] || colorMap.blue;
    };

    const renderSettingItem = (setting: any) => {
        return (
            <TouchableOpacity
                key={setting.id}
                className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
                onPress={() => {
                    if (setting.type === "navigate") {
                        console.log(`Navigate to ${setting.id}`);
                    }
                }}
            >
                <View
                    className={`h-10 w-10 rounded-full ${getIconBgColor(setting.color)} items-center justify-center mr-3`}>
                    <Ionicons
                        name={setting.icon as any}
                        size={20}
                        color={getIconColor(setting.color)}
                    />
                </View>
                <View className="flex-1">
                    <Text className="font-medium text-gray-800 dark:text-white">
                        {setting.title}
                    </Text>
                    {setting.value && setting.type === "navigate" && (
                        <Text className="text-gray-500 dark:text-gray-400 text-sm">
                            {setting.value}
                        </Text>
                    )}
                </View>
                {setting.type === "toggle" ? (
                    <Switch
                        value={setting.value}
                        onValueChange={() => console.log(`Toggle ${setting.id}`)}
                        trackColor={{
                            false: isDarkMode ? "#4b5563" : "#e5e7eb",
                            true: isDarkMode ? "#3b82f6" : "#60a5fa"
                        }}
                        thumbColor={isDarkMode ? "#f9fafb" : "#ffffff"}
                    />
                ) : (
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={isDarkMode ? "#9ca3af" : "#6b7280"}
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <ScreenLayout>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View className="items-center mb-6">
                    <View
                        className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center mb-2">
                        <Ionicons
                            name="person"
                            size={40}
                            color={isDarkMode ? "#93c5fd" : "#3b82f6"}
                        />
                    </View>
                    <Text className="text-xl font-bold text-gray-800 dark:text-white">
                        John Doe
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400">
                        john.doe@example.com
                    </Text>
                </View>

                {/* Settings Sections */}
                {SETTING_SECTIONS.map((section) => (
                    <View key={section.id} className="mb-6">
                        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                            {section.title}
                        </Text>
                        {section.settings.map((setting) => renderSettingItem(setting))}
                    </View>
                ))}

                {/* Additional options */}
                <TouchableOpacity
                    className="flex-row items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl"
                    onPress={() => console.log("Help and Support pressed")}
                >
                    <View
                        className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-800 items-center justify-center mr-3">
                        <Ionicons
                            name="help-circle-outline"
                            size={20}
                            color={isDarkMode ? "#d8b4fe" : "#8b5cf6"}
                        />
                    </View>
                    <Text className="flex-1 font-medium text-gray-800 dark:text-white">
                        Help & Support
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={isDarkMode ? "#9ca3af" : "#6b7280"}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center p-4 mb-6 bg-white dark:bg-gray-800 rounded-xl"
                    onPress={() => console.log("About pressed")}
                >
                    <View
                        className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 items-center justify-center mr-3">
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color={isDarkMode ? "#93c5fd" : "#3b82f6"}
                        />
                    </View>
                    <Text className="flex-1 font-medium text-gray-800 dark:text-white">
                        About PerFin
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={isDarkMode ? "#9ca3af" : "#6b7280"}
                    />
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                    className="p-4 mb-8 bg-red-50 dark:bg-red-900 rounded-xl items-center"
                    onPress={() => console.log("Logout pressed")}
                >
                    <Text className="font-medium text-red-600 dark:text-red-400">
                        Log Out
                    </Text>
                </TouchableOpacity>

                <Text className="text-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                    PerFin v1.0.0
                </Text>
            </ScrollView>
        </ScreenLayout>
    );
}