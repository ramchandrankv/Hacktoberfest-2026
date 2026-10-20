module.exports = (req, res) => {
  const item = req.body || {};
  const headers = 'Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Variant Price,Variant Compare At Price,Variant Cost';
  const handle = (item.title || 'side-hustle-item').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const safeTitle = `"${(item.title || '').replace(/"/g, '""')}"`;
  const safeDesc = `"${(item.description || '').replace(/"/g, '""')}"`;
  const tags = `"${(item.tags || []).join(', ')}"`;
  const price = item.price || 99.00;
  const comparePrice = Math.round(price * 1.2);
  const cost = item.cogs || 30.00;

  const row = `${handle},${safeTitle},${safeDesc},HustleForge,${item.category || 'General'},${tags},TRUE,Title,Default Title,${price},${comparePrice},${cost}`;
  const csvContent = `${headers}\n${row}`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="hustleforge-inventory-${Date.now()}.csv"`);
  res.status(200).send(csvContent);
};
