const getParams = () => {
  var qs = location.search.substring(1);
  if (!qs.length) return {};
  return qs.split('&').reduce((memo, pair) => {
    const components = pair.split('=');
    const k = components[0];
    const v = components[1];
    memo[k] = decodeURIComponent(v);
    return memo;
  }, {});
};

const ndImageUrl = (url) =>
  'http://cdn.northerndelegate.com/' + url.replace(/^http(s?):\/\//, '');

const randomElementOf = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const init = () => {
  const DOM = {
    query: document.getElementById('query'),
    search: document.getElementById('search'),
    content: document.getElementById('content'),
    loading: document.getElementById('loading'),
  };

  const prepopulate = () => {
    const params = getParams();
    const query = (
      params.q ||
      randomElementOf([
        'Asia',
        'Africa',
        'North America',
        'South America',
        'Antarctica',
        'Europe',
        'Australia'
      ])
    );

    return performSearch(query);
  };

  const performSearch = query => {
    DOM.loading.style.display = '';
    DOM.query.value = query;
    history.replaceState(null, null, `?q=${query}`);
    return fetch(`/q?query=${query}`)
      .then(response => response.json())
      .then(results => {
        DOM.loading.style.display = 'none';
        DOM.content.innerHTML = results.map(({ thumb }) => `
          <img src='${ndImageUrl(thumb)}' />
        `).join('');
      })
      .catch(console.error.bind(console));
  }

  DOM.search.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = DOM.query.value;
    performSearch(query);
  });

  prepopulate();
};

document.addEventListener('DOMContentLoaded', init);
