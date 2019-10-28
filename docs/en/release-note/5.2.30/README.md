# Egret Engine 5.2.30 Release Notes
The Egret Engine released the 5.2.30 stable version on October 28, 2019.

After Apple's iOS system was updated to 13.1, the Safari browser added a new feature: "Request Desktop Website", especially the iPad, which is used by default. In this browsing mode, the mobile device's **userAgent** is the same as the mac desktop, causing the engine to recognize the mobile device as a desktop and the associated return value is incorrect. This update is to solve this problem.

- **[OPTIMIZE]** Fixed an issue where egret.Capabilities.os returned a value of "Mac OS" when the mobile device's Safari browser was set to "Request Desktop Website" under iOS 13.1
- **[OPTIMIZE]** Fixed an issue where egret.Capabilities.isMobile returned false when the mobile device's Safari browser was set to "Request Desktop Website" under iOS 13.1.
