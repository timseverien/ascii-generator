import AsciiFactory from '../factories/AsciiFactory';

let worker = self;

worker.onmessage = function(data) {
    worker.postMessage(AsciiFactory.getAscii(data.data.characterLightnessSet, data.data.imageLightnessData));
};
