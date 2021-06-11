(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[20],{

/***/ "2d9n":
/*!***************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ConfirmUploadPopup.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF");
/**
 * @constructor
 */


function CConfirmUploadPopup() {
  CAbstractPopup.call(this);
  this.fUpload = null;
  this.fCancel = null;
  this.message = ko.observable('');
  this.filesConfirmText = ko.observable('');
  this.sErrorText = ko.observable('');
}

_.extendOwn(CConfirmUploadPopup.prototype, CAbstractPopup.prototype);

CConfirmUploadPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_ConfirmUploadPopup';

CConfirmUploadPopup.prototype.onOpen = function (fUpload, fCancel, iFilesCount, aFileList, sErrorText) {
  var aEncodedFiles = _.map(aFileList, function (sFileName) {
    return TextUtils.encodeHtml(sFileName);
  });

  this.filesConfirmText('');
  this.fUpload = fUpload;
  this.fCancel = fCancel;
  this.message(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/CONFIRM_UPLOAD_PLURAL', {
    'VALUE': iFilesCount > 1 ? iFilesCount : '"' + aFileList[0] + '"'
  }, null, iFilesCount));

  if (iFilesCount > 1) {
    this.filesConfirmText(aEncodedFiles.join('<br />'));
  }

  this.sErrorText(sErrorText);
};

CConfirmUploadPopup.prototype.cancelUpload = function () {
  this.fCancel();
  this.closePopup();
};

CConfirmUploadPopup.prototype.upload = function () {
  this.fUpload();
  this.closePopup();
};

module.exports = new CConfirmUploadPopup();

/***/ }),

/***/ "2kfa":
/*!*************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/GenerateKeyPopup.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    JscryptoKey = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js */ "zDR0");
/**
 * @constructor
 */


function CGenerateKeyPopup() {
  CAbstractPopup.call(this);
  this.keyName = ko.observable(App.getUserPublicId());
  this.fOnGenerateCallback = null;
}

_.extendOwn(CGenerateKeyPopup.prototype, CAbstractPopup.prototype);

CGenerateKeyPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_GenerateKeyPopup';

CGenerateKeyPopup.prototype.onOpen = function (fOnGenerateCallback) {
  this.fOnGenerateCallback = fOnGenerateCallback;
};

CGenerateKeyPopup.prototype.generateKey = function () {
  JscryptoKey.generateAndExportKey(_.bind(function () {
    this.fOnGenerateCallback();
  }, this), this.keyName());
  this.closePopup();
};

module.exports = new CGenerateKeyPopup();

/***/ }),

/***/ "B9Yq":
/*!***************************************!*\
  !*** (webpack)/buildin/amd-define.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),

/***/ "I5pT":
/*!**********************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/Settings.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ko = __webpack_require__(/*! knockout */ "0h2I"),
    _ = __webpack_require__(/*! underscore */ "F/us"),
    Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV");

module.exports = {
  ServerModuleName: 'CoreParanoidEncryptionWebclientPlugin',
  HashModuleName: 'paranoid-encryption',
  EncryptionAllowedModules: ['Files'],
  EncryptionAllowedStorages: ['personal'],
  enableJscrypto: ko.observable(true),
  EnableInPersonalStorage: false,
  ChunkSizeMb: 5,
  AllowMultiChunkUpload: true,
  AllowChangeSettings: false,
  DontRemindMe: ko.observable(false),

  /**
   * Initializes settings from AppData object sections.
   *
   * @param {Object} oAppData Object contained modules settings.
   */
  init: function init(oAppData) {
    var oAppDataSection = _.extend({}, oAppData[this.ServerModuleName] || {}, oAppData['CoreParanoidEncryptionWebclientPlugin'] || {});

    if (!_.isEmpty(oAppDataSection)) {
      this.enableJscrypto(Types.pBool(oAppDataSection.EnableModule, this.enableJscrypto()));
      this.DontRemindMe(Types.pBool(oAppDataSection.DontRemindMe, this.DontRemindMe()));
      this.EnableInPersonalStorage = Types.pBool(oAppDataSection.EnableInPersonalStorage, this.EnableInPersonalStorage);
      this.ChunkSizeMb = Types.pInt(oAppDataSection.ChunkSizeMb, this.ChunkSizeMb);
      this.AllowMultiChunkUpload = Types.pBool(oAppDataSection.AllowMultiChunkUpload, this.AllowMultiChunkUpload);
      this.AllowChangeSettings = Types.pBool(oAppDataSection.AllowChangeSettings, this.AllowChangeSettings);
    }
  },

  /**
   * Updates new settings values after saving on server.
   *
   * @param {boolean} bEnableJscrypto
   * @param {number} bEnableInPersonalStorage
   */
  update: function update(bEnableJscrypto, bEnableInPersonalStorage) {
    this.enableJscrypto(bEnableJscrypto);
    this.EnableInPersonalStorage = bEnableInPersonalStorage;
  }
};

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

/***/ "Npm9":
/*!*****************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ImportKeyStringPopup.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    JscryptoKey = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js */ "zDR0");
/**
 * @constructor
 */


function CImportKeyStringPopup() {
  CAbstractPopup.call(this);
  this.keyName = ko.observable(App.getUserPublicId());
  this.newKey = ko.observable('');
}

_.extendOwn(CImportKeyStringPopup.prototype, CAbstractPopup.prototype);

CImportKeyStringPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_ImportKeyStringPopup';

CImportKeyStringPopup.prototype.onOpen = function () {
  this.newKey('');
};

CImportKeyStringPopup.prototype.importKey = function () {
  JscryptoKey.importKeyFromString(this.keyName(), this.newKey());
  this.closePopup();
};

module.exports = new CImportKeyStringPopup();

/***/ }),

/***/ "PDX0":
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ "QJDP":
/*!*********************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/CCrypto.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var $ = __webpack_require__(/*! jquery */ "EVdn"),
    _ = __webpack_require__(/*! underscore */ "F/us"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    FileSaver = __webpack_require__(/*! modules/CoreWebclient/js/vendors/FileSaver.js */ "uN/E"),
    JscryptoKey = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js */ "zDR0"),
    Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
    HexUtils = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/utils/Hex.js */ "wjWM"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    OutdatedEncryptionMethodPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/OutdatedEncryptionMethodPopup.js */ "hJUJ"),
    GetTemporaryKeyPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/GetTemporaryKeyPopup.js */ "TrqT"),
    Settings = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/Settings.js */ "I5pT"),
    OpenPgpEncryptor = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpEncryptor');
/**
 * @constructor
 */


function CCrypto() {
  this.iChunkNumber = 0;
  this.iChunkSize = Settings.ChunkSizeMb * 1024 * 1024;
  this.iCurrChunk = 0;
  this.oChunk = null;
  this.iv = null; // Queue of files awaiting upload

  this.oChunkQueue = {
    isProcessed: false,
    aFiles: []
  };
  this.aStopList = [];
  this.fOnUploadCancelCallback = null;
  this.oKey = null;
}

