import { dateEquals } from 'element-plus';

export const formatSSCData = data => {
    // init setting
    const rankingNumber = 10;
    const newData = {
        issue: [],
        trendField: {},
        extra: {}
    };
    const dataLocation = data.length - 1;

    // init trendField
    for (let i = 0; i <= rankingNumber; i++) {
        newData.trendField[i] = Array.from({ length: rankingNumber }, () => []);
        newData.extra[i] = Array.from({ length: rankingNumber }, () => ({
            total: 0,
            maxMissing: 0,
            averageMissing: 0,
            maxContinuous: 0
        }));
    }

    // fill column value
    const record = {};
    for (let i = 0; i <= dataLocation; i++) {
        newData.issue.push(data[i].lotteryNum);

        for (let rank = 0; rank < rankingNumber; rank++) {
            const winNumber = data[dataLocation - i].results[rank];

            for (let column = 0; column < rankingNumber; column++) {
                const target = newData.trendField[rank + 1][column];
                const extra = newData.extra[rank + 1][column];
                if (column === winNumber) {
                    // total appearend value
                    extra.total += 1;
                    if (target[target.length - 1] < 0) {
                        record[`${rank + 1}${column}`] += 1;
                    } else {
                        record[`${rank + 1}${column}`] = 1;
                    }
                    target.push(-winNumber);
                    // Max continuous
                    extra.maxContinuous = Math.max(extra.maxContinuous, record[`${rank + 1}${column}`]);
                } else {
                    const lastValue = target[target.length - 1];
                    target.push(target.length === 0 || lastValue < 0 ? 1 : lastValue + 1);
                }
                // Average missing value
                if (dataLocation === i) {
                    extra.averageMissing = Math.round(data.length / (extra.total + 1));
                }
                // Max missing value
                extra.maxMissing = Math.max(extra.maxMissing, target[target.length - 1]);
            }
        }
    }

    return newData;
};

export const formatElevenBallChampionData = data => {
    // init setting
    const rankingNumber = 11;
    const newData = {
        issue: [],
        trendField: {},
        extra: {}
    };
    const dataLocation = data.length - 1;

    // init trendField
    for (let i = 0; i <= rankingNumber; i++) {
        newData.trendField[i] = Array.from({ length: rankingNumber }, () => []);
        newData.extra[i] = Array.from({ length: rankingNumber }, () => ({
            total: 0,
            maxMissing: 0,
            averageMissing: 0,
            maxContinuous: 0
        }));
    }

    // fill column value
    const record = {};
    for (let i = 0; i <= dataLocation; i++) {
        newData.issue.push(data[i].lotteryNum);

        for (let rank = 0; rank < rankingNumber; rank++) {
            const winNumber = data[dataLocation - i].results[rank];

            for (let column = 0; column < rankingNumber; column++) {
                const target = newData.trendField[rank + 1][column];
                const extra = newData.extra[rank + 1][column];
                if (column + 1 === winNumber) {
                    // total appearend value
                    extra.total += 1;
                    if (target[target.length - 1] < 0) {
                        record[`${rank + 1}${column}`] += 1;
                    } else {
                        record[`${rank + 1}${column}`] = 1;
                    }
                    target.push(-winNumber);
                    // Max continuous
                    extra.maxContinuous = Math.max(extra.maxContinuous, record[`${rank + 1}${column}`]);
                } else {
                    const lastValue = target[target.length - 1];
                    target.push(target.length === 0 || lastValue < 0 ? 1 : lastValue + 1);
                }
                // Average missing value
                if (dataLocation === i) {
                    extra.averageMissing = Math.round(data.length / (extra.total + 1));
                }
                // Max missing value
                extra.maxMissing = Math.max(extra.maxMissing, target[target.length - 1]);
            }
        }
    }
    return newData;
};

