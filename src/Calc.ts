export type DecisionForValue = "MAX" | "AVG" | "MID" | "MIN";
export type DecisionForChoice = "MAX" | "MIN" | "RAND";

export interface ChoiceStatus {
    name: string;
    supporter: number;
}

export interface ChoicesStatus {
    choices: ChoiceStatus[];
    decision: DecisionForChoice;
}

export interface ValueChoiceStatus {
    values: number[];
    decision: DecisionForValue;
    min?: number;
    max?: number;
}

export function decideForChoices(status: ChoicesStatus): ChoiceStatus|null {
    const count = status.choices.length;
    if (count === 0) {
        return null;
    }

    const supporters = status.choices.map(c => c.supporter);
    switch (status.decision) {
        case "MAX":
        case "MIN":
            const sortedSupporters = supporters.slice().sort((a, b) => b - a);
            const targetIndex = status.decision === "MIN" ? count - 1 : 0;
            return status.choices[supporters.indexOf(sortedSupporters[targetIndex])];
        case "RAND":
            const max = 1000;
            const random = g.game.random.get(0, max) / max;
            const rates = getRates(supporters);
            let total = 0;
            for (let index = 0; index < count; index++) {
                if (total <= random && random < total + rates[index]) {
                    return status.choices[index];
                }
                total += rates[index];
            }
            return status.choices[count - 1]; // 恐らくここに到達することはないと思うが念のため
    }
}

export function getRatesForChoices(status: ChoicesStatus): number[] {
    const supporters = status.choices.map(c => c.supporter);
    return getRates(supporters);
}

export function decideForValues(status: ValueChoiceStatus): number|null {
    const count = status.values.length;
    if (count === 0) {
        return null;
    }

    const sortedValues = status.values.slice().sort((a, b) => b - a);
    switch (status.decision) {
        case "MAX":
        case "MIN":
            const targetIndex = status.decision === "MIN" ? count - 1 : 0;
            return status.values[status.values.indexOf(sortedValues[targetIndex])];
        case "AVG":
            const total = status.values.reduce((acc, cur) => acc + cur);
            return Math.round(total / count);
        case "MID":
            if (count % 2 === 0) {
                return (sortedValues[count / 2 - 1] + sortedValues[count / 2]) / 2;
            } else {
                return sortedValues[(count + 1 / 2) - 1];
            }
    }
}

function getRates(supporters: number[]): number[] {
    const totalSupporters = supporters.reduce((acc, cur) => acc + cur);
    return supporters.map(s => s / totalSupporters);
}
