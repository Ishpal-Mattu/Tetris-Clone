
/**
 * Wraps text according to the given width 
 * and returns an array of paragraph lines respecting that width
 * @param {CanvasRenderingContext2D} context 
 * @param {string} text 
 * @param {number} maxWidth 
 * @returns array containing paragraph lines
 */
export const textWrap = (context, text, maxWidth) => {
    const words = text.split(" ");
    const lines = [];

    let currentLine = words[0];
    let word;
    let width;
    for(let i = 1; i < words.length; i++){
        word = words[i];
        width = context.measureText(currentLine + " " + word).width;
        if(width < maxWidth)
            currentLine += " " + word;
        else{
            lines.push(currentLine);
            currentLine = word;
        }
    }

    lines.push(currentLine);
    return lines;
}


//https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} radius 
 * @returns 
 */
export const roundRect = (context, x, y, width, height, radius) => {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
    return context;
}