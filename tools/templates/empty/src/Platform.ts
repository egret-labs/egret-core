declare interface Platform {

    getUserInfo(): Promise<any>;

    login(): Promise<any>

}


declare let platform: Platform;
declare interface Window {

    platform: Platform
}


class DebugPlatform implements Platform {
    async getUserInfo() {
        return { nickName: "username" }
    }
    async login() {

    }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
}