CCrypto.prototype.start = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(oFileInfo) {
    var ParanoidKey,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ParanoidKey = _args.length > 1 && _args[1] !== undefined ? _args[1] : '';
            this.oFileInfo = oFileInfo;
            this.oFile = oFileInfo.File;
            this.iChunkNumber = Math.ceil(oFileInfo.File.size / this.iChunkSize);
            this.iCurrChunk = 0;
            this.oChunk = null;
            this.iv = window.crypto.getRandomValues(new Uint8Array(16));
            this.oFileInfo.Hidden = {
              'RangeType': 1,
              'Overwrite': true
            };
            this.oFileInfo.Hidden.ExtendedProps = {
              'InitializationVector': HexUtils.Array2HexString(new Uint8Array(this.iv))
            };

            if (ParanoidKey) {
              this.oFileInfo.Hidden.ExtendedProps.ParanoidKey = ParanoidKey;
            }

          case 10:
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

CCrypto.prototype.startUpload = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(oFileInfo, sUid, fOnChunkEncryptCallback, fCancelCallback) {
    var sKeyData, oCurrentUserPrivateKey, CurrentUserPublicKey, sEncryptedKey;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            this.oChunkQueue.isProcessed = true;
            _context2.next = 3;
            return JscryptoKey.generateKey();

          case 3:
            this.oKey = _context2.sent;
            _context2.next = 6;
            return JscryptoKey.convertKeyToString(this.oKey);

          case 6:
            sKeyData = _context2.sent;
            _context2.next = 9;
            return OpenPgpEncryptor.getCurrentUserPrivateKey();

          case 9:
            oCurrentUserPrivateKey = _context2.sent;

            if (!(oCurrentUserPrivateKey && sKeyData)) {
              _context2.next = 30;
              break;
            }

            _context2.next = 13;
            return OpenPgpEncryptor.getCurrentUserPublicKey();

          case 13:
            CurrentUserPublicKey = _context2.sent;

            if (!CurrentUserPublicKey) {
              _context2.next = 27;
              break;
            }

            _context2.next = 17;
            return this.encryptParanoidKey(sKeyData, [CurrentUserPublicKey]);

          case 17:
            sEncryptedKey = _context2.sent;

            if (!sEncryptedKey) {
              _context2.next = 24;
              break;
            }

            _context2.next = 21;
            return this.start(oFileInfo, sEncryptedKey);

          case 21:
            this.readChunk(sUid, fOnChunkEncryptCallback);
            _context2.next = 25;
            break;

          case 24:
            if (_.isFunction(fCancelCallback)) {
              fCancelCallback();
            }

          case 25:
            _context2.next = 28;
            break;

          case 27:
            if (_.isFunction(fCancelCallback)) {
              fCancelCallback();
            }

          case 28:
            _context2.next = 31;
            break;

          case 30:
            if (_.isFunction(fCancelCallback)) {
              fCancelCallback();
            }

          case 31:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x2, _x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

CCrypto.prototype.readChunk = function (sUid, fOnChunkEncryptCallback) {
  var iStart = this.iChunkSize * this.iCurrChunk,
      iEnd = this.iCurrChunk < this.iChunkNumber - 1 ? this.iChunkSize * (this.iCurrChunk + 1) : this.oFile.size,
      oReader = new FileReader(),
      oBlob = null;

  if (this.aStopList.indexOf(sUid) !== -1) {
    // if user canceled uploading file with uid = sUid
    this.aStopList.splice(this.aStopList.indexOf(sUid), 1);
    this.checkQueue();
    return;
  } else {
    // Get file chunk
    if (this.oFile.slice) {
      oBlob = this.oFile.slice(iStart, iEnd);
    } else if (this.oFile.webkitSlice) {
      oBlob = this.oFile.webkitSlice(iStart, iEnd);
    } else if (this.oFile.mozSlice) {
      oBlob = this.oFile.mozSlice(iStart, iEnd);
    }

    if (oBlob) {
      try {
        //Encrypt file chunk
        oReader.onloadend = _.bind(function (evt) {
          if (evt.target.readyState === FileReader.DONE) {
            this.oChunk = evt.target.result;
            this.iCurrChunk++;
            this.encryptChunk(sUid, fOnChunkEncryptCallback);
          }
        }, this);
        oReader.readAsArrayBuffer(oBlob);
      } catch (err) {
        Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_ENCRYPTION'));
      }
    }
  }
};

CCrypto.prototype.encryptChunk = function (sUid, fOnChunkEncryptCallback) {
  crypto.subtle.encrypt({
    name: 'AES-CBC',
    iv: this.iv
  }, this.oKey, this.oChunk).then(_.bind(function (oEncryptedContent) {
    //delete padding for all chunks except last one
    oEncryptedContent = this.iChunkNumber > 1 && this.iCurrChunk !== this.iChunkNumber ? oEncryptedContent.slice(0, oEncryptedContent.byteLength - 16) : oEncryptedContent;

    var oEncryptedFile = new Blob([oEncryptedContent], {
      type: "text/plain",
      lastModified: new Date()
    }),
        //fProcessNextChunkCallback runs after previous chunk uploading
    fProcessNextChunkCallback = _.bind(function (sUid, fOnChunkEncryptCallback) {
      if (this.iCurrChunk < this.iChunkNumber) {
        // if it was not last chunk - read another chunk
        this.readChunk(sUid, fOnChunkEncryptCallback);
      } else {
        // if it was last chunk - check Queue for files awaiting upload
        this.oChunkQueue.isProcessed = false;
        this.checkQueue();
      }
    }, this);

    this.oFileInfo.File = oEncryptedFile; //use last 16 byte of current chunk as initial vector for next chunk

    this.iv = new Uint8Array(oEncryptedContent.slice(oEncryptedContent.byteLength - 16));

    if (this.iCurrChunk === 1) {
      // for first chunk enable 'FirstChunk' attribute. This is necessary to solve the problem of simultaneous loading of files with the same name
      this.oFileInfo.Hidden.ExtendedProps.FirstChunk = true;
    } else {
      delete this.oFileInfo.Hidden.ExtendedProps.FirstChunk;
    }

    if (this.iCurrChunk == this.iChunkNumber) {
      // unmark file as loading
      delete this.oFileInfo.Hidden.ExtendedProps.Loading;
    } else {
      // mark file as loading until upload doesn't finish
      this.oFileInfo.Hidden.ExtendedProps.Loading = true;
    } // call upload of encrypted chunk


    fOnChunkEncryptCallback(sUid, this.oFileInfo, fProcessNextChunkCallback, this.iCurrChunk, this.iChunkNumber, (this.iCurrChunk - 1) * this.iChunkSize);
  }, this))["catch"](function (err) {
    Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_ENCRYPTION'));
  });
};

CCrypto.prototype.downloadDividedFile = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(oFile, iv, fProcessBlobCallback, fProcessBlobErrorCallback) {
    var sParanoidEncryptedKey,
        sKey,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sParanoidEncryptedKey = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : '';
            oFile.startDownloading();
            _context3.next = 4;
            return this.prepareKey(oFile, sParanoidEncryptedKey);

          case 4:
            sKey = _context3.sent;

            if (sKey !== false) {
              new CDownloadFile(oFile, iv, this.iChunkSize, fProcessBlobCallback, fProcessBlobErrorCallback, sKey);
            } else {
              oFile.stopDownloading();
            }

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x6, _x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

CCrypto.prototype.prepareKey = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(oFile) {
    var sParanoidEncryptedKey,
        sKey,
        bContinue,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sParanoidEncryptedKey = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : '';
            sKey = '';

            if (!sParanoidEncryptedKey) {
              _context4.next = 10;
              break;
            }

            _context4.next = 5;
            return this.decryptParanoidKey(sParanoidEncryptedKey);

          case 5:
            sKey = _context4.sent;

            if (sKey) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", false);

          case 8:
            _context4.next = 22;
            break;

          case 10:
            if (Settings.DontRemindMe()) {
              _context4.next = 16;
              break;
            }

            _context4.next = 13;
            return this.showOutdatedEncryptionMethodPopup(oFile.fileName());

          case 13:
            bContinue = _context4.sent;

            if (bContinue) {
              _context4.next = 16;
              break;
            }

            return _context4.abrupt("return", false);

          case 16:
            if (this.isKeyInStorage()) {
              _context4.next = 22;
              break;
            }

            _context4.next = 19;
            return this.getTemporaryKeyAsString();

          case 19:
            sKey = _context4.sent;

            if (sKey) {
              _context4.next = 22;
              break;
            }

            return _context4.abrupt("return", false);

          case 22:
            return _context4.abrupt("return", sKey);

          case 23:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x10) {
    return _ref4.apply(this, arguments);
  };
}();

CCrypto.prototype.getTemporaryKeyAsString = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
  var oPromiseGetKey, sKey;
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          oPromiseGetKey = new Promise(function (resolve, reject) {
            var fOnKeyEnterCallback = function fOnKeyEnterCallback(sKey) {
              resolve(sKey);
            };

            var fOnCancellCallback = function fOnCancellCallback() {
              resolve(false);
            }; //showing popup


            Popups.showPopup(GetTemporaryKeyPopup, [fOnKeyEnterCallback, fOnCancellCallback]);
          });
          _context5.next = 3;
          return oPromiseGetKey;

        case 3:
          sKey = _context5.sent;
          return _context5.abrupt("return", sKey);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  }, _callee5);
}));

CCrypto.prototype.showOutdatedEncryptionMethodPopup = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(sFileName) {
    var oPromiseShowPopup, bResult;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            oPromiseShowPopup = new Promise(function (resolve, reject) {
              var fContinueCallback = function fContinueCallback() {
                resolve(true);
              };

              var fCancellCallback = function fCancellCallback() {
                resolve(false);
              }; //showing popup


              Popups.showPopup(OutdatedEncryptionMethodPopup, [sFileName, fContinueCallback, fCancellCallback]);
            });
            _context6.next = 3;
            return oPromiseShowPopup;

          case 3:
            bResult = _context6.sent;
            return _context6.abrupt("return", bResult);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11) {
    return _ref6.apply(this, arguments);
  };
}();

