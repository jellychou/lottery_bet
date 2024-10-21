/**
 *
 * @param {Canvas Ref} canvas
 * @param {format data} newData
 * @param {number} type
 *
 * type for trend ranking
 */

export const drawTable = (canvas, newData, issueTitle) => {
    const ctx = canvas.getContext('2d');

    // Init setting
    const startX = 0;
    const startY = 0;
    const issueSize = 240;
    const headHeight = 200;
    const column = ['金', '木', '水', '火', '土'];
    const columnWidth = 100;
    const columnHeignt = 100;
    const layerBg = 'rgba(0, 0, 0, 0)';
    const defaultBg = 'rgba(0, 0, 0, 0)';
    const notWinBg = 'rgba(0, 0, 0, 0)';
    const textColor = '#63666F';
    const contentSize = '40px';
    const lineWidth = 2;
    const lineColor = 'rgba(0, 0, 0, 0.10)';
    const winningPosition = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {}
    };
    // canvas.width = 3730;
    canvas.width = 740;
    canvas.height = headHeight + columnHeignt * newData.issue.length;

    const drawColumn = ({ text, name = '', width, height, x, y, bgColor = '#fff', fontSize = '56px', heighlight = false, fieldIndex, ballPosition, color = textColor, fontWeight = '400' }) => {
        // Draw column
        // ctx.beginPath();
        // ctx.rect(x, y, width, height);
        // ctx.fillStyle = bgColor;
        // ctx.fill();

        // Draw border
        // ctx.beginPath();
        // ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = lineColor;
        // ctx.moveTo(x + width - 0.5, y);
        // ctx.lineTo(x + width - 0.5, y + height - 0.5);
        // ctx.lineTo(x, y + height - 0.5);
        // ctx.stroke();

        // Draw heighlight
        const drawHeighlight = () => {
            ctx.beginPath();
            const circleRadius = 40;
            ctx.fillStyle = '#F24848';
            const position = {
                x: x + columnWidth / 2,
                y: y + columnHeignt / 2,
                text,
                name
            };
            ctx.arc(position.x, position.y, circleRadius, 0, Math.PI * 2);
            ctx.fill();
            winningPosition[ballPosition][fieldIndex] = position;
        };

        // Draw content
        const drawContent = () => {
            ctx.font = `${fontWeight} ${fontSize} PingFang SC`;
            ctx.fillStyle = heighlight ? '#fff' : color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text < 0 ? Math.abs(text) : text, x + width / 2, y + height / 2);
        };

        if (heighlight) {
            drawHeighlight();
        } else {
            // drawContent();
        }
    };

    const drawIssue = () => {
        drawColumn({
            text: issueTitle,
            width: issueSize,
            height: headHeight,
            x: startX,
            y: startY,
            bgColor: layerBg,
            fontSize: '40px',
            fontWeight: '500'
        });
        for (let i = 0; i < newData.issue.length; i++) {
            drawColumn({
                text: newData.issue[i].slice(-5),
                width: issueSize,
                height: columnHeignt,
                x: startX,
                y: headHeight + i * columnHeignt,
                bgColor: i % 2 === 0 ? defaultBg : layerBg,
                fontSize: contentSize
            });
        }
    };

    const drawTrend = () => {
        const chineseNumbers = ['一', '二', '三', '四', '五', '六'];
        for (let ballPosition = 0; ballPosition < 7; ballPosition++) {
            const text = ballPosition === 6 ? '蓝球五行走势' : `第${chineseNumbers[ballPosition]}位红球五行走势`;
            drawColumn({
                text: text,
                width: columnWidth * 5,
                height: columnHeignt,
                x: issueSize + columnWidth * 5 * ballPosition,
                y: startY,
                bgColor: layerBg,
                fontSize: contentSize
            });

            for (let i = 0; i < column.length; i++) {
                drawColumn({
                    text: column[i],
                    width: columnWidth,
                    height: columnHeignt,
                    x: issueSize + columnWidth * i + columnWidth * 5 * ballPosition,
                    y: columnHeignt + startY,
                    bgColor: layerBg,
                    fontSize: contentSize
                });

                Object.entries(newData.trendField[ballPosition]).forEach(([name, trends], index) => {
                    for (let num = 0; num < trends.length; num++) {
                        const rowData = trends[num];
                        drawColumn({
                            text: Math.abs(rowData).toString(),
                            name: name,
                            width: columnWidth,
                            height: columnHeignt,
                            x: issueSize + columnWidth * 5 * ballPosition + columnWidth * index,
                            y: startY + columnHeignt * 2 + columnHeignt * num,
                            bgColor: num % 2 === 0 ? defaultBg : layerBg,
                            fontSize: contentSize,
                            heighlight: rowData < 0,
                            fieldIndex: num,
                            ballPosition: ballPosition
                        });
                    }
                });
            }
        }
    };

    const drawRedLine = () => {
        ctx.strokeStyle = '#F24848';
        ctx.lineWidth = 4;

        Object.values(winningPosition).forEach(positionsObj => {
            const positions = Object.values(positionsObj);

            positions.forEach((position, index) => {
                if (index < positions.length - 1) {
                    const nextPosition = positions[index + 1];
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y);
                    ctx.lineTo(nextPosition.x, nextPosition.y);
                    ctx.stroke();
                }
            });
        });

        Object.values(winningPosition).forEach(positionsObj => {
            Object.values(positionsObj).forEach(position => {
                if (position) {
                    ctx.font = `400 ${contentSize} PingFang SC`;
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(position.name, position.x, position.y);
                }
            });
        });
    };

    const drawNotWin = () => {
        for (let position = 0; position < 7; position++) {
            Object.entries(newData.trendField[position]).forEach(([name, trends], index) => {
                for (let num = 0; num < trends.length; num++) {
                    const rowData = trends[num];
                    if (rowData < 0) break;
                    drawColumn({
                        text: Math.abs(rowData).toString(),
                        name: name,
                        width: columnWidth,
                        height: columnHeignt,
                        x: issueSize + columnWidth * 5 * position + columnWidth * index,
                        y: startY + columnHeignt * 2 + columnHeignt * num,
                        bgColor: notWinBg,
                        fontSize: contentSize,
                        heighlight: rowData < 0,
                        fieldIndex: num
                    });
                }
            });
        }
    };

    // drawIssue();
    drawTrend();
    drawNotWin();
    drawRedLine();
};

