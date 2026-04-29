/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // Cloudinary images allow karne ke liye
  },
};

export default nextConfig;
