@echo off
title Push Choyang Im Family Tree to GitHub (jlim33/choyang-im-family-tree)
color 0a
echo ================================================================
echo    🚀 PUSHING CHOYANG IM FAMILY TREE TO GITHUB
echo ================================================================
echo.
cd /d "i:\AntigravityWorkspace\Family Tree"

git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/jlim33/choyang-im-family-tree.git

git add .
git commit -m "feat: Choyang Im Clan Genealogy, Family Tree & Global Map" 2>nul

echo.
echo Pushing to GitHub (https://github.com/jlim33/choyang-im-family-tree.git)...
git push -u origin main

echo.
echo ================================================================
echo    ✅ Push Complete! Now deploy on Vercel at https://vercel.com/new
echo ================================================================
pause
