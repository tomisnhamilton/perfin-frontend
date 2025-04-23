// src/app/webview-test.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { checkServerConnection } from '@/utils/debugHelper';

export default function WebViewTest() {
    const [url, setUrl] = useState('http://localhost:3000/test-html');
    const [showWebView, setShowWebView] = useState(false);
    const [logs, setLogs] = useState([]);
    const router = useRouter();

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prevLogs => [`[${timestamp}] ${message}`, ...prevLogs]);
    };

    const handleTestConnection = async () => {
        addLog(`Testing connection to: ${url}`);
        const result = await checkServerConnection(url);

        if (result.success) {
            addLog(`✅ Connection successful (${result.time}ms)`);
        } else {
            addLog(`❌ Connection failed: ${result.error}`);
        }
    };

    const handleLoadWebView = () => {
        addLog(`Loading WebView with URL: ${url}`);
        setShowWebView(true);
    };

    return (
        <SafeAreaView className="flex-1">
            <View className="p-4 bg-blue-500">
                <Text className="text-white text-xl font-bold">WebView Diagnostic</Text>
            </View>

            <View className="p-4">
                <Text className="font-bold mb-2">URL to test:</Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-2 mb-4"
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <View className="flex-row justify-between mb-4">
                    <TouchableOpacity
                        className="bg-blue-500 rounded-md px-4 py-2"
                        onPress={handleTestConnection}
                    >
                        <Text className="text-white font-bold">Test Connection</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-green-500 rounded-md px-4 py-2"
                        onPress={handleLoadWebView}
                    >
                        <Text className="text-white font-bold">Load WebView</Text>
                    </TouchableOpacity>
                </View>

                {showWebView && (
                    <View className="border border-gray-300 h-60 mb-4">
                        <WebView
                            source={{ uri: url }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            onLoadStart={() => addLog('WebView: Load started')}
                            onLoad={() => addLog('WebView: Loaded successfully')}
                            onError={(e) => addLog(`WebView Error: ${e.nativeEvent.description}`)}
                            onHttpError={(e) => addLog(`HTTP Error: ${e.nativeEvent.statusCode}`)}
                        />
                    </View>
                )}

                <Text className="font-bold mb-2">Logs:</Text>
                <ScrollView className="border border-gray-300 rounded-md p-2 h-40">
                    {logs.map((log, index) => (
                        <Text key={index} className="mb-1">{log}</Text>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    className="bg-gray-500 rounded-md px-4 py-2 mt-4"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-bold text-center">Go Back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}