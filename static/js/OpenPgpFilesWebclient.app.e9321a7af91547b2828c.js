(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ "+x5O":
/*!******************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/Settings.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV");

module.exports = {
  ServerModuleName: 'OpenPgpFilesWebclient',
  HashModuleName: 'openpgp-files',
  SelfDestructMessageHash: 'self-destruct',
  ProductName: '',
  EnableSelfDestructingMessages: true,
  EnablePublicLinkLifetime: true,
  PublicFileData: {},

  /**
   * Initializes settings from AppData object sections.
   * 
   * @param {Object} oAppData Object contained modules settings.
   */
  init: function init(oAppData) {
    var oAppDataOpenPgpFilesSection = oAppData[this.ServerModuleName],
        oAppDataCoreSection = oAppData['Core'];

    if (!_.isEmpty(oAppDataOpenPgpFilesSection)) {
      this.EnableSelfDestructingMessages = Types.pBool(oAppDataOpenPgpFilesSection.EnableSelfDestructingMessages, this.EnableSelfDestructingMessages);
      this.EnablePublicLinkLifetime = Types.pBool(oAppDataOpenPgpFilesSection.EnablePublicLinkLifetime, this.EnablePublicLinkLifetime);
      this.PublicFileData = Types.pObject(oAppDataOpenPgpFilesSection.PublicFileData, this.PublicFileData);
    }

    if (!_.isEmpty(oAppDataCoreSection)) {
      this.ProductName = Types.pString(oAppDataCoreSection.ProductName, this.ProductName);
    }
  }
};

/***/ }),

/***/ 0:
/*!******************************!*\
  !*** min-document (ignored) ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "1kFK":
/*!**********************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/utils/Errors.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    ErrorsUtils = {};
/**
 * @param {Object} oRes
 * @param {string} sPgpAction
 * @param {string=} sDefaultError
 */


ErrorsUtils.showPgpErrorByCode = function (oRes, sPgpAction, sDefaultError) {
  var aErrors = _.isArray(oRes.errors) ? oRes.errors : [],
      aNotices = _.isArray(oRes.notices) ? oRes.notices : [],
      aEmailsWithoutPublicKey = [],
      aEmailsWithoutPrivateKey = [],
      sError = '',
      bNoSignDataNotice = false,
      bNotice = true;

  _.each(_.union(aErrors, aNotices), function (aError) {
    if (aError.length === 2) {
      switch (aError[0]) {
        case Enums.OpenPgpErrors.GenerateKeyError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_GENERATE_KEY');
          break;

        case Enums.OpenPgpErrors.ImportKeyError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_IMPORT_KEY');
          break;

        case Enums.OpenPgpErrors.ImportNoKeysFoundError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_IMPORT_NO_KEY_FOUND');
          break;

        case Enums.OpenPgpErrors.PrivateKeyNotFoundError:
        case Enums.OpenPgpErrors.PrivateKeyNotFoundNotice:
          aEmailsWithoutPrivateKey.push(aError[1]);
          break;

        case Enums.OpenPgpErrors.PublicKeyNotFoundError:
          bNotice = false;
          aEmailsWithoutPublicKey.push(aError[1]);
          break;

        case Enums.OpenPgpErrors.PublicKeyNotFoundNotice:
          aEmailsWithoutPublicKey.push(aError[1]);
          break;

        case Enums.OpenPgpErrors.KeyIsNotDecodedError:
          if (sPgpAction === Enums.PgpAction.DecryptVerify) {
            sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_DECRYPT') + ' ' + TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_KEY_NOT_DECODED', {
              'USER': aError[1]
            });
          } else if (sPgpAction === Enums.PgpAction.Sign || sPgpAction === Enums.PgpAction.EncryptSign) {
            sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_SIGN') + ' ' + TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_KEY_NOT_DECODED', {
              'USER': aError[1]
            });
          } else {
            sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_KEY_NOT_DECODED', {
              'USER': aError[1]
            });
          }

          break;

        case Enums.OpenPgpErrors.SignError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_SIGN');
          break;

        case Enums.OpenPgpErrors.VerifyError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_VERIFY');
          break;

        case Enums.OpenPgpErrors.EncryptError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_ENCRYPT');
          break;

        case Enums.OpenPgpErrors.DecryptError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_DECRYPT');
          break;

        case Enums.OpenPgpErrors.PasswordDecryptError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_PASSWORD_DECRYPT');
          break;

        case Enums.OpenPgpErrors.SignAndEncryptError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_ENCRYPT_OR_SIGN');
          break;

        case Enums.OpenPgpErrors.VerifyAndDecryptError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_DECRYPT_OR_VERIFY');
          break;

        case Enums.OpenPgpErrors.DeleteError:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_DELETE_KEY');
          break;

        case Enums.OpenPgpErrors.VerifyErrorNotice:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_VERIFY');
          break;

        case Enums.OpenPgpErrors.NoSignDataNotice:
          bNoSignDataNotice = true;
          break;

        case Enums.OpenPgpErrors.CanNotReadMessage:
          sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_CAN_NOT_READ_MESSAGE');
          break;

        default:
          sError = TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN');
      }
    }
  });

  if (aEmailsWithoutPublicKey.length > 0) {
    aEmailsWithoutPublicKey = _.without(aEmailsWithoutPublicKey, '');

    if (aEmailsWithoutPublicKey.length > 0) {
      sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_NO_PUBLIC_KEYS_FOR_USERS_PLURAL', {
        'USERS': aEmailsWithoutPublicKey.join(', ')
      }, null, aEmailsWithoutPublicKey.length);
    } else if (sPgpAction === Enums.PgpAction.Verify) {
      sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_NO_PUBLIC_KEY_FOUND_FOR_VERIFY');
    }

    if (bNotice && sError !== '') {
      sError += ' ' + TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_MESSAGE_WAS_NOT_VERIFIED');
    }
  } else if (aEmailsWithoutPrivateKey.length > 0) {
    aEmailsWithoutPrivateKey = _.without(aEmailsWithoutPrivateKey, '');

    if (aEmailsWithoutPrivateKey.length > 0) {
      sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_NO_PRIVATE_KEYS_FOR_USERS_PLURAL', {
        'USERS': aEmailsWithoutPrivateKey.join(', ')
      }, null, aEmailsWithoutPrivateKey.length);
    } else if (sPgpAction === Enums.PgpAction.DecryptVerify) {
      sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_NO_PRIVATE_KEY_FOUND_FOR_DECRYPT');
    }
  }

  if (sError === '' && !bNoSignDataNotice) {
    switch (sPgpAction) {
      case Enums.PgpAction.Generate:
        sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_GENERATE_KEY');
        break;

      case Enums.PgpAction.Import:
        sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_IMPORT_KEY');
        break;

      case Enums.PgpAction.DecryptVerify:
        sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_DECRYPT');
        break;

      case Enums.PgpAction.Verify:
        sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_VERIFY');
        break;

      case Enums.PgpAction.Encrypt:
        sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_ENCRYPT');
        break;

      case Enums.PgpAction.EncryptSign:
        sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_ENCRYPT_OR_SIGN');
        break;

      case Enums.PgpAction.Sign:
        sError = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_SIGN');
        break;
    }
  }

  if (sError === '' && sDefaultError) {
    sError = sDefaultError;
  }

  if (sError === '') {
    sError = TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN');
  }

  if (sError !== '') {
    Screens.showError(sError);
  }

  return bNoSignDataNotice;
};

module.exports = ErrorsUtils;

/***/ }),

/***/ "3kVj":
/*!*******************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/styles/vendors/video-js.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js!./video-js.css */ "KAUg");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(/*! ../../../../node_modules/style-loader/addStyles.js */ "ZuTH")(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "3vk+":
/*!***************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/popups/SharePopup.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
    Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    ErrorsUtils = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/utils/Errors.js */ "1kFK"),
    ShowHistoryPopup = ModulesManager.run('ActivityHistory', 'getShowHistoryPopup'),
    OpenPgpEncryptor = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpEncryptor');
/**
 * @constructor
 */


function CSharePopup() {
  var _this = this;

  CAbstractPopup.call(this);
  this.item = null;
  this.publicLink = ko.observable('');
  this.password = ko.observable('');
  this.publicLinkFocus = ko.observable(false);
  this.isRemovingPublicLink = ko.observable(false);
  this.keys = ko.observableArray([]);
  this.recipientAutocomplete = ko.observable('');
  this.recipientAutocompleteItem = ko.observable(null);
  this.isEmailEncryptionAvailable = ko.observable(false);
  this.sendLinkHintText = ko.observable('');
  this.linkLabel = ko.computed(function () {
    if (this.password()) {
      return TextUtils.i18n('OPENPGPFILESWEBCLIENT/LABEL_PROTECTED_PUBLIC_LINK');
    }

    return TextUtils.i18n('OPENPGPFILESWEBCLIENT/LABEL_PUBLIC_LINK');
  }, this);
  this.signEmailHintText = ko.observable(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_EMAIL'));
  this.sign = ko.observable(false);
  this.isPrivateKeyAvailable = ko.observable(false);
  this.isSigningAvailable = ko.observable(false);
  this.sUserEmail = '';
  this.recipientAutocompleteItem.subscribe(function (oItem) {
    if (oItem) {
      var sHint = TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SEND_LINK');

      if (oItem.hasKey) {
        if (_this.password()) {
          sHint = TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SEND_LINK_AND_PASSWORD');

          _this.isEmailEncryptionAvailable(true);
        } else {
          _this.isEmailEncryptionAvailable(false);
        }

        if (_this.isPrivateKeyAvailable() && _this.isEmailEncryptionAvailable()) {
          sHint = TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SEND_LINK_AND_PASSWORD_SIGNED');

          _this.isSigningAvailable(true);

          _this.sign(true);
        }
      } else {
        _this.isEmailEncryptionAvailable(false);

        if (_this.password()) {
          sHint = TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SEND_DIFFERENT_CHANNEL');
        }

        _this.isSigningAvailable(false);

        _this.sign(false);
      }

      _this.sendLinkHintText(sHint);
    } else {
      _this.isSigningAvailable(false);

      _this.sign(false);
    }
  });
  this.sign.subscribe(function (bSign) {
    if (bSign) {
      _this.signEmailHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SIGN_EMAIL'));

      _this.sendLinkHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SEND_LINK_AND_PASSWORD_SIGNED'));
    } else {
      _this.signEmailHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_EMAIL'));

      _this.sendLinkHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SEND_LINK_AND_PASSWORD'));
    }
  });
  this.composeMessageWithData = ModulesManager.run('MailWebclient', 'getComposeMessageWithData');
  this.bAllowShowHistory = !!ShowHistoryPopup;
  this.addButtons = ko.observableArray([]);
}

_.extendOwn(CSharePopup.prototype, CAbstractPopup.prototype);

CSharePopup.prototype.PopupTemplate = 'OpenPgpFilesWebclient_SharePopup';
/**
 * @param {Object} oItem
 */

CSharePopup.prototype.onOpen = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(oItem) {
    var aPrivateKeys, oParams;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.item = oItem;
            this.publicLink('');
            this.password('');

            if (!(this.item.published() && this.item.oExtendedProps && this.item.oExtendedProps.PublicLink)) {
              _context.next = 18;
              break;
            }

            this.publicLink(UrlUtils.getAppPath() + this.item.oExtendedProps.PublicLink);
            this.publicLinkFocus(true);
            this.password(this.item.oExtendedProps.PasswordForSharing ? this.item.oExtendedProps.PasswordForSharing : '');
            _context.next = 9;
            return OpenPgpEncryptor.oPromiseInitialised;

          case 9:
            this.keys(OpenPgpEncryptor.getKeys());
            this.sUserEmail = App.currentAccountEmail ? App.currentAccountEmail() : '';
            aPrivateKeys = OpenPgpEncryptor.findKeysByEmails([this.sUserEmail], false);

            if (aPrivateKeys.length > 0) {
              this.isPrivateKeyAvailable(true);
            } else {
              this.isPrivateKeyAvailable(false);
            }

            oParams = {
              AddButtons: [],
              Item: oItem
            };
            App.broadcastEvent('OpenPgpFilesWebclient::OpenSharePopup::after', oParams);
            this.addButtons(oParams.AddButtons);
            _context.next = 19;
            break;

          case 18:
            Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_GET_PUBLIC_LINK'));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

CSharePopup.prototype.cancelPopup = function () {
  this.clearPopup();
  this.closePopup();
};

CSharePopup.prototype.clearPopup = function () {
  this.recipientAutocompleteItem(null);
  this.recipientAutocomplete('');
  this.sign(false);
  this.isEmailEncryptionAvailable(false);
  this.sUserEmail = '';
};

CSharePopup.prototype.onCancelSharingClick = function () {
  if (this.item) {
    this.isRemovingPublicLink(true);
    Ajax.send('Files', 'DeletePublicLink', {
      'Type': this.item.storageType(),
      'Path': this.item.path(),
      'Name': this.item.fileName()
    }, this.onCancelSharingResponse, this);
  }
};

CSharePopup.prototype.onCancelSharingResponse = function (oResponse, oRequest) {
  this.isRemovingPublicLink(false);

  if (oResponse.Result) {
    this.item.published(false);
    this.item.oExtendedProps.PublicLink = null;

    if (this.item.oExtendedProps.PasswordForSharing) {
      this.item.oExtendedProps.PasswordForSharing = null;
    }

    this.cancelPopup();
  } else {
    Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_DELETE_PUBLIC_LINK'));
  }
};
/**
 * @param {object} oRequest
 * @param {function} fResponse
 */


CSharePopup.prototype.autocompleteCallback = function (oRequest, fResponse) {
  var _this2 = this;

  var fAutocompleteCallback = ModulesManager.run('ContactsWebclient', 'getSuggestionsAutocompleteCallback', ['all', App.getUserPublicId(),
  /*bWithGroups*/
  false]);

  var fMarkRecipientsWithKeyCallback = function fMarkRecipientsWithKeyCallback(aRecipienstList) {
    var aPublicKeys = _this2.getPublicKeys();

    var iOwnPublicKeyIndex = aPublicKeys.indexOf(App.getUserPublicId());

    if (iOwnPublicKeyIndex > -1) {
      //remove own public key from list
      aPublicKeys.splice(iOwnPublicKeyIndex, 1);
    }

    aRecipienstList.forEach(function (oRecipient) {
      var iIndex = aPublicKeys.indexOf(oRecipient.email);

      if (iIndex > -1) {
        oRecipient.hasKey = true; //remove key from list when recipient is marked

        aPublicKeys.splice(iIndex, 1);
      } else {
        oRecipient.hasKey = false;
      }
    });
    aPublicKeys.forEach(function (sPublicKey) {
      var aKeys = OpenPgpEncryptor.getPublicKeysIfExistsByEmail(sPublicKey);

      if (aKeys && aKeys[0]) {
        aRecipienstList.push({
          label: aKeys[0].getUser(),
          value: aKeys[0].getUser(),
          name: aKeys[0].getUser(),
          email: aKeys[0].getEmail(),
          frequency: 0,
          id: 0,
          team: false,
          sharedToAll: false,
          hasKey: true
        });
      }
    });
    fResponse(aRecipienstList);
  };

  if (_.isFunction(fAutocompleteCallback)) {
    this.recipientAutocompleteItem(null);
    fAutocompleteCallback(oRequest, fMarkRecipientsWithKeyCallback);
  }
};

CSharePopup.prototype.getPublicKeys = function () {
  var aPublicKeys = this.keys().filter(function (oKey) {
    return oKey.isPublic();
  });
  return aPublicKeys.map(function (oKey) {
    return oKey.getEmail();
  });
};

CSharePopup.prototype.sendEmail = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var sSubject, sBody, OpenPgpResult, sEncryptedBody, _sBody;

  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          sSubject = TextUtils.i18n('OPENPGPFILESWEBCLIENT/PUBLIC_LINK_MESSAGE_SUBJECT', {
            'FILENAME': this.item.fileName()
          });

          if (!(this.recipientAutocompleteItem().hasKey && this.isEmailEncryptionAvailable())) {
            _context2.next = 10;
            break;
          }

          //message is encrypted
          sBody = '';

          if (this.password()) {
            sBody = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ENCRYPTED_LINK_MESSAGE_BODY_WITH_PASSWORD', {
              'URL': this.publicLink(),
              'BR': '\r\n',
              'PASSWORD': this.password()
            });
          } else {
            sBody = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ENCRYPTED_LINK_MESSAGE_BODY', {
              'URL': this.publicLink(),
              'BR': '\r\n'
            });
          }

          _context2.next = 6;
          return OpenPgpEncryptor.encryptMessage(sBody, this.recipientAutocompleteItem().email, this.sign(), '', this.sUserEmail);

        case 6:
          OpenPgpResult = _context2.sent;

          if (OpenPgpResult && OpenPgpResult.result) {
            sEncryptedBody = OpenPgpResult.result;
            this.composeMessageWithData({
              to: this.recipientAutocompleteItem().value,
              subject: sSubject,
              body: sEncryptedBody,
              isHtml: false
            });
            this.cancelPopup();
          } else if (!OpenPgpResult || !OpenPgpResult.userCanceled) {
            ErrorsUtils.showPgpErrorByCode(OpenPgpResult, Enums.PgpAction.Encrypt);
          }

          _context2.next = 13;
          break;

        case 10:
          //message is not encrypted
          _sBody = TextUtils.i18n('OPENPGPFILESWEBCLIENT/LINK_MESSAGE_BODY', {
            'URL': this.publicLink()
          });
          this.composeMessageWithData({
            to: this.recipientAutocompleteItem().value,
            subject: sSubject,
            body: _sBody,
            isHtml: true
          });
          this.cancelPopup();

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));

CSharePopup.prototype.showHistory = function () {
  if (this.bAllowShowHistory) {
    Popups.showPopup(ShowHistoryPopup, [TextUtils.i18n('OPENPGPFILESWEBCLIENT/HEADING_HISTORY_POPUP'), this.item]);
  }
};

module.exports = new CSharePopup();

/***/ }),

/***/ "42lS":
/*!***********************************************************!*\
  !*** ./modules/CoreWebclient/js/popups/EmbedHtmlPopup.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF")
;

/**
 * @constructor
 */
function CEmbedHtmlPopup()
{
	CAbstractPopup.call(this);
	
	this.htmlEmbed = ko.observable('');
}

_.extendOwn(CEmbedHtmlPopup.prototype, CAbstractPopup.prototype);

CEmbedHtmlPopup.prototype.PopupTemplate = 'CoreWebclient_EmbedHtmlPopup';

CEmbedHtmlPopup.prototype.onOpen = function (sHtmlEmbed)
{
	this.htmlEmbed(sHtmlEmbed);
};

CEmbedHtmlPopup.prototype.close = function ()
{
	this.closePopup();
	this.htmlEmbed('');
};

module.exports = new CEmbedHtmlPopup();

/***/ }),

/***/ "5hOJ":
/*!*******************************************************!*\
  !*** ./modules/CoreWebclient/js/models/CDateModel.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	moment = __webpack_require__(/*! moment */ "wd/R"),
			
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3")
;

/**
 * @constructor
 */
function CDateModel()
{
	this.iTimeStampInUTC = 0;
	this.oMoment = null;
}

/**
 * @param {number} iTimeStampInUTC
 */
CDateModel.prototype.parse = function (iTimeStampInUTC)
{
	this.iTimeStampInUTC = iTimeStampInUTC;
	this.oMoment = moment.unix(this.iTimeStampInUTC);
};

/**
 * @param {number} iYear
 * @param {number} iMonth
 * @param {number} iDay
 */
CDateModel.prototype.setDate = function (iYear, iMonth, iDay)
{
	this.oMoment = moment([iYear, iMonth, iDay]);
};

/**
 * @return {string}
 */
CDateModel.prototype.getTimeFormat = function ()
{
	return (UserSettings.timeFormat() === window.Enums.TimeFormat.F24) ? 'HH:mm' : 'hh:mm A';
};

/**
 * @return {string}
 */
CDateModel.prototype.getFullDate = function ()
{
	return this.getDate() + ' ' + this.getTime();	
};

/**
 * @return {string}
 */
CDateModel.prototype.getMidDate = function ()
{
	return this.getShortDate(true);
};

/**
 * @param {boolean=} bTime = false
 * 
 * @return {string}
 */
CDateModel.prototype.getShortDate = function (bTime)
{
	var
		sResult = '',
		oMomentNow = null
	;

	if (this.oMoment)
	{
		oMomentNow = moment();

		if (oMomentNow.format('L') === this.oMoment.format('L'))
		{
			sResult = this.oMoment.format(this.getTimeFormat());
		}
		else
		{
			if (oMomentNow.clone().subtract(1, 'days').format('L') === this.oMoment.format('L'))
			{
				sResult = TextUtils.i18n('COREWEBCLIENT/LABEL_YESTERDAY');
			}
			else
			{
				if (UserSettings.UserSelectsDateFormat)
				{
					sResult = this.oMoment.format(Utils.getDateFormatForMoment(UserSettings.dateFormat()));
				}
				else
				{
					if (oMomentNow.year() === this.oMoment.year())
					{
						sResult = this.oMoment.format('MMM D');
					}
					else
					{
						sResult = this.oMoment.format('MMM D, YYYY');
					}
				}
			}

			if (!!bTime)
			{
				sResult += ', ' + this.oMoment.format(this.getTimeFormat());
			}
		}
	}

	return sResult;
};

/**
 * @return {string}
 */
CDateModel.prototype.getDate = function ()
{
	var sFormat = 'ddd, MMM D, YYYY';
	
	if (UserSettings.UserSelectsDateFormat)
	{
		sFormat = 'ddd, ' + Utils.getDateFormatForMoment(UserSettings.dateFormat());
	}
	
	return (this.oMoment) ? this.oMoment.format(sFormat) : '';
};

/**
 * @return {string}
 */
CDateModel.prototype.getTime = function ()
{
	return (this.oMoment) ? this.oMoment.format(this.getTimeFormat()): '';
};

/**
 * @return {number}
 */
CDateModel.prototype.getTimeStampInUTC = function ()
{
	return this.iTimeStampInUTC;
};

module.exports = CDateModel;


/***/ }),

/***/ "9w3v":
/*!**************************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/popups/CreatePublicLinkPopup.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    SharePopup = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/popups/SharePopup.js */ "3vk+"),
    OpenPgpFileProcessor = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/OpenPgpFileProcessor.js */ "Xu4A"),
    Settings = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/Settings.js */ "+x5O");
/**
 * @constructor
 */


function CCreatePublicLinkPopup() {
  CAbstractPopup.call(this);
  this.oItem = null;
  this.isFolder = ko.observable(false);
  this.oFilesView = null;
  this.encryptPublicLink = ko.observable(false);
  this.allowLifetime = ko.computed(function () {
    return Settings.EnablePublicLinkLifetime && this.encryptPublicLink();
  }, this);
  this.isCreatingPublicLink = ko.observable(false);
  this.selectedLifetimeHrs = ko.observable(null);
  this.lifetime = ko.observableArray([{
    label: TextUtils.i18n('OPENPGPFILESWEBCLIENT/OPTION_LIFE_TIME_ETERNAL'),
    value: 0
  }, {
    label: "24 " + TextUtils.i18n('OPENPGPFILESWEBCLIENT/OPTION_LIFE_TIME_HOURS'),
    value: 24
  }, {
    label: "72 " + TextUtils.i18n('OPENPGPFILESWEBCLIENT/OPTION_LIFE_TIME_HOURS'),
    value: 72
  }, {
    label: "7 " + TextUtils.i18n('OPENPGPFILESWEBCLIENT/OPTION_LIFE_TIME_DAYS'),
    value: 7 * 24
  }]);
}

_.extendOwn(CCreatePublicLinkPopup.prototype, CAbstractPopup.prototype);

CCreatePublicLinkPopup.prototype.PopupTemplate = 'OpenPgpFilesWebclient_CreatePublicLinkPopup';

CCreatePublicLinkPopup.prototype.onOpen = function (oItem, oFilesView) {
  this.oItem = oItem;
  this.oFilesView = oFilesView;
  this.selectedLifetimeHrs(0);
  this.isFolder(this.oItem && !this.oItem.IS_FILE);
};

CCreatePublicLinkPopup.prototype.cancelPopup = function () {
  this.clearPopup();
  this.closePopup();
};

CCreatePublicLinkPopup.prototype.clearPopup = function () {
  this.oItem = null;
  this.oFilesView = null;
  this.encryptPublicLink(false);
};

CCreatePublicLinkPopup.prototype.createPublicLink = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var oPublicLinkResult;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          this.isCreatingPublicLink(true);
          _context.next = 3;
          return OpenPgpFileProcessor.createPublicLink(this.oItem.storageType(), this.oItem.path(), this.oItem.fileName(), this.oItem.IS_FILE ? this.oItem.size() : 0, this.encryptPublicLink(), '', '', this.selectedLifetimeHrs(), !this.oItem.IS_FILE);

        case 3:
          oPublicLinkResult = _context.sent;
          this.isCreatingPublicLink(false);

          if (oPublicLinkResult.result && oPublicLinkResult.link) {
            this.oItem.published(true);
            this.oItem.oExtendedProps.PublicLink = oPublicLinkResult.link;

            if (oPublicLinkResult.password) {
              this.oItem.oExtendedProps.PasswordForSharing = oPublicLinkResult.password;
            }

            Popups.showPopup(SharePopup, [this.oItem]);
            this.cancelPopup();
          } else {
            Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_CREATE_PUBLIC_LINK'));
          }

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));
module.exports = new CCreatePublicLinkPopup();

