cmd /C "copy ..\README.md ..\Calla-Site\scripts\calla"
cmd /C "cd ..\Calla-Site\scripts\calla && npm publish"
cmd /C "del ..\Calla-Site\scripts\calla\README.md"