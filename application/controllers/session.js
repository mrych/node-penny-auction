// Generated by CoffeeScript 1.7.1
var FrontendController, Model,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FrontendController = require('./base/frontend').FrontendController;

Model = require('../../core/models').Model;

exports.SessionController = (function(_super) {
  __extends(SessionController, _super);

  function SessionController() {
    this.doLogout = __bind(this.doLogout, this);
    this.doLogin = __bind(this.doLogin, this);
    SessionController.__super__.constructor.apply(this, arguments);
  }

  SessionController.preprocessRequest = function(req, res, next) {
    return SessionController.__super__.constructor.preprocessRequest.apply(this, arguments);
  };

  SessionController.prototype.doLogin = function(req, res) {
    return Model.instanceOf('user').login(req.body.email, req.body.password).then((function(_this) {
      return function(user) {
        var response;
        req.session.userId = user._id;
        Helper.json.setIsUserAuthed(true);
        response = Helper.json.render();
        return res.json(response);
      };
    })(this)).fail(function(e) {
      var response;
      console.log(e.toJson());
      Helper.json.setSuccess(false);
      Helper.json.setIsUserAuthed(false);
      Helper.json.addMessage(e.toJson());
      response = Helper.json.render();
      return res.json(response);
    });
  };

  SessionController.prototype.doLogout = function(req, res) {
    delete req.session.userId;
    Helper.json.setSuccess(true);
    Helper.json.setIsUserAuthed(false);
    return res.json(Helper.json.render());
  };

  return SessionController;

})(FrontendController);