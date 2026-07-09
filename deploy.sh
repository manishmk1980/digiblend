#!/bin/bash
set -e

APP_NAME="${PM2_APP_NAME:-digiblend}"

echo "-> Pulling latest changes..."
git pull origin main

echo "-> Installing dependencies..."
npm install

echo "-> Generating Prisma client..."
npx prisma generate

echo "-> Running production migrations..."
npx prisma migrate deploy

echo "-> Building Next.js app..."
npm run build

echo "-> Restarting PM2 process..."
pm2 restart "$APP_NAME" || pm2 start npm --name "$APP_NAME" -- start

echo "-> Recent PM2 logs:"
pm2 logs "$APP_NAME" --lines 20 --nostream

echo "Done."
