/**
 *
 * @param {Canvas Ref} canvas
 * @param {format data} newData
 * @param {number} type
 *
 * type for trend ranking
 */

export const drawTable = (canvas, newData, type = 1, issueTitle, trendTitle) => {
    const ctx = canvas.getContext('2d');

    // Init setting
    const startX = 0;
    const startY = 0;
    const issueSize = 290;
    const headHeight = 190;
    const columns = 33;
    const columnWidth = 89;
    const columnHeignt = 89.1;
    const layerBg = '#F5F5F5';
    const defaultBg = '#fff';
    const extraField = [
        { title: '出现总次数', value: 'total' },
        { title: '平均遗漏值', value: 'averageMissing' },
        { title: '最大遗漏值', value: 'maxMissing' },
        { title: '最大连出值', value: 'maxContinuous' }
    ];
    const textColor = '#63666F';
    const extraColor = '#1E8EF5';
    const contentSize = '40px';
    const lineWidth = 2;
    const lineColor = 'rgba(0, 0, 0, 0.10)';
    canvas.width = 3230;
    canvas.height = headHeight + columnHeignt * newData.issue.length + columnHeignt * extraField.length;

    const drawColumn = ({ text, width, height, x, y, bgColor = '#fff', fontSize = '56px', heighlight = false, color = textColor, fontWeight = '400' }) => {
        // Draw column
        // ctx.beginPath();
        // ctx.rect(x, y, width, height);
        // ctx.fillStyle = bgColor;
        // ctx.fill();

        // // Draw border
        // ctx.beginPath();
        // ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = lineColor;
        // ctx.moveTo(x + width - 0.5, y);
        // ctx.lineTo(x + width - 0.5, y + height - 0.5);
        // ctx.lineTo(x, y + height - 0.5);
        // ctx.stroke();

        const displayText = text <= 9 ? `0${text.toString()}` : text.toString();

        // Draw heighlight
        const drawHeighlight = () => {
            const circleRadius = 38;
            ctx.beginPath();
            ctx.arc(x + columnWidth / 2, y + columnHeignt / 2, circleRadius, 0, Math.PI * 2, false);
            ctx.fillStyle = '#41c05d';
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `bold ${contentSize} PingFang SC`;
            ctx.fillText(displayText, x + columnWidth / 2, y + columnHeignt / 2);
        };

        // Draw content
        // const drawContent = () => {
        //     ctx.font = `${fontWeight} ${fontSize} PingFang SC`;
        //     ctx.fillStyle = heighlight ? '#fff' : color;
        //     ctx.textAlign = 'center';
        //     ctx.textBaseline = 'middle';
        //     ctx.fillText(text < 0 ? Math.abs(text) : text, x + width / 2, y + height / 2);
        // };

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
        drawColumn({
            text: trendTitle[type - 1],
            width: columnWidth * 33,
            height: columnHeignt,
            x: issueSize,
            y: startY,
            bgColor: layerBg,
            fontSize: contentSize
        });
        for (let i = 1; i <= columns; i++) {
            const displayText = i <= 9 ? '0' + i.toString() : i.toString();
            drawColumn({
                text: displayText,
                width: columnWidth,
                height: columnHeignt,
                x: issueSize + columnWidth * i,
                y: columnHeignt,
                bgColor: layerBg,
                fontSize: contentSize
            });
        }

        Object.entries(newData.trendField).forEach(([number, trends], index) => {
            for (let num = 0; num < trends.length; num++) {
                const rowData = trends[num];
                drawColumn({
                    text: Math.abs(rowData).toString(),
                    width: columnWidth,
                    height: columnHeignt,
                    x: issueSize + columnWidth * index,
                    y: headHeight + columnHeignt * num,
                    bgColor: num % 2 === 0 ? defaultBg : layerBg,
                    fontSize: contentSize,
                    heighlight: rowData < 0,
                    fieldIndex: num
                });
            }
        });
    };

    const drawExtraData = () => {
        extraField.forEach((field, i) => {
            drawColumn({
                text: field.title,
                width: issueSize,
                height: columnHeignt,
                x: startX,
                y: headHeight + newData.issue.length * columnHeignt + columnHeignt * i,
                bgColor: layerBg,
                fontSize: contentSize,
                color: extraColor
            });
        });

        Object.entries(newData.extra).forEach(([num, data], i) => {
            extraField.forEach((field, j) => {
                drawColumn({
                    text: data[field.value],
                    width: columnWidth,
                    height: columnHeignt,
                    x: issueSize + columnWidth * (parseInt(num) - 1),
                    y: headHeight + newData.issue.length * columnHeignt + columnHeignt * j,
                    bgColor: parseInt(num) % 2 === 0 ? defaultBg : layerBg,
                    fontSize: contentSize,
                    color: textColor
                });
            });
        });
    };

    // drawIssue();
    drawTrend();
    // drawExtraData();
};