export const formatChampionData = data => {
    // init setting
    const rankingNumber = 10;
    const newData = {
        issue: [],
        trendField: {},
        extra: {}
    };
    const dataLocation = data.length - 1;

    // init trendField
    for (let i = 0; i <= rankingNumber; i++) {
        newData.trendField[i] = Array.from({ length: rankingNumber }, () => []);
        newData.extra[i] = Array.from({ length: rankingNumber }, () => ({
            total: 0,
            maxMissing: 0,
            averageMissing: 0,
            maxContinuous: 0
        }));
    }

    // fill column value
    const record = {};
    for (let i = 0; i <= dataLocation; i++) {
        newData.issue.push(data[i].lotteryNum);

        for (let rank = 0; rank < rankingNumber; rank++) {
            const winNumber = data[dataLocation - i].results[rank];

            for (let column = 0; column < rankingNumber; column++) {
                const target = newData.trendField[rank + 1][column];
                const extra = newData.extra[rank + 1][column];
                if (column + 1 === winNumber) {
                    // total appearend value
                    extra.total += 1;
                    if (target[target.length - 1] < 0) {
                        record[`${rank + 1}${column}`] += 1;
                    } else {
                        record[`${rank + 1}${column}`] = 1;
                    }
                    target.push(-winNumber);
                    // Max continuous
                    extra.maxContinuous = Math.max(extra.maxContinuous, record[`${rank + 1}${column}`]);
                } else {
                    const lastValue = target[target.length - 1];
                    target.push(target.length === 0 || lastValue < 0 ? 1 : lastValue + 1);
                }
                // Average missing value
                if (dataLocation === i) {
                    extra.averageMissing = Math.round(data.length / (extra.total + 1));
                }
                // Max missing value
                extra.maxMissing = Math.max(extra.maxMissing, target[target.length - 1]);
            }
        }
    }
    return newData;
};

// 雙色球藍球走勢
export const formatBlueBallData = data => {
    // init setting
    const rankingNumber = 16;
    const newData = {
        issue: [],
        trendField: {},
        extra: {}
    };
    const dataLocation = data.length - 1;

    // init trendField
    for (let i = 0; i <= rankingNumber; i++) {
        newData.trendField[i] = Array.from({ length: rankingNumber }, () => []);
        newData.extra[i] = Array.from({ length: rankingNumber }, () => ({
            total: 0,
            maxMissing: 0,
            averageMissing: 0,
            maxContinuous: 0
        }));
    }

    // fill column value
    const record = {};
    for (let i = 0; i <= dataLocation; i++) {
        newData.issue.push(data[i].lotteryNum);

        const winNumber = data[dataLocation - i].results[data[dataLocation - i].results.length - 1];

        for (let column = 0; column < rankingNumber; column++) {
            const target = newData.trendField[1][column];
            const extra = newData.extra[1][column];
            if (column + 1 === winNumber) {
                // total appeared value
                extra.total += 1;
                if (target[target.length - 1] < 0) {
                    record[`${1}${column}`] += 1;
                } else {
                    record[`${1}${column}`] = 1;
                }
                target.push(-winNumber);
                // Max continuous
                extra.maxContinuous = Math.max(extra.maxContinuous, record[`${1}${column}`]);
            } else {
                const lastValue = target[target.length - 1];
                target.push(target.length === 0 || lastValue < 0 ? 1 : lastValue + 1);
            }
            // Average missing value
            if (dataLocation === i) {
                extra.averageMissing = Math.round(data.length / (extra.total + 1));
            }
            // Max missing value
            extra.maxMissing = Math.max(extra.maxMissing, target[target.length - 1]);
        }
    }

    return newData;
};