/***/ }),

/***/ "KAUg":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./modules/OpenPgpFilesWebclient/styles/vendors/video-js.css ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "JPst")(false);
// Module
exports.push([module.i, "@charset \"UTF-8\";\n.vjs-modal-dialog .vjs-modal-dialog-content, .video-js .vjs-modal-dialog, .vjs-button > .vjs-icon-placeholder:before, .video-js .vjs-big-play-button .vjs-icon-placeholder:before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.vjs-button > .vjs-icon-placeholder:before, .video-js .vjs-big-play-button .vjs-icon-placeholder:before {\n  text-align: center;\n}\n\n@font-face {\n  font-family: VideoJS;\n  src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABDkAAsAAAAAG6gAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAPgAAAFZRiV3hY21hcAAAAYQAAADaAAADPv749/pnbHlmAAACYAAAC3AAABHQZg6OcWhlYWQAAA3QAAAAKwAAADYZw251aGhlYQAADfwAAAAdAAAAJA+RCLFobXR4AAAOHAAAABMAAACM744AAGxvY2EAAA4wAAAASAAAAEhF6kqubWF4cAAADngAAAAfAAAAIAE0AIFuYW1lAAAOmAAAASUAAAIK1cf1oHBvc3QAAA/AAAABJAAAAdPExYuNeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS7wTiBgZWBgaWQ5RkDA8MvCM0cwxDOeI6BgYmBlZkBKwhIc01hcPjI+FGJHcRdyA4RZgQRADK3CxEAAHic7dFZbsMgAEXRS0ycyZnnOeG7y+qC8pU1dHusIOXxuoxaOlwZYWQB0Aea4quIEN4E9LzKbKjzDeM6H/mua6Lmc/p8yhg0lvdYx15ZG8uOLQOGjMp3EzqmzJizYMmKNRu27Nhz4MiJMxeu3Ljz4Ekqm7T8P52G8PP3lnTOVk++Z6iN6QZzNN1F7ptuN7eGOjDUoaGODHVsuvU8MdTO9Hd5aqgzQ50b6sJQl4a6MtS1oW4MdWuoO0PdG+rBUI+GejLUs6FeDPVqqDdDvRvqw1CfhpqM9At0iFLaAAB4nJ1YDXBTVRZ+5/22TUlJ8we0pHlJm7RJf5O8F2j6EymlSPkpxaL8U2xpa3DKj0CBhc2IW4eWKSokIoLsuMqssM64f+jA4HSdWXXXscBq67IOs3FXZ1ZYWVyRFdo899yXtIBQZ90k7717zz3v3HPPOfd854YCCj9cL9dL0RQFOqCbGJnrHb5EayiKIWN8iA/hWBblo6hUWm8TtCDwE80WMJus/irwyxOdxeB0MDb14VNJHnXYoLLSl6FfCUYO9nYPTA8Epg9090LprfbBbZ2hY0UlJUXHQp3/vtWkS6EBv8+rPMq5u9692f/dNxJNiqwC1xPE9TCUgCsSdQWgE3XQD25lkG4CN2xmTcOXWBOyser6RN6KnGbKSbmQ3+d0OI1m2W8QzLLkI2sykrWAgJJEtA8vGGW/2Q+CmT3n8zS9wZwu2DCvtuZKZN3xkrLh36yCZuUomQSqGpY8t/25VfHVhw8z4ebGBtfLb0ya9PCaDc+8dGTvk2dsh6z7WzvowlXKUSWo9MJ15a3KrEP2loOr2Ojhw6iW6hf2BDdEccQvZGpaAy7YovSwq8kr7HGllxpd71rkS6G0Sf11sl9OvMK1+jwPPODxjUwkOim9CU3ix1wNjXDfmJSEn618Bs6lpWwUpU+8PCqLMY650zjq8VhCIP17NEKTx3eaLL+s5Pi6yJWaWjTHLR1jYzPSV9VF/6Ojdb/1kO3Mk3uhHC0x6gc1BjlKQ+nQFxTYdaJkZ7ySVxLBbhR1dsboNXp1tCYKW2LRaEzpYcIx2BKNxaL0ZaUnSqfFoiNhHKR/GkX6PWUSAaJelQaqZL1EpoHNsajSEyPSoJ9IjhIxTdjHLmwZvhRDOiFTY/YeQnvrVZmiTQtGncECXtFTBZLOVwwMRgoXHAkXzMzPn1nAJJ8jYSbMDaqN2waGLzNhih/bZynUBMpIWSg7VYi7DRx2m8ALkIdRCJwI6ArJx2EI8kaDWeTQKeAFk9fjl/1AvwktjQ1P7NjyMGQyfd4vjipX6M/i52D7Cq80kqlcxEcGXRr/FEcgs0u5uGgB4VWuMFfpdn2Re6Hi3PqzmxWKsz6+ae2Pn9hXXw/fqM859UiGC0oKYYILJBqJrsn1Z1E5qOs9rQCiUQRREjm8yJcbHF5cUJufX1vAHlefw0XgUoboS3ETfQlTxBC4SOtuE8VPRJTBSCQSjZCpk7Gqzu+masaZ2y7Zjehho4F3g82BNDkAHpORG4+OCS+f6JTPmtRn/PH1kch6d04sp7AQb25aQ/pqUyXeQ8vrebG8OYQdXOQ+585u0sdW9rqalzRURiJ+9F4MweRFrKUjl1GUYhH1A27WOHw5cTFSFPMo9EeUIGnQTZHIaJ7AHLaOKsOODaNF9jkBjYG2QEsQ2xjMUAx2bBEbeTBWMHwskBjngq56S/yfgkBnWBa4K9sqKtq2t1UI8S9He5XuBRbawAdatrQEAi30Aks2+LM8WeCbalVZkWNylvJ+dqJnzVb+OHlSoKW8nPCP7Rd+CcZ2DdWAGqJ2CBFOphgywFFCFBNtfAbGtNPBCwxvygHeYMZMY9ZboBqwq/pVrsbgN5tkv152ODlbMfiqwGMBgxa4Exz3QhovRIUp6acqZmQzRq0ypDXS2TPLT02YIkQETnOE445oOGxOmXAqUJNNG7XgupMjPq2ua9asrj5yY/yuKteO1Kx0YNJTufrirLe1mZnat7OL6rnUdCWenpW6I8mAnbsY8KWs1PuSovCW9A/Z25PQ24a7cNOqgmTkLmBMgh4THgc4b9k2IVv1/g/F5nGljwPLfOgHAzJzh45V/4+WenTzmMtR5Z7us2Tys909UHqrPY7KbckoxRvRHhmVc3cJGE97uml0R1S0jdULVl7EvZtDFVBF35N9cEdjpgmAiOlFZ+Dtoh93+D3zzHr8RRNZQhnCNMNbcegOvpEwZoL+06cJQ07h+th3fZ/7PVbVC6ngTAV/KoLFuO6+2KFcU651gEb5ugPSIb1D+Xp8V4+k3sEIGnw5mYe4If4k1lFYr6SCzmM2EQ8iWtmwjnBI9kTwe1TlfAmXh7H02by9fW2gsjKwtv0aaURKil4OdV7rDL1MXIFNrhdxohcZXYTnq47WisrKitaObbf5+yvkLi5J6lCNZZ+B6GC38VNBZBDidSS/+mSvh6s+srgC8pyKMvDtt+de3c9fU76ZPfuM8ud4Kv0fyP/LqfepMT/3oZxSqpZaTa1DaQYLY8TFsHYbWYsPoRhRWfL5eSSQbhUGgGC3YLbVMk6PitTFNGpAsNrC6D1VNBKgBHMejaiuRWEWGgsSDBTJjqWIl8kJLlsaLJ2tXDr6xGfT85bM2Q06a46x2HTgvdnV8z5YDy/27J4zt6x2VtkzjoYpkq36kaBr4eQSg7tyiVweWubXZugtadl58ydapfbORfKsDTuZ0OBgx4cfdjCf5tbWNITnL120fdOi1RV1C3uKGzNdwYLcMvZ3BxoPyTOCD1XvXTp7U10gWCVmTV9b3r2z0SkGWovb2hp9I89O8a2smlyaO8muMU+dRmtzp60IzAoFpjLr1n388boLyf0dRvxhsHZ0qbWqDkwqvvpkj4l0fY6EIXRi5sQSrAvsVYwXRy4qJ2EVtD1AN7a0HWth9ymvL1xc3WTUKK/TAHA/bXDVtVWfOMfuGxGZv4Ln/jVr9jc3j1yMv0tndmyt9Vq88Y9gH1wtLX3KWjot5++jWHgAoZZkQ14wGQ20Fli71UmKJAy4xKMSTGbVdybW7FDDAut9XpD5AzWrYO7zQ8qffqF8+Ynd/clrHcdyxGy3a/3+mfNnzC/cBsveTjnTvXf1o6vzOlZw7WtqtdmPK/Errz/6NNtD72zmNOZfbmYdTGHfoofqI79Oc+R2n1lrnL6pOm0Up7kwxhTW12Amm7WYkXR2qYrF2AmgmbAsxZjwy1xpg/m1Je2vrp8v/nz2xpmlBg4E9hrMU341wVpTOh/OfmGvAnra8q6uctr60ZQHV3Q+WMQJykMj8ZsWn2QBOmmHMB+m5pDIpTFonYigiaKAhGEiAHF7EliVnQkjoLVIMPtJpBKHYd3A8GYH9jJzrWwmHx5Qjp7vDAX0suGRym1vtm/9W1/HyR8vczfMs6Sk8DSv855/5dlX9oQq52hT8syyp2rx5Id17IAyAM3wIjQPMOHzytEB64q6D5zT91yNbnx3V/nqnd017S9Y0605k3izoXLpsxde2n38yoOV9s1LcjwzNjbdX6asnBVaBj/6/DwKwPkpcqbDG7BnsXoSqWnUAmottYF6jMSdVyYZh3zVXCjwTiwwHH6sGuRiEHQGzuRX6whZkp123oy1BWE2mEfJ/tvIRtM4ZM5bDXiMsPMaAKOTyc5uL57rqyyc5y5JE5pm1i2S2iUX0CcaQ6lC6Zog7JqSqZmYlosl2K6pwNA84zRnQW6SaALYZQGW5lhCtU/W34N6o+bKfZ8cf3/Cl/+iTX3wBzpOY4mRkeNf3rptycGSshQWgGbYt5jFc2e0+DglIrwl6DVWQ7BuwaJ3Xk1J4VL5urnLl/Wf+gHU/hZoZdKNym6lG+I34FaNeZKcSpJIo2IeCVvpdsDGfKvzJnAwmeD37Ow65ZWwSowpgwX5T69s/rB55dP5BcpgDKFV8p7q2sn/1uc93bVzT/w6UrCqDTWvfCq/oCD/qZXNoUj8BL5Kp6GU017frfNXkAtiiyf/SOCEeLqnd8R/Ql9GlCRfctS6k5chvIBuQ1zCCjoCHL2DHNHIXxMJ3kQeO8lbsUXONeSfA5EjcG6/E+KdhN4bP04vBhdi883+BFBzQbxFbvZzQeY9LNBZc0FNfn5NwfDn6rCTnTw6R8o+gfpf5hCom33cRuiTlss3KHmZjD+BPN+5gXuA2ziS/Q73mLxUkpbKN/eqwz5uK0X9F3h2d1V4nGNgZGBgAOJd776+iue3+crAzc4AAje5Bfcg0xz9YHEOBiYQBQA8FQlFAHicY2BkYGBnAAGOPgaG//85+hkYGVCBMgBGGwNYAAAAeJxjYGBgYB8EmKOPgQEAQ04BfgAAAAAAAA4AaAB+AMwA4AECAUIBbAGYAcICGAJYArQC4AMwA7AD3gQwBJYE3AUkBWYFigYgBmYGtAbqB1gIEghYCG4IhAi2COh4nGNgZGBgUGYoZWBnAAEmIOYCQgaG/2A+AwAYCQG2AHicXZBNaoNAGIZfE5PQCKFQ2lUps2oXBfOzzAESyDKBQJdGR2NQR3QSSE/QE/QEPUUPUHqsvsrXjTMw83zPvPMNCuAWP3DQDAejdm1GjzwS7pMmwi75XngAD4/CQ/oX4TFe4Qt7uMMbOzjuDc0EmXCP/C7cJ38Iu+RP4QEe8CU8pP8WHmOPX2EPz87TPo202ey2OjlnQSXV/6arOjWFmvszMWtd6CqwOlKHq6ovycLaWMWVydXKFFZnmVFlZU46tP7R2nI5ncbi/dDkfDtFBA2DDXbYkhKc+V0Bqs5Zt9JM1HQGBRTm/EezTmZNKtpcAMs9Yu6AK9caF76zoLWIWcfMGOSkVduvSWechqZsz040Ib2PY3urxBJTzriT95lipz+TN1fmAAAAeJxtkMl2wjAMRfOAhABlKm2h80C3+ajgCKKDY6cegP59TYBzukAL+z1Zsq8ctaJTTKPrsUQLbXQQI0EXKXroY4AbDDHCGBNMcYsZ7nCPB8yxwCOe8IwXvOIN7/jAJ76wxHfUqWX+OzgumWAjJMV17i0Ndlr6irLKO+qftdT7i6y4uFSUvCknay+lFYZIZaQcmfH/xIFdYn98bqhra1aKTM/6lWMnyaYirx1rFUQZFBkb2zJUtoXeJCeg0WnLtHeSFc3OtrnozNwqi0TkSpBMDB1nSde5oJXW23hTS2/T0LilglXX7dmFVxLnq5U0vYATHFk3zX3BOisoQHNDFDeZnqKDy9hRNawN7Vh727hFzcJ5c8TILrKZfH7tIPxAFP0BpLeJPA==) format(\"woff\");\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-play, .video-js .vjs-play-control .vjs-icon-placeholder, .video-js .vjs-big-play-button .vjs-icon-placeholder:before {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-play:before, .video-js .vjs-play-control .vjs-icon-placeholder:before, .video-js .vjs-big-play-button .vjs-icon-placeholder:before {\n  content: \"\\f101\";\n}\n\n.vjs-icon-play-circle {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-play-circle:before {\n  content: \"\\f102\";\n}\n\n.vjs-icon-pause, .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-pause:before, .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder:before {\n  content: \"\\f103\";\n}\n\n.vjs-icon-volume-mute, .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-volume-mute:before, .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder:before {\n  content: \"\\f104\";\n}\n\n.vjs-icon-volume-low, .video-js .vjs-mute-control.vjs-vol-1 .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-volume-low:before, .video-js .vjs-mute-control.vjs-vol-1 .vjs-icon-placeholder:before {\n  content: \"\\f105\";\n}\n\n.vjs-icon-volume-mid, .video-js .vjs-mute-control.vjs-vol-2 .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-volume-mid:before, .video-js .vjs-mute-control.vjs-vol-2 .vjs-icon-placeholder:before {\n  content: \"\\f106\";\n}\n\n.vjs-icon-volume-high, .video-js .vjs-mute-control .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-volume-high:before, .video-js .vjs-mute-control .vjs-icon-placeholder:before {\n  content: \"\\f107\";\n}\n\n.vjs-icon-fullscreen-enter, .video-js .vjs-fullscreen-control .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-fullscreen-enter:before, .video-js .vjs-fullscreen-control .vjs-icon-placeholder:before {\n  content: \"\\f108\";\n}\n\n.vjs-icon-fullscreen-exit, .video-js.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-fullscreen-exit:before, .video-js.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder:before {\n  content: \"\\f109\";\n}\n\n.vjs-icon-square {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-square:before {\n  content: \"\\f10a\";\n}\n\n.vjs-icon-spinner {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-spinner:before {\n  content: \"\\f10b\";\n}\n\n.vjs-icon-subtitles, .video-js .vjs-subs-caps-button .vjs-icon-placeholder,\n.video-js.video-js:lang(en-GB) .vjs-subs-caps-button .vjs-icon-placeholder,\n.video-js.video-js:lang(en-IE) .vjs-subs-caps-button .vjs-icon-placeholder,\n.video-js.video-js:lang(en-AU) .vjs-subs-caps-button .vjs-icon-placeholder,\n.video-js.video-js:lang(en-NZ) .vjs-subs-caps-button .vjs-icon-placeholder, .video-js .vjs-subtitles-button .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-subtitles:before, .video-js .vjs-subs-caps-button .vjs-icon-placeholder:before,\n.video-js.video-js:lang(en-GB) .vjs-subs-caps-button .vjs-icon-placeholder:before,\n.video-js.video-js:lang(en-IE) .vjs-subs-caps-button .vjs-icon-placeholder:before,\n.video-js.video-js:lang(en-AU) .vjs-subs-caps-button .vjs-icon-placeholder:before,\n.video-js.video-js:lang(en-NZ) .vjs-subs-caps-button .vjs-icon-placeholder:before, .video-js .vjs-subtitles-button .vjs-icon-placeholder:before {\n  content: \"\\f10c\";\n}\n\n.vjs-icon-captions, .video-js:lang(en) .vjs-subs-caps-button .vjs-icon-placeholder,\n.video-js:lang(fr-CA) .vjs-subs-caps-button .vjs-icon-placeholder, .video-js .vjs-captions-button .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-captions:before, .video-js:lang(en) .vjs-subs-caps-button .vjs-icon-placeholder:before,\n.video-js:lang(fr-CA) .vjs-subs-caps-button .vjs-icon-placeholder:before, .video-js .vjs-captions-button .vjs-icon-placeholder:before {\n  content: \"\\f10d\";\n}\n\n.vjs-icon-chapters, .video-js .vjs-chapters-button .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-chapters:before, .video-js .vjs-chapters-button .vjs-icon-placeholder:before {\n  content: \"\\f10e\";\n}\n\n.vjs-icon-share {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-share:before {\n  content: \"\\f10f\";\n}\n\n.vjs-icon-cog {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-cog:before {\n  content: \"\\f110\";\n}\n\n.vjs-icon-circle, .vjs-seek-to-live-control .vjs-icon-placeholder, .video-js .vjs-volume-level, .video-js .vjs-play-progress {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-circle:before, .vjs-seek-to-live-control .vjs-icon-placeholder:before, .video-js .vjs-volume-level:before, .video-js .vjs-play-progress:before {\n  content: \"\\f111\";\n}\n\n.vjs-icon-circle-outline {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-circle-outline:before {\n  content: \"\\f112\";\n}\n\n.vjs-icon-circle-inner-circle {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-circle-inner-circle:before {\n  content: \"\\f113\";\n}\n\n.vjs-icon-hd {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-hd:before {\n  content: \"\\f114\";\n}\n\n.vjs-icon-cancel, .video-js .vjs-control.vjs-close-button .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-cancel:before, .video-js .vjs-control.vjs-close-button .vjs-icon-placeholder:before {\n  content: \"\\f115\";\n}\n\n.vjs-icon-replay, .video-js .vjs-play-control.vjs-ended .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-replay:before, .video-js .vjs-play-control.vjs-ended .vjs-icon-placeholder:before {\n  content: \"\\f116\";\n}\n\n.vjs-icon-facebook {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-facebook:before {\n  content: \"\\f117\";\n}\n\n.vjs-icon-gplus {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-gplus:before {\n  content: \"\\f118\";\n}\n\n.vjs-icon-linkedin {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-linkedin:before {\n  content: \"\\f119\";\n}\n\n.vjs-icon-twitter {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-twitter:before {\n  content: \"\\f11a\";\n}\n\n.vjs-icon-tumblr {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-tumblr:before {\n  content: \"\\f11b\";\n}\n\n.vjs-icon-pinterest {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-pinterest:before {\n  content: \"\\f11c\";\n}\n\n.vjs-icon-audio-description, .video-js .vjs-descriptions-button .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-audio-description:before, .video-js .vjs-descriptions-button .vjs-icon-placeholder:before {\n  content: \"\\f11d\";\n}\n\n.vjs-icon-audio, .video-js .vjs-audio-button .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-audio:before, .video-js .vjs-audio-button .vjs-icon-placeholder:before {\n  content: \"\\f11e\";\n}\n\n.vjs-icon-next-item {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-next-item:before {\n  content: \"\\f11f\";\n}\n\n.vjs-icon-previous-item {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-previous-item:before {\n  content: \"\\f120\";\n}\n\n.vjs-icon-picture-in-picture-enter, .video-js .vjs-picture-in-picture-control .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-picture-in-picture-enter:before, .video-js .vjs-picture-in-picture-control .vjs-icon-placeholder:before {\n  content: \"\\f121\";\n}\n\n.vjs-icon-picture-in-picture-exit, .video-js.vjs-picture-in-picture .vjs-picture-in-picture-control .vjs-icon-placeholder {\n  font-family: VideoJS;\n  font-weight: normal;\n  font-style: normal;\n}\n.vjs-icon-picture-in-picture-exit:before, .video-js.vjs-picture-in-picture .vjs-picture-in-picture-control .vjs-icon-placeholder:before {\n  content: \"\\f122\";\n}\n\n.video-js {\n  display: block;\n  vertical-align: top;\n  box-sizing: border-box;\n  color: #fff;\n  background-color: #000;\n  position: relative;\n  padding: 0;\n  font-size: 10px;\n  line-height: 1;\n  font-weight: normal;\n  font-style: normal;\n  font-family: Arial, Helvetica, sans-serif;\n  word-break: initial;\n}\n.video-js:-moz-full-screen {\n  position: absolute;\n}\n.video-js:-webkit-full-screen {\n  width: 100% !important;\n  height: 100% !important;\n}\n\n.video-js[tabindex=\"-1\"] {\n  outline: none;\n}\n\n.video-js *,\n.video-js *:before,\n.video-js *:after {\n  box-sizing: inherit;\n}\n\n.video-js ul {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n  list-style-position: outside;\n  margin-left: 0;\n  margin-right: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.video-js.vjs-fluid,\n.video-js.vjs-16-9,\n.video-js.vjs-4-3 {\n  width: 100%;\n  max-width: 100%;\n  height: 0;\n}\n\n.video-js.vjs-16-9 {\n  padding-top: 56.25%;\n}\n\n.video-js.vjs-4-3 {\n  padding-top: 75%;\n}\n\n.video-js.vjs-fill {\n  width: 100%;\n  height: 100%;\n}\n\n.video-js .vjs-tech {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\nbody.vjs-full-window {\n  padding: 0;\n  margin: 0;\n  height: 100%;\n}\n\n.vjs-full-window .video-js.vjs-fullscreen {\n  position: fixed;\n  overflow: hidden;\n  z-index: 1000;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  right: 0;\n}\n\n.video-js.vjs-fullscreen {\n  width: 100% !important;\n  height: 100% !important;\n  padding-top: 0 !important;\n}\n\n.video-js.vjs-fullscreen.vjs-user-inactive {\n  cursor: none;\n}\n\n.vjs-hidden {\n  display: none !important;\n}\n\n.vjs-disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n.video-js .vjs-offscreen {\n  height: 1px;\n  left: -9999px;\n  position: absolute;\n  top: 0;\n  width: 1px;\n}\n\n.vjs-lock-showing {\n  display: block !important;\n  opacity: 1;\n  visibility: visible;\n}\n\n.vjs-no-js {\n  padding: 20px;\n  color: #fff;\n  background-color: #000;\n  font-size: 18px;\n  font-family: Arial, Helvetica, sans-serif;\n  text-align: center;\n  width: 300px;\n  height: 150px;\n  margin: 0px auto;\n}\n\n.vjs-no-js a,\n.vjs-no-js a:visited {\n  color: #66A8CC;\n}\n\n.video-js .vjs-big-play-button {\n  font-size: 3em;\n  line-height: 1.5em;\n  height: 1.63332em;\n  width: 3em;\n  display: block;\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  padding: 0;\n  cursor: pointer;\n  opacity: 1;\n  border: 0.06666em solid #fff;\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.7);\n  border-radius: 0.3em;\n  transition: all 0.4s;\n}\n.vjs-big-play-centered .vjs-big-play-button {\n  top: 50%;\n  left: 50%;\n  margin-top: -0.81666em;\n  margin-left: -1.5em;\n}\n\n.video-js:hover .vjs-big-play-button,\n.video-js .vjs-big-play-button:focus {\n  border-color: #fff;\n  background-color: #73859f;\n  background-color: rgba(115, 133, 159, 0.5);\n  transition: all 0s;\n}\n\n.vjs-controls-disabled .vjs-big-play-button,\n.vjs-has-started .vjs-big-play-button,\n.vjs-using-native-controls .vjs-big-play-button,\n.vjs-error .vjs-big-play-button {\n  display: none;\n}\n\n.vjs-has-started.vjs-paused.vjs-show-big-play-button-on-pause .vjs-big-play-button {\n  display: block;\n}\n\n.video-js button {\n  background: none;\n  border: none;\n  color: inherit;\n  display: inline-block;\n  font-size: inherit;\n  line-height: inherit;\n  text-transform: none;\n  text-decoration: none;\n  transition: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\n.vjs-control .vjs-button {\n  width: 100%;\n  height: 100%;\n}\n\n.video-js .vjs-control.vjs-close-button {\n  cursor: pointer;\n  height: 3em;\n  position: absolute;\n  right: 0;\n  top: 0.5em;\n  z-index: 2;\n}\n.video-js .vjs-modal-dialog {\n  background: rgba(0, 0, 0, 0.8);\n  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0));\n  overflow: auto;\n}\n\n.video-js .vjs-modal-dialog > * {\n  box-sizing: border-box;\n}\n\n.vjs-modal-dialog .vjs-modal-dialog-content {\n  font-size: 1.2em;\n  line-height: 1.5;\n  padding: 20px 24px;\n  z-index: 1;\n}\n\n.vjs-menu-button {\n  cursor: pointer;\n}\n\n.vjs-menu-button.vjs-disabled {\n  cursor: default;\n}\n\n.vjs-workinghover .vjs-menu-button.vjs-disabled:hover .vjs-menu {\n  display: none;\n}\n\n.vjs-menu .vjs-menu-content {\n  display: block;\n  padding: 0;\n  margin: 0;\n  font-family: Arial, Helvetica, sans-serif;\n  overflow: auto;\n}\n\n.vjs-menu .vjs-menu-content > * {\n  box-sizing: border-box;\n}\n\n.vjs-scrubbing .vjs-control.vjs-menu-button:hover .vjs-menu {\n  display: none;\n}\n\n.vjs-menu li {\n  list-style: none;\n  margin: 0;\n  padding: 0.2em 0;\n  line-height: 1.4em;\n  font-size: 1.2em;\n  text-align: center;\n  text-transform: lowercase;\n}\n\n.vjs-menu li.vjs-menu-item:focus,\n.vjs-menu li.vjs-menu-item:hover,\n.js-focus-visible .vjs-menu li.vjs-menu-item:hover {\n  background-color: #73859f;\n  background-color: rgba(115, 133, 159, 0.5);\n}\n\n.vjs-menu li.vjs-selected,\n.vjs-menu li.vjs-selected:focus,\n.vjs-menu li.vjs-selected:hover,\n.js-focus-visible .vjs-menu li.vjs-selected:hover {\n  background-color: #fff;\n  color: #2B333F;\n}\n\n.vjs-menu li.vjs-menu-title {\n  text-align: center;\n  text-transform: uppercase;\n  font-size: 1em;\n  line-height: 2em;\n  padding: 0;\n  margin: 0 0 0.3em 0;\n  font-weight: bold;\n  cursor: default;\n}\n\n.vjs-menu-button-popup .vjs-menu {\n  display: none;\n  position: absolute;\n  bottom: 0;\n  width: 10em;\n  left: -3em;\n  height: 0em;\n  margin-bottom: 1.5em;\n  border-top-color: rgba(43, 51, 63, 0.7);\n}\n\n.vjs-menu-button-popup .vjs-menu .vjs-menu-content {\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.7);\n  position: absolute;\n  width: 100%;\n  bottom: 1.5em;\n  max-height: 15em;\n}\n\n.vjs-layout-tiny .vjs-menu-button-popup .vjs-menu .vjs-menu-content,\n.vjs-layout-x-small .vjs-menu-button-popup .vjs-menu .vjs-menu-content {\n  max-height: 5em;\n}\n\n.vjs-layout-small .vjs-menu-button-popup .vjs-menu .vjs-menu-content {\n  max-height: 10em;\n}\n\n.vjs-layout-medium .vjs-menu-button-popup .vjs-menu .vjs-menu-content {\n  max-height: 14em;\n}\n\n.vjs-layout-large .vjs-menu-button-popup .vjs-menu .vjs-menu-content,\n.vjs-layout-x-large .vjs-menu-button-popup .vjs-menu .vjs-menu-content,\n.vjs-layout-huge .vjs-menu-button-popup .vjs-menu .vjs-menu-content {\n  max-height: 25em;\n}\n\n.vjs-workinghover .vjs-menu-button-popup.vjs-hover .vjs-menu,\n.vjs-menu-button-popup .vjs-menu.vjs-lock-showing {\n  display: block;\n}\n\n.video-js .vjs-menu-button-inline {\n  transition: all 0.4s;\n  overflow: hidden;\n}\n\n.video-js .vjs-menu-button-inline:before {\n  width: 2.222222222em;\n}\n\n.video-js .vjs-menu-button-inline:hover,\n.video-js .vjs-menu-button-inline:focus,\n.video-js .vjs-menu-button-inline.vjs-slider-active,\n.video-js.vjs-no-flex .vjs-menu-button-inline {\n  width: 12em;\n}\n\n.vjs-menu-button-inline .vjs-menu {\n  opacity: 0;\n  height: 100%;\n  width: auto;\n  position: absolute;\n  left: 4em;\n  top: 0;\n  padding: 0;\n  margin: 0;\n  transition: all 0.4s;\n}\n\n.vjs-menu-button-inline:hover .vjs-menu,\n.vjs-menu-button-inline:focus .vjs-menu,\n.vjs-menu-button-inline.vjs-slider-active .vjs-menu {\n  display: block;\n  opacity: 1;\n}\n\n.vjs-no-flex .vjs-menu-button-inline .vjs-menu {\n  display: block;\n  opacity: 1;\n  position: relative;\n  width: auto;\n}\n\n.vjs-no-flex .vjs-menu-button-inline:hover .vjs-menu,\n.vjs-no-flex .vjs-menu-button-inline:focus .vjs-menu,\n.vjs-no-flex .vjs-menu-button-inline.vjs-slider-active .vjs-menu {\n  width: auto;\n}\n\n.vjs-menu-button-inline .vjs-menu-content {\n  width: auto;\n  height: 100%;\n  margin: 0;\n  overflow: hidden;\n}\n\n.video-js .vjs-control-bar {\n  display: none;\n  width: 100%;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 3em;\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.7);\n}\n\n.vjs-has-started .vjs-control-bar {\n  display: flex;\n  visibility: visible;\n  opacity: 1;\n  transition: visibility 0.1s, opacity 0.1s;\n}\n\n.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {\n  visibility: visible;\n  opacity: 0;\n  transition: visibility 1s, opacity 1s;\n}\n\n.vjs-controls-disabled .vjs-control-bar,\n.vjs-using-native-controls .vjs-control-bar,\n.vjs-error .vjs-control-bar {\n  display: none !important;\n}\n\n.vjs-audio.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {\n  opacity: 1;\n  visibility: visible;\n}\n\n.vjs-has-started.vjs-no-flex .vjs-control-bar {\n  display: table;\n}\n\n.video-js .vjs-control {\n  position: relative;\n  text-align: center;\n  margin: 0;\n  padding: 0;\n  height: 100%;\n  width: 4em;\n  flex: none;\n}\n\n.vjs-button > .vjs-icon-placeholder:before {\n  font-size: 1.8em;\n  line-height: 1.67;\n}\n\n.video-js .vjs-control:focus:before,\n.video-js .vjs-control:hover:before,\n.video-js .vjs-control:focus {\n  text-shadow: 0em 0em 1em white;\n}\n\n.video-js .vjs-control-text {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.vjs-no-flex .vjs-control {\n  display: table-cell;\n  vertical-align: middle;\n}\n\n.video-js .vjs-custom-control-spacer {\n  display: none;\n}\n\n.video-js .vjs-progress-control {\n  cursor: pointer;\n  flex: auto;\n  display: flex;\n  align-items: center;\n  min-width: 4em;\n  touch-action: none;\n}\n\n.video-js .vjs-progress-control.disabled {\n  cursor: default;\n}\n\n.vjs-live .vjs-progress-control {\n  display: none;\n}\n\n.vjs-liveui .vjs-progress-control {\n  display: flex;\n  align-items: center;\n}\n\n.vjs-no-flex .vjs-progress-control {\n  width: auto;\n}\n\n.video-js .vjs-progress-holder {\n  flex: auto;\n  transition: all 0.2s;\n  height: 0.3em;\n}\n\n.video-js .vjs-progress-control .vjs-progress-holder {\n  margin: 0 10px;\n}\n\n.video-js .vjs-progress-control:hover .vjs-progress-holder {\n  font-size: 1.6666666667em;\n}\n\n.video-js .vjs-progress-control:hover .vjs-progress-holder.disabled {\n  font-size: 1em;\n}\n\n.video-js .vjs-progress-holder .vjs-play-progress,\n.video-js .vjs-progress-holder .vjs-load-progress,\n.video-js .vjs-progress-holder .vjs-load-progress div {\n  position: absolute;\n  display: block;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  width: 0;\n}\n\n.video-js .vjs-play-progress {\n  background-color: #fff;\n}\n.video-js .vjs-play-progress:before {\n  font-size: 0.9em;\n  position: absolute;\n  right: -0.5em;\n  top: -0.3333333333em;\n  z-index: 1;\n}\n\n.video-js .vjs-load-progress {\n  background: rgba(115, 133, 159, 0.5);\n}\n\n.video-js .vjs-load-progress div {\n  background: rgba(115, 133, 159, 0.75);\n}\n\n.video-js .vjs-time-tooltip {\n  background-color: #fff;\n  background-color: rgba(255, 255, 255, 0.8);\n  border-radius: 0.3em;\n  color: #000;\n  float: right;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 1em;\n  padding: 6px 8px 8px 8px;\n  pointer-events: none;\n  position: absolute;\n  top: -3.4em;\n  visibility: hidden;\n  z-index: 1;\n}\n\n.video-js .vjs-progress-holder:focus .vjs-time-tooltip {\n  display: none;\n}\n\n.video-js .vjs-progress-control:hover .vjs-time-tooltip,\n.video-js .vjs-progress-control:hover .vjs-progress-holder:focus .vjs-time-tooltip {\n  display: block;\n  font-size: 0.6em;\n  visibility: visible;\n}\n\n.video-js .vjs-progress-control.disabled:hover .vjs-time-tooltip {\n  font-size: 1em;\n}\n\n.video-js .vjs-progress-control .vjs-mouse-display {\n  display: none;\n  position: absolute;\n  width: 1px;\n  height: 100%;\n  background-color: #000;\n  z-index: 1;\n}\n\n.vjs-no-flex .vjs-progress-control .vjs-mouse-display {\n  z-index: 0;\n}\n\n.video-js .vjs-progress-control:hover .vjs-mouse-display {\n  display: block;\n}\n\n.video-js.vjs-user-inactive .vjs-progress-control .vjs-mouse-display {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 1s, opacity 1s;\n}\n\n.video-js.vjs-user-inactive.vjs-no-flex .vjs-progress-control .vjs-mouse-display {\n  display: none;\n}\n\n.vjs-mouse-display .vjs-time-tooltip {\n  color: #fff;\n  background-color: #000;\n  background-color: rgba(0, 0, 0, 0.8);\n}\n\n.video-js .vjs-slider {\n  position: relative;\n  cursor: pointer;\n  padding: 0;\n  margin: 0 0.45em 0 0.45em;\n  /* iOS Safari */\n  -webkit-touch-callout: none;\n  /* Safari */\n  -webkit-user-select: none;\n  /* Konqueror HTML */\n  /* Firefox */\n  -moz-user-select: none;\n  /* Internet Explorer/Edge */\n  -ms-user-select: none;\n  /* Non-prefixed version, currently supported by Chrome and Opera */\n  user-select: none;\n  background-color: #73859f;\n  background-color: rgba(115, 133, 159, 0.5);\n}\n\n.video-js .vjs-slider.disabled {\n  cursor: default;\n}\n\n.video-js .vjs-slider:focus {\n  text-shadow: 0em 0em 1em white;\n  box-shadow: 0 0 1em #fff;\n}\n\n.video-js .vjs-mute-control {\n  cursor: pointer;\n  flex: none;\n}\n.video-js .vjs-volume-control {\n  cursor: pointer;\n  margin-right: 1em;\n  display: flex;\n}\n\n.video-js .vjs-volume-control.vjs-volume-horizontal {\n  width: 5em;\n}\n\n.video-js .vjs-volume-panel .vjs-volume-control {\n  visibility: visible;\n  opacity: 0;\n  width: 1px;\n  height: 1px;\n  margin-left: -1px;\n}\n\n.video-js .vjs-volume-panel {\n  transition: width 1s;\n}\n.video-js .vjs-volume-panel.vjs-hover .vjs-volume-control, .video-js .vjs-volume-panel:active .vjs-volume-control, .video-js .vjs-volume-panel:focus .vjs-volume-control, .video-js .vjs-volume-panel .vjs-volume-control:active, .video-js .vjs-volume-panel.vjs-hover .vjs-mute-control ~ .vjs-volume-control, .video-js .vjs-volume-panel .vjs-volume-control.vjs-slider-active {\n  visibility: visible;\n  opacity: 1;\n  position: relative;\n  transition: visibility 0.1s, opacity 0.1s, height 0.1s, width 0.1s, left 0s, top 0s;\n}\n.video-js .vjs-volume-panel.vjs-hover .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel:active .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel:focus .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel .vjs-volume-control:active.vjs-volume-horizontal, .video-js .vjs-volume-panel.vjs-hover .vjs-mute-control ~ .vjs-volume-control.vjs-volume-horizontal, .video-js .vjs-volume-panel .vjs-volume-control.vjs-slider-active.vjs-volume-horizontal {\n  width: 5em;\n  height: 3em;\n  margin-right: 0;\n}\n.video-js .vjs-volume-panel.vjs-hover .vjs-volume-control.vjs-volume-vertical, .video-js .vjs-volume-panel:active .vjs-volume-control.vjs-volume-vertical, .video-js .vjs-volume-panel:focus .vjs-volume-control.vjs-volume-vertical, .video-js .vjs-volume-panel .vjs-volume-control:active.vjs-volume-vertical, .video-js .vjs-volume-panel.vjs-hover .vjs-mute-control ~ .vjs-volume-control.vjs-volume-vertical, .video-js .vjs-volume-panel .vjs-volume-control.vjs-slider-active.vjs-volume-vertical {\n  left: -3.5em;\n  transition: left 0s;\n}\n.video-js .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-hover, .video-js .vjs-volume-panel.vjs-volume-panel-horizontal:active, .video-js .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active {\n  width: 10em;\n  transition: width 0.1s;\n}\n.video-js .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-mute-toggle-only {\n  width: 4em;\n}\n\n.video-js .vjs-volume-panel .vjs-volume-control.vjs-volume-vertical {\n  height: 8em;\n  width: 3em;\n  left: -3000em;\n  transition: visibility 1s, opacity 1s, height 1s 1s, width 1s 1s, left 1s 1s, top 1s 1s;\n}\n\n.video-js .vjs-volume-panel .vjs-volume-control.vjs-volume-horizontal {\n  transition: visibility 1s, opacity 1s, height 1s 1s, width 1s, left 1s 1s, top 1s 1s;\n}\n\n.video-js.vjs-no-flex .vjs-volume-panel .vjs-volume-control.vjs-volume-horizontal {\n  width: 5em;\n  height: 3em;\n  visibility: visible;\n  opacity: 1;\n  position: relative;\n  transition: none;\n}\n\n.video-js.vjs-no-flex .vjs-volume-control.vjs-volume-vertical,\n.video-js.vjs-no-flex .vjs-volume-panel .vjs-volume-control.vjs-volume-vertical {\n  position: absolute;\n  bottom: 3em;\n  left: 0.5em;\n}\n\n.video-js .vjs-volume-panel {\n  display: flex;\n}\n\n.video-js .vjs-volume-bar {\n  margin: 1.35em 0.45em;\n}\n\n.vjs-volume-bar.vjs-slider-horizontal {\n  width: 5em;\n  height: 0.3em;\n}\n\n.vjs-volume-bar.vjs-slider-vertical {\n  width: 0.3em;\n  height: 5em;\n  margin: 1.35em auto;\n}\n\n.video-js .vjs-volume-level {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  background-color: #fff;\n}\n.video-js .vjs-volume-level:before {\n  position: absolute;\n  font-size: 0.9em;\n}\n\n.vjs-slider-vertical .vjs-volume-level {\n  width: 0.3em;\n}\n.vjs-slider-vertical .vjs-volume-level:before {\n  top: -0.5em;\n  left: -0.3em;\n}\n\n.vjs-slider-horizontal .vjs-volume-level {\n  height: 0.3em;\n}\n.vjs-slider-horizontal .vjs-volume-level:before {\n  top: -0.3em;\n  right: -0.5em;\n}\n\n.video-js .vjs-volume-panel.vjs-volume-panel-vertical {\n  width: 4em;\n}\n\n.vjs-volume-bar.vjs-slider-vertical .vjs-volume-level {\n  height: 100%;\n}\n\n.vjs-volume-bar.vjs-slider-horizontal .vjs-volume-level {\n  width: 100%;\n}\n\n.video-js .vjs-volume-vertical {\n  width: 3em;\n  height: 8em;\n  bottom: 8em;\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.7);\n}\n\n.video-js .vjs-volume-horizontal .vjs-menu {\n  left: -2em;\n}\n\n.vjs-poster {\n  display: inline-block;\n  vertical-align: middle;\n  background-repeat: no-repeat;\n  background-position: 50% 50%;\n  background-size: contain;\n  background-color: #000000;\n  cursor: pointer;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 100%;\n}\n\n.vjs-has-started .vjs-poster {\n  display: none;\n}\n\n.vjs-audio.vjs-has-started .vjs-poster {\n  display: block;\n}\n\n.vjs-using-native-controls .vjs-poster {\n  display: none;\n}\n\n.video-js .vjs-live-control {\n  display: flex;\n  align-items: flex-start;\n  flex: auto;\n  font-size: 1em;\n  line-height: 3em;\n}\n\n.vjs-no-flex .vjs-live-control {\n  display: table-cell;\n  width: auto;\n  text-align: left;\n}\n\n.video-js:not(.vjs-live) .vjs-live-control,\n.video-js.vjs-liveui .vjs-live-control {\n  display: none;\n}\n\n.video-js .vjs-seek-to-live-control {\n  cursor: pointer;\n  flex: none;\n  display: inline-flex;\n  height: 100%;\n  padding-left: 0.5em;\n  padding-right: 0.5em;\n  font-size: 1em;\n  line-height: 3em;\n  width: auto;\n  min-width: 4em;\n}\n\n.vjs-no-flex .vjs-seek-to-live-control {\n  display: table-cell;\n  width: auto;\n  text-align: left;\n}\n\n.video-js.vjs-live:not(.vjs-liveui) .vjs-seek-to-live-control,\n.video-js:not(.vjs-live) .vjs-seek-to-live-control {\n  display: none;\n}\n\n.vjs-seek-to-live-control.vjs-control.vjs-at-live-edge {\n  cursor: auto;\n}\n\n.vjs-seek-to-live-control .vjs-icon-placeholder {\n  margin-right: 0.5em;\n  color: #888;\n}\n\n.vjs-seek-to-live-control.vjs-control.vjs-at-live-edge .vjs-icon-placeholder {\n  color: red;\n}\n\n.video-js .vjs-time-control {\n  flex: none;\n  font-size: 1em;\n  line-height: 3em;\n  min-width: 2em;\n  width: auto;\n  padding-left: 1em;\n  padding-right: 1em;\n}\n\n.vjs-live .vjs-time-control {\n  display: none;\n}\n\n.video-js .vjs-current-time,\n.vjs-no-flex .vjs-current-time {\n  display: none;\n}\n\n.video-js .vjs-duration,\n.vjs-no-flex .vjs-duration {\n  display: none;\n}\n\n.vjs-time-divider {\n  display: none;\n  line-height: 3em;\n}\n\n.vjs-live .vjs-time-divider {\n  display: none;\n}\n\n.video-js .vjs-play-control {\n  cursor: pointer;\n}\n\n.video-js .vjs-play-control .vjs-icon-placeholder {\n  flex: none;\n}\n\n.vjs-text-track-display {\n  position: absolute;\n  bottom: 3em;\n  left: 0;\n  right: 0;\n  top: 0;\n  pointer-events: none;\n}\n\n.video-js.vjs-user-inactive.vjs-playing .vjs-text-track-display {\n  bottom: 1em;\n}\n\n.video-js .vjs-text-track {\n  font-size: 1.4em;\n  text-align: center;\n  margin-bottom: 0.1em;\n}\n\n.vjs-subtitles {\n  color: #fff;\n}\n\n.vjs-captions {\n  color: #fc6;\n}\n\n.vjs-tt-cue {\n  display: block;\n}\n\nvideo::-webkit-media-text-track-display {\n  transform: translateY(-3em);\n}\n\n.video-js.vjs-user-inactive.vjs-playing video::-webkit-media-text-track-display {\n  transform: translateY(-1.5em);\n}\n\n.video-js .vjs-picture-in-picture-control {\n  cursor: pointer;\n  flex: none;\n}\n.video-js .vjs-fullscreen-control {\n  cursor: pointer;\n  flex: none;\n}\n.vjs-playback-rate > .vjs-menu-button,\n.vjs-playback-rate .vjs-playback-rate-value {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.vjs-playback-rate .vjs-playback-rate-value {\n  pointer-events: none;\n  font-size: 1.5em;\n  line-height: 2;\n  text-align: center;\n}\n\n.vjs-playback-rate .vjs-menu {\n  width: 4em;\n  left: 0em;\n}\n\n.vjs-error .vjs-error-display .vjs-modal-dialog-content {\n  font-size: 1.4em;\n  text-align: center;\n}\n\n.vjs-error .vjs-error-display:before {\n  color: #fff;\n  content: \"X\";\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 4em;\n  left: 0;\n  line-height: 1;\n  margin-top: -0.5em;\n  position: absolute;\n  text-shadow: 0.05em 0.05em 0.1em #000;\n  text-align: center;\n  top: 50%;\n  vertical-align: middle;\n  width: 100%;\n}\n\n.vjs-loading-spinner {\n  display: none;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin: -25px 0 0 -25px;\n  opacity: 0.85;\n  text-align: left;\n  border: 6px solid rgba(43, 51, 63, 0.7);\n  box-sizing: border-box;\n  background-clip: padding-box;\n  width: 50px;\n  height: 50px;\n  border-radius: 25px;\n  visibility: hidden;\n}\n\n.vjs-seeking .vjs-loading-spinner,\n.vjs-waiting .vjs-loading-spinner {\n  display: block;\n  -webkit-animation: vjs-spinner-show 0s linear 0.3s forwards;\n          animation: vjs-spinner-show 0s linear 0.3s forwards;\n}\n\n.vjs-loading-spinner:before,\n.vjs-loading-spinner:after {\n  content: \"\";\n  position: absolute;\n  margin: -6px;\n  box-sizing: inherit;\n  width: inherit;\n  height: inherit;\n  border-radius: inherit;\n  opacity: 1;\n  border: inherit;\n  border-color: transparent;\n  border-top-color: white;\n}\n\n.vjs-seeking .vjs-loading-spinner:before,\n.vjs-seeking .vjs-loading-spinner:after,\n.vjs-waiting .vjs-loading-spinner:before,\n.vjs-waiting .vjs-loading-spinner:after {\n  -webkit-animation: vjs-spinner-spin 1.1s cubic-bezier(0.6, 0.2, 0, 0.8) infinite, vjs-spinner-fade 1.1s linear infinite;\n  animation: vjs-spinner-spin 1.1s cubic-bezier(0.6, 0.2, 0, 0.8) infinite, vjs-spinner-fade 1.1s linear infinite;\n}\n\n.vjs-seeking .vjs-loading-spinner:before,\n.vjs-waiting .vjs-loading-spinner:before {\n  border-top-color: white;\n}\n\n.vjs-seeking .vjs-loading-spinner:after,\n.vjs-waiting .vjs-loading-spinner:after {\n  border-top-color: white;\n  -webkit-animation-delay: 0.44s;\n  animation-delay: 0.44s;\n}\n\n@keyframes vjs-spinner-show {\n  to {\n    visibility: visible;\n  }\n}\n@-webkit-keyframes vjs-spinner-show {\n  to {\n    visibility: visible;\n  }\n}\n@keyframes vjs-spinner-spin {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@-webkit-keyframes vjs-spinner-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n  }\n}\n@keyframes vjs-spinner-fade {\n  0% {\n    border-top-color: #73859f;\n  }\n  20% {\n    border-top-color: #73859f;\n  }\n  35% {\n    border-top-color: white;\n  }\n  60% {\n    border-top-color: #73859f;\n  }\n  100% {\n    border-top-color: #73859f;\n  }\n}\n@-webkit-keyframes vjs-spinner-fade {\n  0% {\n    border-top-color: #73859f;\n  }\n  20% {\n    border-top-color: #73859f;\n  }\n  35% {\n    border-top-color: white;\n  }\n  60% {\n    border-top-color: #73859f;\n  }\n  100% {\n    border-top-color: #73859f;\n  }\n}\n.vjs-chapters-button .vjs-menu ul {\n  width: 24em;\n}\n\n.video-js .vjs-subs-caps-button + .vjs-menu .vjs-captions-menu-item .vjs-menu-item-text .vjs-icon-placeholder {\n  vertical-align: middle;\n  display: inline-block;\n  margin-bottom: -0.1em;\n}\n\n.video-js .vjs-subs-caps-button + .vjs-menu .vjs-captions-menu-item .vjs-menu-item-text .vjs-icon-placeholder:before {\n  font-family: VideoJS;\n  content: \"\";\n  font-size: 1.5em;\n  line-height: inherit;\n}\n\n.video-js .vjs-audio-button + .vjs-menu .vjs-main-desc-menu-item .vjs-menu-item-text .vjs-icon-placeholder {\n  vertical-align: middle;\n  display: inline-block;\n  margin-bottom: -0.1em;\n}\n\n.video-js .vjs-audio-button + .vjs-menu .vjs-main-desc-menu-item .vjs-menu-item-text .vjs-icon-placeholder:before {\n  font-family: VideoJS;\n  content: \" \";\n  font-size: 1.5em;\n  line-height: inherit;\n}\n\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-current-time,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-time-divider,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-duration,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-remaining-time,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-playback-rate,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-chapters-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-descriptions-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-captions-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-subtitles-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-audio-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-volume-control, .video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-current-time,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-time-divider,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-duration,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-remaining-time,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-playback-rate,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-chapters-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-descriptions-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-captions-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-subtitles-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-audio-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-volume-control, .video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-current-time,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-time-divider,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-duration,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-remaining-time,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-playback-rate,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-chapters-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-descriptions-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-captions-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-subtitles-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-audio-button,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-volume-control {\n  display: none;\n}\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-volume-panel.vjs-volume-panel-horizontal:hover,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-volume-panel.vjs-volume-panel-horizontal:active,\n.video-js:not(.vjs-fullscreen).vjs-layout-small .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active, .video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-volume-panel.vjs-volume-panel-horizontal:hover,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-volume-panel.vjs-volume-panel-horizontal:active,\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active, .video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-volume-panel.vjs-volume-panel-horizontal:hover,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-volume-panel.vjs-volume-panel-horizontal:active,\n.video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active {\n  width: auto;\n  width: initial;\n}\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small:not(.vjs-liveui) .vjs-subs-caps-button, .video-js:not(.vjs-fullscreen).vjs-layout-x-small:not(.vjs-live) .vjs-subs-caps-button, .video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-subs-caps-button {\n  display: none;\n}\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small.vjs-liveui .vjs-custom-control-spacer, .video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-custom-control-spacer {\n  flex: auto;\n  display: block;\n}\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small.vjs-liveui.vjs-no-flex .vjs-custom-control-spacer, .video-js:not(.vjs-fullscreen).vjs-layout-tiny.vjs-no-flex .vjs-custom-control-spacer {\n  width: auto;\n}\n.video-js:not(.vjs-fullscreen).vjs-layout-x-small.vjs-liveui .vjs-progress-control, .video-js:not(.vjs-fullscreen).vjs-layout-tiny .vjs-progress-control {\n  display: none;\n}\n\n.vjs-modal-dialog.vjs-text-track-settings {\n  background-color: #2B333F;\n  background-color: rgba(43, 51, 63, 0.75);\n  color: #fff;\n  height: 70%;\n}\n\n.vjs-text-track-settings .vjs-modal-dialog-content {\n  display: table;\n}\n\n.vjs-text-track-settings .vjs-track-settings-colors,\n.vjs-text-track-settings .vjs-track-settings-font,\n.vjs-text-track-settings .vjs-track-settings-controls {\n  display: table-cell;\n}\n\n.vjs-text-track-settings .vjs-track-settings-controls {\n  text-align: right;\n  vertical-align: bottom;\n}\n\n@supports (display: grid) {\n  .vjs-text-track-settings .vjs-modal-dialog-content {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    grid-template-rows: 1fr;\n    padding: 20px 24px 0px 24px;\n  }\n\n  .vjs-track-settings-controls .vjs-default-button {\n    margin-bottom: 20px;\n  }\n\n  .vjs-text-track-settings .vjs-track-settings-controls {\n    grid-column: 1/-1;\n  }\n\n  .vjs-layout-small .vjs-text-track-settings .vjs-modal-dialog-content,\n.vjs-layout-x-small .vjs-text-track-settings .vjs-modal-dialog-content,\n.vjs-layout-tiny .vjs-text-track-settings .vjs-modal-dialog-content {\n    grid-template-columns: 1fr;\n  }\n}\n.vjs-track-setting > select {\n  margin-right: 1em;\n  margin-bottom: 0.5em;\n}\n\n.vjs-text-track-settings fieldset {\n  margin: 5px;\n  padding: 3px;\n  border: none;\n}\n\n.vjs-text-track-settings fieldset span {\n  display: inline-block;\n}\n\n.vjs-text-track-settings fieldset span > select {\n  max-width: 7.3em;\n}\n\n.vjs-text-track-settings legend {\n  color: #fff;\n  margin: 0 0 5px 0;\n}\n\n.vjs-text-track-settings .vjs-label {\n  position: absolute;\n  clip: rect(1px 1px 1px 1px);\n  clip: rect(1px, 1px, 1px, 1px);\n  display: block;\n  margin: 0 0 5px 0;\n  padding: 0;\n  border: 0;\n  height: 1px;\n  width: 1px;\n  overflow: hidden;\n}\n\n.vjs-track-settings-controls button:focus,\n.vjs-track-settings-controls button:active {\n  outline-style: solid;\n  outline-width: medium;\n  background-image: linear-gradient(0deg, #fff 88%, #73859f 100%);\n}\n\n.vjs-track-settings-controls button:hover {\n  color: rgba(43, 51, 63, 0.75);\n}\n\n.vjs-track-settings-controls button {\n  background-color: #fff;\n  background-image: linear-gradient(-180deg, #fff 88%, #73859f 100%);\n  color: #2B333F;\n  cursor: pointer;\n  border-radius: 2px;\n}\n\n.vjs-track-settings-controls .vjs-default-button {\n  margin-right: 1em;\n}\n\n@media print {\n  .video-js > *:not(.vjs-tech):not(.vjs-poster) {\n    visibility: hidden;\n  }\n}\n.vjs-resize-manager {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: none;\n  z-index: -1000;\n}\n\n.js-focus-visible .video-js *:focus:not(.focus-visible) {\n  outline: none;\n  background: none;\n}\n\n.video-js *:focus:not(:focus-visible),\n.video-js .vjs-menu *:focus:not(:focus-visible) {\n  outline: none;\n  background: none;\n}\n", ""]);