export const drawTable1 = (canvas, newData, issueTitle) => {
    const ctx = canvas.getContext('2d');

    // Init setting
    const startX = 0;
    const startY = 0;
    const issueSize = 240;
    const headHeight = 200;
    const column = ['金', '木', '水', '火', '土'];
    const columnWidth = 100;
    const columnHeignt = 100;
    const layerBg = 'rgba(0, 0, 0, 0)';
    const defaultBg = 'rgba(0, 0, 0, 0)';
    const notWinBg = 'rgba(0, 0, 0, 0)';
    const textColor = '#63666F';
    const contentSize = '40px';
    const lineWidth = 2;
    const lineColor = 'rgba(0, 0, 0, 0.10)';
    const winningPosition = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {}
    };
    // canvas.width = 3730;
    canvas.width = 740;
    canvas.height = headHeight + columnHeignt * newData.issue.length;

    const drawColumn = ({ text, name = '', width, height, x, y, bgColor = '#fff', fontSize = '56px', heighlight = false, fieldIndex, ballPosition, color = textColor, fontWeight = '400' }) => {
        // Draw column
        // ctx.beginPath();
        // ctx.rect(x, y, width, height);
        // ctx.fillStyle = bgColor;
        // ctx.fill();

        // Draw border
        // ctx.beginPath();
        // ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = lineColor;
        // ctx.moveTo(x + width - 0.5, y);
        // ctx.lineTo(x + width - 0.5, y + height - 0.5);
        // ctx.lineTo(x, y + height - 0.5);
        // ctx.stroke();

        // Draw heighlight
        const drawHeighlight = () => {
            ctx.beginPath();
            const circleRadius = 40;
            ctx.fillStyle = '#F24848';
            const position = {
                x: x + columnWidth / 2,
                y: y + columnHeignt / 2,
                text,
                name
            };
            ctx.arc(position.x, position.y, circleRadius, 0, Math.PI * 2);
            ctx.fill();
            winningPosition[ballPosition][fieldIndex] = position;
        };

        // Draw content
        const drawContent = () => {
            ctx.font = `${fontWeight} ${fontSize} PingFang SC`;
            ctx.fillStyle = heighlight ? '#fff' : color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text < 0 ? Math.abs(text) : text, x + width / 2, y + height / 2);
        };

        if (heighlight) {
            drawHeighlight();
        } else {
            // drawContent();
        }
    };

    const drawIssue = () => {
        drawColumn({
            text: issueTitle,
            width: issueSize,
            height: headHeight,
            x: startX,
            y: startY,
            bgColor: layerBg,
            fontSize: '40px',
            fontWeight: '500'
        });
        for (let i = 0; i < newData.issue.length; i++) {
            drawColumn({
                text: newData.issue[i].slice(-5),
                width: issueSize,
                height: columnHeignt,
                x: startX,
                y: headHeight + i * columnHeignt,
                bgColor: i % 2 === 0 ? defaultBg : layerBg,
                fontSize: contentSize
            });
        }
    };

    const drawTrend = () => {
        const chineseNumbers = ['一', '二', '三', '四', '五', '六'];
        for (let ballPosition = 0; ballPosition < 7; ballPosition++) {
            const text = ballPosition === 6 ? '蓝球五行走势' : `第${chineseNumbers[ballPosition]}位红球五行走势`;
            drawColumn({
                text: text,
                width: columnWidth * 5,
                height: columnHeignt,
                x: issueSize + columnWidth * 5 * ballPosition,
                y: startY,
                bgColor: layerBg,
                fontSize: contentSize
            });

            for (let i = 0; i < column.length; i++) {
                drawColumn({
                    text: column[i],
                    width: columnWidth,
                    height: columnHeignt,
                    x: issueSize + columnWidth * i + columnWidth * 5 * ballPosition,
                    y: columnHeignt + startY,
                    bgColor: layerBg,
                    fontSize: contentSize
                });

                Object.entries(newData.trendField[1]).forEach(([name, trends], index) => {
                    for (let num = 0; num < trends.length; num++) {
                        const rowData = trends[num];
                        drawColumn({
                            text: Math.abs(rowData).toString(),
                            name: name,
                            width: columnWidth,
                            height: columnHeignt,
                            x: issueSize + columnWidth * 5 * ballPosition + columnWidth * index,
                            y: startY + columnHeignt * 2 + columnHeignt * num,
                            bgColor: num % 2 === 0 ? defaultBg : layerBg,
                            fontSize: contentSize,
                            heighlight: rowData < 0,
                            fieldIndex: num,
                            ballPosition: ballPosition
                        });
                    }
                });
            }
        }
    };

    const drawRedLine = () => {
        ctx.strokeStyle = '#F24848';
        ctx.lineWidth = 4;

        Object.values(winningPosition).forEach(positionsObj => {
            const positions = Object.values(positionsObj);

            positions.forEach((position, index) => {
                if (index < positions.length - 1) {
                    const nextPosition = positions[index + 1];
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y);
                    ctx.lineTo(nextPosition.x, nextPosition.y);
                    ctx.stroke();
                }
            });
        });

        Object.values(winningPosition).forEach(positionsObj => {
            Object.values(positionsObj).forEach(position => {
                if (position) {
                    ctx.font = `400 ${contentSize} PingFang SC`;
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(position.name, position.x, position.y);
                }
            });
        });
    };

    const drawNotWin = () => {
        for (let position = 0; position < 7; position++) {
            Object.entries(newData.trendField[position]).forEach(([name, trends], index) => {
                for (let num = 0; num < trends.length; num++) {
                    const rowData = trends[num];
                    if (rowData < 0) break;
                    drawColumn({
                        text: Math.abs(rowData).toString(),
                        name: name,
                        width: columnWidth,
                        height: columnHeignt,
                        x: issueSize + columnWidth * 5 * position + columnWidth * index,
                        y: startY + columnHeignt * 2 + columnHeignt * num,
                        bgColor: notWinBg,
                        fontSize: contentSize,
                        heighlight: rowData < 0,
                        fieldIndex: num
                    });
                }
            });
        }
    };

    // drawIssue();
    drawTrend();
    drawNotWin();
    drawRedLine();
};

