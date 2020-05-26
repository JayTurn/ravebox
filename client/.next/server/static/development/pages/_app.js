module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return MyApp; });\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material-ui/core/styles */ \"@material-ui/core/styles\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core/CssBaseline */ \"@material-ui/core/CssBaseline\");\n/* harmony import */ var _material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var notistack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! notistack */ \"notistack\");\n/* harmony import */ var notistack__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(notistack__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! prop-types */ \"prop-types\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _material_ui_core_useMediaQuery__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/core/useMediaQuery */ \"@material-ui/core/useMediaQuery\");\n/* harmony import */ var _material_ui_core_useMediaQuery__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_useMediaQuery__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _theme_RaveboxTheme__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../theme/RaveboxTheme */ \"./src/theme/RaveboxTheme.tsx\");\n/* harmony import */ var _theme_DesktopRaveboxTheme__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../theme/DesktopRaveboxTheme */ \"./src/theme/DesktopRaveboxTheme.tsx\");\nvar _jsxFileName = \"/client/app/src/pages/_app.tsx\";\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement;\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\n/**\n * _app.tsx\n * Application entry\n */\n// Modules.\n\n\n\n\n\n\n // Theme.\n\n\n // Define the snackbar styles.\n\nconst StyledSnackbar = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__[\"withStyles\"])(theme => ({\n  variantSuccess: {\n    backgroundColor: theme.palette.primary.dark,\n    color: theme.palette.common.white\n  },\n  variantError: {\n    backgroundColor: theme.palette.error.dark,\n    color: theme.palette.common.white\n  }\n}))(notistack__WEBPACK_IMPORTED_MODULE_4__[\"SnackbarProvider\"]); // Application menu drawer sizes.\n\nconst lgOpenDrawerWidth = 240,\n      lgClosedDrawerWidth = 70;\n/**\n * Create styles for the shifting content.\n */\n\nconst useStyles = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__[\"makeStyles\"])(theme => Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__[\"createStyles\"])({\n  lgContent: {\n    transition: theme.transitions.create('margin', {\n      easing: theme.transitions.easing.sharp,\n      duration: theme.transitions.duration.leavingScreen\n    })\n  },\n  lgContentOpen: {\n    width: `calc(100% - ${lgOpenDrawerWidth}px)`,\n    marginLeft: lgOpenDrawerWidth,\n    maxWidth: `calc(100% - ${lgOpenDrawerWidth}px)`\n  },\n  lgContentClosed: {\n    width: `calc(100% - ${lgClosedDrawerWidth}px)`,\n    marginLeft: lgClosedDrawerWidth,\n    maxWidth: `calc(100% - ${lgClosedDrawerWidth}px)`\n  },\n  xLgContentOpen: {\n    width: `calc(100% - ${lgOpenDrawerWidth}px)`,\n    marginLeft: lgOpenDrawerWidth\n  },\n  xLgContentClosed: {\n    width: `calc(100% - ${lgClosedDrawerWidth}px)`,\n    marginLeft: lgClosedDrawerWidth\n  }\n}));\n/**\n * App component.\n */\n\nfunction MyApp(props) {\n  const {\n    Component,\n    pageProps\n  } = props; // Match the large media query size.\n\n  const theme = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__[\"useTheme\"])(),\n        mediumScreen = _material_ui_core_useMediaQuery__WEBPACK_IMPORTED_MODULE_6___default()(theme.breakpoints.only('sm')),\n        largeScreen = _material_ui_core_useMediaQuery__WEBPACK_IMPORTED_MODULE_6___default()(theme.breakpoints.up('md')),\n        extraLargeScreen = _material_ui_core_useMediaQuery__WEBPACK_IMPORTED_MODULE_6___default()(theme.breakpoints.up('xl')),\n        classes = useStyles();\n  react__WEBPACK_IMPORTED_MODULE_3___default.a.useEffect(() => {\n    // Remove the server-side injected CSS.\n    const jssStyles = document.querySelector('#jss-server-side');\n\n    if (jssStyles) {\n      jssStyles.parentElement.removeChild(jssStyles);\n    }\n  }, []);\n  return __jsx(react__WEBPACK_IMPORTED_MODULE_3___default.a.Fragment, {\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 96,\n      columnNumber: 5\n    }\n  }, __jsx(next_head__WEBPACK_IMPORTED_MODULE_2___default.a, {\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 97,\n      columnNumber: 7\n    }\n  }, __jsx(\"title\", {\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 98,\n      columnNumber: 9\n    }\n  }, \"My page\"), __jsx(\"meta\", {\n    name: \"viewport\",\n    content: \"minimum-scale=1, initial-scale=1, width=device-width\",\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 99,\n      columnNumber: 9\n    }\n  })), __jsx(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__[\"ThemeProvider\"], {\n    theme: largeScreen ? _theme_DesktopRaveboxTheme__WEBPACK_IMPORTED_MODULE_8__[\"default\"] : _theme_RaveboxTheme__WEBPACK_IMPORTED_MODULE_7__[\"default\"],\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 101,\n      columnNumber: 7\n    }\n  }, __jsx(_material_ui_core_CssBaseline__WEBPACK_IMPORTED_MODULE_1___default.a, {\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 102,\n      columnNumber: 9\n    }\n  }), __jsx(Component, _extends({}, pageProps, {\n    __self: this,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 103,\n      columnNumber: 9\n    }\n  }))));\n}\nMyApp.propTypes = {\n  Component: prop_types__WEBPACK_IMPORTED_MODULE_5___default.a.elementType.isRequired,\n  pageProps: prop_types__WEBPACK_IMPORTED_MODULE_5___default.a.object.isRequired\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvX2FwcC50c3g/ODU0OCJdLCJuYW1lcyI6WyJTdHlsZWRTbmFja2JhciIsIndpdGhTdHlsZXMiLCJ0aGVtZSIsInZhcmlhbnRTdWNjZXNzIiwiYmFja2dyb3VuZENvbG9yIiwicGFsZXR0ZSIsInByaW1hcnkiLCJkYXJrIiwiY29sb3IiLCJjb21tb24iLCJ3aGl0ZSIsInZhcmlhbnRFcnJvciIsImVycm9yIiwiU25hY2tiYXJQcm92aWRlciIsImxnT3BlbkRyYXdlcldpZHRoIiwibGdDbG9zZWREcmF3ZXJXaWR0aCIsInVzZVN0eWxlcyIsIm1ha2VTdHlsZXMiLCJjcmVhdGVTdHlsZXMiLCJsZ0NvbnRlbnQiLCJ0cmFuc2l0aW9uIiwidHJhbnNpdGlvbnMiLCJjcmVhdGUiLCJlYXNpbmciLCJzaGFycCIsImR1cmF0aW9uIiwibGVhdmluZ1NjcmVlbiIsImxnQ29udGVudE9wZW4iLCJ3aWR0aCIsIm1hcmdpbkxlZnQiLCJtYXhXaWR0aCIsImxnQ29udGVudENsb3NlZCIsInhMZ0NvbnRlbnRPcGVuIiwieExnQ29udGVudENsb3NlZCIsIk15QXBwIiwicHJvcHMiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJ1c2VUaGVtZSIsIm1lZGl1bVNjcmVlbiIsInVzZU1lZGlhUXVlcnkiLCJicmVha3BvaW50cyIsIm9ubHkiLCJsYXJnZVNjcmVlbiIsInVwIiwiZXh0cmFMYXJnZVNjcmVlbiIsImNsYXNzZXMiLCJSZWFjdCIsInVzZUVmZmVjdCIsImpzc1N0eWxlcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsIkRlc2t0b3BSYXZlYm94VGhlbWUiLCJSYXZlYm94VGhlbWUiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJlbGVtZW50VHlwZSIsImlzUmVxdWlyZWQiLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFL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R0FORCxFQU1HLEVBTkg7QUFRQSxTQUNFLE1BQUMsNENBQUQsQ0FBTyxRQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FDRSxNQUFDLGdEQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREYsRUFFRTtBQUFNLFFBQUksRUFBQyxVQUFYO0FBQXNCLFdBQU8sRUFBQyxzREFBOUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUZGLENBREYsRUFLRSxNQUFDLHNFQUFEO0FBQWUsU0FBSyxFQUFFTixXQUFXLEdBQUdXLGtFQUFILEdBQXlCQywyREFBMUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUNFLE1BQUMsb0VBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQURGLEVBRUUsTUFBQyxTQUFELGVBQWVsQixTQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FGRixDQUxGLENBREY7QUFZRDtBQUVESCxLQUFLLENBQUNzQixTQUFOLEdBQWtCO0FBQ2hCcEIsV0FBUyxFQUFFcUIsaURBQVMsQ0FBQ0MsV0FBVixDQUFzQkMsVUFEakI7QUFFaEJ0QixXQUFTLEVBQUVvQixpREFBUyxDQUFDRyxNQUFWLENBQWlCRDtBQUZaLENBQWxCIiwiZmlsZSI6Ii4vc3JjL3BhZ2VzL19hcHAudHN4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBfYXBwLnRzeFxuICogQXBwbGljYXRpb24gZW50cnlcbiAqL1xuXG4vLyBNb2R1bGVzLlxuaW1wb3J0IHtcbiAgY3JlYXRlU3R5bGVzLFxuICBtYWtlU3R5bGVzLFxuICBUaGVtZSxcbiAgVGhlbWVQcm92aWRlcixcbiAgdXNlVGhlbWUsXG4gIHdpdGhTdHlsZXNcbn0gZnJvbSAnQG1hdGVyaWFsLXVpL2NvcmUvc3R5bGVzJztcbmltcG9ydCBDc3NCYXNlbGluZSBmcm9tICdAbWF0ZXJpYWwtdWkvY29yZS9Dc3NCYXNlbGluZSc7XG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIFNuYWNrYmFyUHJvdmlkZXJcbn0gZnJvbSAnbm90aXN0YWNrJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgdXNlTWVkaWFRdWVyeSBmcm9tICdAbWF0ZXJpYWwtdWkvY29yZS91c2VNZWRpYVF1ZXJ5JztcblxuLy8gVGhlbWUuXG5pbXBvcnQgUmF2ZWJveFRoZW1lIGZyb20gJy4uL3RoZW1lL1JhdmVib3hUaGVtZSc7XG5pbXBvcnQgRGVza3RvcFJhdmVib3hUaGVtZSBmcm9tICcuLi90aGVtZS9EZXNrdG9wUmF2ZWJveFRoZW1lJztcblxuLy8gRGVmaW5lIHRoZSBzbmFja2JhciBzdHlsZXMuXG5jb25zdCBTdHlsZWRTbmFja2JhciA9IHdpdGhTdHlsZXMoKHRoZW1lOiBUaGVtZSkgPT4gKHtcbiAgdmFyaWFudFN1Y2Nlc3M6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUucHJpbWFyeS5kYXJrLFxuICAgIGNvbG9yOiB0aGVtZS5wYWxldHRlLmNvbW1vbi53aGl0ZVxuICB9LFxuICB2YXJpYW50RXJyb3I6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhbGV0dGUuZXJyb3IuZGFyayxcbiAgICBjb2xvcjogdGhlbWUucGFsZXR0ZS5jb21tb24ud2hpdGVcbiAgfVxufSkpKFNuYWNrYmFyUHJvdmlkZXIpO1xuXG4vLyBBcHBsaWNhdGlvbiBtZW51IGRyYXdlciBzaXplcy5cbmNvbnN0IGxnT3BlbkRyYXdlcldpZHRoOiBudW1iZXIgPSAyNDAsXG4gICAgICBsZ0Nsb3NlZERyYXdlcldpZHRoOiBudW1iZXIgPSA3MDtcblxuLyoqXG4gKiBDcmVhdGUgc3R5bGVzIGZvciB0aGUgc2hpZnRpbmcgY29udGVudC5cbiAqL1xuY29uc3QgdXNlU3R5bGVzID0gbWFrZVN0eWxlcygodGhlbWU6IFRoZW1lKSA9PiBjcmVhdGVTdHlsZXMoe1xuICBsZ0NvbnRlbnQ6IHtcbiAgICB0cmFuc2l0aW9uOiB0aGVtZS50cmFuc2l0aW9ucy5jcmVhdGUoJ21hcmdpbicsIHtcbiAgICAgIGVhc2luZzogdGhlbWUudHJhbnNpdGlvbnMuZWFzaW5nLnNoYXJwLFxuICAgICAgZHVyYXRpb246IHRoZW1lLnRyYW5zaXRpb25zLmR1cmF0aW9uLmxlYXZpbmdTY3JlZW4sXG4gICAgfSlcbiAgfSxcbiAgbGdDb250ZW50T3Blbjoge1xuICAgIHdpZHRoOiBgY2FsYygxMDAlIC0gJHtsZ09wZW5EcmF3ZXJXaWR0aH1weClgLFxuICAgIG1hcmdpbkxlZnQ6IGxnT3BlbkRyYXdlcldpZHRoLFxuICAgIG1heFdpZHRoOiBgY2FsYygxMDAlIC0gJHtsZ09wZW5EcmF3ZXJXaWR0aH1weClgLFxuICB9LFxuICBsZ0NvbnRlbnRDbG9zZWQ6IHtcbiAgICB3aWR0aDogYGNhbGMoMTAwJSAtICR7bGdDbG9zZWREcmF3ZXJXaWR0aH1weClgLFxuICAgIG1hcmdpbkxlZnQ6IGxnQ2xvc2VkRHJhd2VyV2lkdGgsXG4gICAgbWF4V2lkdGg6IGBjYWxjKDEwMCUgLSAke2xnQ2xvc2VkRHJhd2VyV2lkdGh9cHgpYCxcbiAgfSxcbiAgeExnQ29udGVudE9wZW46IHtcbiAgICB3aWR0aDogYGNhbGMoMTAwJSAtICR7bGdPcGVuRHJhd2VyV2lkdGh9cHgpYCxcbiAgICBtYXJnaW5MZWZ0OiBsZ09wZW5EcmF3ZXJXaWR0aCxcbiAgfSxcbiAgeExnQ29udGVudENsb3NlZDoge1xuICAgIHdpZHRoOiBgY2FsYygxMDAlIC0gJHtsZ0Nsb3NlZERyYXdlcldpZHRofXB4KWAsXG4gICAgbWFyZ2luTGVmdDogbGdDbG9zZWREcmF3ZXJXaWR0aFxuICB9XG59KSk7XG5cbi8qKlxuICogQXBwIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXlBcHAocHJvcHMpIHtcbiAgY29uc3QgeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9ID0gcHJvcHM7XG5cbiAgLy8gTWF0Y2ggdGhlIGxhcmdlIG1lZGlhIHF1ZXJ5IHNpemUuXG4gIGNvbnN0IHRoZW1lID0gdXNlVGhlbWUoKSxcbiAgICAgICAgbWVkaXVtU2NyZWVuID0gdXNlTWVkaWFRdWVyeSh0aGVtZS5icmVha3BvaW50cy5vbmx5KCdzbScpKSxcbiAgICAgICAgbGFyZ2VTY3JlZW4gPSB1c2VNZWRpYVF1ZXJ5KHRoZW1lLmJyZWFrcG9pbnRzLnVwKCdtZCcpKSxcbiAgICAgICAgZXh0cmFMYXJnZVNjcmVlbiA9IHVzZU1lZGlhUXVlcnkodGhlbWUuYnJlYWtwb2ludHMudXAoJ3hsJykpLFxuICAgICAgICBjbGFzc2VzID0gdXNlU3R5bGVzKCk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBSZW1vdmUgdGhlIHNlcnZlci1zaWRlIGluamVjdGVkIENTUy5cbiAgICBjb25zdCBqc3NTdHlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjanNzLXNlcnZlci1zaWRlJyk7XG4gICAgaWYgKGpzc1N0eWxlcykge1xuICAgICAganNzU3R5bGVzLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoanNzU3R5bGVzKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxSZWFjdC5GcmFnbWVudD5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8dGl0bGU+TXkgcGFnZTwvdGl0bGU+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJtaW5pbXVtLXNjYWxlPTEsIGluaXRpYWwtc2NhbGU9MSwgd2lkdGg9ZGV2aWNlLXdpZHRoXCIgLz5cbiAgICAgIDwvSGVhZD5cbiAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXtsYXJnZVNjcmVlbiA/IERlc2t0b3BSYXZlYm94VGhlbWUgOiBSYXZlYm94VGhlbWV9PlxuICAgICAgICA8Q3NzQmFzZWxpbmUgLz5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gICk7XG59XG5cbk15QXBwLnByb3BUeXBlcyA9IHtcbiAgQ29tcG9uZW50OiBQcm9wVHlwZXMuZWxlbWVudFR5cGUuaXNSZXF1aXJlZCxcbiAgcGFnZVByb3BzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/theme/DesktopRaveboxTheme.tsx":
/*!*******************************************!*\
  !*** ./src/theme/DesktopRaveboxTheme.tsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material-ui/core/styles */ \"@material-ui/core/styles\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _RaveboxTheme__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RaveboxTheme */ \"./src/theme/RaveboxTheme.tsx\");\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n/**\n * RaveboxTheme.tsx\n * Modifications to the default theme to support desktop display.\n */\n// Modules.\n\n// Themes.\n // Create the desktop theme.\n\nconst theme = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__[\"createMuiTheme\"])(_objectSpread(_objectSpread({}, _RaveboxTheme__WEBPACK_IMPORTED_MODULE_1__[\"sharedTheme\"]), {}, {\n  typography: {\n    fontFamily: '\"Muli\", sans-serif',\n    body1: {\n      color: _RaveboxTheme__WEBPACK_IMPORTED_MODULE_1__[\"sharedTheme\"].palette.text.primary\n    },\n    body2: {\n      color: _RaveboxTheme__WEBPACK_IMPORTED_MODULE_1__[\"sharedTheme\"].palette.text.primary\n    },\n    h1: {\n      color: _RaveboxTheme__WEBPACK_IMPORTED_MODULE_1__[\"sharedTheme\"].palette.text.primary,\n      fontFamily: '\"Muli\"',\n      fontSize: '3rem',\n      marginBottom: '0.5rem'\n    },\n    h2: {\n      color: _RaveboxTheme__WEBPACK_IMPORTED_MODULE_1__[\"sharedTheme\"].palette.text.primary,\n      fontSize: '1.875rem',\n      fontWeight: 400,\n      marginBottom: '0.5rem'\n    },\n    h3: {\n      color: _RaveboxTheme__WEBPACK_IMPORTED_MODULE_1__[\"sharedTheme\"].palette.text.primary,\n      fontSize: '1.171rem'\n    },\n    subtitle1: {\n      color: _RaveboxTheme__WEBPACK_IMPORTED_MODULE_1__[\"sharedTheme\"].palette.text.primary\n    },\n    subtitle2: {\n      color: _RaveboxTheme__WEBPACK_IMPORTED_MODULE_1__[\"sharedTheme\"].palette.text.primary\n    }\n  }\n}));\n/* harmony default export */ __webpack_exports__[\"default\"] = (theme);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdGhlbWUvRGVza3RvcFJhdmVib3hUaGVtZS50c3g/ZjY2YiJdLCJuYW1lcyI6WyJ0aGVtZSIsImNyZWF0ZU11aVRoZW1lIiwic2hhcmVkVGhlbWUiLCJ0eXBvZ3JhcGh5IiwiZm9udEZhbWlseSIsImJvZHkxIiwiY29sb3IiLCJwYWxldHRlIiwidGV4dCIsInByaW1hcnkiLCJib2R5MiIsImgxIiwiZm9udFNpemUiLCJtYXJnaW5Cb3R0b20iLCJoMiIsImZvbnRXZWlnaHQiLCJoMyIsInN1YnRpdGxlMSIsInN1YnRpdGxlMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBS0E7QUFDQTtBQUdBO0NBR0E7O0FBQ0EsTUFBTUEsS0FBSyxHQUFHQywrRUFBYyxpQ0FDdkJDLHlEQUR1QjtBQUUxQkMsWUFBVSxFQUFFO0FBQ1ZDLGNBQVUsRUFBRSxvQkFERjtBQUVWQyxTQUFLLEVBQUU7QUFDTEMsV0FBSyxFQUFFSix5REFBVyxDQUFDSyxPQUFaLENBQW9CQyxJQUFwQixDQUF5QkM7QUFEM0IsS0FGRztBQUtWQyxTQUFLLEVBQUU7QUFDTEosV0FBSyxFQUFFSix5REFBVyxDQUFDSyxPQUFaLENBQW9CQyxJQUFwQixDQUF5QkM7QUFEM0IsS0FMRztBQVFWRSxNQUFFLEVBQUU7QUFDRkwsV0FBSyxFQUFFSix5REFBVyxDQUFDSyxPQUFaLENBQW9CQyxJQUFwQixDQUF5QkMsT0FEOUI7QUFFRkwsZ0JBQVUsRUFBRSxRQUZWO0FBR0ZRLGNBQVEsRUFBRSxNQUhSO0FBSUZDLGtCQUFZLEVBQUU7QUFKWixLQVJNO0FBY1ZDLE1BQUUsRUFBRTtBQUNGUixXQUFLLEVBQUVKLHlEQUFXLENBQUNLLE9BQVosQ0FBb0JDLElBQXBCLENBQXlCQyxPQUQ5QjtBQUVGRyxjQUFRLEVBQUUsVUFGUjtBQUdGRyxnQkFBVSxFQUFFLEdBSFY7QUFJRkYsa0JBQVksRUFBRTtBQUpaLEtBZE07QUFvQlZHLE1BQUUsRUFBRTtBQUNGVixXQUFLLEVBQUVKLHlEQUFXLENBQUNLLE9BQVosQ0FBb0JDLElBQXBCLENBQXlCQyxPQUQ5QjtBQUVGRyxjQUFRLEVBQUU7QUFGUixLQXBCTTtBQXdCVkssYUFBUyxFQUFFO0FBQ1RYLFdBQUssRUFBRUoseURBQVcsQ0FBQ0ssT0FBWixDQUFvQkMsSUFBcEIsQ0FBeUJDO0FBRHZCLEtBeEJEO0FBMkJWUyxhQUFTLEVBQUU7QUFDVFosV0FBSyxFQUFFSix5REFBVyxDQUFDSyxPQUFaLENBQW9CQyxJQUFwQixDQUF5QkM7QUFEdkI7QUEzQkQ7QUFGYyxHQUE1QjtBQW1DZVQsb0VBQWYiLCJmaWxlIjoiLi9zcmMvdGhlbWUvRGVza3RvcFJhdmVib3hUaGVtZS50c3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJhdmVib3hUaGVtZS50c3hcbiAqIE1vZGlmaWNhdGlvbnMgdG8gdGhlIGRlZmF1bHQgdGhlbWUgdG8gc3VwcG9ydCBkZXNrdG9wIGRpc3BsYXkuXG4gKi9cblxuLy8gTW9kdWxlcy5cbmltcG9ydCB7IGNyZWF0ZU11aVRoZW1lLCBUaGVtZSB9IGZyb20gJ0BtYXRlcmlhbC11aS9jb3JlL3N0eWxlcyc7XG5pbXBvcnQgeyBDU1NQcm9wZXJ0aWVzIH0gZnJvbSAnQG1hdGVyaWFsLXVpL3N0eWxlcy93aXRoU3R5bGVzJztcblxuLy8gVGhlbWVzLlxuaW1wb3J0IHsgc2hhcmVkVGhlbWUgfSBmcm9tICcuL1JhdmVib3hUaGVtZSc7XG5cbi8vIENyZWF0ZSB0aGUgZGVza3RvcCB0aGVtZS5cbmNvbnN0IHRoZW1lID0gY3JlYXRlTXVpVGhlbWUoe1xuICAuLi5zaGFyZWRUaGVtZSxcbiAgdHlwb2dyYXBoeToge1xuICAgIGZvbnRGYW1pbHk6ICdcIk11bGlcIiwgc2Fucy1zZXJpZicsXG4gICAgYm9keTE6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeVxuICAgIH0sXG4gICAgYm9keTI6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeVxuICAgIH0sXG4gICAgaDE6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeSxcbiAgICAgIGZvbnRGYW1pbHk6ICdcIk11bGlcIicsXG4gICAgICBmb250U2l6ZTogJzNyZW0nLFxuICAgICAgbWFyZ2luQm90dG9tOiAnMC41cmVtJ1xuICAgIH0sXG4gICAgaDI6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeSxcbiAgICAgIGZvbnRTaXplOiAnMS44NzVyZW0nLFxuICAgICAgZm9udFdlaWdodDogNDAwLFxuICAgICAgbWFyZ2luQm90dG9tOiAnMC41cmVtJ1xuICAgIH0sXG4gICAgaDM6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeSxcbiAgICAgIGZvbnRTaXplOiAnMS4xNzFyZW0nXG4gICAgfSxcbiAgICBzdWJ0aXRsZTE6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeVxuICAgIH0sXG4gICAgc3VidGl0bGUyOiB7XG4gICAgICBjb2xvcjogc2hhcmVkVGhlbWUucGFsZXR0ZS50ZXh0LnByaW1hcnlcbiAgICB9LFxuICB9XG59KVxuXG5leHBvcnQgZGVmYXVsdCB0aGVtZTtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/theme/DesktopRaveboxTheme.tsx\n");