CCrypto.prototype.encryptParanoidKey = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(sParanoidKey, aPublicKeys) {
    var sPassword,
        sEncryptedKey,
        oPrivateKey,
        oPGPEncryptionResult,
        _oPGPEncryptionResult,
        data,
        password,
        _args7 = arguments;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            sPassword = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : '';
            sEncryptedKey = "";
            _context7.next = 4;
            return OpenPgpEncryptor.getCurrentUserPrivateKey();

          case 4:
            oPrivateKey = _context7.sent;

            if (!oPrivateKey) {
              _context7.next = 10;
              break;
            }

            _context7.next = 8;
            return OpenPgpEncryptor.encryptData(sParanoidKey, aPublicKeys, [oPrivateKey], false,
            /*bPasswordBasedEncryption*/
            true,
            /*bSign*/
            sPassword);

          case 8:
            oPGPEncryptionResult = _context7.sent;

            if (oPGPEncryptionResult.result) {
              _oPGPEncryptionResult = oPGPEncryptionResult.result, data = _oPGPEncryptionResult.data, password = _oPGPEncryptionResult.password;
              sEncryptedKey = data;
            } else if (oPGPEncryptionResult.hasErrors() || oPGPEncryptionResult.hasNotices()) {
              OpenPgpEncryptor.showPgpErrorByCode(oPGPEncryptionResult, '', TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));
            }

          case 10:
            return _context7.abrupt("return", sEncryptedKey);

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();

CCrypto.prototype.decryptParanoidKey = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(sParanoidEncryptedKey) {
    var sPassword,
        sKey,
        oPGPDecryptionResult,
        oCurrentUserPrivateKey,
        sReport,
        aErrors,
        aNotices,
        _args8 = arguments;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            sPassword = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : '';
            sKey = '';
            _context8.next = 4;
            return OpenPgpEncryptor.decryptData(sParanoidEncryptedKey, sPassword);

          case 4:
            oPGPDecryptionResult = _context8.sent;

            if (!oPGPDecryptionResult.result) {
              _context8.next = 17;
              break;
            }

            sKey = oPGPDecryptionResult.result;

            if (!(oPGPDecryptionResult.validKeyNames && oPGPDecryptionResult.validKeyNames.length)) {
              _context8.next = 14;
              break;
            }

            _context8.next = 10;
            return OpenPgpEncryptor.getCurrentUserPrivateKey();

          case 10:
            oCurrentUserPrivateKey = _context8.sent;

            if (!oCurrentUserPrivateKey || !oPGPDecryptionResult.validKeyNames.includes(oCurrentUserPrivateKey.getUser())) {
              //Paranoid-key was signed with a foreign key
              sReport = TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/REPORT_SUCCESSFULL_SIGNATURE_VERIFICATION') + oPGPDecryptionResult.validKeyNames.join(', ').replace(/</g, "&lt;").replace(/>/g, "&gt;");
              Screens.showReport(sReport);
            }

            _context8.next = 15;
            break;

          case 14:
            if (oPGPDecryptionResult.notices && _.indexOf(oPGPDecryptionResult.notices, Enums.OpenPgpErrors.VerifyErrorNotice) !== -1) {
              Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_SIGNATURE_NOT_VERIFIED'));
            }

          case 15:
            _context8.next = 18;
            break;

          case 17:
            if (oPGPDecryptionResult.hasErrors() || oPGPDecryptionResult.hasNotices()) {
              //if errors or notices contains PrivateKeyNotFoundError
              aErrors = oPGPDecryptionResult.errors ? oPGPDecryptionResult.errors : [];
              aNotices = oPGPDecryptionResult.notices ? oPGPDecryptionResult.notices : [];

              if ([].concat(_toConsumableArray(aErrors), _toConsumableArray(aNotices)).some(function (error) {
                return error.length && error[0] === Enums.OpenPgpErrors.PrivateKeyNotFoundError;
              })) {
                //show error message customised for files
                Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_NO_PRIVATE_KEY_FOUND_FOR_DECRYPT'));
              } else {
                OpenPgpEncryptor.showPgpErrorByCode(oPGPDecryptionResult, '', TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));
              }
            }

          case 18:
            return _context8.abrupt("return", sKey);

          case 19:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x14) {
    return _ref8.apply(this, arguments);
  };
}();
/**
* Checking Queue for files awaiting upload
*/


CCrypto.prototype.checkQueue = function () {
  var aNode = null;

  if (this.oChunkQueue.aFiles.length > 0) {
    aNode = this.oChunkQueue.aFiles.shift();
    aNode.fStartUploadCallback.apply(aNode.fStartUploadCallback, [aNode.oFileInfo, aNode.sUid, aNode.fOnChunkEncryptCallback]);
  }
};
/**
* Stop file uploading
*
* @param {String} sUid
* @param {Function} fOnUploadCancelCallback
*/


CCrypto.prototype.stopUploading = function (sUid, fOnUploadCancelCallback, sFileName) {
  var bFileInQueue = false; // If file await to be uploaded - delete it from queue

  this.oChunkQueue.aFiles.forEach(function (oData, index, array) {
    if (oData.sUid === sUid) {
      fOnUploadCancelCallback(sUid, oData.oFileInfo.FileName);
      array.splice(index, 1);
      bFileInQueue = true;
    }
  });

  if (!bFileInQueue) {
    this.aStopList.push(sUid);
    this.oChunkQueue.isProcessed = false;
    fOnUploadCancelCallback(sUid, sFileName);
    this.oKey = null; //		this.checkQueue();
  }
};

CCrypto.prototype.viewEncryptedImage = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(oFile, iv) {
    var sParanoidEncryptedKey,
        sKey,
        _args9 = arguments;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            sParanoidEncryptedKey = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : '';
            oFile.startDownloading();
            _context9.next = 4;
            return this.prepareKey(oFile, sParanoidEncryptedKey);

          case 4:
            sKey = _context9.sent;

            if (sKey !== false) {
              new CViewImage(oFile, iv, this.iChunkSize, sKey);
            } else {
              oFile.stopDownloading();
            }

          case 6:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function (_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}();

CCrypto.prototype.isKeyInStorage = function () {
  return !!JscryptoKey.loadKeyFromStorage();
};

function CDownloadFile(oFile, iv, iChunkSize, fProcessBlobCallback, fProcessBlobErrorCallback) {
  var sKey = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  this.oWriter = new CWriter(oFile.fileName(), fProcessBlobCallback);
  this.init(oFile, iv, iChunkSize, fProcessBlobErrorCallback, sKey);
}

CDownloadFile.prototype.init = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(oFile, iv, iChunkSize, fProcessBlobErrorCallback, sKey) {
    var _this = this;

    var fCancelCallback, oKey;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            this.sHash = Utils.getRandomHash();
            this.oFile = oFile;
            this.sFileName = oFile.fileName();
            this.iFileSize = oFile.size();
            this.sDownloadLink = oFile.getActionUrl('download');
            this.iCurrChunk = 0;
            this.iv = new Uint8Array(HexUtils.HexString2Array(iv));
            this.key = null;
            this.iChunkNumber = Math.ceil(this.iFileSize / iChunkSize);
            this.iChunkSize = iChunkSize;
            this.fProcessBlobErrorCallback = fProcessBlobErrorCallback; //clear parameters after & if DownloadLink contains any

            if (this.sDownloadLink.indexOf('&') > 0) {
              this.sDownloadLink = this.sDownloadLink.substring(0, this.sDownloadLink.indexOf('&'));
            }

            fCancelCallback = function fCancelCallback() {
              if (_.isFunction(_this.fProcessBlobErrorCallback)) {
                _this.fProcessBlobErrorCallback();
              }

              _this.stopDownloading();
            };

            if (!sKey) {
              _context10.next = 20;
              break;
            }

            _context10.next = 16;
            return JscryptoKey.getKeyFromString(sKey);

          case 16:
            oKey = _context10.sent;

            if (oKey) {
              this.key = oKey;
              this.decryptChunk();
            } else {
              fCancelCallback();
            }

            _context10.next = 21;
            break;

          case 20:
            //read the key from local storage
            JscryptoKey.getKey(function (oKey) {
              _this.key = oKey;

              _this.decryptChunk();
            }, fCancelCallback);

          case 21:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function (_x17, _x18, _x19, _x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}();

CDownloadFile.prototype.writeChunk = function (oDecryptedUint8Array) {
  if (this.oFile.downloading() !== true) {
    // if download was canceled
    return;
  } else {
    this.oWriter.write(oDecryptedUint8Array); //write decrypted chunk

    if (this.iCurrChunk < this.iChunkNumber) {
      //if it was not last chunk - decrypting another chunk
      this.decryptChunk();
    } else {
      this.stopDownloading();
      this.oWriter.close();
    }
  }
};

CDownloadFile.prototype.decryptChunk = function () {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", this.getChunkLink(), true);
  oReq.responseType = 'arraybuffer';
  oReq.onprogress = _.bind(function (oEvent) {
    if (this.isDownloading()) {
      this.oFile.onDownloadProgress(oEvent.loaded + (this.iCurrChunk - 1) * this.iChunkSize, this.iFileSize);
    } else {
      oReq.abort();
    }
  }, this);
  oReq.onload = _.bind(function (oEvent) {
    var oArrayBuffer = oReq.response,
        oDataWithPadding = {};

    if (oReq.status === 200 && oArrayBuffer) {
      oDataWithPadding = new Uint8Array(oArrayBuffer.byteLength + 16);
      oDataWithPadding.set(new Uint8Array(oArrayBuffer), 0);

      if (this.iCurrChunk !== this.iChunkNumber) {
        // for all chunk except last - add padding
        crypto.subtle.encrypt({
          name: 'AES-CBC',
          iv: new Uint8Array(oArrayBuffer.slice(oArrayBuffer.byteLength - 16))
        }, this.key, new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]).buffer // generate padding for chunk
        ).then(_.bind(function (oEncryptedContent) {
          // add generated padding to data
          // oEncryptedContent.slice(0, 16) - use only first 16 bytes of generated padding, other data is padding for our padding
          oDataWithPadding.set(new Uint8Array(new Uint8Array(oEncryptedContent.slice(0, 16))), oArrayBuffer.byteLength); // decrypt data

          crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv: this.iv
          }, this.key, oDataWithPadding.buffer).then(_.bind(function (oDecryptedArrayBuffer) {
            var oDecryptedUint8Array = new Uint8Array(oDecryptedArrayBuffer); // use last 16 byte of current chunk as initial vector for next chunk

            this.iv = new Uint8Array(oArrayBuffer.slice(oArrayBuffer.byteLength - 16));
            this.writeChunk(oDecryptedUint8Array);
          }, this))["catch"](_.bind(function (err) {
            this.stopDownloading();

            if (_.isFunction(this.fProcessBlobErrorCallback)) {
              this.fProcessBlobErrorCallback();
            }

            Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_DECRYPTION'));
          }, this));
        }, this));
      } else {
        //for last chunk just decrypt data
        crypto.subtle.decrypt({
          name: 'AES-CBC',
          iv: this.iv
        }, this.key, oArrayBuffer).then(_.bind(function (oDecryptedArrayBuffer) {
          var oDecryptedUint8Array = new Uint8Array(oDecryptedArrayBuffer); // use last 16 byte of current chunk as initial vector for next chunk

          this.iv = new Uint8Array(oArrayBuffer.slice(oArrayBuffer.byteLength - 16));
          this.writeChunk(oDecryptedUint8Array);
        }, this))["catch"](_.bind(function (err) {
          this.stopDownloading();

          if (_.isFunction(this.fProcessBlobErrorCallback)) {
            this.fProcessBlobErrorCallback();
          }

          Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_DECRYPTION'));
        }, this));
      }
    }
  }, this);
  oReq.send(null);
};

