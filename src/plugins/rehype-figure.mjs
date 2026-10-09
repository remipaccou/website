// Turns a paragraph that contains only an image with a title into
// <figure><img><figcaption>title</figcaption></figure>.
// Markdown:  ![Alt text](./figure.png "Caption shown under the image")
export default function rehypeFigure() {
  return (tree) => walk(tree);
}

function walk(node) {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    if (child.type === 'element' && child.tagName === 'p') {
      const kids = child.children.filter(
        (k) => !(k.type === 'text' && k.value.trim() === ''),
      );
      const img = kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img' ? kids[0] : null;
      if (img) {
        const caption = img.properties?.title;
        if (img.properties) delete img.properties.title;
        return {
          type: 'element',
          tagName: 'figure',
          properties: {},
          children: caption
            ? [img, { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: String(caption) }] }]
            : [img],
        };
      }
    }
    walk(child);
    return child;
  });
}
