jQuery.extend({
    ajaxCache: function(options) {
        var defaults = {
            cacheKeyPrefix: "ajaxcache", //localStorage key prefix
            cacheTTL: 10, //TTL in seconds
            cacheKey: null,
            url: "",
            success: function (data, textStatus, jqXHR) {},
            dataType: "json"
        };

        options = $.extend(defaults, options);

        var isJSON = false;
        if(options.dataType != null) { isJSON = options.dataType.toLowerCase() == "json"; }

        // Taken from - http://stackoverflow.com/a/7616484/1526361
        var hashFunction = function(s) {
            var hash = 0, i, char;
            if (s.length == 0) return hash;
            for (i = 0, l = s.length; i < l; i++) {
                char = s.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };

        var getCacheKey = function (middleFix) {
            var key = options.cacheKey;
            if(key == null) { key = hashFunction(options.url); }
            if(middleFix != null) { key = middleFix + "-" + key; }
            if(options.cacheKeyPrefix != null) { return options.cacheKeyPrefix + "-" + key; }
            return key;
        };

        var localStorageValid = false;
        try {
            localStorage.setItem(options.cacheKeyPrefix, options.cacheKeyPrefix);
            localStorage.removeItem(options.cacheKeyPrefix);
            localStorageValid = true;
        } catch (e) { }

        var cacheValid = true;
        if(localStorageValid) {
            var ttl = localStorage.getItem(getCacheKey("ttl"));
            if(ttl && ttl < +new Date()) {
                localStorage.removeItem(getCacheKey());
                localStorage.removeItem(getCacheKey("ttl"));
                cacheValid = false;
            }
        }

        var deferred = null;
         if(localStorageValid && cacheValid) {
            try {
                var cache = localStorage.getItem(getCacheKey());
                if(cache != null) {
                    deferred = $.Deferred();
                    deferred.resolve();
                    if(isJSON) { cache = JSON.parse(cache); }
                    deferred.done(function () { options.success(cache, "success", null); } );
                    return deferred;
                }
            } catch (e) { console.log(e); }
        }

        if(localStorageValid) {
            return $.ajax(options).done(function (data) {
                try {
                    if(localStorageValid) {
                        data = isJSON ? JSON.stringify(data) : data;
                        console.log("Adding item to cache (" + getCacheKey() + "):" + data);
                        localStorage.setItem(getCacheKey("ttl"), +new Date() + options.cacheTTL * 1000);
                        localStorage.setItem(getCacheKey(), data);
                    }
                } catch (ignore) { console.log(e); }
            });
        }
        else { return $.ajax(options); }
    }
});