CDownloadFile.prototype.stopDownloading = function () {
  this.oFile.stopDownloading();
};
/**
 * Generate link for downloading current chunk
 */


CDownloadFile.prototype.getChunkLink = function () {
  return this.sDownloadLink + '/download/' + this.iCurrChunk++ + '/' + this.iChunkSize + '&' + this.sHash;
};

CDownloadFile.prototype.isDownloading = function () {
  return this.oFile.downloading();
};

function CViewImage(oFile, iv, iChunkSize) {
  var sParanoidEncryptedKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  this.oWriter = null;
  this.init(oFile, iv, iChunkSize,
  /*fProcessBlobErrorCallback*/
  null, sParanoidEncryptedKey);
}

CViewImage.prototype = Object.create(CDownloadFile.prototype);
CViewImage.prototype.constructor = CViewImage;

CViewImage.prototype.writeChunk = function (oDecryptedUint8Array) {
  this.oWriter = this.oWriter === null ? new CBlobViewer(this.sFileName) : this.oWriter;
  this.oWriter.write(oDecryptedUint8Array); //write decrypted chunk

  if (this.iCurrChunk < this.iChunkNumber) {
    //if it was not last chunk - decrypting another chunk
    this.decryptChunk();
  } else {
    this.stopDownloading();
    this.oWriter.close();
  }
};
/**
* Writing chunks in file
*
* @constructor
* @param {String} sFileName
* @param {Function} fProcessBlobCallback
*/


function CWriter(sFileName, fProcessBlobCallback) {
  this.sName = sFileName;
  this.aBuffer = [];

  if (_.isFunction(fProcessBlobCallback)) {
    this.fProcessBlobCallback = fProcessBlobCallback;
  }
}

CWriter.prototype.write = function (oDecryptedUint8Array) {
  this.aBuffer.push(oDecryptedUint8Array);
};

CWriter.prototype.close = function () {
  var file = new Blob(this.aBuffer);

  if (typeof this.fProcessBlobCallback !== 'undefined') {
    this.fProcessBlobCallback(file);
  } else {
    FileSaver.saveAs(file, this.sName);
  }

  file = null;
};
/**
* Writing chunks in blob for viewing
*
* @constructor
* @param {String} sFileName
*/


function CBlobViewer(sFileName) {
  this.sName = sFileName;
  this.aBuffer = [];
  this.imgWindow = window.open("", "_blank", "height=auto, width=auto,toolbar=no,scrollbars=no,resizable=yes");
}

CBlobViewer.prototype = Object.create(CWriter.prototype);
CBlobViewer.prototype.constructor = CBlobViewer;

CBlobViewer.prototype.close = function () {
  try {
    var file = new Blob(this.aBuffer),
        link = window.URL.createObjectURL(file),
        img = null;
    this.imgWindow.document.write("<head><title>" + this.sName + '</title></head><body><img src="' + link + '" /></body>');
    img = $(this.imgWindow.document.body).find('img');
    img.on('load', function () {
      //remove blob after showing image
      window.URL.revokeObjectURL(link);
    });
  } catch (err) {
    Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_POPUP_WINDOWS'));
  }
};

module.exports = new CCrypto();

/***/ }),

/***/ "TrqT":
/*!*****************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/GetTemporaryKeyPopup.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT");
/**
 * @constructor
 */


function GetTemporaryKeyPopup() {
  CAbstractPopup.call(this);
  this.key = ko.observable('');
  this.fOnKeyEnterCallback = null;
  this.fOnCancellCallback = null;
}

_.extendOwn(GetTemporaryKeyPopup.prototype, CAbstractPopup.prototype);

GetTemporaryKeyPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_GetTemporaryKeyPopup';

GetTemporaryKeyPopup.prototype.onOpen = function (fOnKeyEnterCallback, fOnCancellCallback) {
  this.key('');
  this.fOnKeyEnterCallback = fOnKeyEnterCallback;
  this.fOnCancellCallback = fOnCancellCallback;
};

GetTemporaryKeyPopup.prototype.cancel = function () {
  this.fOnCancellCallback();
  this.closePopup();
};

GetTemporaryKeyPopup.prototype.enterKey = function () {
  if (this.key() === '') {
    Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_KEY_CANT_BE_BLANK'));
  } else {
    this.fOnKeyEnterCallback(this.key());
    this.closePopup();
  }
};

module.exports = new GetTemporaryKeyPopup();

/***/ }),

/***/ "Z2LC":
/*!**********************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/InitializationVectorPopup.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR");
/**
 * @constructor
 */


function CInitializationVectorPopup() {
  CAbstractPopup.call(this);
  this.fileName = ko.observable('');
  this.iv = ko.observable('');
  this.oldEncryptionMode = ko.observable(false);
}

_.extendOwn(CInitializationVectorPopup.prototype, CAbstractPopup.prototype);

CInitializationVectorPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_InitializationVectorPopup';

CInitializationVectorPopup.prototype.onOpen = function (oFile, sIv) {
  var _oFile$oExtendedProps;

  this.oFile = oFile;
  this.fileName(oFile.fileName());
  this.iv(sIv);
  this.oldEncryptionMode(!(oFile !== null && oFile !== void 0 && (_oFile$oExtendedProps = oFile.oExtendedProps) !== null && _oFile$oExtendedProps !== void 0 && _oFile$oExtendedProps.ParanoidKey));
};

CInitializationVectorPopup.prototype.downloadEncrypted = function () {
  var _this$oFile;

  if (_.isFunction((_this$oFile = this.oFile) === null || _this$oFile === void 0 ? void 0 : _this$oFile.downloadFile)) {
    this.oFile.downloadFile(true);
  }
};

CInitializationVectorPopup.prototype.getAesKey = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var _this$oFile2, _this$oFile2$oExtende;

  var Crypto, sKey;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          Crypto = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/CCrypto.js */ "QJDP");
          _context.next = 3;
          return Crypto.decryptParanoidKey((_this$oFile2 = this.oFile) === null || _this$oFile2 === void 0 ? void 0 : (_this$oFile2$oExtende = _this$oFile2.oExtendedProps) === null || _this$oFile2$oExtende === void 0 ? void 0 : _this$oFile2$oExtende.ParanoidKey);

        case 3:
          sKey = _context.sent;

          if (Types.isNonEmptyString(sKey)) {
            Popups.showPopup(AlertPopup, [sKey, null, TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/HEADING_IV_AES_KEY')]);
          }

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));
module.exports = new CInitializationVectorPopup();

