(function (global) {
  "use strict";

  // Set up a namespace for the utility
  var ajaxUtils = {};

  // Returns an HTTP request object
  function getRequestObject() {
    if (global.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else {
      global.alert("Ajax is not supported!");
      return null;
    }
  }

  /**
   * Makes an Ajax GET request to the given URL.
   *
   * @param {string} requestUrl
   * @param {(response: any) => void} responseHandler
   * @param {boolean=} isJsonResponse - if omitted => true
   */
  ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
    var request = getRequestObject();
    if (!request) return;

    if (isJsonResponse === undefined) {
      isJsonResponse = true;
    }

    request.onreadystatechange = function () {
      handleResponse(request, responseHandler, isJsonResponse);
    };

    request.open("GET", requestUrl, true);
    request.send(null);
  };

  // Only calls user provided response handler function if response is ready
  // and not an error
  function handleResponse(request, responseHandler, isJsonResponse) {
    if (request.readyState === 4) {
      // 200 OK OR 0 for some local file contexts (not on GitHub Pages)
      if ((request.status >= 200 && request.status < 300) || request.status === 0) {
        if (isJsonResponse) {
          responseHandler(JSON.parse(request.responseText));
        } else {
          responseHandler(request.responseText);
        }
      } else {
        responseHandler({
          error: true,
          status: request.status,
          message: "HTTP error"
        });
      }
    }
  }

  // Expose utility to the global object
  global.$ajaxUtils = ajaxUtils;
})(window);
