// Generated by CoffeeScript 1.7.1
var UserController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

UserController = require('./user').UserController;

exports.FrontendController = (function(_super) {
  __extends(FrontendController, _super);

  function FrontendController() {
    FrontendController.__super__.constructor.apply(this, arguments);
  }

  FrontendController.preprocessRequest = function(req, res, next) {
    var appRoot;
    FrontendController.__super__.constructor.preprocessRequest.apply(this, arguments);
    appRoot = FrontendController.getStatic('appRoot');
    FrontendController.getStatic('assets').js.addFile(appRoot + "/public/javascripts/lib/jquery-1.7.min.js");
    FrontendController.getStatic('assets').js.addFile(appRoot + "/public/javascripts/lib/jquery.jcarousel.js");
    FrontendController.getStatic('assets').js.addFile(appRoot + "/public/javascripts/lib/prettyCheckboxes.js");
    FrontendController.getStatic('assets').js.addFile(appRoot + "/public/javascripts/lib/DD_belatedPNG-min.js");
    FrontendController.getStatic('assets').js.addFile(appRoot + "/public/javascripts/lib/functions.js");
    FrontendController.getStatic('assets').css.addFile(appRoot + "/public/stylesheets/_style.css");
    FrontendController.getStatic('assets').css.addFile(appRoot + "/public/stylesheets/prettyCheckboxes.css");
    if (next != null) {
      return next();
    }
  };

  return FrontendController;

})(UserController);