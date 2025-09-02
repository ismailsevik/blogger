        document.addEventListener('DOMContentLoaded', function() {
  // YouTube video kimliğini çıkarmak için regex ifadeleri
  var youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|playlist\?list=))([\w-]{11})(?:&.*)?$/i;
  var shortsRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/shorts\/)([\w-]{11})(?:.*)?$/i;

  // İçeriği manipüle eden ana fonksiyon
  function manipulateContent(element) {
    const comments = element.querySelectorAll('.comment .content');
    comments.forEach(comment => {
      let content = comment.innerHTML;

      // <i> etiketleri için dönüşüm
      content = content.replace(/<i\b[^>]*>(.*?)<\/i>/ig, function(match, url) {
        // Link bir YouTube videosu mu kontrol et
        let videoId = '';
        let isShorts = false;
        let matchResult = url.match(youtubeRegex);

        if (matchResult && matchResult[1]) {
          videoId = matchResult[1];
        } else {
          matchResult = url.match(shortsRegex);
          if (matchResult && matchResult[1]) {
            videoId = matchResult[1];
            isShorts = true;
          }
        }

        // Eğer YouTube linkiyse iframe oluştur
        if (videoId) {
          const iframeWidth = isShorts ? 379 : 560;
          const iframeHeight = isShorts ? 674 : 280;
          return `<iframe width="${iframeWidth}" height="${iframeHeight}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } 
        
        // Eğer resim linkiyse <img> etiketi oluştur
        else if (/\.(jpeg|jpg|gif|png|webp|avif)$/i.test(url)) {
          return `<img class="lazy" data-src="${url}" src="${url}" alt="Resim" />`;
        } 
        
        // Hiçbiri değilse, orijinal içeriği döndür
        else {
          return match;
        }
      });
      
      comment.innerHTML = content;
    });
  }

  // Sayfa yüklendiğinde içeriği manipüle et
  manipulateContent(document);

  // Dinamik olarak yüklenen yorumları izlemek için MutationObserver
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

  // Yorum bölümünü gözlemle
  const commentSection = document.querySelector('.cmt.comments');
  if (commentSection) {
    observer.observe(commentSection, {
      childList: true,
      subtree: true
    });
  }
});
