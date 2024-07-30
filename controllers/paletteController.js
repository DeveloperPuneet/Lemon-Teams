const Palette = require('../models/Palette');

function arePalettesEqual(palette1, palette2) {
    const colors1 = [
        palette1.color1, palette1.color2, palette1.color3, palette1.color4, palette1.color5,
        palette1.color6, palette1.color7, palette1.color8, palette1.color9, palette1.color10
    ].filter(Boolean);

    const colors2 = [
        palette2.color1, palette2.color2, palette2.color3, palette2.color4, palette2.color5,
        palette2.color6, palette2.color7, palette2.color8, palette2.color9, palette2.color10
    ].filter(Boolean);

    if (colors1.length !== colors2.length) {
        return false;
    }

    colors1.sort();
    colors2.sort();

    for (let i = 0; i < colors1.length; i++) {
        if (colors1[i] !== colors2[i]) {
            return false;
        }
    }
    return true;
}

async function removeDuplicatePalettes() {
    try {
        const palettes = await Palette.find({});
        const seenPalettes = new Map();

        for (const palette of palettes) {
            const key = JSON.stringify([
                palette.color1, palette.color2, palette.color3, palette.color4, palette.color5,
                palette.color6, palette.color7, palette.color8, palette.color9, palette.color10
            ].filter(Boolean).sort());

            if (seenPalettes.has(key)) {
                await Palette.deleteOne({ _id: palette._id });
                console.log(`Deleted duplicate palette with ID: ${palette._id}`);
            } else {
                seenPalettes.set(key, true);
            }
        }

        console.log('Duplicate palettes removal completed.');
    } catch (error) {
        console.log('Error removing duplicate palettes:', error.message);
    }
}

module.exports = { removeDuplicatePalettes };
