// Blogger Yorum Sayacı 
<script type="text/javascript">
    var commentCount = 0;
    var ndxbase = 0;
    var targetElement = document.querySelector('.notification');

    // Bu fonksiyon, JSONP çağrısı tarafından otomatik olarak çağrılır.
    function countRecentComments(json) {
      var one_day = 1000 * 60 * 60 * 24;
      var now = new Date();
      var startDate = new Date(now.getTime() - one_day);

      if (json && json.feed && json.feed.entry && json.feed.entry.length) {
        for (var i = 0; i < json.feed.entry.length; i++) {
          var entry = json.feed.entry[i];
          // Tarih dizesini ayrıştır
          var datePart = entry.published.$t.match(/\d+/g);
          var cmtDate = new Date(datePart[0], datePart[1] - 1, datePart[2], datePart[3], datePart[4], datePart[5]);

          // Son 24 saatteki yorumları say
          if (cmtDate >= startDate && cmtDate <= now) {
            commentCount++;
          }
        }
      }

      // Daha fazla yorum varsa, bir sonraki veri bloğunu dinamik olarak yükle
      if (json && json.feed && json.feed.entry && json.feed.entry.length === 200) {
        ndxbase += 200;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.ismailsevik.com/feeds/comments/default?redirect=false&max-results=200&start-index=' + ndxbase + '&alt=json-in-script&callback=countRecentComments';
        document.head.appendChild(script);
        return; // Yeni bir çağrı başlatıldığı için fonksiyonu sonlandır
      }

      // Tüm veriler yüklendikten sonra sonucu günceller
      if (targetElement) {
        targetElement.textContent = commentCount;
      }
    }
// İlk JSON feed'ini yükle
    var initialScript = document.createElement('script');
    initialScript.type = 'text/javascript';
    initialScript.src = 'https://www.ismailsevik.com/feeds/comments/default?redirect=false&max-results=200&alt=json-in-script&callback=countRecentComments';
    document.head.appendChild(initialScript);

    
  </script>