/***/ }),

/***/ "c2EW":
/*!*******************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ConfirmEncryptionPopup.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF");
/**
 * @constructor
 */


function CConfirmEncryptionPopup() {
  CAbstractPopup.call(this);
  this.fEncrypt = null;
  this.fUpload = null;
  this.fCancel = null;
  this.message = ko.observable('');
  this.filesConfirmText = ko.observable('');
}

_.extendOwn(CConfirmEncryptionPopup.prototype, CAbstractPopup.prototype);

CConfirmEncryptionPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_ConfirmEncryptionPopup';

CConfirmEncryptionPopup.prototype.onOpen = function (fEncrypt, fUpload, fCancel, iFilesCount, aFileList) {
  var aEncodedFiles = _.map(aFileList, function (sFileName) {
    return TextUtils.encodeHtml(sFileName);
  });

  this.filesConfirmText('');
  this.fEncrypt = fEncrypt;
  this.fUpload = fUpload;
  this.fCancel = fCancel;
  this.message(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/CONFIRM_ENCRYPT_PLURAL', {
    'VALUE': iFilesCount > 1 ? iFilesCount : '"' + aFileList[0] + '"'
  }, null, iFilesCount));

  if (iFilesCount > 1) {
    this.filesConfirmText(aEncodedFiles.join('<br />'));
  }
};

CConfirmEncryptionPopup.prototype.cancelUpload = function () {
  this.fCancel();
  this.closePopup();
};

CConfirmEncryptionPopup.prototype.encrypt = function () {
  this.fEncrypt();
  this.closePopup();
};

CConfirmEncryptionPopup.prototype.upload = function () {
  this.fUpload();
  this.closePopup();
};

module.exports = new CConfirmEncryptionPopup();

/***/ }),

/***/ "hJUJ":
/*!**************************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/OutdatedEncryptionMethodPopup.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
    Settings = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/Settings.js */ "I5pT"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF");
/**
 * @constructor
 */


function OutdatedEncryptionMethodPopup() {
  CAbstractPopup.call(this);
  this.message = ko.observable('');
  this.dontRemindMe = ko.observable(false);
  this.fContinueCallback = null;
  this.fCancelCallback = null;
}

_.extendOwn(OutdatedEncryptionMethodPopup.prototype, CAbstractPopup.prototype);

OutdatedEncryptionMethodPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_OutdatedEncryptionMethodPopup';

OutdatedEncryptionMethodPopup.prototype.onOpen = function (sFileName, fContinueCallback, fCancelCallback) {
  this.message(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/MESSAGE_OUTDATED_ENCRYPTION_METHOD', {
    'FILENAME': sFileName
  }));
  this.fContinueCallback = fContinueCallback;
  this.fCancelCallback = fCancelCallback;
};

OutdatedEncryptionMethodPopup.prototype.cancel = function () {
  this.fCancelCallback();
  this.closePopup();
};

OutdatedEncryptionMethodPopup.prototype.continueDownload = function () {
  if (this.dontRemindMe()) {
    Ajax.send('CoreParanoidEncryptionWebclientPlugin', 'DontRemindMe', {}, function (oResponse) {
      if (oResponse.Result === true) {
        Settings.DontRemindMe(true);
      }
    }, this);
  }

  this.fContinueCallback();
  this.closePopup();
};

module.exports = new OutdatedEncryptionMethodPopup();

/***/ }),

/***/ "mHl/":
/*!******************************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/views/ParanoidEncryptionSettingsFormView.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    $ = __webpack_require__(/*! jquery */ "EVdn"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
    ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    JscryptoKey = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js */ "zDR0"),
    Settings = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/Settings.js */ "I5pT"),
    ImportKeyStringPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ImportKeyStringPopup.js */ "Npm9"),
    GenerateKeyPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/GenerateKeyPopup.js */ "2kfa"),
    ExportInformationPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ExportInformationPopup.js */ "t19A"),
    DeleteKeyPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/DeleteKeyPopup.js */ "nTW+"),
    HexUtils = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/utils/Hex.js */ "wjWM"),
    OpenPgpEncryptor = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpEncryptor');
/**
 * @constructor
 */


function CParanoidEncryptionSettingsFormView() {
  CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
  this.enableJscrypto = ko.observable(Settings.enableJscrypto());
  this.enableInPersonalStorage = ko.observable(Settings.EnableInPersonalStorage);
  this.keyName = ko.observable('');
  this.bIsHttpsEnable = window.location.protocol === "https:";
  this.allowChangeSettings = ko.observable(Settings.AllowChangeSettings);
  this.isImporting = ko.observable(false);
  this.exportKeyBound = _.bind(this.exportKey, this);
  this.isPGPKeysAvailable = ko.observable(true);

  if (ko.isObservable(JscryptoKey.keyName)) {
    JscryptoKey.keyName.subscribe(function () {
      this.keyName(JscryptoKey.keyName());
    }, this);
  }

  this.allowKeysManagement = ko.observable(!!this.keyName());
  this.keyName.subscribe(function () {
    if (!!this.keyName()) {
      this.allowKeysManagement(true);
    }
  }, this);
}

_.extendOwn(CParanoidEncryptionSettingsFormView.prototype, CAbstractSettingsFormView.prototype);

CParanoidEncryptionSettingsFormView.prototype.ViewTemplate = 'CoreParanoidEncryptionWebclientPlugin_ParanoidEncryptionSettingsFormView';

CParanoidEncryptionSettingsFormView.prototype.enableBackwardCompatibility = function () {
  this.allowKeysManagement(true);
};

CParanoidEncryptionSettingsFormView.prototype.importFileKey = function () {
  $("#import-key-file").click();
};

CParanoidEncryptionSettingsFormView.prototype.importStringKey = function () {
  Popups.showPopup(ImportKeyStringPopup);
};

CParanoidEncryptionSettingsFormView.prototype.readKeyFromFile = function () {
  var input = document.getElementById('import-key-file'),
      file = input.files[0],
      reader = new FileReader(),
      sContents = '',
      aFileNameParts = input.files[0].name.split('.'),
      sKeyName = '',
      fOnGenerateCallback = _.bind(function () {
    this.isImporting(false);
  }, this),
      fOnErrorCallback = _.bind(function () {
    this.isImporting(false);
  }, this);

  aFileNameParts.splice(aFileNameParts.length - 1, 1);
  sKeyName = aFileNameParts.join('');

  if (!file) {
    Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_IMPORT_KEY'));
    return;
  }

  this.isImporting(true);

  reader.onload = function (e) {
    sContents = e.target.result;
    JscryptoKey.importKeyFromString(sKeyName, sContents, fOnGenerateCallback, fOnErrorCallback);
  };

  try {
    reader.readAsText(file);
  } catch (e) {
    Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_IMPORT_KEY'));
  }
};

CParanoidEncryptionSettingsFormView.prototype.generateNewKey = function () {
  Popups.showPopup(GenerateKeyPopup, [_.bind(function () {
    //After generating new key show "export key" dialog
    Popups.showPopup(ExportInformationPopup, [this.exportKeyBound, this.keyName()]);
  }, this)]);
};

CParanoidEncryptionSettingsFormView.prototype.removeJscryptoKey = function () {
  var fRemove = _.bind(function (bRemove) {
    if (bRemove) {
      var oResult = JscryptoKey.deleteKey();

      if (oResult.error) {
        Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_DELETE_KEY'));
      }
    }
  }, this);

  Popups.showPopup(DeleteKeyPopup, [this.exportKeyBound, this.keyName(), fRemove]);
};

CParanoidEncryptionSettingsFormView.prototype.getCurrentValues = function () {
  return [this.enableJscrypto(), this.enableInPersonalStorage()];
};

CParanoidEncryptionSettingsFormView.prototype.revertGlobalValues = function () {
  this.enableJscrypto(Settings.enableJscrypto());
  this.enableInPersonalStorage(Settings.EnableInPersonalStorage);
};

CParanoidEncryptionSettingsFormView.prototype.getParametersForSave = function () {
  return {
    'EnableModule': this.enableJscrypto(),
    'EnableInPersonalStorage': Types.pInt(this.enableInPersonalStorage())
  };
};

CParanoidEncryptionSettingsFormView.prototype.applySavedValues = function () {
  Settings.update(this.enableJscrypto(), this.enableInPersonalStorage());
};

CParanoidEncryptionSettingsFormView.prototype.onShow = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var bIsPrivateKeyAvailable;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          JscryptoKey.loadKeyNameFromStorage();
          _context.next = 3;
          return OpenPgpEncryptor.isPrivateKeyAvailable();

        case 3:
          bIsPrivateKeyAvailable = _context.sent;
          this.isPGPKeysAvailable(bIsPrivateKeyAvailable);
          this.allowKeysManagement(!!this.keyName());

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));