/***/ }),

/***/ "LToI":
/*!***************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/views/ButtonsView.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR"),
    EncryptFilePopup = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/popups/EncryptFilePopup.js */ "ymJf"),
    SharePopup = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/popups/SharePopup.js */ "3vk+"),
    CreatePublicLinkPopup = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/popups/CreatePublicLinkPopup.js */ "9w3v");
/**
 * @constructor
 */


function СButtonsView() {}

СButtonsView.prototype.ViewTemplate = 'OpenPgpFilesWebclient_ButtonsView';

СButtonsView.prototype.useFilesViewData = function (oFilesView) {
  var selectedItem = oFilesView.selector.itemSelected;
  this.storageType = oFilesView.storageType;
  this.secureShareCommand = Utils.createCommand(this, function () {
    var _selectedItem, _selectedItem$oExtend, _selectedItem2, _selectedItem2$oExten;

    if (selectedItem().published()) {
      Popups.showPopup(SharePopup, [selectedItem()]);
    } else if (selectedItem().IS_FILE && selectedItem().bIsSecure() && !((_selectedItem = selectedItem()) !== null && _selectedItem !== void 0 && (_selectedItem$oExtend = _selectedItem.oExtendedProps) !== null && _selectedItem$oExtend !== void 0 && _selectedItem$oExtend.ParanoidKey)) {
      Popups.showPopup(AlertPopup, [TextUtils.i18n('OPENPGPFILESWEBCLIENT/INFO_SHARING_NOT_SUPPORTED'), null, TextUtils.i18n('OPENPGPFILESWEBCLIENT/HEADING_SEND_ENCRYPTED_FILE')]);
    } else if ((_selectedItem2 = selectedItem()) !== null && _selectedItem2 !== void 0 && (_selectedItem2$oExten = _selectedItem2.oExtendedProps) !== null && _selectedItem2$oExten !== void 0 && _selectedItem2$oExten.InitializationVector) {
      Popups.showPopup(EncryptFilePopup, [selectedItem(), oFilesView]);
    } else {
      Popups.showPopup(CreatePublicLinkPopup, [selectedItem(), oFilesView]);
    }
  }, function () {
    // Conditions for button activity:
    // Personal: one file or one folder
    // Corporate: one file or one folder
    // Encrypted: one file only
    // Shared: nothing
    return selectedItem() !== null && oFilesView.checkedReadyForOperations() && oFilesView.selector.listCheckedAndSelected().length === 1 && !oFilesView.isZipFolder() && (!selectedItem().oExtendedProps || !selectedItem().oExtendedProps.PgpEncryptionMode) && (oFilesView.storageType() === Enums.FileStorageType.Personal || oFilesView.storageType() === Enums.FileStorageType.Corporate || oFilesView.storageType() === Enums.FileStorageType.Encrypted && selectedItem().IS_FILE);
  });
};