export const drawTable2 = (canvas, newData, issueTitle) => {
    const ctx = canvas.getContext('2d');

    // Init setting
    const startX = 0;
    const startY = 0;
    const issueSize = 240;
    const headHeight = 200;
    const column = ['金', '木', '水', '火', '土'];
    const columnWidth = 100;
    const columnHeignt = 100;
    const layerBg = 'rgba(0, 0, 0, 0)';
    const defaultBg = 'rgba(0, 0, 0, 0)';
    const notWinBg = 'rgba(0, 0, 0, 0)';
    const textColor = '#63666F';
    const contentSize = '40px';
    const lineWidth = 2;
    const lineColor = 'rgba(0, 0, 0, 0.10)';
    const winningPosition = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {}
    };
    // canvas.width = 3730;
    canvas.width = 740;
    canvas.height = headHeight + columnHeignt * newData.issue.length;

    const drawColumn = ({ text, name = '', width, height, x, y, bgColor = '#fff', fontSize = '56px', heighlight = false, fieldIndex, ballPosition, color = textColor, fontWeight = '400' }) => {
        // Draw column
        // ctx.beginPath();
        // ctx.rect(x, y, width, height);
        // ctx.fillStyle = bgColor;
        // ctx.fill();

        // Draw border
        // ctx.beginPath();
        // ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = lineColor;
        // ctx.moveTo(x + width - 0.5, y);
        // ctx.lineTo(x + width - 0.5, y + height - 0.5);
        // ctx.lineTo(x, y + height - 0.5);
        // ctx.stroke();

        // Draw heighlight
        const drawHeighlight = () => {
            ctx.beginPath();
            const circleRadius = 40;
            ctx.fillStyle = '#F24848';
            const position = {
                x: x + columnWidth / 2,
                y: y + columnHeignt / 2,
                text,
                name
            };
            ctx.arc(position.x, position.y, circleRadius, 0, Math.PI * 2);
            ctx.fill();
            winningPosition[ballPosition][fieldIndex] = position;
        };

        // Draw content
        const drawContent = () => {
            ctx.font = `${fontWeight} ${fontSize} PingFang SC`;
            ctx.fillStyle = heighlight ? '#fff' : color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text < 0 ? Math.abs(text) : text, x + width / 2, y + height / 2);
        };

        if (heighlight) {
            drawHeighlight();
        } else {
            // drawContent();
        }
    };

    const drawIssue = () => {
        drawColumn({
            text: issueTitle,
            width: issueSize,
            height: headHeight,
            x: startX,
            y: startY,
            bgColor: layerBg,
            fontSize: '40px',
            fontWeight: '500'
        });
        for (let i = 0; i < newData.issue.length; i++) {
            drawColumn({
                text: newData.issue[i].slice(-5),
                width: issueSize,
                height: columnHeignt,
                x: startX,
                y: headHeight + i * columnHeignt,
                bgColor: i % 2 === 0 ? defaultBg : layerBg,
                fontSize: contentSize
            });
        }
    };

    const drawTrend = () => {
        const chineseNumbers = ['一', '二', '三', '四', '五', '六'];
        for (let ballPosition = 0; ballPosition < 7; ballPosition++) {
            const text = ballPosition === 6 ? '蓝球五行走势' : `第${chineseNumbers[ballPosition]}位红球五行走势`;
            drawColumn({
                text: text,
                width: columnWidth * 5,
                height: columnHeignt,
                x: issueSize + columnWidth * 5 * ballPosition,
                y: startY,
                bgColor: layerBg,
                fontSize: contentSize
            });

            for (let i = 0; i < column.length; i++) {
                drawColumn({
                    text: column[i],
                    width: columnWidth,
                    height: columnHeignt,
                    x: issueSize + columnWidth * i + columnWidth * 5 * ballPosition,
                    y: columnHeignt + startY,
                    bgColor: layerBg,
                    fontSize: contentSize
                });

                Object.entries(newData.trendField[2]).forEach(([name, trends], index) => {
                    for (let num = 0; num < trends.length; num++) {
                        const rowData = trends[num];
                        drawColumn({
                            text: Math.abs(rowData).toString(),
                            name: name,
                            width: columnWidth,
                            height: columnHeignt,
                            x: issueSize + columnWidth * 5 * ballPosition + columnWidth * index,
                            y: startY + columnHeignt * 2 + columnHeignt * num,
                            bgColor: num % 2 === 0 ? defaultBg : layerBg,
                            fontSize: contentSize,
                            heighlight: rowData < 0,
                            fieldIndex: num,
                            ballPosition: ballPosition
                        });
                    }
                });
            }
        }
    };

    const drawRedLine = () => {
        ctx.strokeStyle = '#F24848';
        ctx.lineWidth = 4;

        Object.values(winningPosition).forEach(positionsObj => {
            const positions = Object.values(positionsObj);

            positions.forEach((position, index) => {
                if (index < positions.length - 1) {
                    const nextPosition = positions[index + 1];
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y);
                    ctx.lineTo(nextPosition.x, nextPosition.y);
                    ctx.stroke();
                }
            });
        });

        Object.values(winningPosition).forEach(positionsObj => {
            Object.values(positionsObj).forEach(position => {
                if (position) {
                    ctx.font = `400 ${contentSize} PingFang SC`;
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(position.name, position.x, position.y);
                }
            });
        });
    };

    const drawNotWin = () => {
        for (let position = 0; position < 7; position++) {
            Object.entries(newData.trendField[position]).forEach(([name, trends], index) => {
                for (let num = 0; num < trends.length; num++) {
                    const rowData = trends[num];
                    if (rowData < 0) break;
                    drawColumn({
                        text: Math.abs(rowData).toString(),
                        name: name,
                        width: columnWidth,
                        height: columnHeignt,
                        x: issueSize + columnWidth * 5 * position + columnWidth * index,
                        y: startY + columnHeignt * 2 + columnHeignt * num,
                        bgColor: notWinBg,
                        fontSize: contentSize,
                        heighlight: rowData < 0,
                        fieldIndex: num
                    });
                }
            });
        }
    };

    // drawIssue();
    drawTrend();
    drawNotWin();
    drawRedLine();
};

