/**
 * Convert Satoshi WOFF2 to TypeFace JSON for Three.js TextGeometry
 *
 * Run with: node scripts/convert-font.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { openSync } from 'fontkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function convertFont() {
  const inputPath = path.join(__dirname, '../public/fonts/Satoshi-Variable.woff2');
  const outputPath = path.join(__dirname, '../public/fonts/satoshi-bold.json');

  console.log('Reading WOFF2 file with fontkit...');
  const font = openSync(inputPath);

  console.log('Font loaded:', font.familyName);
  console.log('Units per em:', font.unitsPerEm);

  const typeface = {
    glyphs: {},
    familyName: font.familyName || 'Satoshi',
    ascender: font.ascent,
    descender: font.descent,
    underlinePosition: font.underlinePosition || 0,
    underlineThickness: font.underlineThickness || 0,
    boundingBox: {
      xMin: font.bbox.minX,
      xMax: font.bbox.maxX,
      yMin: font.bbox.minY,
      yMax: font.bbox.maxY,
    },
    resolution: font.unitsPerEm,
    original_font_information: {
      format: 0,
      copyright: font.copyright || '',
      fontFamily: font.familyName || 'Satoshi',
      fontSubfamily: 'Bold',
      fullName: font.fullName || 'Satoshi Bold',
      version: font.version || '',
      postScriptName: font.postscriptName || 'Satoshi-Bold',
    },
  };

  // Characters we need for "TAYLOR ALLEN"
  const neededChars = 'TAYLORALEN ';
  const charCodes = new Set([...neededChars].map(c => c.charCodeAt(0)));

  // Add all uppercase letters and space for flexibility
  for (let i = 65; i <= 90; i++) charCodes.add(i); // A-Z
  charCodes.add(32); // space

  for (const charCode of charCodes) {
    const char = String.fromCharCode(charCode);
    const glyph = font.glyphForCodePoint(charCode);

    if (!glyph || glyph.id === 0) continue;

    const glyphData = {
      ha: Math.round(glyph.advanceWidth),
      x_min: Math.round(glyph.bbox?.minX || 0),
      x_max: Math.round(glyph.bbox?.maxX || 0),
      o: '',
    };

    // Get the glyph path
    const glyphPath = glyph.path;
    if (!glyphPath) continue;

    const commands = [];

    // Convert SVG path commands to TypeFace format
    for (const cmd of glyphPath.commands) {
      switch (cmd.command) {
        case 'moveTo':
          commands.push(`m ${Math.round(cmd.args[0])} ${Math.round(cmd.args[1])}`);
          break;
        case 'lineTo':
          commands.push(`l ${Math.round(cmd.args[0])} ${Math.round(cmd.args[1])}`);
          break;
        case 'curveTo':
        case 'bezierCurveTo':
          commands.push(`b ${Math.round(cmd.args[0])} ${Math.round(cmd.args[1])} ${Math.round(cmd.args[2])} ${Math.round(cmd.args[3])} ${Math.round(cmd.args[4])} ${Math.round(cmd.args[5])}`);
          break;
        case 'quadraticCurveTo':
          commands.push(`q ${Math.round(cmd.args[0])} ${Math.round(cmd.args[1])} ${Math.round(cmd.args[2])} ${Math.round(cmd.args[3])}`);
          break;
        case 'closePath':
          commands.push('z');
          break;
      }
    }

    glyphData.o = commands.join(' ');
    typeface.glyphs[char] = glyphData;
  }

  console.log(`Generated glyphs for ${Object.keys(typeface.glyphs).length} characters`);

  fs.writeFileSync(outputPath, JSON.stringify(typeface, null, 2));
  console.log(`Saved to ${outputPath}`);
}

convertFont().catch(console.error);
