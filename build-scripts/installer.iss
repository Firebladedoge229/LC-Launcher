[Setup]
AppName=LC Launcher
DefaultDirName={autopf}\LC Launcher
OutputBaseFilename=LC-Launcher-Setup
[Files]
Source: "dist/lc-launcher-win_x64/*"; DestDir: "{app}"; Flags: recursesubdirs
[Icons]
Name: "{commonprograms}\LC Launcher"; Filename: "{app}\LC-Launcher.exe"