/***/ }),

/***/ "./src/theme/RaveboxTheme.tsx":
/*!************************************!*\
  !*** ./src/theme/RaveboxTheme.tsx ***!
  \************************************/
/*! exports provided: sharedTheme, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sharedTheme\", function() { return sharedTheme; });\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material-ui/core/styles */ \"@material-ui/core/styles\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__);\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n/**\n * RaveboxTheme.tsx\n * Theme definitions for the ravebox application.\n */\n// Modules.\n\nconst sharedTheme = {\n  palette: {\n    error: {\n      light: '#F67135',\n      main: '#D94D0E',\n      dark: '#BB3A00',\n      contrastText: '#FFFFFF'\n    },\n    primary: {\n      light: '#A2A7FF',\n      main: '#646AF0',\n      dark: '#434AD9',\n      contrastText: '#FFFFFF'\n    },\n    secondary: {\n      light: '#62DECC',\n      main: '#08CBAF',\n      dark: '#00B89D',\n      contrastText: '#FFFFFF'\n    },\n    text: {\n      primary: '#363636',\n      secondary: '#585858',\n      disabled: '#939393',\n      hint: '#6d6d6d'\n    }\n  }\n};\nconst theme = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__[\"createMuiTheme\"])(_objectSpread(_objectSpread({}, sharedTheme), {}, {\n  typography: {\n    fontFamily: '\"Muli\", sans-serif',\n    body1: {\n      color: sharedTheme.palette.text.primary\n    },\n    body2: {\n      color: sharedTheme.palette.text.primary\n    },\n    h1: {\n      color: sharedTheme.palette.text.primary,\n      fontSize: '2rem',\n      marginBottom: '0.5rem'\n    },\n    h2: {\n      color: sharedTheme.palette.text.primary,\n      fontSize: '1.5rem',\n      fontWeight: 400,\n      marginBottom: '0.5rem'\n    },\n    h3: {\n      color: sharedTheme.palette.text.primary,\n      fontSize: '1.25rem'\n    },\n    subtitle1: {\n      color: sharedTheme.palette.text.primary\n    },\n    subtitle2: {\n      color: sharedTheme.palette.text.primary\n    }\n  }\n}));\n/* harmony default export */ __webpack_exports__[\"default\"] = (theme);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdGhlbWUvUmF2ZWJveFRoZW1lLnRzeD8wZDIzIl0sIm5hbWVzIjpbInNoYXJlZFRoZW1lIiwicGFsZXR0ZSIsImVycm9yIiwibGlnaHQiLCJtYWluIiwiZGFyayIsImNvbnRyYXN0VGV4dCIsInByaW1hcnkiLCJzZWNvbmRhcnkiLCJ0ZXh0IiwiZGlzYWJsZWQiLCJoaW50IiwidGhlbWUiLCJjcmVhdGVNdWlUaGVtZSIsInR5cG9ncmFwaHkiLCJmb250RmFtaWx5IiwiYm9keTEiLCJjb2xvciIsImJvZHkyIiwiaDEiLCJmb250U2l6ZSIsIm1hcmdpbkJvdHRvbSIsImgyIiwiZm9udFdlaWdodCIsImgzIiwic3VidGl0bGUxIiwic3VidGl0bGUyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFLQTtBQUNBO0FBR08sTUFBTUEsV0FBVyxHQUFHO0FBQ3pCQyxTQUFPLEVBQUU7QUFDUEMsU0FBSyxFQUFFO0FBQ0xDLFdBQUssRUFBRSxTQURGO0FBRUxDLFVBQUksRUFBRSxTQUZEO0FBR0xDLFVBQUksRUFBRSxTQUhEO0FBSUxDLGtCQUFZLEVBQUU7QUFKVCxLQURBO0FBT1BDLFdBQU8sRUFBRTtBQUNQSixXQUFLLEVBQUUsU0FEQTtBQUVQQyxVQUFJLEVBQUUsU0FGQztBQUdQQyxVQUFJLEVBQUUsU0FIQztBQUlQQyxrQkFBWSxFQUFFO0FBSlAsS0FQRjtBQWFQRSxhQUFTLEVBQUU7QUFDVEwsV0FBSyxFQUFFLFNBREU7QUFFVEMsVUFBSSxFQUFFLFNBRkc7QUFHVEMsVUFBSSxFQUFFLFNBSEc7QUFJVEMsa0JBQVksRUFBRTtBQUpMLEtBYko7QUFtQlBHLFFBQUksRUFBRTtBQUNKRixhQUFPLEVBQUUsU0FETDtBQUVKQyxlQUFTLEVBQUUsU0FGUDtBQUdKRSxjQUFRLEVBQUUsU0FITjtBQUlKQyxVQUFJLEVBQUU7QUFKRjtBQW5CQztBQURnQixDQUFwQjtBQTZCUCxNQUFNQyxLQUFLLEdBQUdDLCtFQUFjLGlDQUN2QmIsV0FEdUI7QUFFMUJjLFlBQVUsRUFBRTtBQUNWQyxjQUFVLEVBQUUsb0JBREY7QUFFVkMsU0FBSyxFQUFFO0FBQ0xDLFdBQUssRUFBRWpCLFdBQVcsQ0FBQ0MsT0FBWixDQUFvQlEsSUFBcEIsQ0FBeUJGO0FBRDNCLEtBRkc7QUFLVlcsU0FBSyxFQUFFO0FBQ0xELFdBQUssRUFBRWpCLFdBQVcsQ0FBQ0MsT0FBWixDQUFvQlEsSUFBcEIsQ0FBeUJGO0FBRDNCLEtBTEc7QUFRVlksTUFBRSxFQUFFO0FBQ0ZGLFdBQUssRUFBRWpCLFdBQVcsQ0FBQ0MsT0FBWixDQUFvQlEsSUFBcEIsQ0FBeUJGLE9BRDlCO0FBRUZhLGNBQVEsRUFBRSxNQUZSO0FBR0ZDLGtCQUFZLEVBQUU7QUFIWixLQVJNO0FBYVZDLE1BQUUsRUFBRTtBQUNGTCxXQUFLLEVBQUVqQixXQUFXLENBQUNDLE9BQVosQ0FBb0JRLElBQXBCLENBQXlCRixPQUQ5QjtBQUVGYSxjQUFRLEVBQUUsUUFGUjtBQUdGRyxnQkFBVSxFQUFFLEdBSFY7QUFJRkYsa0JBQVksRUFBRTtBQUpaLEtBYk07QUFtQlZHLE1BQUUsRUFBRTtBQUNGUCxXQUFLLEVBQUVqQixXQUFXLENBQUNDLE9BQVosQ0FBb0JRLElBQXBCLENBQXlCRixPQUQ5QjtBQUVGYSxjQUFRLEVBQUU7QUFGUixLQW5CTTtBQXVCVkssYUFBUyxFQUFFO0FBQ1RSLFdBQUssRUFBRWpCLFdBQVcsQ0FBQ0MsT0FBWixDQUFvQlEsSUFBcEIsQ0FBeUJGO0FBRHZCLEtBdkJEO0FBMEJWbUIsYUFBUyxFQUFFO0FBQ1RULFdBQUssRUFBRWpCLFdBQVcsQ0FBQ0MsT0FBWixDQUFvQlEsSUFBcEIsQ0FBeUJGO0FBRHZCO0FBMUJEO0FBRmMsR0FBNUI7QUFrQ2VLLG9FQUFmIiwiZmlsZSI6Ii4vc3JjL3RoZW1lL1JhdmVib3hUaGVtZS50c3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJhdmVib3hUaGVtZS50c3hcbiAqIFRoZW1lIGRlZmluaXRpb25zIGZvciB0aGUgcmF2ZWJveCBhcHBsaWNhdGlvbi5cbiAqL1xuXG4vLyBNb2R1bGVzLlxuaW1wb3J0IHsgY3JlYXRlTXVpVGhlbWUsIFRoZW1lIH0gZnJvbSAnQG1hdGVyaWFsLXVpL2NvcmUvc3R5bGVzJztcbmltcG9ydCB7IENTU1Byb3BlcnRpZXMgfSBmcm9tICdAbWF0ZXJpYWwtdWkvc3R5bGVzL3dpdGhTdHlsZXMnO1xuXG5leHBvcnQgY29uc3Qgc2hhcmVkVGhlbWUgPSB7XG4gIHBhbGV0dGU6IHtcbiAgICBlcnJvcjoge1xuICAgICAgbGlnaHQ6ICcjRjY3MTM1JyxcbiAgICAgIG1haW46ICcjRDk0RDBFJyxcbiAgICAgIGRhcms6ICcjQkIzQTAwJyxcbiAgICAgIGNvbnRyYXN0VGV4dDogJyNGRkZGRkYnXG4gICAgfSxcbiAgICBwcmltYXJ5OiB7XG4gICAgICBsaWdodDogJyNBMkE3RkYnLFxuICAgICAgbWFpbjogJyM2NDZBRjAnLFxuICAgICAgZGFyazogJyM0MzRBRDknLFxuICAgICAgY29udHJhc3RUZXh0OiAnI0ZGRkZGRidcbiAgICB9LFxuICAgIHNlY29uZGFyeToge1xuICAgICAgbGlnaHQ6ICcjNjJERUNDJyxcbiAgICAgIG1haW46ICcjMDhDQkFGJyxcbiAgICAgIGRhcms6ICcjMDBCODlEJyxcbiAgICAgIGNvbnRyYXN0VGV4dDogJyNGRkZGRkYnXG4gICAgfSxcbiAgICB0ZXh0OiB7XG4gICAgICBwcmltYXJ5OiAnIzM2MzYzNicsXG4gICAgICBzZWNvbmRhcnk6ICcjNTg1ODU4JyxcbiAgICAgIGRpc2FibGVkOiAnIzkzOTM5MycsXG4gICAgICBoaW50OiAnIzZkNmQ2ZCdcbiAgICB9XG4gIH0sXG59XG5cbmNvbnN0IHRoZW1lID0gY3JlYXRlTXVpVGhlbWUoe1xuICAuLi5zaGFyZWRUaGVtZSxcbiAgdHlwb2dyYXBoeToge1xuICAgIGZvbnRGYW1pbHk6ICdcIk11bGlcIiwgc2Fucy1zZXJpZicsXG4gICAgYm9keTE6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeVxuICAgIH0sXG4gICAgYm9keTI6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeVxuICAgIH0sXG4gICAgaDE6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeSxcbiAgICAgIGZvbnRTaXplOiAnMnJlbScsXG4gICAgICBtYXJnaW5Cb3R0b206ICcwLjVyZW0nXG4gICAgfSxcbiAgICBoMjoge1xuICAgICAgY29sb3I6IHNoYXJlZFRoZW1lLnBhbGV0dGUudGV4dC5wcmltYXJ5LFxuICAgICAgZm9udFNpemU6ICcxLjVyZW0nLFxuICAgICAgZm9udFdlaWdodDogNDAwLFxuICAgICAgbWFyZ2luQm90dG9tOiAnMC41cmVtJ1xuICAgIH0sXG4gICAgaDM6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeSxcbiAgICAgIGZvbnRTaXplOiAnMS4yNXJlbSdcbiAgICB9LFxuICAgIHN1YnRpdGxlMToge1xuICAgICAgY29sb3I6IHNoYXJlZFRoZW1lLnBhbGV0dGUudGV4dC5wcmltYXJ5XG4gICAgfSxcbiAgICBzdWJ0aXRsZTI6IHtcbiAgICAgIGNvbG9yOiBzaGFyZWRUaGVtZS5wYWxldHRlLnRleHQucHJpbWFyeVxuICAgIH0sXG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB0aGVtZTtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/theme/RaveboxTheme.tsx\n");