export const drawTable3 = (canvas, newData, issueTitle) => {
    const ctx = canvas.getContext('2d');

    // Init setting
    const startX = 0;
    const startY = 0;
    const issueSize = 240;
    const headHeight = 200;
    const column = ['金', '木', '水', '火', '土'];
    const columnWidth = 100;
    const columnHeignt = 100;
    const layerBg = 'rgba(0, 0, 0, 0)';
    const defaultBg = 'rgba(0, 0, 0, 0)';
    const notWinBg = 'rgba(0, 0, 0, 0)';
    const textColor = '#63666F';
    const contentSize = '40px';
    const lineWidth = 2;
    const lineColor = 'rgba(0, 0, 0, 0.10)';
    const winningPosition = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {}
    };
    // canvas.width = 3730;
    canvas.width = 740;
    canvas.height = headHeight + columnHeignt * newData.issue.length;

    const drawColumn = ({ text, name = '', width, height, x, y, bgColor = '#fff', fontSize = '56px', heighlight = false, fieldIndex, ballPosition, color = textColor, fontWeight = '400' }) => {
        // Draw column
        // ctx.beginPath();
        // ctx.rect(x, y, width, height);
        // ctx.fillStyle = bgColor;
        // ctx.fill();

        // Draw border
        // ctx.beginPath();
        // ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = lineColor;
        // ctx.moveTo(x + width - 0.5, y);
        // ctx.lineTo(x + width - 0.5, y + height - 0.5);
        // ctx.lineTo(x, y + height - 0.5);
        // ctx.stroke();

        // Draw heighlight
        const drawHeighlight = () => {
            ctx.beginPath();
            const circleRadius = 40;
            ctx.fillStyle = '#F24848';
            const position = {
                x: x + columnWidth / 2,
                y: y + columnHeignt / 2,
                text,
                name
            };
            ctx.arc(position.x, position.y, circleRadius, 0, Math.PI * 2);
            ctx.fill();
            winningPosition[ballPosition][fieldIndex] = position;
        };

        // Draw content
        const drawContent = () => {
            ctx.font = `${fontWeight} ${fontSize} PingFang SC`;
            ctx.fillStyle = heighlight ? '#fff' : color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text < 0 ? Math.abs(text) : text, x + width / 2, y + height / 2);
        };

        if (heighlight) {
            drawHeighlight();
        } else {
            // drawContent();
        }
    };

    const drawIssue = () => {
        drawColumn({
            text: issueTitle,
            width: issueSize,
            height: headHeight,
            x: startX,
            y: startY,
            bgColor: layerBg,
            fontSize: '40px',
            fontWeight: '500'
        });
        for (let i = 0; i < newData.issue.length; i++) {
            drawColumn({
                text: newData.issue[i].slice(-5),
                width: issueSize,
                height: columnHeignt,
                x: startX,
                y: headHeight + i * columnHeignt,
                bgColor: i % 2 === 0 ? defaultBg : layerBg,
                fontSize: contentSize
            });
        }
    };

    const drawTrend = () => {
        const chineseNumbers = ['一', '二', '三', '四', '五', '六'];
        for (let ballPosition = 0; ballPosition < 7; ballPosition++) {
            const text = ballPosition === 6 ? '蓝球五行走势' : `第${chineseNumbers[ballPosition]}位红球五行走势`;
            drawColumn({
                text: text,
                width: columnWidth * 5,
                height: columnHeignt,
                x: issueSize + columnWidth * 5 * ballPosition,
                y: startY,
                bgColor: layerBg,
                fontSize: contentSize
            });

            for (let i = 0; i < column.length; i++) {
                drawColumn({
                    text: column[i],
                    width: columnWidth,
                    height: columnHeignt,
                    x: issueSize + columnWidth * i + columnWidth * 5 * ballPosition,
                    y: columnHeignt + startY,
                    bgColor: layerBg,
                    fontSize: contentSize
                });

                Object.entries(newData.trendField[3]).forEach(([name, trends], index) => {
                    for (let num = 0; num < trends.length; num++) {
                        const rowData = trends[num];
                        drawColumn({
                            text: Math.abs(rowData).toString(),
                            name: name,
                            width: columnWidth,
                            height: columnHeignt,
                            x: issueSize + columnWidth * 5 * ballPosition + columnWidth * index,
                            y: startY + columnHeignt * 2 + columnHeignt * num,
                            bgColor: num % 2 === 0 ? defaultBg : layerBg,
                            fontSize: contentSize,
                            heighlight: rowData < 0,
                            fieldIndex: num,
                            ballPosition: ballPosition
                        });
                    }
                });
            }
        }
    };

    const drawRedLine = () => {
        ctx.strokeStyle = '#F24848';
        ctx.lineWidth = 4;

        Object.values(winningPosition).forEach(positionsObj => {
            const positions = Object.values(positionsObj);

            positions.forEach((position, index) => {
                if (index < positions.length - 1) {
                    const nextPosition = positions[index + 1];
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y);
                    ctx.lineTo(nextPosition.x, nextPosition.y);
                    ctx.stroke();
                }
            });
        });

        Object.values(winningPosition).forEach(positionsObj => {
            Object.values(positionsObj).forEach(position => {
                if (position) {
                    ctx.font = `400 ${contentSize} PingFang SC`;
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(position.name, position.x, position.y);
                }
            });
        });
    };

    const drawNotWin = () => {
        for (let position = 0; position < 7; position++) {
            Object.entries(newData.trendField[position]).forEach(([name, trends], index) => {
                for (let num = 0; num < trends.length; num++) {
                    const rowData = trends[num];
                    if (rowData < 0) break;
                    drawColumn({
                        text: Math.abs(rowData).toString(),
                        name: name,
                        width: columnWidth,
                        height: columnHeignt,
                        x: issueSize + columnWidth * 5 * position + columnWidth * index,
                        y: startY + columnHeignt * 2 + columnHeignt * num,
                        bgColor: notWinBg,
                        fontSize: contentSize,
                        heighlight: rowData < 0,
                        fieldIndex: num
                    });
                }
            });
        }
    };

    // drawIssue();
    drawTrend();
    drawNotWin();
    drawRedLine();
};

