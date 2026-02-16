/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Desactivado para evitar renderizado doble
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
};

export default nextConfig;
