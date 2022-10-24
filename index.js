(function (exports) {
  /**
   * Check whether the list is exhaustive
   *
   * @param  {array}   list    List to be checked, should be in an array of objects
   *                           in the following format: {'min':1, 'max': 2}
   * @param  {object}  options options for the checking operations
   *
   * @return {Boolean}         result
   */
  exports.isExhaustiveList = (list = [], options = {}) => {
    // check whether list is an array
    if (!Array.isArray(list)) {
      throw "First argument must be an array";
    }

    // check whether options is an object
    if (typeof options != "object" || options === null) {
      throw "Second argument must be an object";
    }

    // check whether the list is valid
    if (!exports.checkIsValidList(list)) {
      throw 'The items inside list must contain both "min" and "max" key';
    }

    // if the list is empty or only contains 1 item, return true
    if ([0, 1].includes(list.length)) {
      return true;
    }

    // check whether is it sorted
    if (options.isSorted === true && !exports.checkIsSorted(list)) {
      // throw 'The list is not sorted when the "isSorted" flag is true'

      return {
        result: false,
        errors: {
          all: ['The list is not sorted when the "isSorted" flag is true'],
        },
      };
    }

    list = list.map((item, index) => {
      item.original_index = index;
      return item;
    });

    // sort the list
    let sortedList = list.sort((a, b) => a.min - b.min);

    let errors = {};
    let previousItem = null;

    for (let i = 0; i < sortedList.length; i++) {
      let currentItem = sortedList[i];
      // check whether min > max
      if (currentItem.min > currentItem.max) {
        errors = exports.addErrors(
          errors,
          currentItem.original_index,
          '"min" value is greater than "max"'
        );
      }
      // if previous item exists (not first element), compare
      if (previousItem) {
        // check whether there's overlap
        if (previousItem.max > currentItem.min) {
          errors = exports.addErrors(
            errors,
            previousItem.original_index,
            '"max" value is greater than "min" value with the item in next order'
          );
          errors = exports.addErrors(
            errors,
            currentItem.original_index,
            '"min" value is smaller than "max" value with the item in previous order'
          );
        }

        //
        if (currentItem.min - previousItem.max > 1) {
          errors = exports.addErrors(
            errors,
            previousItem.original_index,
            'There is a gap between the current item "max" value with the "min" value of item in next order'
          );
          errors = exports.addErrors(
            errors,
            currentItem.original_index,
            'There is a gap between the current item "min" value with the "max" value of item in previous order'
          );
        }
      }

      // move on with next item
      previousItem = currentItem;
    }

    if (Object.keys(errors).length) {
      return {
        result: false,
        errors,
      };
    }

    return {
      result: true,
    };
  };

  /**
   * Check whether the list is valid (contains "min" and "max" key)
   *
   * @param  {array}    list list
   *
   * @return {Boolean}       result
   */
  exports.checkIsValidList = (list) => {
    for (const item of list) {
      if (typeof item.min === "undefined" || typeof item.max === "undefined") {
        return false;
      }
    }

    return true;
  };

  /**
   * Check whether the list is sorted
   *
   * @param  {array}    list list
   *
   * @return {Boolean}       result
   */
  exports.checkIsSorted = (list) => {
    let currentValue = list[0].min;
    for (const item of list) {
      if (item.min <= currentValue) {
        return false;
      }

      currentValue = item.min;
    }

    return true;
  };

  exports.addErrors = (errors, index, message) => {
    let itemError = errors[index] || [];
    itemError.push(message);
    errors[index] = itemError;

    return errors;
  };

  // const ExhaustiveList = {
  //   isExhaustiveList,
  // };

  // module.exports = ExhaustiveList
})(typeof exports === "undefined" ? (this.ExhaustiveList = {}) : exports);