export const drawTable4 = (canvas, newData, issueTitle) => {
    const ctx = canvas.getContext('2d');

    // Init setting
    const startX = 0;
    const startY = 0;
    const issueSize = 240;
    const headHeight = 200;
    const column = ['金', '木', '水', '火', '土'];
    const columnWidth = 100;
    const columnHeignt = 100;
    const layerBg = 'rgba(0, 0, 0, 0)';
    const defaultBg = 'rgba(0, 0, 0, 0)';
    const notWinBg = 'rgba(0, 0, 0, 0)';
    const textColor = '#63666F';
    const contentSize = '40px';
    const lineWidth = 2;
    const lineColor = 'rgba(0, 0, 0, 0.10)';
    const winningPosition = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {}
    };
    // canvas.width = 3730;
    canvas.width = 740;
    canvas.height = headHeight + columnHeignt * newData.issue.length;

    const drawColumn = ({ text, name = '', width, height, x, y, bgColor = '#fff', fontSize = '56px', heighlight = false, fieldIndex, ballPosition, color = textColor, fontWeight = '400' }) => {
        // Draw column
        // ctx.beginPath();
        // ctx.rect(x, y, width, height);
        // ctx.fillStyle = bgColor;
        // ctx.fill();

        // Draw border
        // ctx.beginPath();
        // ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = lineColor;
        // ctx.moveTo(x + width - 0.5, y);
        // ctx.lineTo(x + width - 0.5, y + height - 0.5);
        // ctx.lineTo(x, y + height - 0.5);
        // ctx.stroke();

        // Draw heighlight
        const drawHeighlight = () => {
            ctx.beginPath();
            const circleRadius = 40;
            ctx.fillStyle = '#F24848';
            const position = {
                x: x + columnWidth / 2,
                y: y + columnHeignt / 2,
                text,
                name
            };
            ctx.arc(position.x, position.y, circleRadius, 0, Math.PI * 2);
            ctx.fill();
            winningPosition[ballPosition][fieldIndex] = position;
        };

        // Draw content
        const drawContent = () => {
            ctx.font = `${fontWeight} ${fontSize} PingFang SC`;
            ctx.fillStyle = heighlight ? '#fff' : color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text < 0 ? Math.abs(text) : text, x + width / 2, y + height / 2);
        };

        if (heighlight) {
            drawHeighlight();
        } else {
            // drawContent();
        }
    };

    const drawIssue = () => {
        drawColumn({
            text: issueTitle,
            width: issueSize,
            height: headHeight,
            x: startX,
            y: startY,
            bgColor: layerBg,
            fontSize: '40px',
            fontWeight: '500'
        });
        for (let i = 0; i < newData.issue.length; i++) {
            drawColumn({
                text: newData.issue[i].slice(-5),
                width: issueSize,
                height: columnHeignt,
                x: startX,
                y: headHeight + i * columnHeignt,
                bgColor: i % 2 === 0 ? defaultBg : layerBg,
                fontSize: contentSize
            });
        }
    };

    const drawTrend = () => {
        const chineseNumbers = ['一', '二', '三', '四', '五', '六'];
        for (let ballPosition = 0; ballPosition < 7; ballPosition++) {
            const text = ballPosition === 6 ? '蓝球五行走势' : `第${chineseNumbers[ballPosition]}位红球五行走势`;
            drawColumn({
                text: text,
                width: columnWidth * 5,
                height: columnHeignt,
                x: issueSize + columnWidth * 5 * ballPosition,
                y: startY,
                bgColor: layerBg,
                fontSize: contentSize
            });

            for (let i = 0; i < column.length; i++) {
                drawColumn({
                    text: column[i],
                    width: columnWidth,
                    height: columnHeignt,
                    x: issueSize + columnWidth * i + columnWidth * 5 * ballPosition,
                    y: columnHeignt + startY,
                    bgColor: layerBg,
                    fontSize: contentSize
                });

                Object.entries(newData.trendField[4]).forEach(([name, trends], index) => {
                    for (let num = 0; num < trends.length; num++) {
                        const rowData = trends[num];
                        drawColumn({
                            text: Math.abs(rowData).toString(),
                            name: name,
                            width: columnWidth,
                            height: columnHeignt,
                            x: issueSize + columnWidth * 5 * ballPosition + columnWidth * index,
                            y: startY + columnHeignt * 2 + columnHeignt * num,
                            bgColor: num % 2 === 0 ? defaultBg : layerBg,
                            fontSize: contentSize,
                            heighlight: rowData < 0,
                            fieldIndex: num,
                            ballPosition: ballPosition
                        });
                    }
                });
            }
        }
    };

    const drawRedLine = () => {
        ctx.strokeStyle = '#F24848';
        ctx.lineWidth = 4;

        Object.values(winningPosition).forEach(positionsObj => {
            const positions = Object.values(positionsObj);

            positions.forEach((position, index) => {
                if (index < positions.length - 1) {
                    const nextPosition = positions[index + 1];
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y);
                    ctx.lineTo(nextPosition.x, nextPosition.y);
                    ctx.stroke();
                }
            });
        });

        Object.values(winningPosition).forEach(positionsObj => {
            Object.values(positionsObj).forEach(position => {
                if (position) {
                    ctx.font = `400 ${contentSize} PingFang SC`;
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(position.name, position.x, position.y);
                }
            });
        });
    };

    const drawNotWin = () => {
        for (let position = 0; position < 7; position++) {
            Object.entries(newData.trendField[position]).forEach(([name, trends], index) => {
                for (let num = 0; num < trends.length; num++) {
                    const rowData = trends[num];
                    if (rowData < 0) break;
                    drawColumn({
                        text: Math.abs(rowData).toString(),
                        name: name,
                        width: columnWidth,
                        height: columnHeignt,
                        x: issueSize + columnWidth * 5 * position + columnWidth * index,
                        y: startY + columnHeignt * 2 + columnHeignt * num,
                        bgColor: notWinBg,
                        fontSize: contentSize,
                        heighlight: rowData < 0,
                        fieldIndex: num
                    });
                }
            });
        }
    };

    // drawIssue();
    drawTrend();
    drawNotWin();
    drawRedLine();
};

