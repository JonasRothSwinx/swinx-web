/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.html$/i,
            loader: "html-loader",
        });
        config.module.rules.push({
            test: /\.csv$/i,
            use: "raw-loader",
        });

        // config.resolve.fallback = { fs: false };
        return config;
    },
    // webpack: {
    //     module: {
    //         rules: [
    //             {
    //                 test: /\.html$/i,
    //                 loader: "html-loader",
    //             },
    //         ],
    //     },
    // },
};

module.exports = nextConfig;
