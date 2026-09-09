@echo off
title Push Choyang Lim Family Tree to GitHub (jlim33/choyang-lim-family-tree)
color 0a
echo ================================================================
echo    🚀 PUSHING CHOYANG LIM FAMILY TREE TO GITHUB
echo ================================================================
echo.
cd /d "i:\AntigravityWorkspace\Family Tree"

git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/jlim33/choyang-lim-family-tree.git

git add .
git commit -m "chore: update project name to choyang-lim-family-tree" 2>nul

echo.
echo Pushing to GitHub (https://github.com/jlim33/choyang-lim-family-tree.git)...
git push -u origin main

echo.
echo ================================================================
echo    ✅ Push Complete! Now deploy on Vercel at https://vercel.com/new
echo ================================================================
pause
