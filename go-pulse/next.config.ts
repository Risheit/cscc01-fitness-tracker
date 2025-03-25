import type { NextConfig } from 'next';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '.env') });

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
