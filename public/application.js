(function(exports) {
  'use strict';

  var addPaginationLinks, searchComplete, onLoad;

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
        img.src = '/' + result.tbUrl.replace(/^http(s?):\/\//, '');
        img.width = result.tbWidth;
        img.height = result.tbHeight;

        link.appendChild(img);
        contentDiv.appendChild(link);
      }

      addPaginationLinks(imageSearch);
    }
  }

  onLoad = function() {
    var search, initialQuery;

    initialQuery = 'map';

    exports.imageSearch = new google.search.ImageSearch();
    imageSearch.setSearchCompleteCallback(this, searchComplete, null);
    imageSearch.execute(initialQuery);

    search = document.getElementById('search');
    search.addEventListener('keypress', function(e) {
      if (e.which === 13) { // Enter
        imageSearch.execute(search.value);
      }
    });
  }

  google.load('search', '1');
  google.setOnLoadCallback(onLoad);
})(window);
