---
title: "Text Overlay Tool"
description: "Comprehensive guide for using and developing the Text Overlay Tool in SveltyCMS Image Editor"
---

# Text Overlay Tool Documentation

## Table of Contents

1. [User Guide](#user-guide)
   - [Introduction](#introduction)
   - [How to Use](#how-to-use)
   - [Tips and Best Practices](#tips-and-best-practices)
2. [Developer Guide](#developer-guide)
   - [Architecture Overview](#architecture-overview)
   - [Key Components](#key-components)
   - [Important Functions](#important-functions)
   - [Customization and Extension](#customization-and-extension)
3. [Troubleshooting](#troubleshooting)
4. [FAQ](#faq)

## User Guide

### Introduction

The Text Overlay Tool is a versatile feature in the SveltyCMS Image Editor that allows you to add, customize, and manipulate text on your images. Whether you're creating memes, adding captions, or designing graphics with text elements, this tool provides a wide range of options to bring your ideas to life.

### How to Use

1. **Select the Text Overlay Tool**: 
   - Click on the Text Overlay Tool icon in the editor toolbar.

2. **Add Text**:
   - Click the "Add Text" button.
   - Enter your desired text in the input field that appears.

3. **Customize Text**:
   - Use the toolbar to adjust:
     - Font: Choose from available typefaces.
     - Size: Adjust text size (in pixels).
     - Color: Select text color using the color picker.
     - Style: Toggle bold, italic, or underline.
     - Alignment: Choose left, center, or right alignment.
   - Advanced options:
     - Line height: Adjust spacing between lines.
     - Letter spacing: Control space between characters.

4. **Position and Transform Text**:
   - Drag the text to position it anywhere on the image.
   - Use the corner handles to resize the text box.
   - Use the rotation handle to rotate the text.

5. **Layer Management**:
   - Add multiple text layers by repeating steps 2-4.
   - Use the layer panel to select, reorder, or delete text layers.

6. **Apply Changes**:
   - Click "Apply" to confirm the text overlay.
   - Use "Undo" or "Redo" to step through changes.

### Tips and Best Practices

- **Contrast is Key**: Choose text colors that stand out against the image background for readability.
- **Font Pairing**: Experiment with combining different fonts for headlines and body text.
- **Text Hierarchy**: Use varying sizes and weights to create visual hierarchy in your text.
- **Spacing Matters**: Adjust line height and letter spacing for optimal legibility.
- **Alignment with Image**: Align text with key elements in your image for a cohesive look.
- **Text as Graphic**: Use large, bold text as a graphic element in your design.
- **Transparency**: Adjust text opacity for subtle watermark-like effects.
- **Preview at Different Sizes**: Check how your text looks when the image is viewed at different sizes.

## Developer Guide

### Architecture Overview

The Text Overlay Tool is implemented as a modular component within the SveltyCMS Image Editor. It utilizes Svelte for the UI and state management, and Konva.js for canvas manipulation and rendering of the text overlays.

### Key Components

1. **TextOverlay.svelte**: The main component that handles the UI and logic for the Text Overlay Tool.
2. **KonvaStage**: A wrapper component that integrates Konva.js with Svelte for image and text rendering.
3. **TextLayer**: A component representing individual text layers.
4. **TextStyleControls**: A sub-component for text customization controls.

### Important Functions

```typescript
function addText(text: string = 'New Text'): void {
  const textNode = new Konva.Text({
    text: text,
    x: 50,
    y: 50,
    fontSize: 20,
    fill: 'white',
    draggable: true,
  });
  
  layer.add(textNode);
  layer.batchDraw();
  selectText(textNode);
}

function updateSelectedText(props: Partial<Konva.TextConfig>): void {
  if (!selectedText) return;
  
  Object.entries(props).forEach(([key, value]) => {
    selectedText[key](value);
  });
  
  layer.batchDraw();
  updateTextControls(selectedText);
}

function selectText(textNode: Konva.Text): void {
  deselectAllTexts();
  textNode.draggable(true);
  transformer.nodes([textNode]);
  layer.batchDraw();
  selectedText = textNode;
  updateTextControls(textNode);
}
```

### Customization and Extension

To enhance the Text Overlay Tool functionality:

1. Add text effects like shadows or outlines:
   ```typescript
   function addTextShadow(textNode: Konva.Text, color: string, blur: number, offset: {x: number, y: number}): void {
     textNode.shadowColor(color);
     textNode.shadowBlur(blur);
     textNode.shadowOffset(offset);
     layer.batchDraw();
   }

   function addTextOutline(textNode: Konva.Text, color: string, width: number): void {
     textNode.stroke(color);
     textNode.strokeWidth(width);
     layer.batchDraw();
   }
   ```

2. Implement text-on-path functionality for curved text:
   ```typescript
   function createTextPath(text: string, pathData: string): Konva.TextPath {
     return new Konva.TextPath({
       text: text,
       data: pathData,
       fontSize: 20,
       fill: 'white',
     });
   }

   // Usage
   const curvedText = createTextPath('Curved Text Example', 'M10,90 Q50,10 90,90');
   layer.add(curvedText);
   layer.batchDraw();
   ```

3. Add support for importing custom fonts:
   ```typescript
   async function loadCustomFont(fontName: string, fontUrl: string): Promise<void> {
     const font = new FontFace(fontName, `url(${fontUrl})`);
     await font.load();
     document.fonts.add(font);
     
     // Update font list in the UI
     availableFonts.update(fonts => [...fonts, fontName]);
   }

   // Usage
   loadCustomFont('MyCustomFont', 'path/to/custom-font.woff2')
     .then(() => console.log('Custom font loaded'))
     .catch(err => console.error('Failed to load custom font', err));
   ```

## Troubleshooting

If you encounter issues with the Text Overlay Tool, try the following:

- If text is not appearing, check that the color contrasts with the background.
- If unable to select or move text, ensure you're in the Text Overlay Tool mode.
- For performance issues with many text layers, try merging some layers or reducing effects.
- If custom fonts are not loading, check the font file format and URL.

## FAQ

**Q: Is there a limit to how many text layers I can add?**
A: While there's no hard limit, too many layers may impact performance. We recommend using no more than 20-30 text layers per image.

**Q: Can I use my own fonts with the Text Overlay Tool?**
A: By default, the tool uses web-safe fonts. Custom font support can be added by developers using the provided extension methods.

**Q: How can I create curved or circular text?**
A: The basic tool doesn't support curved text, but developers can implement this feature using the text-on-path functionality described in the customization section.

**Q: Will the text quality decrease if I resize it?**
A: No, the text is vector-based, so it will remain crisp at any size. However, extremely large text may impact performance.