// 雙色球紅球分佈
export const formatRedBallData = data => {
    const rankingNumber = 33;
    const newData = {
        issue: [],
        trendField: {},
        extra: {}
    };

    for (let i = 1; i <= rankingNumber; i++) {
        newData.trendField[i] = Array.from({ length: data.length }, () => 0);
        newData.extra[i] = {
            total: 0,
            maxMissing: 0,
            averageMissing: 0,
            maxContinuous: 0,
            currentMissing: 0,
            currentContinuous: 0
        };
    }

    data.forEach((draw, index) => {
        newData.issue.push(draw.lotteryNum);
        const winFlags = Array(rankingNumber + 1).fill(false);

        draw.results.slice(0, 6).forEach(number => {
            winFlags[number] = true;
        });

        for (let num = 1; num <= rankingNumber; num++) {
            if (winFlags[num]) {
                newData.trendField[num][index] = -num;
                newData.extra[num].total += 1;
                newData.extra[num].currentMissing = 0;
                newData.extra[num].currentContinuous += 1;
                newData.extra[num].maxContinuous = Math.max(newData.extra[num].maxContinuous, newData.extra[num].currentContinuous);
            } else {
                newData.extra[num].currentMissing += 1;
                newData.extra[num].currentContinuous = 0;
                newData.extra[num].maxMissing = Math.max(newData.extra[num].maxMissing, newData.extra[num].currentMissing);
                newData.trendField[num][index] = newData.extra[num].currentMissing;
            }
        }
    });

    for (let num = 1; num <= rankingNumber; num++) {
        let countDown = 1;
        for (let index = newData.trendField[num].length - 1; index >= 0; index--) {
            if (newData.trendField[num][index] === -num) {
                countDown = 1;
            } else {
                newData.trendField[num][index] = countDown++;
            }
        }

        if (newData.extra[num].total > 0) {
            newData.extra[num].averageMissing = Math.round((data.length - newData.extra[num].total) / newData.extra[num].total);
        } else {
            newData.extra[num].averageMissing = data.length;
        }
    }

    return newData;
};

// 雙色球五行走勢
export const formatWuxData = data => {
    const elements = ['金', '木', '水', '火', '土'];
    const newData = {
        issue: [],
        trendField: {}
    };

    const elementMapping = {
        金: [9, 10, 21, 22, 33],
        木: [3, 4, 15, 16, 27, 28],
        水: [1, 12, 13, 24, 25],
        火: [6, 7, 18, 19, 30, 31],
        土: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32]
    };

    for (let position = 0; position < 7; position++) {
        const positionKey = position;
        newData.trendField[positionKey] = {};
        elements.forEach(element => {
            newData.trendField[positionKey][element] = [];
        });
    }

    data.forEach(item => {
        newData.issue.push(item.lotteryNum);

        for (let position = 0; position < 7; position++) {
            const ball = item.results[position];
            let ballElement;

            elements.forEach(element => {
                if (elementMapping[element].includes(ball)) {
                    ballElement = element;
                }
            });

            const positionKey = position;
            newData.trendField[positionKey][ballElement].push(-1);

            elements.forEach(el => {
                if (el !== ballElement) {
                    const elTarget = newData.trendField[positionKey][el];
                    elTarget.push(elTarget.length === 0 || elTarget[elTarget.length - 1] <= 0 ? 1 : elTarget[elTarget.length - 1] + 1);
                }
            });
        }
    });

    for (let position = 0; position < 7; position++) {
        const positionKey = position;
        elements.forEach(element => {
            const target = newData.trendField[positionKey][element];
            for (let i = target.length - 2; i >= 0; i--) {
                if (target[i] > 0) {
                    target[i] = target[i + 1] < 0 ? 1 : target[i + 1] + 1;
                } else {
                    if (i < target.length - 1 && target[i + 1] > 0) {
                        target[i + 1] = 1;
                    }
                }
            }
        });
    }

    for (let position = 0; position < 7; position++) {
        const positionKey = position;
        elements.forEach(element => {
            const sequence = newData.trendField[positionKey][element];
            for (let i = 0; i < sequence.length; i++) {
                if (sequence[i] < 0) {
                    let start = i - 1;
                    while (start >= 0 && sequence[start] > 0) {
                        sequence[start] = i - start;
                        start--;
                    }
                }
            }
        });
    }

    return newData;
};
