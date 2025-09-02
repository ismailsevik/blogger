document.addEventListener('DOMContentLoaded', function() {
  // YouTube regex ifadeleri
  var youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|playlist\?list=))([\w-]{11})(?:&.*)?$/i;
  var shortsRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/shorts\/)([\w-]{11})(?:.*)?$/i;

  // İçeriği manipüle eden fonksiyon
  function manipulateContent(element) {
    const comments = element.querySelectorAll('.comment .content');
    comments.forEach(comment => {
      let content = comment.innerHTML;

      // Resim etiketi dönüşümü: <i rel="image">...</i>
      content = content.replace(/<i rel="image">(.*?)<\/i>/ig, function(match, url) {
        return `<img class="lazy" data-src="${url}" src="${url}" alt="Resim Yorumu" />`;
      });

      // YouTube bağlantıları için iframe dönüşümü: <i rel="youtube">...</i>
      content = content.replace(/<i rel="youtube">(.*?)<\/i>/ig, function(match, url) {
        var videoId = '';
        var isShorts = false;
        var matchResult = url.match(youtubeRegex);
        if (matchResult && matchResult[1]) {
          videoId = matchResult[1];
        } else {
          matchResult = url.match(shortsRegex);
          if (matchResult && matchResult[1]) {
            videoId = matchResult[1];
            isShorts = true;
          } else {
            return 'Geçersiz YouTube Bağlantısı';
          }
        }

        var iframeWidth = isShorts ? 379 : 560;
        var iframeHeight = isShorts ? 674 : 280;

        return `<iframe width="${iframeWidth}" height="${iframeHeight}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      });
      
      comment.innerHTML = content;
    });
  }

  // İlk yüklemede içeriği manipüle et
  manipulateContent(document);

  // Dinamik yüklenen yorumlar için MutationObserver
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            manipulateContent(node);
          }
        });
      }
    });
  });

  // Yorum bölümünü izle
  const commentSection = document.querySelector('.cmt.comments');
  if (commentSection) {
    observer.observe(commentSection, {
      childList: true,
      subtree: true
    });
  }
});