export const drawTable5 = (canvas, newData, issueTitle) => {
    const ctx = canvas.getContext('2d');

    // Init setting
    const startX = 0;
    const startY = 0;
    const issueSize = 240;
    const headHeight = 200;
    const column = ['金', '木', '水', '火', '土'];
    const columnWidth = 100;
    const columnHeignt = 100;
    const layerBg = 'rgba(0, 0, 0, 0)';
    const defaultBg = 'rgba(0, 0, 0, 0)';
    const notWinBg = 'rgba(0, 0, 0, 0)';
    const textColor = '#63666F';
    const contentSize = '40px';
    const lineWidth = 2;
    const lineColor = 'rgba(0, 0, 0, 0.10)';
    const winningPosition = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {}
    };
    // canvas.width = 3730;
    canvas.width = 740;
    canvas.height = headHeight + columnHeignt * newData.issue.length;

    const drawColumn = ({ text, name = '', width, height, x, y, bgColor = '#fff', fontSize = '56px', heighlight = false, fieldIndex, ballPosition, color = textColor, fontWeight = '400' }) => {
        // Draw column
        // ctx.beginPath();
        // ctx.rect(x, y, width, height);
        // ctx.fillStyle = bgColor;
        // ctx.fill();

        // Draw border
        // ctx.beginPath();
        // ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = lineColor;
        // ctx.moveTo(x + width - 0.5, y);
        // ctx.lineTo(x + width - 0.5, y + height - 0.5);
        // ctx.lineTo(x, y + height - 0.5);
        // ctx.stroke();

        // Draw heighlight
        const drawHeighlight = () => {
            ctx.beginPath();
            const circleRadius = 40;
            ctx.fillStyle = '#F24848';
            const position = {
                x: x + columnWidth / 2,
                y: y + columnHeignt / 2,
                text,
                name
            };
            ctx.arc(position.x, position.y, circleRadius, 0, Math.PI * 2);
            ctx.fill();
            winningPosition[ballPosition][fieldIndex] = position;
        };

        // Draw content
        const drawContent = () => {
            ctx.font = `${fontWeight} ${fontSize} PingFang SC`;
            ctx.fillStyle = heighlight ? '#fff' : color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text < 0 ? Math.abs(text) : text, x + width / 2, y + height / 2);
        };

        if (heighlight) {
            drawHeighlight();
        } else {
            // drawContent();
        }
    };

    const drawIssue = () => {
        drawColumn({
            text: issueTitle,
            width: issueSize,
            height: headHeight,
            x: startX,
            y: startY,
            bgColor: layerBg,
            fontSize: '40px',
            fontWeight: '500'
        });
        for (let i = 0; i < newData.issue.length; i++) {
            drawColumn({
                text: newData.issue[i].slice(-5),
                width: issueSize,
                height: columnHeignt,
                x: startX,
                y: headHeight + i * columnHeignt,
                bgColor: i % 2 === 0 ? defaultBg : layerBg,
                fontSize: contentSize
            });
        }
    };

    const drawTrend = () => {
        const chineseNumbers = ['一', '二', '三', '四', '五', '六'];
        for (let ballPosition = 0; ballPosition < 7; ballPosition++) {
            const text = ballPosition === 6 ? '蓝球五行走势' : `第${chineseNumbers[ballPosition]}位红球五行走势`;
            drawColumn({
                text: text,
                width: columnWidth * 5,
                height: columnHeignt,
                x: issueSize + columnWidth * 5 * ballPosition,
                y: startY,
                bgColor: layerBg,
                fontSize: contentSize
            });

            for (let i = 0; i < column.length; i++) {
                drawColumn({
                    text: column[i],
                    width: columnWidth,
                    height: columnHeignt,
                    x: issueSize + columnWidth * i + columnWidth * 5 * ballPosition,
                    y: columnHeignt + startY,
                    bgColor: layerBg,
                    fontSize: contentSize
                });

                Object.entries(newData.trendField[5]).forEach(([name, trends], index) => {
                    for (let num = 0; num < trends.length; num++) {
                        const rowData = trends[num];
                        drawColumn({
                            text: Math.abs(rowData).toString(),
                            name: name,
                            width: columnWidth,
                            height: columnHeignt,
                            x: issueSize + columnWidth * 5 * ballPosition + columnWidth * index,
                            y: startY + columnHeignt * 2 + columnHeignt * num,
                            bgColor: num % 2 === 0 ? defaultBg : layerBg,
                            fontSize: contentSize,
                            heighlight: rowData < 0,
                            fieldIndex: num,
                            ballPosition: ballPosition
                        });
                    }
                });
            }
        }
    };

    const drawRedLine = () => {
        ctx.strokeStyle = '#F24848';
        ctx.lineWidth = 4;

        Object.values(winningPosition).forEach(positionsObj => {
            const positions = Object.values(positionsObj);

            positions.forEach((position, index) => {
                if (index < positions.length - 1) {
                    const nextPosition = positions[index + 1];
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y);
                    ctx.lineTo(nextPosition.x, nextPosition.y);
                    ctx.stroke();
                }
            });
        });

        Object.values(winningPosition).forEach(positionsObj => {
            Object.values(positionsObj).forEach(position => {
                if (position) {
                    ctx.font = `400 ${contentSize} PingFang SC`;
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(position.name, position.x, position.y);
                }
            });
        });
    };

    const drawNotWin = () => {
        for (let position = 0; position < 7; position++) {
            Object.entries(newData.trendField[position]).forEach(([name, trends], index) => {
                for (let num = 0; num < trends.length; num++) {
                    const rowData = trends[num];
                    if (rowData < 0) break;
                    drawColumn({
                        text: Math.abs(rowData).toString(),
                        name: name,
                        width: columnWidth,
                        height: columnHeignt,
                        x: issueSize + columnWidth * 5 * position + columnWidth * index,
                        y: startY + columnHeignt * 2 + columnHeignt * num,
                        bgColor: notWinBg,
                        fontSize: contentSize,
                        heighlight: rowData < 0,
                        fieldIndex: num
                    });
                }
            });
        }
    };

    // drawIssue();
    drawTrend();
    drawNotWin();
    drawRedLine();
};

