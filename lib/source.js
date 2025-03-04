"use strict";

const _ = require("lodash");
const path = require("path");

const logger = require("./logger");
const markdownToHTMLPath = require("./markdown");

class Source {
  /**
   * Given a single URL String or an array of URLs return an array with any
   * transformations applied (i.e. markdown processor)
   *
   * @param input
   * @param args
   * @returns {Array} of Promises
   */
  resolve(input, args) {
    const files = _.isArray(input) ? input : [input];
    // wargs.urlWithArgs(this.markdown(input, args), {})
    const promises = files.map((i) => {
      return this.markdown(i, args);
    });
    return Promise.all(promises);
  }

  markdown(input, args) {
    return new Promise((resolve, reject) => {
      if (this._isMarkdown(input)) {
        var opts = {
          customCss: [].concat(args.css || []),
        };

        // if given a markdown, render it into HTML and return the path of the HTML
        markdownToHTMLPath(input, opts, (err, tmpHTMLPath) => {
          if (err) {
            logger("Parse markdown file error", err);
            reject(err);
          }
          resolve(tmpHTMLPath);
        });
      } else {
        resolve(input);
      }
    });
  }

  _isMarkdown(input) {
    var isMd = false;
    if (_.isString(input)) {
      var ext = path.extname(input).toLowerCase();
      isMd = ext === ".md" || ext === ".markdown";
    }
    return isMd;
  }
}

module.exports = Source;
