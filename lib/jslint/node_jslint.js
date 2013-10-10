/*jslint node: true, ass: true */

// v8.js
// 2009-09-11: Based on Douglas Crockford's Rhino edition
//
// I've made a few changes, specifically the ability to parse
// one file, while displaying the name of another.
//

var jslintModule = require('./~jslint.module');

(function (argv) {
  'use strict';

  var e, i, fileToParse, fileToDisplay, defaults, numErrors,
    fs = require("fs");

  argv.shift(); // drop "node"
  argv.shift(); // drop this script's name

  if (!argv[0]) {
    console.log("Usage: jslintModule.js file.js [realfilename.js]");
    process.exit(1);
  }

  fileToParse = argv[0];
  fileToDisplay = argv[1] || argv[0];

  fs.readFile(fileToParse, function (err, data) {
    if (err || !data) {
      console.log("jslintModule: Couldn't open file '" + fileToParse + "'.");
      process.exit(1);
    }

    defaults = {
      browser: true,
      'continue': true,
      devel: true,
      indent: 2,
      nomen: true,
      plusplus: true,
      regexp: true,
      sloppy: true,
      unparam: false,
      vars: true,

      predef: [
        // Global symbol names
      ]
    };

    if (!jslintModule(data.toString(), defaults)) {
      for (i = 0, numErrors = jslintModule.errors.length; i < numErrors; i += 1) {
        e = jslintModule.errors[i];
        if (e) {
          console.log('[' + fileToDisplay + '] Lint at line ' + e.line + ' character ' + e.character + ': ' + e.reason);
          console.log((e.evidence || '').replace(/^\s+|\s+$/, ""));
        }
      }
      process.exit(2);
    } else {
      console.log("jslintModule: No problems found in " + fileToDisplay);

      (function (data, itimes) {
        function indent(itimes, ichar) {
          if (itimes === undefined) {
            itimes = 1;
          }

          if (ichar === undefined) {
            ichar = '  ';
          }

          var indentation = [], j;
          for (j = 0; j < itimes; j += 1) {
            indentation.push(ichar);
          }

          return indentation.join('');
        }

        function getItimes(itimes) {
          return (itimes !== undefined) ? itimes : 1;
        }

        function iprint(message, itimes) {
          var indentation = indent(getItimes(itimes));
          console.log(indentation + message);
        }

        itimes = getItimes(itimes);
        iprint(fileToDisplay, itimes);

        (function (functions, itimes) {
          var fn;

          itimes = getItimes(itimes);

          function getParams(fn) {
            var params = fn.params, buffer = [], param;

            if (params) {
              params = params.slice();
              while ((param = params.shift()) !== undefined) {
                buffer.push(param.string);
              }
            }

            return buffer.join(', ');
          }

          function printSignature(fn, itimes) {
            itimes = getItimes(itimes);

            var signature = [
              'line ', fn.line, ': ', fn.name, ' = function (', getParams(fn), ')'
            ].join('');

            iprint(signature, itimes);
          }

          function printLabel(fn, label, itimes) {
            var symbols, symbol;

            itimes = getItimes(itimes);

            if ((symbols = fn[label]) !== undefined) {
              iprint(label + ':', itimes);

              symbols = symbols.slice();
              while ((symbol = symbols.shift()) !== undefined) {
                iprint(symbol, (itimes + 1));
              }
            }
          }

          function printFn(fn, itimes) {
            var label, labels;

            itimes = getItimes(itimes);
            printSignature(fn, itimes);

            labels = [
              'closure',
              'exception',
              'global',
              'label',
              'outer',
              'undef',
              'unused',
              'var'
            ];

            while ((label = labels.shift()) !== undefined) {
              printLabel(fn, label, (itimes + 1));
            }
          }

          if (functions) {
            iprint('functions:', itimes);

            functions = functions.slice().sort(function (fn_1, fn_2) {
              var comparison = (fn_2['(complexity)'] - fn_1['(complexity)']);

              if (comparison === 0) {
                comparison = (fn_1.line - fn_2.line);
              }

              if (comparison === 0) {
                comparison = ((fn_1.name > fn_2.name)
                  ? 1
                  : (fn_1.name < fn_2.name)
                  ? -1
                  : 0);
              }

              return comparison;
            });

            while ((fn = functions.shift()) !== undefined) {
              printFn(fn, (itimes + 1));
            }
          }
        }(data.functions, (itimes + 1)));

        (function (globals, itimes) {
          var global;

          itimes = getItimes(itimes);

          if (globals) {
            iprint('globals:', itimes);

            globals = globals.slice();
            while ((global = globals.shift()) !== undefined) {
              iprint(global, (itimes + 1));
            }
          }
        }(data.globals, (itimes + 1)));

        (function (member, itimes) {
          var identifiers, identifier, message;

          itimes = getItimes(itimes);

          // There is a weird bug below in which `member` occasionally does not
          // have a method attribute named, "hasOwnProperty."
          if (member && (typeof member.hasOwnProperty === 'function')) {
            iprint('member:', itimes);

            identifiers = [];
            for (identifier in member) {
              if (member.hasOwnProperty(identifier)) {
                identifiers.push(identifier);
              }
            }

            identifiers = identifiers.sort(function (identifier_1, identifier_2) {
              var comparison = (member[identifier_2] - member[identifier_1]);

              if (comparison === 0) {
                comparison = ((identifier_1 > identifier_2)
                  ? 1
                  : (identifier_1 < identifier_2)
                  ? -1
                  : 0);
              }

              return comparison;
            });

            while ((identifier = identifiers.shift()) !== undefined) {
              message = identifier + ': ' + member[identifier];
              iprint(message, (itimes + 1));
            }
          }
        }(data.member, (itimes + 1)));

        (function (urls, itimes) {
          var url;

          itimes = getItimes(itimes);

          if (urls) {
            iprint('urls:', itimes);

            urls = urls.slice();
            while ((url = urls.shift()) !== undefined) {
              iprint(url, (itimes + 1));
            }
          }
        }(data.urls, (itimes + 1)));
      }(jslintModule.data(), 1));

      process.exit(0);
    }
  });
}(process.argv));