export const drawTable6 = (canvas, newData, issueTitle) => {
    const ctx = canvas.getContext('2d');

    // Init setting
    const startX = 0;
    const startY = 0;
    const issueSize = 240;
    const headHeight = 200;
    const column = ['金', '木', '水', '火', '土'];
    const columnWidth = 100;
    const columnHeignt = 100;
    const layerBg = 'rgba(0, 0, 0, 0)';
    const defaultBg = 'rgba(0, 0, 0, 0)';
    const notWinBg = 'rgba(0, 0, 0, 0)';
    const textColor = '#63666F';
    const contentSize = '40px';
    const lineWidth = 2;
    const lineColor = 'rgba(0, 0, 0, 0.10)';
    const winningPosition = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {}
    };
    // canvas.width = 3730;
    canvas.width = 740;
    canvas.height = headHeight + columnHeignt * newData.issue.length;

    const drawColumn = ({ text, name = '', width, height, x, y, bgColor = '#fff', fontSize = '56px', heighlight = false, fieldIndex, ballPosition, color = textColor, fontWeight = '400' }) => {
        // Draw column
        // ctx.beginPath();
        // ctx.rect(x, y, width, height);
        // ctx.fillStyle = bgColor;
        // ctx.fill();

        // Draw border
        // ctx.beginPath();
        // ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = lineColor;
        // ctx.moveTo(x + width - 0.5, y);
        // ctx.lineTo(x + width - 0.5, y + height - 0.5);
        // ctx.lineTo(x, y + height - 0.5);
        // ctx.stroke();

        // Draw heighlight
        const drawHeighlight = () => {
            ctx.beginPath();
            const circleRadius = 40;
            ctx.fillStyle = '#F24848';
            const position = {
                x: x + columnWidth / 2,
                y: y + columnHeignt / 2,
                text,
                name
            };
            ctx.arc(position.x, position.y, circleRadius, 0, Math.PI * 2);
            ctx.fill();
            winningPosition[ballPosition][fieldIndex] = position;
        };

        // Draw content
        const drawContent = () => {
            ctx.font = `${fontWeight} ${fontSize} PingFang SC`;
            ctx.fillStyle = heighlight ? '#fff' : color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text < 0 ? Math.abs(text) : text, x + width / 2, y + height / 2);
        };

        if (heighlight) {
            drawHeighlight();
        } else {
            // drawContent();
        }
    };

    const drawIssue = () => {
        drawColumn({
            text: issueTitle,
            width: issueSize,
            height: headHeight,
            x: startX,
            y: startY,
            bgColor: layerBg,
            fontSize: '40px',
            fontWeight: '500'
        });
        for (let i = 0; i < newData.issue.length; i++) {
            drawColumn({
                text: newData.issue[i].slice(-5),
                width: issueSize,
                height: columnHeignt,
                x: startX,
                y: headHeight + i * columnHeignt,
                bgColor: i % 2 === 0 ? defaultBg : layerBg,
                fontSize: contentSize
            });
        }
    };

    const drawTrend = () => {
        const chineseNumbers = ['一', '二', '三', '四', '五', '六'];
        for (let ballPosition = 0; ballPosition < 7; ballPosition++) {
            const text = ballPosition === 6 ? '蓝球五行走势' : `第${chineseNumbers[ballPosition]}位红球五行走势`;
            drawColumn({
                text: text,
                width: columnWidth * 5,
                height: columnHeignt,
                x: issueSize + columnWidth * 5 * ballPosition,
                y: startY,
                bgColor: layerBg,
                fontSize: contentSize
            });

            for (let i = 0; i < column.length; i++) {
                drawColumn({
                    text: column[i],
                    width: columnWidth,
                    height: columnHeignt,
                    x: issueSize + columnWidth * i + columnWidth * 5 * ballPosition,
                    y: columnHeignt + startY,
                    bgColor: layerBg,
                    fontSize: contentSize
                });

                Object.entries(newData.trendField[6]).forEach(([name, trends], index) => {
                    for (let num = 0; num < trends.length; num++) {
                        const rowData = trends[num];
                        drawColumn({
                            text: Math.abs(rowData).toString(),
                            name: name,
                            width: columnWidth,
                            height: columnHeignt,
                            x: issueSize + columnWidth * 5 * ballPosition + columnWidth * index,
                            y: startY + columnHeignt * 2 + columnHeignt * num,
                            bgColor: num % 2 === 0 ? defaultBg : layerBg,
                            fontSize: contentSize,
                            heighlight: rowData < 0,
                            fieldIndex: num,
                            ballPosition: ballPosition
                        });
                    }
                });
            }
        }
    };

    const drawRedLine = () => {
        ctx.strokeStyle = '#F24848';
        ctx.lineWidth = 4;

        Object.values(winningPosition).forEach(positionsObj => {
            const positions = Object.values(positionsObj);

            positions.forEach((position, index) => {
                if (index < positions.length - 1) {
                    const nextPosition = positions[index + 1];
                    ctx.beginPath();
                    ctx.moveTo(position.x, position.y);
                    ctx.lineTo(nextPosition.x, nextPosition.y);
                    ctx.stroke();
                }
            });
        });

        Object.values(winningPosition).forEach(positionsObj => {
            Object.values(positionsObj).forEach(position => {
                if (position) {
                    ctx.font = `400 ${contentSize} PingFang SC`;
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(position.name, position.x, position.y);
                }
            });
        });
    };

    const drawNotWin = () => {
        for (let position = 0; position < 7; position++) {
            Object.entries(newData.trendField[position]).forEach(([name, trends], index) => {
                for (let num = 0; num < trends.length; num++) {
                    const rowData = trends[num];
                    if (rowData < 0) break;
                    drawColumn({
                        text: Math.abs(rowData).toString(),
                        name: name,
                        width: columnWidth,
                        height: columnHeignt,
                        x: issueSize + columnWidth * 5 * position + columnWidth * index,
                        y: startY + columnHeignt * 2 + columnHeignt * num,
                        bgColor: notWinBg,
                        fontSize: contentSize,
                        heighlight: rowData < 0,
                        fieldIndex: num
                    });
                }
            });
        }
    };

    // drawIssue();
    drawTrend();
    drawNotWin();
    drawRedLine();
};
