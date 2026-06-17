!include "MUI2.nsh"

!define APP_NAME "LC Launcher"
!define APP_VERSION "0.1.0"

OutFile "..\dist\LC-Launcher-Setup.exe"
InstallDir "$PROGRAMFILES\LCLauncher"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY

Var StartMenuFolder
!define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU"
!define MUI_STARTMENUPAGE_REGISTRY_KEY "Software\LCLauncher"
!define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "Start Menu Folder"
!insertmacro MUI_PAGE_STARTMENU Application $StartMenuFolder

!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "Desktop Shortcut" SEC_DESKTOP
    CreateShortCut "$DESKTOP\LC Launcher.lnk" "$INSTDIR\LCLauncher.exe"
SectionEnd

Section "MainSection"
    SetOutPath "$INSTDIR"
    File /r "..\dist\win_x64\*.*"
    
    !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
        CreateDirectory "$SMPROGRAMS\$StartMenuFolder"
        CreateShortCut "$SMPROGRAMS\$StartMenuFolder\LC Launcher.lnk" "$INSTDIR\LCLauncher.exe"
        CreateShortCut "$SMPROGRAMS\$StartMenuFolder\Uninstall.lnk" "$INSTDIR\uninstall.exe"
    !insertmacro MUI_STARTMENU_WRITE_END
    
    WriteUninstaller "$INSTDIR\uninstall.exe"

    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LCLauncher" "DisplayName" "LC Launcher"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LCLauncher" "UninstallString" "$INSTDIR\uninstall.exe"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LCLauncher" "DisplayIcon" "$INSTDIR\LCLauncher.exe
SectionEnd

Section "Uninstall"
    Delete "$INSTDIR\*.*"
    RMDir /r "$INSTDIR"

    RMDir /r "$APPDATA\LC Launcher.exe"
    
    Delete "$DESKTOP\LC Launcher.lnk"
    !insertmacro MUI_STARTMENU_GETFOLDER Application $StartMenuFolder
    Delete "$SMPROGRAMS\$StartMenuFolder\LC Launcher.lnk"
    Delete "$SMPROGRAMS\$StartMenuFolder\Uninstall.lnk"
    RMDir "$SMPROGRAMS\$StartMenuFolder"
    
    DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LCLauncher"
SectionEnd