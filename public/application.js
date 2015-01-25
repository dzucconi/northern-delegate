(function(exports) {
  'use strict';

  var getParams,
    ndImageUrl,
    addPaginationLinks,
    searchComplete,
    randomElementOf,
    prepopulate,
    attachSearch,
    onLoad;

  getParams = function() {
    var qs = location.search.substring(1);

    if (!qs.length) return {};

    return qs.split('&').reduce(function(memo, pair) {
      var k, v, _ref;
      _ref = pair.split('='), k = _ref[0], v = _ref[1];
      memo[k] = decodeURIComponent(v);
      return memo;
    }, {});
  };

  ndImageUrl = function(url) {
    return 'http://cdn.northerndelegate.com/' + url.replace(/^http(s?):\/\//, '');
  };


  addPaginationLinks = function() {
    var cursor, curPage, pagesDiv, contentDiv;

    cursor = imageSearch.cursor;
    curPage = cursor.currentPageIndex;
    pagesDiv = document.createElement('div');
    pagesDiv.className = 'pagination';

    for (var i = cursor.pages.length - 1; i >= 0; i--) {
      var n, page, link, label;

      n = cursor.pages.length - (i + 1);
      page = cursor.pages[n];

      if (curPage == n) {
        label = document.createElement('span');
        label.innerHTML = page.label;
        pagesDiv.appendChild(label);
      } else {
        link = document.createElement('a');
        link.href = 'javascript:imageSearch.gotoPage(' + n + ');';
        link.innerHTML = page.label;
        pagesDiv.appendChild(link);
      }
    }

    contentDiv = document.getElementById('content');
    contentDiv.insertBefore(pagesDiv, contentDiv.firstChild);
  };

  searchComplete = function() {
    if (imageSearch.results && imageSearch.results.length > 0) {
      var contentDiv, results;

      contentDiv = document.getElementById('content');
      contentDiv.innerHTML = '';
      results = imageSearch.results;

      for (var i = results.length - 1; i >= 0; i--) {
        var result, link, img;

        result = results[i];

        link = document.createElement('a');
        link.href = result.url;
        link.target = '_blank';

        img = document.createElement('img');
        img.src = ndImageUrl(result.url);
        img.width = result.width;
        img.height = result.height;
        img.onerror = function() {
          this.style.display = 'none';
        };

        link.appendChild(img);
        contentDiv.appendChild(link);
      }

      addPaginationLinks(imageSearch);
    }
  };

  randomElementOf = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  prepopulate = function() {
    performSearch((
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
    ));
  };

  attachSearch = function() {
    search.addEventListener('keydown', function(e) {
      if (e.which === 13) imageSearch.execute(search.value);
    });
    if (params.q) search.value = params.q;
  };

  onLoad = function() {
    exports.search = document.getElementById('search');
    exports.params = getParams();
    exports.imageSearch = new google.search.ImageSearch();

    imageSearch.setSearchCompleteCallback(this, searchComplete, null);
    [
      ['RESTRICT_IMAGESIZE', 'IMAGESIZE_MEDIUM'],
      ['RESTRICT_IMAGETYPE', 'IMAGETYPE_PHOTO'],
      ['RESTRICT_FILETYPE', 'FILETYPE_JPG']
    ].forEach(function(restriction) {
      imageSearch.setRestriction(
        google.search.ImageSearch[restriction[0]],
        google.search.ImageSearch[restriction[1]]
      );
    });
    imageSearch.setResultSetSize(google.search.Search.LARGE_RESULTSET);

    attachSearch();
    prepopulate();
  };

  exports.performSearch = function(query) {
    search.value = query;
    imageSearch.execute(query);
  };

  google.load('search', '1');
  google.setOnLoadCallback(onLoad);
})(window);
