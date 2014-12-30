var mergeInto = require('./mergeInto');

var ODD_ROW_DIFFERENCE = 1;

function loopFromCenter(arr, callback) {
  var len = arr.length;
  var next = Math.floor(len / 2);
  if (len % 2) {
    callback(arr[next]);
  }
  while (next--) {
    callback(arr[next], arr[len - next - 1]);
  }
}


class RowOrganizer {
  /**
   * options: {
   *   itemWidth: int,
   *   itemHeight: int,
   *   isFocused: function(item) => bool,
   *   forEach: function(items, callback),
   * }
   */
  constructor(options) {
    mergeInto(this, options);
    this.hwRatio = options.itemHeight / options.itemWidth;
  }

  createRows(items, totalWidth) {
    var rowSize = this._calculateRowSize(totalWidth);
    var rows = this._putItemsIntoRows(items, rowSize, rowSize + ODD_ROW_DIFFERENCE);
    this._setupRows(rows, totalWidth);
    return rows;
  }

  _calculateRowSize(totalWidth) {
    return Math.floor(totalWidth / this.itemWidth);
  }

  /**
   * Put items in a list of rows. Each row is a list of items.
   */
  _putItemsIntoRows(items, evenRowSize, oddRowSize) {
    var rows = [[]];
    var rowSize = evenRowSize;
    this.forEach(items, (item) => {
      if (rows[rows.length - 1].length === rowSize) {
        rowSize = rows.length % 2 ? oddRowSize : evenRowSize;
        rows.push([]);
      }
      rows[rows.length - 1].push(this._createItem(item));
    });
    return rows;
  }

  _createItem(item) {
    return {element: item, style: {opacity: 1}};
  }

  /**
   * Get the index of the focused row.
   */
  _getFocusedRow(rows) {
    for (var i = 0; i < rows.length; i++) {
      if (this._getFocusedItem(rows[i]) != null) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Get the index of the focused item.
   */
  _getFocusedItem(row) {
    for (var i = 0; i < row.length; i++) {
      if (this.isFocused(row[i].element)) {
        return i;
      }
    }
  }

  _getLargestRowSize(rows) {
    return rows.reduce(
      (largest, row) => Math.max(largest, row.length),
      0
    );
  }

  _setupRows(rows, width) {
    var largestRowSize = this._getLargestRowSize(rows);

    var focusedRow = this._getFocusedRow(rows);
    if (focusedRow != null) {
      this._setupFocusedRow(rows[focusedRow], width, largestRowSize);
    } else {
      // TODO: No row is focused, do something!
    }

    var index = focusedRow;
    // Setup previous rows
    while (index--) {
      this._setupRowBasedOnAdjacent(rows[index], rows[index + 1], width, largestRowSize);
    }

    index = focusedRow;
    // Setup subsequent rows
    while (++index < rows.length) {
      this._setupRowBasedOnAdjacent(rows[index], rows[index - 1], width, largestRowSize);
    }
  }

  _setupFocusedRow(row, width, largestRowSize) {
    row.forEach((item) => {
      item.style.width = this.itemWidth;
    });

    var focusedItem = this._getFocusedItem(row);
    loopFromCenter(row, this._createFactorApplier(0.95, row[focusedItem]));

    this._distributeRow(row, width, largestRowSize);
  }

  _setupRowBasedOnAdjacent(row, adjacent, width, largestRowSize) {
    row.forEach((item) => {
      item.style.width = this.itemWidth;
    });
    loopFromCenter(row, this._createFactorApplier(0.95));
    this._distributeRow(row, width, largestRowSize);
  }

  _createFactorApplier(factor, exclude) {
    return (...items) => {
      items.forEach((item) => {
        if (item && item !== exclude) {
          var newWidth = Math.floor(item.style.width * factor);
          item.style.width = newWidth;
          var scaledOut = 1 - newWidth / this.itemWidth;
          item.style.top = Math.floor(scaledOut * this.itemHeight / 2);
        }
      });
      factor *= 0.8;
    };
  }

  /**
   * Distribute items in a row so they look good.
   */
  _distributeRow(row, width, largestRowSize) {
    var wastedSpace = (largestRowSize - row.length) * this.itemWidth / 2;

    var sumWidth = row.reduce((sum, item) => sum + item.style.width, 0);
    var remaining = width - sumWidth - wastedSpace;
    var betweenSpacing = Math.floor(remaining / (row.length - 1));

    var offset = Math.floor(wastedSpace / 2);
    row.forEach((item, i) => {
      item.style.left = offset;
      offset += betweenSpacing + item.style.width;
    });
  }
}

module.exports = RowOrganizer;