CParanoidEncryptionSettingsFormView.prototype.exportKey = function () {
  var oBlob = null,
      downloadLinkHref = null,
      oDownloadLink = document.createElement("a");
  JscryptoKey.getKey(
  /*fOnGenerateKeyCallback*/
  _.bind(function (oKey) {
    if (oKey) {
      JscryptoKey.exportKey().then(_.bind(function (keydata) {
        oBlob = new Blob([HexUtils.Array2HexString(new Uint8Array(keydata))], {
          type: 'text/plain'
        });
        downloadLinkHref = window.URL.createObjectURL(oBlob);
        document.body.appendChild(oDownloadLink);
        oDownloadLink.style = "display: none";
        oDownloadLink.href = downloadLinkHref;
        oDownloadLink.download = this.keyName();
        oDownloadLink.click();
        window.URL.revokeObjectURL(downloadLinkHref);
      }, this))["catch"](function () {
        Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));
      });
    } else {
      Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));
    }
  }, this),
  /*fOnErrorCallback*/
  false,
  /*sPassword*/
  false,
  /*bForcedKeyLoading*/
  true);
};

module.exports = new CParanoidEncryptionSettingsFormView();

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

/***/ "nTW+":
/*!***********************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/DeleteKeyPopup.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "20Ah");
/**
 * @constructor
 */


function CDeleteKeyPopup() {
  CAbstractPopup.call(this);
  this.fExportKeyCallback = null;
  this.keyName = ko.observable('');
  this.fDelete = null;
  this.fDeleteCallback = null;
}

_.extendOwn(CDeleteKeyPopup.prototype, CAbstractPopup.prototype);

CDeleteKeyPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_DeleteKeyPopup';

CDeleteKeyPopup.prototype.onOpen = function (fExportKeyCallback, sKeyName, fDelete) {
  if (_.isFunction(fExportKeyCallback)) {
    this.fExportKeyCallback = _.bind(function () {
      this.closePopup();
      fExportKeyCallback();
    }, this);
  }

  this.keyName(sKeyName);
  this.fDeleteCallback = _.bind(function (bRemove) {
    fDelete.call(this, bRemove);

    if (bRemove) {
      this.closePopup();
    } else {
      this.showPopup();
    }
  }, this);
};

CDeleteKeyPopup.prototype.deleteKey = function () {
  this.hidePopup();
  Popups.showPopup(ConfirmPopup, [TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/CONFIRM_DELETE_KEY'), this.fDeleteCallback]);
};

module.exports = new CDeleteKeyPopup();

/***/ }),

/***/ "oBzO":
/*!*********************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/manager.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = __webpack_require__(/*! underscore */ "F/us"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
    Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
    App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
    Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "HLSX"),
    Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
    Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
    AlertPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/AlertPopup.js */ "1grR"),
    ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "20Ah"),
    ConfirmEncryptionPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ConfirmEncryptionPopup.js */ "c2EW"),
    ConfirmUploadPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ConfirmUploadPopup.js */ "2d9n"),
    InitializationVectorPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/InitializationVectorPopup.js */ "Z2LC"),
    Settings = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/Settings.js */ "I5pT"),
    Crypto = null,
    OpenPgpEncryptor = null,
    AwaitConfirmationQueue = [],
    //List of files waiting for the user to decide on encryption
isConfirmPopupShown = false,
    oButtonsView = null,
    FilesView = null;

function IsHttpsEnable() {
  return window.location.protocol === "https:";
}

function ShowUploadPopup(sUid, oFileInfo, fUpload, fCancel, sErrorText) {
  if (isConfirmPopupShown) {
    AwaitConfirmationQueue.push({
      sUid: sUid,
      oFileInfo: oFileInfo
    });
  } else {
    setTimeout(function () {
      Popups.showPopup(ConfirmUploadPopup, [fUpload, fCancel, AwaitConfirmationQueue.length, _.map(AwaitConfirmationQueue, function (element) {
        return element.oFileInfo.FileName;
      }), sErrorText]);
    }, 10);
    isConfirmPopupShown = true;
    AwaitConfirmationQueue.push({
      sUid: sUid,
      oFileInfo: oFileInfo
    });
  }
}