module.exports = new СButtonsView();

/***/ }),

/***/ "LU2F":
/*!********************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/DecryptKeyPasswordPopup.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF");
/**
 * @constructor
 */


function CDecryptKeyPasswordPopup() {
  CAbstractPopup.call(this);
  this.keyPassword = ko.observable('');
  this.fOnPasswordEnterCallback = null;
  this.fOnCancellCallback = null;
}

_.extendOwn(CDecryptKeyPasswordPopup.prototype, CAbstractPopup.prototype);

CDecryptKeyPasswordPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_DecryptKeyPasswordPopup';

CDecryptKeyPasswordPopup.prototype.onOpen = function (fOnPasswordEnterCallback, fOnCancellCallback) {
  this.fOnPasswordEnterCallback = fOnPasswordEnterCallback;
  this.fOnCancellCallback = fOnCancellCallback;
};

CDecryptKeyPasswordPopup.prototype.decryptKey = function () {
  if (_.isFunction(this.fOnPasswordEnterCallback)) {
    this.fOnPasswordEnterCallback(this.keyPassword());
  }

  this.closePopup();
};

CDecryptKeyPasswordPopup.prototype.cancelPopup = function () {
  if (_.isFunction(this.fOnCancellCallback)) {
    this.fOnCancellCallback();
  }

  this.closePopup();
};

CDecryptKeyPasswordPopup.prototype.onShow = function () {
  this.keyPassword('');
};

module.exports = new CDecryptKeyPasswordPopup();

/***/ }),

/***/ "Pg7U":
/*!********************************************************!*\
  !*** ./modules/FilesWebclient/js/models/CFileModel.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	moment = __webpack_require__(/*! moment */ "wd/R"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	WindowOpener = __webpack_require__(/*! modules/CoreWebclient/js/WindowOpener.js */ "ZCBP"),
	
	CAbstractFileModel = __webpack_require__(/*! modules/CoreWebclient/js/models/CAbstractFileModel.js */ "cGGv"),
	CDateModel = __webpack_require__(/*! modules/CoreWebclient/js/models/CDateModel.js */ "5hOJ"),
	
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	EmbedHtmlPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/EmbedHtmlPopup.js */ "42lS"),
	
	Enums = window.Enums
;

/**
 * @constructor
 * @param {Object} oData
 * @param {bool} bPopup
 * @extends CAbstractFileModel
 */
function CFileModel(oData, bPopup)
{
	// the constant is used instead of constructor.name because constructor.name can not be used in minified JS
	this.IS_FILE = true;
	
	this.storageType = ko.observable(Types.pString(oData.Type));
	this.sLastModified = CFileModel.parseLastModified(oData.LastModified);
	this.iLastModified = Types.pInt(oData.LastModified);

	this.path = ko.observable(Types.pString(oData.Path));
	this.fullPath = ko.observable(Types.pString(oData.FullPath));
	
	this.selected = ko.observable(false);
	this.checked = ko.observable(false);
	
	this.bIsLink = !!oData.IsLink;
	this.oExtendedProps = oData.ExtendedProps;
	this.sLinkType = this.bIsLink ? Types.pString(oData.LinkType) : '';
	this.sLinkUrl = this.bIsLink ? Types.pString(oData.LinkUrl) : '';
	this.sThumbnailExternalLink = this.bIsLink ? Types.pString(oData.ThumbnailUrl) : '';
	
	this.deleted = ko.observable(false); // temporary removal until it was confirmation from the server to delete
	this.recivedAnim = ko.observable(false).extend({'autoResetToFalse': 500});
	this.published = ko.observable(false);
	this.sOwnerName = Types.pString(oData.Owner);
	
	CAbstractFileModel.call(this);
	
	this.content = ko.observable('');
	
	this.thumbUrlInQueueSubscribtion.dispose();
	this.thumbUrlInQueue.subscribe(function () {
		if (this.sThumbnailExternalLink !== '')
		{
			this.thumbnailSrc(this.sThumbnailExternalLink);
		}
		else if (!this.bIsLink)
		{
			this.getInThumbQueue();
		}
	}, this);
	
	this.visibleCancelButton = ko.computed(function () {
		return this.visibleProgress() && this.progressPercent() !== 100;
	}, this);
	
	this.oActionsData['list'] = {
		'Text': TextUtils.i18n('COREWEBCLIENT/ACTION_VIEW_FILE'),
		'Handler': _.bind(function () { App.broadcastEvent('Files::ShowList', {'Item': this}); }, this)
	};
	this.oActionsData['open'] = {
		'Text': TextUtils.i18n('COREWEBCLIENT/ACTION_OPEN_LINK'),
		'Handler': _.bind(this.openLink, this)
	};

	this.iconAction('');
	
	this.sHeaderText = _.bind(function () {
		if (this.sLastModified)
		{
			var sLangConstName = this.sOwnerName !== '' ? 'FILESWEBCLIENT/INFO_OWNER_AND_DATA' : 'FILESWEBCLIENT/INFO_DATA';
			return TextUtils.i18n(sLangConstName, {
				'OWNER': this.sOwnerName,
				'LASTMODIFIED': this.sLastModified
			});
		}
		return '';
	}, this)();
	
	this.type = this.storageType;

	this.canShare = ko.computed(function () {
		return (this.storageType() === Enums.FileStorageType.Personal || this.storageType() === Enums.FileStorageType.Corporate);
	}, this);
	
	this.sHtmlEmbed = Types.pString(oData.OembedHtml);
	
	this.commonParseActions(oData);
	
	this.cssClasses = ko.computed(function () {
		var aClasses = this.getCommonClasses();
		
		if (this.allowDrag())
		{
			aClasses.push('dragHandle');
		}
		if (this.selected())
		{
			aClasses.push('selected');
		}
		if (this.checked())
		{
			aClasses.push('checked');
		}
		if (this.deleted())
		{
			aClasses.push('deleted');
		}
		if (this.allowPublicLink() && this.published())
		{
			aClasses.push('published');
		}
		if (this.bIsLink)
		{
			aClasses.push('aslink');
		}
		
		return aClasses.join(' ');
	}, this);
	
	this.parse(oData, bPopup);
}

_.extendOwn(CFileModel.prototype, CAbstractFileModel.prototype);

/**
 * Parses date of last file modification.
 * @param {number} iLastModified Date in unix fomat
 * @returns {String}
 */
CFileModel.parseLastModified = function (iLastModified)
{
	var oDateModel = new CDateModel();
	if (iLastModified)
	{
		oDateModel.parse(iLastModified);
		return oDateModel.getShortDate();
	}
	return '';
};

/**
 * Prepares data of link for its further parsing.
 * @param {Object} oData Data received from the server after URL checking.
 * @param {string} sLinkUrl Link URL.
 * @returns {Object}
 */
CFileModel.prepareLinkData = function (oData, sLinkUrl)
{
	return {
		IsLink: true,
		LinkType: oData.LinkType,
		LinkUrl: sLinkUrl,
		Name: oData.Name,
		Size: oData.Size,
		ThumbnailUrl: oData.Thumb
	};
};

/**
 * Parses data from server.
 * @param {object} oData
 * @param {boolean} bPopup
 */
CFileModel.prototype.parse = function (oData, bPopup)
{
	this.uploaded(true);
	this.allowDrag(!bPopup);
	this.allowUpload(true);
	this.allowPublicLink(true);
	this.allowActions(!bPopup && this.fullPath() !== '');
		
	this.fileName(Types.pString(oData.Name));
	this.content(Types.pString(oData.Content));
	this.id(Types.pString(oData.Id));
	this.published(!!oData.Published);

	this.size(Types.pInt(oData.Size));
	this.hash(Types.pString(oData.Hash));
	
	this.thumbUrlInQueue(Types.pString(oData.ThumbnailUrl) !== '' ? Types.pString(oData.ThumbnailUrl) + '/' + Math.random() : '');
	
	this.mimeType(Types.pString(oData.ContentType));

	this.bHasHtmlEmbed = !bPopup && this.fullPath() !== '' && this.sLinkType === 'oembeded';
	if (this.bHasHtmlEmbed)
	{
		this.iconAction('view');
	}
	if (!this.isViewSupported() && !this.bHasHtmlEmbed)
	{
		this.actions(_.without(this.actions(), 'view'));
	}

	App.broadcastEvent('FilesWebclient::ParseFile::after', [this, oData]);
};

/**
 * Prepares data of upload file for its further parsing.
 * @param {Object} oFileData
 * @param {string} sPath
 * @param {string} sStorageType
 * @param {Function} fGetFileByName
 * @returns {Object}
 */
CFileModel.prepareUploadFileData = function (oFileData, sPath, sStorageType, fGetFileByName)
{
	var
		sFileName = oFileData.FileName,
		sFileNameExt = Utils.getFileExtension(sFileName),
		sFileNameWoExt = Utils.getFileNameWithoutExtension(sFileName),
		iIndex = 0
	;
	
	if (sFileNameExt !== '')
	{
		sFileNameExt = '.' + sFileNameExt;
	}
	
	while (fGetFileByName(sFileName))
	{
		sFileName = sFileNameWoExt + '_' + iIndex + sFileNameExt;
		iIndex++;
	}
	
	oFileData.FileName = sFileName;
	
	return {
		Name: sFileName,
		LastModified: moment().unix(),
		Owner: App.getUserPublicId(),
		Path: sPath,
		FullPath: sPath + '/' + sFileName,
		Type: sStorageType,
		ContentType: oFileData.Type,
		Size: oFileData.Size
	};
};

/**
 * Opens file viewing via post to iframe.
 * @param {Object} oFileModel
 * @param {Object} oEvent
 */
CFileModel.prototype.viewFile = function (oFileModel, oEvent)
{
	if (!oEvent || !oEvent.ctrlKey && !oEvent.shiftKey)
	{
		if (this.sHtmlEmbed !== '')
		{
			Popups.showPopup(EmbedHtmlPopup, [this.sHtmlEmbed]);
		}
		else if (this.bIsLink)
		{
			this.viewCommonFile(this.sLinkUrl);
		}
		else
		{
			this.viewCommonFile();
		}
	}
};

/**
 * Opens link URL in the new tab.
 */
CFileModel.prototype.openLink = function ()
{
	if (this.bIsLink)
	{
		WindowOpener.openTab(this.sLinkUrl);
	}
};

CFileModel.prototype.commonParseActions = function (oData)
{
	_.each (oData.Actions, function (oData, sAction) {
		if (!this.oActionsData[sAction])
		{
			this.oActionsData[sAction] = {};
		}
		var sHash = '';
		if (sAction === 'download' || sAction === 'view')
		{
			sHash = '&' + Utils.getRandomHash();
		}
		this.oActionsData[sAction].Url = Types.pString(oData.url) + sHash;
		this.actions.push(sAction);
	}, this);
};

module.exports = CFileModel;


/***/ }),

/***/ "QFUI":
/*!*************************************************!*\
  !*** ./modules/CoreWebclient/js/utils/Files.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR"),
	
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
	
	FilesUtils = {}
;

/**
 * Gets link for download by hash.
 *
 * @param {string} sModuleName Name of module that owns the file.
 * @param {string} sHash Hash of the file.
 * @param {string} sPublicHash Hash of shared folder if the file is displayed by public link.
 * 
 * @return {string}
 */
FilesUtils.getDownloadLink = function (sModuleName, sHash, sPublicHash)
{
	return sHash.length > 0 ? '?/Download/' + sModuleName + '/DownloadFile/' + sHash + '/' + (sPublicHash ? '0/' + sPublicHash : '') : '';
};

/**
 * Gets link for view by hash in iframe.
 *
 * @param {number} iAccountId
 * @param {string} sUrl
 *
 * @return {string}
 */
FilesUtils.getIframeWrappwer = function (iAccountId, sUrl)
{
	return '?/Raw/Iframe/' + iAccountId + '/' + window.encodeURIComponent(sUrl) + '/';
};

FilesUtils.thumbQueue = (function () {

	var
		oImages = {},
		oImagesIncrements = {},
		iNumberOfImages = 2
	;

	return function (sSessionUid, sImageSrc, fImageSrcObserver)
	{
		if(sImageSrc && fImageSrcObserver)
		{
			if(!(sSessionUid in oImagesIncrements) || oImagesIncrements[sSessionUid] > 0) //load first images
			{
				if(!(sSessionUid in oImagesIncrements)) //on first image
				{
					oImagesIncrements[sSessionUid] = iNumberOfImages;
					oImages[sSessionUid] = [];
				}
				oImagesIncrements[sSessionUid]--;

				fImageSrcObserver(sImageSrc); //load image
			}
			else //create queue
			{
				oImages[sSessionUid].push({
					imageSrc: sImageSrc,
					imageSrcObserver: fImageSrcObserver,
					messageUid: sSessionUid
				});
			}
		}
		else //load images from queue (fires load event)
		{
			if(oImages[sSessionUid] && oImages[sSessionUid].length)
			{
				oImages[sSessionUid][0].imageSrcObserver(oImages[sSessionUid][0].imageSrc);
				oImages[sSessionUid].shift();
			}
		}
	};
}());

/**
 * @param {string} sFileName
 * @param {number} iSize
 * @returns {Boolean}
 */
FilesUtils.showErrorIfAttachmentSizeLimit = function (sFileName, iSize)
{
	var
		sWarning = TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_SIZE_DETAILED', {
			'FILENAME': sFileName,
			'MAXSIZE': TextUtils.getFriendlySize(UserSettings.AttachmentSizeLimit)
		})
	;
	
	if (UserSettings.AttachmentSizeLimit > 0 && iSize > UserSettings.AttachmentSizeLimit)
	{
		Popups.showPopup(AlertPopup, [sWarning]);
		return true;
	}
	
	return false;
};

module.exports = FilesUtils;


/***/ }),

/***/ "U1dG":
/*!****************************************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/views/CSelfDestructingEncryptedMessageView.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    moment = __webpack_require__(/*! moment */ "wd/R"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    ErrorsUtils = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/utils/Errors.js */ "1kFK"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    Settings = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/Settings.js */ "+x5O"),
    CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "xcwT"),
    OpenPgpEncryptor = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpEncryptor');
/**
* @constructor
*/


function CSelfDestructingEncryptedMessageView() {
  CAbstractScreenView.call(this, 'OpenPgpFilesWebclient');
  this.enteredPassword = ko.observable('');
  this.isDecryptionAvailable = ko.observable(false);
  this.isDecrypting = ko.observable(false);
  this.browserTitle = ko.observable(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HEADING_BROWSER_TAB'));
  this.subject = Settings.PublicFileData.Subject ? Settings.PublicFileData.Subject : '';
  this.message = ko.observable('');
  this.data = Settings.PublicFileData.Data ? Settings.PublicFileData.Data : '';
  this.encryptionMode = Settings.PublicFileData.PgpEncryptionMode ? Settings.PublicFileData.PgpEncryptionMode : '';
  this.recipientEmail = Settings.PublicFileData.RecipientEmail ? Settings.PublicFileData.RecipientEmail : '';
  this.ExpireDate = Settings.PublicFileData.ExpireDate ? moment.unix(Settings.PublicFileData.ExpireDate).format("YYYY-MM-DD HH:mm:ss") : '';
  this.ExpireDateMessage = TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_MESSAGE_LIFETIME', {
    'DATETIME': this.ExpireDate
  });
  this.EerrorNoKeyMessage = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_NO_KEY', {
    'SYSNAME': Settings.ProductName
  });
  this.isDecryptedSuccessfully = ko.observable(false);
  this.isShowNoKeyErrorMessage = ko.observable(false);

  switch (this.encryptionMode) {
    case Enums.EncryptionBasedOn.Key:
      this.passwordLabel = TextUtils.i18n('OPENPGPFILESWEBCLIENT/LABEL_ENTER_PASSPHRASE', {
        'KEY': this.recipientEmail
      });
      this.isDecryptionAvailable(true);
      break;

    case Enums.EncryptionBasedOn.Password:
      this.passwordLabel = TextUtils.i18n('OPENPGPFILESWEBCLIENT/LABEL_ENTER_PASSWORD');
      this.isDecryptionAvailable(true);
      break;

    default:
      //Encryption mode not defined
      this.passwordLabel = "";
  }
}

