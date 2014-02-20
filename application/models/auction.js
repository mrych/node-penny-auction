// Generated by CoffeeScript 1.7.1
var Model, Q, mongoose,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Q = require('q');

Model = require('../../core/models').Model;

mongoose = require('mongoose');

exports.Auction = (function(_super) {
  var _schemaDescription;

  __extends(Auction, _super);

  _schemaDescription = {
    title: String,
    description: String,
    images: [String],
    bidders: [
      {
        userId: mongoose.Schema.ObjectId,
        username: String
      }
    ],
    lastBidder: {
      userId: mongoose.Schema.ObjectId,
      username: String
    },
    startingPrice: Number,
    currentPrice: Number,
    retailerPrice: Number,
    startDate: Date,
    endDate: Date
  };

  function Auction() {
    Auction.__super__.constructor.call(this, _schemaDescription);
  }

  Auction.prototype.save = function(inData) {
    var defer, doc;
    defer = Q.defer();
    doc = this.createMongooseDocument(inData);
    doc.save(function(err) {
      if (err) {
        return defer.reject(new ExceptionUserMessage("error", "Unable to save"));
      } else {
        return defer.resolve();
      }
    });
    return defer.promise;
  };

  Auction.prototype.findAll = function() {
    var defer;
    defer = Q.defer();
    this.getMongooseModel().find().exec(function(err, result) {
      if (err) {
        return defer.reject(new ExceptionUserMessage("error", "An error has occured while reading auctions"));
      } else {
        return defer.resolve(result);
      }
    });
    return defer.promise;
  };

  Auction.prototype.doBid = function(inAuctionId, inUser) {
    return this.getById(inAuctionId).then((function(_this) {
      return function(auction) {
        var defer;
        console.log("++++++++++++++", auction.lastBidder.userId.toHexString(), inUser._id.toHexString());
        if (auction.lastBidder.userId.toHexString() !== inUser._id.toHexString()) {
          return _this._doBid(inAuctionId, inUser);
        } else {
          defer = Q.defer();
          defer.resolve(auction);
          return defer.promise;
        }
      };
    })(this));
  };

  Auction.prototype._doBid = function(inAuctionId, inUser) {
    var bidder, conditions, defer, options, update;
    defer = Q.defer();
    options = {};
    conditions = {
      "_id": inAuctionId
    };
    bidder = {
      userId: inUser.id,
      username: inUser.username
    };
    update = {
      $addToSet: {
        bidders: bidder
      },
      lastBidder: {
        userId: inUser._id,
        username: inUser.username
      },
      $inc: {
        currentPrice: 0.01
      }
    };
    this.getMongooseModel().update(conditions, update, options, function(err, affected) {
      if (err) {
        return defer.reject(new ExceptionUserMessage("error", "DB error"));
      } else {
        return defer.resolve(affected);
      }
    });
    return defer.promise.then((function(_this) {
      return function() {
        return _this.getById(inAuctionId);
      };
    })(this));
  };

  Auction.prototype.isEmailExist = function(inEmail, onComplete) {
    return this.getMongooseModel().findOne({
      'email': inEmail
    }).exec(function(err, result) {
      var isExist;
      isExist = result !== null;
      return onComplete(isExist);
    });
  };

  Auction.prototype.login = function(inEmail, inPassword, onComplete) {
    var crypto, password;
    crypto = require('crypto');
    password = crypto.createHash('md5').update(inPassword).digest("hex");
    return this.getMongooseModel().findOne({
      'email': inEmail,
      'password': password
    }, this._allowedFields).exec(function(err, result) {
      return onComplete(result);
    });
  };

  Auction.prototype.getByEmail = function(inEmail, onComplete) {
    return this.getMongooseModel().findOne({
      'email': inEmail
    }, this._allowedFields).exec(function(err, user) {
      var exception;
      if (!err) {
        return onComplete(err, user);
      } else {
        exception = new ExceptionUserMessage("error", "Unable to find user with email (" + inEmail + ")");
        return onComplete(err, exception);
      }
    });
  };

  Auction.prototype.saveCategory = function(userId, categoryData, onComplete) {
    return this.isCategoryExist(userId, categoryData.name, (function(_this) {
      return function(err, isExist) {
        var category, conditions, options, update;
        if (!isExist) {
          options = {};
          if (parseInt(categoryData.index) === -1) {
            conditions = {
              "_id": userId
            };
            category = {
              name: categoryData.name
            };
            update = {
              $addToSet: {
                linkCategories: category
              }
            };
          } else {
            conditions = {
              "$and": [
                {
                  "_id": userId
                }, {
                  "linkCategories._id": categoryData.index
                }
              ]
            };
            update = {
              $set: {
                "linkCategories.$.name": categoryData.name
              }
            };
          }
          return _this.getMongooseModel().update(conditions, update, options, function(err, affected) {
            if (!err) {
              return onComplete(err, affected);
            } else {
              return onComplete(true, new ExceptionUserMessage("error", "Category " + categoryData.name + " already exist"));
            }
          });
        } else {
          return onComplete(true, new ExceptionUserMessage("error", "Category " + categoryData.name + " already exist"));
        }
      };
    })(this));
  };

  Auction.prototype.deleteCategory = function(inUserId, inCategoryData, onComplete) {
    var conditions, update;
    conditions = {
      "$and": [
        {
          "_id": inUserId
        }, {
          "linkCategories._id": inCategoryData.index
        }
      ]
    };
    update = {
      $pull: {
        linkCategories: {
          _id: inCategoryData.index
        }
      }
    };
    return this.getMongooseModel().update(conditions, update, (function(_this) {
      return function(err, numberAffected) {
        return _this.getCategoriesByUserId(inUserId, onComplete);
      };
    })(this));
  };

  Auction.prototype.isCategoryExist = function(inUserId, inCategoryName, onComplete) {
    var conditions;
    conditions = {
      "$and": [
        {
          "_id": inUserId
        }, {
          'linkCategories.name': inCategoryName
        }
      ]
    };
    return this.getMongooseModel().findOne(conditions, "linkCategories").exec(function(err, result) {
      var isExist;
      isExist = result !== null;
      return onComplete(err, isExist);
    });
  };

  Auction.prototype.getCategoriesByUserId = function(inUserId, onComplete) {
    return this.getMongooseModel().findOne({
      '_id': inUserId
    }, "linkCategories").exec(function(err, result) {
      return onComplete(err, result.linkCategories);
    });
  };

  Auction.prototype.getCategoryByUserIdAndCatName = function(inUserId, inCategoryName, onComplete) {
    var conditions;
    conditions = {
      "$and": [
        {
          "_id": inUserId
        }, {
          'linkCategories.name': inCategoryName
        }
      ]
    };
    return this.getMongooseModel().findOne(conditions, "linkCategories").exec(function(err, result) {
      var cat, _i, _len, _ref, _results;
      _ref = result.linkCategories;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cat = _ref[_i];
        if (cat.name === inCategoryName) {
          onComplete(err, cat);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };

  Auction.prototype.saveLanguage = function(inUserId, inLangId, onComplete) {
    var conditions, options, update;
    conditions = {
      "_id": inUserId
    };
    update = {
      $set: {
        "languageId": inLangId
      }
    };
    options = {};
    return this.getMongooseModel().update(conditions, update, options, function(err, affected) {
      if (!err) {
        return onComplete(err, affected);
      } else {
        return onComplete(true, new ExceptionUserMessage("error", "Unable to save language id"));
      }
    });
  };

  Auction.prototype._saveUser = function(inUserData, onComplete) {
    var crypto, doc;
    inUserData['linkCategories'] = [
      {
        name: 'Default'
      }
    ];
    crypto = require('crypto');
    inUserData.password = crypto.createHash('md5').update(inUserData.password).digest("hex");
    doc = this.createMongooseDocument(inUserData);
    return doc.save(function(err) {
      var exception;
      exception = null;
      if (err) {
        exception = new ExceptionUserMessage("error", "unable to save");
      }
      return onComplete(err, exception);
    });
  };

  return Auction;

})(Model.Mongo);