function StartModule(ModulesManager) {
  var _this = this;

  ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [function () {
    return __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/views/ParanoidEncryptionSettingsFormView.js */ "mHl/");
  }, Settings.HashModuleName, TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/LABEL_SETTINGS_TAB')]);
  App.subscribeEvent('AbstractFileModel::FileDownload::before', function (oParams) {
    var oFile = oParams.File,
        oExtendedProps = (oFile === null || oFile === void 0 ? void 0 : oFile.oExtendedProps) || false,
        iv = (oExtendedProps === null || oExtendedProps === void 0 ? void 0 : oExtendedProps.InitializationVector) || false,
        sParanoidEncryptedKey = (oExtendedProps === null || oExtendedProps === void 0 ? void 0 : oExtendedProps.ParanoidKey) || false,
        sParanoidEncryptedKeyShared = (oExtendedProps === null || oExtendedProps === void 0 ? void 0 : oExtendedProps.ParanoidKeyShared) || false,
        bIsOwnFile = oFile.sOwnerName === App.getUserPublicId(),
        bIsSharedStorage = "storageType" in oFile ? oFile.storageType() === Enums.FileStorageType.Shared : false; //User can decrypt only own or shared files

    if (!Settings.enableJscrypto() || !iv || !(bIsOwnFile || bIsSharedStorage)) {//regular upload will start in Jua in this case
    } else if (!IsHttpsEnable()) {
      Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_HTTPS_NEEDED'));
      oParams.CancelDownload = true;
    } else {
      oParams.CustomDownloadHandler = function () {
        Crypto.downloadDividedFile(oFile, iv, null, null, bIsSharedStorage && sParanoidEncryptedKeyShared ? sParanoidEncryptedKeyShared : sParanoidEncryptedKey);
      };
    }
  });
  App.subscribeEvent('OpenPgpFilesWebclient::DownloadSecureFile', function (oParams) {
    var _oFile$oExtendedProps, _oFile$oExtendedProps2;

    var oFile = oParams.File,
        iv = (oFile === null || oFile === void 0 ? void 0 : (_oFile$oExtendedProps = oFile.oExtendedProps) === null || _oFile$oExtendedProps === void 0 ? void 0 : _oFile$oExtendedProps.InitializationVector) || false,
        sParanoidEncryptedKey = (oFile === null || oFile === void 0 ? void 0 : (_oFile$oExtendedProps2 = oFile.oExtendedProps) === null || _oFile$oExtendedProps2 === void 0 ? void 0 : _oFile$oExtendedProps2.ParanoidKey) || false,
        fProcessBlobCallback = oParams.fProcessBlobCallback,
        fProcessBlobErrorCallback = oParams.fProcessBlobErrorCallback; //User can decrypt only own files

    if (!Settings.enableJscrypto() || !iv || oFile.sOwnerName !== App.getUserPublicId()) {
      Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_СANT_DECRYPT_FILE'));

      if (_.isFunction(fProcessBlobErrorCallback)) {
        fProcessBlobErrorCallback();
      }
    } else if (!IsHttpsEnable()) {
      Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_HTTPS_NEEDED'));
      oParams.CancelDownload = true;

      if (_.isFunction(fProcessBlobErrorCallback)) {
        fProcessBlobErrorCallback();
      }
    } else {
      Crypto.downloadDividedFile(oFile, iv, fProcessBlobCallback, fProcessBlobErrorCallback, sParanoidEncryptedKey);
    }
  });
  App.subscribeEvent('Jua::FileUpload::before', function (oParams) {
    var sUid = oParams.sUid,
        sModuleName = oParams.sModuleName,
        oFileInfo = oParams.oFileInfo,
        fOnChunkEncryptCallback = oParams.fOnChunkReadyCallback,
        fRegularUploadFileCallback = oParams.fRegularUploadFileCallback,
        fCancelFunction = oParams.fCancelFunction,
        fStartUploadCallback = function fStartUploadCallback(oFileInfo, sUid, fOnChunkEncryptCallback) {
      if (!Settings.AllowMultiChunkUpload && oFileInfo.File.size > Crypto.iChunkSize) {
        Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_FILE_SIZE_LIMIT', {
          'VALUE': Settings.ChunkSizeMb
        }));
        fCancelFunction(sUid);
        Crypto.oChunkQueue.isProcessed = false;
        Crypto.checkQueue();
      } else {
        // Starts upload an encrypted file
        Crypto.startUpload(oFileInfo, sUid, fOnChunkEncryptCallback, _.bind(function () {
          fCancelFunction(sUid);
          Crypto.oChunkQueue.isProcessed = false;
          Crypto.checkQueue();
        }, this));
      }
    },
        fUpload = _.bind(function () {
      AwaitConfirmationQueue.forEach(function (element) {
        fRegularUploadFileCallback(element.sUid, element.oFileInfo);
      });
      AwaitConfirmationQueue = [];
      isConfirmPopupShown = false;
    }, this),
        fEncrypt = _.bind(function () {
      AwaitConfirmationQueue.forEach(function (element) {
        // if another file is being uploaded now - add a file to the queue
        Crypto.oChunkQueue.aFiles.push({
          fStartUploadCallback: fStartUploadCallback,
          oFileInfo: element.oFileInfo,
          sUid: element.sUid,
          fOnChunkEncryptCallback: fOnChunkEncryptCallback
        });
      });
      AwaitConfirmationQueue = [];
      isConfirmPopupShown = false;

      if (!Crypto.oChunkQueue.isProcessed) {
        Crypto.oChunkQueue.isProcessed = true;
        Crypto.checkQueue();
      }
    }),
        fCancel = _.bind(function () {
      AwaitConfirmationQueue.forEach(function (element) {
        fCancelFunction(element.sUid);
      });
      AwaitConfirmationQueue = [];
      isConfirmPopupShown = false;
    });

    if (Settings.enableJscrypto() && Settings.EncryptionAllowedModules && Settings.EncryptionAllowedModules.length > 0 && Settings.EncryptionAllowedModules.includes(sModuleName) && (oParams.sStorageType === 'encrypted' || oParams.sStorageType === 'personal' && Settings.EnableInPersonalStorage)) {
      if (!IsHttpsEnable()) {
        if (oParams.sStorageType === 'personal' && Settings.EnableInPersonalStorage) {
          //for AskMe encryption mode show dialog with warning and regular upload button
          ShowUploadPopup(sUid, oFileInfo, fUpload, fCancel, TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_HTTPS_NEEDED'));
        } else {
          //for Always encryption mode show error
          Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_HTTPS_NEEDED'));
          fCancelFunction(sUid);
        }
      } else if (oParams.sStorageType === 'personal' && Settings.EnableInPersonalStorage) {
        if (isConfirmPopupShown) {
          AwaitConfirmationQueue.push({
            sUid: sUid,
            oFileInfo: oFileInfo
          });
        } else {
          setTimeout(function () {
            Popups.showPopup(ConfirmEncryptionPopup, [fEncrypt, fUpload, fCancel, AwaitConfirmationQueue.length, _.map(AwaitConfirmationQueue, function (element) {
              return element.oFileInfo.FileName;
            })]);
          }, 10);
          isConfirmPopupShown = true;
          AwaitConfirmationQueue.push({
            sUid: sUid,
            oFileInfo: oFileInfo
          });
        }
      } else {
        if (Crypto.oChunkQueue.isProcessed === true) {
          // if another file is being uploaded now - add a file to the queue
          Crypto.oChunkQueue.aFiles.push({
            fStartUploadCallback: fStartUploadCallback,
            oFileInfo: oFileInfo,
            sUid: sUid,
            fOnChunkEncryptCallback: fOnChunkEncryptCallback
          });
        } else {
          // If the queue is not busy - start uploading
          fStartUploadCallback(oFileInfo, sUid, fOnChunkEncryptCallback);
        }
      }
    } else {
      fRegularUploadFileCallback(sUid, oFileInfo);
    }
  });
  App.subscribeEvent('CFilesView::FileDownloadCancel', function (oParams) {
    if (Settings.enableJscrypto() && IsHttpsEnable()) {
      oParams.oFile.stopDownloading();
    }
  });
  App.subscribeEvent('CFilesView::FileUploadCancel', function (oParams) {
    if (Settings.enableJscrypto() && IsHttpsEnable()) {
      //clear queue
      Crypto.oChunkQueue.aFiles.forEach(function (oData, index, array) {
        oParams.fOnUploadCancelCallback(oData.sUid, oData.oFileInfo.FileName);
      });
      Crypto.oChunkQueue.aFiles = [];
      Crypto.stopUploading(oParams.sFileUploadUid, oParams.fOnUploadCancelCallback, oParams.sFileUploadName);
    } else if (_.isFunction(oParams.fOnUploadCancelCallback)) {
      oParams.fOnUploadCancelCallback(oParams.sFileUploadUid, oParams.sFileUploadName);
    }
  });
  App.subscribeEvent('Jua::FileUploadingError', function () {
    if (Settings.enableJscrypto() && IsHttpsEnable()) {
      Crypto.oChunkQueue.isProcessed = false;
      Crypto.checkQueue();
    }
  });
  App.subscribeEvent('FilesWebclient::ParseFile::after', function (aParams) {
    var oFile = aParams[0],
        oExtendedProps = (oFile === null || oFile === void 0 ? void 0 : oFile.oExtendedProps) || false,
        iv = (oExtendedProps === null || oExtendedProps === void 0 ? void 0 : oExtendedProps.InitializationVector) || false,
        bIsEncrypted = !!iv,
        sParanoidEncryptedKey = (oExtendedProps === null || oExtendedProps === void 0 ? void 0 : oExtendedProps.ParanoidKey) || false,
        sParanoidEncryptedKeyShared = (oExtendedProps === null || oExtendedProps === void 0 ? void 0 : oExtendedProps.ParanoidKeyShared) || false,
        bIsImage = /\.(png|jpe?g|gif)$/.test(oFile.fileName().toLowerCase()),
        bIsOwnFile = oFile.sOwnerName === App.getUserPublicId(),
        bIsSharedStorage = "storageType" in oFile ? oFile.storageType() === Enums.FileStorageType.Shared : false;

    if (bIsEncrypted) {
      oFile.thumbnailSrc('');

      if ((bIsOwnFile || bIsSharedStorage) && bIsImage && Settings.enableJscrypto()) {
        // change view action for images
        oFile.oActionsData.view.Handler = function () {
          Crypto.viewEncryptedImage(oFile, iv, bIsSharedStorage && sParanoidEncryptedKeyShared ? sParanoidEncryptedKeyShared : sParanoidEncryptedKey);
        };
      } else {
        // remove view action for non-images
        oFile.removeAction('view');
      }

      oFile.removeAction('list');
      oFile.bIsSecure(true);

      oFile.onSecureIconClick = function (oItem) {
        Popups.showPopup(InitializationVectorPopup, [oFile, iv]);
      };
    }
  });
  App.subscribeEvent('FileViewerWebclientPlugin::FilesCollection::after', function (oParams) {
    oParams.aFilesCollection(_.filter(oParams.aFilesCollection(), function (oArg) {
      return !(typeof oArg.oExtendedProps !== 'undefined' && typeof oArg.oExtendedProps.InitializationVector !== 'undefined');
    }));
  });
  Settings.enableJscrypto.subscribe(function (newValue) {
    if (FilesView !== null) {
      FilesView.requestStorages();
    }
  });
  App.subscribeEvent('FilesWebclient::ConstructView::after', function (oParams) {
    if ('CFilesView' === oParams.Name) {
      FilesView = oParams.View;
      var ComposeMessageWithAttachments = ModulesManager.run('MailWebclient', 'getComposeMessageWithAttachments');

      if (_.isFunction(ComposeMessageWithAttachments)) {
        FilesView.executeSend = function () {
          var aItems = this.selector.listCheckedAndSelected(),
              aFileItems = _.filter(aItems, function (oItem) {
            return oItem && oItem.IS_FILE;
          }, this),
              bHasEncrypted = false,
              aFilesData = _.map(aFileItems, function (oItem) {
            var bItemEncrypted = !!(oItem.oExtendedProps && oItem.oExtendedProps.InitializationVector);
            bHasEncrypted = bHasEncrypted || bItemEncrypted;
            return {
              'Storage': oItem.storageType(),
              'Path': oItem.path(),
              'Name': oItem.fileName(),
              'Id': oItem.id(),
              'IsEncrypted': bItemEncrypted
            };
          });

          if (this.bAllowSendEmails && aFileItems.length > 0) {
            if (bHasEncrypted) {
              Popups.showPopup(ConfirmPopup, [TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ALERT_SEND_ENCRYPTED_FILES'), function (bSendAnyway) {
                if (bSendAnyway) {
                  Ajax.send('Files', 'SaveFilesAsTempFiles', {
                    'Files': aFilesData
                  }, function (oResponse) {
                    if (oResponse.Result) {
                      ComposeMessageWithAttachments(oResponse.Result);
                    }
                  }, this);
                }
              }.bind(this)]);
            } else {
              Ajax.send('Files', 'SaveFilesAsTempFiles', {
                'Files': aFilesData
              }, function (oResponse) {
                if (oResponse.Result) {
                  ComposeMessageWithAttachments(oResponse.Result);
                }
              }, this);
            }
          }
        };

        FilesView.sendCommand = Utils.createCommand(FilesView, FilesView.executeSend, function () {
          if (!this.isZipFolder() && this.checkedReadyForOperations()) {
            var aItems = this.selector.listCheckedAndSelected(),
                aFileItems = _.filter(aItems, function (oItem) {
              return oItem && oItem.IS_FILE;
            }, this);

            return aFileItems.length > 0;
          }

          return false;
        });
      }
    }
  });
  App.subscribeEvent('SharedFiles::UpdateShare::before', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(oParams) {
      var _oFile$oExtendedProps3;

      var oFile, sParanoidEncryptedKey, fUpdateParanoidKeyShared, aSharesEmails, aPublicKeys, aEmailsFromKeys, aDifference, sError, oPrivateKey, sPassword, sParanoidKey, sEncryptedSharedKey;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              oFile = oParams.oFileItem;
              sParanoidEncryptedKey = (oFile === null || oFile === void 0 ? void 0 : (_oFile$oExtendedProps3 = oFile.oExtendedProps) === null || _oFile$oExtendedProps3 === void 0 ? void 0 : _oFile$oExtendedProps3.ParanoidKey) || '';

              fUpdateParanoidKeyShared = function fUpdateParanoidKeyShared(ParanoidKeyShared) {
                //Update file extended props
                Ajax.send('Files', 'UpdateExtendedProps', {
                  Type: oFile.storageType(),
                  Path: oFile.path(),
                  Name: oFile.fileName(),
                  ExtendedProps: {
                    ParanoidKeyShared: ParanoidKeyShared
                  }
                }, function (oResponse) {
                  if (oResponse.Result === true) {
                    //continue sharing
                    oParams.OnSuccessCallback();
                  } else {
                    Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_UPDATING_PRANOID_KEY'));
                    oParams.OnErrorCallback();
                  }
                }, _this);
              };

              if (!(!oParams.IsDir && sParanoidEncryptedKey)) {
                _context.next = 40;
                break;
              }

              if (!oParams.Shares.length) {
                _context.next = 37;
                break;
              }

              //if file was shared - encrypt Paranoid-key
              //get OpenPGP public keys for users who must have access
              aSharesEmails = oParams.Shares.map(function (oShare) {
                return oShare.PublicId;
              });
              aPublicKeys = aSharesEmails.length ? OpenPgpEncryptor.findKeysByEmails(aSharesEmails,
              /*bIsPublic*/
              true) : [];

              if (!(aPublicKeys.length < aSharesEmails.length)) {
                _context.next = 15;
                break;
              }

              //if not for all users the keys were found - show an error
              aEmailsFromKeys = aPublicKeys.map(function (oKey) {
                return oKey.getEmail();
              });
              aDifference = aSharesEmails.filter(function (email) {
                return !aEmailsFromKeys.includes(email);
              });
              sError = TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_NO_PUBLIC_KEYS_FOR_USERS_PLURAL', {
                'USERS': aDifference.join(', ')
              }, null, aDifference.length);
              Screens.showError(sError);
              oParams.OnErrorCallback();
              _context.next = 35;
              break;

            case 15:
              _context.next = 17;
              return OpenPgpEncryptor.getCurrentUserPrivateKey();

            case 17:
              oPrivateKey = _context.sent;

              if (!oPrivateKey) {
                _context.next = 35;
                break;
              }

              _context.next = 21;
              return OpenPgpEncryptor.askForKeyPassword(oPrivateKey.getUser());

            case 21:
              sPassword = _context.sent;

              if (!(sPassword === false)) {
                _context.next = 25;
                break;
              }

              //user cancel operation
              oParams.OnErrorCallback();
              return _context.abrupt("return", false);

            case 25:
              _context.next = 27;
              return Crypto.decryptParanoidKey(sParanoidEncryptedKey, sPassword);

            case 27:
              sParanoidKey = _context.sent;

              if (sParanoidKey) {
                _context.next = 31;
                break;
              }

              oParams.OnErrorCallback();
              return _context.abrupt("return", false);

            case 31:
              _context.next = 33;
              return Crypto.encryptParanoidKey(sParanoidKey, aPublicKeys, sPassword);

            case 33:
              sEncryptedSharedKey = _context.sent;

              if (sEncryptedSharedKey) {
                fUpdateParanoidKeyShared(sEncryptedSharedKey);
              }

            case 35:
              _context.next = 38;
              break;

            case 37:
              //remove ParanoidKeyShared if file was unshared
              fUpdateParanoidKeyShared(null);

            case 38:
              _context.next = 41;
              break;

            case 40:
              //if file is not encrypted - continue sharing
              oParams.OnSuccessCallback();

            case 41:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  App.subscribeEvent('SharedFiles::OpenFilesSharePopup', function (oParams) {
    if (oParams.IsDir) {
      oParams.DialogHintText(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/INFO_SHARING_FOLDER'));
    }
  });
}

