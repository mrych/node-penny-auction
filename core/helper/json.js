// Generated by CoffeeScript 1.7.1
var HelperJson, json;

HelperJson = (function() {
  function HelperJson() {
    this.initFields();
  }

  HelperJson.prototype.initFields = function() {
    this._success = true;
    this._messages = {};
    this._data = {};
    return this._isUserAuthed = false;
  };

  HelperJson.prototype.setSuccess = function(val) {
    this._success = val;
    return this;
  };

  HelperJson.prototype.setMessages = function(val) {
    this._messages = val;
    return this;
  };

  HelperJson.prototype.setData = function(val) {
    this._data = val;
    return this;
  };

  HelperJson.prototype.setIsUserAuthed = function(_isUserAuthed) {
    this._isUserAuthed = _isUserAuthed;
    this._isUserAuthed = this._isUserAuthed;
    return this;
  };

  HelperJson.prototype.addMessage = function(messageName, messageText) {
    if ((typeof messageName === 'string') && (typeof messageText === 'string')) {
      this._messages[messageName] = messageText;
    } else if ((typeof messageName === 'object') && (typeof messageText === 'undefined')) {
      this._messages[messageName.name] = messageName.message;
    }
    return this;
  };

  HelperJson.prototype.addData = function(key, value) {
    this._data[key] = value;
    return this;
  };

  HelperJson.prototype.render = function() {
    var resObject;
    resObject = {
      success: this._success,
      isUserAuthed: this._isUserAuthed,
      messages: this._messages,
      data: this._data
    };
    this.initFields();
    return resObject;
  };

  return HelperJson;

})();

json = new HelperJson;

if (typeof global.Helper === 'undefined') {
  global.Helper = {
    json: json
  };
} else {
  global.Helper.json = json;
}