_.extendOwn(CSelfDestructingEncryptedMessageView.prototype, CAbstractScreenView.prototype);

CSelfDestructingEncryptedMessageView.prototype.ViewTemplate = 'OpenPgpFilesWebclient_SelfDestructingEncryptedMessageView';
CSelfDestructingEncryptedMessageView.prototype.ViewConstructorName = 'CSelfDestructingEncryptedMessageView';
CSelfDestructingEncryptedMessageView.prototype.onShow = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(this.encryptionMode === Enums.EncryptionBasedOn.Key)) {
            _context.next = 5;
            break;
          }

          _context.next = 3;
          return OpenPgpEncryptor.oPromiseInitialised;

        case 3:
          this.isDecryptionAvailable(!OpenPgpEncryptor.findKeysByEmails([this.recipientEmail], false).length <= 0); //show error message if user has no key

          this.isShowNoKeyErrorMessage(!this.isDecryptionAvailable());

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));
CSelfDestructingEncryptedMessageView.prototype.decryptMessage = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var oDecryptionResult;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(this.encryptionMode === Enums.EncryptionBasedOn.Password && this.enteredPassword() === '')) {
            _context2.next = 4;
            break;
          }

          Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_EMPTY_PASSWORD'));
          _context2.next = 10;
          break;

        case 4:
          this.isDecrypting(true);
          _context2.next = 7;
          return OpenPgpEncryptor.decryptData(this.data, this.enteredPassword(), this.encryptionMode === Enums.EncryptionBasedOn.Password);

        case 7:
          oDecryptionResult = _context2.sent;
          this.isDecrypting(false);

          if (!oDecryptionResult.result || oDecryptionResult.hasErrors()) {
            ErrorsUtils.showPgpErrorByCode(oDecryptionResult, Enums.PgpAction.DecryptVerify);
          } else {
            if (oDecryptionResult.hasNotices()) {
              ErrorsUtils.showPgpErrorByCode(oDecryptionResult, Enums.PgpAction.DecryptVerify);
            }

            this.message(oDecryptionResult.result);
            this.isDecryptedSuccessfully(true);
          }

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));
module.exports = CSelfDestructingEncryptedMessageView;

/***/ }),

/***/ "Xu4A":
/*!******************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/OpenPgpFileProcessor.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    $ = __webpack_require__(/*! jquery */ "EVdn"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
    Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
    ErrorsUtils = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/utils/Errors.js */ "1kFK"),
    JscryptoKey = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js */ "zDR0"),
    HexUtils = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/utils/Hex.js */ "wjWM"),
    OpenPgpEncryptor = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpEncryptor');

var OpenPgpFileProcessor = {};

OpenPgpFileProcessor.processFileEncryption = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(oFile, oFilesView, sRecipientEmail, bIsPasswordMode, bSign, sPassphrase) {
    var _oFile$oExtendedProps;

    var sPath, sStorageType, oResultData, sParanoidEncryptedKey, oPGPDecryptionResult, sKey, aPublicKeys, oPrivateKey, oPGPEncryptionResult, _oPGPEncryptionResult, sEncryptedKey, sPassword, bUpdateExtendedProps, oPublicLinkResult;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sPath = oFilesView.currentPath();
            sStorageType = oFilesView.storageType();
            oResultData = {
              result: false
            };
            sParanoidEncryptedKey = (oFile === null || oFile === void 0 ? void 0 : (_oFile$oExtendedProps = oFile.oExtendedProps) === null || _oFile$oExtendedProps === void 0 ? void 0 : _oFile$oExtendedProps.ParanoidKey) || '';

            if (!sParanoidEncryptedKey) {
              _context.next = 45;
              break;
            }

            _context.next = 7;
            return OpenPgpEncryptor.decryptData(sParanoidEncryptedKey, sPassphrase);

          case 7:
            oPGPDecryptionResult = _context.sent;

            if (oPGPDecryptionResult.passphrase) {
              // saving passphrase so that it won't be asked again until encrypt popup is closed
              sPassphrase = oPGPDecryptionResult.passphrase;
              oResultData.passphrase = sPassphrase;
            }

            if (!oPGPDecryptionResult.result) {
              _context.next = 42;
              break;
            }

            sKey = oPGPDecryptionResult.result; //encrypt Paranoid key

            aPublicKeys = sRecipientEmail && !bIsPasswordMode ? OpenPgpEncryptor.findKeysByEmails([sRecipientEmail],
            /*bIsPublic*/
            true) : [];

            if (!bSign) {
              _context.next = 18;
              break;
            }

            _context.next = 15;
            return OpenPgpEncryptor.getCurrentUserPrivateKey();

          case 15:
            _context.t0 = _context.sent;
            _context.next = 19;
            break;

          case 18:
            _context.t0 = null;

          case 19:
            oPrivateKey = _context.t0;
            _context.next = 22;
            return OpenPgpEncryptor.encryptData(sKey, aPublicKeys, [oPrivateKey], bIsPasswordMode, bSign, sPassphrase);

          case 22:
            oPGPEncryptionResult = _context.sent;

            if (!(!oPGPEncryptionResult.result || oPGPEncryptionResult.hasErrors() || oPGPEncryptionResult.hasNotices())) {
              _context.next = 27;
              break;
            }

            ErrorsUtils.showPgpErrorByCode(oPGPEncryptionResult, Enums.PgpAction.Encrypt);
            _context.next = 40;
            break;

          case 27:
            _oPGPEncryptionResult = oPGPEncryptionResult.result, sEncryptedKey = _oPGPEncryptionResult.data, sPassword = _oPGPEncryptionResult.password;

            if (!sEncryptedKey) {
              _context.next = 40;
              break;
            }

            _context.next = 31;
            return this.updateFileExtendedProps(oFile, {
              ParanoidKeyPublic: sEncryptedKey
            });

          case 31:
            bUpdateExtendedProps = _context.sent;

            if (!bUpdateExtendedProps) {
              _context.next = 39;
              break;
            }

            _context.next = 35;
            return this.createPublicLink(oFile.storageType(), oFile.path(), oFile.fileName(), oFile.size(), false, sRecipientEmail, bIsPasswordMode ? Enums.EncryptionBasedOn.Password : Enums.EncryptionBasedOn.Key);

          case 35:
            oPublicLinkResult = _context.sent;

            if (oPublicLinkResult.result) {
              oFilesView.refresh();
              oResultData.result = true;
              oResultData.password = sPassword;
              oResultData.link = oPublicLinkResult.link;
            }

            _context.next = 40;
            break;

          case 39:
            Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_UPDATING_KEY'));

          case 40:
            _context.next = 43;
            break;

          case 42:
            ErrorsUtils.showPgpErrorByCode(oPGPDecryptionResult, Enums.PgpAction.DecryptVerify);

          case 43:
            _context.next = 46;
            break;

          case 45:
            Screens.showError('OPENPGPFILESWEBCLIENT/ERROR_READING_KEY');

          case 46:
            return _context.abrupt("return", oResultData);

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();

OpenPgpFileProcessor.decryptFile = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(oBlob, sRecipientEmail, sPassword, bPasswordBasedEncryption, sParanoidKeyPublic, sInitializationVector) {
    var oResult, oPGPDecryptionResult, oCurrentUserPrivateKey, sReport, sKey, oDecryptedFileData, oResBlob;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            oResult = {
              result: false
            };
            _context2.prev = 1;
            _context2.next = 4;
            return OpenPgpEncryptor.decryptData(sParanoidKeyPublic, sPassword, bPasswordBasedEncryption);

          case 4:
            oPGPDecryptionResult = _context2.sent;

            if (oPGPDecryptionResult.result) {
              _context2.next = 9;
              break;
            }

            ErrorsUtils.showPgpErrorByCode(oPGPDecryptionResult, Enums.PgpAction.DecryptVerify);
            _context2.next = 22;
            break;

          case 9:
            if (!(oPGPDecryptionResult.validKeyNames && oPGPDecryptionResult.validKeyNames.length)) {
              _context2.next = 16;
              break;
            }

            _context2.next = 12;
            return OpenPgpEncryptor.getCurrentUserPrivateKey();

          case 12:
            oCurrentUserPrivateKey = _context2.sent;

            if (!oCurrentUserPrivateKey || !oPGPDecryptionResult.validKeyNames.includes(oCurrentUserPrivateKey.getUser())) {
              //Paranoid-key was signed with a foreign key
              sReport = TextUtils.i18n('OPENPGPFILESWEBCLIENT/REPORT_SUCCESSFULL_SIGNATURE_VERIFICATION') + oPGPDecryptionResult.validKeyNames.join(', ').replace(/</g, "&lt;").replace(/>/g, "&gt;");
              Screens.showReport(sReport);
            }

            _context2.next = 17;
            break;

          case 16:
            if (oPGPDecryptionResult.notices && _.indexOf(oPGPDecryptionResult.notices, Enums.OpenPgpErrors.VerifyErrorNotice) !== -1) {
              Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_SIGNATURE_NOT_VERIFIED'));
            }

          case 17:
            //file decryption
            sKey = oPGPDecryptionResult.result;
            _context2.next = 20;
            return this.decryptAsSingleChunk(oBlob, sKey, sInitializationVector);

          case 20:
            oDecryptedFileData = _context2.sent;

            //save decrypted file
            if (oDecryptedFileData) {
              oResBlob = new Blob([oDecryptedFileData], {
                type: "octet/stream",
                lastModified: new Date()
              });
              oResult.result = true;
              oResult.blob = oResBlob;
            }

          case 22:
            return _context2.abrupt("return", oResult);

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2["catch"](1);
            return _context2.abrupt("return", oResult);

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 25]]);
  }));

  return function (_x7, _x8, _x9, _x10, _x11, _x12) {
    return _ref2.apply(this, arguments);
  };
}();

OpenPgpFileProcessor.createPublicLink = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(sType, sPath, sFileName, iSize) {
    var _this = this;

    var bEncryptLink,
        sRecipientEmail,
        sPgpEncryptionMode,
        iLifetimeHrs,
        bIsFolder,
        sLink,
        oResult,
        sPassword,
        oPromiseCreatePublicLink,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            bEncryptLink = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : false;
            sRecipientEmail = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : '';
            sPgpEncryptionMode = _args3.length > 6 && _args3[6] !== undefined ? _args3[6] : '';
            iLifetimeHrs = _args3.length > 7 && _args3[7] !== undefined ? _args3[7] : 0;
            bIsFolder = _args3.length > 8 && _args3[8] !== undefined ? _args3[8] : false;
            sLink = '';
            oResult = {
              result: false
            };
            sPassword = bEncryptLink || sPgpEncryptionMode === Enums.EncryptionBasedOn.Password ? OpenPgpEncryptor.generatePassword() : '';
            oPromiseCreatePublicLink = new Promise(function (resolve, reject) {
              var fResponseCallback = function fResponseCallback(oResponse, oRequest) {
                if (oResponse.Result && oResponse.Result.link) {
                  resolve(oResponse.Result.link);
                }

                reject(new Error(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_PUBLIC_LINK_CREATION')));
              };

              var oParams = {
                'Type': sType,
                'Path': sPath,
                'Name': sFileName,
                'Size': iSize,
                'IsFolder': bIsFolder,
                'RecipientEmail': sRecipientEmail,
                'PgpEncryptionMode': sPgpEncryptionMode,
                'LifetimeHrs': iLifetimeHrs
              };

              if (bEncryptLink) {
                oParams.Password = sPassword;
              }

              Ajax.send('OpenPgpFilesWebclient', 'CreatePublicLink', oParams, fResponseCallback, _this);
            });
            _context3.prev = 9;
            _context3.next = 12;
            return oPromiseCreatePublicLink;

          case 12:
            sLink = _context3.sent;
            oResult.result = true;
            oResult.link = sLink;
            oResult.password = sPassword;
            _context3.next = 21;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](9);

            if (_context3.t0 && _context3.t0.message) {
              Screens.showError(_context3.t0.message);
            }

          case 21:
            return _context3.abrupt("return", oResult);

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[9, 18]]);
  }));

  return function (_x13, _x14, _x15, _x16) {
    return _ref3.apply(this, arguments);
  };
}();

OpenPgpFileProcessor.getFileContentByUrl = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(sDownloadUrl, onDownloadProgressCallback) {
    var response, reader, iReceivedLength, aChunks, _yield$reader$read, done, value;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return fetch(sDownloadUrl);

          case 2:
            response = _context4.sent;

            if (!response.ok) {
              _context4.next = 23;
              break;
            }

            reader = response.body.getReader();
            iReceivedLength = 0;
            aChunks = [];

          case 7:
            if (false) {}

            _context4.next = 10;
            return reader.read();

          case 10:
            _yield$reader$read = _context4.sent;
            done = _yield$reader$read.done;
            value = _yield$reader$read.value;

            if (!done) {
              _context4.next = 15;
              break;
            }

            return _context4.abrupt("break", 20);

          case 15:
            iReceivedLength += value.length;
            aChunks.push(value);

            if (_.isFunction(onDownloadProgressCallback)) {
              onDownloadProgressCallback(iReceivedLength);
            }

            _context4.next = 7;
            break;

          case 20:
            return _context4.abrupt("return", new Blob(aChunks));

          case 23:
            return _context4.abrupt("return", false);

          case 24:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x17, _x18) {
    return _ref4.apply(this, arguments);
  };
}();

OpenPgpFileProcessor.saveBlob = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(oBlob, sFileName) {
    var blobUrl, link;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!(window.navigator && window.navigator.msSaveOrOpenBlob)) {
              _context5.next = 3;
              break;
            }

            window.navigator.msSaveOrOpenBlob(oBlob, sFileName);
            return _context5.abrupt("return");

          case 3:
            blobUrl = window.URL.createObjectURL(oBlob);
            link = document.createElement("a");
            link.href = blobUrl;
            link.download = sFileName;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(blobUrl);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x19, _x20) {
    return _ref5.apply(this, arguments);
  };
}();

OpenPgpFileProcessor.processFileDecryption = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(sFileName, sDownloadUrl, sRecipientEmail, sPassword, sEncryptionMode, sParanoidKeyPublic, sInitializationVector) {
    var oBlob, oDecryptionResult;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return this.getFileContentByUrl(sDownloadUrl);

          case 2:
            oBlob = _context6.sent;

            if (!(oBlob instanceof Blob)) {
              _context6.next = 10;
              break;
            }

            _context6.next = 6;
            return this.decryptFile(oBlob, sRecipientEmail, sPassword, sEncryptionMode === Enums.EncryptionBasedOn.Password, sParanoidKeyPublic, sInitializationVector);

          case 6:
            oDecryptionResult = _context6.sent;

            if (oDecryptionResult.result) {
              this.saveBlob(oDecryptionResult.blob, sFileName);
            } else {
              Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_ON_DOWNLOAD'));
            }

            _context6.next = 11;
            break;

          case 10:
            Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_ON_DOWNLOAD'));

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function (_x21, _x22, _x23, _x24, _x25, _x26, _x27) {
    return _ref6.apply(this, arguments);
  };
}();

OpenPgpFileProcessor.getFileNameForDownload = function (sFileName, sRecipientEmail) {
  var sFileNameWithoutExtension = Utils.getFileNameWithoutExtension(sFileName);
  var sDelimiter = '_' + sRecipientEmail;
  var aNameParts = sFileNameWithoutExtension.split(sDelimiter);
  var sNewName = '';

  if (aNameParts.length <= 2) {
    sNewName = aNameParts.join('');
  } else {
    //If the files name contains more than one entry of a recipient email, only the last entry is removed
    for (var i = 0; i < aNameParts.length; i++) {
      sNewName += aNameParts[i];
      sNewName += i < aNameParts.length - 2 ? sDelimiter : '';
    }
  }

  return sNewName;
};

OpenPgpFileProcessor.updateFileExtendedProps = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(oFile, oExtendedProps) {
    var _this2 = this;

    var oPromiseUpdateExtendedProps;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            //Update file extended props
            oPromiseUpdateExtendedProps = new Promise(function (resolve, reject) {
              Ajax.send('Files', 'UpdateExtendedProps', {
                Type: oFile.storageType(),
                Path: oFile.path(),
                Name: oFile.fileName(),
                ExtendedProps: oExtendedProps
              }, function (oResponse) {
                if (oResponse.Result === true) {
                  resolve(true);
                }

                resolve(false);
              }, _this2);
            });
            _context7.next = 3;
            return oPromiseUpdateExtendedProps;

          case 3:
            return _context7.abrupt("return", _context7.sent);

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x28, _x29) {
    return _ref7.apply(this, arguments);
  };
}();

OpenPgpFileProcessor.decryptAsSingleChunk = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(oBlob, sKey, sInitializationVector) {
    var oKey, aEncryptedData, oDecryptedArrayBuffer;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return JscryptoKey.getKeyFromString(sKey);

          case 2:
            oKey = _context8.sent;
            _context8.next = 5;
            return new Response(oBlob).arrayBuffer();

          case 5:
            aEncryptedData = _context8.sent;
            _context8.next = 8;
            return crypto.subtle.decrypt({
              name: 'AES-CBC',
              iv: new Uint8Array(HexUtils.HexString2Array(sInitializationVector))
            }, oKey, aEncryptedData);

          case 8:
            oDecryptedArrayBuffer = _context8.sent;
            return _context8.abrupt("return", new Uint8Array(oDecryptedArrayBuffer));

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x30, _x31, _x32) {
    return _ref8.apply(this, arguments);
  };
}();

module.exports = OpenPgpFileProcessor;

/***/ }),

/***/ "aM3T":
/*!***************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/Enums.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    Enums = {};
/**
 * @enum {number}
 */


Enums.OpenPgpErrors = {
  'UnknownError': 0,
  'UnknownNotice': 1,
  'InvalidArgumentError': 2,
  'GenerateKeyError': 10,
  'ImportKeyError': 20,
  'ImportNoKeysFoundError': 21,
  'PrivateKeyNotFoundError': 30,
  'PublicKeyNotFoundError': 31,
  'KeyIsNotDecodedError': 32,
  'SignError': 40,
  'VerifyError': 41,
  'EncryptError': 42,
  'DecryptError': 43,
  'SignAndEncryptError': 44,
  'VerifyAndDecryptError': 45,
  'PasswordDecryptError': 46,
  'CanNotReadMessage': 50,
  'CanNotReadKey': 51,
  'DeleteError': 60,
  'PublicKeyNotFoundNotice': 70,
  'PrivateKeyNotFoundNotice': 71,
  'VerifyErrorNotice': 72,
  'NoSignDataNotice': 73
};
/**
 * @enum {string}
 */

Enums.PgpAction = {
  'Import': 'import',
  'Generate': 'generate',
  'Encrypt': 'encrypt',
  'Sign': 'sign',
  'EncryptSign': 'encrypt-sign',
  'Verify': 'ferify',
  'DecryptVerify': 'decrypt-ferify'
};
/**
 * @enum {string}
 */

Enums.EncryptionBasedOn = {
  'Password': 'password',
  'Key': 'key'
};

if (typeof window.Enums === 'undefined') {
  window.Enums = {};
}

_.extendOwn(window.Enums, Enums);

/***/ }),

/***/ "cGGv":
/*!***************************************************************!*\
  !*** ./modules/CoreWebclient/js/models/CAbstractFileModel.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	moment = __webpack_require__(/*! moment */ "wd/R"),

	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	FilesUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Files.js */ "QFUI"),
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	WindowOpener = __webpack_require__(/*! modules/CoreWebclient/js/WindowOpener.js */ "ZCBP"),
	
	aViewMimeTypes = [
		'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
		'text/html', 'text/plain', 'text/css',
		'text/rfc822-headers', 'message/delivery-status',
		'application/x-httpd-php', 'application/javascript'
	],
	
	aViewExtensions = []
;

if ($('html').hasClass('pdf'))
{
	aViewMimeTypes.push('application/pdf');
	aViewMimeTypes.push('application/x-pdf');
}

/**
 * @constructor
 */
function CAbstractFileModel()
{
	this.id = ko.observable('');
	this.index = ko.observable(0);
	this.fileName = ko.observable('');
	this.tempName = ko.observable('');
	this.displayName = ko.observable('');
	this.extension = ko.observable('');
	
	this.fileName.subscribe(function (sFileName) {
		this.id(sFileName);
		this.displayName(sFileName);
		this.extension(Utils.getFileExtension(sFileName));
	}, this);
	
	this.size = ko.observable(0);
	this.friendlySize = ko.computed(function () {
		return this.size() > 0 ? TextUtils.getFriendlySize(this.size()) : '';
	}, this);
	
	this.hash = ko.observable('');
	
	this.thumbUrlInQueue = ko.observable('');
	this.thumbUrlInQueueSubscribtion = this.thumbUrlInQueue.subscribe(function () {
		this.getInThumbQueue();
	}, this);

	this.thumbnailSrc = ko.observable('');
	this.thumbnailLoaded = ko.observable(false);
	this.thumbnailSessionUid = ko.observable('');

	this.mimeType = ko.observable('');
	this.uploadUid = ko.observable('');
	this.uploaded = ko.observable(false);
	this.uploadError = ko.observable(false);
	this.downloading = ko.observable(false);
	this.isViewMimeType = ko.computed(function () {
		return (-1 !== $.inArray(this.mimeType(), aViewMimeTypes));
	}, this);
	this.bHasHtmlEmbed = false;
	
	this.otherTemplates = ko.observableArray([]);

	// Some modules can override this field if it is necessary to manage it.
	this.visibleCancelButton = ko.observable(true);
	
	this.statusText = ko.observable('');
	this.statusTooltip = ko.computed(function () {
		return this.uploadError() ? this.statusText() : '';
	}, this);
	this.progressPercent = ko.observable(0);
	this.visibleProgress = ko.observable(false);
	
	this.uploadStarted = ko.observable(false);
	this.uploadStarted.subscribe(function () {
		if (this.uploadStarted())
		{
			this.uploaded(false);
			this.visibleProgress(true);
			this.progressPercent(20);
		}
		else
		{
			this.progressPercent(100);
			this.visibleProgress(false);
			this.uploaded(true);
		}
	}, this);
	
	this.downloading.subscribe(function () {
		if (this.downloading())
		{
			this.visibleProgress(true);
		}
		else
		{
			this.visibleProgress(false);
			this.progressPercent(0);
		}
	}, this);
	
	this.allowDrag = ko.observable(false);
	this.allowUpload = ko.observable(false);
	this.allowPublicLink = ko.observable(false);
	this.bIsSecure = ko.observable(false);
	this.isShared = ko.observable(false);
	
	this.sHeaderText = '';

	this.oActionsData = {
		'view': {
			'Text': TextUtils.i18n('COREWEBCLIENT/ACTION_VIEW_FILE'),
			'HandlerName': 'viewFile'
		},
		'download': {
			'Text': TextUtils.i18n('COREWEBCLIENT/ACTION_DOWNLOAD_FILE'),
			'HandlerName': 'downloadFile',
			'Tooltip': ko.computed(function () {
				var sTitle = TextUtils.i18n('COREWEBCLIENT/INFO_CLICK_TO_DOWNLOAD_FILE', {
					'FILENAME': this.fileName(),
					'SIZE': this.friendlySize()
				});

				if (this.friendlySize() === '')
				{
					sTitle = sTitle.replace(' ()', '');
				}

				return sTitle;
			}, this)
		}
	};
	
	this.allowActions = ko.observable(true);
	
	this.iconAction = ko.observable('download');
	
	this.cssClasses = ko.computed(function () {
		return this.getCommonClasses().join(' ');
	}, this);
	
	this.actions = ko.observableArray([]);
	
	this.firstAction = ko.computed(function () {
		if (this.actions().length > 1)
		{
			return this.actions()[0];
		}
		return '';
	}, this);
	
	this.secondAction = ko.computed(function () {
		if (this.actions().length === 1)
		{
			return this.actions()[0];
		}
		if (this.actions().length > 1)
		{
			return this.actions()[1];
		}
		return '';
	}, this);
	
	this.subFiles = ko.observableArray([]);
	this.subFilesExpanded = ko.observable(false);
	
	this.sUploadSubFolder = '';
	this.bIsHidden = false;
}

CAbstractFileModel.prototype.addAction = function (sAction, bMain, oActionData)
{
	if (bMain)
	{
		this.actions.unshift(sAction);
	}
	else
	{
		this.actions.push(sAction);
	}
	this.actions(_.compact(this.actions()));
	if (oActionData)
	{
		this.oActionsData[sAction] = oActionData;
	}
};

CAbstractFileModel.prototype.removeAction = function (sAction)
{
	this.actions(_.without(this.actions(), sAction));
};

CAbstractFileModel.prototype.getMainAction = function ()
{
	return this.actions()[0];
};

