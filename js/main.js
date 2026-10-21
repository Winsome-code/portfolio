/* Work grid: fills the tiles from a CMS endpoint (or data/works.json).
   Point `data-src` on the .grid element in index.html at your CMS URL.
   If the request fails, the placeholder tiles in the HTML stay as they are. */
(() => {
  const grid = document.querySelector('.grid[data-src]');
  if (!grid) return;

  const make = (tag, cls, text) => {
    const node = document.createElement(tag);
    node.className = cls;
    node.textContent = text ?? '';
    return node;
  };

  // Map your CMS fields to the tile here (one place to edit).
  const toTile = (item) => ({
    title: item.title,
    description: item.description,
    url: item.url,
    image: item.image,
  });

  fetch(grid.dataset.src)
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => {
      const items = (Array.isArray(data) ? data : data.items || []).map(toTile);
      if (!items.length) return;

      grid.replaceChildren(...items.map(({ title, description, url, image }) => {
        const tile = make('a', 'box tile');
        tile.href = url && !/^\s*javascript:/i.test(url) ? url : '#';
        if (image) tile.style.setProperty('--tile-img', `url("${encodeURI(image)}")`);
        tile.append(make('span', 'box__title', title), make('span', 'box__text', description));
        return tile;
      }));
    })
    .catch(() => {});
})();
