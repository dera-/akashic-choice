/**
 * Sandbox環境か判定する関数
 * @return Sandbox環境ならtrue
 */
export function isSandbox(): boolean {
    return typeof window !== "undefined" && "gScriptContainer" in window;
}

/**
 * 放送主か判定する関数
 * coeを使わない共体験コンテンツで使用される想定
 * coeの場合はcoeUtil.isCaster()を使用する
 * @returns 放送主ならtrue
 */
export function isCaster(): boolean {
    if (isSandbox() && g.game.selfId === "broadcaster") return true;
    if (!g.game.vars.parameters.broadcasterId) return false;
    return g.game.vars.parameters.broadcasterId === g.game.selfId ? true : false;
}

/**
 * サーバーインスタンスか判定する関数
 * @returns サーバーインスタンスならtrue
 */
export function isServer(): boolean {
    if (isSandbox() && g.game.selfId === "server") {
        return true;
    }
    return g.game.selfId === undefined ? true : false;
}
