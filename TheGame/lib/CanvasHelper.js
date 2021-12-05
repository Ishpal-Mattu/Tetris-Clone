
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