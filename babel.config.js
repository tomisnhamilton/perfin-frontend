module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            [
                "module-resolver",
                {
                    root: ["./"],
                    extensions: [
                        ".ios.ts",
                        ".android.ts",
                        ".ts",
                        ".ios.tsx",
                        ".android.tsx",
                        ".tsx",
                        ".jsx",
                        ".js",
                        ".json",
                    ],
                    alias: {
                        "@": "./src",
                        "@/assets": "./src/assets",
                        "@/components": "./src/components",
                        "@/constants": "./src/constants",
                        "@/hooks": "./src/hooks",
                        "@/navigation": "./src/navigation",
                        "@/services": "./src/services",
                        "@/store": "./src/store",
                        "@/theme": "./src/theme",
                        "@/types": "./src/types",
                        "@/utils": "./src/utils"
                    },
                },
            ],
            "react-native-reanimated/plugin",
        ],
    };
};