CAbstractFileModel.prototype.hasAction = function (sAction)
{
	return _.indexOf(this.actions(), sAction) !== -1;
};

/**
 * Returns button text for specified action.
 * @param {string} sAction
 * @returns string
 */
CAbstractFileModel.prototype.getActionText = function (sAction)
{
	if (this.hasAction(sAction) && this.oActionsData[sAction] && (typeof this.oActionsData[sAction].Text === 'string' || _.isFunction(this.oActionsData[sAction].Text)))
	{
		return _.isFunction(this.oActionsData[sAction].Text) ? this.oActionsData[sAction].Text() : this.oActionsData[sAction].Text;
	}
	return '';
};

CAbstractFileModel.prototype.getActionUrl = function (sAction)
{
	return (this.hasAction(sAction) && this.oActionsData[sAction]) ? (this.oActionsData[sAction].Url || '') : '';
};

/**
 * Executes specified action.
 * @param {string} sAction
 */
CAbstractFileModel.prototype.executeAction = function (sAction)
{
	var oData = this.hasAction(sAction) && this.oActionsData[sAction];
	if (oData)
	{
		if (_.isFunction(oData.Handler)) {
			oData.Handler();
		}
		else if (typeof oData.HandlerName === 'string' && _.isFunction(this[oData.HandlerName]))
		{
			this[oData.HandlerName]();
		}
	}
};

/**
 * Returns tooltip for specified action.
 * @param {string} sAction
 * @returns string
 */
CAbstractFileModel.prototype.getTooltip = function (sAction)
{
	var mTootip = this.hasAction(sAction) && this.oActionsData[sAction] ? this.oActionsData[sAction].Tooltip : '';
	if (typeof mTootip === 'string')
	{
		return mTootip;
	}
	if (_.isFunction(mTootip))
	{
		return mTootip();
	}
	return '';
};

/**
 * Returns list of css classes for file.
 * @returns array
 */
CAbstractFileModel.prototype.getCommonClasses = function ()
{
	var aClasses = [];

	if ((this.allowUpload() && !this.uploaded()) || this.downloading())
	{
		aClasses.push('incomplete');
	}
	if (this.uploadError())
	{
		aClasses.push('fail');
	}
	else
	{
		aClasses.push('success');
	}

	return aClasses;
};

/**
 * Parses attachment data from server.
 * @param {AjaxAttachmenResponse} oData
 */
CAbstractFileModel.prototype.parse = function (oData)
{
	this.fileName(Types.pString(oData.FileName));
	this.tempName(Types.pString(oData.TempName));
	if (this.tempName() === '')
	{
		this.tempName(this.fileName());
	}

	this.mimeType(Types.pString(oData.MimeType));
	this.size(oData.EstimatedSize ? Types.pInt(oData.EstimatedSize) : Types.pInt(oData.SizeInBytes));

	this.hash(Types.pString(oData.Hash));

	this.parseActions(oData);

	this.uploadUid(this.hash());
	this.uploaded(true);

	if ($.isFunction(this.additionalParse))
	{
		this.additionalParse(oData);
	}
};

CAbstractFileModel.prototype.parseActions = function (oData)
{
	this.thumbUrlInQueue(Types.pString(oData.ThumbnailUrl) !== '' ? Types.pString(oData.ThumbnailUrl) + '/' + Math.random() : '');
	this.commonParseActions(oData);
	this.commonExcludeActions();
};

CAbstractFileModel.prototype.commonExcludeActions = function ()
{
	if (!this.isViewSupported())
	{
		this.actions(_.without(this.actions(), 'view'));
	}
};

CAbstractFileModel.prototype.commonParseActions = function (oData)
{
	_.each (oData.Actions, function (oData, sAction) {
		if (!this.oActionsData[sAction])
		{
			this.oActionsData[sAction] = {};
		}
		this.oActionsData[sAction].Url = Types.pString(oData.url);
		this.actions.push(sAction);
	}, this);
};

CAbstractFileModel.addViewExtensions = function (aAddViewExtensions)
{
	if (_.isArray(aAddViewExtensions))
	{
		aViewExtensions = _.union(aViewExtensions, aAddViewExtensions);
	}
};

CAbstractFileModel.prototype.isViewSupported = function ()
{
	return (-1 !== $.inArray(this.mimeType(), aViewMimeTypes) || -1 !== $.inArray(this.extension(), aViewExtensions));
};

CAbstractFileModel.prototype.getInThumbQueue = function ()
{
	if(this.thumbUrlInQueue() !== '' && (!this.linked || this.linked && !this.linked()))
	{
		this.thumbnailSessionUid(Date.now().toString());
		FilesUtils.thumbQueue(this.thumbnailSessionUid(), this.thumbUrlInQueue(), this.thumbnailSrc);
	}
};

/**
 * Starts downloading attachment on click.
 */
CAbstractFileModel.prototype.downloadFile = function (bNotBroadcastEvent)
{
	//todo: UrlUtils.downloadByUrl in nessesary context in new window
	var 
		sDownloadLink = this.getActionUrl('download'),
		oParams = {
			'File': this,
			'CancelDownload': false
		}
	;
	if (sDownloadLink.length > 0 && sDownloadLink !== '#')
	{
		if (!bNotBroadcastEvent)
		{
			App.broadcastEvent('AbstractFileModel::FileDownload::before', oParams);
		}
		if (!oParams.CancelDownload)
		{
			if (_.isFunction(oParams.CustomDownloadHandler))
			{
				oParams.CustomDownloadHandler();
			}
			else
			{
				sDownloadLink += '/' + moment().unix();
				UrlUtils.downloadByUrl(sDownloadLink, this.extension() === 'eml');
			}
		}
	}
};

/**
 * Can be overridden.
 * Starts viewing attachment on click.
 * @param {Object} oViewModel
 * @param {Object} oEvent
 */
CAbstractFileModel.prototype.viewFile = function (oViewModel, oEvent)
{
	Utils.calmEvent(oEvent);
	this.viewCommonFile();
};

/**
 * Starts viewing attachment on click.
 * @param {string=} sUrl
 */
CAbstractFileModel.prototype.viewCommonFile = function (sUrl)
{
	var 
		oWin = null,
		oParams = null
	;
	
	if (!Types.isNonEmptyString(sUrl))
	{
		sUrl = UrlUtils.getAppPath() + this.getActionUrl('view');
	}

	if (sUrl.length > 0 && sUrl !== '#')
	{
		oParams = {sUrl: sUrl, index: this.index(), bBreakView: false};
		
		App.broadcastEvent('AbstractFileModel::FileView::before', oParams);
		
		if (!oParams.bBreakView)
		{
			oWin = WindowOpener.open(oParams.sUrl, oParams.sUrl, false);

			if (oWin)
			{
				oWin.focus();
			}
		}
	}
};

/**
 * @param {Object} oAttachment
 * @param {*} oEvent
 * @return {boolean}
 */
CAbstractFileModel.prototype.eventDragStart = function (oAttachment, oEvent)
{
	var oLocalEvent = oEvent.originalEvent || oEvent;
	if (oAttachment && oLocalEvent && oLocalEvent.dataTransfer && oLocalEvent.dataTransfer.setData)
	{
		oLocalEvent.dataTransfer.setData('DownloadURL', this.generateTransferDownloadUrl());
	}

	return true;
};

/**
 * @return {string}
 */
CAbstractFileModel.prototype.generateTransferDownloadUrl = function ()
{
	var sLink = this.getActionUrl('download');
	if ('http' !== sLink.substr(0, 4))
	{
		sLink = UrlUtils.getAppPath() + sLink;
	}

	return this.mimeType() + ':' + this.fileName() + ':' + sLink;
};

/**
 * Fills attachment data for upload.
 *
 * @param {string} sFileUid
 * @param {Object} oFileData
 * @param {bool} bOnlyUploadStatus
 */
CAbstractFileModel.prototype.onUploadSelect = function (sFileUid, oFileData, bOnlyUploadStatus)
{
	if (!bOnlyUploadStatus)
	{
		this.fileName(Types.pString(oFileData['FileName']));
		this.mimeType(Types.pString(oFileData['Type']));
		this.size(Types.pInt(oFileData['Size']));
	}
	
	this.uploadUid(sFileUid);
	this.uploaded(false);
	this.statusText('');
	this.progressPercent(0);
	this.visibleProgress(false);
	
	// if uploading file is from uploading folder it should be hidden in files list.
	this.sUploadSubFolder = Types.pString(oFileData.Folder);
	this.bIsHidden = this.sUploadSubFolder !== '';
};

/**
 * Starts progress.
 */
CAbstractFileModel.prototype.onUploadStart = function ()
{
	this.visibleProgress(true);
};

/**
 * Fills progress upload data.
 *
 * @param {number} iUploadedSize
 * @param {number} iTotalSize
 */
CAbstractFileModel.prototype.onUploadProgress = function (iUploadedSize, iTotalSize)
{
	if (iTotalSize > 0)
	{
		this.progressPercent(Math.ceil(iUploadedSize / iTotalSize * 100));
		this.visibleProgress(true);
	}
};

/**
 * Fills progress download data.
 *
 * @param {number} iDownloadedSize
 * @param {number} iTotalSize
 */
CAbstractFileModel.prototype.onDownloadProgress = function (iDownloadedSize, iTotalSize)
{
	if (iTotalSize > 0)
	{
		this.progressPercent(Math.ceil(iDownloadedSize / iTotalSize * 100));
		this.visibleProgress(this.progressPercent() < 100);
	}
};

/**
 * Fills data when upload has completed.
 *
 * @param {string} sFileUid
 * @param {boolean} bResponseReceived
 * @param {Object} oResponse
 */
CAbstractFileModel.prototype.onUploadComplete = function (sFileUid, bResponseReceived, oResponse)
{
	var
		bError = !bResponseReceived || !oResponse || !!oResponse.ErrorCode || !oResponse.Result || !!oResponse.Result.Error || false,
		sError = (oResponse && oResponse.ErrorCode && oResponse.ErrorCode === Enums.Errors.CanNotUploadFileLimit) ?
			TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_SIZE') :
			TextUtils.i18n('COREWEBCLIENT/ERROR_UPLOAD_UNKNOWN')
	;

	this.progressPercent(0);
	this.visibleProgress(false);
	
	this.uploaded(true);
	this.uploadError(bError);
	this.statusText(bError ? sError : TextUtils.i18n('COREWEBCLIENT/REPORT_UPLOAD_COMPLETE'));

	if (!bError)
	{
		this.fillDataAfterUploadComplete(oResponse, sFileUid);
		
		setTimeout((function (self) {
			return function () {
				self.statusText('');
			};
		})(this), 3000);
	}
};

/**
 * Should be overriden.
 * 
 * @param {Object} oResult
 * @param {string} sFileUid
 */
CAbstractFileModel.prototype.fillDataAfterUploadComplete = function (oResult, sFileUid)
{
};

/**
 * @param {Object} oAttachmentModel
 * @param {Object} oEvent
 */
CAbstractFileModel.prototype.onImageLoad = function (oAttachmentModel, oEvent)
{
	if(this.thumbUrlInQueue() !== '' && !this.thumbnailLoaded())
	{
		this.thumbnailLoaded(true);
		FilesUtils.thumbQueue(this.thumbnailSessionUid());
	}
};

/**
 * Signalise that file download was stoped.
 */
CAbstractFileModel.prototype.stopDownloading = function ()
{
	this.downloading(false);
};

/**
 * Signalise that file download was started.
 */
CAbstractFileModel.prototype.startDownloading = function ()
{
	this.downloading(true);
};

module.exports = CAbstractFileModel;


/***/ }),

/***/ "mtgd":
/*!********************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/EncryptKeyPasswordPopup.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT");
/**
 * @constructor
 */


function CEncryptKeyPasswordPopup() {
  CAbstractPopup.call(this);
  this.keyPassword = ko.observable('');
  this.keyPasswordConfirm = ko.observable('');
  this.fOnPasswordEnterCallback = null;
  this.fOnWrongPasswordCallback = null;
  this.fOnCancellCallback = null;
}

_.extendOwn(CEncryptKeyPasswordPopup.prototype, CAbstractPopup.prototype);

CEncryptKeyPasswordPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_EncryptKeyPasswordPopup';

CEncryptKeyPasswordPopup.prototype.onOpen = function (fOnPasswordEnterCallback, fOnCancellCallback) {
  this.fOnPasswordEnterCallback = fOnPasswordEnterCallback;
  this.fOnCancellCallback = fOnCancellCallback;
};

CEncryptKeyPasswordPopup.prototype.encryptKey = function () {
  if ($.trim(this.keyPassword()) === '') {
    this.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_PASSWORD_CANT_BE_BLANK'));
  } else if ($.trim(this.keyPassword()) !== $.trim(this.keyPasswordConfirm())) {
    this.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
  } else {
    if (_.isFunction(this.fOnPasswordEnterCallback)) {
      this.fOnPasswordEnterCallback($.trim(this.keyPassword()));
    }

    this.closePopup();
  }
};

CEncryptKeyPasswordPopup.prototype.cancelPopup = function () {
  if (_.isFunction(this.fOnCancellCallback)) {
    this.fOnCancellCallback();
  }

  this.closePopup();
};

CEncryptKeyPasswordPopup.prototype.onShow = function () {
  this.keyPassword('');
  this.keyPasswordConfirm('');
};

CEncryptKeyPasswordPopup.prototype.showError = function (sMessage) {
  Screens.showError(sMessage);
};

module.exports = new CEncryptKeyPasswordPopup();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "EVdn")))

/***/ }),

/***/ "sWn8":
/*!*****************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/manager.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! modules/OpenPgpFilesWebclient/js/Enums.js */ "aM3T");

function IsPgpSupported() {
  return !!(window.crypto && window.crypto.getRandomValues);
}

module.exports = function (oAppData) {
  if (!IsPgpSupported()) {
    return null;
  }

  var App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
      Settings = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/Settings.js */ "+x5O"),
      Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
      CFileModel = __webpack_require__(/*! modules/FilesWebclient/js/models/CFileModel.js */ "Pg7U"),
      oButtonsView = null;

  Settings.init(oAppData);

  function getButtonView() {
    if (!oButtonsView) {
      oButtonsView = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/views/ButtonsView.js */ "LToI");
    }

    return oButtonsView;
  }

  if (App.isMobile() && App.isPublic()) {
    __webpack_require__(/*! node_modules/framework7/dist/css/framework7.material.css */ "lVyM");
  }

  if (App.isPublic()) {
    return {
      getScreens: function getScreens() {
        var oScreens = {};

        oScreens[Settings.HashModuleName] = function () {
          var CFileView = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/views/CFileView.js */ "vnSc");

          return new CFileView();
        };

        if (Settings.EnableSelfDestructingMessages) {
          oScreens[Settings.SelfDestructMessageHash] = function () {
            var CSelfDestructingEncryptedMessageView = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/views/CSelfDestructingEncryptedMessageView.js */ "U1dG");

            return new CSelfDestructingEncryptedMessageView();
          };
        }

        return oScreens;
      }
    };
  } else if (App.isUserNormalOrTenant()) {
    return {
      start: function start(ModulesManager) {
        var SharePopup = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/popups/SharePopup.js */ "3vk+");

        ModulesManager.run('FilesWebclient', 'registerToolbarButtons', [getButtonView()]);

        if (Settings.EnableSelfDestructingMessages) {
          ModulesManager.run('MailWebclient', 'registerComposeToolbarController', [__webpack_require__(/*! modules/OpenPgpFilesWebclient/js/views/ComposeButtonsView.js */ "scms")]);
        }

        App.subscribeEvent('FilesWebclient::ConstructView::after', function (oParams) {
          var fParentHandler = oParams.View.onShareIconClick;

          oParams.View.onShareIconClick = function (oItem) {
            // Conditions for button activity:
            // Personal: one file or one folder
            // Corporate: one file or one folder
            // Encrypted: one file only
            // Shared: nothing
            if (oItem && (oParams.View.storageType() === Enums.FileStorageType.Personal || oParams.View.storageType() === Enums.FileStorageType.Corporate || oParams.View.storageType() === Enums.FileStorageType.Encrypted && oItem.IS_FILE)) {
              Popups.showPopup(SharePopup, [oItem]);
            } else {
              fParentHandler(oItem);
            }
          };
        });
      }
    };
  }

  return null;
};

/***/ }),

/***/ "scms":
/*!**********************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/views/ComposeButtonsView.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ko = __webpack_require__(/*! knockout */ "0h2I"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    SelfDestructingEncryptedMessagePopup = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/popups/SelfDestructingEncryptedMessagePopup.js */ "vpzY");
/**
 * @constructor for object that display buttons "PGP Sign/Encrypt" and "Undo PGP"
 */


function CComposeButtonsView() {
  this.bSendButton = true;
  this.pgpSecured = ko.observable(false);
}

CComposeButtonsView.prototype.ViewTemplate = 'OpenPgpFilesWebclient_ComposeButtonsView';
/**
 * Assigns compose external interface.
 *
 * @param {Object} oCompose Compose external interface object.
 * @param {Function} oCompose.isHtml Returns **true** if html mode is switched on in html editor.
 * @param {Function} oCompose.hasAttachments Returns **true** if some files were attached to message.
 * @param {Function} oCompose.getPlainText Returns plain text from html editor. If html mode is switched on html text will be converted to plain and returned.
 * @param {Function} oCompose.getFromEmail Returns message sender email.
 * @param {Function} oCompose.getRecipientEmails Returns array of message recipients.
 * @param {Function} oCompose.saveSilently Saves message silently (without buttons disabling and any info messages).
 * @param {Function} oCompose.setPlainTextMode Sets plain text mode switched on.
 * @param {Function} oCompose.setPlainText Sets plain text to html editor.
 * @param {Function} oCompose.setHtmlTextMode Sets html text mode switched on.
 * @param {Function} oCompose.setHtmlText Sets html text to html editor.
 * @param {Function} oCompose.undoHtml Undo last changes in html editor.
 *
 * @param oCompose.koTextChange Triggered on changing text in compose
 *
 */

CComposeButtonsView.prototype.assignComposeExtInterface = function (oCompose) {
  this.oCompose = oCompose;
  this.oCompose.koTextChange.subscribe(function () {
    var sPlainText = oCompose.getPlainText();

    if (!oCompose.isHtml()) {
      this.pgpSecured(sPlainText.indexOf('-----BEGIN PGP MESSAGE-----') !== -1);
    }
  }, this);
};
/**
 * @param {Object} oParameters
 */


CComposeButtonsView.prototype.doAfterApplyingMainTabParameters = function (oParameters) {
  if (oParameters.OpenPgp) {
    this.pgpSecured(oParameters.OpenPgp.Secured);
  }
};
/**
 * @param {Object} oParameters
 */


CComposeButtonsView.prototype.doAfterPreparingMainTabParameters = function (oParameters) {
  oParameters.OpenPgp = {
    Secured: this.pgpSecured()
  };
};
/**
 * Receives message properties that are displayed when opening the compose popup.
 *
 * @param {Object} oMessageProps Receiving message properties.
 * @param {Boolean} oMessageProps.bDraft **true** if message was opened from drafts folder.
 * @param {Boolean} oMessageProps.bPlain **true** if opened for compose message if plain.
 * @param {String} oMessageProps.sRawText Raw plain text of opened for compose message.
 */


CComposeButtonsView.prototype.doAfterPopulatingMessage = function (oMessageProps) {
  if (oMessageProps.bPlain) {
    this.pgpSecured(oMessageProps.sRawText.indexOf('-----BEGIN PGP MESSAGE-----') !== -1);
  } else {
    this.pgpSecured(false);
  }
};

CComposeButtonsView.prototype.send = function () {
  if (this.oCompose) {
    Popups.showPopup(SelfDestructingEncryptedMessagePopup, [this.oCompose.getSubject(), this.oCompose.getPlainText(), this.oCompose.getRecipientEmails()[0] ? this.oCompose.getRecipientEmails()[0] : null, this.oCompose.getFromEmail(), this.oCompose.getSelectedSender()]);
  }
};
/**
 * Determines if sending a message is allowed.
 */


CComposeButtonsView.prototype.isEnableSending = function () {
  return this.oCompose && !this.pgpSecured();
};

module.exports = new CComposeButtonsView();

/***/ }),

/***/ "vnSc":
/*!*************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/views/CFileView.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    moment = __webpack_require__(/*! moment */ "wd/R"),
    videojs = __webpack_require__(/*! video.js */ "8OJ3")["default"],
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
    Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    Settings = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/Settings.js */ "+x5O"),
    Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
    CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "xcwT"),
    OpenPgpFileProcessor = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/OpenPgpFileProcessor.js */ "Xu4A"),
    OpenPgpEncryptor = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpEncryptor');

__webpack_require__(/*! modules/OpenPgpFilesWebclient/styles/vendors/video-js.css */ "3kVj");
/**
* @constructor
*/


function CFileView() {
  CAbstractScreenView.call(this, 'OpenPgpFilesWebclient');
  this.aSupportedVideoExt = ['mp4', 'url'];
  this.aSupportedAudioExt = ['mp3'];
  this.ExpireDate = Settings.PublicFileData.ExpireDate ? moment.unix(Settings.PublicFileData.ExpireDate).format("YYYY-MM-DD HH:mm:ss") : '';
  this.ExpireDateMessage = Settings.PublicFileData.ExpireDate ? TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_MESSAGE_LIFETIME', {
    'DATETIME': this.ExpireDate
  }) : null;
  this.password = ko.observable('');
  this.isDecryptionAvailable = ko.observable(false);
  this.isDownloadingAndDecrypting = ko.observable(false);
  this.browserTitle = ko.observable(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HEADING_BROWSER_TAB'));
  this.hash = Settings.PublicFileData.Hash ? Settings.PublicFileData.Hash : '';
  this.fileName = Settings.PublicFileData.Name ? Settings.PublicFileData.Name : '';
  this.fileSize = Settings.PublicFileData.Size ? Settings.PublicFileData.Size : '';
  this.fileUrl = Settings.PublicFileData.Url ? Settings.PublicFileData.Url : '';
  this.encryptionMode = Settings.PublicFileData.PgpEncryptionMode ? Settings.PublicFileData.PgpEncryptionMode : '';
  this.recipientEmail = Settings.PublicFileData.PgpEncryptionRecipientEmail ? Settings.PublicFileData.PgpEncryptionRecipientEmail : '';
  this.bSecuredLink = !!Settings.PublicFileData.IsSecuredLink;
  this.isUrlFile = Settings.PublicFileData.IsUrlFile ? Settings.PublicFileData.IsUrlFile : false;
  this.sParanoidKeyPublic = Settings.PublicFileData.ParanoidKeyPublic ? Settings.PublicFileData.ParanoidKeyPublic : '';
  this.sInitializationVector = Settings.PublicFileData.InitializationVector ? Settings.PublicFileData.InitializationVector : '';
  this.bShowPlayButton = ko.observable(false);
  this.bShowVideoPlayer = ko.observable(false);
  this.bShowAudioPlayer = ko.observable(false);
  this.koShowPassword = ko.computed(function () {
    return (this.isDecryptionAvailable() || this.bSecuredLink) && !this.bShowVideoPlayer() && !this.bShowAudioPlayer();
  }, this);
  this.isMedia = ko.observable(false);

  if (this.bSecuredLink) {
    this.passwordLabel = TextUtils.i18n('OPENPGPFILESWEBCLIENT/LABEL_ENTER_PASSWORD');
  } else {
    switch (this.encryptionMode) {
      case Enums.EncryptionBasedOn.Key:
        this.passwordLabel = TextUtils.i18n('OPENPGPFILESWEBCLIENT/LABEL_ENTER_PASSPHRASE', {
          'KEY': this.recipientEmail
        });
        this.isDecryptionAvailable(true);
        break;

      case Enums.EncryptionBasedOn.Password:
        this.passwordLabel = TextUtils.i18n('OPENPGPFILESWEBCLIENT/LABEL_ENTER_PASSWORD');
        this.isDecryptionAvailable(true);
        break;

      default:
        //Encryption mode not defined
        this.passwordLabel = "";
    }
  }
}

_.extendOwn(CFileView.prototype, CAbstractScreenView.prototype);

CFileView.prototype.ViewTemplate = 'OpenPgpFilesWebclient_FileView';
CFileView.prototype.ViewConstructorName = 'CFileView';
CFileView.prototype.onShow = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var isVideo, isAudio, sSrc;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          isVideo = this.isFileVideo(this.fileName);
          isAudio = this.isFileAudio(this.fileName);
          this.isMedia(isVideo || isAudio || this.isUrlFile);
          this.bShowPlayButton(this.bSecuredLink && this.isMedia());

          if (!this.bSecuredLink) {
            sSrc = this.fileUrl;

            if (!this.isUrlFile) {
              sSrc = UrlUtils.getAppPath() + sSrc;
            }

            if (this.isUrlFile) {
              this.showVideoStreamPlayer(sSrc);
            } else if (isVideo) {
              this.showVideoPlayer(sSrc);
            } else if (isAudio) {
              this.showAudioPlayer(sSrc);
            }
          }

          if (!(this.encryptionMode === Enums.EncryptionBasedOn.Key)) {
            _context.next = 9;
            break;
          }

          _context.next = 8;
          return OpenPgpEncryptor.oPromiseInitialised;

        case 8:
          this.isDecryptionAvailable(!OpenPgpEncryptor.findKeysByEmails([this.recipientEmail], false).length <= 0);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));