function getButtonView() {
  if (!oButtonsView) {
    oButtonsView = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/views/ButtonsView.js */ "uPeM");
  }

  return oButtonsView;
}

module.exports = function (oAppData) {
  Settings.init(oAppData);
  return {
    /**
     * Runs before application start. Subscribes to the event before post displaying.
     *
     * @param {Object} ModulesManager
     */
    start: function start(ModulesManager) {
      Crypto = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/CCrypto.js */ "QJDP");
      ModulesManager.run('FilesWebclient', 'registerToolbarButtons', [getButtonView()]);
      OpenPgpEncryptor = ModulesManager.run('OpenPgpWebclient', 'getOpenPgpEncryptor');

      var bBlobSavingEnable = window.Blob && window.URL && _.isFunction(window.URL.createObjectURL); // Module can't work without saving blob and shouldn't be initialized.


      if (bBlobSavingEnable) {
        if (Browser.chrome && !IsHttpsEnable()) {
          // Module can't work without https.0
          // Module should be initialized to display message about https enabling.
          StartModule(ModulesManager);
        } else if (window.crypto && window.crypto.subtle) {
          if (!Browser.edge) {
            StartModule(ModulesManager);
          } // var sPassword = window.crypto.getRandomValues(new Uint8Array(16));
          // // window.crypto can't work with PBKDF2 in Edge.
          // // Checks if it works (in case if it will work in Edge one day) and then inizializes module.
          // window.crypto.subtle.importKey('raw', sPassword, {name: 'PBKDF2'}, false, ['deriveBits', 'deriveKey'])
          // 	.then(function () {
          // 		StartModule(ModulesManager);
          // 	});

        }
      }
    }
  };
};

/***/ }),

/***/ "t19A":
/*!*******************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ExportInformationPopup.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(/*! underscore */ "F/us"),
    ko = __webpack_require__(/*! knockout */ "0h2I"),
    CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF");
/**
 * @constructor
 */


function CExportInformationPopup() {
  CAbstractPopup.call(this);
  this.fExportKeyCallback = null;
  this.keyName = ko.observable('');
}

_.extendOwn(CExportInformationPopup.prototype, CAbstractPopup.prototype);

CExportInformationPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_ExportInformationPopup';

CExportInformationPopup.prototype.onOpen = function (fExportKeyCallback, sKeyName) {
  if (_.isFunction(fExportKeyCallback)) {
    this.fExportKeyCallback = _.bind(function () {
      this.closePopup();
      fExportKeyCallback();
    }, this);
  }

  this.keyName(sKeyName);
};

module.exports = new CExportInformationPopup();

/***/ }),

/***/ "uN/E":
/*!*******************************************************!*\
  !*** ./modules/CoreWebclient/js/vendors/FileSaver.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if ( true && module.exports) {
  module.exports.saveAs = saveAs;
} else if (( true && __webpack_require__(/*! !webpack amd define */ "B9Yq") !== null) && (__webpack_require__(/*! !webpack amd options */ "PDX0") !== null)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    return saveAs;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),

/***/ "uPeM":
/*!*******************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/views/ButtonsView.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ko = __webpack_require__(/*! knockout */ "0h2I"),
    TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
    Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd");
/**
 * @constructor
 */


function ButtonsView() {
  this.storageType = null;
}

ButtonsView.prototype.useFilesViewData = function (oFilesView) {
  this.storageType = oFilesView.storageType;
  oFilesView.pathItems.subscribe(function () {
    if (this.isEncryptedStorage()) {
      oFilesView.disableButton(oFilesView.shortcutButtonModules, 'CoreParanoidEncryptionWebclientPlugin');
    } else {
      oFilesView.enableButton(oFilesView.shortcutButtonModules, 'CoreParanoidEncryptionWebclientPlugin');
    }
  }, this);
};

ButtonsView.prototype.isEncryptedStorage = function () {
  return this.storageType() === 'encrypted';
};

module.exports = new ButtonsView();

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