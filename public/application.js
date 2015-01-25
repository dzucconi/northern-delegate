(function(exports) {
  'use strict';

  var ndImageUrl, addPaginationLinks, searchComplete, randomElementOf, prepopulate, attachSearch, onLoad;

  ndImageUrl = function(url) {
    return 'http://cdn.northerndelegate.com/' + url.replace(/^http(s?):\/\//, '');
  }

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
        label = document.createElement('span')
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
  }

  searchComplete = function() {
    if (imageSearch.results && imageSearch.results.length > 0) {
      var contentDiv, results;

      contentDiv = document.getElementById('content');
      contentDiv.innerHTML = '';
      results = imageSearch.results;

      for (var i = results.length - 1; i >= 0; i--) {
        var result, imgContainer, link, img;

        result = results[i];

        link = document.createElement('a');
        link.href = result.url;
        link.target = '_blank';

        img = document.createElement('img');
        img.src = ndImageUrl(result.url);
        img.width = result.width;
        img.height = result.height;
        img.onerror = function() { this.style.display = 'none' };

        link.appendChild(img);
        contentDiv.appendChild(link);
      }

      addPaginationLinks(imageSearch);
    }
  }

  randomElementOf = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  prepopulate = function() {
    imageSearch.execute(randomElementOf([
      'Asia',
      'Africa',
      'North America',
      'South America',
      'Antarctica',
      'Europe',
      'Australia'
    ]));
  };

  attachSearch = function() {
    document.getElementById('search').addEventListener('keydown', function(e) {
      if (e.which === 13) imageSearch.execute(search.value);
    });
  }

  onLoad = function() {
    exports.imageSearch = new google.search.ImageSearch();
    imageSearch.setSearchCompleteCallback(this, searchComplete, null);

    imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE, google.search.ImageSearch.IMAGESIZE_MEDIUM);
    imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_FILETYPE, google.search.ImageSearch.FILETYPE_JPG);
    imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGETYPE, google.search.ImageSearch.IMAGETYPE_PHOTO);

    imageSearch.setResultSetSize(google.search.Search.LARGE_RESULTSET);

    attachSearch();
    prepopulate();
  }

  google.load('search', '1');
  google.setOnLoadCallback(onLoad);
})(window);
