@echo off
title Deploy Choyang Lim Family Tree to Vercel
color 0b
echo ================================================================
echo    🚀 CHOYANG LIM FAMILY TREE - VERCEL ONE-CLICK DEPLOYMENT
echo ================================================================
echo.
cd /d "i:\AntigravityWorkspace\Family Tree"

echo [Step 1] Launching Vercel Production Deploy...
echo (If this is your first time, Vercel will open a browser login window)
echo.

"C:\Program Files\nodejs\npx.cmd" vercel --prod

echo.
echo ================================================================
echo    ✅ Deployment Finished! Check your live Vercel URL above.
echo ================================================================
pause
