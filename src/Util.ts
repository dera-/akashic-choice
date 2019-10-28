import { isCaster } from "./User";

const SAMPLE_NAMES = [
    "aaaaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbb",
    "ccccccc",
    "ddddddddddd",
    "ffffffffffffff"
]

/** g.game.external.nicoが存在しない環境に仮のものを埋め込むためのメソッド  */
export function setMockNicoPlugin(): void {
    const names = SAMPLE_NAMES;
    g.game.external.nico = {
        getAccount(callback: (err: any, data?: any) => void) {
            if (g.game.selfId == null) {
                callback(new Error("not found"));
                return;
            }
            const isPremium = isCaster() || Number(g.game.selfId) % 2 === 0; // ToolNicoTower#getPlayerStatus に合わせた
            callback(null, {
                id: g.game.selfId,
                name: names[Math.floor(names.length * Math.random())], // g.game.randomの場合全ユーザー名が同じになるのでMath.randomを使用
                premium: isPremium ? "premium" : null
            });
        },
        share: {
            isSupported(callback: (supported: boolean) => void) {
                callback(true);
            },
            requestShare(message: string) {
                window.open(`http://twitter.com/share?url=""&&text=${encodeURIComponent(message)}`, "_blank");
            }
        }
    };
    g.game.external.send = (obj: any) => {
        if (obj.type && obj.type === "nx:open") {
            if (obj.url) {
                window.open(obj.url, "_blank");
            } else {
                console.error("引数オブジェクトにurl属性を指定してください。");
            }
        } else {
            console.error("引数オブジェクトにtype属性を指定してください。また、type=\"nx:open\"しか対応していません。");
        }
    };
}
