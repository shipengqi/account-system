# Installation

## Install MySQL 8.x

Download and install `MySQL`: https://dev.mysql.com/downloads/installer/

## Install Windows Service

Download `account-system`: https://github.com/shipengqi/account-system/releases
Download `WinSW`: https://github.com/winsw/winsw/releases

- Take `WinSW.exe` or `WinSW.zip` from the distribution, and rename the `.exe` to your taste (such as `myapp.exe`).
- Update `<executable>` and `<arguments>` `myapp.xml` (see the [XML config file specification](https://github.com/winsw/winsw/blob/v3/docs/xml-config-file.md) and samples for more details).
- Place those two files side by side, because that's how WinSW discovers its co-related configuration.
- Run `myapp.exe install` to install the service.
- Run `myapp.exe` start to start the service.
- Follow the step `Computer` -> `Manage` -> `Service And Applications` -> `Services` to check service status.
