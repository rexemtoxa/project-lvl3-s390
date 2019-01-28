export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const items = [...doc.querySelectorAll('item')].map((item) => {
    const titleArticle = item.querySelector('title').textContent;
    const linkArticle = item.querySelector('link').textContent;
    return { titleArticle, linkArticle };
  });
  return { title, description, items };
};