CFileView.prototype.downloadAndDecryptFile = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(this.encryptionMode === Enums.EncryptionBasedOn.Password && this.password() === '')) {
            _context2.next = 4;
            break;
          }

          Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_EMPTY_PASSWORD'));
          _context2.next = 8;
          break;

        case 4:
          this.isDownloadingAndDecrypting(true);
          _context2.next = 7;
          return OpenPgpFileProcessor.processFileDecryption(this.fileName, this.fileUrl, this.recipientEmail, this.password(), this.encryptionMode, this.sParanoidKeyPublic, this.sInitializationVector);

        case 7:
          this.isDownloadingAndDecrypting(false);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));

CFileView.prototype.securedLinkDownload = function () {
  if (this.password() === '') {
    Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_EMPTY_PASSWORD'));
  } else {
    if (this.isUrlFile) {
      window.location.href = this.fileUrl;
    } else {
      window.location.href = this.fileUrl + '/download/secure/' + encodeURIComponent(this.password());
    }
  }
};

CFileView.prototype.play = function () {
  var _this = this;

  if (this.password() === '') {
    Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_EMPTY_PASSWORD'));
  } else {
    Ajax.send('OpenPgpFilesWebclient', 'ValidatePublicLinkPassword', {
      'Hash': this.hash,
      'Password': this.password()
    }, function (oResponse) {
      if (oResponse.Result === true) {
        var sSrc = UrlUtils.getAppPath() + _this.fileUrl + '/download/secure/' + encodeURIComponent(_this.password());

        if (_this.isFileVideo(_this.fileName)) {
          _this.showVideoPlayer(sSrc);
        } else if (_this.isFileAudio(_this.fileName)) {
          _this.showAudioPlayer(sSrc);
        } else if (_this.isUrlFile) {
          _this.showVideoStreamPlayer(_this.fileUrl);
        }
      } else if (oResponse.Result === false) {
        Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_PASSWORD_INCORRECT'));
      } else {
        Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_UNKNOWN'));
      }
    }, this);
  }
};

CFileView.prototype.isFileVideo = function (sFileName) {
  var sExt = Utils.getFileExtension(sFileName);
  return -1 !== _.indexOf(this.aSupportedVideoExt, sExt.toLowerCase());
};

CFileView.prototype.isFileAudio = function (sFileName) {
  var sExt = Utils.getFileExtension(sFileName);
  return -1 !== _.indexOf(this.aSupportedAudioExt, sExt.toLowerCase());
};

CFileView.prototype.showVideoStreamPlayer = function (sSrc) {
  var sType = 'application/x-mpegURL';
  this.oPlayer = videojs('video-player');
  this.oPlayer.src({
    type: sType,
    src: sSrc
  });
  this.bShowVideoPlayer(true);
};

CFileView.prototype.showVideoPlayer = function (sSrc) {
  var _this2 = this;

  var sType = 'video/' + Utils.getFileExtension(this.fileName).toLowerCase();
  this.oPlayer = videojs('video-player');

  if (ModulesManager.isModuleAvailable('ActivityHistory')) {
    // play event is fired to many times
    this.oPlayer.on('loadeddata', function () {
      Ajax.send('ActivityHistory', 'CreateFromHash', {
        'Hash': _this2.hash,
        'EventName': 'play'
      });
    });
    this.oPlayer.on('ended', function () {
      Ajax.send('ActivityHistory', 'CreateFromHash', {
        'Hash': _this2.hash,
        'EventName': 'play-finish'
      });
    });
  }

  this.oPlayer.src({
    type: sType,
    src: sSrc
  });
  this.bShowVideoPlayer(true);
};

CFileView.prototype.showAudioPlayer = function (sSrc) {
  var _this3 = this;

  var sType = 'audio/' + Utils.getFileExtension(this.fileName).toLowerCase();
  this.oPlayer = videojs('audio-player');

  if (ModulesManager.isModuleAvailable('ActivityHistory')) {
    // play event is fired to many times
    this.oPlayer.on('loadeddata', function () {
      Ajax.send('ActivityHistory', 'CreateFromHash', {
        'Hash': _this3.hash,
        'EventName': 'play'
      });
    });
    this.oPlayer.on('ended', function () {
      Ajax.send('ActivityHistory', 'CreateFromHash', {
        'Hash': _this3.hash,
        'EventName': 'play-finish'
      });
    });
  }

  this.oPlayer.src({
    type: sType,
    src: sSrc
  });
  this.bShowAudioPlayer(true);
};

module.exports = CFileView;

/***/ }),

/***/ "vpzY":
/*!*****************************************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/popups/SelfDestructingEncryptedMessagePopup.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    moment = __webpack_require__(/*! moment */ "wd/R"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    ErrorsUtils = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/utils/Errors.js */ "1kFK"),
    Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
    Settings = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/Settings.js */ "+x5O"),
    UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
    OpenPgpEncryptor = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpEncryptor');
/**
 * @constructor
 */


function SelfDestructingEncryptedMessagePopup() {
  var _this = this;

  CAbstractPopup.call(this);
  this.sSubject = null;
  this.sPlainText = null;
  this.sRecipientEmail = null;
  this.sFromEmail = null;
  this.sSelectedSenderId = null;
  this.recipientAutocompleteItem = ko.observable(null);
  this.recipientAutocomplete = ko.observable('');
  this.keyBasedEncryptionDisabled = ko.observable(true);
  this.passwordBasedEncryptionDisabled = ko.observable(true);
  this.encryptionAvailable = ko.observable(false);
  this.isSuccessfullyEncryptedAndUploaded = ko.observable(false);
  this.keys = ko.observableArray([]);
  this.encryptionBasedMode = ko.observable('');
  this.recipientHintText = ko.observable(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SELECT_RECIPIENT'));
  this.encryptionModeHintText = ko.observable('');
  this.isEncrypting = ko.observable(false);
  this.encryptedFileLink = ko.observable('');
  this.encryptedFilePassword = ko.observable('');
  this.sendButtonText = ko.observable('');
  this.hintUnderEncryptionInfo = ko.observable('');
  this.sign = ko.observable(false);
  this.isSigningAvailable = ko.observable(false);
  this.isPrivateKeyAvailable = ko.observable(false);
  this.passphrase = ko.observable('');
  this.password = ko.observable('');
  this.selectedLifetimeHrs = ko.observable(null);
  this.lifetime = ko.observableArray([{
    label: "24 " + TextUtils.i18n('OPENPGPFILESWEBCLIENT/OPTION_LIFE_TIME_HOURS'),
    value: 24
  }, {
    label: "72 " + TextUtils.i18n('OPENPGPFILESWEBCLIENT/OPTION_LIFE_TIME_HOURS'),
    value: 72
  }, {
    label: "7 " + TextUtils.i18n('OPENPGPFILESWEBCLIENT/OPTION_LIFE_TIME_DAYS'),
    value: 7 * 24
  }]);
  this.composeMessageWithData = ModulesManager.run('MailWebclient', 'getComposeMessageWithData');
  this.cancelButtonText = ko.computed(function () {
    return _this.isSuccessfullyEncryptedAndUploaded() ? TextUtils.i18n('COREWEBCLIENT/ACTION_CLOSE') : TextUtils.i18n('COREWEBCLIENT/ACTION_CANCEL');
  });
  this.recipientAutocomplete.subscribe(function (sItem) {
    if (sItem === '') {
      _this.recipientAutocompleteItem(null);
    }
  }, this);
  this.recipientAutocompleteItem.subscribe(function (oItem) {
    if (oItem) {
      //password-based encryption is available after selecting the recipient
      _this.passwordBasedEncryptionDisabled(false);

      _this.encryptionBasedMode(Enums.EncryptionBasedOn.Password);

      _this.encryptionAvailable(true);

      if (oItem.hasKey) {
        //key-based encryption available if we have recipients public key
        _this.keyBasedEncryptionDisabled(false);

        _this.recipientHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SELF_DESTRUCT_LINK_KEY_RECIPIENT'));
      } else {
        _this.keyBasedEncryptionDisabled(true);

        _this.recipientHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NO_KEY_RECIPIENT'));
      }
    } else {
      _this.keyBasedEncryptionDisabled(true);

      _this.passwordBasedEncryptionDisabled(true);

      _this.encryptionAvailable(false);

      _this.encryptionBasedMode('');

      _this.recipientHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SELECT_RECIPIENT'));
    }
  }, this);
  this.encryptionBasedMode.subscribe(function (oItem) {
    switch (oItem) {
      case Enums.EncryptionBasedOn.Password:
        _this.encryptionModeHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_PASSWORD_BASED_ENCRYPTION')); //Signing is unavailable for file encrypted with password


        _this.isSigningAvailable(false);

        _this.sign(false);

        break;

      case Enums.EncryptionBasedOn.Key:
        _this.encryptionModeHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_KEY_BASED_ENCRYPTION'));

        if (_this.isPrivateKeyAvailable()) {
          //Signing is available for file encrypted with key and with available Private Key
          _this.isSigningAvailable(true);

          _this.sign(true);
        }

        break;

      default:
        _this.encryptionModeHintText('');

        _this.isSigningAvailable(false);

        _this.sign(true);

    }
  });
  this.signEmailHintText = ko.computed(function () {
    if (this.sign()) {
      return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SIGN_EMAIL');
    }

    return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_EMAIL');
  }, this);
  this.signFileHintText = ko.computed(function () {
    if (this.sign()) {
      return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SIGN_FILE');
    }

    if (this.encryptionBasedMode() !== Enums.EncryptionBasedOn.Key) {
      return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_FILE_REQUIRES_KEYBASED_ENCRYPTION');
    }

    if (!this.isSigningAvailable()) {
      return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_FILE_REQUIRES_PRIVATE_KEY');
    }

    return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_FILE');
  }, this);
  this.isEncrypting.subscribe(function (bEncrypting) {
    //UI elements become disabled when encryption started
    if (bEncrypting) {
      _this.keyBasedEncryptionDisabled(true);

      _this.passwordBasedEncryptionDisabled(true);
    } else {
      _this.keyBasedEncryptionDisabled(false);

      _this.passwordBasedEncryptionDisabled(false);
    }
  });
}

_.extendOwn(SelfDestructingEncryptedMessagePopup.prototype, CAbstractPopup.prototype);

SelfDestructingEncryptedMessagePopup.prototype.PopupTemplate = 'OpenPgpFilesWebclient_SelfDestructingEncryptedMessagePopup';

SelfDestructingEncryptedMessagePopup.prototype.onOpen = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sSubject, sPlainText, sRecipientEmail, sFromEmail, sSelectedSenderId) {
    var aPrivateKeys, aKeys, oRecipient;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.sSubject = sSubject;
            this.sPlainText = sPlainText;
            this.sRecipientEmail = sRecipientEmail;
            this.sFromEmail = sFromEmail;
            this.sSelectedSenderId = sSelectedSenderId;
            _context.next = 7;
            return OpenPgpEncryptor.oPromiseInitialised;

          case 7:
            this.keys(OpenPgpEncryptor.getKeys());
            aPrivateKeys = OpenPgpEncryptor.findKeysByEmails([this.sFromEmail], false);

            if (aPrivateKeys.length > 0) {
              this.isPrivateKeyAvailable(true);
            } else {
              this.isPrivateKeyAvailable(false);
            }

            if (sRecipientEmail) {
              aKeys = OpenPgpEncryptor.getPublicKeysIfExistsByEmail(sRecipientEmail);
              oRecipient = null;

              if (aKeys && aKeys[0]) {
                oRecipient = {
                  label: aKeys[0].getUser(),
                  value: aKeys[0].getUser(),
                  name: aKeys[0].getUser(),
                  email: aKeys[0].getEmail(),
                  frequency: 0,
                  id: 0,
                  team: false,
                  sharedToAll: false,
                  hasKey: true
                };
              } else {
                oRecipient = {
                  label: sRecipientEmail,
                  value: sRecipientEmail,
                  name: sRecipientEmail,
                  email: sRecipientEmail,
                  frequency: 0,
                  id: 0,
                  team: false,
                  sharedToAll: false,
                  hasKey: false
                };
              }

              this.recipientAutocompleteItem(oRecipient);
              this.recipientAutocomplete(oRecipient.value);
            }

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

SelfDestructingEncryptedMessagePopup.prototype.cancelPopup = function () {
  this.clearPopup();
  this.closePopup();
};

SelfDestructingEncryptedMessagePopup.prototype.clearPopup = function () {
  this.sPlainText = null;
  this.sRecipientEmail = null;
  this.sFromEmail = null;
  this.recipientAutocompleteItem(null);
  this.recipientAutocomplete('');
  this.isSuccessfullyEncryptedAndUploaded(false);
  this.encryptedFileLink('');
  this.encryptedFilePassword('');
  this.passphrase('');
  this.sign(false);
  this.password('');
};

SelfDestructingEncryptedMessagePopup.prototype.encrypt = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var aEmailForEncrypt, aPublicKeys, aPrivateKeys, OpenPgpResult, _OpenPgpResult$result, data, password, oCreateLinkResult, sFullLink, sSubject, sBody, sBrowserTimezone, sServerTimezone, sCurrentTime, sMessage, oOptions, _OpenPgpResult, sEncryptedBody;

  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          this.isEncrypting(true);
          aEmailForEncrypt = OpenPgpEncryptor.findKeysByEmails([this.sFromEmail], true).length > 0 ? [this.recipientAutocompleteItem().email, this.sFromEmail] : [this.recipientAutocompleteItem().email];
          aPublicKeys = OpenPgpEncryptor.findKeysByEmails(aEmailForEncrypt, true);
          aPrivateKeys = OpenPgpEncryptor.findKeysByEmails([this.sFromEmail], false);
          _context2.next = 6;
          return OpenPgpEncryptor.encryptData(this.sPlainText, aPublicKeys, aPrivateKeys, this.encryptionBasedMode() === Enums.EncryptionBasedOn.Password, this.sign(), '');

        case 6:
          OpenPgpResult = _context2.sent;

          if (OpenPgpResult.passphrase) {
            // saving passphrase so that it won't be asked again until "self-destructing secure email" popup is closed
            this.passphrase(OpenPgpResult.passphrase);
          }

          if (!(OpenPgpResult && OpenPgpResult.result && !OpenPgpResult.hasErrors())) {
            _context2.next = 37;
            break;
          }

          _OpenPgpResult$result = OpenPgpResult.result, data = _OpenPgpResult$result.data, password = _OpenPgpResult$result.password; //create link

          _context2.next = 12;
          return this.createSelfDestrucPublicLink(this.sSubject, data, this.recipientAutocompleteItem().email, this.encryptionBasedMode(), this.selectedLifetimeHrs());

        case 12:
          oCreateLinkResult = _context2.sent;

          if (!(oCreateLinkResult.result && oCreateLinkResult.link)) {
            _context2.next = 34;
            break;
          }

          sFullLink = UrlUtils.getAppPath() + oCreateLinkResult.link + '#' + Settings.SelfDestructMessageHash; //compose message

          sSubject = TextUtils.i18n('OPENPGPFILESWEBCLIENT/SELF_DESTRUCT_LINK_MESSAGE_SUBJECT');
          sBody = "";
          sBrowserTimezone = moment.tz.guess();
          sServerTimezone = UserSettings.timezone();
          sCurrentTime = moment.tz(new Date(), sBrowserTimezone || sServerTimezone).format('MMM D, YYYY HH:mm [GMT] ZZ');

          if (!this.recipientAutocompleteItem().hasKey) {
            _context2.next = 31;
            break;
          }

          //encrypt message with key
          sMessage = password ? 'OPENPGPFILESWEBCLIENT/SELF_DESTRUCT_LINK_MESSAGE_BODY_WITH_PASSWORD' : 'OPENPGPFILESWEBCLIENT/SELF_DESTRUCT_LINK_MESSAGE_BODY';
          oOptions = {
            'URL': sFullLink,
            'BR': '\r\n',
            'EMAIL': App.currentAccountEmail ? App.currentAccountEmail() : '',
            'HOURS': this.selectedLifetimeHrs(),
            'CREATING_TIME_GMT': sCurrentTime
          };

          if (password) {
            oOptions.PASSWORD = password;
          }

          sBody = TextUtils.i18n(sMessage, oOptions);
          _context2.next = 27;
          return OpenPgpEncryptor.encryptMessage(sBody, this.recipientAutocompleteItem().email, this.sign(), this.passphrase(), this.sFromEmail);

        case 27:
          _OpenPgpResult = _context2.sent;

          if (_OpenPgpResult && _OpenPgpResult.result && !_OpenPgpResult.hasErrors()) {
            sEncryptedBody = _OpenPgpResult.result;
            this.composeMessageWithData({
              to: this.recipientAutocompleteItem().value,
              subject: sSubject,
              body: sEncryptedBody,
              isHtml: false,
              selectedSenderId: this.sSelectedSenderId
            });
            this.cancelPopup();
          } else {
            ErrorsUtils.showPgpErrorByCode(_OpenPgpResult, Enums.PgpAction.Encrypt);
          }

          _context2.next = 32;
          break;

        case 31:
          //send not encrypted message
          //if the recipient does not have a key, the message can only be encrypted with a password
          if (password) {
            sBody = TextUtils.i18n('OPENPGPFILESWEBCLIENT/SELF_DESTRUCT_LINK_MESSAGE_BODY_NOT_ENCRYPTED', {
              'URL': sFullLink,
              'EMAIL': App.currentAccountEmail ? App.currentAccountEmail() : '',
              'BR': '<br>',
              'HOURS': this.selectedLifetimeHrs(),
              'CREATING_TIME_GMT': sCurrentTime
            });
            this.password(password);
            this.composeMessageWithData({
              to: this.recipientAutocompleteItem().value,
              subject: sSubject,
              body: sBody,
              isHtml: true,
              selectedSenderId: this.sSelectedSenderId
            });
          } else {
            Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_CREATE_PUBLIC_LINK'));
          }

        case 32:
          _context2.next = 35;
          break;

        case 34:
          Screens.showError(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_CREATE_PUBLIC_LINK'));

        case 35:
          _context2.next = 38;
          break;

        case 37:
          if (!OpenPgpResult || !OpenPgpResult.userCanceled) {
            ErrorsUtils.showPgpErrorByCode(OpenPgpResult, Enums.PgpAction.Encrypt);
          }

        case 38:
          this.isEncrypting(false);

        case 39:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));
/**
 * @param {object} oRequest
 * @param {function} fResponse
 */

SelfDestructingEncryptedMessagePopup.prototype.autocompleteCallback = function (oRequest, fResponse) {
  var _this2 = this;

  var fAutocompleteCallback = ModulesManager.run('ContactsWebclient', 'getSuggestionsAutocompleteCallback', ['all', App.getUserPublicId(),
  /*bWithGroups*/
  false]);

  var fMarkRecipientsWithKeyCallback = function fMarkRecipientsWithKeyCallback(aRecipienstList) {
    var aPublicKeysEmails = _this2.getPublicKeysEmails();

    var iOwnPublicKeyIndex = aPublicKeysEmails.indexOf(App.getUserPublicId());

    if (iOwnPublicKeyIndex > -1) {
      //remove own public key from list
      aPublicKeysEmails.splice(iOwnPublicKeyIndex, 1);
    }

    aRecipienstList.forEach(function (oRecipient) {
      var iIndex = aPublicKeysEmails.indexOf(oRecipient.email);

      if (iIndex > -1) {
        oRecipient.hasKey = true; //remove key from list when recipient is marked

        aPublicKeysEmails.splice(iIndex, 1);
      } else {
        oRecipient.hasKey = false;
      }
    });
    aPublicKeysEmails.forEach(function (sPublicKey) {
      var bMatchesSearch = _this2.recipientAutocomplete() === '' || sPublicKey.indexOf(_this2.recipientAutocomplete()) !== -1,
          aKeys = bMatchesSearch ? OpenPgpEncryptor.getPublicKeysIfExistsByEmail(sPublicKey) : null;

      if (aKeys && aKeys[0]) {
        aRecipienstList.push({
          label: aKeys[0].getUser(),
          value: aKeys[0].getUser(),
          name: aKeys[0].getUser(),
          email: aKeys[0].getEmail(),
          frequency: 0,
          id: 0,
          team: false,
          sharedToAll: false,
          hasKey: true
        });
      }
    });
    fResponse(aRecipienstList);
  };

  if (_.isFunction(fAutocompleteCallback)) {
    this.recipientAutocompleteItem(null);
    fAutocompleteCallback(oRequest, fMarkRecipientsWithKeyCallback);
  }
};

SelfDestructingEncryptedMessagePopup.prototype.getPublicKeysEmails = function () {
  var aPublicKeys = this.keys().filter(function (oKey) {
    return oKey.isPublic();
  });
  return aPublicKeys.map(function (oKey) {
    return oKey.getEmail();
  });
};

SelfDestructingEncryptedMessagePopup.prototype.createSelfDestrucPublicLink = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(sSubject, sData, sRecipientEmail, sEncryptionBasedMode, iLifetimeHrs) {
    var _this3 = this;

    var sLink, oResult, oPromiseCreateSelfDestrucPublicLink;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sLink = '';
            oResult = {
              result: false
            };
            oPromiseCreateSelfDestrucPublicLink = new Promise(function (resolve, reject) {
              var fResponseCallback = function fResponseCallback(oResponse, oRequest) {
                if (oResponse.Result && oResponse.Result.link) {
                  resolve(oResponse.Result.link);
                }

                reject(new Error(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ERROR_PUBLIC_LINK_CREATION')));
              };

              var oParams = {
                'Subject': sSubject,
                'Data': sData,
                'RecipientEmail': sRecipientEmail,
                'PgpEncryptionMode': sEncryptionBasedMode,
                'LifetimeHrs': iLifetimeHrs
              };
              Ajax.send('OpenPgpFilesWebclient', 'CreateSelfDestrucPublicLink', oParams, fResponseCallback, _this3);
            });
            _context3.prev = 3;
            _context3.next = 6;
            return oPromiseCreateSelfDestrucPublicLink;

          case 6:
            sLink = _context3.sent;
            oResult.result = true;
            oResult.link = sLink;
            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](3);

            if (_context3.t0 && _context3.t0.message) {
              Screens.showError(_context3.t0.message);
            }

          case 14:
            return _context3.abrupt("return", oResult);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 11]]);
  }));

  return function (_x6, _x7, _x8, _x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = new SelfDestructingEncryptedMessagePopup();

/***/ }),

/***/ "wjWM":
/*!***********************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/utils/Hex.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    HexUtils = {};

HexUtils.Array2HexString = function (aInput) {
  var sHexAB = '';

  _.each(aInput, function (element) {
    var sHex = element.toString(16);
    sHexAB += (sHex.length === 1 ? '0' : '') + sHex;
  });

  return sHexAB;
};

HexUtils.HexString2Array = function (sHex) {
  var aResult = [];

  if (sHex.length === 0 || sHex.length % 2 !== 0) {
    return aResult;
  }

  for (var i = 0; i < sHex.length; i += 2) {
    aResult.push(parseInt(sHex.substr(i, 2), 16));
  }

  return aResult;
};

module.exports = HexUtils;

/***/ }),

/***/ "ymJf":
/*!*********************************************************************!*\
  !*** ./modules/OpenPgpFilesWebclient/js/popups/EncryptFilePopup.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    ErrorsUtils = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/utils/Errors.js */ "1kFK"),
    OpenPgpFileProcessor = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/OpenPgpFileProcessor.js */ "Xu4A"),
    Settings = __webpack_require__(/*! modules/OpenPgpFilesWebclient/js/Settings.js */ "+x5O"),
    OpenPgpEncryptor = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpEncryptor');
/**
 * @constructor
 */


