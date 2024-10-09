const webpack = require("webpack");
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
        // config.resolve.fallback = {
        //     url: require.resolve("url"),
        //     fs: require.resolve("graceful-fs"),
        //     buffer: require.resolve("buffer"),
        //     stream: require.resolve("stream-browserify"),
        // };
        // config.plugins.push(
        //     new webpack.ProvidePlugin({
        //         Buffer: ["buffer", "Buffer"],
        //     }),
        //     new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        //         const mod = resource.request.replace(/^node:/, "");
        //         switch (mod) {
        //             case "buffer":
        //                 resource.request = "buffer";
        //                 break;
        //             case "stream":
        //                 resource.request = "readable-stream";
        //                 break;
        //             default:
        //                 throw new Error(`Not found ${mod}`);
        //         }
        //     }),
        // );

        // config.resolve.fallback = { fs: false };
        return config;
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/CampaignList",
                permanent: true,
            },
        ];
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
