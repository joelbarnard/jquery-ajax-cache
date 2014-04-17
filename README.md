jQuery-AJAX-Cache
=========

jQuery-AJAX-Cache allows you to cache ajax responses using localStorage.



Version
----

0.1



Usage
--------------

```javascript
$.ajaxCache({
    cacheKeyPrefix: "ajaxcache", //localStorage key prefix
    cacheTTL: 10, //TTL in seconds
    cacheKey: null, //manually specify key instead of using URL hash
    url: "",   // $.ajax();
    success: function (data, textStatus, jqXHR) {}, // $.ajax();
    dataType: "json" // $.ajax();
});

```



License
----
MIT

    