export default class CanvasService {
    static getCanvasFromImage(image, width, height) {
        const canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.height = Math.round(height);
        canvas.width = Math.round(width);

        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        return canvas;
    }

    static getCharacterLightnessSet(characterSet, fontSize) {
        const canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            characterLightnessSet = [];

        canvas.height = fontSize;
        canvas.width = fontSize;

        context.fontStyle = fontSize + 'px monospace';

        characterSet.forEach((character) => {
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = '#000';
            context.fillText(character, 0, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            characterLightnessSet.push({
                character: character,
                lightness: CanvasService.getCanvasLightness(imageData)
            });
        });

        return characterLightnessSet.filter((character) => character.lightness > 0 || character.character === 0x20);
    }

    static getImageLightnessData(imageData) {
        var lightnessData = [];

        CanvasService.forEachPixel(imageData, function(r, g, b, a) {
            lightnessData.push((r + g + b) / 3);
        });

        return {
            data: lightnessData,
            height: imageData.height,
            width: imageData.width
        };
    }

    static getCanvasLightness(imageData) {
        const imageLightnessData = CanvasService.getImageLightnessData(imageData),
            sum = (previous, current) => previous + current;

        return imageLightnessData.data.reduce(sum, 0) / imageLightnessData.data.length;
    }

    static forEachPixel(imageData, callback) {
        const pixelData = imageData.data;

        for(let i = 0; i < pixelData.length; i += 4) {
            callback(pixelData[i], pixelData[i + 1], pixelData[i + 2], pixelData[i + 3], i);
        }
    }

    static normalizeCharacterLightness(lightnessData) {
        let lightnessMin = Infinity,
            lightnessMax = -Infinity;

        lightnessData.forEach((obj) => {
            lightnessMin = Math.min(obj.lightness, lightnessMin);
            lightnessMax = Math.max(obj.lightness, lightnessMax);
        });

        return lightnessData.map((obj) => {
            obj.lightness = (obj.lightness - lightnessMin) / (lightnessMax - lightnessMin);
            return obj;
        });
    }

    static normalizeLightness(lightnessData) {
        let lightnessMin = Infinity,
            lightnessMax = -Infinity;

        lightnessData.forEach((lightness) => {
            lightnessMin = Math.min(lightness, lightnessMin);
            lightnessMax = Math.max(lightness, lightnessMax);
        });

        return lightnessData.map((lightness) => {
            return (lightness - lightnessMin) / (lightnessMax - lightnessMin);
        });
    }
}