/***/ }),

/***/ 0:
/*!*****************************************!*\
  !*** multi private-next-pages/_app.tsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! private-next-pages/_app.tsx */"./src/pages/_app.tsx");


/***/ }),

/***/ "@material-ui/core/CssBaseline":
/*!************************************************!*\
  !*** external "@material-ui/core/CssBaseline" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/CssBaseline\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAbWF0ZXJpYWwtdWkvY29yZS9Dc3NCYXNlbGluZVwiP2U2N2EiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiQG1hdGVyaWFsLXVpL2NvcmUvQ3NzQmFzZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAbWF0ZXJpYWwtdWkvY29yZS9Dc3NCYXNlbGluZVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@material-ui/core/CssBaseline\n");

/***/ }),

/***/ "@material-ui/core/styles":
/*!*******************************************!*\
  !*** external "@material-ui/core/styles" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/styles\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAbWF0ZXJpYWwtdWkvY29yZS9zdHlsZXNcIj80MTAyIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IkBtYXRlcmlhbC11aS9jb3JlL3N0eWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBtYXRlcmlhbC11aS9jb3JlL3N0eWxlc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@material-ui/core/styles\n");

/***/ }),

/***/ "@material-ui/core/useMediaQuery":
/*!**************************************************!*\
  !*** external "@material-ui/core/useMediaQuery" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@material-ui/core/useMediaQuery\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAbWF0ZXJpYWwtdWkvY29yZS91c2VNZWRpYVF1ZXJ5XCI/OWFjMyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJAbWF0ZXJpYWwtdWkvY29yZS91c2VNZWRpYVF1ZXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG1hdGVyaWFsLXVpL2NvcmUvdXNlTWVkaWFRdWVyeVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///@material-ui/core/useMediaQuery\n");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"next/head\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJuZXh0L2hlYWRcIj81ZWYyIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6Im5leHQvaGVhZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvaGVhZFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///next/head\n");

/***/ }),

/***/ "notistack":
/*!****************************!*\
  !*** external "notistack" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"notistack\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub3Rpc3RhY2tcIj80MjVhIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6Im5vdGlzdGFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vdGlzdGFja1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///notistack\n");

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"prop-types\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwcm9wLXR5cGVzXCI/MzgzMiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwcm9wLXR5cGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicHJvcC10eXBlc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///prop-types\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdFwiPzU4OGUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoicmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///react\n");

/***/ })

/******/ });