function EncryptFilePopup() {
  var _this = this;

  CAbstractPopup.call(this);
  this.oFile = null;
  this.oFilesView = null;
  this.recipientAutocompleteItem = ko.observable(null);
  this.recipientAutocomplete = ko.observable('');
  this.keyBasedEncryptionDisabled = ko.observable(true);
  this.isSuccessfullyEncryptedAndUploaded = ko.observable(false);
  this.keys = ko.observableArray([]);
  this.encryptionBasedMode = ko.observable(Enums.EncryptionBasedOn.Password);
  this.recipientHintText = ko.observable(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_ONLY_PASSWORD_BASED'));
  this.encryptionModeHintText = ko.observable('');
  this.isEncrypting = ko.observable(false);
  this.encryptedFileLink = ko.observable('');
  this.encryptedFilePassword = ko.observable('');
  this.sendButtonText = ko.observable('');
  this.hintUnderEncryptionInfo = ko.observable('');
  this.sign = ko.observable(false);
  this.isSigningAvailable = ko.observable(false);
  this.isPrivateKeyAvailable = ko.observable(false);
  this.passphrase = ko.observable('');
  this.composeMessageWithData = ModulesManager.run('MailWebclient', 'getComposeMessageWithData');
  this.sUserEmail = '';
  this.cancelButtonText = ko.computed(function () {
    return _this.isSuccessfullyEncryptedAndUploaded() ? TextUtils.i18n('COREWEBCLIENT/ACTION_CLOSE') : TextUtils.i18n('COREWEBCLIENT/ACTION_CANCEL');
  });
  this.recipientAutocomplete.subscribe(function (sItem) {
    if (sItem === '') {
      _this.recipientAutocompleteItem(null);
    }
  }, this);
  this.recipientAutocompleteItem.subscribe(function (oItem) {
    if (oItem) {
      _this.recipientAutocomplete(oItem.value);

      _this.encryptionBasedMode(Enums.EncryptionBasedOn.Password);

      if (oItem.hasKey) {
        //key-based encryption available if we have recipients public key
        _this.keyBasedEncryptionDisabled(false);

        _this.recipientHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_KEY_RECIPIENT'));
      } else {
        _this.keyBasedEncryptionDisabled(true);

        _this.recipientHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NO_KEY_RECIPIENT'));
      }
    } else {
      _this.keyBasedEncryptionDisabled(true);

      _this.encryptionBasedMode(Enums.EncryptionBasedOn.Password);

      _this.recipientHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_ONLY_PASSWORD_BASED'));
    }
  }, this);
  this.encryptionBasedMode.subscribe(function (oItem) {
    switch (oItem) {
      case Enums.EncryptionBasedOn.Password:
        _this.encryptionModeHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_PASSWORD_BASED_ENCRYPTION')); //Signing is unavailable for file encrypted with password


        _this.isSigningAvailable(false);

        _this.sign(false);

        break;

      case Enums.EncryptionBasedOn.Key:
        _this.encryptionModeHintText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_KEY_BASED_ENCRYPTION'));

        if (_this.isPrivateKeyAvailable()) {
          //Signing is available for file encrypted with key and with available Private Key
          _this.isSigningAvailable(true);

          _this.sign(true);
        }

        break;

      default:
        _this.encryptionModeHintText('');

        _this.isSigningAvailable(false);

        _this.sign(true);

    }
  });
  this.signEmailHintText = ko.computed(function () {
    if (this.sign()) {
      return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SIGN_EMAIL');
    }

    return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_EMAIL');
  }, this);
  this.signFileHintText = ko.computed(function () {
    if (this.sign()) {
      return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_SIGN_FILE');
    }

    if (this.encryptionBasedMode() !== Enums.EncryptionBasedOn.Key) {
      return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_FILE_REQUIRES_KEYBASED_ENCRYPTION');
    }

    if (!this.isSigningAvailable()) {
      return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_FILE_REQUIRES_PRIVATE_KEY');
    }

    return TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_NOT_SIGN_FILE');
  }, this);
  this.addButtons = ko.observableArray([]);
}

_.extendOwn(EncryptFilePopup.prototype, CAbstractPopup.prototype);

EncryptFilePopup.prototype.PopupTemplate = 'OpenPgpFilesWebclient_EncryptFilePopup';

EncryptFilePopup.prototype.onOpen = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(oFile, oFilesView) {
    var aPrivateKeys;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.addButtons([]);
            this.oFile = oFile;
            this.oFilesView = oFilesView;
            _context.next = 5;
            return OpenPgpEncryptor.oPromiseInitialised;

          case 5:
            this.keys(OpenPgpEncryptor.getKeys());
            this.sUserEmail = App.currentAccountEmail ? App.currentAccountEmail() : '';
            aPrivateKeys = OpenPgpEncryptor.findKeysByEmails([this.sUserEmail], false);

            if (aPrivateKeys.length > 0) {
              this.isPrivateKeyAvailable(true);
            } else {
              this.isPrivateKeyAvailable(false);
            }

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

EncryptFilePopup.prototype.cancelPopup = function () {
  this.clearPopup();
  this.closePopup();
};

EncryptFilePopup.prototype.clearPopup = function () {
  this.oFile = null;
  this.oFilesView = null;
  this.recipientAutocompleteItem(null);
  this.recipientAutocomplete('');
  this.isSuccessfullyEncryptedAndUploaded(false);
  this.encryptedFileLink('');
  this.encryptedFilePassword('');
  this.passphrase('');
  this.sign(false);
  this.sUserEmail = '';
};

EncryptFilePopup.prototype.encrypt = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var oResult;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          this.isEncrypting(true);
          _context2.next = 3;
          return OpenPgpFileProcessor.processFileEncryption(this.oFile, this.oFilesView, this.recipientAutocompleteItem() ? this.recipientAutocompleteItem().email : '', this.encryptionBasedMode() === Enums.EncryptionBasedOn.Password, this.sign(), '');

        case 3:
          oResult = _context2.sent;
          this.isEncrypting(false);

          if (this.sign() && oResult.result && oResult.passphrase) {
            // saving passphrase so that it won't be asked again until encrypt popup is closed
            this.passphrase(oResult.passphrase);
          }

          this.showResults(oResult);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, this);
}));
/**
 * @param {object} oRequest
 * @param {function} fResponse
 */

EncryptFilePopup.prototype.autocompleteCallback = function (oRequest, fResponse) {
  var _this2 = this;

  var fAutocompleteCallback = ModulesManager.run('ContactsWebclient', 'getSuggestionsAutocompleteCallback', ['all', App.getUserPublicId(),
  /*bWithGroups*/
  false]);

  var fMarkRecipientsWithKeyCallback = function fMarkRecipientsWithKeyCallback(aRecipienstList) {
    var aPublicKeysEmails = _this2.getPublicKeysEmails();

    var iOwnPublicKeyIndex = aPublicKeysEmails.indexOf(App.getUserPublicId());

    if (iOwnPublicKeyIndex > -1) {
      //remove own public key from list
      aPublicKeysEmails.splice(iOwnPublicKeyIndex, 1);
    }

    aRecipienstList.forEach(function (oRecipient) {
      var iIndex = aPublicKeysEmails.indexOf(oRecipient.email);

      if (iIndex > -1) {
        oRecipient.hasKey = true; //remove key from list when recipient is marked

        aPublicKeysEmails.splice(iIndex, 1);
      } else {
        oRecipient.hasKey = false;
      }
    });
    aPublicKeysEmails.forEach(function (sPublicKey) {
      var aKeys = OpenPgpEncryptor.getPublicKeysIfExistsByEmail(sPublicKey);

      if (aKeys && aKeys[0]) {
        aRecipienstList.push({
          label: aKeys[0].getUser(),
          value: aKeys[0].getUser(),
          name: aKeys[0].getUser(),
          email: aKeys[0].getEmail(),
          frequency: 0,
          id: 0,
          team: false,
          sharedToAll: false,
          hasKey: true
        });
      }
    });
    fResponse(aRecipienstList);
  };

  if (_.isFunction(fAutocompleteCallback)) {
    this.recipientAutocompleteItem(null);
    fAutocompleteCallback(oRequest, fMarkRecipientsWithKeyCallback);
  }
};

EncryptFilePopup.prototype.showResults = function (oData) {
  var result = oData.result,
      password = oData.password,
      link = oData.link;

  if (result) {
    if (this.recipientAutocompleteItem() && this.recipientAutocompleteItem().hasKey) {
      this.sendButtonText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ACTION_SEND_ENCRYPTED_EMAIL'));

      if (this.encryptionBasedMode() === Enums.EncryptionBasedOn.Password) {
        this.hintUnderEncryptionInfo(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_STORE_PASSWORD'));
      } else {
        var sUserName = this.recipientAutocompleteItem().name ? this.recipientAutocompleteItem().name : this.recipientAutocompleteItem().email;

        if (this.sign()) {
          this.hintUnderEncryptionInfo(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_ENCRYPTED_SIGNED_EMAIL', {
            'USER': sUserName
          }));
        } else {
          this.hintUnderEncryptionInfo(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_ENCRYPTED_EMAIL', {
            'USER': sUserName
          }));
        }
      }
    } else {
      this.sendButtonText(TextUtils.i18n('OPENPGPFILESWEBCLIENT/ACTION_SEND_EMAIL'));
      this.hintUnderEncryptionInfo(TextUtils.i18n('OPENPGPFILESWEBCLIENT/HINT_EMAIL'));
    }

    this.isSuccessfullyEncryptedAndUploaded(true);
    this.encryptedFileLink(UrlUtils.getAppPath() + link);
    this.encryptedFilePassword(password);
    var oParams = {
      AddButtons: [],
      EncryptionBasedMode: this.encryptionBasedMode(),
      EncryptedFileLink: this.encryptedFileLink()
    };
    App.broadcastEvent('OpenPgpFilesWebclient::ShareEncryptedFile::after', oParams);
    this.addButtons(oParams.AddButtons);
  }

  this.isEncrypting(false);
};

EncryptFilePopup.prototype.sendEmail = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
  var sSubject, sBody, OpenPgpResult, sEncryptedBody, _sBody;

  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          sSubject = TextUtils.i18n('OPENPGPFILESWEBCLIENT/MESSAGE_SUBJECT', {
            'FILENAME': this.oFile.fileName()
          });

          if (!this.recipientAutocompleteItem().hasKey) {
            _context3.next = 10;
            break;
          }

          //message is encrypted
          sBody = '';

          if (this.encryptionBasedMode() === Enums.EncryptionBasedOn.Password) {
            sBody = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ENCRYPTED_WITH_PASSWORD_MESSAGE_BODY', {
              'URL': this.encryptedFileLink(),
              'PASSWORD': this.encryptedFilePassword(),
              'BR': '\r\n'
            });
          } else {
            sBody = TextUtils.i18n('OPENPGPFILESWEBCLIENT/ENCRYPTED_WITH_KEY_MESSAGE_BODY', {
              'URL': this.encryptedFileLink(),
              'USER': this.recipientAutocompleteItem().email,
              'BR': '\r\n',
              'SYSNAME': Settings.ProductName
            });
          }

          _context3.next = 6;
          return OpenPgpEncryptor.encryptMessage(sBody, this.recipientAutocompleteItem().email, this.sign(), this.passphrase(), this.sUserEmail);

        case 6:
          OpenPgpResult = _context3.sent;

          if (OpenPgpResult && OpenPgpResult.result) {
            sEncryptedBody = OpenPgpResult.result;
            this.composeMessageWithData({
              to: this.recipientAutocompleteItem().value,
              subject: sSubject,
              body: sEncryptedBody,
              isHtml: false
            });
            this.clearPopup();
            this.closePopup();
          } else {
            ErrorsUtils.showPgpErrorByCode(OpenPgpResult, Enums.PgpAction.Encrypt);
          }

          _context3.next = 14;
          break;

        case 10:
          //message is not encrypted
          _sBody = TextUtils.i18n('OPENPGPFILESWEBCLIENT/MESSAGE_BODY', {
            'URL': this.encryptedFileLink()
          });
          this.composeMessageWithData({
            to: this.recipientAutocompleteItem().value,
            subject: sSubject,
            body: _sBody,
            isHtml: true
          });
          this.clearPopup();
          this.closePopup();

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3, this);
}));

EncryptFilePopup.prototype.getPublicKeysEmails = function () {
  var aPublicKeys = this.keys().filter(function (oKey) {
    return oKey.isPublic();
  });
  return aPublicKeys.map(function (oKey) {
    return oKey.getEmail();
  });
};

module.exports = new EncryptFilePopup();

/***/ }),

/***/ "zDR0":
/*!*************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Storage = __webpack_require__(/*! modules/CoreWebclient/js/Storage.js */ "gcBV"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
    HexUtils = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/utils/Hex.js */ "wjWM"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    DecryptKeyPasswordPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/DecryptKeyPasswordPopup.js */ "LU2F"),
    EncryptKeyPasswordPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/EncryptKeyPasswordPopup.js */ "mtgd");
/**
 * @constructor
 */


function CJscryptoKey() {
  this.sPrefix = 'user_' + (UserSettings.UserId || '0') + '_';
  this.key = ko.observable();
  this.keyName = ko.observable();
  this.storageName = 'cryptoKeyEncrypted';
}

CJscryptoKey.prototype.key = null;
CJscryptoKey.prototype.sPrefix = '';
/**
 * Asynchronously read key from storage, decrypt and generate key-object
 *
 * @param {Function} fOnGenerateKeyCallback - starts after the key is successfully generated
 * @param {Function} fOnErrorCallback - starts if error occurred during key generation process
 * @param {string} sPassword - encrypt key with given password, "password dialog" wouldn't show
 * @param {boolean} bForcedKeyLoading - forced key loading and decryption
 */

CJscryptoKey.prototype.getKey = function (fOnGenerateKeyCallback, fOnErrorCallback, sPassword, bForcedKeyLoading) {
  var sEncryptedKeyData = this.loadKeyFromStorage(),
      oPromise = new Promise(function (resolve, reject) {
    var fDecryptKeyCallback = _.bind(function (sPassword) {
      //Decrypt key with user password
      this.decryptKeyData(sEncryptedKeyData, sPassword).then(_.bind(function (aKeyData) {
        //generate key object from encrypted data
        this.generateKeyFromArray(aKeyData).then(function (oKey) {
          //return key object
          resolve(oKey);
        })["catch"](function (e) {
          reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
        });
      }, this))["catch"](function (e) {
        reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
      });
    }, this);

    if (!sEncryptedKeyData) {
      reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/INFO_EMPTY_JSCRYPTO_KEY')));
    } else {
      if (!this.key() || bForcedKeyLoading) {
        //if key not available or loading is forced - encrypt key data
        if (!sPassword) {
          //if password is unknown - request password
          Popups.showPopup(DecryptKeyPasswordPopup, [fDecryptKeyCallback, function () {
            if (_.isFunction(fOnErrorCallback)) {
              fOnErrorCallback();
            }
          }]);
        } else {
          //if password is known - decrypt key with this password
          fDecryptKeyCallback(sPassword);
        }
      } else {
        //if key already available - return key
        resolve(this.key());
      }
    }
  }.bind(this));
  this.loadKeyNameFromStorage();
  oPromise.then(_.bind(function (oKey) {
    this.onKeyGenerateSuccess(oKey);

    if (_.isFunction(fOnGenerateKeyCallback)) {
      fOnGenerateKeyCallback(oKey);
    }
  }, this))["catch"](_.bind(function (oError) {
    if (_.isFunction(fOnErrorCallback)) {
      fOnErrorCallback();
    }

    this.onKeyGenerateError(oError);
  }, this));
};
/**
 * Read key name from local storage
 */


CJscryptoKey.prototype.loadKeyNameFromStorage = function () {
  if (Storage.hasData(this.getStorageName())) {
    this.keyName(Storage.getData(this.getStorageName()).keyname);
  }
};
/**
 *  read key data from local storage
 *
 *  @returns {string}
 */


CJscryptoKey.prototype.loadKeyFromStorage = function () {
  var sKey = '';

  if (Storage.hasData(this.getStorageName())) {
    sKey = Storage.getData(this.getStorageName()).keydata;
  }

  return sKey;
};
/**
 * Asynchronously generate key object from array data
 *
 * @param {ArrayBuffer} aKey
 * @returns {Promise}
 */


CJscryptoKey.prototype.generateKeyFromArray = function (aKey) {
  var keyPromise = window.crypto.subtle.importKey("raw", aKey, {
    name: "AES-CBC"
  }, true, ["encrypt", "decrypt"]);
  return keyPromise;
};
/**
 * Write key-object to knockout variable
 *
 * @param {Object} oKey
 */


CJscryptoKey.prototype.onKeyGenerateSuccess = function (oKey) {
  this.key(oKey);
};
/**
 * Show error message
 *
 * @param {Object} oError
 */


CJscryptoKey.prototype.onKeyGenerateError = function (oError) {
  if (oError && oError.message) {
    Screens.showError(oError.message);
  }
};
/**
 * Asynchronously generate new key
 */


CJscryptoKey.prototype.generateKey = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var oKey;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          oKey = false;
          _context.prev = 1;
          _context.next = 4;
          return window.crypto.subtle.generateKey({
            name: "AES-CBC",
            length: 256
          }, true, ["encrypt", "decrypt"]);

        case 4:
          oKey = _context.sent;
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_GENERATE_KEY'));

        case 10:
          return _context.abrupt("return", oKey);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[1, 7]]);
}));

CJscryptoKey.prototype.convertKeyToString = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(oKey) {
    var sKeyData, aKeyData;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sKeyData = '';

            if (!oKey) {
              _context2.next = 12;
              break;
            }

            _context2.prev = 2;
            _context2.next = 5;
            return window.crypto.subtle.exportKey("raw", oKey);

          case 5:
            aKeyData = _context2.sent;
            sKeyData = HexUtils.Array2HexString(new Uint8Array(aKeyData));
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](2);
            Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_EXPORT_KEY'));

          case 12:
            return _context2.abrupt("return", sKeyData);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 9]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Asynchronously generate and export new key
 *
 * @param {Function} fOnGenerateCallback - starts after the key is successfully generated
 * @param {string} sKeyName
 */


CJscryptoKey.prototype.generateAndExportKey = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(fOnGenerateCallback, sKeyName) {
    var _this = this;

    var oKey, sKeyData;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return this.generateKey();

          case 2:
            oKey = _context4.sent;
            _context4.next = 5;
            return this.convertKeyToString(oKey);

          case 5:
            sKeyData = _context4.sent;
            Popups.showPopup(EncryptKeyPasswordPopup, [/*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(sPassword) {
                var sKeyDataEncrypted;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return _this.encryptKeyData(sKeyData, sPassword);

                      case 3:
                        sKeyDataEncrypted = _context3.sent;
                        Storage.setData(_this.getStorageName(), {
                          keyname: sKeyName,
                          keydata: sKeyDataEncrypted
                        });

                        _this.loadKeyNameFromStorage();

                        _this.onKeyGenerateSuccess(oKey);

                        if (_.isFunction(fOnGenerateCallback)) {
                          fOnGenerateCallback();
                        }

                        _context3.next = 13;
                        break;

                      case 10:
                        _context3.prev = 10;
                        _context3.t0 = _context3["catch"](0);
                        Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));

                      case 13:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 10]]);
              }));

              return function (_x4) {
                return _ref4.apply(this, arguments);
              };
            }(), function () {}]);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

CJscryptoKey.prototype.getKeyFromString = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(sParanoidKey) {
    var oKey, aKeyData;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            oKey = null;
            aKeyData = HexUtils.HexString2Array(sParanoidKey);

            if (aKeyData.length > 0) {
              aKeyData = new Uint8Array(aKeyData);
            } else {
              Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));
            }

            _context5.prev = 3;
            _context5.next = 6;
            return this.generateKeyFromArray(aKeyData);

          case 6:
            oKey = _context5.sent;
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](3);
            Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));

          case 12:
            return _context5.abrupt("return", oKey);

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[3, 9]]);
  }));

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * Asynchronously generate key-object from string key-data
 *
 * @param {string} sKeyName
 * @param {string} sKeyData
 * @param {Function} fOnImportKeyCallback - starts after the key is successfully imported
 * @param {Function} fOnErrorCallback - starts if an error occurs during the key import process
 */


CJscryptoKey.prototype.importKeyFromString = function (sKeyName, sKeyData, fOnImportKeyCallback, fOnErrorCallback) {
  try {
    Popups.showPopup(EncryptKeyPasswordPopup, [_.bind(function (sPassword) {
      // Encrypt imported Key with User password
      this.encryptKeyData(sKeyData, sPassword).then(_.bind(function (sKeyDataEncrypted) {
        // Store encrypted key in local storage
        Storage.setData(this.getStorageName(), {
          keyname: sKeyName,
          keydata: sKeyDataEncrypted
        });
        this.getKey(fOnImportKeyCallback, fOnErrorCallback, sPassword);
      }, this))["catch"](function () {
        Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));

        if (_.isFunction(fOnErrorCallback)) {
          fOnErrorCallback();
        }
      });
    }, this), function () {
      // Cancel callback
      if (_.isFunction(fOnErrorCallback)) {
        fOnErrorCallback();
      }
    }]);
  } catch (e) {
    Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_IMPORT_KEY'));

    if (_.isFunction(fOnErrorCallback)) {
      fOnErrorCallback();
    }
  }
};
/**
 * Asynchronously export key
 *
 * @returns {Promise}
 */


CJscryptoKey.prototype.exportKey = function () {
  return window.crypto.subtle.exportKey("raw", this.key());
};
/**
 * Remove key-object and clear key-data in local storage
 *
 * @returns {Object}
 */


CJscryptoKey.prototype.deleteKey = function () {
  try {
    this.key(null);
    this.keyName(null);
    Storage.removeData(this.getStorageName());
  } catch (e) {
    return {
      error: e
    };
  }

  return {
    status: 'ok'
  };
};
/**
 * Asynchronously decrypt key with user password
 *
 * @param {string} sEncryptedKeyData
 * @param {string} sPassword
 * @returns {Promise}
 */


CJscryptoKey.prototype.decryptKeyData = function (sEncryptedKeyData, sPassword) {
  var aVector = new Uint8Array(16) //defaults to zero
  ;
  return new Promise(function (resolve, reject) {
    if (!sEncryptedKeyData) {
      reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
    } else {
      //get password-key
      this.deriveKeyFromPasswordPromise(sPassword, _.bind(function (oDerivedKey) {
        crypto.subtle.decrypt({
          name: 'AES-CBC',
          iv: aVector
        }, oDerivedKey, new Uint8Array(HexUtils.HexString2Array(sEncryptedKeyData))).then(_.bind(function (aDecryptedKeyData) {
          resolve(new Uint8Array(aDecryptedKeyData));
        }, this))["catch"](function () {
          reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
        });
      }, this), function () {
        reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
      });
    }
  }.bind(this));
};
/**
 * Asynchronously encrypt key with user password
 *
 * @param {string} sUserKeyData
 * @param {string} sPassword
 * @returns {Promise}
 */


CJscryptoKey.prototype.encryptKeyData = function (sUserKeyData, sPassword) {
  var aKeyData = null,
      sEncryptedKeyData = null,
      aVector = new Uint8Array(16) //defaults to zero
  ;
  return new Promise(function (resolve, reject) {
    if (!sUserKeyData) {
      reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
    } else {
      aKeyData = HexUtils.HexString2Array(sUserKeyData);

      if (aKeyData.length > 0) {
        aKeyData = new Uint8Array(aKeyData);
      } else {
        reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
      } //get password-key


      this.deriveKeyFromPasswordPromise(sPassword, _.bind(function (oDerivedKey) {
        //encrypt user-key with password-key
        crypto.subtle.encrypt({
          name: 'AES-CBC',
          iv: aVector
        }, oDerivedKey, aKeyData).then(_.bind(function (aEncryptedKeyData) {
          sEncryptedKeyData = HexUtils.Array2HexString(new Uint8Array(aEncryptedKeyData));
          resolve(sEncryptedKeyData);
        }, this))["catch"](function () {
          reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
        });
      }, this), function () {
        reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
      });
    }
  }.bind(this));
};
/**
 * Asynchronously generate special key from user password. This key used in process of encryption/decryption user key.
 *
 * @param {string} sPassword
 * @param {Function} fOnGetDerivedKeyCallback - starts after the key is successfully generated
 * @param {Function} fOnErrorCallback - starts if an error occurs during the key generation process
 */


CJscryptoKey.prototype.deriveKeyFromPasswordPromise = function (sPassword, fOnGetDerivedKeyCallback, fOnErrorCallback) {
  var sSalt = "the salt is this string",
      convertStringToArrayBuffer = function convertStringToArrayBuffer(sData) {
    if (window.TextEncoder) {
      return new TextEncoder('utf-8').encode(sData);
    }

    var sUtf8 = unescape(encodeURIComponent(sData)),
        sResult = new Uint8Array(sUtf8.length);

    for (var i = 0; i < sUtf8.length; i++) {
      sResult[i] = sUtf8.charCodeAt(i);
    }

    return sResult;
  };

  window.crypto.subtle.importKey("raw", convertStringToArrayBuffer(sPassword), {
    "name": "PBKDF2"
  }, false, ["deriveKey"]).then(_.bind(function (oPasswordKey) {
    window.crypto.subtle.deriveKey({
      "name": "PBKDF2",
      "salt": convertStringToArrayBuffer(sSalt),
      "iterations": 100000,
      "hash": "SHA-256"
    }, oPasswordKey, {
      "name": "AES-CBC",
      "length": 256
    }, true, ["encrypt", "decrypt"]).then(function (oDerivedKey) {
      if (_.isFunction(fOnGetDerivedKeyCallback)) {
        fOnGetDerivedKeyCallback(oDerivedKey);
      }
    })["catch"](function () {
      if (_.isFunction(fOnErrorCallback)) {
        fOnErrorCallback();
      }
    });
  }, this))["catch"](function () {
    if (_.isFunction(fOnErrorCallback)) {
      fOnErrorCallback();
    }
  });
};

CJscryptoKey.prototype.getStorageName = function () {
  return this.sPrefix + this.storageName;
};

module.exports = new CJscryptoKey();

/***/ })

}]);