// Generated by CoffeeScript 1.7.1
define(['jquery', 'spinner', 'modules/app/models/layout-state'], function($, Spinner, layoutState) {
  var helpers;
  $.fn.spinXXX = function(opts) {
    this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data();
      if (data.spinner) {
        $this.removeClass('spin-xxx-faded');
        data.spinner.stop();
        delete data.spinner;
      }
      if (opts !== false) {
        $this.addClass('spin-xxx-faded');
        return data.spinner = new Spinner($.extend({
          color: $this.css("color")
        }, opts)).spin(this);
      }
    });
    return this;
  };
  helpers = {
    form: {
      serializeObject: function(formSelector) {
        var fields, formEl, nestedObj, serializedArray, serializedObject, _i, _len;
        serializedArray = $(formSelector).serializeArray();
        serializedObject = {};
        for (_i = 0, _len = serializedArray.length; _i < _len; _i++) {
          formEl = serializedArray[_i];
          formEl.name = formEl.name.replace('[', '.');
          formEl.name = formEl.name.replace(']', '');
          fields = formEl.name.split('.');
          if (serializedObject[fields[0]] == null) {
            if (fields.length === 1) {
              serializedObject[fields[0]] = formEl.value;
            } else {
              nestedObj = {};
              nestedObj[fields[1]] = formEl.value;
              serializedObject[fields[0]] = nestedObj;
            }
          } else {
            serializedObject[fields[0]][fields[1]] = formEl.value;
          }
        }
        return serializedObject;
      }
    },
    alert: {
      containerSelector: ".main-content",
      setTargerContainer: function(target) {
        this.containerSelector = target;
        return this;
      },
      setStatus: function(status) {
        this.status = status;
        switch (status) {
          case "success":
            this.strong = "Well done!";
            break;
          case "error":
            this.strong = "Oh snap!";
            break;
          case "warining":
            this.strong = "Warning!";
            break;
          default:
            this.strong = "Heads up!";
        }
        return this;
      },
      setMessage: function(message) {
        this.message = message;
        return this;
      },
      render: function(framework) {
        var html;
        if (framework == null) {
          framework = 'bootstrap';
        }
        $(".alert-box").remove();
        if (framework === 'foundation') {
          html = "<div class=\"alert-box " + this.status + "\" >\n" + this.message + "\n<a href=\"#\" class=\"close\">&times;</a>\n</div>";
        } else if (framework === 'bootstrap') {
          html = "<div class=\"alert alert-" + this.status + " alert-dismissable\">\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>\n  <strong>" + this.strong + "</strong> " + this.message + "\n</div>";
        }
        console.log('length', html);
        return $(this.containerSelector).html(html);
      },
      hide: function() {
        $(".alert").remove();
        return this;
      }
    },
    loadingMask: {
      show: function(target) {
        var tarenHeight;
        tarenHeight = $(target).css("height");
        return $(target).spinXXX();
      },
      hide: function(target) {
        $(target).removeClass('faded');
        return $(target).spinXXX(false);
      }
    },
    ajax: {

      /*
      params.url
      params.targetEl
      params.type (GET, POST)
      params.data
      params.cbSuccess
      params.async
       */
      request: function(params) {
        var async, curDate, data, targetEl, timezoneOffset, type;
        type = void 0;
        data = void 0;
        if (typeof params.type !== "undefined" && params.type !== null) {
          type = params.type;
        } else {
          type = "GET";
        }
        if (typeof params.data !== "undefined" && params.data !== null) {
          data = params.data;
        } else {
          data = {};
        }
        targetEl = $(params.targetEl);
        if (targetEl.length === 0) {
          targetEl = $('body');
        }
        data.ajax = true;
        if (params.async != null) {
          async = params.async;
        } else {
          async = true;
        }
        helpers.loadingMask.show(targetEl);
        curDate = new Date();
        timezoneOffset = curDate.getTimezoneOffset() / 60;
        return $.ajax({
          url: require.toUrl('/') + "api/" + params.url + "?t=" + curDate.getTime() + ("&timezoneOffset=" + timezoneOffset),
          dataType: "json",
          type: type,
          data: data,
          async: async,
          success: function(res) {
            layoutState.set('isUserAuthed', res.isUserAuthed);
            if (params.cbSuccess) {
              return params.cbSuccess(res);
            }
          },
          complete: function() {
            return helpers.loadingMask.hide(targetEl);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            return false;
          }
        });
      },
      get: function(params) {
        params.type = "GET";
        return this.request(params);
      },
      post: function(params) {
        params.type = "POST";
        return this.request(params);
      },
      "delete": function(params) {
        params.type = "DELETE";
        return this.request(params);
      }
    }
  };
  return helpers;
});