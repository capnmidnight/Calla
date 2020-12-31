(function () {
  'use strict';

  /**
   * Common utilities
   * @module glMatrix
   */
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;

    while (i--) {
      y += arguments[i] * arguments[i];
    }

    return Math.sqrt(y);
  };

  /**
   * 3x3 Matrix
   * @module mat3
   */

  /**
   * Creates a new identity mat3
   *
   * @returns {mat3} a new 3x3 matrix
   */

  function create() {
    var out = new ARRAY_TYPE(9);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }

    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }
  /**
   * Set the components of a mat3 to the given values
   *
   * @param {mat3} out the receiving matrix
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m10 Component in column 1, row 0 position (index 3)
   * @param {Number} m11 Component in column 1, row 1 position (index 4)
   * @param {Number} m12 Component in column 1, row 2 position (index 5)
   * @param {Number} m20 Component in column 2, row 0 position (index 6)
   * @param {Number} m21 Component in column 2, row 1 position (index 7)
   * @param {Number} m22 Component in column 2, row 2 position (index 8)
   * @returns {mat3} out
   */

  function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
  }
  /**
   * Set a mat3 to the identity matrix
   *
   * @param {mat3} out the receiving matrix
   * @returns {mat3} out
   */

  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
  }

  /**
   * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
   * @module mat4
   */

  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */

  function create$1() {
    var out = new ARRAY_TYPE(16);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }

    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  /**
   * Set the components of a mat4 to the given values
   *
   * @param {mat4} out the receiving matrix
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m03 Component in column 0, row 3 position (index 3)
   * @param {Number} m10 Component in column 1, row 0 position (index 4)
   * @param {Number} m11 Component in column 1, row 1 position (index 5)
   * @param {Number} m12 Component in column 1, row 2 position (index 6)
   * @param {Number} m13 Component in column 1, row 3 position (index 7)
   * @param {Number} m20 Component in column 2, row 0 position (index 8)
   * @param {Number} m21 Component in column 2, row 1 position (index 9)
   * @param {Number} m22 Component in column 2, row 2 position (index 10)
   * @param {Number} m23 Component in column 2, row 3 position (index 11)
   * @param {Number} m30 Component in column 3, row 0 position (index 12)
   * @param {Number} m31 Component in column 3, row 1 position (index 13)
   * @param {Number} m32 Component in column 3, row 2 position (index 14)
   * @param {Number} m33 Component in column 3, row 3 position (index 15)
   * @returns {mat4} out
   */

  function set$1(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }

  /**
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */

  function create$2() {
    var out = new ARRAY_TYPE(3);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  }
  /**
   * Calculates the length of a vec3
   *
   * @param {ReadonlyVec3} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  /**
   * Copy the values from one vec3 to another
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the source vector
   * @returns {vec3} out
   */

  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  /**
   * Set the components of a vec3 to the given values
   *
   * @param {vec3} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} out
   */

  function set$2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Adds two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */

  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */

  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  /**
   * Scales a vec3 by a scalar number
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec3} out
   */

  function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  /**
   * Normalize a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a vector to normalize
   * @returns {vec3} out
   */

  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;

    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec3's
   *
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  /**
   * Computes the cross product of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */

  function cross(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    var bx = b[0],
        by = b[1],
        bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  /**
   * Performs a linear interpolation between two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {vec3} out
   */

  function lerp(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  /**
   * Set the components of a vec3 to zero
   *
   * @param {vec3} out the receiving vector
   * @returns {vec3} out
   */

  function zero(out) {
    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    return out;
  }
  /**
   * Alias for {@link vec3.subtract}
   * @function
   */

  var sub = subtract;
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach = function () {
    var vec = create$2();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 3;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }

      return a;
    };
  }();

  function t(o, s, c) {
      return typeof o === s
          || o instanceof c;
  }
  function isFunction(obj) {
      return t(obj, "function", Function);
  }
  function isString(obj) {
      return t(obj, "string", String);
  }
  function isBoolean(obj) {
      return t(obj, "boolean", Boolean);
  }
  function isNumber(obj) {
      return t(obj, "number", Number);
  }
  function isObject(obj) {
      return t(obj, "object", Object);
  }
  function isArray(obj) {
      return obj instanceof Array;
  }
  function isHTMLElement(obj) {
      return obj instanceof HTMLElement;
  }
  /**
   * Check a value to see if it is of a number type
   * and is not the special NaN value.
   */
  function isGoodNumber(obj) {
      return isNumber(obj)
          && !Number.isNaN(obj);
  }
  function isNullOrUndefined(obj) {
      return obj === null
          || obj === undefined;
  }

  /**
   * Performs a binary search on a list to find where the item should be inserted.
   *
   * If the item is found, the returned index will be an exact integer.
   *
   * If the item is not found, the returned insertion index will be 0.5 greater than
   * the index at which it should be inserted.
   */
  function arrayBinarySearch(arr, item) {
      let left = 0;
      let right = arr.length;
      let idx = Math.floor((left + right) / 2);
      let found = false;
      while (left < right && idx < arr.length) {
          const compareTo = arr[idx];
          if (!isNullOrUndefined(compareTo)
              && item < compareTo) {
              right = idx;
          }
          else {
              if (item === compareTo) {
                  found = true;
              }
              left = idx + 1;
          }
          idx = Math.floor((left + right) / 2);
      }
      if (!found) {
          idx += 0.5;
      }
      return idx;
  }

  /**
   * Empties out an array, returning the items that were in the array.
   */
  function arrayClear(arr) {
      return arr.splice(0);
  }

  /**
   * Removes an item at the given index from an array.
   */
  function arrayRemoveAt(arr, idx) {
      return arr.splice(idx, 1)[0];
  }

  /**
   * Removes a given item from an array, returning true if the item was removed.
   */
  function arrayRemove(arr, value) {
      const idx = arr.indexOf(value);
      if (idx > -1) {
          arrayRemoveAt(arr, idx);
          return true;
      }
      return false;
  }

  /**
   * Scans through a series of filters to find an item that matches
   * any of the filters. The first item of the first filter that matches
   * will be returned.
   */
  function arrayScan(arr, ...tests) {
      for (const test of tests) {
          for (const item of arr) {
              if (test(item)) {
                  return item;
              }
          }
      }
      return null;
  }

  /**
   * Performs an insert operation that maintains the sort
   * order of the array, returning the index at which the
   * item was inserted.
   */
  function arraySortedInsert(arr, item, allowDuplicates = true) {
      let idx = arrayBinarySearch(arr, item);
      const found = (idx % 1) === 0;
      idx = idx | 0;
      if (!found || allowDuplicates) {
          arr.splice(idx, 0, item);
      }
      return idx;
  }

  /**
   * Unicode-standardized pictograms.
   **/
  class Emoji {
      /**
       * Creates a new Unicode-standardized pictograms.
       * @param value - a Unicode sequence.
       * @param desc - an English text description of the pictogram.
       * @param props - an optional set of properties to store with the emoji.
       */
      constructor(value, desc, props = null) {
          this.value = value;
          this.desc = desc;
          this.value = value;
          this.desc = desc;
          this.props = props || {};
      }
      /**
       * Determines of the provided Emoji or EmojiGroup is a subset of
       * this emoji.
       */
      contains(e) {
          return this.value.indexOf(e.value) >= 0;
      }
  }

  class EmojiGroup extends Emoji {
      /**
       * Groupings of Unicode-standardized pictograms.
       * @param value - a Unicode sequence.
       * @param desc - an English text description of the pictogram.
       * @param ...rest - Emojis in this group.
       */
      constructor(value, desc, ...alts) {
          super(value, desc);
          this.width = null;
          this.alts = alts;
      }
      /**
       * Selects a random emoji out of the collection.
       **/
      random() {
          const idx = Math.floor(Math.random() * this.alts.length);
          if (idx < 0) {
              return null;
          }
          const selection = this.alts[idx];
          if (selection instanceof EmojiGroup) {
              return selection.random();
          }
          else {
              return selection;
          }
      }
      contains(e) {
          if (super.contains(e)) {
              return true;
          }
          else {
              for (const alt of this.alts) {
                  if (alt.contains(e)) {
                      return true;
                  }
              }
              return false;
          }
      }
  }

  /**
   * Shorthand for `new Emoji`, which saves significantly on bundle size.
   * @param v - a Unicode sequence.
   * @param d - an English text description of the pictogram.
   * @param [o] - an optional set of properties to set on the Emoji object.
   */
  function e(v, d, o = null) {
      return new Emoji(v, d, o);
  }
  /**
   * Shorthand for `new Emoji`, which saves significantly on bundle size.
   * @param v - a Unicode sequence.
   * @param d - an English text description of the pictogram.
   * @param [o] - an optional set of properties to set on the Emoji object.
   */
  function E(v, d, o = null) {
      return new Emoji(v + emojiStyle.value, d, o);
  }
  /**
   * Shorthand for `new EmojiGroup`, which saves significantly on bundle size.
   * @param v - a Unicode sequence.
   * @param d - an English text description of the pictogram.
   * @param r - the emoji that are contained in this group.
   */
  function g(v, d, ...r) {
      return new EmojiGroup(v, d, ...r);
  }
  /**
   * A shorthand for `new EmojiGroup` that allows for setting optional properties
   * on the EmojiGroup object.
   */
  function gg(v, d, o, ...r) {
      const emojis = Object.values(o)
          .filter(oo => oo instanceof Emoji)
          .map(oo => oo)
          .concat(...r);
      return Object.assign(g(v, d, ...emojis), o);
  }
  function combo(a, b, altDesc = null) {
      if (a instanceof Array) {
          return a.map(c => combo(c, b));
      }
      else if (a instanceof EmojiGroup) {
          const { value, desc } = combo(e(a.value, a.desc), b);
          return g(value, desc, ...combo(a.alts, b));
      }
      else if (b instanceof Array) {
          return b.map(c => combo(a, c));
      }
      else {
          return e(a.value + b.value, altDesc || (a.desc + ": " + b.desc));
      }
  }
  function join(a, b, altDesc = null) {
      if (a instanceof Array) {
          return a.map(c => join(c, b));
      }
      else if (a instanceof EmojiGroup) {
          const { value, desc } = join(e(a.value, a.desc), b);
          return g(value, desc, ...join(a.alts, b));
      }
      else if (b instanceof Array) {
          return b.map(c => join(a, c));
      }
      else {
          return e(a.value + zeroWidthJoiner.value + b.value, altDesc || (a.desc + ": " + b.desc));
      }
  }
  function skin(v, d, ...rest) {
      const person = e(v, d), light = combo(person, skinL), mediumLight = combo(person, skinML), medium = combo(person, skinM), mediumDark = combo(person, skinMD), dark = combo(person, skinD);
      return gg(person.value, person.desc, {
          default: person,
          light,
          mediumLight,
          medium,
          mediumDark,
          dark
      }, ...rest);
  }
  function sex(person) {
      const man = join(person, male), woman = join(person, female);
      return gg(person.value, person.desc, {
          default: person,
          man,
          woman
      });
  }
  function skinAndSex(v, d) {
      return sex(skin(v, d));
  }
  function skinAndHair(v, d, ...rest) {
      const people = skin(v, d), red = join(people, hairRed), curly = join(people, hairCurly), white = join(people, hairWhite), bald = join(people, hairBald);
      return gg(people.value, people.desc, {
          default: people,
          red,
          curly,
          white,
          bald
      }, ...rest);
  }
  function sym(symbol, name) {
      const j = e(symbol.value, name), men = join(man.default, j), women = join(woman.default, j);
      return gg(symbol.value, symbol.desc, {
          symbol,
          men,
          women
      });
  }
  const emojiStyle = e("\uFE0F", "Variation Selector-16: emoji style");
  const zeroWidthJoiner = e("\u200D", "Zero Width Joiner");
  const combiningEnclosingKeycap = e("\u20E3", "Combining Enclosing Keycap");
  const female = E("\u2640", "Female");
  const male = E("\u2642", "Male");
  const transgender = E("\u26A7", "Transgender Symbol");
  const skinL = e("\u{1F3FB}", "Light Skin Tone");
  const skinML = e("\u{1F3FC}", "Medium-Light Skin Tone");
  const skinM = e("\u{1F3FD}", "Medium Skin Tone");
  const skinMD = e("\u{1F3FE}", "Medium-Dark Skin Tone");
  const skinD = e("\u{1F3FF}", "Dark Skin Tone");
  const hairRed = e("\u{1F9B0}", "Red Hair");
  const hairCurly = e("\u{1F9B1}", "Curly Hair");
  const hairWhite = e("\u{1F9B3}", "White Hair");
  const hairBald = e("\u{1F9B2}", "Bald");
  const frowners = skinAndSex("\u{1F64D}", "Frowning");
  const pouters = skinAndSex("\u{1F64E}", "Pouting");
  const gesturingNo = skinAndSex("\u{1F645}", "Gesturing NO");
  const gesturingOK = skinAndSex("\u{1F646}", "Gesturing OK");
  const tippingHand = skinAndSex("\u{1F481}", "Tipping Hand");
  const raisingHand = skinAndSex("\u{1F64B}", "Raising Hand");
  const bowing = skinAndSex("\u{1F647}", "Bowing");
  const facePalming = skinAndSex("\u{1F926}", "Facepalming");
  const shrugging = skinAndSex("\u{1F937}", "Shrugging");
  const cantHear = skinAndSex("\u{1F9CF}", "Can't Hear");
  const gettingMassage = skinAndSex("\u{1F486}", "Getting Massage");
  const gettingHaircut = skinAndSex("\u{1F487}", "Getting Haircut");
  const constructionWorkers = skinAndSex("\u{1F477}", "Construction Worker");
  const guards = skinAndSex("\u{1F482}", "Guard");
  const spies = skinAndSex("\u{1F575}", "Spy");
  const police = skinAndSex("\u{1F46E}", "Police");
  const wearingTurban = skinAndSex("\u{1F473}", "Wearing Turban");
  const superheroes = skinAndSex("\u{1F9B8}", "Superhero");
  const supervillains = skinAndSex("\u{1F9B9}", "Supervillain");
  const mages = skinAndSex("\u{1F9D9}", "Mage");
  const fairies = skinAndSex("\u{1F9DA}", "Fairy");
  const vampires = skinAndSex("\u{1F9DB}", "Vampire");
  const merpeople = skinAndSex("\u{1F9DC}", "Merperson");
  const elves = skinAndSex("\u{1F9DD}", "Elf");
  const walking = skinAndSex("\u{1F6B6}", "Walking");
  const standing = skinAndSex("\u{1F9CD}", "Standing");
  const kneeling = skinAndSex("\u{1F9CE}", "Kneeling");
  const runners = skinAndSex("\u{1F3C3}", "Running");
  const gestures = g("Gestures", "Gestures", frowners, pouters, gesturingNo, gesturingOK, tippingHand, raisingHand, bowing, facePalming, shrugging, cantHear, gettingMassage, gettingHaircut);
  const baby = skin("\u{1F476}", "Baby");
  const child = skin("\u{1F9D2}", "Child");
  const boy = skin("\u{1F466}", "Boy");
  const girl = skin("\u{1F467}", "Girl");
  const children = gg(child.value, child.desc, {
      default: child,
      male: boy,
      female: girl
  });
  const blondes = skinAndSex("\u{1F471}", "Blond Person");
  const person = skin("\u{1F9D1}", "Person", blondes.default, wearingTurban.default);
  const beardedMan = skin("\u{1F9D4}", "Bearded Man");
  const manInSuitLevitating = E("\u{1F574}", "Man in Suit, Levitating");
  const manWithChineseCap = skin("\u{1F472}", "Man With Chinese Cap");
  const manInTuxedo = skin("\u{1F935}", "Man in Tuxedo");
  const man = skinAndHair("\u{1F468}", "Man", blondes.man, beardedMan, manInSuitLevitating, manWithChineseCap, wearingTurban.man, manInTuxedo);
  const pregnantWoman = skin("\u{1F930}", "Pregnant Woman");
  const breastFeeding = skin("\u{1F931}", "Breast-Feeding");
  const womanWithHeadscarf = skin("\u{1F9D5}", "Woman With Headscarf");
  const brideWithVeil = skin("\u{1F470}", "Bride With Veil");
  const woman = skinAndHair("\u{1F469}", "Woman", blondes.woman, pregnantWoman, breastFeeding, womanWithHeadscarf, wearingTurban.woman, brideWithVeil);
  const adults = gg(person.value, "Adult", {
      default: person,
      male: man,
      female: woman
  });
  const olderPerson = skin("\u{1F9D3}", "Older Person");
  const oldMan = skin("\u{1F474}", "Old Man");
  const oldWoman = skin("\u{1F475}", "Old Woman");
  const elderly = gg(olderPerson.value, olderPerson.desc, {
      default: olderPerson,
      male: oldMan,
      female: oldWoman
  });
  const medical = E("\u2695", "Medical");
  const healthCareWorkers = sym(medical, "Health Care");
  const graduationCap = e("\u{1F393}", "Graduation Cap");
  const students = sym(graduationCap, "Student");
  const school = e("\u{1F3EB}", "School");
  const teachers = sym(school, "Teacher");
  const balanceScale = E("\u2696", "Balance Scale");
  const judges = sym(balanceScale, "Judge");
  const sheafOfRice = e("\u{1F33E}", "Sheaf of Rice");
  const farmers = sym(sheafOfRice, "Farmer");
  const cooking = e("\u{1F373}", "Cooking");
  const cooks = sym(cooking, "Cook");
  const wrench = e("\u{1F527}", "Wrench");
  const mechanics = sym(wrench, "Mechanic");
  const factory = e("\u{1F3ED}", "Factory");
  const factoryWorkers = sym(factory, "Factory Worker");
  const briefcase = e("\u{1F4BC}", "Briefcase");
  const officeWorkers = sym(briefcase, "Office Worker");
  const fireEngine = e("\u{1F692}", "Fire Engine");
  const fireFighters = sym(fireEngine, "Fire Fighter");
  const rocket = e("\u{1F680}", "Rocket");
  const astronauts = sym(rocket, "Astronaut");
  const airplane = E("\u2708", "Airplane");
  const pilots = sym(airplane, "Pilot");
  const artistPalette = e("\u{1F3A8}", "Artist Palette");
  const artists = sym(artistPalette, "Artist");
  const microphone = e("\u{1F3A4}", "Microphone");
  const singers = sym(microphone, "Singer");
  const laptop = e("\u{1F4BB}", "Laptop");
  const technologists = sym(laptop, "Technologist");
  const microscope = e("\u{1F52C}", "Microscope");
  const scientists = sym(microscope, "Scientist");
  const crown = e("\u{1F451}", "Crown");
  const prince = skin("\u{1F934}", "Prince");
  const princess = skin("\u{1F478}", "Princess");
  const royalty = gg(crown.value, crown.desc, {
      symbol: crown,
      male: prince,
      female: princess
  });
  const roles = gg("Roles", "Depictions of people working", {
      healthCareWorkers,
      students,
      teachers,
      judges,
      farmers,
      cooks,
      mechanics,
      factoryWorkers,
      officeWorkers,
      scientists,
      technologists,
      singers,
      artists,
      pilots,
      astronauts,
      fireFighters,
      spies,
      guards,
      constructionWorkers,
      royalty
  });
  const cherub = skin("\u{1F47C}", "Cherub");
  const santaClaus = skin("\u{1F385}", "Santa Claus");
  const mrsClaus = skin("\u{1F936}", "Mrs. Claus");
  const genies = sex(e("\u{1F9DE}", "Genie"));
  const zombies = sex(e("\u{1F9DF}", "Zombie"));
  const fantasy = gg("Fantasy", "Depictions of fantasy characters", {
      cherub,
      santaClaus,
      mrsClaus,
      superheroes,
      supervillains,
      mages,
      fairies,
      vampires,
      merpeople,
      elves,
      genies,
      zombies
  });
  const safetyVest = e("\u{1F9BA}", "Safety Vest");
  const whiteCane = e("\u{1F9AF}", "Probing Cane");
  const withProbingCane = sym(whiteCane, "Probing");
  const motorizedWheelchair = e("\u{1F9BC}", "Motorized Wheelchair");
  const inMotorizedWheelchair = sym(motorizedWheelchair, "In Motorized Wheelchair");
  const manualWheelchair = e("\u{1F9BD}", "Manual Wheelchair");
  const inManualWheelchair = sym(manualWheelchair, "In Manual Wheelchair");
  const manDancing = skin("\u{1F57A}", "Man Dancing");
  const womanDancing = skin("\u{1F483}", "Woman Dancing");
  const dancers = gg(manDancing.value, "Dancing", {
      male: manDancing,
      female: womanDancing
  });
  const jugglers = skinAndSex("\u{1F939}", "Juggler");
  const climbers = skinAndSex("\u{1F9D7}", "Climber");
  const fencer = e("\u{1F93A}", "Fencer");
  const jockeys = skin("\u{1F3C7}", "Jockey");
  const skier = E("\u26F7", "Skier");
  const snowboarders = skin("\u{1F3C2}", "Snowboarder");
  const golfers = skinAndSex("\u{1F3CC}" + emojiStyle.value, "Golfer");
  const surfers = skinAndSex("\u{1F3C4}", "Surfing");
  const rowers = skinAndSex("\u{1F6A3}", "Rowing Boat");
  const swimmers = skinAndSex("\u{1F3CA}", "Swimming");
  const basketballers = skinAndSex("\u26F9" + emojiStyle.value, "Basket Baller");
  const weightLifters = skinAndSex("\u{1F3CB}" + emojiStyle.value, "Weight Lifter");
  const bikers = skinAndSex("\u{1F6B4}", "Biker");
  const mountainBikers = skinAndSex("\u{1F6B5}", "Mountain Biker");
  const cartwheelers = skinAndSex("\u{1F938}", "Cartwheeler");
  const wrestlers = sex(e("\u{1F93C}", "Wrestler"));
  const waterPoloers = skinAndSex("\u{1F93D}", "Water Polo Player");
  const handBallers = skinAndSex("\u{1F93E}", "Hand Baller");
  const inMotion = gg("In Motion", "Depictions of people in motion", {
      walking,
      standing,
      kneeling,
      withProbingCane,
      inMotorizedWheelchair,
      inManualWheelchair,
      dancers,
      jugglers,
      climbers,
      fencer,
      jockeys,
      skier,
      snowboarders,
      golfers,
      surfers,
      rowers,
      swimmers,
      runners,
      basketballers,
      weightLifters,
      bikers,
      mountainBikers,
      cartwheelers,
      wrestlers,
      waterPoloers,
      handBallers
  });
  const inLotusPosition = skinAndSex("\u{1F9D8}", "In Lotus Position");
  const inBath = skin("\u{1F6C0}", "In Bath");
  const inBed = skin("\u{1F6CC}", "In Bed");
  const inSauna = skinAndSex("\u{1F9D6}", "In Sauna");
  const resting = gg("Resting", "Depictions of people at rest", {
      inLotusPosition,
      inBath,
      inBed,
      inSauna
  });
  const babies = g(baby.value, baby.desc, baby, cherub);
  const people = gg("People", "People", {
      babies,
      children,
      adults,
      elderly
  });
  const allPeople = gg("All People", "All People", {
      people,
      gestures,
      inMotion,
      resting,
      roles,
      fantasy
  });
  const ogre = e("\u{1F479}", "Ogre");
  const goblin = e("\u{1F47A}", "Goblin");
  const ghost = e("\u{1F47B}", "Ghost");
  const alien = e("\u{1F47D}", "Alien");
  const alienMonster = e("\u{1F47E}", "Alien Monster");
  const angryFaceWithHorns = e("\u{1F47F}", "Angry Face with Horns");
  const skull = e("\u{1F480}", "Skull");
  const pileOfPoo = e("\u{1F4A9}", "Pile of Poo");
  const grinningFace = e("\u{1F600}", "Grinning Face");
  const beamingFaceWithSmilingEyes = e("\u{1F601}", "Beaming Face with Smiling Eyes");
  const faceWithTearsOfJoy = e("\u{1F602}", "Face with Tears of Joy");
  const grinningFaceWithBigEyes = e("\u{1F603}", "Grinning Face with Big Eyes");
  const grinningFaceWithSmilingEyes = e("\u{1F604}", "Grinning Face with Smiling Eyes");
  const grinningFaceWithSweat = e("\u{1F605}", "Grinning Face with Sweat");
  const grinningSquitingFace = e("\u{1F606}", "Grinning Squinting Face");
  const smillingFaceWithHalo = e("\u{1F607}", "Smiling Face with Halo");
  const smilingFaceWithHorns = e("\u{1F608}", "Smiling Face with Horns");
  const winkingFace = e("\u{1F609}", "Winking Face");
  const smilingFaceWithSmilingEyes = e("\u{1F60A}", "Smiling Face with Smiling Eyes");
  const faceSavoringFood = e("\u{1F60B}", "Face Savoring Food");
  const relievedFace = e("\u{1F60C}", "Relieved Face");
  const smilingFaceWithHeartEyes = e("\u{1F60D}", "Smiling Face with Heart-Eyes");
  const smilingFaceWithSunglasses = e("\u{1F60E}", "Smiling Face with Sunglasses");
  const smirkingFace = e("\u{1F60F}", "Smirking Face");
  const neutralFace = e("\u{1F610}", "Neutral Face");
  const expressionlessFace = e("\u{1F611}", "Expressionless Face");
  const unamusedFace = e("\u{1F612}", "Unamused Face");
  const downcastFaceWithSweat = e("\u{1F613}", "Downcast Face with Sweat");
  const pensiveFace = e("\u{1F614}", "Pensive Face");
  const confusedFace = e("\u{1F615}", "Confused Face");
  const confoundedFace = e("\u{1F616}", "Confounded Face");
  const kissingFace = e("\u{1F617}", "Kissing Face");
  const faceBlowingAKiss = e("\u{1F618}", "Face Blowing a Kiss");
  const kissingFaceWithSmilingEyes = e("\u{1F619}", "Kissing Face with Smiling Eyes");
  const kissingFaceWithClosedEyes = e("\u{1F61A}", "Kissing Face with Closed Eyes");
  const faceWithTongue = e("\u{1F61B}", "Face with Tongue");
  const winkingFaceWithTongue = e("\u{1F61C}", "Winking Face with Tongue");
  const squintingFaceWithTongue = e("\u{1F61D}", "Squinting Face with Tongue");
  const disappointedFace = e("\u{1F61E}", "Disappointed Face");
  const worriedFace = e("\u{1F61F}", "Worried Face");
  const angryFace = e("\u{1F620}", "Angry Face");
  const poutingFace = e("\u{1F621}", "Pouting Face");
  const cryingFace = e("\u{1F622}", "Crying Face");
  const perseveringFace = e("\u{1F623}", "Persevering Face");
  const faceWithSteamFromNose = e("\u{1F624}", "Face with Steam From Nose");
  const sadButRelievedFace = e("\u{1F625}", "Sad but Relieved Face");
  const frowningFaceWithOpenMouth = e("\u{1F626}", "Frowning Face with Open Mouth");
  const anguishedFace = e("\u{1F627}", "Anguished Face");
  const fearfulFace = e("\u{1F628}", "Fearful Face");
  const wearyFace = e("\u{1F629}", "Weary Face");
  const sleepyFace = e("\u{1F62A}", "Sleepy Face");
  const tiredFace = e("\u{1F62B}", "Tired Face");
  const grimacingFace = e("\u{1F62C}", "Grimacing Face");
  const loudlyCryingFace = e("\u{1F62D}", "Loudly Crying Face");
  const faceWithOpenMouth = e("\u{1F62E}", "Face with Open Mouth");
  const hushedFace = e("\u{1F62F}", "Hushed Face");
  const anxiousFaceWithSweat = e("\u{1F630}", "Anxious Face with Sweat");
  const faceScreamingInFear = e("\u{1F631}", "Face Screaming in Fear");
  const astonishedFace = e("\u{1F632}", "Astonished Face");
  const flushedFace = e("\u{1F633}", "Flushed Face");
  const sleepingFace = e("\u{1F634}", "Sleeping Face");
  const dizzyFace = e("\u{1F635}", "Dizzy Face");
  const faceWithoutMouth = e("\u{1F636}", "Face Without Mouth");
  const faceWithMedicalMask = e("\u{1F637}", "Face with Medical Mask");
  const grinningCatWithSmilingEyes = e("\u{1F638}", "Grinning Cat with Smiling Eyes");
  const catWithTearsOfJoy = e("\u{1F639}", "Cat with Tears of Joy");
  const grinningCat = e("\u{1F63A}", "Grinning Cat");
  const smilingCatWithHeartEyes = e("\u{1F63B}", "Smiling Cat with Heart-Eyes");
  const catWithWrySmile = e("\u{1F63C}", "Cat with Wry Smile");
  const kissingCat = e("\u{1F63D}", "Kissing Cat");
  const poutingCat = e("\u{1F63E}", "Pouting Cat");
  const cryingCat = e("\u{1F63F}", "Crying Cat");
  const wearyCat = e("\u{1F640}", "Weary Cat");
  const slightlyFrowningFace = e("\u{1F641}", "Slightly Frowning Face");
  const slightlySmilingFace = e("\u{1F642}", "Slightly Smiling Face");
  const updisdeDownFace = e("\u{1F643}", "Upside-Down Face");
  const faceWithRollingEyes = e("\u{1F644}", "Face with Rolling Eyes");
  const seeNoEvilMonkey = e("\u{1F648}", "See-No-Evil Monkey");
  const hearNoEvilMonkey = e("\u{1F649}", "Hear-No-Evil Monkey");
  const speakNoEvilMonkey = e("\u{1F64A}", "Speak-No-Evil Monkey");
  const zipperMouthFace = e("\u{1F910}", "Zipper-Mouth Face");
  const moneyMouthFace = e("\u{1F911}", "Money-Mouth Face");
  const faceWithThermometer = e("\u{1F912}", "Face with Thermometer");
  const nerdFace = e("\u{1F913}", "Nerd Face");
  const thinkingFace = e("\u{1F914}", "Thinking Face");
  const faceWithHeadBandage = e("\u{1F915}", "Face with Head-Bandage");
  const robot = e("\u{1F916}", "Robot");
  const huggingFace = e("\u{1F917}", "Hugging Face");
  const cowboyHatFace = e("\u{1F920}", "Cowboy Hat Face");
  const clownFace = e("\u{1F921}", "Clown Face");
  const nauseatedFace = e("\u{1F922}", "Nauseated Face");
  const rollingOnTheFloorLaughing = e("\u{1F923}", "Rolling on the Floor Laughing");
  const droolingFace = e("\u{1F924}", "Drooling Face");
  const lyingFace = e("\u{1F925}", "Lying Face");
  const sneezingFace = e("\u{1F927}", "Sneezing Face");
  const faceWithRaisedEyebrow = e("\u{1F928}", "Face with Raised Eyebrow");
  const starStruck = e("\u{1F929}", "Star-Struck");
  const zanyFace = e("\u{1F92A}", "Zany Face");
  const shushingFace = e("\u{1F92B}", "Shushing Face");
  const faceWithSymbolsOnMouth = e("\u{1F92C}", "Face with Symbols on Mouth");
  const faceWithHandOverMouth = e("\u{1F92D}", "Face with Hand Over Mouth");
  const faceVomitting = e("\u{1F92E}", "Face Vomiting");
  const explodingHead = e("\u{1F92F}", "Exploding Head");
  const smilingFaceWithHearts = e("\u{1F970}", "Smiling Face with Hearts");
  const yawningFace = e("\u{1F971}", "Yawning Face");
  //export const smilingFaceWithTear = e("\u{1F972}", "Smiling Face with Tear");
  const partyingFace = e("\u{1F973}", "Partying Face");
  const woozyFace = e("\u{1F974}", "Woozy Face");
  const hotFace = e("\u{1F975}", "Hot Face");
  const coldFace = e("\u{1F976}", "Cold Face");
  //export const disguisedFace = e("\u{1F978}", "Disguised Face");
  const pleadingFace = e("\u{1F97A}", "Pleading Face");
  const faceWithMonocle = e("\u{1F9D0}", "Face with Monocle");
  const skullAndCrossbones = E("\u2620", "Skull and Crossbones");
  const frowningFace = E("\u2639", "Frowning Face");
  const smilingFace = E("\u263A", "Smiling Face");
  const speakingHead = E("\u{1F5E3}", "Speaking Head");
  const bust = e("\u{1F464}", "Bust in Silhouette");
  const faces = gg("Faces", "Round emoji faces", {
      ogre,
      goblin,
      ghost,
      alien,
      alienMonster,
      angryFaceWithHorns,
      skull,
      pileOfPoo,
      grinningFace,
      beamingFaceWithSmilingEyes,
      faceWithTearsOfJoy,
      grinningFaceWithBigEyes,
      grinningFaceWithSmilingEyes,
      grinningFaceWithSweat,
      grinningSquitingFace,
      smillingFaceWithHalo,
      smilingFaceWithHorns,
      winkingFace,
      smilingFaceWithSmilingEyes,
      faceSavoringFood,
      relievedFace,
      smilingFaceWithHeartEyes,
      smilingFaceWithSunglasses,
      smirkingFace,
      neutralFace,
      expressionlessFace,
      unamusedFace,
      downcastFaceWithSweat,
      pensiveFace,
      confusedFace,
      confoundedFace,
      kissingFace,
      faceBlowingAKiss,
      kissingFaceWithSmilingEyes,
      kissingFaceWithClosedEyes,
      faceWithTongue,
      winkingFaceWithTongue,
      squintingFaceWithTongue,
      disappointedFace,
      worriedFace,
      angryFace,
      poutingFace,
      cryingFace,
      perseveringFace,
      faceWithSteamFromNose,
      sadButRelievedFace,
      frowningFaceWithOpenMouth,
      anguishedFace,
      fearfulFace,
      wearyFace,
      sleepyFace,
      tiredFace,
      grimacingFace,
      loudlyCryingFace,
      faceWithOpenMouth,
      hushedFace,
      anxiousFaceWithSweat,
      faceScreamingInFear,
      astonishedFace,
      flushedFace,
      sleepingFace,
      dizzyFace,
      faceWithoutMouth,
      faceWithMedicalMask,
      grinningCatWithSmilingEyes,
      catWithTearsOfJoy,
      grinningCat,
      smilingCatWithHeartEyes,
      catWithWrySmile,
      kissingCat,
      poutingCat,
      cryingCat,
      wearyCat,
      slightlyFrowningFace,
      slightlySmilingFace,
      updisdeDownFace,
      faceWithRollingEyes,
      seeNoEvilMonkey,
      hearNoEvilMonkey,
      speakNoEvilMonkey,
      zipperMouthFace,
      moneyMouthFace,
      faceWithThermometer,
      nerdFace,
      thinkingFace,
      faceWithHeadBandage,
      robot,
      huggingFace,
      cowboyHatFace,
      clownFace,
      nauseatedFace,
      rollingOnTheFloorLaughing,
      droolingFace,
      lyingFace,
      sneezingFace,
      faceWithRaisedEyebrow,
      starStruck,
      zanyFace,
      shushingFace,
      faceWithSymbolsOnMouth,
      faceWithHandOverMouth,
      faceVomitting,
      explodingHead,
      smilingFaceWithHearts,
      yawningFace,
      //smilingFaceWithTear,
      partyingFace,
      woozyFace,
      hotFace,
      coldFace,
      //disguisedFace,
      pleadingFace,
      faceWithMonocle,
      skullAndCrossbones,
      frowningFace,
      smilingFace,
      speakingHead,
      bust,
  });
  const kissMark = e("\u{1F48B}", "Kiss Mark");
  const loveLetter = e("\u{1F48C}", "Love Letter");
  const beatingHeart = e("\u{1F493}", "Beating Heart");
  const brokenHeart = e("\u{1F494}", "Broken Heart");
  const twoHearts = e("\u{1F495}", "Two Hearts");
  const sparklingHeart = e("\u{1F496}", "Sparkling Heart");
  const growingHeart = e("\u{1F497}", "Growing Heart");
  const heartWithArrow = e("\u{1F498}", "Heart with Arrow");
  const blueHeart = e("\u{1F499}", "Blue Heart");
  const greenHeart = e("\u{1F49A}", "Green Heart");
  const yellowHeart = e("\u{1F49B}", "Yellow Heart");
  const purpleHeart = e("\u{1F49C}", "Purple Heart");
  const heartWithRibbon = e("\u{1F49D}", "Heart with Ribbon");
  const revolvingHearts = e("\u{1F49E}", "Revolving Hearts");
  const heartDecoration = e("\u{1F49F}", "Heart Decoration");
  const blackHeart = e("\u{1F5A4}", "Black Heart");
  const whiteHeart = e("\u{1F90D}", "White Heart");
  const brownHeart = e("\u{1F90E}", "Brown Heart");
  const orangeHeart = e("\u{1F9E1}", "Orange Heart");
  const heartExclamation = E("\u2763", "Heart Exclamation");
  const redHeart = E("\u2764", "Red Heart");
  const love = gg("Love", "Hearts and kisses", {
      kissMark,
      loveLetter,
      beatingHeart,
      brokenHeart,
      twoHearts,
      sparklingHeart,
      growingHeart,
      heartWithArrow,
      blueHeart,
      greenHeart,
      yellowHeart,
      purpleHeart,
      heartWithRibbon,
      revolvingHearts,
      heartDecoration,
      blackHeart,
      whiteHeart,
      brownHeart,
      orangeHeart,
      heartExclamation,
      redHeart,
  });
  const angerSymbol = e("\u{1F4A2}", "Anger Symbol");
  const bomb = e("\u{1F4A3}", "Bomb");
  const zzz = e("\u{1F4A4}", "Zzz");
  const collision = e("\u{1F4A5}", "Collision");
  const sweatDroplets = e("\u{1F4A6}", "Sweat Droplets");
  const dashingAway = e("\u{1F4A8}", "Dashing Away");
  const dizzy = e("\u{1F4AB}", "Dizzy");
  const speechBalloon = e("\u{1F4AC}", "Speech Balloon");
  const thoughtBalloon = e("\u{1F4AD}", "Thought Balloon");
  const hundredPoints = e("\u{1F4AF}", "Hundred Points");
  const hole = E("\u{1F573}", "Hole");
  const leftSpeechBubble = E("\u{1F5E8}", "Left Speech Bubble");
  const rightSpeechBubble = E("\u{1F5E9}", "Right Speech Bubble");
  const conversationBubbles2 = E("\u{1F5EA}", "Conversation Bubbles 2");
  const conversationBubbles3 = E("\u{1F5EB}", "Conversation Bubbles 3");
  const leftThoughtBubble = E("\u{1F5EC}", "Left Thought Bubble");
  const rightThoughtBubble = E("\u{1F5ED}", "Right Thought Bubble");
  const leftAngerBubble = E("\u{1F5EE}", "Left Anger Bubble");
  const rightAngerBubble = E("\u{1F5EF}", "Right Anger Bubble");
  const angerBubble = E("\u{1F5F0}", "Anger Bubble");
  const angerBubbleLightningBolt = E("\u{1F5F1}", "Anger Bubble Lightning");
  const lightningBolt = E("\u{1F5F2}", "Lightning Bolt");
  const cartoon = g("Cartoon", "Cartoon symbols", angerSymbol, bomb, zzz, collision, sweatDroplets, dashingAway, dizzy, speechBalloon, thoughtBalloon, hundredPoints, hole, leftSpeechBubble, rightSpeechBubble, conversationBubbles2, conversationBubbles3, leftThoughtBubble, rightThoughtBubble, leftAngerBubble, rightAngerBubble, angerBubble, angerBubbleLightningBolt, lightningBolt);
  const backhandIndexPointingUp = e("\u{1F446}", "Backhand Index Pointing Up");
  const backhandIndexPointingDown = e("\u{1F447}", "Backhand Index Pointing Down");
  const backhandIndexPointingLeft = e("\u{1F448}", "Backhand Index Pointing Left");
  const backhandIndexPointingRight = e("\u{1F449}", "Backhand Index Pointing Right");
  const oncomingFist = e("\u{1F44A}", "Oncoming Fist");
  const wavingHand = e("\u{1F44B}", "Waving Hand");
  const okHand = e("\u{1F58F}", "OK Hand");
  const thumbsUp = e("\u{1F44D}", "Thumbs Up");
  const thumbsDown = e("\u{1F44E}", "Thumbs Down");
  const clappingHands = e("\u{1F44F}", "Clapping Hands");
  const openHands = e("\u{1F450}", "Open Hands");
  const nailPolish = e("\u{1F485}", "Nail Polish");
  const handsWithFingersSplayed = E("\u{1F590}", "Hand with Fingers Splayed");
  const handsWithFingersSplayed2 = E("\u{1F591}", "Hand with Fingers Splayed 2");
  const thumbsUp2 = e("\u{1F592}", "Thumbs Up 2");
  const thumbsDown2 = e("\u{1F593}", "Thumbs Down 2");
  const peaceFingers = e("\u{1F594}", "Peace Fingers");
  const middleFinger = e("\u{1F595}", "Middle Finger");
  const vulcanSalute = e("\u{1F596}", "Vulcan Salute");
  const handPointingDown = e("\u{1F597}", "Hand Pointing Down");
  const handPointingLeft = e("\u{1F598}", "Hand Pointing Left");
  const handPointingRight = e("\u{1F599}", "Hand Pointing Right");
  const handPointingLeft2 = e("\u{1F59A}", "Hand Pointing Left 2");
  const handPointingRight2 = e("\u{1F59B}", "Hand Pointing Right 2");
  const indexPointingLeft = e("\u{1F59C}", "Index Pointing Left");
  const indexPointingRight = e("\u{1F59D}", "Index Pointing Right");
  const indexPointingUp = e("\u{1F59E}", "Index Pointing Up");
  const indexPointingDown = e("\u{1F59F}", "Index Pointing Down");
  const indexPointingUp2 = e("\u{1F5A0}", "Index Pointing Up 2");
  const indexPointingDown2 = e("\u{1F5A1}", "Index Pointing Down 2");
  const indexPointingUp3 = e("\u{1F5A2}", "Index Pointing Up 3");
  const indexPointingDown3 = e("\u{1F5A3}", "Index Pointing Down 3");
  const raisingHands = e("\u{1F64C}", "Raising Hands");
  const foldedHands = e("\u{1F64F}", "Folded Hands");
  const pinchedFingers = e("\u{1F90C}", "Pinched Fingers");
  const pinchingHand = e("\u{1F90F}", "Pinching Hand");
  const signOfTheHorns = e("\u{1F918}", "Sign of the Horns");
  const callMeHand = e("\u{1F919}", "Call Me Hand");
  const rasiedBackOfHand = e("\u{1F91A}", "Raised Back of Hand");
  const leftFacingFist = e("\u{1F91B}", "Left-Facing Fist");
  const rightFacingFist = e("\u{1F91C}", "Right-Facing Fist");
  const handshake = e("\u{1F91D}", "Handshake");
  const crossedFingers = e("\u{1F91E}", "Crossed Fingers");
  const loveYouGesture = e("\u{1F91F}", "Love-You Gesture");
  const palmsUpTogether = e("\u{1F932}", "Palms Up Together");
  const indexPointingUp4 = E("\u261D", "Index Pointing Up 4");
  const raisedFist = e("\u270A", "Raised Fist");
  const raisedHand = e("\u270B", "Raised Hand");
  const victoryHand = E("\u270C", "Victory Hand");
  const writingHand = E("\u270D", "Writing Hand");
  const hands = g("Hands", "Hands pointing at things", backhandIndexPointingUp, backhandIndexPointingDown, backhandIndexPointingLeft, backhandIndexPointingRight, oncomingFist, wavingHand, okHand, thumbsUp, thumbsDown, clappingHands, openHands, nailPolish, handsWithFingersSplayed, handsWithFingersSplayed2, handsWithFingersSplayed2, thumbsUp2, thumbsDown2, peaceFingers, middleFinger, vulcanSalute, handPointingDown, handPointingLeft, handPointingRight, handPointingLeft2, handPointingRight2, indexPointingLeft, indexPointingRight, indexPointingUp, indexPointingDown, indexPointingUp2, indexPointingDown2, indexPointingUp3, indexPointingDown3, raisingHands, foldedHands, pinchedFingers, pinchingHand, signOfTheHorns, callMeHand, rasiedBackOfHand, leftFacingFist, rightFacingFist, handshake, crossedFingers, loveYouGesture, palmsUpTogether, indexPointingUp4, raisedFist, raisedHand, victoryHand, writingHand);
  const redCircle = e("\u{1F534}", "Red Circle");
  const blueCircle = e("\u{1F535}", "Blue Circle");
  const largeOrangeDiamond = e("\u{1F536}", "Large Orange Diamond");
  const largeBlueDiamond = e("\u{1F537}", "Large Blue Diamond");
  const smallOrangeDiamond = e("\u{1F538}", "Small Orange Diamond");
  const smallBlueDiamond = e("\u{1F539}", "Small Blue Diamond");
  const redTrianglePointedUp = e("\u{1F53A}", "Red Triangle Pointed Up");
  const redTrianglePointedDown = e("\u{1F53B}", "Red Triangle Pointed Down");
  const orangeCircle = e("\u{1F7E0}", "Orange Circle");
  const yellowCircle = e("\u{1F7E1}", "Yellow Circle");
  const greenCircle = e("\u{1F7E2}", "Green Circle");
  const purpleCircle = e("\u{1F7E3}", "Purple Circle");
  const brownCircle = e("\u{1F7E4}", "Brown Circle");
  const hollowRedCircle = e("\u2B55", "Hollow Red Circle");
  const whiteCircle = e("\u26AA", "White Circle");
  const blackCircle = e("\u26AB", "Black Circle");
  const redSquare = e("\u{1F7E5}", "Red Square");
  const blueSquare = e("\u{1F7E6}", "Blue Square");
  const orangeSquare = e("\u{1F7E7}", "Orange Square");
  const yellowSquare = e("\u{1F7E8}", "Yellow Square");
  const greenSquare = e("\u{1F7E9}", "Green Square");
  const purpleSquare = e("\u{1F7EA}", "Purple Square");
  const brownSquare = e("\u{1F7EB}", "Brown Square");
  const blackSquareButton = e("\u{1F532}", "Black Square Button");
  const whiteSquareButton = e("\u{1F533}", "White Square Button");
  const blackSmallSquare = E("\u25AA", "Black Small Square");
  const whiteSmallSquare = E("\u25AB", "White Small Square");
  const whiteMediumSmallSquare = e("\u25FD", "White Medium-Small Square");
  const blackMediumSmallSquare = e("\u25FE", "Black Medium-Small Square");
  const whiteMediumSquare = E("\u25FB", "White Medium Square");
  const blackMediumSquare = E("\u25FC", "Black Medium Square");
  const blackLargeSquare = e("\u2B1B", "Black Large Square");
  const whiteLargeSquare = e("\u2B1C", "White Large Square");
  const star = e("\u2B50", "Star");
  const diamondWithADot = e("\u{1F4A0}", "Diamond with a Dot");
  const shapes = g("Shapes", "Colored shapes", redCircle, blueCircle, largeOrangeDiamond, largeBlueDiamond, smallOrangeDiamond, smallBlueDiamond, redTrianglePointedUp, redTrianglePointedDown, orangeCircle, yellowCircle, greenCircle, purpleCircle, brownCircle, hollowRedCircle, whiteCircle, blackCircle, redSquare, blueSquare, orangeSquare, yellowSquare, greenSquare, purpleSquare, brownSquare, blackSquareButton, whiteSquareButton, blackSmallSquare, whiteSmallSquare, whiteMediumSmallSquare, blackMediumSmallSquare, whiteMediumSquare, blackMediumSquare, blackLargeSquare, whiteLargeSquare, star, diamondWithADot);
  const eye = E("\u{1F441}", "Eye");
  const eyeInSpeechBubble = join(eye, leftSpeechBubble, "Eye in Speech Bubble");
  const bodyParts = g("Body Parts", "General body parts", e("\u{1F440}", "Eyes"), eye, eyeInSpeechBubble, e("\u{1F442}", "Ear"), e("\u{1F443}", "Nose"), e("\u{1F444}", "Mouth"), e("\u{1F445}", "Tongue"), e("\u{1F4AA}", "Flexed Biceps"), e("\u{1F933}", "Selfie"), e("\u{1F9B4}", "Bone"), e("\u{1F9B5}", "Leg"), e("\u{1F9B6}", "Foot"), e("\u{1F9B7}", "Tooth"), e("\u{1F9BB}", "Ear with Hearing Aid"), e("\u{1F9BE}", "Mechanical Arm"), e("\u{1F9BF}", "Mechanical Leg"), e("\u{1FAC0}", "Anatomical Heart"), e("\u{1FAC1}", "Lungs"), e("\u{1F9E0}", "Brain"));
  const snowflake = E("\u2744", "Snowflake");
  const rainbow = e("\u{1F308}", "Rainbow");
  const weather = g("Weather", "Weather", e("\u{1F304}", "Sunrise Over Mountains"), e("\u{1F305}", "Sunrise"), e("\u{1F306}", "Cityscape at Dusk"), e("\u{1F307}", "Sunset"), e("\u{1F303}", "Night with Stars"), e("\u{1F302}", "Closed Umbrella"), E("\u2602", "Umbrella"), E("\u2614", "Umbrella with Rain Drops"), E("\u2603", "Snowman"), e("\u26C4", "Snowman Without Snow"), E("\u2600", "Sun"), E("\u2601", "Cloud"), E("\u{1F324}", "Sun Behind Small Cloud"), e("\u26C5", "Sun Behind Cloud"), E("\u{1F325}", "Sun Behind Large Cloud"), E("\u{1F326}", "Sun Behind Rain Cloud"), E("\u{1F327}", "Cloud with Rain"), E("\u{1F328}", "Cloud with Snow"), E("\u{1F329}", "Cloud with Lightning"), E("\u26C8", "Cloud with Lightning and Rain"), snowflake, e("\u{1F300}", "Cyclone"), E("\u{1F32A}", "Tornado"), E("\u{1F32C}", "Wind Face"), e("\u{1F30A}", "Water Wave"), E("\u{1F32B}", "Fog"), e("\u{1F301}", "Foggy"), rainbow, E("\u{1F321}", "Thermometer"));
  const cat = e("\u{1F408}", "Cat");
  const blackCat = join(cat, blackLargeSquare, "Black Cat");
  const dog = e("\u{1F415}", "Dog");
  const serviceDog = join(dog, safetyVest, "Service Dog");
  const bear = e("\u{1F43B}", "Bear");
  const polarBear = join(bear, snowflake, "Polar Bear");
  const animals = g("Animals", "Animals and insects", e("\u{1F400}", "Rat"), e("\u{1F401}", "Mouse"), e("\u{1F402}", "Ox"), e("\u{1F403}", "Water Buffalo"), e("\u{1F404}", "Cow"), e("\u{1F405}", "Tiger"), e("\u{1F406}", "Leopard"), e("\u{1F407}", "Rabbit"), cat, blackCat, e("\u{1F409}", "Dragon"), e("\u{1F40A}", "Crocodile"), e("\u{1F40B}", "Whale"), e("\u{1F40C}", "Snail"), e("\u{1F40D}", "Snake"), e("\u{1F40E}", "Horse"), e("\u{1F40F}", "Ram"), e("\u{1F410}", "Goat"), e("\u{1F411}", "Ewe"), e("\u{1F412}", "Monkey"), e("\u{1F413}", "Rooster"), e("\u{1F414}", "Chicken"), dog, serviceDog, e("\u{1F416}", "Pig"), e("\u{1F417}", "Boar"), e("\u{1F418}", "Elephant"), e("\u{1F419}", "Octopus"), e("\u{1F41A}", "Spiral Shell"), e("\u{1F41B}", "Bug"), e("\u{1F41C}", "Ant"), e("\u{1F41D}", "Honeybee"), e("\u{1F41E}", "Lady Beetle"), e("\u{1F41F}", "Fish"), e("\u{1F420}", "Tropical Fish"), e("\u{1F421}", "Blowfish"), e("\u{1F422}", "Turtle"), e("\u{1F423}", "Hatching Chick"), e("\u{1F424}", "Baby Chick"), e("\u{1F425}", "Front-Facing Baby Chick"), e("\u{1F426}", "Bird"), e("\u{1F427}", "Penguin"), e("\u{1F428}", "Koala"), e("\u{1F429}", "Poodle"), e("\u{1F42A}", "Camel"), e("\u{1F42B}", "Two-Hump Camel"), e("\u{1F42C}", "Dolphin"), e("\u{1F42D}", "Mouse Face"), e("\u{1F42E}", "Cow Face"), e("\u{1F42F}", "Tiger Face"), e("\u{1F430}", "Rabbit Face"), e("\u{1F431}", "Cat Face"), e("\u{1F432}", "Dragon Face"), e("\u{1F433}", "Spouting Whale"), e("\u{1F434}", "Horse Face"), e("\u{1F435}", "Monkey Face"), e("\u{1F436}", "Dog Face"), e("\u{1F437}", "Pig Face"), e("\u{1F438}", "Frog"), e("\u{1F439}", "Hamster"), e("\u{1F43A}", "Wolf"), bear, polarBear, e("\u{1F43C}", "Panda"), e("\u{1F43D}", "Pig Nose"), e("\u{1F43E}", "Paw Prints"), E("\u{1F43F}", "Chipmunk"), E("\u{1F54A}", "Dove"), E("\u{1F577}", "Spider"), E("\u{1F578}", "Spider Web"), e("\u{1F981}", "Lion"), e("\u{1F982}", "Scorpion"), e("\u{1F983}", "Turkey"), e("\u{1F984}", "Unicorn"), e("\u{1F985}", "Eagle"), e("\u{1F986}", "Duck"), e("\u{1F987}", "Bat"), e("\u{1F988}", "Shark"), e("\u{1F989}", "Owl"), e("\u{1F98A}", "Fox"), e("\u{1F98B}", "Butterfly"), e("\u{1F98C}", "Deer"), e("\u{1F98D}", "Gorilla"), e("\u{1F98E}", "Lizard"), e("\u{1F98F}", "Rhinoceros"), e("\u{1F992}", "Giraffe"), e("\u{1F993}", "Zebra"), e("\u{1F994}", "Hedgehog"), e("\u{1F995}", "Sauropod"), e("\u{1F996}", "T-Rex"), e("\u{1F997}", "Cricket"), e("\u{1F998}", "Kangaroo"), e("\u{1F999}", "Llama"), e("\u{1F99A}", "Peacock"), e("\u{1F99B}", "Hippopotamus"), e("\u{1F99C}", "Parrot"), e("\u{1F99D}", "Raccoon"), e("\u{1F99F}", "Mosquito"), e("\u{1F9A0}", "Microbe"), e("\u{1F9A1}", "Badger"), e("\u{1F9A2}", "Swan"), 
  //e("\u{1F9A3}", "Mammoth"),
  //e("\u{1F9A4}", "Dodo"),
  e("\u{1F9A5}", "Sloth"), e("\u{1F9A6}", "Otter"), e("\u{1F9A7}", "Orangutan"), e("\u{1F9A8}", "Skunk"), e("\u{1F9A9}", "Flamingo"), 
  //e("\u{1F9AB}", "Beaver"),
  //e("\u{1F9AC}", "Bison"),
  //e("\u{1F9AD}", "Seal"),
  //e("\u{1FAB0}", "Fly"),
  //e("\u{1FAB1}", "Worm"),
  //e("\u{1FAB2}", "Beetle"),
  //e("\u{1FAB3}", "Cockroach"),
  //e("\u{1FAB6}", "Feather"),
  e("\u{1F9AE}", "Guide Dog"));
  const whiteFlower = e("\u{1F4AE}", "White Flower");
  const plants = g("Plants", "Flowers, trees, and things", e("\u{1F331}", "Seedling"), e("\u{1F332}", "Evergreen Tree"), e("\u{1F333}", "Deciduous Tree"), e("\u{1F334}", "Palm Tree"), e("\u{1F335}", "Cactus"), e("\u{1F337}", "Tulip"), e("\u{1F338}", "Cherry Blossom"), e("\u{1F339}", "Rose"), e("\u{1F33A}", "Hibiscus"), e("\u{1F33B}", "Sunflower"), e("\u{1F33C}", "Blossom"), sheafOfRice, e("\u{1F33F}", "Herb"), e("\u{1F340}", "Four Leaf Clover"), e("\u{1F341}", "Maple Leaf"), e("\u{1F342}", "Fallen Leaf"), e("\u{1F343}", "Leaf Fluttering in Wind"), E("\u{1F3F5}", "Rosette"), e("\u{1F490}", "Bouquet"), whiteFlower, e("\u{1F940}", "Wilted Flower"), 
  //e("\u{1FAB4}", "Potted Plant"),
  E("\u2618", "Shamrock"));
  const banana = e("\u{1F34C}", "Banana");
  const food = g("Food", "Food, drink, and utensils", e("\u{1F32D}", "Hot Dog"), e("\u{1F32E}", "Taco"), e("\u{1F32F}", "Burrito"), e("\u{1F330}", "Chestnut"), E("\u{1F336}", "Hot Pepper"), e("\u{1F33D}", "Ear of Corn"), e("\u{1F344}", "Mushroom"), e("\u{1F345}", "Tomato"), e("\u{1F346}", "Eggplant"), e("\u{1F347}", "Grapes"), e("\u{1F348}", "Melon"), e("\u{1F349}", "Watermelon"), e("\u{1F34A}", "Tangerine"), e("\u{1F34B}", "Lemon"), banana, e("\u{1F34D}", "Pineapple"), e("\u{1F34E}", "Red Apple"), e("\u{1F34F}", "Green Apple"), e("\u{1F350}", "Pear"), e("\u{1F351}", "Peach"), e("\u{1F352}", "Cherries"), e("\u{1F353}", "Strawberry"), e("\u{1F354}", "Hamburger"), e("\u{1F355}", "Pizza"), e("\u{1F356}", "Meat on Bone"), e("\u{1F357}", "Poultry Leg"), e("\u{1F358}", "Rice Cracker"), e("\u{1F359}", "Rice Ball"), e("\u{1F35A}", "Cooked Rice"), e("\u{1F35B}", "Curry Rice"), e("\u{1F35C}", "Steaming Bowl"), e("\u{1F35D}", "Spaghetti"), e("\u{1F35E}", "Bread"), e("\u{1F35F}", "French Fries"), e("\u{1F360}", "Roasted Sweet Potato"), e("\u{1F361}", "Dango"), e("\u{1F362}", "Oden"), e("\u{1F363}", "Sushi"), e("\u{1F364}", "Fried Shrimp"), e("\u{1F365}", "Fish Cake with Swirl"), e("\u{1F371}", "Bento Box"), e("\u{1F372}", "Pot of Food"), cooking, e("\u{1F37F}", "Popcorn"), e("\u{1F950}", "Croissant"), e("\u{1F951}", "Avocado"), e("\u{1F952}", "Cucumber"), e("\u{1F953}", "Bacon"), e("\u{1F954}", "Potato"), e("\u{1F955}", "Carrot"), e("\u{1F956}", "Baguette Bread"), e("\u{1F957}", "Green Salad"), e("\u{1F958}", "Shallow Pan of Food"), e("\u{1F959}", "Stuffed Flatbread"), e("\u{1F95A}", "Egg"), e("\u{1F95C}", "Peanuts"), e("\u{1F95D}", "Kiwi Fruit"), e("\u{1F95E}", "Pancakes"), e("\u{1F95F}", "Dumpling"), e("\u{1F960}", "Fortune Cookie"), e("\u{1F961}", "Takeout Box"), e("\u{1F963}", "Bowl with Spoon"), e("\u{1F965}", "Coconut"), e("\u{1F966}", "Broccoli"), e("\u{1F968}", "Pretzel"), e("\u{1F969}", "Cut of Meat"), e("\u{1F96A}", "Sandwich"), e("\u{1F96B}", "Canned Food"), e("\u{1F96C}", "Leafy Green"), e("\u{1F96D}", "Mango"), e("\u{1F96E}", "Moon Cake"), e("\u{1F96F}", "Bagel"), e("\u{1F980}", "Crab"), e("\u{1F990}", "Shrimp"), e("\u{1F991}", "Squid"), e("\u{1F99E}", "Lobster"), e("\u{1F9AA}", "Oyster"), e("\u{1F9C0}", "Cheese Wedge"), e("\u{1F9C2}", "Salt"), e("\u{1F9C4}", "Garlic"), e("\u{1F9C5}", "Onion"), e("\u{1F9C6}", "Falafel"), e("\u{1F9C7}", "Waffle"), e("\u{1F9C8}", "Butter"), 
  //e("\u{1FAD0}", "Blueberries"),
  //e("\u{1FAD1}", "Bell Pepper"),
  //e("\u{1FAD2}", "Olive"),
  //e("\u{1FAD3}", "Flatbread"),
  //e("\u{1FAD4}", "Tamale"),
  //e("\u{1FAD5}", "Fondue"),
  e("\u{1F366}", "Soft Ice Cream"), e("\u{1F367}", "Shaved Ice"), e("\u{1F368}", "Ice Cream"), e("\u{1F369}", "Doughnut"), e("\u{1F36A}", "Cookie"), e("\u{1F36B}", "Chocolate Bar"), e("\u{1F36C}", "Candy"), e("\u{1F36D}", "Lollipop"), e("\u{1F36E}", "Custard"), e("\u{1F36F}", "Honey Pot"), e("\u{1F370}", "Shortcake"), e("\u{1F382}", "Birthday Cake"), e("\u{1F967}", "Pie"), e("\u{1F9C1}", "Cupcake"), e("\u{1F375}", "Teacup Without Handle"), e("\u{1F376}", "Sake"), e("\u{1F377}", "Wine Glass"), e("\u{1F378}", "Cocktail Glass"), e("\u{1F379}", "Tropical Drink"), e("\u{1F37A}", "Beer Mug"), e("\u{1F37B}", "Clinking Beer Mugs"), e("\u{1F37C}", "Baby Bottle"), e("\u{1F37E}", "Bottle with Popping Cork"), e("\u{1F942}", "Clinking Glasses"), e("\u{1F943}", "Tumbler Glass"), e("\u{1F95B}", "Glass of Milk"), e("\u{1F964}", "Cup with Straw"), e("\u{1F9C3}", "Beverage Box"), e("\u{1F9C9}", "Mate"), e("\u{1F9CA}", "Ice"), 
  //e("\u{1F9CB}", "Bubble Tea"),
  //e("\u{1FAD6}", "Teapot"),
  e("\u2615", "Hot Beverage"), e("\u{1F374}", "Fork and Knife"), E("\u{1F37D}", "Fork and Knife with Plate"), e("\u{1F3FA}", "Amphora"), e("\u{1F52A}", "Kitchen Knife"), e("\u{1F944}", "Spoon"), e("\u{1F962}", "Chopsticks"));
  const nations = g("National Flags", "Flags of countries from around the world", e("\u{1F1E6}\u{1F1E8}", "Flag: Ascension Island"), e("\u{1F1E6}\u{1F1E9}", "Flag: Andorra"), e("\u{1F1E6}\u{1F1EA}", "Flag: United Arab Emirates"), e("\u{1F1E6}\u{1F1EB}", "Flag: Afghanistan"), e("\u{1F1E6}\u{1F1EC}", "Flag: Antigua & Barbuda"), e("\u{1F1E6}\u{1F1EE}", "Flag: Anguilla"), e("\u{1F1E6}\u{1F1F1}", "Flag: Albania"), e("\u{1F1E6}\u{1F1F2}", "Flag: Armenia"), e("\u{1F1E6}\u{1F1F4}", "Flag: Angola"), e("\u{1F1E6}\u{1F1F6}", "Flag: Antarctica"), e("\u{1F1E6}\u{1F1F7}", "Flag: Argentina"), e("\u{1F1E6}\u{1F1F8}", "Flag: American Samoa"), e("\u{1F1E6}\u{1F1F9}", "Flag: Austria"), e("\u{1F1E6}\u{1F1FA}", "Flag: Australia"), e("\u{1F1E6}\u{1F1FC}", "Flag: Aruba"), e("\u{1F1E6}\u{1F1FD}", "Flag: Åland Islands"), e("\u{1F1E6}\u{1F1FF}", "Flag: Azerbaijan"), e("\u{1F1E7}\u{1F1E6}", "Flag: Bosnia & Herzegovina"), e("\u{1F1E7}\u{1F1E7}", "Flag: Barbados"), e("\u{1F1E7}\u{1F1E9}", "Flag: Bangladesh"), e("\u{1F1E7}\u{1F1EA}", "Flag: Belgium"), e("\u{1F1E7}\u{1F1EB}", "Flag: Burkina Faso"), e("\u{1F1E7}\u{1F1EC}", "Flag: Bulgaria"), e("\u{1F1E7}\u{1F1ED}", "Flag: Bahrain"), e("\u{1F1E7}\u{1F1EE}", "Flag: Burundi"), e("\u{1F1E7}\u{1F1EF}", "Flag: Benin"), e("\u{1F1E7}\u{1F1F1}", "Flag: St. Barthélemy"), e("\u{1F1E7}\u{1F1F2}", "Flag: Bermuda"), e("\u{1F1E7}\u{1F1F3}", "Flag: Brunei"), e("\u{1F1E7}\u{1F1F4}", "Flag: Bolivia"), e("\u{1F1E7}\u{1F1F6}", "Flag: Caribbean Netherlands"), e("\u{1F1E7}\u{1F1F7}", "Flag: Brazil"), e("\u{1F1E7}\u{1F1F8}", "Flag: Bahamas"), e("\u{1F1E7}\u{1F1F9}", "Flag: Bhutan"), e("\u{1F1E7}\u{1F1FB}", "Flag: Bouvet Island"), e("\u{1F1E7}\u{1F1FC}", "Flag: Botswana"), e("\u{1F1E7}\u{1F1FE}", "Flag: Belarus"), e("\u{1F1E7}\u{1F1FF}", "Flag: Belize"), e("\u{1F1E8}\u{1F1E6}", "Flag: Canada"), e("\u{1F1E8}\u{1F1E8}", "Flag: Cocos (Keeling) Islands"), e("\u{1F1E8}\u{1F1E9}", "Flag: Congo - Kinshasa"), e("\u{1F1E8}\u{1F1EB}", "Flag: Central African Republic"), e("\u{1F1E8}\u{1F1EC}", "Flag: Congo - Brazzaville"), e("\u{1F1E8}\u{1F1ED}", "Flag: Switzerland"), e("\u{1F1E8}\u{1F1EE}", "Flag: Côte d’Ivoire"), e("\u{1F1E8}\u{1F1F0}", "Flag: Cook Islands"), e("\u{1F1E8}\u{1F1F1}", "Flag: Chile"), e("\u{1F1E8}\u{1F1F2}", "Flag: Cameroon"), e("\u{1F1E8}\u{1F1F3}", "Flag: China"), e("\u{1F1E8}\u{1F1F4}", "Flag: Colombia"), e("\u{1F1E8}\u{1F1F5}", "Flag: Clipperton Island"), e("\u{1F1E8}\u{1F1F7}", "Flag: Costa Rica"), e("\u{1F1E8}\u{1F1FA}", "Flag: Cuba"), e("\u{1F1E8}\u{1F1FB}", "Flag: Cape Verde"), e("\u{1F1E8}\u{1F1FC}", "Flag: Curaçao"), e("\u{1F1E8}\u{1F1FD}", "Flag: Christmas Island"), e("\u{1F1E8}\u{1F1FE}", "Flag: Cyprus"), e("\u{1F1E8}\u{1F1FF}", "Flag: Czechia"), e("\u{1F1E9}\u{1F1EA}", "Flag: Germany"), e("\u{1F1E9}\u{1F1EC}", "Flag: Diego Garcia"), e("\u{1F1E9}\u{1F1EF}", "Flag: Djibouti"), e("\u{1F1E9}\u{1F1F0}", "Flag: Denmark"), e("\u{1F1E9}\u{1F1F2}", "Flag: Dominica"), e("\u{1F1E9}\u{1F1F4}", "Flag: Dominican Republic"), e("\u{1F1E9}\u{1F1FF}", "Flag: Algeria"), e("\u{1F1EA}\u{1F1E6}", "Flag: Ceuta & Melilla"), e("\u{1F1EA}\u{1F1E8}", "Flag: Ecuador"), e("\u{1F1EA}\u{1F1EA}", "Flag: Estonia"), e("\u{1F1EA}\u{1F1EC}", "Flag: Egypt"), e("\u{1F1EA}\u{1F1ED}", "Flag: Western Sahara"), e("\u{1F1EA}\u{1F1F7}", "Flag: Eritrea"), e("\u{1F1EA}\u{1F1F8}", "Flag: Spain"), e("\u{1F1EA}\u{1F1F9}", "Flag: Ethiopia"), e("\u{1F1EA}\u{1F1FA}", "Flag: European Union"), e("\u{1F1EB}\u{1F1EE}", "Flag: Finland"), e("\u{1F1EB}\u{1F1EF}", "Flag: Fiji"), e("\u{1F1EB}\u{1F1F0}", "Flag: Falkland Islands"), e("\u{1F1EB}\u{1F1F2}", "Flag: Micronesia"), e("\u{1F1EB}\u{1F1F4}", "Flag: Faroe Islands"), e("\u{1F1EB}\u{1F1F7}", "Flag: France"), e("\u{1F1EC}\u{1F1E6}", "Flag: Gabon"), e("\u{1F1EC}\u{1F1E7}", "Flag: United Kingdom"), e("\u{1F1EC}\u{1F1E9}", "Flag: Grenada"), e("\u{1F1EC}\u{1F1EA}", "Flag: Georgia"), e("\u{1F1EC}\u{1F1EB}", "Flag: French Guiana"), e("\u{1F1EC}\u{1F1EC}", "Flag: Guernsey"), e("\u{1F1EC}\u{1F1ED}", "Flag: Ghana"), e("\u{1F1EC}\u{1F1EE}", "Flag: Gibraltar"), e("\u{1F1EC}\u{1F1F1}", "Flag: Greenland"), e("\u{1F1EC}\u{1F1F2}", "Flag: Gambia"), e("\u{1F1EC}\u{1F1F3}", "Flag: Guinea"), e("\u{1F1EC}\u{1F1F5}", "Flag: Guadeloupe"), e("\u{1F1EC}\u{1F1F6}", "Flag: Equatorial Guinea"), e("\u{1F1EC}\u{1F1F7}", "Flag: Greece"), e("\u{1F1EC}\u{1F1F8}", "Flag: South Georgia & South Sandwich Islands"), e("\u{1F1EC}\u{1F1F9}", "Flag: Guatemala"), e("\u{1F1EC}\u{1F1FA}", "Flag: Guam"), e("\u{1F1EC}\u{1F1FC}", "Flag: Guinea-Bissau"), e("\u{1F1EC}\u{1F1FE}", "Flag: Guyana"), e("\u{1F1ED}\u{1F1F0}", "Flag: Hong Kong SAR China"), e("\u{1F1ED}\u{1F1F2}", "Flag: Heard & McDonald Islands"), e("\u{1F1ED}\u{1F1F3}", "Flag: Honduras"), e("\u{1F1ED}\u{1F1F7}", "Flag: Croatia"), e("\u{1F1ED}\u{1F1F9}", "Flag: Haiti"), e("\u{1F1ED}\u{1F1FA}", "Flag: Hungary"), e("\u{1F1EE}\u{1F1E8}", "Flag: Canary Islands"), e("\u{1F1EE}\u{1F1E9}", "Flag: Indonesia"), e("\u{1F1EE}\u{1F1EA}", "Flag: Ireland"), e("\u{1F1EE}\u{1F1F1}", "Flag: Israel"), e("\u{1F1EE}\u{1F1F2}", "Flag: Isle of Man"), e("\u{1F1EE}\u{1F1F3}", "Flag: India"), e("\u{1F1EE}\u{1F1F4}", "Flag: British Indian Ocean Territory"), e("\u{1F1EE}\u{1F1F6}", "Flag: Iraq"), e("\u{1F1EE}\u{1F1F7}", "Flag: Iran"), e("\u{1F1EE}\u{1F1F8}", "Flag: Iceland"), e("\u{1F1EE}\u{1F1F9}", "Flag: Italy"), e("\u{1F1EF}\u{1F1EA}", "Flag: Jersey"), e("\u{1F1EF}\u{1F1F2}", "Flag: Jamaica"), e("\u{1F1EF}\u{1F1F4}", "Flag: Jordan"), e("\u{1F1EF}\u{1F1F5}", "Flag: Japan"), e("\u{1F1F0}\u{1F1EA}", "Flag: Kenya"), e("\u{1F1F0}\u{1F1EC}", "Flag: Kyrgyzstan"), e("\u{1F1F0}\u{1F1ED}", "Flag: Cambodia"), e("\u{1F1F0}\u{1F1EE}", "Flag: Kiribati"), e("\u{1F1F0}\u{1F1F2}", "Flag: Comoros"), e("\u{1F1F0}\u{1F1F3}", "Flag: St. Kitts & Nevis"), e("\u{1F1F0}\u{1F1F5}", "Flag: North Korea"), e("\u{1F1F0}\u{1F1F7}", "Flag: South Korea"), e("\u{1F1F0}\u{1F1FC}", "Flag: Kuwait"), e("\u{1F1F0}\u{1F1FE}", "Flag: Cayman Islands"), e("\u{1F1F0}\u{1F1FF}", "Flag: Kazakhstan"), e("\u{1F1F1}\u{1F1E6}", "Flag: Laos"), e("\u{1F1F1}\u{1F1E7}", "Flag: Lebanon"), e("\u{1F1F1}\u{1F1E8}", "Flag: St. Lucia"), e("\u{1F1F1}\u{1F1EE}", "Flag: Liechtenstein"), e("\u{1F1F1}\u{1F1F0}", "Flag: Sri Lanka"), e("\u{1F1F1}\u{1F1F7}", "Flag: Liberia"), e("\u{1F1F1}\u{1F1F8}", "Flag: Lesotho"), e("\u{1F1F1}\u{1F1F9}", "Flag: Lithuania"), e("\u{1F1F1}\u{1F1FA}", "Flag: Luxembourg"), e("\u{1F1F1}\u{1F1FB}", "Flag: Latvia"), e("\u{1F1F1}\u{1F1FE}", "Flag: Libya"), e("\u{1F1F2}\u{1F1E6}", "Flag: Morocco"), e("\u{1F1F2}\u{1F1E8}", "Flag: Monaco"), e("\u{1F1F2}\u{1F1E9}", "Flag: Moldova"), e("\u{1F1F2}\u{1F1EA}", "Flag: Montenegro"), e("\u{1F1F2}\u{1F1EB}", "Flag: St. Martin"), e("\u{1F1F2}\u{1F1EC}", "Flag: Madagascar"), e("\u{1F1F2}\u{1F1ED}", "Flag: Marshall Islands"), e("\u{1F1F2}\u{1F1F0}", "Flag: North Macedonia"), e("\u{1F1F2}\u{1F1F1}", "Flag: Mali"), e("\u{1F1F2}\u{1F1F2}", "Flag: Myanmar (Burma)"), e("\u{1F1F2}\u{1F1F3}", "Flag: Mongolia"), e("\u{1F1F2}\u{1F1F4}", "Flag: Macao Sar China"), e("\u{1F1F2}\u{1F1F5}", "Flag: Northern Mariana Islands"), e("\u{1F1F2}\u{1F1F6}", "Flag: Martinique"), e("\u{1F1F2}\u{1F1F7}", "Flag: Mauritania"), e("\u{1F1F2}\u{1F1F8}", "Flag: Montserrat"), e("\u{1F1F2}\u{1F1F9}", "Flag: Malta"), e("\u{1F1F2}\u{1F1FA}", "Flag: Mauritius"), e("\u{1F1F2}\u{1F1FB}", "Flag: Maldives"), e("\u{1F1F2}\u{1F1FC}", "Flag: Malawi"), e("\u{1F1F2}\u{1F1FD}", "Flag: Mexico"), e("\u{1F1F2}\u{1F1FE}", "Flag: Malaysia"), e("\u{1F1F2}\u{1F1FF}", "Flag: Mozambique"), e("\u{1F1F3}\u{1F1E6}", "Flag: Namibia"), e("\u{1F1F3}\u{1F1E8}", "Flag: New Caledonia"), e("\u{1F1F3}\u{1F1EA}", "Flag: Niger"), e("\u{1F1F3}\u{1F1EB}", "Flag: Norfolk Island"), e("\u{1F1F3}\u{1F1EC}", "Flag: Nigeria"), e("\u{1F1F3}\u{1F1EE}", "Flag: Nicaragua"), e("\u{1F1F3}\u{1F1F1}", "Flag: Netherlands"), e("\u{1F1F3}\u{1F1F4}", "Flag: Norway"), e("\u{1F1F3}\u{1F1F5}", "Flag: Nepal"), e("\u{1F1F3}\u{1F1F7}", "Flag: Nauru"), e("\u{1F1F3}\u{1F1FA}", "Flag: Niue"), e("\u{1F1F3}\u{1F1FF}", "Flag: New Zealand"), e("\u{1F1F4}\u{1F1F2}", "Flag: Oman"), e("\u{1F1F5}\u{1F1E6}", "Flag: Panama"), e("\u{1F1F5}\u{1F1EA}", "Flag: Peru"), e("\u{1F1F5}\u{1F1EB}", "Flag: French Polynesia"), e("\u{1F1F5}\u{1F1EC}", "Flag: Papua New Guinea"), e("\u{1F1F5}\u{1F1ED}", "Flag: Philippines"), e("\u{1F1F5}\u{1F1F0}", "Flag: Pakistan"), e("\u{1F1F5}\u{1F1F1}", "Flag: Poland"), e("\u{1F1F5}\u{1F1F2}", "Flag: St. Pierre & Miquelon"), e("\u{1F1F5}\u{1F1F3}", "Flag: Pitcairn Islands"), e("\u{1F1F5}\u{1F1F7}", "Flag: Puerto Rico"), e("\u{1F1F5}\u{1F1F8}", "Flag: Palestinian Territories"), e("\u{1F1F5}\u{1F1F9}", "Flag: Portugal"), e("\u{1F1F5}\u{1F1FC}", "Flag: Palau"), e("\u{1F1F5}\u{1F1FE}", "Flag: Paraguay"), e("\u{1F1F6}\u{1F1E6}", "Flag: Qatar"), e("\u{1F1F7}\u{1F1EA}", "Flag: Réunion"), e("\u{1F1F7}\u{1F1F4}", "Flag: Romania"), e("\u{1F1F7}\u{1F1F8}", "Flag: Serbia"), e("\u{1F1F7}\u{1F1FA}", "Flag: Russia"), e("\u{1F1F7}\u{1F1FC}", "Flag: Rwanda"), e("\u{1F1F8}\u{1F1E6}", "Flag: Saudi Arabia"), e("\u{1F1F8}\u{1F1E7}", "Flag: Solomon Islands"), e("\u{1F1F8}\u{1F1E8}", "Flag: Seychelles"), e("\u{1F1F8}\u{1F1E9}", "Flag: Sudan"), e("\u{1F1F8}\u{1F1EA}", "Flag: Sweden"), e("\u{1F1F8}\u{1F1EC}", "Flag: Singapore"), e("\u{1F1F8}\u{1F1ED}", "Flag: St. Helena"), e("\u{1F1F8}\u{1F1EE}", "Flag: Slovenia"), e("\u{1F1F8}\u{1F1EF}", "Flag: Svalbard & Jan Mayen"), e("\u{1F1F8}\u{1F1F0}", "Flag: Slovakia"), e("\u{1F1F8}\u{1F1F1}", "Flag: Sierra Leone"), e("\u{1F1F8}\u{1F1F2}", "Flag: San Marino"), e("\u{1F1F8}\u{1F1F3}", "Flag: Senegal"), e("\u{1F1F8}\u{1F1F4}", "Flag: Somalia"), e("\u{1F1F8}\u{1F1F7}", "Flag: Suriname"), e("\u{1F1F8}\u{1F1F8}", "Flag: South Sudan"), e("\u{1F1F8}\u{1F1F9}", "Flag: São Tomé & Príncipe"), e("\u{1F1F8}\u{1F1FB}", "Flag: El Salvador"), e("\u{1F1F8}\u{1F1FD}", "Flag: Sint Maarten"), e("\u{1F1F8}\u{1F1FE}", "Flag: Syria"), e("\u{1F1F8}\u{1F1FF}", "Flag: Eswatini"), e("\u{1F1F9}\u{1F1E6}", "Flag: Tristan Da Cunha"), e("\u{1F1F9}\u{1F1E8}", "Flag: Turks & Caicos Islands"), e("\u{1F1F9}\u{1F1E9}", "Flag: Chad"), e("\u{1F1F9}\u{1F1EB}", "Flag: French Southern Territories"), e("\u{1F1F9}\u{1F1EC}", "Flag: Togo"), e("\u{1F1F9}\u{1F1ED}", "Flag: Thailand"), e("\u{1F1F9}\u{1F1EF}", "Flag: Tajikistan"), e("\u{1F1F9}\u{1F1F0}", "Flag: Tokelau"), e("\u{1F1F9}\u{1F1F1}", "Flag: Timor-Leste"), e("\u{1F1F9}\u{1F1F2}", "Flag: Turkmenistan"), e("\u{1F1F9}\u{1F1F3}", "Flag: Tunisia"), e("\u{1F1F9}\u{1F1F4}", "Flag: Tonga"), e("\u{1F1F9}\u{1F1F7}", "Flag: Turkey"), e("\u{1F1F9}\u{1F1F9}", "Flag: Trinidad & Tobago"), e("\u{1F1F9}\u{1F1FB}", "Flag: Tuvalu"), e("\u{1F1F9}\u{1F1FC}", "Flag: Taiwan"), e("\u{1F1F9}\u{1F1FF}", "Flag: Tanzania"), e("\u{1F1FA}\u{1F1E6}", "Flag: Ukraine"), e("\u{1F1FA}\u{1F1EC}", "Flag: Uganda"), e("\u{1F1FA}\u{1F1F2}", "Flag: U.S. Outlying Islands"), e("\u{1F1FA}\u{1F1F3}", "Flag: United Nations"), e("\u{1F1FA}\u{1F1F8}", "Flag: United States"), e("\u{1F1FA}\u{1F1FE}", "Flag: Uruguay"), e("\u{1F1FA}\u{1F1FF}", "Flag: Uzbekistan"), e("\u{1F1FB}\u{1F1E6}", "Flag: Vatican City"), e("\u{1F1FB}\u{1F1E8}", "Flag: St. Vincent & Grenadines"), e("\u{1F1FB}\u{1F1EA}", "Flag: Venezuela"), e("\u{1F1FB}\u{1F1EC}", "Flag: British Virgin Islands"), e("\u{1F1FB}\u{1F1EE}", "Flag: U.S. Virgin Islands"), e("\u{1F1FB}\u{1F1F3}", "Flag: Vietnam"), e("\u{1F1FB}\u{1F1FA}", "Flag: Vanuatu"), e("\u{1F1FC}\u{1F1EB}", "Flag: Wallis & Futuna"), e("\u{1F1FC}\u{1F1F8}", "Flag: Samoa"), e("\u{1F1FD}\u{1F1F0}", "Flag: Kosovo"), e("\u{1F1FE}\u{1F1EA}", "Flag: Yemen"), e("\u{1F1FE}\u{1F1F9}", "Flag: Mayotte"), e("\u{1F1FF}\u{1F1E6}", "Flag: South Africa"), e("\u{1F1FF}\u{1F1F2}", "Flag: Zambia"), e("\u{1F1FF}\u{1F1FC}", "Flag: Zimbabwe"));
  const whiteFlag = E("\u{1F3F3}", "White Flag");
  const rainbowFlag = join(whiteFlag, rainbow, "Rainbow Flag");
  const transgenderFlag = join(whiteFlag, transgender, "Transgender Flag");
  const blackFlag = e("\u{1F3F4}", "Black Flag");
  const pirateFlag = join(blackFlag, skullAndCrossbones, "Pirate Flag");
  const flags = g("Flags", "Basic flags", e("\u{1F38C}", "Crossed Flags"), e("\u{1F3C1}", "Chequered Flag"), whiteFlag, rainbowFlag, transgenderFlag, blackFlag, pirateFlag, e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England"), e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland"), e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales"), e("\u{1F6A9}", "Triangular Flag"));
  const motorcycle = E("\u{1F3CD}", "Motorcycle");
  const racingCar = E("\u{1F3CE}", "Racing Car");
  const seat = e("\u{1F4BA}", "Seat");
  const helicopter = e("\u{1F681}", "Helicopter");
  const locomotive = e("\u{1F682}", "Locomotive");
  const railwayCar = e("\u{1F683}", "Railway Car");
  const highspeedTrain = e("\u{1F684}", "High-Speed Train");
  const bulletTrain = e("\u{1F685}", "Bullet Train");
  const train = e("\u{1F686}", "Train");
  const metro = e("\u{1F687}", "Metro");
  const lightRail = e("\u{1F688}", "Light Rail");
  const station = e("\u{1F689}", "Station");
  const tram = e("\u{1F68A}", "Tram");
  const tramCar = e("\u{1F68B}", "Tram Car");
  const bus = e("\u{1F68C}", "Bus");
  const oncomingBus = e("\u{1F68D}", "Oncoming Bus");
  const trolleyBus = e("\u{1F68E}", "Trolleybus");
  const busStop = e("\u{1F68F}", "Bus Stop");
  const miniBus = e("\u{1F690}", "Minibus");
  const ambulance = e("\u{1F691}", "Ambulance");
  const taxi = e("\u{1F695}", "Taxi");
  const oncomingTaxi = e("\u{1F696}", "Oncoming Taxi");
  const automobile = e("\u{1F697}", "Automobile");
  const oncomingAutomobile = e("\u{1F698}", "Oncoming Automobile");
  const sportUtilityVehicle = e("\u{1F699}", "Sport Utility Vehicle");
  const deliveryTruck = e("\u{1F69A}", "Delivery Truck");
  const articulatedLorry = e("\u{1F69B}", "Articulated Lorry");
  const tractor = e("\u{1F69C}", "Tractor");
  const monorail = e("\u{1F69D}", "Monorail");
  const mountainRailway = e("\u{1F69E}", "Mountain Railway");
  const suspensionRailway = e("\u{1F69F}", "Suspension Railway");
  const mountainCableway = e("\u{1F6A0}", "Mountain Cableway");
  const aerialTramway = e("\u{1F6A1}", "Aerial Tramway");
  const ship = e("\u{1F6A2}", "Ship");
  const speedBoat = e("\u{1F6A4}", "Speedboat");
  const horizontalTrafficLight = e("\u{1F6A5}", "Horizontal Traffic Light");
  const verticalTrafficLight = e("\u{1F6A6}", "Vertical Traffic Light");
  const construction = e("\u{1F6A7}", "Construction");
  const bicycle = e("\u{1F6B2}", "Bicycle");
  const stopSign = e("\u{1F6D1}", "Stop Sign");
  const oilDrum = E("\u{1F6E2}", "Oil Drum");
  const motorway = E("\u{1F6E3}", "Motorway");
  const railwayTrack = E("\u{1F6E4}", "Railway Track");
  const motorBoat = E("\u{1F6E5}", "Motor Boat");
  const smallAirplane = E("\u{1F6E9}", "Small Airplane");
  const airplaneDeparture = e("\u{1F6EB}", "Airplane Departure");
  const airplaneArrival = e("\u{1F6EC}", "Airplane Arrival");
  const satellite = E("\u{1F6F0}", "Satellite");
  const passengerShip = E("\u{1F6F3}", "Passenger Ship");
  const kickScooter = e("\u{1F6F4}", "Kick Scooter");
  const motorScooter = e("\u{1F6F5}", "Motor Scooter");
  const canoe = e("\u{1F6F6}", "Canoe");
  const flyingSaucer = e("\u{1F6F8}", "Flying Saucer");
  const skateboard = e("\u{1F6F9}", "Skateboard");
  const autoRickshaw = e("\u{1F6FA}", "Auto Rickshaw");
  //export const pickupTruck = e("\u{1F6FB}", "Pickup Truck");
  //export const rollerSkate = e("\u{1F6FC}", "Roller Skate");
  const parachute = e("\u{1FA82}", "Parachute");
  const anchor = e("\u2693", "Anchor");
  const ferry = E("\u26F4", "Ferry");
  const sailboat = e("\u26F5", "Sailboat");
  const fuelPump = e("\u26FD", "Fuel Pump");
  const vehicles = g("Vehicles", "Things that go", motorcycle, racingCar, seat, rocket, helicopter, locomotive, railwayCar, highspeedTrain, bulletTrain, train, metro, lightRail, station, tram, tramCar, bus, oncomingBus, trolleyBus, busStop, miniBus, ambulance, fireEngine, taxi, oncomingTaxi, automobile, oncomingAutomobile, sportUtilityVehicle, deliveryTruck, articulatedLorry, tractor, monorail, mountainRailway, suspensionRailway, mountainCableway, aerialTramway, ship, speedBoat, horizontalTrafficLight, verticalTrafficLight, construction, bicycle, stopSign, oilDrum, motorway, railwayTrack, motorBoat, smallAirplane, airplaneDeparture, airplaneArrival, satellite, passengerShip, kickScooter, motorScooter, canoe, flyingSaucer, skateboard, autoRickshaw, 
  //pickupTruck,
  //rollerSkate,
  motorizedWheelchair, manualWheelchair, parachute, anchor, ferry, sailboat, fuelPump, airplane);
  const bloodTypes = g("Blood Types", "Blood types", e("\u{1F170}", "A Button (Blood Type)"), e("\u{1F171}", "B Button (Blood Type)"), e("\u{1F17E}", "O Button (Blood Type)"), e("\u{1F18E}", "AB Button (Blood Type)"));
  const regionIndicators = g("Regions", "Region indicators", e("\u{1F1E6}", "Regional Indicator Symbol Letter A"), e("\u{1F1E7}", "Regional Indicator Symbol Letter B"), e("\u{1F1E8}", "Regional Indicator Symbol Letter C"), e("\u{1F1E9}", "Regional Indicator Symbol Letter D"), e("\u{1F1EA}", "Regional Indicator Symbol Letter E"), e("\u{1F1EB}", "Regional Indicator Symbol Letter F"), e("\u{1F1EC}", "Regional Indicator Symbol Letter G"), e("\u{1F1ED}", "Regional Indicator Symbol Letter H"), e("\u{1F1EE}", "Regional Indicator Symbol Letter I"), e("\u{1F1EF}", "Regional Indicator Symbol Letter J"), e("\u{1F1F0}", "Regional Indicator Symbol Letter K"), e("\u{1F1F1}", "Regional Indicator Symbol Letter L"), e("\u{1F1F2}", "Regional Indicator Symbol Letter M"), e("\u{1F1F3}", "Regional Indicator Symbol Letter N"), e("\u{1F1F4}", "Regional Indicator Symbol Letter O"), e("\u{1F1F5}", "Regional Indicator Symbol Letter P"), e("\u{1F1F6}", "Regional Indicator Symbol Letter Q"), e("\u{1F1F7}", "Regional Indicator Symbol Letter R"), e("\u{1F1F8}", "Regional Indicator Symbol Letter S"), e("\u{1F1F9}", "Regional Indicator Symbol Letter T"), e("\u{1F1FA}", "Regional Indicator Symbol Letter U"), e("\u{1F1FB}", "Regional Indicator Symbol Letter V"), e("\u{1F1FC}", "Regional Indicator Symbol Letter W"), e("\u{1F1FD}", "Regional Indicator Symbol Letter X"), e("\u{1F1FE}", "Regional Indicator Symbol Letter Y"), e("\u{1F1FF}", "Regional Indicator Symbol Letter Z"));
  const japanese = g("Japanese", "Japanse symbology", e("\u{1F530}", "Japanese Symbol for Beginner"), e("\u{1F201}", "Japanese “Here” Button"), E("\u{1F202}", "Japanese “Service Charge” Button"), e("\u{1F21A}", "Japanese “Free of Charge” Button"), e("\u{1F22F}", "Japanese “Reserved” Button"), e("\u{1F232}", "Japanese “Prohibited” Button"), e("\u{1F233}", "Japanese “Vacancy” Button"), e("\u{1F234}", "Japanese “Passing Grade” Button"), e("\u{1F235}", "Japanese “No Vacancy” Button"), e("\u{1F236}", "Japanese “Not Free of Charge” Button"), E("\u{1F237}", "Japanese “Monthly Amount” Button"), e("\u{1F238}", "Japanese “Application” Button"), e("\u{1F239}", "Japanese “Discount” Button"), e("\u{1F23A}", "Japanese “Open for Business” Button"), e("\u{1F250}", "Japanese “Bargain” Button"), e("\u{1F251}", "Japanese “Acceptable” Button"), E("\u3297", "Japanese “Congratulations” Button"), E("\u3299", "Japanese “Secret” Button"));
  const clocks = g("Clocks", "Time-keeping pieces", e("\u{1F550}", "One O’Clock"), e("\u{1F551}", "Two O’Clock"), e("\u{1F552}", "Three O’Clock"), e("\u{1F553}", "Four O’Clock"), e("\u{1F554}", "Five O’Clock"), e("\u{1F555}", "Six O’Clock"), e("\u{1F556}", "Seven O’Clock"), e("\u{1F557}", "Eight O’Clock"), e("\u{1F558}", "Nine O’Clock"), e("\u{1F559}", "Ten O’Clock"), e("\u{1F55A}", "Eleven O’Clock"), e("\u{1F55B}", "Twelve O’Clock"), e("\u{1F55C}", "One-Thirty"), e("\u{1F55D}", "Two-Thirty"), e("\u{1F55E}", "Three-Thirty"), e("\u{1F55F}", "Four-Thirty"), e("\u{1F560}", "Five-Thirty"), e("\u{1F561}", "Six-Thirty"), e("\u{1F562}", "Seven-Thirty"), e("\u{1F563}", "Eight-Thirty"), e("\u{1F564}", "Nine-Thirty"), e("\u{1F565}", "Ten-Thirty"), e("\u{1F566}", "Eleven-Thirty"), e("\u{1F567}", "Twelve-Thirty"), E("\u{1F570}", "Mantelpiece Clock"), e("\u231A", "Watch"), e("\u23F0", "Alarm Clock"), E("\u23F1", "Stopwatch"), E("\u23F2", "Timer Clock"), e("\u231B", "Hourglass Done"), e("\u23F3", "Hourglass Not Done"));
  const clockwiseVerticalArrows = E("\u{1F503}", "Clockwise Vertical Arrows");
  const counterclockwiseArrowsButton = E("\u{1F504}", "Counterclockwise Arrows Button");
  const leftRightArrow = E("\u2194", "Left-Right Arrow");
  const upDownArrow = E("\u2195", "Up-Down Arrow");
  const upLeftArrow = E("\u2196", "Up-Left Arrow");
  const upRightArrow = E("\u2197", "Up-Right Arrow");
  const downRightArrowEmoji = E("\u2198", "Down-Right Arrow");
  const downLeftArrow = E("\u2199", "Down-Left Arrow");
  const rightArrowCurvingLeft = E("\u21A9", "Right Arrow Curving Left");
  const leftArrowCurvingRight = E("\u21AA", "Left Arrow Curving Right");
  const rightArrow = E("\u27A1", "Right Arrow");
  const rightArrowCurvingUp = E("\u2934", "Right Arrow Curving Up");
  const rightArrowCurvingDown = E("\u2935", "Right Arrow Curving Down");
  const leftArrow = E("\u2B05", "Left Arrow");
  const upArrow = E("\u2B06", "Up Arrow");
  const downArrow = E("\u2B07", "Down Arrow");
  const arrows = g("Arrows", "Arrows pointing in different directions", clockwiseVerticalArrows, counterclockwiseArrowsButton, leftRightArrow, upDownArrow, upLeftArrow, upRightArrow, downRightArrowEmoji, downLeftArrow, rightArrowCurvingLeft, leftArrowCurvingRight, rightArrow, rightArrowCurvingUp, rightArrowCurvingDown, leftArrow, upArrow, downArrow);
  const clearButton = e("\u{1F191}", "CL Button");
  const coolButton = e("\u{1F192}", "Cool Button");
  const freeButton = e("\u{1F193}", "Free Button");
  const idButton = e("\u{1F194}", "ID Button");
  const newButton = e("\u{1F195}", "New Button");
  const ngButton = e("\u{1F196}", "NG Button");
  const okButton = e("\u{1F197}", "OK Button");
  const sosButton = e("\u{1F198}", "SOS Button");
  const upButton = e("\u{1F199}", "Up! Button");
  const vsButton = e("\u{1F19A}", "Vs Button");
  const radioButton = e("\u{1F518}", "Radio Button");
  const backArrow = e("\u{1F519}", "Back Arrow");
  const endArrow = e("\u{1F51A}", "End Arrow");
  const onArrow = e("\u{1F51B}", "On! Arrow");
  const soonArrow = e("\u{1F51C}", "Soon Arrow");
  const topArrow = e("\u{1F51D}", "Top Arrow");
  const checkBoxWithCheck = E("\u2611", "Check Box with Check");
  const inputLatinUppercase = e("\u{1F520}", "Input Latin Uppercase");
  const inputLatinLowercase = e("\u{1F521}", "Input Latin Lowercase");
  const inputNumbers = e("\u{1F522}", "Input Numbers");
  const inputSymbols = e("\u{1F523}", "Input Symbols");
  const inputLatinLetters = e("\u{1F524}", "Input Latin Letters");
  const shuffleTracksButton = e("\u{1F500}", "Shuffle Tracks Button");
  const repeatButton = e("\u{1F501}", "Repeat Button");
  const repeatSingleButton = e("\u{1F502}", "Repeat Single Button");
  const upwardsButton = e("\u{1F53C}", "Upwards Button");
  const downwardsButton = e("\u{1F53D}", "Downwards Button");
  const playButton = E("\u25B6", "Play Button");
  const reverseButton = E("\u25C0", "Reverse Button");
  const ejectButton = E("\u23CF", "Eject Button");
  const fastForwardButton = e("\u23E9", "Fast-Forward Button");
  const fastReverseButton = e("\u23EA", "Fast Reverse Button");
  const fastUpButton = e("\u23EB", "Fast Up Button");
  const fastDownButton = e("\u23EC", "Fast Down Button");
  const nextTrackButton = E("\u23ED", "Next Track Button");
  const lastTrackButton = E("\u23EE", "Last Track Button");
  const playOrPauseButton = E("\u23EF", "Play or Pause Button");
  const pauseButton = E("\u23F8", "Pause Button");
  const stopButton = E("\u23F9", "Stop Button");
  const recordButton = E("\u23FA", "Record Button");
  const buttons = g("Buttons", "Buttons", clearButton, coolButton, freeButton, idButton, newButton, ngButton, okButton, sosButton, upButton, vsButton, radioButton, backArrow, endArrow, onArrow, soonArrow, topArrow, checkBoxWithCheck, inputLatinUppercase, inputLatinLowercase, inputNumbers, inputSymbols, inputLatinLetters, shuffleTracksButton, repeatButton, repeatSingleButton, upwardsButton, downwardsButton, playButton, pauseButton, reverseButton, ejectButton, fastForwardButton, fastReverseButton, fastUpButton, fastDownButton, nextTrackButton, lastTrackButton, playOrPauseButton, pauseButton, stopButton, recordButton);
  const zodiac = g("Zodiac", "The symbology of astrology", e("\u2648", "Aries"), e("\u2649", "Taurus"), e("\u264A", "Gemini"), e("\u264B", "Cancer"), e("\u264C", "Leo"), e("\u264D", "Virgo"), e("\u264E", "Libra"), e("\u264F", "Scorpio"), e("\u2650", "Sagittarius"), e("\u2651", "Capricorn"), e("\u2652", "Aquarius"), e("\u2653", "Pisces"), e("\u26CE", "Ophiuchus"));
  const digit0 = E("0", "Digit Zero");
  const digit1 = E("1", "Digit One");
  const digit2 = E("2", "Digit Two");
  const digit3 = E("3", "Digit Three");
  const digit4 = E("4", "Digit Four");
  const digit5 = E("5", "Digit Five");
  const digit6 = E("6", "Digit Six");
  const digit7 = E("7", "Digit Seven");
  const digit8 = E("8", "Digit Eight");
  const digit9 = E("9", "Digit Nine");
  const asterisk = E("\u002A", "Asterisk");
  const numberSign = E("\u0023", "Number Sign");
  const keycapDigit0 = combo(digit0, combiningEnclosingKeycap, "Keycap Digit Zero");
  const keycapDigit1 = combo(digit1, combiningEnclosingKeycap, "Keycap Digit One");
  const keycapDigit2 = combo(digit2, combiningEnclosingKeycap, "Keycap Digit Two");
  const keycapDigit3 = combo(digit3, combiningEnclosingKeycap, "Keycap Digit Three");
  const keycapDigit4 = combo(digit4, combiningEnclosingKeycap, "Keycap Digit Four");
  const keycapDigit5 = combo(digit5, combiningEnclosingKeycap, "Keycap Digit Five");
  const keycapDigit6 = combo(digit6, combiningEnclosingKeycap, "Keycap Digit Six");
  const keycapDigit7 = combo(digit7, combiningEnclosingKeycap, "Keycap Digit Seven");
  const keycapDigit8 = combo(digit8, combiningEnclosingKeycap, "Keycap Digit Eight");
  const keycapDigit9 = combo(digit9, combiningEnclosingKeycap, "Keycap Digit Nine");
  const keycapAsterisk = combo(asterisk, combiningEnclosingKeycap, "Keycap Asterisk");
  const keycapNumberSign = combo(numberSign, combiningEnclosingKeycap, "Keycap Number Sign");
  const keycap10 = e("\u{1F51F}", "Keycap: 10");
  const numbers = g("Numbers", "Numbers", digit0, digit1, digit2, digit3, digit4, digit5, digit6, digit7, digit8, digit9, asterisk, numberSign, keycapDigit0, keycapDigit1, keycapDigit2, keycapDigit3, keycapDigit4, keycapDigit5, keycapDigit6, keycapDigit7, keycapDigit8, keycapDigit9, keycapAsterisk, keycapNumberSign, keycap10);
  const tagPlusSign = e("\u{E002B}", "Tag Plus Sign");
  const tagMinusHyphen = e("\u{E002D}", "Tag Hyphen-Minus");
  const tags = g("Tags", "Tags", e("\u{E0020}", "Tag Space"), e("\u{E0021}", "Tag Exclamation Mark"), e("\u{E0022}", "Tag Quotation Mark"), e("\u{E0023}", "Tag Number Sign"), e("\u{E0024}", "Tag Dollar Sign"), e("\u{E0025}", "Tag Percent Sign"), e("\u{E0026}", "Tag Ampersand"), e("\u{E0027}", "Tag Apostrophe"), e("\u{E0028}", "Tag Left Parenthesis"), e("\u{E0029}", "Tag Right Parenthesis"), e("\u{E002A}", "Tag Asterisk"), tagPlusSign, e("\u{E002C}", "Tag Comma"), tagMinusHyphen, e("\u{E002E}", "Tag Full Stop"), e("\u{E002F}", "Tag Solidus"), e("\u{E0030}", "Tag Digit Zero"), e("\u{E0031}", "Tag Digit One"), e("\u{E0032}", "Tag Digit Two"), e("\u{E0033}", "Tag Digit Three"), e("\u{E0034}", "Tag Digit Four"), e("\u{E0035}", "Tag Digit Five"), e("\u{E0036}", "Tag Digit Six"), e("\u{E0037}", "Tag Digit Seven"), e("\u{E0038}", "Tag Digit Eight"), e("\u{E0039}", "Tag Digit Nine"), e("\u{E003A}", "Tag Colon"), e("\u{E003B}", "Tag Semicolon"), e("\u{E003C}", "Tag Less-Than Sign"), e("\u{E003D}", "Tag Equals Sign"), e("\u{E003E}", "Tag Greater-Than Sign"), e("\u{E003F}", "Tag Question Mark"), e("\u{E0040}", "Tag Commercial at"), e("\u{E0041}", "Tag Latin Capital Letter a"), e("\u{E0042}", "Tag Latin Capital Letter B"), e("\u{E0043}", "Tag Latin Capital Letter C"), e("\u{E0044}", "Tag Latin Capital Letter D"), e("\u{E0045}", "Tag Latin Capital Letter E"), e("\u{E0046}", "Tag Latin Capital Letter F"), e("\u{E0047}", "Tag Latin Capital Letter G"), e("\u{E0048}", "Tag Latin Capital Letter H"), e("\u{E0049}", "Tag Latin Capital Letter I"), e("\u{E004A}", "Tag Latin Capital Letter J"), e("\u{E004B}", "Tag Latin Capital Letter K"), e("\u{E004C}", "Tag Latin Capital Letter L"), e("\u{E004D}", "Tag Latin Capital Letter M"), e("\u{E004E}", "Tag Latin Capital Letter N"), e("\u{E004F}", "Tag Latin Capital Letter O"), e("\u{E0050}", "Tag Latin Capital Letter P"), e("\u{E0051}", "Tag Latin Capital Letter Q"), e("\u{E0052}", "Tag Latin Capital Letter R"), e("\u{E0053}", "Tag Latin Capital Letter S"), e("\u{E0054}", "Tag Latin Capital Letter T"), e("\u{E0055}", "Tag Latin Capital Letter U"), e("\u{E0056}", "Tag Latin Capital Letter V"), e("\u{E0057}", "Tag Latin Capital Letter W"), e("\u{E0058}", "Tag Latin Capital Letter X"), e("\u{E0059}", "Tag Latin Capital Letter Y"), e("\u{E005A}", "Tag Latin Capital Letter Z"), e("\u{E005B}", "Tag Left Square Bracket"), e("\u{E005C}", "Tag Reverse Solidus"), e("\u{E005D}", "Tag Right Square Bracket"), e("\u{E005E}", "Tag Circumflex Accent"), e("\u{E005F}", "Tag Low Line"), e("\u{E0060}", "Tag Grave Accent"), e("\u{E0061}", "Tag Latin Small Letter a"), e("\u{E0062}", "Tag Latin Small Letter B"), e("\u{E0063}", "Tag Latin Small Letter C"), e("\u{E0064}", "Tag Latin Small Letter D"), e("\u{E0065}", "Tag Latin Small Letter E"), e("\u{E0066}", "Tag Latin Small Letter F"), e("\u{E0067}", "Tag Latin Small Letter G"), e("\u{E0068}", "Tag Latin Small Letter H"), e("\u{E0069}", "Tag Latin Small Letter I"), e("\u{E006A}", "Tag Latin Small Letter J"), e("\u{E006B}", "Tag Latin Small Letter K"), e("\u{E006C}", "Tag Latin Small Letter L"), e("\u{E006D}", "Tag Latin Small Letter M"), e("\u{E006E}", "Tag Latin Small Letter N"), e("\u{E006F}", "Tag Latin Small Letter O"), e("\u{E0070}", "Tag Latin Small Letter P"), e("\u{E0071}", "Tag Latin Small Letter Q"), e("\u{E0072}", "Tag Latin Small Letter R"), e("\u{E0073}", "Tag Latin Small Letter S"), e("\u{E0074}", "Tag Latin Small Letter T"), e("\u{E0075}", "Tag Latin Small Letter U"), e("\u{E0076}", "Tag Latin Small Letter V"), e("\u{E0077}", "Tag Latin Small Letter W"), e("\u{E0078}", "Tag Latin Small Letter X"), e("\u{E0079}", "Tag Latin Small Letter Y"), e("\u{E007A}", "Tag Latin Small Letter Z"), e("\u{E007B}", "Tag Left Curly Bracket"), e("\u{E007C}", "Tag Vertical Line"), e("\u{E007D}", "Tag Right Curly Bracket"), e("\u{E007E}", "Tag Tilde"), e("\u{E007F}", "Cancel Tag"));
  const math = g("Math", "Math", E("\u2716", "Multiply"), e("\u2795", "Plus"), e("\u2796", "Minus"), e("\u2797", "Divide"));
  const games = g("Games", "Games", E("\u2660", "Spade Suit"), E("\u2663", "Club Suit"), E("\u2665", "Heart Suit", { color: "red" }), E("\u2666", "Diamond Suit", { color: "red" }), e("\u{1F004}", "Mahjong Red Dragon"), e("\u{1F0CF}", "Joker"), e("\u{1F3AF}", "Direct Hit"), e("\u{1F3B0}", "Slot Machine"), e("\u{1F3B1}", "Pool 8 Ball"), e("\u{1F3B2}", "Game Die"), e("\u{1F3B3}", "Bowling"), e("\u{1F3B4}", "Flower Playing Cards"), e("\u{1F9E9}", "Puzzle Piece"), E("\u265F", "Chess Pawn"), e("\u{1FA80}", "Yo-Yo"), 
  //e("\u{1FA83}", "Boomerang"),
  //e("\u{1FA86}", "Nesting Dolls"),
  e("\u{1FA81}", "Kite"));
  const sportsEquipment = g("Sports Equipment", "Sports equipment", e("\u{1F3BD}", "Running Shirt"), e("\u{1F3BE}", "Tennis"), e("\u{1F3BF}", "Skis"), e("\u{1F3C0}", "Basketball"), e("\u{1F3C5}", "Sports Medal"), e("\u{1F3C6}", "Trophy"), e("\u{1F3C8}", "American Football"), e("\u{1F3C9}", "Rugby Football"), e("\u{1F3CF}", "Cricket Game"), e("\u{1F3D0}", "Volleyball"), e("\u{1F3D1}", "Field Hockey"), e("\u{1F3D2}", "Ice Hockey"), e("\u{1F3D3}", "Ping Pong"), e("\u{1F3F8}", "Badminton"), e("\u{1F6F7}", "Sled"), e("\u{1F945}", "Goal Net"), e("\u{1F947}", "1st Place Medal"), e("\u{1F948}", "2nd Place Medal"), e("\u{1F949}", "3rd Place Medal"), e("\u{1F94A}", "Boxing Glove"), e("\u{1F94C}", "Curling Stone"), e("\u{1F94D}", "Lacrosse"), e("\u{1F94E}", "Softball"), e("\u{1F94F}", "Flying Disc"), e("\u26BD", "Soccer Ball"), e("\u26BE", "Baseball"), E("\u26F8", "Ice Skate"));
  const clothing = g("Clothing", "Clothing", e("\u{1F3A9}", "Top Hat"), e("\u{1F93F}", "Diving Mask"), e("\u{1F452}", "Woman’s Hat"), e("\u{1F453}", "Glasses"), E("\u{1F576}", "Sunglasses"), e("\u{1F454}", "Necktie"), e("\u{1F455}", "T-Shirt"), e("\u{1F456}", "Jeans"), e("\u{1F457}", "Dress"), e("\u{1F458}", "Kimono"), e("\u{1F459}", "Bikini"), e("\u{1F45A}", "Woman’s Clothes"), e("\u{1F45B}", "Purse"), e("\u{1F45C}", "Handbag"), e("\u{1F45D}", "Clutch Bag"), e("\u{1F45E}", "Man’s Shoe"), e("\u{1F45F}", "Running Shoe"), e("\u{1F460}", "High-Heeled Shoe"), e("\u{1F461}", "Woman’s Sandal"), e("\u{1F462}", "Woman’s Boot"), e("\u{1F94B}", "Martial Arts Uniform"), e("\u{1F97B}", "Sari"), e("\u{1F97C}", "Lab Coat"), e("\u{1F97D}", "Goggles"), e("\u{1F97E}", "Hiking Boot"), e("\u{1F97F}", "Flat Shoe"), whiteCane, safetyVest, e("\u{1F9E2}", "Billed Cap"), e("\u{1F9E3}", "Scarf"), e("\u{1F9E4}", "Gloves"), e("\u{1F9E5}", "Coat"), e("\u{1F9E6}", "Socks"), e("\u{1F9FF}", "Nazar Amulet"), e("\u{1FA70}", "Ballet Shoes"), e("\u{1FA71}", "One-Piece Swimsuit"), e("\u{1FA72}", "Briefs"), e("\u{1FA73}", "Shorts"));
  const town = g("Town", "Town", E("\u{1F3D7}", "Building Construction"), E("\u{1F3D8}", "Houses"), E("\u{1F3D9}", "Cityscape"), E("\u{1F3DA}", "Derelict House"), E("\u{1F3DB}", "Classical Building"), E("\u{1F3DC}", "Desert"), E("\u{1F3DD}", "Desert Island"), E("\u{1F3DE}", "National Park"), E("\u{1F3DF}", "Stadium"), e("\u{1F3E0}", "House"), e("\u{1F3E1}", "House with Garden"), e("\u{1F3E2}", "Office Building"), e("\u{1F3E3}", "Japanese Post Office"), e("\u{1F3E4}", "Post Office"), e("\u{1F3E5}", "Hospital"), e("\u{1F3E6}", "Bank"), e("\u{1F3E7}", "ATM Sign"), e("\u{1F3E8}", "Hotel"), e("\u{1F3E9}", "Love Hotel"), e("\u{1F3EA}", "Convenience Store"), school, e("\u{1F3EC}", "Department Store"), factory, e("\u{1F309}", "Bridge at Night"), e("\u26F2", "Fountain"), E("\u{1F6CD}", "Shopping Bags"), e("\u{1F9FE}", "Receipt"), e("\u{1F6D2}", "Shopping Cart"), e("\u{1F488}", "Barber Pole"), e("\u{1F492}", "Wedding"), E("\u{1F5F3}", "Ballot Box with Ballot"));
  const music = g("Music", "Music", e("\u{1F3BC}", "Musical Score"), e("\u{1F3B6}", "Musical Notes"), e("\u{1F3B5}", "Musical Note"), e("\u{1F3B7}", "Saxophone"), e("\u{1F3B8}", "Guitar"), e("\u{1F3B9}", "Musical Keyboard"), e("\u{1F3BA}", "Trumpet"), e("\u{1F3BB}", "Violin"), e("\u{1F941}", "Drum"), 
  //e("\u{1FA97}", "Accordion"),
  //e("\u{1FA98}", "Long Drum"),
  e("\u{1FA95}", "Banjo"));
  const astro = g("Astronomy", "Astronomy", e("\u{1F30C}", "Milky Way"), e("\u{1F30D}", "Globe Showing Europe-Africa"), e("\u{1F30E}", "Globe Showing Americas"), e("\u{1F30F}", "Globe Showing Asia-Australia"), e("\u{1F310}", "Globe with Meridians"), e("\u{1F311}", "New Moon"), e("\u{1F312}", "Waxing Crescent Moon"), e("\u{1F313}", "First Quarter Moon"), e("\u{1F314}", "Waxing Gibbous Moon"), e("\u{1F315}", "Full Moon"), e("\u{1F316}", "Waning Gibbous Moon"), e("\u{1F317}", "Last Quarter Moon"), e("\u{1F318}", "Waning Crescent Moon"), e("\u{1F319}", "Crescent Moon"), e("\u{1F31A}", "New Moon Face"), e("\u{1F31B}", "First Quarter Moon Face"), e("\u{1F31C}", "Last Quarter Moon Face"), e("\u{1F31D}", "Full Moon Face"), e("\u{1F31E}", "Sun with Face"), e("\u{1F31F}", "Glowing Star"), e("\u{1F320}", "Shooting Star"), E("\u2604", "Comet"), e("\u{1FA90}", "Ringed Planet"));
  const finance = g("Finance", "Finance", e("\u{1F4B0}", "Money Bag"), e("\u{1F4B1}", "Currency Exchange"), e("\u{1F4B2}", "Heavy Dollar Sign"), e("\u{1F4B3}", "Credit Card"), e("\u{1F4B4}", "Yen Banknote"), e("\u{1F4B5}", "Dollar Banknote"), e("\u{1F4B6}", "Euro Banknote"), e("\u{1F4B7}", "Pound Banknote"), e("\u{1F4B8}", "Money with Wings"), 
  //e("\u{1FA99}", "Coin"),
  e("\u{1F4B9}", "Chart Increasing with Yen"));
  const writing = g("Writing", "Writing", E("\u{1F58A}", "Pen"), E("\u{1F58B}", "Fountain Pen"), E("\u{1F58C}", "Paintbrush"), E("\u{1F58D}", "Crayon"), E("\u270F", "Pencil"), E("\u2712", "Black Nib"));
  const alembic = E("\u2697", "Alembic");
  const gear = E("\u2699", "Gear");
  const atomSymbol = E("\u269B", "Atom Symbol");
  const keyboard = E("\u2328", "Keyboard");
  const telephone = E("\u260E", "Telephone");
  const studioMicrophone = E("\u{1F399}", "Studio Microphone");
  const levelSlider = E("\u{1F39A}", "Level Slider");
  const controlKnobs = E("\u{1F39B}", "Control Knobs");
  const movieCamera = e("\u{1F3A5}", "Movie Camera");
  const headphone = e("\u{1F3A7}", "Headphone");
  const videoGame = e("\u{1F3AE}", "Video Game");
  const lightBulb = e("\u{1F4A1}", "Light Bulb");
  const computerDisk = e("\u{1F4BD}", "Computer Disk");
  const floppyDisk = e("\u{1F4BE}", "Floppy Disk");
  const opticalDisk = e("\u{1F4BF}", "Optical Disk");
  const dvd = e("\u{1F4C0}", "DVD");
  const telephoneReceiver = e("\u{1F4DE}", "Telephone Receiver");
  const pager = e("\u{1F4DF}", "Pager");
  const faxMachine = e("\u{1F4E0}", "Fax Machine");
  const satelliteAntenna = e("\u{1F4E1}", "Satellite Antenna");
  const loudspeaker = e("\u{1F4E2}", "Loudspeaker");
  const megaphone = e("\u{1F4E3}", "Megaphone");
  const mobilePhone = e("\u{1F4F1}", "Mobile Phone");
  const mobilePhoneWithArrow = e("\u{1F4F2}", "Mobile Phone with Arrow");
  const mobilePhoneVibrating = e("\u{1F4F3}", "Mobile Phone Vibrating");
  const mobilePhoneOff = e("\u{1F4F4}", "Mobile Phone Off");
  const noMobilePhone = e("\u{1F4F5}", "No Mobile Phone");
  const antennaBars = e("\u{1F4F6}", "Antenna Bars");
  const camera = e("\u{1F4F7}", "Camera");
  const cameraWithFlash = e("\u{1F4F8}", "Camera with Flash");
  const videoCamera = e("\u{1F4F9}", "Video Camera");
  const television = e("\u{1F4FA}", "Television");
  const radio = e("\u{1F4FB}", "Radio");
  const videocassette = e("\u{1F4FC}", "Videocassette");
  const filmProjector = E("\u{1F4FD}", "Film Projector");
  const dimButton = e("\u{1F505}", "Dim Button");
  const brightButton = e("\u{1F506}", "Bright Button");
  const mutedSpeaker = e("\u{1F507}", "Muted Speaker");
  const speakerLowVolume = e("\u{1F508}", "Speaker Low Volume");
  const speakerMediumVolume = e("\u{1F509}", "Speaker Medium Volume");
  const speakerHighVolume = e("\u{1F50A}", "Speaker High Volume");
  const battery = e("\u{1F50B}", "Battery");
  const electricPlug = e("\u{1F50C}", "Electric Plug");
  const magnifyingGlassTiltedLeft = e("\u{1F50D}", "Magnifying Glass Tilted Left");
  const magnifyingGlassTiltedRight = e("\u{1F50E}", "Magnifying Glass Tilted Right");
  const lockedWithPen = e("\u{1F50F}", "Locked with Pen");
  const lockedWithKey = e("\u{1F510}", "Locked with Key");
  const key = e("\u{1F511}", "Key");
  const locked = e("\u{1F512}", "Locked");
  const unlocked = e("\u{1F513}", "Unlocked");
  const bell = e("\u{1F514}", "Bell");
  const bellWithSlash = e("\u{1F515}", "Bell with Slash");
  const bookmark = e("\u{1F516}", "Bookmark");
  const link = e("\u{1F517}", "Link");
  const joystick = E("\u{1F579}", "Joystick");
  const desktopComputer = E("\u{1F5A5}", "Desktop Computer");
  const printer = E("\u{1F5A8}", "Printer");
  const computerMouse = E("\u{1F5B1}", "Computer Mouse");
  const trackball = E("\u{1F5B2}", "Trackball");
  const cardIndexDividers = e("\u{1F5C2}", "Card Index Dividers");
  const cardFileBox = e("\u{1F5C3}", "Card File Box");
  const fileCabinet = e("\u{1F5C4}", "File Cabinet");
  const wastebasket = e("\u{1F5D1}", "Wastebasket");
  const spiralNotePad = e("\u{1F5D2}", "Spiral Note Pad");
  const spiralCalendar = e("\u{1F5D3}", "Spiral Calendar");
  const compression = e("\u{1F5DC}", "Compression");
  const oldKey = e("\u{1F5DD}", "Old Key");
  const tech = g("Technology", "Technology", joystick, videoGame, lightBulb, laptop, briefcase, computerDisk, floppyDisk, opticalDisk, dvd, desktopComputer, keyboard, printer, computerMouse, trackball, telephone, telephoneReceiver, pager, faxMachine, satelliteAntenna, loudspeaker, megaphone, television, radio, videocassette, filmProjector, studioMicrophone, levelSlider, controlKnobs, microphone, movieCamera, headphone, camera, cameraWithFlash, videoCamera, mobilePhone, mobilePhoneOff, mobilePhoneWithArrow, lockedWithPen, lockedWithKey, locked, unlocked, bell, bellWithSlash, bookmark, link, mobilePhoneVibrating, antennaBars, dimButton, brightButton, mutedSpeaker, speakerLowVolume, speakerMediumVolume, speakerHighVolume, battery, electricPlug);
  const mail = g("Mail", "Mail", e("\u{1F4E4}", "Outbox Tray"), e("\u{1F4E5}", "Inbox Tray"), e("\u{1F4E6}", "Package"), e("\u{1F4E7}", "E-Mail"), e("\u{1F4E8}", "Incoming Envelope"), e("\u{1F4E9}", "Envelope with Arrow"), e("\u{1F4EA}", "Closed Mailbox with Lowered Flag"), e("\u{1F4EB}", "Closed Mailbox with Raised Flag"), e("\u{1F4EC}", "Open Mailbox with Raised Flag"), e("\u{1F4ED}", "Open Mailbox with Lowered Flag"), e("\u{1F4EE}", "Postbox"), e("\u{1F4EF}", "Postal Horn"));
  const celebration = g("Celebration", "Celebration", e("\u{1F380}", "Ribbon"), e("\u{1F381}", "Wrapped Gift"), e("\u{1F383}", "Jack-O-Lantern"), e("\u{1F384}", "Christmas Tree"), e("\u{1F9E8}", "Firecracker"), e("\u{1F386}", "Fireworks"), e("\u{1F387}", "Sparkler"), e("\u2728", "Sparkles"), E("\u2747", "Sparkle"), e("\u{1F388}", "Balloon"), e("\u{1F389}", "Party Popper"), e("\u{1F38A}", "Confetti Ball"), e("\u{1F38B}", "Tanabata Tree"), e("\u{1F38D}", "Pine Decoration"), e("\u{1F38E}", "Japanese Dolls"), e("\u{1F38F}", "Carp Streamer"), e("\u{1F390}", "Wind Chime"), e("\u{1F391}", "Moon Viewing Ceremony"), e("\u{1F392}", "Backpack"), graduationCap, e("\u{1F9E7}", "Red Envelope"), e("\u{1F3EE}", "Red Paper Lantern"), E("\u{1F396}", "Military Medal"));
  const tools = g("Tools", "Tools", e("\u{1F3A3}", "Fishing Pole"), e("\u{1F526}", "Flashlight"), wrench, e("\u{1F528}", "Hammer"), e("\u{1F529}", "Nut and Bolt"), E("\u{1F6E0}", "Hammer and Wrench"), e("\u{1F9ED}", "Compass"), e("\u{1F9EF}", "Fire Extinguisher"), e("\u{1F9F0}", "Toolbox"), e("\u{1F9F1}", "Brick"), e("\u{1FA93}", "Axe"), E("\u2692", "Hammer and Pick"), E("\u26CF", "Pick"), E("\u26D1", "Rescue Worker’s Helmet"), E("\u26D3", "Chains"), compression);
  const office = g("Office", "Office", e("\u{1F4C1}", "File Folder"), e("\u{1F4C2}", "Open File Folder"), e("\u{1F4C3}", "Page with Curl"), e("\u{1F4C4}", "Page Facing Up"), e("\u{1F4C5}", "Calendar"), e("\u{1F4C6}", "Tear-Off Calendar"), e("\u{1F4C7}", "Card Index"), cardIndexDividers, cardFileBox, fileCabinet, wastebasket, spiralNotePad, spiralCalendar, e("\u{1F4C8}", "Chart Increasing"), e("\u{1F4C9}", "Chart Decreasing"), e("\u{1F4CA}", "Bar Chart"), e("\u{1F4CB}", "Clipboard"), e("\u{1F4CC}", "Pushpin"), e("\u{1F4CD}", "Round Pushpin"), e("\u{1F4CE}", "Paperclip"), E("\u{1F587}", "Linked Paperclips"), e("\u{1F4CF}", "Straight Ruler"), e("\u{1F4D0}", "Triangular Ruler"), e("\u{1F4D1}", "Bookmark Tabs"), e("\u{1F4D2}", "Ledger"), e("\u{1F4D3}", "Notebook"), e("\u{1F4D4}", "Notebook with Decorative Cover"), e("\u{1F4D5}", "Closed Book"), e("\u{1F4D6}", "Open Book"), e("\u{1F4D7}", "Green Book"), e("\u{1F4D8}", "Blue Book"), e("\u{1F4D9}", "Orange Book"), e("\u{1F4DA}", "Books"), e("\u{1F4DB}", "Name Badge"), e("\u{1F4DC}", "Scroll"), e("\u{1F4DD}", "Memo"), E("\u2702", "Scissors"), E("\u2709", "Envelope"));
  const signs = g("Signs", "Signs", e("\u{1F3A6}", "Cinema"), noMobilePhone, e("\u{1F51E}", "No One Under Eighteen"), e("\u{1F6AB}", "Prohibited"), e("\u{1F6AC}", "Cigarette"), e("\u{1F6AD}", "No Smoking"), e("\u{1F6AE}", "Litter in Bin Sign"), e("\u{1F6AF}", "No Littering"), e("\u{1F6B0}", "Potable Water"), e("\u{1F6B1}", "Non-Potable Water"), e("\u{1F6B3}", "No Bicycles"), e("\u{1F6B7}", "No Pedestrians"), e("\u{1F6B8}", "Children Crossing"), e("\u{1F6B9}", "Men’s Room"), e("\u{1F6BA}", "Women’s Room"), e("\u{1F6BB}", "Restroom"), e("\u{1F6BC}", "Baby Symbol"), e("\u{1F6BE}", "Water Closet"), e("\u{1F6C2}", "Passport Control"), e("\u{1F6C3}", "Customs"), e("\u{1F6C4}", "Baggage Claim"), e("\u{1F6C5}", "Left Luggage"), E("\u{1F17F}", "Parking Button"), e("\u267F", "Wheelchair Symbol"), E("\u2622", "Radioactive"), E("\u2623", "Biohazard"), E("\u26A0", "Warning"), e("\u26A1", "High Voltage"), e("\u26D4", "No Entry"), E("\u267B", "Recycling Symbol"), female, male, transgender);
  const religion = g("Religion", "Religion", e("\u{1F52F}", "Dotted Six-Pointed Star"), E("\u2721", "Star of David"), E("\u{1F549}", "Om"), e("\u{1F54B}", "Kaaba"), e("\u{1F54C}", "Mosque"), e("\u{1F54D}", "Synagogue"), e("\u{1F54E}", "Menorah"), e("\u{1F6D0}", "Place of Worship"), e("\u{1F6D5}", "Hindu Temple"), E("\u2626", "Orthodox Cross"), E("\u271D", "Latin Cross"), E("\u262A", "Star and Crescent"), E("\u262E", "Peace Symbol"), E("\u262F", "Yin Yang"), E("\u2638", "Wheel of Dharma"), E("\u267E", "Infinity"), e("\u{1FA94}", "Diya Lamp"), E("\u26E9", "Shinto Shrine"), e("\u26EA", "Church"), E("\u2734", "Eight-Pointed Star"), e("\u{1F4FF}", "Prayer Beads"));
  const door = e("\u{1F6AA}", "Door");
  const household = g("Household", "Household", e("\u{1F484}", "Lipstick"), e("\u{1F48D}", "Ring"), e("\u{1F48E}", "Gem Stone"), e("\u{1F4F0}", "Newspaper"), key, e("\u{1F525}", "Fire"), e("\u{1F52B}", "Pistol"), E("\u{1F56F}", "Candle"), E("\u{1F5BC}", "Framed Picture"), oldKey, E("\u{1F5DE}", "Rolled-Up Newspaper"), E("\u{1F5FA}", "World Map"), door, e("\u{1F6BD}", "Toilet"), e("\u{1F6BF}", "Shower"), e("\u{1F6C1}", "Bathtub"), E("\u{1F6CB}", "Couch and Lamp"), E("\u{1F6CF}", "Bed"), e("\u{1F9F4}", "Lotion Bottle"), e("\u{1F9F5}", "Thread"), e("\u{1F9F6}", "Yarn"), e("\u{1F9F7}", "Safety Pin"), e("\u{1F9F8}", "Teddy Bear"), e("\u{1F9F9}", "Broom"), e("\u{1F9FA}", "Basket"), e("\u{1F9FB}", "Roll of Paper"), e("\u{1F9FC}", "Soap"), e("\u{1F9FD}", "Sponge"), e("\u{1FA91}", "Chair"), e("\u{1FA92}", "Razor"), E("\u{1F397}", "Reminder Ribbon"));
  const activities = g("Activities", "Activities", E("\u{1F39E}", "Film Frames"), E("\u{1F39F}", "Admission Tickets"), e("\u{1F3A0}", "Carousel Horse"), e("\u{1F3A1}", "Ferris Wheel"), e("\u{1F3A2}", "Roller Coaster"), artistPalette, e("\u{1F3AA}", "Circus Tent"), e("\u{1F3AB}", "Ticket"), e("\u{1F3AC}", "Clapper Board"), e("\u{1F3AD}", "Performing Arts"));
  const travel = g("Travel", "Travel", E("\u{1F3F7}", "Label"), e("\u{1F30B}", "Volcano"), E("\u{1F3D4}", "Snow-Capped Mountain"), E("\u26F0", "Mountain"), E("\u{1F3D5}", "Camping"), E("\u{1F3D6}", "Beach with Umbrella"), E("\u26F1", "Umbrella on Ground"), e("\u{1F3EF}", "Japanese Castle"), e("\u{1F463}", "Footprints"), e("\u{1F5FB}", "Mount Fuji"), e("\u{1F5FC}", "Tokyo Tower"), e("\u{1F5FD}", "Statue of Liberty"), e("\u{1F5FE}", "Map of Japan"), e("\u{1F5FF}", "Moai"), E("\u{1F6CE}", "Bellhop Bell"), e("\u{1F9F3}", "Luggage"), e("\u26F3", "Flag in Hole"), e("\u26FA", "Tent"), E("\u2668", "Hot Springs"));
  const medieval = g("Medieval", "Medieval", e("\u{1F3F0}", "Castle"), e("\u{1F3F9}", "Bow and Arrow"), crown, e("\u{1F531}", "Trident Emblem"), E("\u{1F5E1}", "Dagger"), E("\u{1F6E1}", "Shield"), e("\u{1F52E}", "Crystal Ball"), E("\u2694", "Crossed Swords"), E("\u269C", "Fleur-de-lis"));
  const doubleExclamationMark = E("\u203C", "Double Exclamation Mark");
  const interrobang = E("\u2049", "Exclamation Question Mark");
  const information = E("\u2139", "Information");
  const circledM = E("\u24C2", "Circled M");
  const checkMarkButton = e("\u2705", "Check Mark Button");
  const checkMark = E("\u2714", "Check Mark");
  const eightSpokedAsterisk = E("\u2733", "Eight-Spoked Asterisk");
  const crossMark = e("\u274C", "Cross Mark");
  const crossMarkButton = e("\u274E", "Cross Mark Button");
  const questionMark = e("\u2753", "Question Mark");
  const whiteQuestionMark = e("\u2754", "White Question Mark");
  const whiteExclamationMark = e("\u2755", "White Exclamation Mark");
  const exclamationMark = e("\u2757", "Exclamation Mark");
  const curlyLoop = e("\u27B0", "Curly Loop");
  const doubleCurlyLoop = e("\u27BF", "Double Curly Loop");
  const wavyDash = E("\u3030", "Wavy Dash");
  const partAlternationMark = E("\u303D", "Part Alternation Mark");
  const tradeMark = E("\u2122", "Trade Mark");
  const copyright = E("\u00A9", "Copyright");
  const registered = E("\u00AE", "Registered");
  const marks = gg("Marks", "Marks", {
      doubleExclamationMark,
      interrobang,
      information,
      circledM,
      checkMarkButton,
      checkMark,
      eightSpokedAsterisk,
      crossMark,
      crossMarkButton,
      questionMark,
      whiteQuestionMark,
      whiteExclamationMark,
      exclamationMark,
      curlyLoop,
      doubleCurlyLoop,
      wavyDash,
      partAlternationMark,
      tradeMark,
      copyright,
      registered,
  });
  const droplet = e("\u{1F4A7}", "Droplet");
  const dropOfBlood = e("\u{1FA78}", "Drop of Blood");
  const adhesiveBandage = e("\u{1FA79}", "Adhesive Bandage");
  const stethoscope = e("\u{1FA7A}", "Stethoscope");
  const syringe = e("\u{1F489}", "Syringe");
  const pill = e("\u{1F48A}", "Pill");
  const testTube = e("\u{1F9EA}", "Test Tube");
  const petriDish = e("\u{1F9EB}", "Petri Dish");
  const dna = e("\u{1F9EC}", "DNA");
  const abacus = e("\u{1F9EE}", "Abacus");
  const magnet = e("\u{1F9F2}", "Magnet");
  const telescope = e("\u{1F52D}", "Telescope");
  const science = gg("Science", "Science", {
      droplet,
      dropOfBlood,
      adhesiveBandage,
      stethoscope,
      syringe,
      pill,
      microscope,
      testTube,
      petriDish,
      dna,
      abacus,
      magnet,
      telescope,
      medical,
      balanceScale,
      alembic,
      gear,
      atomSymbol,
      magnifyingGlassTiltedLeft,
      magnifyingGlassTiltedRight,
  });
  const whiteChessKing = e("\u2654", "White Chess King");
  const whiteChessQueen = e("\u2655", "White Chess Queen");
  const whiteChessRook = e("\u2656", "White Chess Rook");
  const whiteChessBishop = e("\u2657", "White Chess Bishop");
  const whiteChessKnight = e("\u2658", "White Chess Knight");
  const whiteChessPawn = e("\u2659", "White Chess Pawn");
  const whiteChessPieces = gg(whiteChessKing.value + whiteChessQueen.value + whiteChessRook.value + whiteChessBishop.value + whiteChessKnight.value + whiteChessPawn.value, "White Chess Pieces", {
      width: "auto",
      king: whiteChessKing,
      queen: whiteChessQueen,
      rook: whiteChessRook,
      bishop: whiteChessBishop,
      knight: whiteChessKnight,
      pawn: whiteChessPawn
  });
  const blackChessKing = e("\u265A", "Black Chess King");
  const blackChessQueen = e("\u265B", "Black Chess Queen");
  const blackChessRook = e("\u265C", "Black Chess Rook");
  const blackChessBishop = e("\u265D", "Black Chess Bishop");
  const blackChessKnight = e("\u265E", "Black Chess Knight");
  const blackChessPawn = e("\u265F", "Black Chess Pawn");
  const blackChessPieces = gg(blackChessKing.value + blackChessQueen.value + blackChessRook.value + blackChessBishop.value + blackChessKnight.value + blackChessPawn.value, "Black Chess Pieces", {
      width: "auto",
      king: blackChessKing,
      queen: blackChessQueen,
      rook: blackChessRook,
      bishop: blackChessBishop,
      knight: blackChessKnight,
      pawn: blackChessPawn
  });
  const chessPawns = gg(whiteChessPawn.value + blackChessPawn.value, "Chess Pawns", {
      width: "auto",
      white: whiteChessPawn,
      black: blackChessPawn
  });
  const chessRooks = gg(whiteChessRook.value + blackChessRook.value, "Chess Rooks", {
      width: "auto",
      white: whiteChessRook,
      black: blackChessRook
  });
  const chessBishops = gg(whiteChessBishop.value + blackChessBishop.value, "Chess Bishops", {
      width: "auto",
      white: whiteChessBishop,
      black: blackChessBishop
  });
  const chessKnights = gg(whiteChessKnight.value + blackChessKnight.value, "Chess Knights", {
      width: "auto",
      white: whiteChessKnight,
      black: blackChessKnight
  });
  const chessQueens = gg(whiteChessQueen.value + blackChessQueen.value, "Chess Queens", {
      width: "auto",
      white: whiteChessQueen,
      black: blackChessQueen
  });
  const chessKings = gg(whiteChessKing.value + blackChessKing.value, "Chess Kings", {
      width: "auto",
      white: whiteChessKing,
      black: blackChessKing
  });
  const chess = gg("Chess Pieces", "Chess Pieces", {
      width: "auto",
      white: whiteChessPieces,
      black: blackChessPieces,
      pawns: chessPawns,
      rooks: chessRooks,
      bishops: chessBishops,
      knights: chessKnights,
      queens: chessQueens,
      kings: chessKings
  });
  const dice1 = e("\u2680", "Dice: Side 1");
  const dice2 = e("\u2681", "Dice: Side 2");
  const dice3 = e("\u2682", "Dice: Side 3");
  const dice4 = e("\u2683", "Dice: Side 4");
  const dice5 = e("\u2684", "Dice: Side 5");
  const dice6 = e("\u2685", "Dice: Side 6");
  const dice = gg("Dice", "Dice", {
      dice1,
      dice2,
      dice3,
      dice4,
      dice5,
      dice6
  });
  const allIcons = gg("All Icons", "All Icons", {
      faces,
      love,
      cartoon,
      hands,
      bodyParts,
      people,
      gestures,
      inMotion,
      resting,
      roles,
      fantasy,
      animals,
      plants,
      food,
      flags,
      vehicles,
      clocks,
      arrows,
      shapes,
      buttons,
      zodiac,
      chess,
      dice,
      math,
      games,
      sportsEquipment,
      clothing,
      town,
      music,
      weather,
      astro,
      finance,
      writing,
      science,
      tech,
      mail,
      celebration,
      tools,
      office,
      signs,
      religion,
      household,
      activities,
      travel,
      medieval
  });

  function add$1(a, b) {
      return async (v) => {
          await a(v);
          await b(v);
      };
  }

  class EventBase {
      constructor() {
          this.listeners = new Map();
          this.options = new Map();
      }
      addEventListener(type, callback, options) {
          if (isFunction(callback)) {
              let listeners = this.listeners.get(type);
              if (!listeners) {
                  listeners = new Array();
                  this.listeners.set(type, listeners);
              }
              if (!listeners.find(c => c === callback)) {
                  listeners.push(callback);
                  if (options) {
                      this.options.set(callback, options);
                  }
              }
          }
      }
      removeEventListener(type, callback) {
          if (isFunction(callback)) {
              const listeners = this.listeners.get(type);
              if (listeners) {
                  this.removeListener(listeners, callback);
              }
          }
      }
      removeListener(listeners, callback) {
          const idx = listeners.findIndex(c => c === callback);
          if (idx >= 0) {
              arrayRemoveAt(listeners, idx);
              if (this.options.has(callback)) {
                  this.options.delete(callback);
              }
          }
      }
      dispatchEvent(evt) {
          const listeners = this.listeners.get(evt.type);
          if (listeners) {
              for (const callback of listeners) {
                  const options = this.options.get(callback);
                  if (options && options.once) {
                      this.removeListener(listeners, callback);
                  }
                  callback.call(this, evt);
              }
          }
          return !evt.defaultPrevented;
      }
  }
  class TypedEventBase extends EventBase {
      constructor() {
          super(...arguments);
          this.mappedCallbacks = new Map();
      }
      addEventListener(type, callback, options) {
          let mappedCallback = this.mappedCallbacks.get(callback);
          if (mappedCallback == null) {
              mappedCallback = (evt) => callback(evt);
              this.mappedCallbacks.set(callback, mappedCallback);
          }
          super.addEventListener(type, mappedCallback, options);
      }
      removeEventListener(type, callback) {
          const mappedCallback = this.mappedCallbacks.get(callback);
          if (mappedCallback) {
              super.removeEventListener(type, mappedCallback);
          }
      }
      dispatchEvent(evt) {
          return super.dispatchEvent(evt);
      }
  }

  function once(target, resolveEvt, rejectEvt, timeout) {
      if (timeout == null
          && isGoodNumber(rejectEvt)) {
          timeout = rejectEvt;
          rejectEvt = undefined;
      }
      const hasResolveEvt = isString(resolveEvt);
      const hasRejectEvt = isString(rejectEvt);
      const hasTimeout = timeout != null;
      return new Promise((resolve, reject) => {
          if (hasResolveEvt) {
              const remove = () => {
                  target.removeEventListener(resolveEvt, resolve);
              };
              resolve = add$1(remove, resolve);
              reject = add$1(remove, reject);
          }
          if (hasRejectEvt) {
              const remove = () => {
                  target.removeEventListener(rejectEvt, reject);
              };
              resolve = add$1(remove, resolve);
              reject = add$1(remove, reject);
          }
          if (hasTimeout) {
              const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`), cancel = () => clearTimeout(timer);
              resolve = add$1(cancel, resolve);
              reject = add$1(cancel, reject);
          }
          if (hasResolveEvt) {
              target.addEventListener(resolveEvt, resolve);
          }
          if (hasRejectEvt) {
              target.addEventListener(rejectEvt, () => {
                  reject("Rejection event found");
              });
          }
      });
  }

  const gestures$1 = [
      "change",
      "click",
      "contextmenu",
      "dblclick",
      "mouseup",
      "pointerup",
      "reset",
      "submit",
      "touchend"
  ];
  function identityPromise() {
      return Promise.resolve();
  }
  /**
   * This is not an event handler that you can add to an element. It's a global event that
   * waits for the user to perform some sort of interaction with the website.
    */
  function onUserGesture(callback, test) {
      const realTest = isNullOrUndefined(test)
          ? identityPromise
          : test;
      const check = async (evt) => {
          if (evt.isTrusted && await realTest()) {
              for (const gesture of gestures$1) {
                  window.removeEventListener(gesture, check);
              }
              callback();
          }
      };
      for (const gesture of gestures$1) {
          window.addEventListener(gesture, check);
      }
  }

  function sleep(dt) {
      return new Promise((resolve) => {
          setTimeout(resolve, dt);
      });
  }

  function waitFor(test) {
      return new Promise((resolve) => {
          const handle = setInterval(() => {
              if (test()) {
                  clearInterval(handle);
                  resolve();
              }
          }, 100);
      });
  }

  /**
   * A setter functor for HTML attributes.
   **/
  class Attr {
      /**
       * Creates a new setter functor for HTML Attributes
       * @param key - the attribute name.
       * @param value - the value to set for the attribute.
       * @param tags - the HTML tags that support this attribute.
       */
      constructor(key, value, ...tags) {
          this.key = key;
          this.value = value;
          this.tags = tags.map(t => t.toLocaleUpperCase());
          Object.freeze(this);
      }
      /**
       * Set the attribute value on an HTMLElement
       * @param elem - the element on which to set the attribute.
       */
      apply(elem) {
          if (isHTMLElement(elem)) {
              const isValid = this.tags.length === 0
                  || this.tags.indexOf(elem.tagName) > -1;
              if (!isValid) {
                  console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
              }
              else if (this.key === "style") {
                  Object.assign(elem.style, this.value);
              }
              else if (this.key in elem) {
                  elem[this.key] = this.value;
              }
              else if (this.value === false) {
                  elem.removeAttribute(this.key);
              }
              else if (this.value === true) {
                  elem.setAttribute(this.key, "");
              }
              else {
                  elem.setAttribute(this.key, this.value);
              }
          }
          else {
              elem[this.key] = this.value;
          }
      }
  }
  /**
   * The audio or video should play as soon as possible.
    **/
  function autoPlay(value) { return new Attr("autoplay", value, "audio", "video"); }
  /**
   * Indicates whether the browser should show playback controls to the user.
    **/
  function controls(value) { return new Attr("controls", value, "audio", "video"); }
  /**
   * Indicates whether the audio will be initially silenced on page load.
    **/
  function muted(value) { return new Attr("muted", value, "audio", "video"); }
  /**
   * Indicates that the media element should play automatically on iOS.
    **/
  function playsInline(value) { return new Attr("playsInline", value, "audio", "video"); }
  /**
   * The URL of the embeddable content.
    **/
  function src(value) { return new Attr("src", value, "audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"); }
  /**
   * A MediaStream object to use as a source for an HTML video or audio element
    **/
  function srcObject(value) { return new Attr("srcObject", value, "audio", "video"); }
  class CssPropSet {
      constructor(...rest) {
          this.set = new Map();
          const set = (key, value) => {
              if (value || isBoolean(value)) {
                  this.set.set(key, value);
              }
              else if (this.set.has(key)) {
                  this.set.delete(key);
              }
          };
          for (const prop of rest) {
              if (prop instanceof Attr) {
                  const { key, value } = prop;
                  set(key, value);
              }
              else {
                  for (const [key, value] of prop.set.entries()) {
                      set(key, value);
                  }
              }
          }
      }
      /**
       * Set the attribute value on an HTMLElement
       * @param elem - the element on which to set the attribute.
       */
      apply(elem) {
          const style = isHTMLElement(elem)
              ? elem.style
              : elem;
          for (const prop of this.set.entries()) {
              const [key, value] = prop;
              style[key] = value;
          }
      }
  }
  /**
   * Combine style properties.
   **/
  function styles(...rest) {
      return new CssPropSet(...rest);
  }
  function display(v) { return new Attr("display", v); }
  function fontFamily(v) { return new Attr("fontFamily", v); }
  /**
   * A selection of fonts for preferred monospace rendering.
   **/
  const monospaceFonts = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
  /**
   * A selection of fonts for preferred monospace rendering.
   **/
  const monospaceFamily = fontFamily(monospaceFonts);
  /**
   * A selection of fonts that should match whatever the user's operating system normally uses.
   **/
  const systemFonts = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
  /**
   * A selection of fonts that should match whatever the user's operating system normally uses.
   **/
  const systemFamily = fontFamily(systemFonts);

  function hasNode(obj) {
      return "element" in obj && obj.element instanceof Node;
  }
  /**
   * Creates an HTML element for a given tag name.
   *
   * Boolean attributes that you want to default to true can be passed
   * as just the attribute creating function,
   *   e.g. `Audio(autoPlay)` vs `Audio(autoPlay(true))`
   * @param name - the name of the tag
   * @param rest - optional attributes, child elements, and text
   * @returns
   */
  function tag(name, ...rest) {
      let elem = null;
      for (const attr of rest) {
          if (attr instanceof Attr
              && attr.key === "id") {
              elem = document.getElementById(attr.value);
              break;
          }
      }
      if (elem == null) {
          elem = document.createElement(name);
      }
      for (let x of rest) {
          if (x != null) {
              if (isString(x)
                  || isNumber(x)
                  || isBoolean(x)
                  || x instanceof Date
                  || x instanceof Node
                  || hasNode(x)) {
                  if (hasNode(x)) {
                      x = x.element;
                  }
                  else if (!(x instanceof Node)) {
                      x = document.createTextNode(x.toLocaleString());
                  }
                  elem.appendChild(x);
              }
              else {
                  if (x instanceof Function) {
                      x = x(true);
                  }
                  x.apply(elem);
              }
          }
      }
      return elem;
  }
  function Audio(...rest) { return tag("audio", ...rest); }
  function Canvas(...rest) { return tag("canvas", ...rest); }
  function Script(...rest) { return tag("script", ...rest); }

  const hasOffscreenCanvas = "OffscreenCanvas" in globalThis;
  const hasImageBitmap = "createImageBitmap" in globalThis;
  const hasOffscreenCanvasRenderingContext2D = hasOffscreenCanvas && (function () {
      try {
          const canv = new OffscreenCanvas(1, 1);
          const g = canv.getContext("2d");
          return g != null;
      }
      catch (exp) {
          return false;
      }
  })();
  const hasImageBitmapRenderingContext = hasImageBitmap && (function () {
      try {
          const canv = hasOffscreenCanvas
              ? new OffscreenCanvas(1, 1)
              : Canvas();
          const g = canv.getContext("bitmaprenderer");
          return g != null;
      }
      catch (exp) {
          return false;
      }
  })();

  if (!Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "getTransform")
      && Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "mozCurrentTransform")) ;

  var CubeMapFaceIndex;
  (function (CubeMapFaceIndex) {
      CubeMapFaceIndex[CubeMapFaceIndex["None"] = -1] = "None";
      CubeMapFaceIndex[CubeMapFaceIndex["Left"] = 0] = "Left";
      CubeMapFaceIndex[CubeMapFaceIndex["Right"] = 1] = "Right";
      CubeMapFaceIndex[CubeMapFaceIndex["Up"] = 2] = "Up";
      CubeMapFaceIndex[CubeMapFaceIndex["Down"] = 3] = "Down";
      CubeMapFaceIndex[CubeMapFaceIndex["Back"] = 4] = "Back";
      CubeMapFaceIndex[CubeMapFaceIndex["Front"] = 5] = "Front";
  })(CubeMapFaceIndex || (CubeMapFaceIndex = {}));
  const cubemapPattern = {
      rows: 3,
      columns: 4,
      indices: [
          [CubeMapFaceIndex.None, CubeMapFaceIndex.Up, CubeMapFaceIndex.None, CubeMapFaceIndex.None],
          [CubeMapFaceIndex.Left, CubeMapFaceIndex.Front, CubeMapFaceIndex.Right, CubeMapFaceIndex.Back],
          [CubeMapFaceIndex.None, CubeMapFaceIndex.Down, CubeMapFaceIndex.None, CubeMapFaceIndex.None]
      ],
      rotations: [
          [0, 2, 0, 0],
          [0, 0, 0, 0],
          [0, 2, 0, 0]
      ]
  };

  /**
   * Force a value onto a range
   */
  function clamp(v, min, max) {
      return Math.min(max, Math.max(min, v));
  }

  const redrawnEvt = new Event("redrawn");

  // NOTE: this list must be up-to-date with browsers listed in
  // test/acceptance/useragentstrings.yml
  const BROWSER_ALIASES_MAP = {
    'Amazon Silk': 'amazon_silk',
    'Android Browser': 'android',
    Bada: 'bada',
    BlackBerry: 'blackberry',
    Chrome: 'chrome',
    Chromium: 'chromium',
    Electron: 'electron',
    Epiphany: 'epiphany',
    Firefox: 'firefox',
    Focus: 'focus',
    Generic: 'generic',
    'Google Search': 'google_search',
    Googlebot: 'googlebot',
    'Internet Explorer': 'ie',
    'K-Meleon': 'k_meleon',
    Maxthon: 'maxthon',
    'Microsoft Edge': 'edge',
    'MZ Browser': 'mz',
    'NAVER Whale Browser': 'naver',
    Opera: 'opera',
    'Opera Coast': 'opera_coast',
    PhantomJS: 'phantomjs',
    Puffin: 'puffin',
    QupZilla: 'qupzilla',
    QQ: 'qq',
    QQLite: 'qqlite',
    Safari: 'safari',
    Sailfish: 'sailfish',
    'Samsung Internet for Android': 'samsung_internet',
    SeaMonkey: 'seamonkey',
    Sleipnir: 'sleipnir',
    Swing: 'swing',
    Tizen: 'tizen',
    'UC Browser': 'uc',
    Vivaldi: 'vivaldi',
    'WebOS Browser': 'webos',
    WeChat: 'wechat',
    'Yandex Browser': 'yandex',
    Roku: 'roku',
  };

  const BROWSER_MAP = {
    amazon_silk: 'Amazon Silk',
    android: 'Android Browser',
    bada: 'Bada',
    blackberry: 'BlackBerry',
    chrome: 'Chrome',
    chromium: 'Chromium',
    electron: 'Electron',
    epiphany: 'Epiphany',
    firefox: 'Firefox',
    focus: 'Focus',
    generic: 'Generic',
    googlebot: 'Googlebot',
    google_search: 'Google Search',
    ie: 'Internet Explorer',
    k_meleon: 'K-Meleon',
    maxthon: 'Maxthon',
    edge: 'Microsoft Edge',
    mz: 'MZ Browser',
    naver: 'NAVER Whale Browser',
    opera: 'Opera',
    opera_coast: 'Opera Coast',
    phantomjs: 'PhantomJS',
    puffin: 'Puffin',
    qupzilla: 'QupZilla',
    qq: 'QQ Browser',
    qqlite: 'QQ Browser Lite',
    safari: 'Safari',
    sailfish: 'Sailfish',
    samsung_internet: 'Samsung Internet for Android',
    seamonkey: 'SeaMonkey',
    sleipnir: 'Sleipnir',
    swing: 'Swing',
    tizen: 'Tizen',
    uc: 'UC Browser',
    vivaldi: 'Vivaldi',
    webos: 'WebOS Browser',
    wechat: 'WeChat',
    yandex: 'Yandex Browser',
  };

  const PLATFORMS_MAP = {
    tablet: 'tablet',
    mobile: 'mobile',
    desktop: 'desktop',
    tv: 'tv',
  };

  const OS_MAP = {
    WindowsPhone: 'Windows Phone',
    Windows: 'Windows',
    MacOS: 'macOS',
    iOS: 'iOS',
    Android: 'Android',
    WebOS: 'WebOS',
    BlackBerry: 'BlackBerry',
    Bada: 'Bada',
    Tizen: 'Tizen',
    Linux: 'Linux',
    ChromeOS: 'Chrome OS',
    PlayStation4: 'PlayStation 4',
    Roku: 'Roku',
  };

  const ENGINE_MAP = {
    EdgeHTML: 'EdgeHTML',
    Blink: 'Blink',
    Trident: 'Trident',
    Presto: 'Presto',
    Gecko: 'Gecko',
    WebKit: 'WebKit',
  };

  class Utils {
    /**
     * Get first matched item for a string
     * @param {RegExp} regexp
     * @param {String} ua
     * @return {Array|{index: number, input: string}|*|boolean|string}
     */
    static getFirstMatch(regexp, ua) {
      const match = ua.match(regexp);
      return (match && match.length > 0 && match[1]) || '';
    }

    /**
     * Get second matched item for a string
     * @param regexp
     * @param {String} ua
     * @return {Array|{index: number, input: string}|*|boolean|string}
     */
    static getSecondMatch(regexp, ua) {
      const match = ua.match(regexp);
      return (match && match.length > 1 && match[2]) || '';
    }

    /**
     * Match a regexp and return a constant or undefined
     * @param {RegExp} regexp
     * @param {String} ua
     * @param {*} _const Any const that will be returned if regexp matches the string
     * @return {*}
     */
    static matchAndReturnConst(regexp, ua, _const) {
      if (regexp.test(ua)) {
        return _const;
      }
      return void (0);
    }

    static getWindowsVersionName(version) {
      switch (version) {
        case 'NT': return 'NT';
        case 'XP': return 'XP';
        case 'NT 5.0': return '2000';
        case 'NT 5.1': return 'XP';
        case 'NT 5.2': return '2003';
        case 'NT 6.0': return 'Vista';
        case 'NT 6.1': return '7';
        case 'NT 6.2': return '8';
        case 'NT 6.3': return '8.1';
        case 'NT 10.0': return '10';
        default: return undefined;
      }
    }

    /**
     * Get macOS version name
     *    10.5 - Leopard
     *    10.6 - Snow Leopard
     *    10.7 - Lion
     *    10.8 - Mountain Lion
     *    10.9 - Mavericks
     *    10.10 - Yosemite
     *    10.11 - El Capitan
     *    10.12 - Sierra
     *    10.13 - High Sierra
     *    10.14 - Mojave
     *    10.15 - Catalina
     *
     * @example
     *   getMacOSVersionName("10.14") // 'Mojave'
     *
     * @param  {string} version
     * @return {string} versionName
     */
    static getMacOSVersionName(version) {
      const v = version.split('.').splice(0, 2).map(s => parseInt(s, 10) || 0);
      v.push(0);
      if (v[0] !== 10) return undefined;
      switch (v[1]) {
        case 5: return 'Leopard';
        case 6: return 'Snow Leopard';
        case 7: return 'Lion';
        case 8: return 'Mountain Lion';
        case 9: return 'Mavericks';
        case 10: return 'Yosemite';
        case 11: return 'El Capitan';
        case 12: return 'Sierra';
        case 13: return 'High Sierra';
        case 14: return 'Mojave';
        case 15: return 'Catalina';
        default: return undefined;
      }
    }

    /**
     * Get Android version name
     *    1.5 - Cupcake
     *    1.6 - Donut
     *    2.0 - Eclair
     *    2.1 - Eclair
     *    2.2 - Froyo
     *    2.x - Gingerbread
     *    3.x - Honeycomb
     *    4.0 - Ice Cream Sandwich
     *    4.1 - Jelly Bean
     *    4.4 - KitKat
     *    5.x - Lollipop
     *    6.x - Marshmallow
     *    7.x - Nougat
     *    8.x - Oreo
     *    9.x - Pie
     *
     * @example
     *   getAndroidVersionName("7.0") // 'Nougat'
     *
     * @param  {string} version
     * @return {string} versionName
     */
    static getAndroidVersionName(version) {
      const v = version.split('.').splice(0, 2).map(s => parseInt(s, 10) || 0);
      v.push(0);
      if (v[0] === 1 && v[1] < 5) return undefined;
      if (v[0] === 1 && v[1] < 6) return 'Cupcake';
      if (v[0] === 1 && v[1] >= 6) return 'Donut';
      if (v[0] === 2 && v[1] < 2) return 'Eclair';
      if (v[0] === 2 && v[1] === 2) return 'Froyo';
      if (v[0] === 2 && v[1] > 2) return 'Gingerbread';
      if (v[0] === 3) return 'Honeycomb';
      if (v[0] === 4 && v[1] < 1) return 'Ice Cream Sandwich';
      if (v[0] === 4 && v[1] < 4) return 'Jelly Bean';
      if (v[0] === 4 && v[1] >= 4) return 'KitKat';
      if (v[0] === 5) return 'Lollipop';
      if (v[0] === 6) return 'Marshmallow';
      if (v[0] === 7) return 'Nougat';
      if (v[0] === 8) return 'Oreo';
      if (v[0] === 9) return 'Pie';
      return undefined;
    }

    /**
     * Get version precisions count
     *
     * @example
     *   getVersionPrecision("1.10.3") // 3
     *
     * @param  {string} version
     * @return {number}
     */
    static getVersionPrecision(version) {
      return version.split('.').length;
    }

    /**
     * Calculate browser version weight
     *
     * @example
     *   compareVersions('1.10.2.1',  '1.8.2.1.90')    // 1
     *   compareVersions('1.010.2.1', '1.09.2.1.90');  // 1
     *   compareVersions('1.10.2.1',  '1.10.2.1');     // 0
     *   compareVersions('1.10.2.1',  '1.0800.2');     // -1
     *   compareVersions('1.10.2.1',  '1.10',  true);  // 0
     *
     * @param {String} versionA versions versions to compare
     * @param {String} versionB versions versions to compare
     * @param {boolean} [isLoose] enable loose comparison
     * @return {Number} comparison result: -1 when versionA is lower,
     * 1 when versionA is bigger, 0 when both equal
     */
    /* eslint consistent-return: 1 */
    static compareVersions(versionA, versionB, isLoose = false) {
      // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
      const versionAPrecision = Utils.getVersionPrecision(versionA);
      const versionBPrecision = Utils.getVersionPrecision(versionB);

      let precision = Math.max(versionAPrecision, versionBPrecision);
      let lastPrecision = 0;

      const chunks = Utils.map([versionA, versionB], (version) => {
        const delta = precision - Utils.getVersionPrecision(version);

        // 2) "9" -> "9.0" (for precision = 2)
        const _version = version + new Array(delta + 1).join('.0');

        // 3) "9.0" -> ["000000000"", "000000009"]
        return Utils.map(_version.split('.'), chunk => new Array(20 - chunk.length).join('0') + chunk).reverse();
      });

      // adjust precision for loose comparison
      if (isLoose) {
        lastPrecision = precision - Math.min(versionAPrecision, versionBPrecision);
      }

      // iterate in reverse order by reversed chunks array
      precision -= 1;
      while (precision >= lastPrecision) {
        // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
        if (chunks[0][precision] > chunks[1][precision]) {
          return 1;
        }

        if (chunks[0][precision] === chunks[1][precision]) {
          if (precision === lastPrecision) {
            // all version chunks are same
            return 0;
          }

          precision -= 1;
        } else if (chunks[0][precision] < chunks[1][precision]) {
          return -1;
        }
      }

      return undefined;
    }

    /**
     * Array::map polyfill
     *
     * @param  {Array} arr
     * @param  {Function} iterator
     * @return {Array}
     */
    static map(arr, iterator) {
      const result = [];
      let i;
      if (Array.prototype.map) {
        return Array.prototype.map.call(arr, iterator);
      }
      for (i = 0; i < arr.length; i += 1) {
        result.push(iterator(arr[i]));
      }
      return result;
    }

    /**
     * Array::find polyfill
     *
     * @param  {Array} arr
     * @param  {Function} predicate
     * @return {Array}
     */
    static find(arr, predicate) {
      let i;
      let l;
      if (Array.prototype.find) {
        return Array.prototype.find.call(arr, predicate);
      }
      for (i = 0, l = arr.length; i < l; i += 1) {
        const value = arr[i];
        if (predicate(value, i)) {
          return value;
        }
      }
      return undefined;
    }

    /**
     * Object::assign polyfill
     *
     * @param  {Object} obj
     * @param  {Object} ...objs
     * @return {Object}
     */
    static assign(obj, ...assigners) {
      const result = obj;
      let i;
      let l;
      if (Object.assign) {
        return Object.assign(obj, ...assigners);
      }
      for (i = 0, l = assigners.length; i < l; i += 1) {
        const assigner = assigners[i];
        if (typeof assigner === 'object' && assigner !== null) {
          const keys = Object.keys(assigner);
          keys.forEach((key) => {
            result[key] = assigner[key];
          });
        }
      }
      return obj;
    }

    /**
     * Get short version/alias for a browser name
     *
     * @example
     *   getBrowserAlias('Microsoft Edge') // edge
     *
     * @param  {string} browserName
     * @return {string}
     */
    static getBrowserAlias(browserName) {
      return BROWSER_ALIASES_MAP[browserName];
    }

    /**
     * Get short version/alias for a browser name
     *
     * @example
     *   getBrowserAlias('edge') // Microsoft Edge
     *
     * @param  {string} browserAlias
     * @return {string}
     */
    static getBrowserTypeByAlias(browserAlias) {
      return BROWSER_MAP[browserAlias] || '';
    }
  }

  /**
   * Browsers' descriptors
   *
   * The idea of descriptors is simple. You should know about them two simple things:
   * 1. Every descriptor has a method or property called `test` and a `describe` method.
   * 2. Order of descriptors is important.
   *
   * More details:
   * 1. Method or property `test` serves as a way to detect whether the UA string
   * matches some certain browser or not. The `describe` method helps to make a result
   * object with params that show some browser-specific things: name, version, etc.
   * 2. Order of descriptors is important because a Parser goes through them one by one
   * in course. For example, if you insert Chrome's descriptor as the first one,
   * more then a half of browsers will be described as Chrome, because they will pass
   * the Chrome descriptor's test.
   *
   * Descriptor's `test` could be a property with an array of RegExps, where every RegExp
   * will be applied to a UA string to test it whether it matches or not.
   * If a descriptor has two or more regexps in the `test` array it tests them one by one
   * with a logical sum operation. Parser stops if it has found any RegExp that matches the UA.
   *
   * Or `test` could be a method. In that case it gets a Parser instance and should
   * return true/false to get the Parser know if this browser descriptor matches the UA or not.
   */

  const commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;

  const browsersList = [
    /* Googlebot */
    {
      test: [/googlebot/i],
      describe(ua) {
        const browser = {
          name: 'Googlebot',
        };
        const version = Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },

    /* Opera < 13.0 */
    {
      test: [/opera/i],
      describe(ua) {
        const browser = {
          name: 'Opera',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },

    /* Opera > 13.0 */
    {
      test: [/opr\/|opios/i],
      describe(ua) {
        const browser = {
          name: 'Opera',
        };
        const version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/SamsungBrowser/i],
      describe(ua) {
        const browser = {
          name: 'Samsung Internet for Android',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/Whale/i],
      describe(ua) {
        const browser = {
          name: 'NAVER Whale Browser',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/MZBrowser/i],
      describe(ua) {
        const browser = {
          name: 'MZ Browser',
        };
        const version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/focus/i],
      describe(ua) {
        const browser = {
          name: 'Focus',
        };
        const version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/swing/i],
      describe(ua) {
        const browser = {
          name: 'Swing',
        };
        const version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/coast/i],
      describe(ua) {
        const browser = {
          name: 'Opera Coast',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/opt\/\d+(?:.?_?\d+)+/i],
      describe(ua) {
        const browser = {
          name: 'Opera Touch',
        };
        const version = Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/yabrowser/i],
      describe(ua) {
        const browser = {
          name: 'Yandex Browser',
        };
        const version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/ucbrowser/i],
      describe(ua) {
        const browser = {
          name: 'UC Browser',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/Maxthon|mxios/i],
      describe(ua) {
        const browser = {
          name: 'Maxthon',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/epiphany/i],
      describe(ua) {
        const browser = {
          name: 'Epiphany',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/puffin/i],
      describe(ua) {
        const browser = {
          name: 'Puffin',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/sleipnir/i],
      describe(ua) {
        const browser = {
          name: 'Sleipnir',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/k-meleon/i],
      describe(ua) {
        const browser = {
          name: 'K-Meleon',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/micromessenger/i],
      describe(ua) {
        const browser = {
          name: 'WeChat',
        };
        const version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/qqbrowser/i],
      describe(ua) {
        const browser = {
          name: (/qqbrowserlite/i).test(ua) ? 'QQ Browser Lite' : 'QQ Browser',
        };
        const version = Utils.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/msie|trident/i],
      describe(ua) {
        const browser = {
          name: 'Internet Explorer',
        };
        const version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/\sedg\//i],
      describe(ua) {
        const browser = {
          name: 'Microsoft Edge',
        };

        const version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/edg([ea]|ios)/i],
      describe(ua) {
        const browser = {
          name: 'Microsoft Edge',
        };

        const version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/vivaldi/i],
      describe(ua) {
        const browser = {
          name: 'Vivaldi',
        };
        const version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/seamonkey/i],
      describe(ua) {
        const browser = {
          name: 'SeaMonkey',
        };
        const version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/sailfish/i],
      describe(ua) {
        const browser = {
          name: 'Sailfish',
        };

        const version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/silk/i],
      describe(ua) {
        const browser = {
          name: 'Amazon Silk',
        };
        const version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/phantom/i],
      describe(ua) {
        const browser = {
          name: 'PhantomJS',
        };
        const version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/slimerjs/i],
      describe(ua) {
        const browser = {
          name: 'SlimerJS',
        };
        const version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
      describe(ua) {
        const browser = {
          name: 'BlackBerry',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/(web|hpw)[o0]s/i],
      describe(ua) {
        const browser = {
          name: 'WebOS Browser',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/bada/i],
      describe(ua) {
        const browser = {
          name: 'Bada',
        };
        const version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/tizen/i],
      describe(ua) {
        const browser = {
          name: 'Tizen',
        };
        const version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/qupzilla/i],
      describe(ua) {
        const browser = {
          name: 'QupZilla',
        };
        const version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/firefox|iceweasel|fxios/i],
      describe(ua) {
        const browser = {
          name: 'Firefox',
        };
        const version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/electron/i],
      describe(ua) {
        const browser = {
          name: 'Electron',
        };
        const version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/MiuiBrowser/i],
      describe(ua) {
        const browser = {
          name: 'Miui',
        };
        const version = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/chromium/i],
      describe(ua) {
        const browser = {
          name: 'Chromium',
        };
        const version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/chrome|crios|crmo/i],
      describe(ua) {
        const browser = {
          name: 'Chrome',
        };
        const version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },
    {
      test: [/GSA/i],
      describe(ua) {
        const browser = {
          name: 'Google Search',
        };
        const version = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },

    /* Android Browser */
    {
      test(parser) {
        const notLikeAndroid = !parser.test(/like android/i);
        const butAndroid = parser.test(/android/i);
        return notLikeAndroid && butAndroid;
      },
      describe(ua) {
        const browser = {
          name: 'Android Browser',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },

    /* PlayStation 4 */
    {
      test: [/playstation 4/i],
      describe(ua) {
        const browser = {
          name: 'PlayStation 4',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },

    /* Safari */
    {
      test: [/safari|applewebkit/i],
      describe(ua) {
        const browser = {
          name: 'Safari',
        };
        const version = Utils.getFirstMatch(commonVersionIdentifier, ua);

        if (version) {
          browser.version = version;
        }

        return browser;
      },
    },

    /* Something else */
    {
      test: [/.*/i],
      describe(ua) {
        /* Here we try to make sure that there are explicit details about the device
         * in order to decide what regexp exactly we want to apply
         * (as there is a specific decision based on that conclusion)
         */
        const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
        const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
        const hasDeviceSpec = ua.search('\\(') !== -1;
        const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
        return {
          name: Utils.getFirstMatch(regexp, ua),
          version: Utils.getSecondMatch(regexp, ua),
        };
      },
    },
  ];

  var osParsersList = [
    /* Roku */
    {
      test: [/Roku\/DVP/],
      describe(ua) {
        const version = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
        return {
          name: OS_MAP.Roku,
          version,
        };
      },
    },

    /* Windows Phone */
    {
      test: [/windows phone/i],
      describe(ua) {
        const version = Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
        return {
          name: OS_MAP.WindowsPhone,
          version,
        };
      },
    },

    /* Windows */
    {
      test: [/windows /i],
      describe(ua) {
        const version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
        const versionName = Utils.getWindowsVersionName(version);

        return {
          name: OS_MAP.Windows,
          version,
          versionName,
        };
      },
    },

    /* Firefox on iPad */
    {
      test: [/Macintosh(.*?) FxiOS(.*?)\//],
      describe(ua) {
        const result = {
          name: OS_MAP.iOS,
        };
        const version = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
        if (version) {
          result.version = version;
        }
        return result;
      },
    },

    /* macOS */
    {
      test: [/macintosh/i],
      describe(ua) {
        const version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, '.');
        const versionName = Utils.getMacOSVersionName(version);

        const os = {
          name: OS_MAP.MacOS,
          version,
        };
        if (versionName) {
          os.versionName = versionName;
        }
        return os;
      },
    },

    /* iOS */
    {
      test: [/(ipod|iphone|ipad)/i],
      describe(ua) {
        const version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, '.');

        return {
          name: OS_MAP.iOS,
          version,
        };
      },
    },

    /* Android */
    {
      test(parser) {
        const notLikeAndroid = !parser.test(/like android/i);
        const butAndroid = parser.test(/android/i);
        return notLikeAndroid && butAndroid;
      },
      describe(ua) {
        const version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
        const versionName = Utils.getAndroidVersionName(version);
        const os = {
          name: OS_MAP.Android,
          version,
        };
        if (versionName) {
          os.versionName = versionName;
        }
        return os;
      },
    },

    /* WebOS */
    {
      test: [/(web|hpw)[o0]s/i],
      describe(ua) {
        const version = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
        const os = {
          name: OS_MAP.WebOS,
        };

        if (version && version.length) {
          os.version = version;
        }
        return os;
      },
    },

    /* BlackBerry */
    {
      test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
      describe(ua) {
        const version = Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua)
          || Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua)
          || Utils.getFirstMatch(/\bbb(\d+)/i, ua);

        return {
          name: OS_MAP.BlackBerry,
          version,
        };
      },
    },

    /* Bada */
    {
      test: [/bada/i],
      describe(ua) {
        const version = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);

        return {
          name: OS_MAP.Bada,
          version,
        };
      },
    },

    /* Tizen */
    {
      test: [/tizen/i],
      describe(ua) {
        const version = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);

        return {
          name: OS_MAP.Tizen,
          version,
        };
      },
    },

    /* Linux */
    {
      test: [/linux/i],
      describe() {
        return {
          name: OS_MAP.Linux,
        };
      },
    },

    /* Chrome OS */
    {
      test: [/CrOS/],
      describe() {
        return {
          name: OS_MAP.ChromeOS,
        };
      },
    },

    /* Playstation 4 */
    {
      test: [/PlayStation 4/],
      describe(ua) {
        const version = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
        return {
          name: OS_MAP.PlayStation4,
          version,
        };
      },
    },
  ];

  /*
   * Tablets go first since usually they have more specific
   * signs to detect.
   */

  var platformParsersList = [
    /* Googlebot */
    {
      test: [/googlebot/i],
      describe() {
        return {
          type: 'bot',
          vendor: 'Google',
        };
      },
    },

    /* Huawei */
    {
      test: [/huawei/i],
      describe(ua) {
        const model = Utils.getFirstMatch(/(can-l01)/i, ua) && 'Nova';
        const platform = {
          type: PLATFORMS_MAP.mobile,
          vendor: 'Huawei',
        };
        if (model) {
          platform.model = model;
        }
        return platform;
      },
    },

    /* Nexus Tablet */
    {
      test: [/nexus\s*(?:7|8|9|10).*/i],
      describe() {
        return {
          type: PLATFORMS_MAP.tablet,
          vendor: 'Nexus',
        };
      },
    },

    /* iPad */
    {
      test: [/ipad/i],
      describe() {
        return {
          type: PLATFORMS_MAP.tablet,
          vendor: 'Apple',
          model: 'iPad',
        };
      },
    },

    /* Firefox on iPad */
    {
      test: [/Macintosh(.*?) FxiOS(.*?)\//],
      describe() {
        return {
          type: PLATFORMS_MAP.tablet,
          vendor: 'Apple',
          model: 'iPad',
        };
      },
    },

    /* Amazon Kindle Fire */
    {
      test: [/kftt build/i],
      describe() {
        return {
          type: PLATFORMS_MAP.tablet,
          vendor: 'Amazon',
          model: 'Kindle Fire HD 7',
        };
      },
    },

    /* Another Amazon Tablet with Silk */
    {
      test: [/silk/i],
      describe() {
        return {
          type: PLATFORMS_MAP.tablet,
          vendor: 'Amazon',
        };
      },
    },

    /* Tablet */
    {
      test: [/tablet(?! pc)/i],
      describe() {
        return {
          type: PLATFORMS_MAP.tablet,
        };
      },
    },

    /* iPod/iPhone */
    {
      test(parser) {
        const iDevice = parser.test(/ipod|iphone/i);
        const likeIDevice = parser.test(/like (ipod|iphone)/i);
        return iDevice && !likeIDevice;
      },
      describe(ua) {
        const model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
        return {
          type: PLATFORMS_MAP.mobile,
          vendor: 'Apple',
          model,
        };
      },
    },

    /* Nexus Mobile */
    {
      test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
      describe() {
        return {
          type: PLATFORMS_MAP.mobile,
          vendor: 'Nexus',
        };
      },
    },

    /* Mobile */
    {
      test: [/[^-]mobi/i],
      describe() {
        return {
          type: PLATFORMS_MAP.mobile,
        };
      },
    },

    /* BlackBerry */
    {
      test(parser) {
        return parser.getBrowserName(true) === 'blackberry';
      },
      describe() {
        return {
          type: PLATFORMS_MAP.mobile,
          vendor: 'BlackBerry',
        };
      },
    },

    /* Bada */
    {
      test(parser) {
        return parser.getBrowserName(true) === 'bada';
      },
      describe() {
        return {
          type: PLATFORMS_MAP.mobile,
        };
      },
    },

    /* Windows Phone */
    {
      test(parser) {
        return parser.getBrowserName() === 'windows phone';
      },
      describe() {
        return {
          type: PLATFORMS_MAP.mobile,
          vendor: 'Microsoft',
        };
      },
    },

    /* Android Tablet */
    {
      test(parser) {
        const osMajorVersion = Number(String(parser.getOSVersion()).split('.')[0]);
        return parser.getOSName(true) === 'android' && (osMajorVersion >= 3);
      },
      describe() {
        return {
          type: PLATFORMS_MAP.tablet,
        };
      },
    },

    /* Android Mobile */
    {
      test(parser) {
        return parser.getOSName(true) === 'android';
      },
      describe() {
        return {
          type: PLATFORMS_MAP.mobile,
        };
      },
    },

    /* desktop */
    {
      test(parser) {
        return parser.getOSName(true) === 'macos';
      },
      describe() {
        return {
          type: PLATFORMS_MAP.desktop,
          vendor: 'Apple',
        };
      },
    },

    /* Windows */
    {
      test(parser) {
        return parser.getOSName(true) === 'windows';
      },
      describe() {
        return {
          type: PLATFORMS_MAP.desktop,
        };
      },
    },

    /* Linux */
    {
      test(parser) {
        return parser.getOSName(true) === 'linux';
      },
      describe() {
        return {
          type: PLATFORMS_MAP.desktop,
        };
      },
    },

    /* PlayStation 4 */
    {
      test(parser) {
        return parser.getOSName(true) === 'playstation 4';
      },
      describe() {
        return {
          type: PLATFORMS_MAP.tv,
        };
      },
    },

    /* Roku */
    {
      test(parser) {
        return parser.getOSName(true) === 'roku';
      },
      describe() {
        return {
          type: PLATFORMS_MAP.tv,
        };
      },
    },
  ];

  /*
   * More specific goes first
   */
  var enginesParsersList = [
    /* EdgeHTML */
    {
      test(parser) {
        return parser.getBrowserName(true) === 'microsoft edge';
      },
      describe(ua) {
        const isBlinkBased = /\sedg\//i.test(ua);

        // return blink if it's blink-based one
        if (isBlinkBased) {
          return {
            name: ENGINE_MAP.Blink,
          };
        }

        // otherwise match the version and return EdgeHTML
        const version = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, ua);

        return {
          name: ENGINE_MAP.EdgeHTML,
          version,
        };
      },
    },

    /* Trident */
    {
      test: [/trident/i],
      describe(ua) {
        const engine = {
          name: ENGINE_MAP.Trident,
        };

        const version = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          engine.version = version;
        }

        return engine;
      },
    },

    /* Presto */
    {
      test(parser) {
        return parser.test(/presto/i);
      },
      describe(ua) {
        const engine = {
          name: ENGINE_MAP.Presto,
        };

        const version = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          engine.version = version;
        }

        return engine;
      },
    },

    /* Gecko */
    {
      test(parser) {
        const isGecko = parser.test(/gecko/i);
        const likeGecko = parser.test(/like gecko/i);
        return isGecko && !likeGecko;
      },
      describe(ua) {
        const engine = {
          name: ENGINE_MAP.Gecko,
        };

        const version = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          engine.version = version;
        }

        return engine;
      },
    },

    /* Blink */
    {
      test: [/(apple)?webkit\/537\.36/i],
      describe() {
        return {
          name: ENGINE_MAP.Blink,
        };
      },
    },

    /* WebKit */
    {
      test: [/(apple)?webkit/i],
      describe(ua) {
        const engine = {
          name: ENGINE_MAP.WebKit,
        };

        const version = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, ua);

        if (version) {
          engine.version = version;
        }

        return engine;
      },
    },
  ];

  /**
   * The main class that arranges the whole parsing process.
   */
  class Parser {
    /**
     * Create instance of Parser
     *
     * @param {String} UA User-Agent string
     * @param {Boolean} [skipParsing=false] parser can skip parsing in purpose of performance
     * improvements if you need to make a more particular parsing
     * like {@link Parser#parseBrowser} or {@link Parser#parsePlatform}
     *
     * @throw {Error} in case of empty UA String
     *
     * @constructor
     */
    constructor(UA, skipParsing = false) {
      if (UA === void (0) || UA === null || UA === '') {
        throw new Error("UserAgent parameter can't be empty");
      }

      this._ua = UA;

      /**
       * @typedef ParsedResult
       * @property {Object} browser
       * @property {String|undefined} [browser.name]
       * Browser name, like `"Chrome"` or `"Internet Explorer"`
       * @property {String|undefined} [browser.version] Browser version as a String `"12.01.45334.10"`
       * @property {Object} os
       * @property {String|undefined} [os.name] OS name, like `"Windows"` or `"macOS"`
       * @property {String|undefined} [os.version] OS version, like `"NT 5.1"` or `"10.11.1"`
       * @property {String|undefined} [os.versionName] OS name, like `"XP"` or `"High Sierra"`
       * @property {Object} platform
       * @property {String|undefined} [platform.type]
       * platform type, can be either `"desktop"`, `"tablet"` or `"mobile"`
       * @property {String|undefined} [platform.vendor] Vendor of the device,
       * like `"Apple"` or `"Samsung"`
       * @property {String|undefined} [platform.model] Device model,
       * like `"iPhone"` or `"Kindle Fire HD 7"`
       * @property {Object} engine
       * @property {String|undefined} [engine.name]
       * Can be any of this: `WebKit`, `Blink`, `Gecko`, `Trident`, `Presto`, `EdgeHTML`
       * @property {String|undefined} [engine.version] String version of the engine
       */
      this.parsedResult = {};

      if (skipParsing !== true) {
        this.parse();
      }
    }

    /**
     * Get UserAgent string of current Parser instance
     * @return {String} User-Agent String of the current <Parser> object
     *
     * @public
     */
    getUA() {
      return this._ua;
    }

    /**
     * Test a UA string for a regexp
     * @param {RegExp} regex
     * @return {Boolean}
     */
    test(regex) {
      return regex.test(this._ua);
    }

    /**
     * Get parsed browser object
     * @return {Object}
     */
    parseBrowser() {
      this.parsedResult.browser = {};

      const browserDescriptor = Utils.find(browsersList, (_browser) => {
        if (typeof _browser.test === 'function') {
          return _browser.test(this);
        }

        if (_browser.test instanceof Array) {
          return _browser.test.some(condition => this.test(condition));
        }

        throw new Error("Browser's test function is not valid");
      });

      if (browserDescriptor) {
        this.parsedResult.browser = browserDescriptor.describe(this.getUA());
      }

      return this.parsedResult.browser;
    }

    /**
     * Get parsed browser object
     * @return {Object}
     *
     * @public
     */
    getBrowser() {
      if (this.parsedResult.browser) {
        return this.parsedResult.browser;
      }

      return this.parseBrowser();
    }

    /**
     * Get browser's name
     * @return {String} Browser's name or an empty string
     *
     * @public
     */
    getBrowserName(toLowerCase) {
      if (toLowerCase) {
        return String(this.getBrowser().name).toLowerCase() || '';
      }
      return this.getBrowser().name || '';
    }


    /**
     * Get browser's version
     * @return {String} version of browser
     *
     * @public
     */
    getBrowserVersion() {
      return this.getBrowser().version;
    }

    /**
     * Get OS
     * @return {Object}
     *
     * @example
     * this.getOS();
     * {
     *   name: 'macOS',
     *   version: '10.11.12'
     * }
     */
    getOS() {
      if (this.parsedResult.os) {
        return this.parsedResult.os;
      }

      return this.parseOS();
    }

    /**
     * Parse OS and save it to this.parsedResult.os
     * @return {*|{}}
     */
    parseOS() {
      this.parsedResult.os = {};

      const os = Utils.find(osParsersList, (_os) => {
        if (typeof _os.test === 'function') {
          return _os.test(this);
        }

        if (_os.test instanceof Array) {
          return _os.test.some(condition => this.test(condition));
        }

        throw new Error("Browser's test function is not valid");
      });

      if (os) {
        this.parsedResult.os = os.describe(this.getUA());
      }

      return this.parsedResult.os;
    }

    /**
     * Get OS name
     * @param {Boolean} [toLowerCase] return lower-cased value
     * @return {String} name of the OS — macOS, Windows, Linux, etc.
     */
    getOSName(toLowerCase) {
      const { name } = this.getOS();

      if (toLowerCase) {
        return String(name).toLowerCase() || '';
      }

      return name || '';
    }

    /**
     * Get OS version
     * @return {String} full version with dots ('10.11.12', '5.6', etc)
     */
    getOSVersion() {
      return this.getOS().version;
    }

    /**
     * Get parsed platform
     * @return {{}}
     */
    getPlatform() {
      if (this.parsedResult.platform) {
        return this.parsedResult.platform;
      }

      return this.parsePlatform();
    }

    /**
     * Get platform name
     * @param {Boolean} [toLowerCase=false]
     * @return {*}
     */
    getPlatformType(toLowerCase = false) {
      const { type } = this.getPlatform();

      if (toLowerCase) {
        return String(type).toLowerCase() || '';
      }

      return type || '';
    }

    /**
     * Get parsed platform
     * @return {{}}
     */
    parsePlatform() {
      this.parsedResult.platform = {};

      const platform = Utils.find(platformParsersList, (_platform) => {
        if (typeof _platform.test === 'function') {
          return _platform.test(this);
        }

        if (_platform.test instanceof Array) {
          return _platform.test.some(condition => this.test(condition));
        }

        throw new Error("Browser's test function is not valid");
      });

      if (platform) {
        this.parsedResult.platform = platform.describe(this.getUA());
      }

      return this.parsedResult.platform;
    }

    /**
     * Get parsed engine
     * @return {{}}
     */
    getEngine() {
      if (this.parsedResult.engine) {
        return this.parsedResult.engine;
      }

      return this.parseEngine();
    }

    /**
     * Get engines's name
     * @return {String} Engines's name or an empty string
     *
     * @public
     */
    getEngineName(toLowerCase) {
      if (toLowerCase) {
        return String(this.getEngine().name).toLowerCase() || '';
      }
      return this.getEngine().name || '';
    }

    /**
     * Get parsed platform
     * @return {{}}
     */
    parseEngine() {
      this.parsedResult.engine = {};

      const engine = Utils.find(enginesParsersList, (_engine) => {
        if (typeof _engine.test === 'function') {
          return _engine.test(this);
        }

        if (_engine.test instanceof Array) {
          return _engine.test.some(condition => this.test(condition));
        }

        throw new Error("Browser's test function is not valid");
      });

      if (engine) {
        this.parsedResult.engine = engine.describe(this.getUA());
      }

      return this.parsedResult.engine;
    }

    /**
     * Parse full information about the browser
     * @returns {Parser}
     */
    parse() {
      this.parseBrowser();
      this.parseOS();
      this.parsePlatform();
      this.parseEngine();

      return this;
    }

    /**
     * Get parsed result
     * @return {ParsedResult}
     */
    getResult() {
      return Utils.assign({}, this.parsedResult);
    }

    /**
     * Check if parsed browser matches certain conditions
     *
     * @param {Object} checkTree It's one or two layered object,
     * which can include a platform or an OS on the first layer
     * and should have browsers specs on the bottom-laying layer
     *
     * @returns {Boolean|undefined} Whether the browser satisfies the set conditions or not.
     * Returns `undefined` when the browser is no described in the checkTree object.
     *
     * @example
     * const browser = Bowser.getParser(window.navigator.userAgent);
     * if (browser.satisfies({chrome: '>118.01.1322' }))
     * // or with os
     * if (browser.satisfies({windows: { chrome: '>118.01.1322' } }))
     * // or with platforms
     * if (browser.satisfies({desktop: { chrome: '>118.01.1322' } }))
     */
    satisfies(checkTree) {
      const platformsAndOSes = {};
      let platformsAndOSCounter = 0;
      const browsers = {};
      let browsersCounter = 0;

      const allDefinitions = Object.keys(checkTree);

      allDefinitions.forEach((key) => {
        const currentDefinition = checkTree[key];
        if (typeof currentDefinition === 'string') {
          browsers[key] = currentDefinition;
          browsersCounter += 1;
        } else if (typeof currentDefinition === 'object') {
          platformsAndOSes[key] = currentDefinition;
          platformsAndOSCounter += 1;
        }
      });

      if (platformsAndOSCounter > 0) {
        const platformsAndOSNames = Object.keys(platformsAndOSes);
        const OSMatchingDefinition = Utils.find(platformsAndOSNames, name => (this.isOS(name)));

        if (OSMatchingDefinition) {
          const osResult = this.satisfies(platformsAndOSes[OSMatchingDefinition]);

          if (osResult !== void 0) {
            return osResult;
          }
        }

        const platformMatchingDefinition = Utils.find(
          platformsAndOSNames,
          name => (this.isPlatform(name)),
        );
        if (platformMatchingDefinition) {
          const platformResult = this.satisfies(platformsAndOSes[platformMatchingDefinition]);

          if (platformResult !== void 0) {
            return platformResult;
          }
        }
      }

      if (browsersCounter > 0) {
        const browserNames = Object.keys(browsers);
        const matchingDefinition = Utils.find(browserNames, name => (this.isBrowser(name, true)));

        if (matchingDefinition !== void 0) {
          return this.compareVersion(browsers[matchingDefinition]);
        }
      }

      return undefined;
    }

    /**
     * Check if the browser name equals the passed string
     * @param browserName The string to compare with the browser name
     * @param [includingAlias=false] The flag showing whether alias will be included into comparison
     * @returns {boolean}
     */
    isBrowser(browserName, includingAlias = false) {
      const defaultBrowserName = this.getBrowserName().toLowerCase();
      let browserNameLower = browserName.toLowerCase();
      const alias = Utils.getBrowserTypeByAlias(browserNameLower);

      if (includingAlias && alias) {
        browserNameLower = alias.toLowerCase();
      }
      return browserNameLower === defaultBrowserName;
    }

    compareVersion(version) {
      let expectedResults = [0];
      let comparableVersion = version;
      let isLoose = false;

      const currentBrowserVersion = this.getBrowserVersion();

      if (typeof currentBrowserVersion !== 'string') {
        return void 0;
      }

      if (version[0] === '>' || version[0] === '<') {
        comparableVersion = version.substr(1);
        if (version[1] === '=') {
          isLoose = true;
          comparableVersion = version.substr(2);
        } else {
          expectedResults = [];
        }
        if (version[0] === '>') {
          expectedResults.push(1);
        } else {
          expectedResults.push(-1);
        }
      } else if (version[0] === '=') {
        comparableVersion = version.substr(1);
      } else if (version[0] === '~') {
        isLoose = true;
        comparableVersion = version.substr(1);
      }

      return expectedResults.indexOf(
        Utils.compareVersions(currentBrowserVersion, comparableVersion, isLoose),
      ) > -1;
    }

    isOS(osName) {
      return this.getOSName(true) === String(osName).toLowerCase();
    }

    isPlatform(platformType) {
      return this.getPlatformType(true) === String(platformType).toLowerCase();
    }

    isEngine(engineName) {
      return this.getEngineName(true) === String(engineName).toLowerCase();
    }

    /**
     * Is anything? Check if the browser is called "anything",
     * the OS called "anything" or the platform called "anything"
     * @param {String} anything
     * @param [includingAlias=false] The flag showing whether alias will be included into comparison
     * @returns {Boolean}
     */
    is(anything, includingAlias = false) {
      return this.isBrowser(anything, includingAlias) || this.isOS(anything)
        || this.isPlatform(anything);
    }

    /**
     * Check if any of the given values satisfies this.is(anything)
     * @param {String[]} anythings
     * @returns {Boolean}
     */
    some(anythings = []) {
      return anythings.some(anything => this.is(anything));
    }
  }

  /*!
   * Bowser - a browser detector
   * https://github.com/lancedikson/bowser
   * MIT License | (c) Dustin Diaz 2012-2015
   * MIT License | (c) Denis Demchenko 2015-2019
   */

  /**
   * Bowser class.
   * Keep it simple as much as it can be.
   * It's supposed to work with collections of {@link Parser} instances
   * rather then solve one-instance problems.
   * All the one-instance stuff is located in Parser class.
   *
   * @class
   * @classdesc Bowser is a static object, that provides an API to the Parsers
   * @hideconstructor
   */
  class Bowser {
    /**
     * Creates a {@link Parser} instance
     *
     * @param {String} UA UserAgent string
     * @param {Boolean} [skipParsing=false] Will make the Parser postpone parsing until you ask it
     * explicitly. Same as `skipParsing` for {@link Parser}.
     * @returns {Parser}
     * @throws {Error} when UA is not a String
     *
     * @example
     * const parser = Bowser.getParser(window.navigator.userAgent);
     * const result = parser.getResult();
     */
    static getParser(UA, skipParsing = false) {
      if (typeof UA !== 'string') {
        throw new Error('UserAgent should be a string');
      }
      return new Parser(UA, skipParsing);
    }

    /**
     * Creates a {@link Parser} instance and runs {@link Parser.getResult} immediately
     *
     * @param UA
     * @return {ParsedResult}
     *
     * @example
     * const result = Bowser.parse(window.navigator.userAgent);
     */
    static parse(UA) {
      return (new Parser(UA)).getResult();
    }

    static get BROWSER_MAP() {
      return BROWSER_MAP;
    }

    static get ENGINE_MAP() {
      return ENGINE_MAP;
    }

    static get OS_MAP() {
      return OS_MAP;
    }

    static get PLATFORMS_MAP() {
      return PLATFORMS_MAP;
    }
  }

  const browser = Bowser.getParser(navigator.userAgent).getResult();
  const isDesktop = browser.platform.type === "desktop";
  const isChrome = browser.engine.name === "Blink";
  const isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
      || /Macintosh(.*?) FxiOS(.*?)\//.test(navigator.platform)
      || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 2;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isMobileVR = /Mobile VR/.test(navigator.userAgent);
  const isOculus = /oculus/.test(navigator.userAgent);
  const isOculusGo = isOculus && /pacific/.test(navigator.userAgent);
  const isOculusQuest = isOculus && /quest/.test(navigator.userAgent);

  const displayGrid = display("grid");

  var Direction;
  (function (Direction) {
      Direction[Direction["Forward"] = 1] = "Forward";
      Direction[Direction["Stopped"] = 0] = "Stopped";
      Direction[Direction["Reverse"] = -1] = "Reverse";
  })(Direction || (Direction = {}));

  var Hand;
  (function (Hand) {
      Hand["None"] = "";
      Hand["Left"] = "left";
      Hand["Right"] = "right";
  })(Hand || (Hand = {}));

  /**
   * Sounds to play during certain interaction events
   **/
  var Interaction;
  (function (Interaction) {
      /**
       * No interaction.
       **/
      Interaction["None"] = "none";
      /**
       * A pointer entering a control.
       **/
      Interaction["Entered"] = "entered";
      /**
       * A pointer entering a control that has been disabled.
       **/
      Interaction["EnteredDisabled"] = "entereddisabled";
      /**
       * A pointer pressing down on a control.
       **/
      Interaction["Pressed"] = "pressed";
      /**
       * A pointer being clicked on a control that has been disabled.
       **/
      Interaction["PressedDisabled"] = "presseddisabled";
      /**
       * A pointer pressing down and releasing in rapid succession on a control.
       **/
      Interaction["Clicked"] = "clicked";
      /**
       * A pointer pressing down and releasing in rapid succession on a control that has been disabled.
       **/
      Interaction["ClickedDisabled"] = "clickeddisabled";
      /**
       * The first time dragging occured.
       **/
      Interaction["DraggingStarted"] = "draggingstarted";
      /**
       * The first time dragging occured on a contral that has been disabled.
       **/
      Interaction["DraggingStartedDisabled"] = "draggingstarteddisabled";
      /**
       * A pointer pressing down and moving on a control.
       **/
      Interaction["Dragged"] = "dragged";
      /**
       * The last time dragging occured.
       **/
      Interaction["DraggingEnded"] = "draggingended";
      /**
       * A pointer no longer being pressed on a control.
       **/
      Interaction["Released"] = "released";
      /**
       * A pointer leaving a control.
       **/
      Interaction["Exited"] = "exited";
      /**
       * A container element being opened, to have its contents become visible.
       **/
      Interaction["Opened"] = "opened";
      /**
       * A container element being closed, to hide its contents.
       **/
      Interaction["Closed"] = "closed";
      /**
       * A generic error sound.
       **/
      Interaction["Error"] = "error";
      /**
       * A generic completion sound.
       **/
      Interaction["Success"] = "success";
      /**
       * Application start up.
       **/
      Interaction["StartUp"] = "startup";
      /**
       * Application shut down.
       **/
      Interaction["ShutDown"] = "shutdown";
      /**
       * A list being scrolled.
       **/
      Interaction["Scrolled"] = "scrolled";
  })(Interaction || (Interaction = {}));

  var MouseButton;
  (function (MouseButton) {
      MouseButton[MouseButton["Mouse0"] = 0] = "Mouse0";
      MouseButton[MouseButton["Mouse1"] = 1] = "Mouse1";
      MouseButton[MouseButton["Mouse2"] = 2] = "Mouse2";
      MouseButton[MouseButton["Mouse3"] = 3] = "Mouse3";
      MouseButton[MouseButton["Mouse4"] = 4] = "Mouse4";
  })(MouseButton || (MouseButton = {}));
  var MouseButtons;
  (function (MouseButtons) {
      MouseButtons[MouseButtons["None"] = 0] = "None";
      MouseButtons[MouseButtons["Mouse0"] = 1] = "Mouse0";
      MouseButtons[MouseButtons["Mouse1"] = 2] = "Mouse1";
      MouseButtons[MouseButtons["Mouse2"] = 4] = "Mouse2";
      MouseButtons[MouseButtons["Mouse3"] = 8] = "Mouse3";
      MouseButtons[MouseButtons["Mouse4"] = 16] = "Mouse4";
  })(MouseButtons || (MouseButtons = {}));

  function splitProgress(onProgress, weights) {
      let subProgressWeights;
      if (isNumber(weights)) {
          subProgressWeights = new Array(weights);
          for (let i = 0; i < subProgressWeights.length; ++i) {
              subProgressWeights[i] = 1 / weights;
          }
      }
      else {
          subProgressWeights = weights;
      }
      let weightTotal = 0;
      for (let i = 0; i < subProgressWeights.length; ++i) {
          weightTotal += subProgressWeights[i];
      }
      const subProgressValues = new Array(subProgressWeights.length);
      const subProgressCallbacks = new Array(subProgressWeights.length);
      const start = performance.now();
      const update = (i, subSoFar, subTotal, msg) => {
          if (onProgress) {
              subProgressValues[i] = subSoFar / subTotal;
              let soFar = 0;
              for (let j = 0; j < subProgressWeights.length; ++j) {
                  soFar += subProgressValues[j] * subProgressWeights[j];
              }
              const end = performance.now();
              const delta = end - start;
              const est = start - end + delta * weightTotal / soFar;
              onProgress(soFar, weightTotal, msg, est);
          }
      };
      for (let i = 0; i < subProgressWeights.length; ++i) {
          subProgressValues[i] = 0;
          subProgressCallbacks[i] = (soFar, total, msg) => update(i, soFar, total, msg);
      }
      return subProgressCallbacks;
  }

  // performs a discrete convolution with a provided kernel
  function kernelResample(read, write, filterSize, kernel) {
      const { width, height, data } = read;
      const readIndex = (x, y) => 4 * (y * width + x);
      const twoFilterSize = 2 * filterSize;
      const xMax = width - 1;
      const yMax = height - 1;
      const xKernel = new Array(4);
      const yKernel = new Array(4);
      return (xFrom, yFrom, to) => {
          const xl = Math.floor(xFrom);
          const yl = Math.floor(yFrom);
          const xStart = xl - filterSize + 1;
          const yStart = yl - filterSize + 1;
          for (let i = 0; i < twoFilterSize; i++) {
              xKernel[i] = kernel(xFrom - (xStart + i));
              yKernel[i] = kernel(yFrom - (yStart + i));
          }
          for (let channel = 0; channel < 3; channel++) {
              let q = 0;
              for (let i = 0; i < twoFilterSize; i++) {
                  const y = yStart + i;
                  const yClamped = clamp(y, 0, yMax);
                  let p = 0;
                  for (let j = 0; j < twoFilterSize; j++) {
                      const x = xStart + j;
                      const index = readIndex(clamp(x, 0, xMax), yClamped);
                      p += data[index + channel] * xKernel[j];
                  }
                  q += p * yKernel[i];
              }
              write.data[to + channel] = Math.round(q);
          }
      };
  }

  function copyPixelBicubic(read, write) {
      const b = -0.5;
      const kernel = (x) => {
          x = Math.abs(x);
          const x2 = x * x;
          const x3 = x * x * x;
          return x <= 1 ?
              (b + 2) * x3 - (b + 3) * x2 + 1 :
              b * x3 - 5 * b * x2 + 8 * b * x - 4 * b;
      };
      return kernelResample(read, write, 2, kernel);
  }

  function copyPixelBilinear(read, write) {
      const { width, height, data } = read;
      const readIndex = (x, y) => 4 * (y * width + x);
      return (xFrom, yFrom, to) => {
          const xl = clamp(Math.floor(xFrom), 0, width - 1);
          const xr = clamp(Math.ceil(xFrom), 0, width - 1);
          const xf = xFrom - xl;
          const yl = clamp(Math.floor(yFrom), 0, height - 1);
          const yr = clamp(Math.ceil(yFrom), 0, height - 1);
          const yf = yFrom - yl;
          const p00 = readIndex(xl, yl);
          const p10 = readIndex(xr, yl);
          const p01 = readIndex(xl, yr);
          const p11 = readIndex(xr, yr);
          for (let channel = 0; channel < 3; channel++) {
              const p0 = data[p00 + channel] * (1 - xf) + data[p10 + channel] * xf;
              const p1 = data[p01 + channel] * (1 - xf) + data[p11 + channel] * xf;
              write.data[to + channel] = Math.ceil(p0 * (1 - yf) + p1 * yf);
          }
      };
  }

  function copyPixelLanczos(read, write) {
      const filterSize = 5;
      const kernel = (x) => {
          if (x === 0) {
              return 1;
          }
          else {
              const xp = Math.PI * x;
              return filterSize * Math.sin(xp) * Math.sin(xp / filterSize) / (xp * xp);
          }
      };
      return kernelResample(read, write, filterSize, kernel);
  }

  function copyPixelNearest(read, write) {
      const { width, height, data } = read;
      const readIndex = (x, y) => 4 * (y * width + x);
      return (xFrom, yFrom, to) => {
          const nearest = readIndex(clamp(Math.round(xFrom), 0, width - 1), clamp(Math.round(yFrom), 0, height - 1));
          for (let channel = 0; channel < 3; channel++) {
              write.data[to + channel] = data[nearest + channel];
          }
      };
  }

  function createScript(file) {
      const script = Script(src(file));
      document.body.appendChild(script);
  }

  var CubeMapFace;
  (function (CubeMapFace) {
      CubeMapFace["PositiveZ"] = "pz";
      CubeMapFace["NegativeZ"] = "nz";
      CubeMapFace["PositiveX"] = "px";
      CubeMapFace["NegativeX"] = "nx";
      CubeMapFace["PositiveY"] = "py";
      CubeMapFace["NegativeY"] = "ny";
  })(CubeMapFace || (CubeMapFace = {}));
  const CubeMapFaceNames = [
      CubeMapFace.PositiveZ,
      CubeMapFace.NegativeZ,
      CubeMapFace.PositiveY,
      CubeMapFace.NegativeY,
      CubeMapFace.NegativeX,
      CubeMapFace.PositiveX
  ];

  async function getResponse(path) {
      const request = fetch(path);
      const response = await request;
      if (!response.ok) {
          throw new Error(`[${response.status}] - ${response.statusText}. Path ${path}`);
      }
      return response;
  }

  async function readResponseBuffer(path, response, contentLength, onProgress) {
      if (onProgress) {
          onProgress(0, 1, path);
      }
      const hasContentLength = isGoodNumber(contentLength);
      if (!hasContentLength) {
          contentLength = 1;
      }
      if (!response.body) {
          throw new Error("No response body!");
      }
      const reader = response.body.getReader();
      const values = [];
      let receivedLength = 0;
      while (true) {
          const { done, value } = await reader.read();
          if (done) {
              break;
          }
          if (value) {
              values.push(value);
              receivedLength += value.length;
              if (onProgress) {
                  onProgress(receivedLength, Math.max(receivedLength, contentLength), path);
              }
          }
      }
      const buffer = new ArrayBuffer(receivedLength);
      const array = new Uint8Array(buffer);
      receivedLength = 0;
      for (const value of values) {
          array.set(value, receivedLength);
          receivedLength += value.length;
      }
      if (onProgress) {
          onProgress(1, 1, path);
      }
      return buffer;
  }

  async function getBuffer(path, onProgress) {
      if (onProgress) {
          onProgress(0, 1, path);
      }
      const response = await getResponse(path);
      const contentType = response.headers.get("Content-Type");
      if (!contentType) {
          throw new Error("Server did not provide a content type");
      }
      let contentLength = 1;
      const contentLengthStr = response.headers.get("Content-Length");
      if (!contentLengthStr) {
          console.warn(`Server did not provide a content length header. Path: ${path}`);
      }
      else {
          contentLength = parseInt(contentLengthStr, 10);
          if (!isGoodNumber(contentLength)) {
              console.warn(`Server did not provide a valid content length header. Value: ${contentLengthStr}, Path: ${path}`);
              contentLength = 1;
          }
      }
      const buffer = await readResponseBuffer(path, response, contentLength, onProgress);
      if (onProgress) {
          onProgress(1, 1, path);
      }
      return { buffer, contentType };
  }

  async function getBlob(path, onProgress) {
      const { buffer, contentType } = await getBuffer(path, onProgress);
      const blob = new Blob([buffer], { type: contentType });
      return blob;
  }

  function isDisposable(obj) {
      return isObject(obj)
          && "dispose" in obj
          && isFunction(obj.dispose);
  }
  function isClosable(obj) {
      return isObject(obj)
          && "close" in obj
          && isFunction(obj.close);
  }
  function dispose(val) {
      if (isDisposable(val)) {
          val.dispose();
      }
      else if (isClosable(val)) {
          val.close();
      }
  }
  function using(val, thunk) {
      try {
          return thunk(val);
      }
      finally {
          dispose(val);
      }
  }

  async function getFile(path, onProgress) {
      const blob = await getBlob(path, onProgress);
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
  }

  var InterpolationType;
  (function (InterpolationType) {
      InterpolationType["Bilinear"] = "bilinear";
      InterpolationType["Bicubic"] = "bicubic";
      InterpolationType["Lanczos"] = "lanczos";
      InterpolationType["Nearest"] = "nearest";
  })(InterpolationType || (InterpolationType = {}));

  const rotations = new Map();
  rotations.set(CubeMapFace.PositiveY, 3);
  rotations.set(CubeMapFace.NegativeY, 1);
  const faceOrienters = new Map([
      [CubeMapFace.PositiveZ, (x, y) => {
              return {
                  x: -1,
                  y: -x,
                  z: -y
              };
          }],
      [CubeMapFace.NegativeZ, (x, y) => {
              return {
                  x: 1,
                  y: x,
                  z: -y
              };
          }],
      [CubeMapFace.PositiveX, (x, y) => {
              return {
                  x: x,
                  y: -1,
                  z: -y
              };
          }],
      [CubeMapFace.NegativeX, (x, y) => {
              return {
                  x: -x,
                  y: 1,
                  z: -y
              };
          }],
      [CubeMapFace.PositiveY, (x, y) => {
              return {
                  x: -y,
                  y: -x,
                  z: 1
              };
          }],
      [CubeMapFace.NegativeY, (x, y) => {
              return {
                  x: y,
                  y: -x,
                  z: -1
              };
          }]
  ]);
  const pixelCopiers = new Map([
      [InterpolationType.Bilinear, copyPixelBilinear],
      [InterpolationType.Bicubic, copyPixelBicubic],
      [InterpolationType.Lanczos, copyPixelLanczos],
      [InterpolationType.Nearest, copyPixelNearest]
  ]);

  async function loadScript(path, test, onProgress) {
      if (!test()) {
          const scriptLoadTask = waitFor(test);
          const file = await getFile(path, onProgress);
          createScript(file);
          await scriptLoadTask;
      }
      else if (onProgress) {
          onProgress(1, 1, "skip");
      }
  }

  /**
   * Pick a value that is proportionally between two values.
   */
  function lerp$1(a, b, p) {
      return (1 - p) * a + p * b;
  }

  /**
   * Translate a value into a range.
   */
  function project(v, min, max) {
      const delta = max - min;
      if (delta === 0) {
          return 0;
      }
      else {
          return (v - min) / delta;
      }
  }

  class TimerTickEvent extends Event {
      constructor() {
          super("tick");
          this.t = 0;
          this.dt = 0;
          this.sdt = 0;
          Object.seal(this);
      }
      copy(evt) {
          this.t = evt.t;
          this.dt = evt.dt;
          this.sdt = evt.sdt;
      }
      set(t, dt) {
          this.t = t;
          this.dt = dt;
          this.sdt = lerp$1(this.sdt, dt, 0.01);
      }
  }
  class BaseTimer extends TypedEventBase {
      constructor(targetFrameRate) {
          super();
          this._timer = null;
          this._frameTime = Number.MAX_VALUE;
          this._targetFPS = 0;
          this.targetFrameRate = targetFrameRate;
          this._onTick = (t) => {
              const tickEvt = new TimerTickEvent();
              let lt = t;
              this._onTick = (t) => {
                  if (t > lt) {
                      tickEvt.t = t;
                      tickEvt.dt = t - lt;
                      tickEvt.sdt = tickEvt.dt;
                      lt = t;
                      this._onTick = (t) => {
                          let dt = t - lt;
                          if (dt < -1000) {
                              lt = t - this._frameTime;
                              dt = this._frameTime;
                          }
                          if (dt > 0 && dt >= this._frameTime) {
                              tickEvt.set(t, dt);
                              lt = t;
                              this.dispatchEvent(tickEvt);
                          }
                      };
                  }
              };
          };
      }
      restart() {
          this.stop();
          this.start();
      }
      get isRunning() {
          return this._timer != null;
      }
      stop() {
          this._timer = null;
          this.dispatchEvent(new Event("stopped"));
      }
      get targetFrameRate() {
          return this._targetFPS;
      }
      set targetFrameRate(fps) {
          this._targetFPS = fps;
          this._frameTime = 1000 / fps;
      }
  }

  class RequestAnimationFrameTimer extends BaseTimer {
      constructor() {
          super(120);
      }
      start() {
          const updater = (t) => {
              this._timer = requestAnimationFrame(updater);
              this._onTick(t);
          };
          this._timer = requestAnimationFrame(updater);
      }
      stop() {
          if (this._timer) {
              cancelAnimationFrame(this._timer);
              super.stop();
          }
      }
  }

  var WorkerMethodMessageType;
  (function (WorkerMethodMessageType) {
      WorkerMethodMessageType["Error"] = "error";
      WorkerMethodMessageType["Progress"] = "progress";
      WorkerMethodMessageType["Return"] = "return";
      WorkerMethodMessageType["ReturnValue"] = "returnValue";
  })(WorkerMethodMessageType || (WorkerMethodMessageType = {}));

  var version = "1.0.0";

  console.info(`Kudzu v${version}.`);

  /**
   * A position and orientation, at a given time.
   **/
  class Pose {
      /**
       * Creates a new position and orientation, at a given time.
       **/
      constructor() {
          this.t = 0;
          this.p = create$2();
          this.f = set$2(create$2(), 0, 0, -1);
          this.u = set$2(create$2(), 0, 1, 0);
          Object.seal(this);
      }
      /**
       * Sets the components of the pose.
       */
      set(px, py, pz, fx, fy, fz, ux, uy, uz) {
          set$2(this.p, px, py, pz);
          set$2(this.f, fx, fy, fz);
          set$2(this.u, ux, uy, uz);
      }
      /**
       * Copies the components of another pose into this pose.
       */
      copy(other) {
          copy(this.p, other.p);
          copy(this.f, other.f);
          copy(this.u, other.u);
      }
      /**
       * Performs a lerp between two positions and a slerp between to orientations
       * and stores the result in this pose.
       */
      interpolate(start, end, t) {
          if (t <= start.t) {
              this.copy(start);
          }
          else if (end.t <= t) {
              this.copy(end);
          }
          else if (start.t < t) {
              const p = project(t, start.t, end.t);
              this.copy(start);
              lerp(this.p, this.p, end.p, p);
              lerp(this.f, this.f, end.f, p);
              lerp(this.u, this.u, end.u, p);
              normalize(this.f, this.f);
              normalize(this.u, this.u);
              this.t = t;
          }
      }
  }

  const delta = create$2();
  const k = 2;
  /**
   * A position value that is blended from the current position to
   * a target position over time.
   */
  class InterpolatedPose {
      constructor() {
          this.start = new Pose();
          this.current = new Pose();
          this.end = new Pose();
          this.offset = create$2();
      }
      /**
       * Set the target comfort offset for the time `t + dt`.
       */
      setOffset(ox, oy, oz) {
          set$2(delta, ox, oy, oz);
          sub(delta, delta, this.offset);
          add(this.start.p, this.start.p, delta);
          add(this.current.p, this.current.p, delta);
          add(this.end.p, this.end.p, delta);
          scale(this.start.f, this.start.f, k);
          add(this.start.f, this.start.f, delta);
          normalize(this.start.f, this.start.f);
          scale(this.current.f, this.current.f, k);
          add(this.current.f, this.current.f, delta);
          normalize(this.current.f, this.current.f);
          scale(this.end.f, this.end.f, k);
          add(this.end.f, this.end.f, delta);
          normalize(this.end.f, this.end.f);
          set$2(this.offset, ox, oy, oz);
      }
      /**
       * Set the target position and orientation for the time `t + dt`.
       * @param px - the horizontal component of the position.
       * @param py - the vertical component of the position.
       * @param pz - the lateral component of the position.
       * @param fx - the horizontal component of the position.
       * @param fy - the vertical component of the position.
       * @param fz - the lateral component of the position.
       * @param ux - the horizontal component of the position.
       * @param uy - the vertical component of the position.
       * @param uz - the lateral component of the position.
       * @param t - the time at which to start the transition.
       * @param dt - the amount of time to take making the transition.
       */
      setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, t, dt) {
          const ox = this.offset[0];
          const oy = this.offset[1];
          const oz = this.offset[2];
          this.end.set(px + ox, py + oy, pz + oz, fx, fy, fz, ux, uy, uz);
          this.end.t = t + dt;
          if (dt > 0) {
              this.start.copy(this.current);
              this.start.t = t;
          }
          else {
              this.start.copy(this.end);
              this.start.t = t;
              this.current.copy(this.end);
              this.current.t = t;
          }
      }
      /**
       * Set the target position for the time `t + dt`.
       * @param px - the horizontal component of the position.
       * @param py - the vertical component of the position.
       * @param pz - the lateral component of the position.
       * @param t - the time at which to start the transition.
       * @param dt - the amount of time to take making the transition.
       */
      setTargetPosition(px, py, pz, t, dt) {
          this.setTarget(px, py, pz, this.end.f[0], this.end.f[1], this.end.f[2], this.end.u[0], this.end.u[1], this.end.u[2], t, dt);
      }
      /**
       * Set the target orientation for the time `t + dt`.
       * @param fx - the horizontal component of the position.
       * @param fy - the vertical component of the position.
       * @param fz - the lateral component of the position.
       * @param ux - the horizontal component of the position.
       * @param uy - the vertical component of the position.
       * @param uz - the lateral component of the position.
       * @param t - the time at which to start the transition.
       * @param dt - the amount of time to take making the transition.
       */
      setTargetOrientation(fx, fy, fz, ux, uy, uz, t, dt) {
          this.setTarget(this.end.p[0], this.end.p[1], this.end.p[2], fx, fy, fz, ux, uy, uz, t, dt);
      }
      /**
       * Calculates the new position for the given time.
       */
      update(t) {
          this.current.interpolate(this.start, this.end, t);
      }
  }

  /**
   * Base class providing functionality for spatializers.
   */
  class BaseSpatializer {
      constructor(audioContext) {
          this.audioContext = audioContext;
          this.gain = null;
          this.minDistance = 1;
          this.maxDistance = 10;
          this.rolloff = 1;
          this.algorithm = "logarithmic";
          this.transitionTime = 0.1;
          this.gain = audioContext.createGain();
      }
      /**
       * Sets parameters that alter spatialization.
       **/
      setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
          this.minDistance = minDistance;
          this.maxDistance = maxDistance;
          this.rolloff = rolloff;
          this.algorithm = algorithm;
          this.transitionTime = transitionTime;
      }
      /**
       * Discard values and make this instance useless.
       */
      dispose() {
          if (this.gain) {
              this.gain.disconnect();
              this.gain = null;
          }
      }
      get volume() {
          return this.gain.gain.value;
      }
      set volume(v) {
          this.gain.gain.value = v;
      }
      play() {
          return Promise.resolve();
      }
      stop() {
      }
  }

  /**
   * Base class providing functionality for audio sources.
   **/
  class BaseNode extends BaseSpatializer {
      /**
       * Creates a spatializer that keeps track of the relative position
       * of an audio element to the listener destination.
       * @param id
       * @param stream
       * @param audioContext - the output WebAudio context
       * @param node - this node out to which to pipe the stream
       */
      constructor(id, source, audioContext) {
          super(audioContext);
          this.id = id;
          this.source = source;
          if (this.source instanceof AudioBufferSourceNode) {
              this.playingSources = new Array();
          }
          else {
              this.source.connect(this.gain);
          }
      }
      /**
       * Discard values and make this instance useless.
       */
      dispose() {
          if (this.source) {
              this.source.disconnect();
              this.source = null;
          }
          super.dispose();
      }
      get isPlaying() {
          return this.playingSources.length > 0;
      }
      async play() {
          if (this.source instanceof AudioBufferSourceNode) {
              const newSource = this.source.context.createBufferSource();
              this.playingSources.push(newSource);
              newSource.buffer = this.source.buffer;
              newSource.loop = this.source.loop;
              newSource.connect(this.gain);
              newSource.start();
              if (!this.source.loop) {
                  await once(newSource, "ended");
                  if (this.playingSources.indexOf(newSource) >= 0) {
                      newSource.stop();
                      newSource.disconnect(this.gain);
                      arrayRemove(this.playingSources, newSource);
                  }
              }
          }
      }
      stop() {
          if (this.source instanceof AudioBufferSourceNode) {
              for (const source of this.playingSources) {
                  source.stop();
                  source.disconnect(this.gain);
              }
              arrayClear(this.playingSources);
          }
      }
  }

  class NoSpatializationNode extends BaseNode {
      /**
       * Creates a new "spatializer" that performs no panning. An anti-spatializer.
       */
      constructor(id, source, audioContext, destination) {
          super(id, source, audioContext);
          this.gain.connect(destination);
          Object.seal(this);
      }
      update(_loc, _t) {
          // do nothing
      }
  }

  /**
   * Base class providing functionality for audio listeners.
   **/
  class BaseListener extends BaseSpatializer {
      /**
       * Creates a spatializer that keeps track of position
       */
      constructor(audioContext, destination) {
          super(audioContext);
          this.gain.connect(destination);
      }
      /**
       * Creates a spatialzer for an audio source.
       */
      createSpatializer(id, source, spatialize, audioContext) {
          if (spatialize) {
              throw new Error("Can't spatialize with the base listener.");
          }
          return new NoSpatializationNode(id, source, audioContext, this.gain);
      }
  }

  /**
   * Base class for spatializers that uses WebAudio's AudioListener
   **/
  class BaseWebAudioListener extends BaseListener {
      /**
       * Creates a new spatializer that uses WebAudio's PannerNode.
       */
      constructor(audioContext, destination) {
          super(audioContext, destination);
          this.node = audioContext.listener;
          this.volume = 0.75;
      }
      dispose() {
          this.node = null;
          super.dispose();
      }
  }

  /**
   * Rendering mode ENUM.
   */
  var RenderingMode;
  (function (RenderingMode) {
      /** Use ambisonic rendering. */
      RenderingMode["Ambisonic"] = "ambisonic";
      /** Bypass. No ambisonic rendering. */
      RenderingMode["Bypass"] = "bypass";
      /** Disable audio output. */
      RenderingMode["None"] = "off";
  })(RenderingMode || (RenderingMode = {}));

  /**
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * @file Pre-computed lookup tables for encoding ambisonic sources.
   * @author Andrew Allen <bitllama@google.com>
   */
  /**
   * Pre-computed Spherical Harmonics Coefficients.
   *
   * This function generates an efficient lookup table of SH coefficients. It
   * exploits the way SHs are generated (i.e. Ylm = Nlm * Plm * Em). Since Nlm
   * & Plm coefficients only depend on theta, and Em only depends on phi, we
   * can separate the equation along these lines. Em does not depend on
   * degree, so we only need to compute (2 * l) per azimuth Em total and
   * Nlm * Plm is symmetrical across indexes, so only positive indexes are
   * computed ((l + 1) * (l + 2) / 2 - 1) per elevation.
   */
  const SPHERICAL_HARMONICS = [
      [
          [0.000000, 0.000000, 0.000000, 1.000000, 1.000000, 1.000000],
          [0.052336, 0.034899, 0.017452, 0.999848, 0.999391, 0.998630],
          [0.104528, 0.069756, 0.034899, 0.999391, 0.997564, 0.994522],
          [0.156434, 0.104528, 0.052336, 0.998630, 0.994522, 0.987688],
          [0.207912, 0.139173, 0.069756, 0.997564, 0.990268, 0.978148],
          [0.258819, 0.173648, 0.087156, 0.996195, 0.984808, 0.965926],
          [0.309017, 0.207912, 0.104528, 0.994522, 0.978148, 0.951057],
          [0.358368, 0.241922, 0.121869, 0.992546, 0.970296, 0.933580],
          [0.406737, 0.275637, 0.139173, 0.990268, 0.961262, 0.913545],
          [0.453990, 0.309017, 0.156434, 0.987688, 0.951057, 0.891007],
          [0.500000, 0.342020, 0.173648, 0.984808, 0.939693, 0.866025],
          [0.544639, 0.374607, 0.190809, 0.981627, 0.927184, 0.838671],
          [0.587785, 0.406737, 0.207912, 0.978148, 0.913545, 0.809017],
          [0.629320, 0.438371, 0.224951, 0.974370, 0.898794, 0.777146],
          [0.669131, 0.469472, 0.241922, 0.970296, 0.882948, 0.743145],
          [0.707107, 0.500000, 0.258819, 0.965926, 0.866025, 0.707107],
          [0.743145, 0.529919, 0.275637, 0.961262, 0.848048, 0.669131],
          [0.777146, 0.559193, 0.292372, 0.956305, 0.829038, 0.629320],
          [0.809017, 0.587785, 0.309017, 0.951057, 0.809017, 0.587785],
          [0.838671, 0.615661, 0.325568, 0.945519, 0.788011, 0.544639],
          [0.866025, 0.642788, 0.342020, 0.939693, 0.766044, 0.500000],
          [0.891007, 0.669131, 0.358368, 0.933580, 0.743145, 0.453990],
          [0.913545, 0.694658, 0.374607, 0.927184, 0.719340, 0.406737],
          [0.933580, 0.719340, 0.390731, 0.920505, 0.694658, 0.358368],
          [0.951057, 0.743145, 0.406737, 0.913545, 0.669131, 0.309017],
          [0.965926, 0.766044, 0.422618, 0.906308, 0.642788, 0.258819],
          [0.978148, 0.788011, 0.438371, 0.898794, 0.615661, 0.207912],
          [0.987688, 0.809017, 0.453990, 0.891007, 0.587785, 0.156434],
          [0.994522, 0.829038, 0.469472, 0.882948, 0.559193, 0.104528],
          [0.998630, 0.848048, 0.484810, 0.874620, 0.529919, 0.052336],
          [1.000000, 0.866025, 0.500000, 0.866025, 0.500000, 0.000000],
          [0.998630, 0.882948, 0.515038, 0.857167, 0.469472, -0.052336],
          [0.994522, 0.898794, 0.529919, 0.848048, 0.438371, -0.104528],
          [0.987688, 0.913545, 0.544639, 0.838671, 0.406737, -0.156434],
          [0.978148, 0.927184, 0.559193, 0.829038, 0.374607, -0.207912],
          [0.965926, 0.939693, 0.573576, 0.819152, 0.342020, -0.258819],
          [0.951057, 0.951057, 0.587785, 0.809017, 0.309017, -0.309017],
          [0.933580, 0.961262, 0.601815, 0.798636, 0.275637, -0.358368],
          [0.913545, 0.970296, 0.615661, 0.788011, 0.241922, -0.406737],
          [0.891007, 0.978148, 0.629320, 0.777146, 0.207912, -0.453990],
          [0.866025, 0.984808, 0.642788, 0.766044, 0.173648, -0.500000],
          [0.838671, 0.990268, 0.656059, 0.754710, 0.139173, -0.544639],
          [0.809017, 0.994522, 0.669131, 0.743145, 0.104528, -0.587785],
          [0.777146, 0.997564, 0.681998, 0.731354, 0.069756, -0.629320],
          [0.743145, 0.999391, 0.694658, 0.719340, 0.034899, -0.669131],
          [0.707107, 1.000000, 0.707107, 0.707107, 0.000000, -0.707107],
          [0.669131, 0.999391, 0.719340, 0.694658, -0.034899, -0.743145],
          [0.629320, 0.997564, 0.731354, 0.681998, -0.069756, -0.777146],
          [0.587785, 0.994522, 0.743145, 0.669131, -0.104528, -0.809017],
          [0.544639, 0.990268, 0.754710, 0.656059, -0.139173, -0.838671],
          [0.500000, 0.984808, 0.766044, 0.642788, -0.173648, -0.866025],
          [0.453990, 0.978148, 0.777146, 0.629320, -0.207912, -0.891007],
          [0.406737, 0.970296, 0.788011, 0.615661, -0.241922, -0.913545],
          [0.358368, 0.961262, 0.798636, 0.601815, -0.275637, -0.933580],
          [0.309017, 0.951057, 0.809017, 0.587785, -0.309017, -0.951057],
          [0.258819, 0.939693, 0.819152, 0.573576, -0.342020, -0.965926],
          [0.207912, 0.927184, 0.829038, 0.559193, -0.374607, -0.978148],
          [0.156434, 0.913545, 0.838671, 0.544639, -0.406737, -0.987688],
          [0.104528, 0.898794, 0.848048, 0.529919, -0.438371, -0.994522],
          [0.052336, 0.882948, 0.857167, 0.515038, -0.469472, -0.998630],
          [0.000000, 0.866025, 0.866025, 0.500000, -0.500000, -1.000000],
          [-0.052336, 0.848048, 0.874620, 0.484810, -0.529919, -0.998630],
          [-0.104528, 0.829038, 0.882948, 0.469472, -0.559193, -0.994522],
          [-0.156434, 0.809017, 0.891007, 0.453990, -0.587785, -0.987688],
          [-0.207912, 0.788011, 0.898794, 0.438371, -0.615661, -0.978148],
          [-0.258819, 0.766044, 0.906308, 0.422618, -0.642788, -0.965926],
          [-0.309017, 0.743145, 0.913545, 0.406737, -0.669131, -0.951057],
          [-0.358368, 0.719340, 0.920505, 0.390731, -0.694658, -0.933580],
          [-0.406737, 0.694658, 0.927184, 0.374607, -0.719340, -0.913545],
          [-0.453990, 0.669131, 0.933580, 0.358368, -0.743145, -0.891007],
          [-0.500000, 0.642788, 0.939693, 0.342020, -0.766044, -0.866025],
          [-0.544639, 0.615661, 0.945519, 0.325568, -0.788011, -0.838671],
          [-0.587785, 0.587785, 0.951057, 0.309017, -0.809017, -0.809017],
          [-0.629320, 0.559193, 0.956305, 0.292372, -0.829038, -0.777146],
          [-0.669131, 0.529919, 0.961262, 0.275637, -0.848048, -0.743145],
          [-0.707107, 0.500000, 0.965926, 0.258819, -0.866025, -0.707107],
          [-0.743145, 0.469472, 0.970296, 0.241922, -0.882948, -0.669131],
          [-0.777146, 0.438371, 0.974370, 0.224951, -0.898794, -0.629320],
          [-0.809017, 0.406737, 0.978148, 0.207912, -0.913545, -0.587785],
          [-0.838671, 0.374607, 0.981627, 0.190809, -0.927184, -0.544639],
          [-0.866025, 0.342020, 0.984808, 0.173648, -0.939693, -0.500000],
          [-0.891007, 0.309017, 0.987688, 0.156434, -0.951057, -0.453990],
          [-0.913545, 0.275637, 0.990268, 0.139173, -0.961262, -0.406737],
          [-0.933580, 0.241922, 0.992546, 0.121869, -0.970296, -0.358368],
          [-0.951057, 0.207912, 0.994522, 0.104528, -0.978148, -0.309017],
          [-0.965926, 0.173648, 0.996195, 0.087156, -0.984808, -0.258819],
          [-0.978148, 0.139173, 0.997564, 0.069756, -0.990268, -0.207912],
          [-0.987688, 0.104528, 0.998630, 0.052336, -0.994522, -0.156434],
          [-0.994522, 0.069756, 0.999391, 0.034899, -0.997564, -0.104528],
          [-0.998630, 0.034899, 0.999848, 0.017452, -0.999391, -0.052336],
          [-1.000000, 0.000000, 1.000000, 0.000000, -1.000000, -0.000000],
          [-0.998630, -0.034899, 0.999848, -0.017452, -0.999391, 0.052336],
          [-0.994522, -0.069756, 0.999391, -0.034899, -0.997564, 0.104528],
          [-0.987688, -0.104528, 0.998630, -0.052336, -0.994522, 0.156434],
          [-0.978148, -0.139173, 0.997564, -0.069756, -0.990268, 0.207912],
          [-0.965926, -0.173648, 0.996195, -0.087156, -0.984808, 0.258819],
          [-0.951057, -0.207912, 0.994522, -0.104528, -0.978148, 0.309017],
          [-0.933580, -0.241922, 0.992546, -0.121869, -0.970296, 0.358368],
          [-0.913545, -0.275637, 0.990268, -0.139173, -0.961262, 0.406737],
          [-0.891007, -0.309017, 0.987688, -0.156434, -0.951057, 0.453990],
          [-0.866025, -0.342020, 0.984808, -0.173648, -0.939693, 0.500000],
          [-0.838671, -0.374607, 0.981627, -0.190809, -0.927184, 0.544639],
          [-0.809017, -0.406737, 0.978148, -0.207912, -0.913545, 0.587785],
          [-0.777146, -0.438371, 0.974370, -0.224951, -0.898794, 0.629320],
          [-0.743145, -0.469472, 0.970296, -0.241922, -0.882948, 0.669131],
          [-0.707107, -0.500000, 0.965926, -0.258819, -0.866025, 0.707107],
          [-0.669131, -0.529919, 0.961262, -0.275637, -0.848048, 0.743145],
          [-0.629320, -0.559193, 0.956305, -0.292372, -0.829038, 0.777146],
          [-0.587785, -0.587785, 0.951057, -0.309017, -0.809017, 0.809017],
          [-0.544639, -0.615661, 0.945519, -0.325568, -0.788011, 0.838671],
          [-0.500000, -0.642788, 0.939693, -0.342020, -0.766044, 0.866025],
          [-0.453990, -0.669131, 0.933580, -0.358368, -0.743145, 0.891007],
          [-0.406737, -0.694658, 0.927184, -0.374607, -0.719340, 0.913545],
          [-0.358368, -0.719340, 0.920505, -0.390731, -0.694658, 0.933580],
          [-0.309017, -0.743145, 0.913545, -0.406737, -0.669131, 0.951057],
          [-0.258819, -0.766044, 0.906308, -0.422618, -0.642788, 0.965926],
          [-0.207912, -0.788011, 0.898794, -0.438371, -0.615661, 0.978148],
          [-0.156434, -0.809017, 0.891007, -0.453990, -0.587785, 0.987688],
          [-0.104528, -0.829038, 0.882948, -0.469472, -0.559193, 0.994522],
          [-0.052336, -0.848048, 0.874620, -0.484810, -0.529919, 0.998630],
          [-0.000000, -0.866025, 0.866025, -0.500000, -0.500000, 1.000000],
          [0.052336, -0.882948, 0.857167, -0.515038, -0.469472, 0.998630],
          [0.104528, -0.898794, 0.848048, -0.529919, -0.438371, 0.994522],
          [0.156434, -0.913545, 0.838671, -0.544639, -0.406737, 0.987688],
          [0.207912, -0.927184, 0.829038, -0.559193, -0.374607, 0.978148],
          [0.258819, -0.939693, 0.819152, -0.573576, -0.342020, 0.965926],
          [0.309017, -0.951057, 0.809017, -0.587785, -0.309017, 0.951057],
          [0.358368, -0.961262, 0.798636, -0.601815, -0.275637, 0.933580],
          [0.406737, -0.970296, 0.788011, -0.615661, -0.241922, 0.913545],
          [0.453990, -0.978148, 0.777146, -0.629320, -0.207912, 0.891007],
          [0.500000, -0.984808, 0.766044, -0.642788, -0.173648, 0.866025],
          [0.544639, -0.990268, 0.754710, -0.656059, -0.139173, 0.838671],
          [0.587785, -0.994522, 0.743145, -0.669131, -0.104528, 0.809017],
          [0.629320, -0.997564, 0.731354, -0.681998, -0.069756, 0.777146],
          [0.669131, -0.999391, 0.719340, -0.694658, -0.034899, 0.743145],
          [0.707107, -1.000000, 0.707107, -0.707107, -0.000000, 0.707107],
          [0.743145, -0.999391, 0.694658, -0.719340, 0.034899, 0.669131],
          [0.777146, -0.997564, 0.681998, -0.731354, 0.069756, 0.629320],
          [0.809017, -0.994522, 0.669131, -0.743145, 0.104528, 0.587785],
          [0.838671, -0.990268, 0.656059, -0.754710, 0.139173, 0.544639],
          [0.866025, -0.984808, 0.642788, -0.766044, 0.173648, 0.500000],
          [0.891007, -0.978148, 0.629320, -0.777146, 0.207912, 0.453990],
          [0.913545, -0.970296, 0.615661, -0.788011, 0.241922, 0.406737],
          [0.933580, -0.961262, 0.601815, -0.798636, 0.275637, 0.358368],
          [0.951057, -0.951057, 0.587785, -0.809017, 0.309017, 0.309017],
          [0.965926, -0.939693, 0.573576, -0.819152, 0.342020, 0.258819],
          [0.978148, -0.927184, 0.559193, -0.829038, 0.374607, 0.207912],
          [0.987688, -0.913545, 0.544639, -0.838671, 0.406737, 0.156434],
          [0.994522, -0.898794, 0.529919, -0.848048, 0.438371, 0.104528],
          [0.998630, -0.882948, 0.515038, -0.857167, 0.469472, 0.052336],
          [1.000000, -0.866025, 0.500000, -0.866025, 0.500000, 0.000000],
          [0.998630, -0.848048, 0.484810, -0.874620, 0.529919, -0.052336],
          [0.994522, -0.829038, 0.469472, -0.882948, 0.559193, -0.104528],
          [0.987688, -0.809017, 0.453990, -0.891007, 0.587785, -0.156434],
          [0.978148, -0.788011, 0.438371, -0.898794, 0.615661, -0.207912],
          [0.965926, -0.766044, 0.422618, -0.906308, 0.642788, -0.258819],
          [0.951057, -0.743145, 0.406737, -0.913545, 0.669131, -0.309017],
          [0.933580, -0.719340, 0.390731, -0.920505, 0.694658, -0.358368],
          [0.913545, -0.694658, 0.374607, -0.927184, 0.719340, -0.406737],
          [0.891007, -0.669131, 0.358368, -0.933580, 0.743145, -0.453990],
          [0.866025, -0.642788, 0.342020, -0.939693, 0.766044, -0.500000],
          [0.838671, -0.615661, 0.325568, -0.945519, 0.788011, -0.544639],
          [0.809017, -0.587785, 0.309017, -0.951057, 0.809017, -0.587785],
          [0.777146, -0.559193, 0.292372, -0.956305, 0.829038, -0.629320],
          [0.743145, -0.529919, 0.275637, -0.961262, 0.848048, -0.669131],
          [0.707107, -0.500000, 0.258819, -0.965926, 0.866025, -0.707107],
          [0.669131, -0.469472, 0.241922, -0.970296, 0.882948, -0.743145],
          [0.629320, -0.438371, 0.224951, -0.974370, 0.898794, -0.777146],
          [0.587785, -0.406737, 0.207912, -0.978148, 0.913545, -0.809017],
          [0.544639, -0.374607, 0.190809, -0.981627, 0.927184, -0.838671],
          [0.500000, -0.342020, 0.173648, -0.984808, 0.939693, -0.866025],
          [0.453990, -0.309017, 0.156434, -0.987688, 0.951057, -0.891007],
          [0.406737, -0.275637, 0.139173, -0.990268, 0.961262, -0.913545],
          [0.358368, -0.241922, 0.121869, -0.992546, 0.970296, -0.933580],
          [0.309017, -0.207912, 0.104528, -0.994522, 0.978148, -0.951057],
          [0.258819, -0.173648, 0.087156, -0.996195, 0.984808, -0.965926],
          [0.207912, -0.139173, 0.069756, -0.997564, 0.990268, -0.978148],
          [0.156434, -0.104528, 0.052336, -0.998630, 0.994522, -0.987688],
          [0.104528, -0.069756, 0.034899, -0.999391, 0.997564, -0.994522],
          [0.052336, -0.034899, 0.017452, -0.999848, 0.999391, -0.998630],
          [0.000000, -0.000000, 0.000000, -1.000000, 1.000000, -1.000000],
          [-0.052336, 0.034899, -0.017452, -0.999848, 0.999391, -0.998630],
          [-0.104528, 0.069756, -0.034899, -0.999391, 0.997564, -0.994522],
          [-0.156434, 0.104528, -0.052336, -0.998630, 0.994522, -0.987688],
          [-0.207912, 0.139173, -0.069756, -0.997564, 0.990268, -0.978148],
          [-0.258819, 0.173648, -0.087156, -0.996195, 0.984808, -0.965926],
          [-0.309017, 0.207912, -0.104528, -0.994522, 0.978148, -0.951057],
          [-0.358368, 0.241922, -0.121869, -0.992546, 0.970296, -0.933580],
          [-0.406737, 0.275637, -0.139173, -0.990268, 0.961262, -0.913545],
          [-0.453990, 0.309017, -0.156434, -0.987688, 0.951057, -0.891007],
          [-0.500000, 0.342020, -0.173648, -0.984808, 0.939693, -0.866025],
          [-0.544639, 0.374607, -0.190809, -0.981627, 0.927184, -0.838671],
          [-0.587785, 0.406737, -0.207912, -0.978148, 0.913545, -0.809017],
          [-0.629320, 0.438371, -0.224951, -0.974370, 0.898794, -0.777146],
          [-0.669131, 0.469472, -0.241922, -0.970296, 0.882948, -0.743145],
          [-0.707107, 0.500000, -0.258819, -0.965926, 0.866025, -0.707107],
          [-0.743145, 0.529919, -0.275637, -0.961262, 0.848048, -0.669131],
          [-0.777146, 0.559193, -0.292372, -0.956305, 0.829038, -0.629320],
          [-0.809017, 0.587785, -0.309017, -0.951057, 0.809017, -0.587785],
          [-0.838671, 0.615661, -0.325568, -0.945519, 0.788011, -0.544639],
          [-0.866025, 0.642788, -0.342020, -0.939693, 0.766044, -0.500000],
          [-0.891007, 0.669131, -0.358368, -0.933580, 0.743145, -0.453990],
          [-0.913545, 0.694658, -0.374607, -0.927184, 0.719340, -0.406737],
          [-0.933580, 0.719340, -0.390731, -0.920505, 0.694658, -0.358368],
          [-0.951057, 0.743145, -0.406737, -0.913545, 0.669131, -0.309017],
          [-0.965926, 0.766044, -0.422618, -0.906308, 0.642788, -0.258819],
          [-0.978148, 0.788011, -0.438371, -0.898794, 0.615661, -0.207912],
          [-0.987688, 0.809017, -0.453990, -0.891007, 0.587785, -0.156434],
          [-0.994522, 0.829038, -0.469472, -0.882948, 0.559193, -0.104528],
          [-0.998630, 0.848048, -0.484810, -0.874620, 0.529919, -0.052336],
          [-1.000000, 0.866025, -0.500000, -0.866025, 0.500000, 0.000000],
          [-0.998630, 0.882948, -0.515038, -0.857167, 0.469472, 0.052336],
          [-0.994522, 0.898794, -0.529919, -0.848048, 0.438371, 0.104528],
          [-0.987688, 0.913545, -0.544639, -0.838671, 0.406737, 0.156434],
          [-0.978148, 0.927184, -0.559193, -0.829038, 0.374607, 0.207912],
          [-0.965926, 0.939693, -0.573576, -0.819152, 0.342020, 0.258819],
          [-0.951057, 0.951057, -0.587785, -0.809017, 0.309017, 0.309017],
          [-0.933580, 0.961262, -0.601815, -0.798636, 0.275637, 0.358368],
          [-0.913545, 0.970296, -0.615661, -0.788011, 0.241922, 0.406737],
          [-0.891007, 0.978148, -0.629320, -0.777146, 0.207912, 0.453990],
          [-0.866025, 0.984808, -0.642788, -0.766044, 0.173648, 0.500000],
          [-0.838671, 0.990268, -0.656059, -0.754710, 0.139173, 0.544639],
          [-0.809017, 0.994522, -0.669131, -0.743145, 0.104528, 0.587785],
          [-0.777146, 0.997564, -0.681998, -0.731354, 0.069756, 0.629320],
          [-0.743145, 0.999391, -0.694658, -0.719340, 0.034899, 0.669131],
          [-0.707107, 1.000000, -0.707107, -0.707107, 0.000000, 0.707107],
          [-0.669131, 0.999391, -0.719340, -0.694658, -0.034899, 0.743145],
          [-0.629320, 0.997564, -0.731354, -0.681998, -0.069756, 0.777146],
          [-0.587785, 0.994522, -0.743145, -0.669131, -0.104528, 0.809017],
          [-0.544639, 0.990268, -0.754710, -0.656059, -0.139173, 0.838671],
          [-0.500000, 0.984808, -0.766044, -0.642788, -0.173648, 0.866025],
          [-0.453990, 0.978148, -0.777146, -0.629320, -0.207912, 0.891007],
          [-0.406737, 0.970296, -0.788011, -0.615661, -0.241922, 0.913545],
          [-0.358368, 0.961262, -0.798636, -0.601815, -0.275637, 0.933580],
          [-0.309017, 0.951057, -0.809017, -0.587785, -0.309017, 0.951057],
          [-0.258819, 0.939693, -0.819152, -0.573576, -0.342020, 0.965926],
          [-0.207912, 0.927184, -0.829038, -0.559193, -0.374607, 0.978148],
          [-0.156434, 0.913545, -0.838671, -0.544639, -0.406737, 0.987688],
          [-0.104528, 0.898794, -0.848048, -0.529919, -0.438371, 0.994522],
          [-0.052336, 0.882948, -0.857167, -0.515038, -0.469472, 0.998630],
          [-0.000000, 0.866025, -0.866025, -0.500000, -0.500000, 1.000000],
          [0.052336, 0.848048, -0.874620, -0.484810, -0.529919, 0.998630],
          [0.104528, 0.829038, -0.882948, -0.469472, -0.559193, 0.994522],
          [0.156434, 0.809017, -0.891007, -0.453990, -0.587785, 0.987688],
          [0.207912, 0.788011, -0.898794, -0.438371, -0.615661, 0.978148],
          [0.258819, 0.766044, -0.906308, -0.422618, -0.642788, 0.965926],
          [0.309017, 0.743145, -0.913545, -0.406737, -0.669131, 0.951057],
          [0.358368, 0.719340, -0.920505, -0.390731, -0.694658, 0.933580],
          [0.406737, 0.694658, -0.927184, -0.374607, -0.719340, 0.913545],
          [0.453990, 0.669131, -0.933580, -0.358368, -0.743145, 0.891007],
          [0.500000, 0.642788, -0.939693, -0.342020, -0.766044, 0.866025],
          [0.544639, 0.615661, -0.945519, -0.325568, -0.788011, 0.838671],
          [0.587785, 0.587785, -0.951057, -0.309017, -0.809017, 0.809017],
          [0.629320, 0.559193, -0.956305, -0.292372, -0.829038, 0.777146],
          [0.669131, 0.529919, -0.961262, -0.275637, -0.848048, 0.743145],
          [0.707107, 0.500000, -0.965926, -0.258819, -0.866025, 0.707107],
          [0.743145, 0.469472, -0.970296, -0.241922, -0.882948, 0.669131],
          [0.777146, 0.438371, -0.974370, -0.224951, -0.898794, 0.629320],
          [0.809017, 0.406737, -0.978148, -0.207912, -0.913545, 0.587785],
          [0.838671, 0.374607, -0.981627, -0.190809, -0.927184, 0.544639],
          [0.866025, 0.342020, -0.984808, -0.173648, -0.939693, 0.500000],
          [0.891007, 0.309017, -0.987688, -0.156434, -0.951057, 0.453990],
          [0.913545, 0.275637, -0.990268, -0.139173, -0.961262, 0.406737],
          [0.933580, 0.241922, -0.992546, -0.121869, -0.970296, 0.358368],
          [0.951057, 0.207912, -0.994522, -0.104528, -0.978148, 0.309017],
          [0.965926, 0.173648, -0.996195, -0.087156, -0.984808, 0.258819],
          [0.978148, 0.139173, -0.997564, -0.069756, -0.990268, 0.207912],
          [0.987688, 0.104528, -0.998630, -0.052336, -0.994522, 0.156434],
          [0.994522, 0.069756, -0.999391, -0.034899, -0.997564, 0.104528],
          [0.998630, 0.034899, -0.999848, -0.017452, -0.999391, 0.052336],
          [1.000000, 0.000000, -1.000000, -0.000000, -1.000000, 0.000000],
          [0.998630, -0.034899, -0.999848, 0.017452, -0.999391, -0.052336],
          [0.994522, -0.069756, -0.999391, 0.034899, -0.997564, -0.104528],
          [0.987688, -0.104528, -0.998630, 0.052336, -0.994522, -0.156434],
          [0.978148, -0.139173, -0.997564, 0.069756, -0.990268, -0.207912],
          [0.965926, -0.173648, -0.996195, 0.087156, -0.984808, -0.258819],
          [0.951057, -0.207912, -0.994522, 0.104528, -0.978148, -0.309017],
          [0.933580, -0.241922, -0.992546, 0.121869, -0.970296, -0.358368],
          [0.913545, -0.275637, -0.990268, 0.139173, -0.961262, -0.406737],
          [0.891007, -0.309017, -0.987688, 0.156434, -0.951057, -0.453990],
          [0.866025, -0.342020, -0.984808, 0.173648, -0.939693, -0.500000],
          [0.838671, -0.374607, -0.981627, 0.190809, -0.927184, -0.544639],
          [0.809017, -0.406737, -0.978148, 0.207912, -0.913545, -0.587785],
          [0.777146, -0.438371, -0.974370, 0.224951, -0.898794, -0.629320],
          [0.743145, -0.469472, -0.970296, 0.241922, -0.882948, -0.669131],
          [0.707107, -0.500000, -0.965926, 0.258819, -0.866025, -0.707107],
          [0.669131, -0.529919, -0.961262, 0.275637, -0.848048, -0.743145],
          [0.629320, -0.559193, -0.956305, 0.292372, -0.829038, -0.777146],
          [0.587785, -0.587785, -0.951057, 0.309017, -0.809017, -0.809017],
          [0.544639, -0.615661, -0.945519, 0.325568, -0.788011, -0.838671],
          [0.500000, -0.642788, -0.939693, 0.342020, -0.766044, -0.866025],
          [0.453990, -0.669131, -0.933580, 0.358368, -0.743145, -0.891007],
          [0.406737, -0.694658, -0.927184, 0.374607, -0.719340, -0.913545],
          [0.358368, -0.719340, -0.920505, 0.390731, -0.694658, -0.933580],
          [0.309017, -0.743145, -0.913545, 0.406737, -0.669131, -0.951057],
          [0.258819, -0.766044, -0.906308, 0.422618, -0.642788, -0.965926],
          [0.207912, -0.788011, -0.898794, 0.438371, -0.615661, -0.978148],
          [0.156434, -0.809017, -0.891007, 0.453990, -0.587785, -0.987688],
          [0.104528, -0.829038, -0.882948, 0.469472, -0.559193, -0.994522],
          [0.052336, -0.848048, -0.874620, 0.484810, -0.529919, -0.998630],
          [0.000000, -0.866025, -0.866025, 0.500000, -0.500000, -1.000000],
          [-0.052336, -0.882948, -0.857167, 0.515038, -0.469472, -0.998630],
          [-0.104528, -0.898794, -0.848048, 0.529919, -0.438371, -0.994522],
          [-0.156434, -0.913545, -0.838671, 0.544639, -0.406737, -0.987688],
          [-0.207912, -0.927184, -0.829038, 0.559193, -0.374607, -0.978148],
          [-0.258819, -0.939693, -0.819152, 0.573576, -0.342020, -0.965926],
          [-0.309017, -0.951057, -0.809017, 0.587785, -0.309017, -0.951057],
          [-0.358368, -0.961262, -0.798636, 0.601815, -0.275637, -0.933580],
          [-0.406737, -0.970296, -0.788011, 0.615661, -0.241922, -0.913545],
          [-0.453990, -0.978148, -0.777146, 0.629320, -0.207912, -0.891007],
          [-0.500000, -0.984808, -0.766044, 0.642788, -0.173648, -0.866025],
          [-0.544639, -0.990268, -0.754710, 0.656059, -0.139173, -0.838671],
          [-0.587785, -0.994522, -0.743145, 0.669131, -0.104528, -0.809017],
          [-0.629320, -0.997564, -0.731354, 0.681998, -0.069756, -0.777146],
          [-0.669131, -0.999391, -0.719340, 0.694658, -0.034899, -0.743145],
          [-0.707107, -1.000000, -0.707107, 0.707107, -0.000000, -0.707107],
          [-0.743145, -0.999391, -0.694658, 0.719340, 0.034899, -0.669131],
          [-0.777146, -0.997564, -0.681998, 0.731354, 0.069756, -0.629320],
          [-0.809017, -0.994522, -0.669131, 0.743145, 0.104528, -0.587785],
          [-0.838671, -0.990268, -0.656059, 0.754710, 0.139173, -0.544639],
          [-0.866025, -0.984808, -0.642788, 0.766044, 0.173648, -0.500000],
          [-0.891007, -0.978148, -0.629320, 0.777146, 0.207912, -0.453990],
          [-0.913545, -0.970296, -0.615661, 0.788011, 0.241922, -0.406737],
          [-0.933580, -0.961262, -0.601815, 0.798636, 0.275637, -0.358368],
          [-0.951057, -0.951057, -0.587785, 0.809017, 0.309017, -0.309017],
          [-0.965926, -0.939693, -0.573576, 0.819152, 0.342020, -0.258819],
          [-0.978148, -0.927184, -0.559193, 0.829038, 0.374607, -0.207912],
          [-0.987688, -0.913545, -0.544639, 0.838671, 0.406737, -0.156434],
          [-0.994522, -0.898794, -0.529919, 0.848048, 0.438371, -0.104528],
          [-0.998630, -0.882948, -0.515038, 0.857167, 0.469472, -0.052336],
          [-1.000000, -0.866025, -0.500000, 0.866025, 0.500000, -0.000000],
          [-0.998630, -0.848048, -0.484810, 0.874620, 0.529919, 0.052336],
          [-0.994522, -0.829038, -0.469472, 0.882948, 0.559193, 0.104528],
          [-0.987688, -0.809017, -0.453990, 0.891007, 0.587785, 0.156434],
          [-0.978148, -0.788011, -0.438371, 0.898794, 0.615661, 0.207912],
          [-0.965926, -0.766044, -0.422618, 0.906308, 0.642788, 0.258819],
          [-0.951057, -0.743145, -0.406737, 0.913545, 0.669131, 0.309017],
          [-0.933580, -0.719340, -0.390731, 0.920505, 0.694658, 0.358368],
          [-0.913545, -0.694658, -0.374607, 0.927184, 0.719340, 0.406737],
          [-0.891007, -0.669131, -0.358368, 0.933580, 0.743145, 0.453990],
          [-0.866025, -0.642788, -0.342020, 0.939693, 0.766044, 0.500000],
          [-0.838671, -0.615661, -0.325568, 0.945519, 0.788011, 0.544639],
          [-0.809017, -0.587785, -0.309017, 0.951057, 0.809017, 0.587785],
          [-0.777146, -0.559193, -0.292372, 0.956305, 0.829038, 0.629320],
          [-0.743145, -0.529919, -0.275637, 0.961262, 0.848048, 0.669131],
          [-0.707107, -0.500000, -0.258819, 0.965926, 0.866025, 0.707107],
          [-0.669131, -0.469472, -0.241922, 0.970296, 0.882948, 0.743145],
          [-0.629320, -0.438371, -0.224951, 0.974370, 0.898794, 0.777146],
          [-0.587785, -0.406737, -0.207912, 0.978148, 0.913545, 0.809017],
          [-0.544639, -0.374607, -0.190809, 0.981627, 0.927184, 0.838671],
          [-0.500000, -0.342020, -0.173648, 0.984808, 0.939693, 0.866025],
          [-0.453990, -0.309017, -0.156434, 0.987688, 0.951057, 0.891007],
          [-0.406737, -0.275637, -0.139173, 0.990268, 0.961262, 0.913545],
          [-0.358368, -0.241922, -0.121869, 0.992546, 0.970296, 0.933580],
          [-0.309017, -0.207912, -0.104528, 0.994522, 0.978148, 0.951057],
          [-0.258819, -0.173648, -0.087156, 0.996195, 0.984808, 0.965926],
          [-0.207912, -0.139173, -0.069756, 0.997564, 0.990268, 0.978148],
          [-0.156434, -0.104528, -0.052336, 0.998630, 0.994522, 0.987688],
          [-0.104528, -0.069756, -0.034899, 0.999391, 0.997564, 0.994522],
          [-0.052336, -0.034899, -0.017452, 0.999848, 0.999391, 0.998630],
      ],
      [
          [-1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
              -1.000000, -0.000000, 0.000000, -0.000000],
          [-0.999848, 0.017452, 0.999543, -0.030224, 0.000264,
              -0.999086, 0.042733, -0.000590, 0.000004],
          [-0.999391, 0.034899, 0.998173, -0.060411, 0.001055,
              -0.996348, 0.085356, -0.002357, 0.000034],
          [-0.998630, 0.052336, 0.995891, -0.090524, 0.002372,
              -0.991791, 0.127757, -0.005297, 0.000113],
          [-0.997564, 0.069756, 0.992701, -0.120527, 0.004214,
              -0.985429, 0.169828, -0.009400, 0.000268],
          [-0.996195, 0.087156, 0.988606, -0.150384, 0.006578,
              -0.977277, 0.211460, -0.014654, 0.000523],
          [-0.994522, 0.104528, 0.983611, -0.180057, 0.009462,
              -0.967356, 0.252544, -0.021043, 0.000903],
          [-0.992546, 0.121869, 0.977722, -0.209511, 0.012862,
              -0.955693, 0.292976, -0.028547, 0.001431],
          [-0.990268, 0.139173, 0.970946, -0.238709, 0.016774,
              -0.942316, 0.332649, -0.037143, 0.002131],
          [-0.987688, 0.156434, 0.963292, -0.267617, 0.021193,
              -0.927262, 0.371463, -0.046806, 0.003026],
          [-0.984808, 0.173648, 0.954769, -0.296198, 0.026114,
              -0.910569, 0.409317, -0.057505, 0.004140],
          [-0.981627, 0.190809, 0.945388, -0.324419, 0.031530,
              -0.892279, 0.446114, -0.069209, 0.005492],
          [-0.978148, 0.207912, 0.935159, -0.352244, 0.037436,
              -0.872441, 0.481759, -0.081880, 0.007105],
          [-0.974370, 0.224951, 0.924096, -0.379641, 0.043823,
              -0.851105, 0.516162, -0.095481, 0.008999],
          [-0.970296, 0.241922, 0.912211, -0.406574, 0.050685,
              -0.828326, 0.549233, -0.109969, 0.011193],
          [-0.965926, 0.258819, 0.899519, -0.433013, 0.058013,
              -0.804164, 0.580889, -0.125300, 0.013707],
          [-0.961262, 0.275637, 0.886036, -0.458924, 0.065797,
              -0.778680, 0.611050, -0.141427, 0.016556],
          [-0.956305, 0.292372, 0.871778, -0.484275, 0.074029,
              -0.751940, 0.639639, -0.158301, 0.019758],
          [-0.951057, 0.309017, 0.856763, -0.509037, 0.082698,
              -0.724012, 0.666583, -0.175868, 0.023329],
          [-0.945519, 0.325568, 0.841008, -0.533178, 0.091794,
              -0.694969, 0.691816, -0.194075, 0.027281],
          [-0.939693, 0.342020, 0.824533, -0.556670, 0.101306,
              -0.664885, 0.715274, -0.212865, 0.031630],
          [-0.933580, 0.358368, 0.807359, -0.579484, 0.111222,
              -0.633837, 0.736898, -0.232180, 0.036385],
          [-0.927184, 0.374607, 0.789505, -0.601592, 0.121529,
              -0.601904, 0.756637, -0.251960, 0.041559],
          [-0.920505, 0.390731, 0.770994, -0.622967, 0.132217,
              -0.569169, 0.774442, -0.272143, 0.047160],
          [-0.913545, 0.406737, 0.751848, -0.643582, 0.143271,
              -0.535715, 0.790270, -0.292666, 0.053196],
          [-0.906308, 0.422618, 0.732091, -0.663414, 0.154678,
              -0.501627, 0.804083, -0.313464, 0.059674],
          [-0.898794, 0.438371, 0.711746, -0.682437, 0.166423,
              -0.466993, 0.815850, -0.334472, 0.066599],
          [-0.891007, 0.453990, 0.690839, -0.700629, 0.178494,
              -0.431899, 0.825544, -0.355623, 0.073974],
          [-0.882948, 0.469472, 0.669395, -0.717968, 0.190875,
              -0.396436, 0.833145, -0.376851, 0.081803],
          [-0.874620, 0.484810, 0.647439, -0.734431, 0.203551,
              -0.360692, 0.838638, -0.398086, 0.090085],
          [-0.866025, 0.500000, 0.625000, -0.750000, 0.216506,
              -0.324760, 0.842012, -0.419263, 0.098821],
          [-0.857167, 0.515038, 0.602104, -0.764655, 0.229726,
              -0.288728, 0.843265, -0.440311, 0.108009],
          [-0.848048, 0.529919, 0.578778, -0.778378, 0.243192,
              -0.252688, 0.842399, -0.461164, 0.117644],
          [-0.838671, 0.544639, 0.555052, -0.791154, 0.256891,
              -0.216730, 0.839422, -0.481753, 0.127722],
          [-0.829038, 0.559193, 0.530955, -0.802965, 0.270803,
              -0.180944, 0.834347, -0.502011, 0.138237],
          [-0.819152, 0.573576, 0.506515, -0.813798, 0.284914,
              -0.145420, 0.827194, -0.521871, 0.149181],
          [-0.809017, 0.587785, 0.481763, -0.823639, 0.299204,
              -0.110246, 0.817987, -0.541266, 0.160545],
          [-0.798636, 0.601815, 0.456728, -0.832477, 0.313658,
              -0.075508, 0.806757, -0.560132, 0.172317],
          [-0.788011, 0.615661, 0.431441, -0.840301, 0.328257,
              -0.041294, 0.793541, -0.578405, 0.184487],
          [-0.777146, 0.629320, 0.405934, -0.847101, 0.342984,
              -0.007686, 0.778379, -0.596021, 0.197040],
          [-0.766044, 0.642788, 0.380236, -0.852869, 0.357821,
              0.025233, 0.761319, -0.612921, 0.209963],
          [-0.754710, 0.656059, 0.354380, -0.857597, 0.372749,
              0.057383, 0.742412, -0.629044, 0.223238],
          [-0.743145, 0.669131, 0.328396, -0.861281, 0.387751,
              0.088686, 0.721714, -0.644334, 0.236850],
          [-0.731354, 0.681998, 0.302317, -0.863916, 0.402807,
              0.119068, 0.699288, -0.658734, 0.250778],
          [-0.719340, 0.694658, 0.276175, -0.865498, 0.417901,
              0.148454, 0.675199, -0.672190, 0.265005],
          [-0.707107, 0.707107, 0.250000, -0.866025, 0.433013,
              0.176777, 0.649519, -0.684653, 0.279508],
          [-0.694658, 0.719340, 0.223825, -0.865498, 0.448125,
              0.203969, 0.622322, -0.696073, 0.294267],
          [-0.681998, 0.731354, 0.197683, -0.863916, 0.463218,
              0.229967, 0.593688, -0.706405, 0.309259],
          [-0.669131, 0.743145, 0.171604, -0.861281, 0.478275,
              0.254712, 0.563700, -0.715605, 0.324459],
          [-0.656059, 0.754710, 0.145620, -0.857597, 0.493276,
              0.278147, 0.532443, -0.723633, 0.339844],
          [-0.642788, 0.766044, 0.119764, -0.852869, 0.508205,
              0.300221, 0.500009, -0.730451, 0.355387],
          [-0.629320, 0.777146, 0.094066, -0.847101, 0.523041,
              0.320884, 0.466490, -0.736025, 0.371063],
          [-0.615661, 0.788011, 0.068559, -0.840301, 0.537768,
              0.340093, 0.431982, -0.740324, 0.386845],
          [-0.601815, 0.798636, 0.043272, -0.832477, 0.552367,
              0.357807, 0.396584, -0.743320, 0.402704],
          [-0.587785, 0.809017, 0.018237, -0.823639, 0.566821,
              0.373991, 0.360397, -0.744989, 0.418613],
          [-0.573576, 0.819152, -0.006515, -0.813798, 0.581112,
              0.388612, 0.323524, -0.745308, 0.434544],
          [-0.559193, 0.829038, -0.030955, -0.802965, 0.595222,
              0.401645, 0.286069, -0.744262, 0.450467],
          [-0.544639, 0.838671, -0.055052, -0.791154, 0.609135,
              0.413066, 0.248140, -0.741835, 0.466352],
          [-0.529919, 0.848048, -0.078778, -0.778378, 0.622833,
              0.422856, 0.209843, -0.738017, 0.482171],
          [-0.515038, 0.857167, -0.102104, -0.764655, 0.636300,
              0.431004, 0.171288, -0.732801, 0.497894],
          [-0.500000, 0.866025, -0.125000, -0.750000, 0.649519,
              0.437500, 0.132583, -0.726184, 0.513490],
          [-0.484810, 0.874620, -0.147439, -0.734431, 0.662474,
              0.442340, 0.093837, -0.718167, 0.528929],
          [-0.469472, 0.882948, -0.169395, -0.717968, 0.675150,
              0.445524, 0.055160, -0.708753, 0.544183],
          [-0.453990, 0.891007, -0.190839, -0.700629, 0.687531,
              0.447059, 0.016662, -0.697950, 0.559220],
          [-0.438371, 0.898794, -0.211746, -0.682437, 0.699602,
              0.446953, -0.021550, -0.685769, 0.574011],
          [-0.422618, 0.906308, -0.232091, -0.663414, 0.711348,
              0.445222, -0.059368, -0.672226, 0.588528],
          [-0.406737, 0.913545, -0.251848, -0.643582, 0.722755,
              0.441884, -0.096684, -0.657339, 0.602741],
          [-0.390731, 0.920505, -0.270994, -0.622967, 0.733809,
              0.436964, -0.133395, -0.641130, 0.616621],
          [-0.374607, 0.927184, -0.289505, -0.601592, 0.744496,
              0.430488, -0.169397, -0.623624, 0.630141],
          [-0.358368, 0.933580, -0.307359, -0.579484, 0.754804,
              0.422491, -0.204589, -0.604851, 0.643273],
          [-0.342020, 0.939693, -0.324533, -0.556670, 0.764720,
              0.413008, -0.238872, -0.584843, 0.655990],
          [-0.325568, 0.945519, -0.341008, -0.533178, 0.774231,
              0.402081, -0.272150, -0.563635, 0.668267],
          [-0.309017, 0.951057, -0.356763, -0.509037, 0.783327,
              0.389754, -0.304329, -0.541266, 0.680078],
          [-0.292372, 0.956305, -0.371778, -0.484275, 0.791997,
              0.376077, -0.335319, -0.517778, 0.691399],
          [-0.275637, 0.961262, -0.386036, -0.458924, 0.800228,
              0.361102, -0.365034, -0.493216, 0.702207],
          [-0.258819, 0.965926, -0.399519, -0.433013, 0.808013,
              0.344885, -0.393389, -0.467627, 0.712478],
          [-0.241922, 0.970296, -0.412211, -0.406574, 0.815340,
              0.327486, -0.420306, -0.441061, 0.722191],
          [-0.224951, 0.974370, -0.424096, -0.379641, 0.822202,
              0.308969, -0.445709, -0.413572, 0.731327],
          [-0.207912, 0.978148, -0.435159, -0.352244, 0.828589,
              0.289399, -0.469527, -0.385215, 0.739866],
          [-0.190809, 0.981627, -0.445388, -0.324419, 0.834495,
              0.268846, -0.491693, -0.356047, 0.747790],
          [-0.173648, 0.984808, -0.454769, -0.296198, 0.839912,
              0.247382, -0.512145, -0.326129, 0.755082],
          [-0.156434, 0.987688, -0.463292, -0.267617, 0.844832,
              0.225081, -0.530827, -0.295521, 0.761728],
          [-0.139173, 0.990268, -0.470946, -0.238709, 0.849251,
              0.202020, -0.547684, -0.264287, 0.767712],
          [-0.121869, 0.992546, -0.477722, -0.209511, 0.853163,
              0.178279, -0.562672, -0.232494, 0.773023],
          [-0.104528, 0.994522, -0.483611, -0.180057, 0.856563,
              0.153937, -0.575747, -0.200207, 0.777648],
          [-0.087156, 0.996195, -0.488606, -0.150384, 0.859447,
              0.129078, -0.586872, -0.167494, 0.781579],
          [-0.069756, 0.997564, -0.492701, -0.120527, 0.861811,
              0.103786, -0.596018, -0.134426, 0.784806],
          [-0.052336, 0.998630, -0.495891, -0.090524, 0.863653,
              0.078146, -0.603158, -0.101071, 0.787324],
          [-0.034899, 0.999391, -0.498173, -0.060411, 0.864971,
              0.052243, -0.608272, -0.067500, 0.789126],
          [-0.017452, 0.999848, -0.499543, -0.030224, 0.865762,
              0.026165, -0.611347, -0.033786, 0.790208],
          [0.000000, 1.000000, -0.500000, 0.000000, 0.866025,
              -0.000000, -0.612372, 0.000000, 0.790569],
          [0.017452, 0.999848, -0.499543, 0.030224, 0.865762,
              -0.026165, -0.611347, 0.033786, 0.790208],
          [0.034899, 0.999391, -0.498173, 0.060411, 0.864971,
              -0.052243, -0.608272, 0.067500, 0.789126],
          [0.052336, 0.998630, -0.495891, 0.090524, 0.863653,
              -0.078146, -0.603158, 0.101071, 0.787324],
          [0.069756, 0.997564, -0.492701, 0.120527, 0.861811,
              -0.103786, -0.596018, 0.134426, 0.784806],
          [0.087156, 0.996195, -0.488606, 0.150384, 0.859447,
              -0.129078, -0.586872, 0.167494, 0.781579],
          [0.104528, 0.994522, -0.483611, 0.180057, 0.856563,
              -0.153937, -0.575747, 0.200207, 0.777648],
          [0.121869, 0.992546, -0.477722, 0.209511, 0.853163,
              -0.178279, -0.562672, 0.232494, 0.773023],
          [0.139173, 0.990268, -0.470946, 0.238709, 0.849251,
              -0.202020, -0.547684, 0.264287, 0.767712],
          [0.156434, 0.987688, -0.463292, 0.267617, 0.844832,
              -0.225081, -0.530827, 0.295521, 0.761728],
          [0.173648, 0.984808, -0.454769, 0.296198, 0.839912,
              -0.247382, -0.512145, 0.326129, 0.755082],
          [0.190809, 0.981627, -0.445388, 0.324419, 0.834495,
              -0.268846, -0.491693, 0.356047, 0.747790],
          [0.207912, 0.978148, -0.435159, 0.352244, 0.828589,
              -0.289399, -0.469527, 0.385215, 0.739866],
          [0.224951, 0.974370, -0.424096, 0.379641, 0.822202,
              -0.308969, -0.445709, 0.413572, 0.731327],
          [0.241922, 0.970296, -0.412211, 0.406574, 0.815340,
              -0.327486, -0.420306, 0.441061, 0.722191],
          [0.258819, 0.965926, -0.399519, 0.433013, 0.808013,
              -0.344885, -0.393389, 0.467627, 0.712478],
          [0.275637, 0.961262, -0.386036, 0.458924, 0.800228,
              -0.361102, -0.365034, 0.493216, 0.702207],
          [0.292372, 0.956305, -0.371778, 0.484275, 0.791997,
              -0.376077, -0.335319, 0.517778, 0.691399],
          [0.309017, 0.951057, -0.356763, 0.509037, 0.783327,
              -0.389754, -0.304329, 0.541266, 0.680078],
          [0.325568, 0.945519, -0.341008, 0.533178, 0.774231,
              -0.402081, -0.272150, 0.563635, 0.668267],
          [0.342020, 0.939693, -0.324533, 0.556670, 0.764720,
              -0.413008, -0.238872, 0.584843, 0.655990],
          [0.358368, 0.933580, -0.307359, 0.579484, 0.754804,
              -0.422491, -0.204589, 0.604851, 0.643273],
          [0.374607, 0.927184, -0.289505, 0.601592, 0.744496,
              -0.430488, -0.169397, 0.623624, 0.630141],
          [0.390731, 0.920505, -0.270994, 0.622967, 0.733809,
              -0.436964, -0.133395, 0.641130, 0.616621],
          [0.406737, 0.913545, -0.251848, 0.643582, 0.722755,
              -0.441884, -0.096684, 0.657339, 0.602741],
          [0.422618, 0.906308, -0.232091, 0.663414, 0.711348,
              -0.445222, -0.059368, 0.672226, 0.588528],
          [0.438371, 0.898794, -0.211746, 0.682437, 0.699602,
              -0.446953, -0.021550, 0.685769, 0.574011],
          [0.453990, 0.891007, -0.190839, 0.700629, 0.687531,
              -0.447059, 0.016662, 0.697950, 0.559220],
          [0.469472, 0.882948, -0.169395, 0.717968, 0.675150,
              -0.445524, 0.055160, 0.708753, 0.544183],
          [0.484810, 0.874620, -0.147439, 0.734431, 0.662474,
              -0.442340, 0.093837, 0.718167, 0.528929],
          [0.500000, 0.866025, -0.125000, 0.750000, 0.649519,
              -0.437500, 0.132583, 0.726184, 0.513490],
          [0.515038, 0.857167, -0.102104, 0.764655, 0.636300,
              -0.431004, 0.171288, 0.732801, 0.497894],
          [0.529919, 0.848048, -0.078778, 0.778378, 0.622833,
              -0.422856, 0.209843, 0.738017, 0.482171],
          [0.544639, 0.838671, -0.055052, 0.791154, 0.609135,
              -0.413066, 0.248140, 0.741835, 0.466352],
          [0.559193, 0.829038, -0.030955, 0.802965, 0.595222,
              -0.401645, 0.286069, 0.744262, 0.450467],
          [0.573576, 0.819152, -0.006515, 0.813798, 0.581112,
              -0.388612, 0.323524, 0.745308, 0.434544],
          [0.587785, 0.809017, 0.018237, 0.823639, 0.566821,
              -0.373991, 0.360397, 0.744989, 0.418613],
          [0.601815, 0.798636, 0.043272, 0.832477, 0.552367,
              -0.357807, 0.396584, 0.743320, 0.402704],
          [0.615661, 0.788011, 0.068559, 0.840301, 0.537768,
              -0.340093, 0.431982, 0.740324, 0.386845],
          [0.629320, 0.777146, 0.094066, 0.847101, 0.523041,
              -0.320884, 0.466490, 0.736025, 0.371063],
          [0.642788, 0.766044, 0.119764, 0.852869, 0.508205,
              -0.300221, 0.500009, 0.730451, 0.355387],
          [0.656059, 0.754710, 0.145620, 0.857597, 0.493276,
              -0.278147, 0.532443, 0.723633, 0.339844],
          [0.669131, 0.743145, 0.171604, 0.861281, 0.478275,
              -0.254712, 0.563700, 0.715605, 0.324459],
          [0.681998, 0.731354, 0.197683, 0.863916, 0.463218,
              -0.229967, 0.593688, 0.706405, 0.309259],
          [0.694658, 0.719340, 0.223825, 0.865498, 0.448125,
              -0.203969, 0.622322, 0.696073, 0.294267],
          [0.707107, 0.707107, 0.250000, 0.866025, 0.433013,
              -0.176777, 0.649519, 0.684653, 0.279508],
          [0.719340, 0.694658, 0.276175, 0.865498, 0.417901,
              -0.148454, 0.675199, 0.672190, 0.265005],
          [0.731354, 0.681998, 0.302317, 0.863916, 0.402807,
              -0.119068, 0.699288, 0.658734, 0.250778],
          [0.743145, 0.669131, 0.328396, 0.861281, 0.387751,
              -0.088686, 0.721714, 0.644334, 0.236850],
          [0.754710, 0.656059, 0.354380, 0.857597, 0.372749,
              -0.057383, 0.742412, 0.629044, 0.223238],
          [0.766044, 0.642788, 0.380236, 0.852869, 0.357821,
              -0.025233, 0.761319, 0.612921, 0.209963],
          [0.777146, 0.629320, 0.405934, 0.847101, 0.342984,
              0.007686, 0.778379, 0.596021, 0.197040],
          [0.788011, 0.615661, 0.431441, 0.840301, 0.328257,
              0.041294, 0.793541, 0.578405, 0.184487],
          [0.798636, 0.601815, 0.456728, 0.832477, 0.313658,
              0.075508, 0.806757, 0.560132, 0.172317],
          [0.809017, 0.587785, 0.481763, 0.823639, 0.299204,
              0.110246, 0.817987, 0.541266, 0.160545],
          [0.819152, 0.573576, 0.506515, 0.813798, 0.284914,
              0.145420, 0.827194, 0.521871, 0.149181],
          [0.829038, 0.559193, 0.530955, 0.802965, 0.270803,
              0.180944, 0.834347, 0.502011, 0.138237],
          [0.838671, 0.544639, 0.555052, 0.791154, 0.256891,
              0.216730, 0.839422, 0.481753, 0.127722],
          [0.848048, 0.529919, 0.578778, 0.778378, 0.243192,
              0.252688, 0.842399, 0.461164, 0.117644],
          [0.857167, 0.515038, 0.602104, 0.764655, 0.229726,
              0.288728, 0.843265, 0.440311, 0.108009],
          [0.866025, 0.500000, 0.625000, 0.750000, 0.216506,
              0.324760, 0.842012, 0.419263, 0.098821],
          [0.874620, 0.484810, 0.647439, 0.734431, 0.203551,
              0.360692, 0.838638, 0.398086, 0.090085],
          [0.882948, 0.469472, 0.669395, 0.717968, 0.190875,
              0.396436, 0.833145, 0.376851, 0.081803],
          [0.891007, 0.453990, 0.690839, 0.700629, 0.178494,
              0.431899, 0.825544, 0.355623, 0.073974],
          [0.898794, 0.438371, 0.711746, 0.682437, 0.166423,
              0.466993, 0.815850, 0.334472, 0.066599],
          [0.906308, 0.422618, 0.732091, 0.663414, 0.154678,
              0.501627, 0.804083, 0.313464, 0.059674],
          [0.913545, 0.406737, 0.751848, 0.643582, 0.143271,
              0.535715, 0.790270, 0.292666, 0.053196],
          [0.920505, 0.390731, 0.770994, 0.622967, 0.132217,
              0.569169, 0.774442, 0.272143, 0.047160],
          [0.927184, 0.374607, 0.789505, 0.601592, 0.121529,
              0.601904, 0.756637, 0.251960, 0.041559],
          [0.933580, 0.358368, 0.807359, 0.579484, 0.111222,
              0.633837, 0.736898, 0.232180, 0.036385],
          [0.939693, 0.342020, 0.824533, 0.556670, 0.101306,
              0.664885, 0.715274, 0.212865, 0.031630],
          [0.945519, 0.325568, 0.841008, 0.533178, 0.091794,
              0.694969, 0.691816, 0.194075, 0.027281],
          [0.951057, 0.309017, 0.856763, 0.509037, 0.082698,
              0.724012, 0.666583, 0.175868, 0.023329],
          [0.956305, 0.292372, 0.871778, 0.484275, 0.074029,
              0.751940, 0.639639, 0.158301, 0.019758],
          [0.961262, 0.275637, 0.886036, 0.458924, 0.065797,
              0.778680, 0.611050, 0.141427, 0.016556],
          [0.965926, 0.258819, 0.899519, 0.433013, 0.058013,
              0.804164, 0.580889, 0.125300, 0.013707],
          [0.970296, 0.241922, 0.912211, 0.406574, 0.050685,
              0.828326, 0.549233, 0.109969, 0.011193],
          [0.974370, 0.224951, 0.924096, 0.379641, 0.043823,
              0.851105, 0.516162, 0.095481, 0.008999],
          [0.978148, 0.207912, 0.935159, 0.352244, 0.037436,
              0.872441, 0.481759, 0.081880, 0.007105],
          [0.981627, 0.190809, 0.945388, 0.324419, 0.031530,
              0.892279, 0.446114, 0.069209, 0.005492],
          [0.984808, 0.173648, 0.954769, 0.296198, 0.026114,
              0.910569, 0.409317, 0.057505, 0.004140],
          [0.987688, 0.156434, 0.963292, 0.267617, 0.021193,
              0.927262, 0.371463, 0.046806, 0.003026],
          [0.990268, 0.139173, 0.970946, 0.238709, 0.016774,
              0.942316, 0.332649, 0.037143, 0.002131],
          [0.992546, 0.121869, 0.977722, 0.209511, 0.012862,
              0.955693, 0.292976, 0.028547, 0.001431],
          [0.994522, 0.104528, 0.983611, 0.180057, 0.009462,
              0.967356, 0.252544, 0.021043, 0.000903],
          [0.996195, 0.087156, 0.988606, 0.150384, 0.006578,
              0.977277, 0.211460, 0.014654, 0.000523],
          [0.997564, 0.069756, 0.992701, 0.120527, 0.004214,
              0.985429, 0.169828, 0.009400, 0.000268],
          [0.998630, 0.052336, 0.995891, 0.090524, 0.002372,
              0.991791, 0.127757, 0.005297, 0.000113],
          [0.999391, 0.034899, 0.998173, 0.060411, 0.001055,
              0.996348, 0.085356, 0.002357, 0.000034],
          [0.999848, 0.017452, 0.999543, 0.030224, 0.000264,
              0.999086, 0.042733, 0.000590, 0.000004],
          [1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
              1.000000, -0.000000, 0.000000, -0.000000],
      ],
  ];
  const SPHERICAL_HARMONICS_AZIMUTH_RESOLUTION = SPHERICAL_HARMONICS[0].length;
  const SPHERICAL_HARMONICS_ELEVATION_RESOLUTION = SPHERICAL_HARMONICS[1].length;
  /**
   * The maximum allowed ambisonic order.
   */
  const SPHERICAL_HARMONICS_MAX_ORDER = SPHERICAL_HARMONICS[0][0].length / 2;
  /**
   * Pre-computed per-band weighting coefficients for producing energy-preserving
   * Max-Re sources.
   */
  const MAX_RE_WEIGHTS = [
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.000000, 1.000000, 1.000000, 1.000000],
      [1.003236, 1.002156, 0.999152, 0.990038],
      [1.032370, 1.021194, 0.990433, 0.898572],
      [1.062694, 1.040231, 0.979161, 0.799806],
      [1.093999, 1.058954, 0.964976, 0.693603],
      [1.126003, 1.077006, 0.947526, 0.579890],
      [1.158345, 1.093982, 0.926474, 0.458690],
      [1.190590, 1.109437, 0.901512, 0.330158],
      [1.222228, 1.122890, 0.872370, 0.194621],
      [1.252684, 1.133837, 0.838839, 0.052614],
      [1.281987, 1.142358, 0.801199, 0.000000],
      [1.312073, 1.150207, 0.760839, 0.000000],
      [1.343011, 1.157424, 0.717799, 0.000000],
      [1.374649, 1.163859, 0.671999, 0.000000],
      [1.406809, 1.169354, 0.623371, 0.000000],
      [1.439286, 1.173739, 0.571868, 0.000000],
      [1.471846, 1.176837, 0.517465, 0.000000],
      [1.504226, 1.178465, 0.460174, 0.000000],
      [1.536133, 1.178438, 0.400043, 0.000000],
      [1.567253, 1.176573, 0.337165, 0.000000],
      [1.597247, 1.172695, 0.271688, 0.000000],
      [1.625766, 1.166645, 0.203815, 0.000000],
      [1.652455, 1.158285, 0.133806, 0.000000],
      [1.676966, 1.147506, 0.061983, 0.000000],
      [1.699006, 1.134261, 0.000000, 0.000000],
      [1.720224, 1.119789, 0.000000, 0.000000],
      [1.741631, 1.104810, 0.000000, 0.000000],
      [1.763183, 1.089330, 0.000000, 0.000000],
      [1.784837, 1.073356, 0.000000, 0.000000],
      [1.806548, 1.056898, 0.000000, 0.000000],
      [1.828269, 1.039968, 0.000000, 0.000000],
      [1.849952, 1.022580, 0.000000, 0.000000],
      [1.871552, 1.004752, 0.000000, 0.000000],
      [1.893018, 0.986504, 0.000000, 0.000000],
      [1.914305, 0.967857, 0.000000, 0.000000],
      [1.935366, 0.948837, 0.000000, 0.000000],
      [1.956154, 0.929471, 0.000000, 0.000000],
      [1.976625, 0.909790, 0.000000, 0.000000],
      [1.996736, 0.889823, 0.000000, 0.000000],
      [2.016448, 0.869607, 0.000000, 0.000000],
      [2.035721, 0.849175, 0.000000, 0.000000],
      [2.054522, 0.828565, 0.000000, 0.000000],
      [2.072818, 0.807816, 0.000000, 0.000000],
      [2.090581, 0.786964, 0.000000, 0.000000],
      [2.107785, 0.766051, 0.000000, 0.000000],
      [2.124411, 0.745115, 0.000000, 0.000000],
      [2.140439, 0.724196, 0.000000, 0.000000],
      [2.155856, 0.703332, 0.000000, 0.000000],
      [2.170653, 0.682561, 0.000000, 0.000000],
      [2.184823, 0.661921, 0.000000, 0.000000],
      [2.198364, 0.641445, 0.000000, 0.000000],
      [2.211275, 0.621169, 0.000000, 0.000000],
      [2.223562, 0.601125, 0.000000, 0.000000],
      [2.235230, 0.581341, 0.000000, 0.000000],
      [2.246289, 0.561847, 0.000000, 0.000000],
      [2.256751, 0.542667, 0.000000, 0.000000],
      [2.266631, 0.523826, 0.000000, 0.000000],
      [2.275943, 0.505344, 0.000000, 0.000000],
      [2.284707, 0.487239, 0.000000, 0.000000],
      [2.292939, 0.469528, 0.000000, 0.000000],
      [2.300661, 0.452225, 0.000000, 0.000000],
      [2.307892, 0.435342, 0.000000, 0.000000],
      [2.314654, 0.418888, 0.000000, 0.000000],
      [2.320969, 0.402870, 0.000000, 0.000000],
      [2.326858, 0.387294, 0.000000, 0.000000],
      [2.332343, 0.372164, 0.000000, 0.000000],
      [2.337445, 0.357481, 0.000000, 0.000000],
      [2.342186, 0.343246, 0.000000, 0.000000],
      [2.346585, 0.329458, 0.000000, 0.000000],
      [2.350664, 0.316113, 0.000000, 0.000000],
      [2.354442, 0.303208, 0.000000, 0.000000],
      [2.357937, 0.290738, 0.000000, 0.000000],
      [2.361168, 0.278698, 0.000000, 0.000000],
      [2.364152, 0.267080, 0.000000, 0.000000],
      [2.366906, 0.255878, 0.000000, 0.000000],
      [2.369446, 0.245082, 0.000000, 0.000000],
      [2.371786, 0.234685, 0.000000, 0.000000],
      [2.373940, 0.224677, 0.000000, 0.000000],
      [2.375923, 0.215048, 0.000000, 0.000000],
      [2.377745, 0.205790, 0.000000, 0.000000],
      [2.379421, 0.196891, 0.000000, 0.000000],
      [2.380959, 0.188342, 0.000000, 0.000000],
      [2.382372, 0.180132, 0.000000, 0.000000],
      [2.383667, 0.172251, 0.000000, 0.000000],
      [2.384856, 0.164689, 0.000000, 0.000000],
      [2.385945, 0.157435, 0.000000, 0.000000],
      [2.386943, 0.150479, 0.000000, 0.000000],
      [2.387857, 0.143811, 0.000000, 0.000000],
      [2.388694, 0.137421, 0.000000, 0.000000],
      [2.389460, 0.131299, 0.000000, 0.000000],
      [2.390160, 0.125435, 0.000000, 0.000000],
      [2.390801, 0.119820, 0.000000, 0.000000],
      [2.391386, 0.114445, 0.000000, 0.000000],
      [2.391921, 0.109300, 0.000000, 0.000000],
      [2.392410, 0.104376, 0.000000, 0.000000],
      [2.392857, 0.099666, 0.000000, 0.000000],
      [2.393265, 0.095160, 0.000000, 0.000000],
      [2.393637, 0.090851, 0.000000, 0.000000],
      [2.393977, 0.086731, 0.000000, 0.000000],
      [2.394288, 0.082791, 0.000000, 0.000000],
      [2.394571, 0.079025, 0.000000, 0.000000],
      [2.394829, 0.075426, 0.000000, 0.000000],
      [2.395064, 0.071986, 0.000000, 0.000000],
      [2.395279, 0.068699, 0.000000, 0.000000],
      [2.395475, 0.065558, 0.000000, 0.000000],
      [2.395653, 0.062558, 0.000000, 0.000000],
      [2.395816, 0.059693, 0.000000, 0.000000],
      [2.395964, 0.056955, 0.000000, 0.000000],
      [2.396099, 0.054341, 0.000000, 0.000000],
      [2.396222, 0.051845, 0.000000, 0.000000],
      [2.396334, 0.049462, 0.000000, 0.000000],
      [2.396436, 0.047186, 0.000000, 0.000000],
      [2.396529, 0.045013, 0.000000, 0.000000],
      [2.396613, 0.042939, 0.000000, 0.000000],
      [2.396691, 0.040959, 0.000000, 0.000000],
      [2.396761, 0.039069, 0.000000, 0.000000],
      [2.396825, 0.037266, 0.000000, 0.000000],
      [2.396883, 0.035544, 0.000000, 0.000000],
      [2.396936, 0.033901, 0.000000, 0.000000],
      [2.396984, 0.032334, 0.000000, 0.000000],
      [2.397028, 0.030838, 0.000000, 0.000000],
      [2.397068, 0.029410, 0.000000, 0.000000],
      [2.397104, 0.028048, 0.000000, 0.000000],
      [2.397137, 0.026749, 0.000000, 0.000000],
      [2.397167, 0.025509, 0.000000, 0.000000],
      [2.397194, 0.024326, 0.000000, 0.000000],
      [2.397219, 0.023198, 0.000000, 0.000000],
      [2.397242, 0.022122, 0.000000, 0.000000],
      [2.397262, 0.021095, 0.000000, 0.000000],
      [2.397281, 0.020116, 0.000000, 0.000000],
      [2.397298, 0.019181, 0.000000, 0.000000],
      [2.397314, 0.018290, 0.000000, 0.000000],
      [2.397328, 0.017441, 0.000000, 0.000000],
      [2.397341, 0.016630, 0.000000, 0.000000],
      [2.397352, 0.015857, 0.000000, 0.000000],
      [2.397363, 0.015119, 0.000000, 0.000000],
      [2.397372, 0.014416, 0.000000, 0.000000],
      [2.397381, 0.013745, 0.000000, 0.000000],
      [2.397389, 0.013106, 0.000000, 0.000000],
      [2.397396, 0.012496, 0.000000, 0.000000],
      [2.397403, 0.011914, 0.000000, 0.000000],
      [2.397409, 0.011360, 0.000000, 0.000000],
      [2.397414, 0.010831, 0.000000, 0.000000],
      [2.397419, 0.010326, 0.000000, 0.000000],
      [2.397424, 0.009845, 0.000000, 0.000000],
      [2.397428, 0.009387, 0.000000, 0.000000],
      [2.397432, 0.008949, 0.000000, 0.000000],
      [2.397435, 0.008532, 0.000000, 0.000000],
      [2.397438, 0.008135, 0.000000, 0.000000],
      [2.397441, 0.007755, 0.000000, 0.000000],
      [2.397443, 0.007394, 0.000000, 0.000000],
      [2.397446, 0.007049, 0.000000, 0.000000],
      [2.397448, 0.006721, 0.000000, 0.000000],
      [2.397450, 0.006407, 0.000000, 0.000000],
      [2.397451, 0.006108, 0.000000, 0.000000],
      [2.397453, 0.005824, 0.000000, 0.000000],
      [2.397454, 0.005552, 0.000000, 0.000000],
      [2.397456, 0.005293, 0.000000, 0.000000],
      [2.397457, 0.005046, 0.000000, 0.000000],
      [2.397458, 0.004811, 0.000000, 0.000000],
      [2.397459, 0.004586, 0.000000, 0.000000],
      [2.397460, 0.004372, 0.000000, 0.000000],
      [2.397461, 0.004168, 0.000000, 0.000000],
      [2.397461, 0.003974, 0.000000, 0.000000],
      [2.397462, 0.003788, 0.000000, 0.000000],
      [2.397463, 0.003611, 0.000000, 0.000000],
      [2.397463, 0.003443, 0.000000, 0.000000],
      [2.397464, 0.003282, 0.000000, 0.000000],
      [2.397464, 0.003129, 0.000000, 0.000000],
      [2.397465, 0.002983, 0.000000, 0.000000],
      [2.397465, 0.002844, 0.000000, 0.000000],
      [2.397465, 0.002711, 0.000000, 0.000000],
      [2.397466, 0.002584, 0.000000, 0.000000],
      [2.397466, 0.002464, 0.000000, 0.000000],
      [2.397466, 0.002349, 0.000000, 0.000000],
      [2.397466, 0.002239, 0.000000, 0.000000],
      [2.397467, 0.002135, 0.000000, 0.000000],
      [2.397467, 0.002035, 0.000000, 0.000000],
      [2.397467, 0.001940, 0.000000, 0.000000],
      [2.397467, 0.001849, 0.000000, 0.000000],
      [2.397467, 0.001763, 0.000000, 0.000000],
      [2.397467, 0.001681, 0.000000, 0.000000],
      [2.397468, 0.001602, 0.000000, 0.000000],
      [2.397468, 0.001527, 0.000000, 0.000000],
      [2.397468, 0.001456, 0.000000, 0.000000],
      [2.397468, 0.001388, 0.000000, 0.000000],
      [2.397468, 0.001323, 0.000000, 0.000000],
      [2.397468, 0.001261, 0.000000, 0.000000],
      [2.397468, 0.001202, 0.000000, 0.000000],
      [2.397468, 0.001146, 0.000000, 0.000000],
      [2.397468, 0.001093, 0.000000, 0.000000],
      [2.397468, 0.001042, 0.000000, 0.000000],
      [2.397468, 0.000993, 0.000000, 0.000000],
      [2.397468, 0.000947, 0.000000, 0.000000],
      [2.397468, 0.000902, 0.000000, 0.000000],
      [2.397468, 0.000860, 0.000000, 0.000000],
      [2.397468, 0.000820, 0.000000, 0.000000],
      [2.397469, 0.000782, 0.000000, 0.000000],
      [2.397469, 0.000745, 0.000000, 0.000000],
      [2.397469, 0.000710, 0.000000, 0.000000],
      [2.397469, 0.000677, 0.000000, 0.000000],
      [2.397469, 0.000646, 0.000000, 0.000000],
      [2.397469, 0.000616, 0.000000, 0.000000],
      [2.397469, 0.000587, 0.000000, 0.000000],
      [2.397469, 0.000559, 0.000000, 0.000000],
      [2.397469, 0.000533, 0.000000, 0.000000],
      [2.397469, 0.000508, 0.000000, 0.000000],
      [2.397469, 0.000485, 0.000000, 0.000000],
      [2.397469, 0.000462, 0.000000, 0.000000],
      [2.397469, 0.000440, 0.000000, 0.000000],
      [2.397469, 0.000420, 0.000000, 0.000000],
      [2.397469, 0.000400, 0.000000, 0.000000],
      [2.397469, 0.000381, 0.000000, 0.000000],
      [2.397469, 0.000364, 0.000000, 0.000000],
      [2.397469, 0.000347, 0.000000, 0.000000],
      [2.397469, 0.000330, 0.000000, 0.000000],
      [2.397469, 0.000315, 0.000000, 0.000000],
      [2.397469, 0.000300, 0.000000, 0.000000],
      [2.397469, 0.000286, 0.000000, 0.000000],
      [2.397469, 0.000273, 0.000000, 0.000000],
      [2.397469, 0.000260, 0.000000, 0.000000],
      [2.397469, 0.000248, 0.000000, 0.000000],
      [2.397469, 0.000236, 0.000000, 0.000000],
      [2.397469, 0.000225, 0.000000, 0.000000],
      [2.397469, 0.000215, 0.000000, 0.000000],
      [2.397469, 0.000205, 0.000000, 0.000000],
      [2.397469, 0.000195, 0.000000, 0.000000],
      [2.397469, 0.000186, 0.000000, 0.000000],
      [2.397469, 0.000177, 0.000000, 0.000000],
      [2.397469, 0.000169, 0.000000, 0.000000],
      [2.397469, 0.000161, 0.000000, 0.000000],
      [2.397469, 0.000154, 0.000000, 0.000000],
      [2.397469, 0.000147, 0.000000, 0.000000],
      [2.397469, 0.000140, 0.000000, 0.000000],
      [2.397469, 0.000133, 0.000000, 0.000000],
      [2.397469, 0.000127, 0.000000, 0.000000],
      [2.397469, 0.000121, 0.000000, 0.000000],
      [2.397469, 0.000115, 0.000000, 0.000000],
      [2.397469, 0.000110, 0.000000, 0.000000],
      [2.397469, 0.000105, 0.000000, 0.000000],
      [2.397469, 0.000100, 0.000000, 0.000000],
      [2.397469, 0.000095, 0.000000, 0.000000],
      [2.397469, 0.000091, 0.000000, 0.000000],
      [2.397469, 0.000087, 0.000000, 0.000000],
      [2.397469, 0.000083, 0.000000, 0.000000],
      [2.397469, 0.000079, 0.000000, 0.000000],
      [2.397469, 0.000075, 0.000000, 0.000000],
      [2.397469, 0.000071, 0.000000, 0.000000],
      [2.397469, 0.000068, 0.000000, 0.000000],
      [2.397469, 0.000065, 0.000000, 0.000000],
      [2.397469, 0.000062, 0.000000, 0.000000],
      [2.397469, 0.000059, 0.000000, 0.000000],
      [2.397469, 0.000056, 0.000000, 0.000000],
      [2.397469, 0.000054, 0.000000, 0.000000],
      [2.397469, 0.000051, 0.000000, 0.000000],
      [2.397469, 0.000049, 0.000000, 0.000000],
      [2.397469, 0.000046, 0.000000, 0.000000],
      [2.397469, 0.000044, 0.000000, 0.000000],
      [2.397469, 0.000042, 0.000000, 0.000000],
      [2.397469, 0.000040, 0.000000, 0.000000],
      [2.397469, 0.000038, 0.000000, 0.000000],
      [2.397469, 0.000037, 0.000000, 0.000000],
      [2.397469, 0.000035, 0.000000, 0.000000],
      [2.397469, 0.000033, 0.000000, 0.000000],
      [2.397469, 0.000032, 0.000000, 0.000000],
      [2.397469, 0.000030, 0.000000, 0.000000],
      [2.397469, 0.000029, 0.000000, 0.000000],
      [2.397469, 0.000027, 0.000000, 0.000000],
      [2.397469, 0.000026, 0.000000, 0.000000],
      [2.397469, 0.000025, 0.000000, 0.000000],
      [2.397469, 0.000024, 0.000000, 0.000000],
      [2.397469, 0.000023, 0.000000, 0.000000],
      [2.397469, 0.000022, 0.000000, 0.000000],
      [2.397469, 0.000021, 0.000000, 0.000000],
      [2.397469, 0.000020, 0.000000, 0.000000],
      [2.397469, 0.000019, 0.000000, 0.000000],
      [2.397469, 0.000018, 0.000000, 0.000000],
      [2.397469, 0.000017, 0.000000, 0.000000],
      [2.397469, 0.000016, 0.000000, 0.000000],
      [2.397469, 0.000015, 0.000000, 0.000000],
      [2.397469, 0.000015, 0.000000, 0.000000],
      [2.397469, 0.000014, 0.000000, 0.000000],
      [2.397469, 0.000013, 0.000000, 0.000000],
      [2.397469, 0.000013, 0.000000, 0.000000],
      [2.397469, 0.000012, 0.000000, 0.000000],
      [2.397469, 0.000012, 0.000000, 0.000000],
      [2.397469, 0.000011, 0.000000, 0.000000],
      [2.397469, 0.000011, 0.000000, 0.000000],
      [2.397469, 0.000010, 0.000000, 0.000000],
      [2.397469, 0.000010, 0.000000, 0.000000],
      [2.397469, 0.000009, 0.000000, 0.000000],
      [2.397469, 0.000009, 0.000000, 0.000000],
      [2.397469, 0.000008, 0.000000, 0.000000],
      [2.397469, 0.000008, 0.000000, 0.000000],
      [2.397469, 0.000008, 0.000000, 0.000000],
      [2.397469, 0.000007, 0.000000, 0.000000],
      [2.397469, 0.000007, 0.000000, 0.000000],
      [2.397469, 0.000007, 0.000000, 0.000000],
      [2.397469, 0.000006, 0.000000, 0.000000],
      [2.397469, 0.000006, 0.000000, 0.000000],
      [2.397469, 0.000006, 0.000000, 0.000000],
      [2.397469, 0.000005, 0.000000, 0.000000],
      [2.397469, 0.000005, 0.000000, 0.000000],
      [2.397469, 0.000005, 0.000000, 0.000000],
      [2.397469, 0.000005, 0.000000, 0.000000],
      [2.397469, 0.000004, 0.000000, 0.000000],
      [2.397469, 0.000004, 0.000000, 0.000000],
      [2.397469, 0.000004, 0.000000, 0.000000],
      [2.397469, 0.000004, 0.000000, 0.000000],
      [2.397469, 0.000004, 0.000000, 0.000000],
      [2.397469, 0.000004, 0.000000, 0.000000],
      [2.397469, 0.000003, 0.000000, 0.000000],
      [2.397469, 0.000003, 0.000000, 0.000000],
      [2.397469, 0.000003, 0.000000, 0.000000],
      [2.397469, 0.000003, 0.000000, 0.000000],
      [2.397469, 0.000003, 0.000000, 0.000000],
      [2.397469, 0.000003, 0.000000, 0.000000],
      [2.397469, 0.000003, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000002, 0.000000, 0.000000],
      [2.397469, 0.000001, 0.000000, 0.000000],
      [2.397469, 0.000001, 0.000000, 0.000000],
      [2.397469, 0.000001, 0.000000, 0.000000],
  ];

  /**
   * Rolloff models
   */
  var AttenuationRolloff;
  (function (AttenuationRolloff) {
      AttenuationRolloff["Logarithmic"] = "logarithmic";
      AttenuationRolloff["Linear"] = "linear";
      AttenuationRolloff["None"] = "none";
  })(AttenuationRolloff || (AttenuationRolloff = {}));

  var Dimension;
  (function (Dimension) {
      Dimension["Width"] = "width";
      Dimension["Height"] = "height";
      Dimension["Depth"] = "depth";
  })(Dimension || (Dimension = {}));

  var Direction$1;
  (function (Direction) {
      Direction["Left"] = "left";
      Direction["Right"] = "right";
      Direction["Front"] = "front";
      Direction["Back"] = "back";
      Direction["Down"] = "down";
      Direction["Up"] = "up";
  })(Direction$1 || (Direction$1 = {}));

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Default input gain (linear).
   */
  const DEFAULT_SOURCE_GAIN = 1;
  /**
   * Maximum outside-the-room distance to attenuate far-field listener by.
   */
  const LISTENER_MAX_OUTSIDE_ROOM_DISTANCE = 1;
  /**
   * Maximum outside-the-room distance to attenuate far-field sources by.
   */
  const SOURCE_MAX_OUTSIDE_ROOM_DISTANCE = 1;
  const DEFAULT_POSITION = zero(create$2());
  const DEFAULT_FORWARD = set$2(create$2(), 0, 0, -1);
  const DEFAULT_UP = set$2(create$2(), 0, 1, 0);
  const DEFAULT_RIGHT = set$2(create$2(), 1, 0, 0);
  const DEFAULT_SPEED_OF_SOUND = 343;
  /**
   * Default rolloff model ('logarithmic').
   */
  const DEFAULT_ATTENUATION_ROLLOFF = AttenuationRolloff.Logarithmic;
  /**
   * Default mode for rendering ambisonics.
   */
  const DEFAULT_RENDERING_MODE = 'ambisonic';
  const DEFAULT_MIN_DISTANCE = 1;
  const DEFAULT_MAX_DISTANCE = 1000;
  /**
   * The default alpha (i.e. microphone pattern).
   */
  const DEFAULT_DIRECTIVITY_ALPHA = 0;
  /**
   * The default pattern sharpness (i.e. pattern exponent).
   */
  const DEFAULT_DIRECTIVITY_SHARPNESS = 1;
  /**
   * Default azimuth (in degrees). Suitable range is 0 to 360.
   * @type {Number}
   */
  const DEFAULT_AZIMUTH = 0;
  /**
   * Default elevation (in degres).
   * Suitable range is from -90 (below) to 90 (above).
   */
  const DEFAULT_ELEVATION = 0;
  /**
   * The default ambisonic order.
   */
  const DEFAULT_AMBISONIC_ORDER = 1;
  /**
   * The default source width.
   */
  const DEFAULT_SOURCE_WIDTH = 0;
  /**
   * The maximum delay (in seconds) of a single wall reflection.
   */
  const DEFAULT_REFLECTION_MAX_DURATION = 2;
  /**
   * The -12dB cutoff frequency (in Hertz) for the lowpass filter applied to
   * all reflections.
   */
  const DEFAULT_REFLECTION_CUTOFF_FREQUENCY = 6400; // Uses -12dB cutoff.
  /**
   * The default reflection coefficients (where 0 = no reflection, 1 = perfect
   * reflection, -1 = mirrored reflection (180-degrees out of phase)).
   */
  const DEFAULT_REFLECTION_COEFFICIENTS = {
      [Direction$1.Left]: 0,
      [Direction$1.Right]: 0,
      [Direction$1.Front]: 0,
      [Direction$1.Back]: 0,
      [Direction$1.Down]: 0,
      [Direction$1.Up]: 0,
  };
  /**
   * The minimum distance we consider the listener to be to any given wall.
   */
  const DEFAULT_REFLECTION_MIN_DISTANCE = 1;
  /**
   * Default room dimensions (in meters).
   */
  const DEFAULT_ROOM_DIMENSIONS = {
      [Dimension.Width]: 0,
      [Dimension.Height]: 0,
      [Dimension.Depth]: 0,
  };
  /**
   * The multiplier to apply to distances from the listener to each wall.
   */
  const DEFAULT_REFLECTION_MULTIPLIER = 1;
  /** The default bandwidth (in octaves) of the center frequencies.
   */
  const DEFAULT_REVERB_BANDWIDTH = 1;
  /** The default multiplier applied when computing tail lengths.
   */
  const DEFAULT_REVERB_DURATION_MULTIPLIER = 1;
  /**
   * The late reflections pre-delay (in milliseconds).
   */
  const DEFAULT_REVERB_PREDELAY = 1.5;
  /**
   * The length of the beginning of the impulse response to apply a
   * half-Hann window to.
   */
  const DEFAULT_REVERB_TAIL_ONSET = 3.8;
  /**
   * The default gain (linear).
   */
  const DEFAULT_REVERB_GAIN = 0.01;
  /**
   * The maximum impulse response length (in seconds).
   */
  const DEFAULT_REVERB_MAX_DURATION = 3;
  /**
   * Center frequencies of the multiband late reflections.
   * Nine bands are computed by: 31.25 * 2^(0:8).
   */
  const DEFAULT_REVERB_FREQUENCY_BANDS = [
      31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000,
  ];
  /**
   * The number of frequency bands.
   */
  const NUMBER_REVERB_FREQUENCY_BANDS = DEFAULT_REVERB_FREQUENCY_BANDS.length;
  /**
   * The default multiband RT60 durations (in seconds).
   */
  const DEFAULT_REVERB_DURATIONS = new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);
  var Material;
  (function (Material) {
      Material["Transparent"] = "transparent";
      Material["AcousticCeilingTiles"] = "acoustic-ceiling-tiles";
      Material["BrickBare"] = "brick-bare";
      Material["BrickPainted"] = "brick-painted";
      Material["ConcreteBlockCoarse"] = "concrete-block-coarse";
      Material["ConcreteBlockPainted"] = "concrete-block-painted";
      Material["CurtainHeavy"] = "curtain-heavy";
      Material["FiberGlassInsulation"] = "fiber-glass-insulation";
      Material["GlassThin"] = "glass-thin";
      Material["GlassThick"] = "glass-thick";
      Material["Grass"] = "grass";
      Material["LinoleumOnConcrete"] = "linoleum-on-concrete";
      Material["Marble"] = "marble";
      Material["Metal"] = "metal";
      Material["ParquetOnConcrete"] = "parquet-on-concrete";
      Material["PlasterRough"] = "plaster-rough";
      Material["PlasterSmooth"] = "plaster-smooth";
      Material["PlywoodPanel"] = "plywood-panel";
      Material["PolishedConcreteOrTile"] = "polished-concrete-or-tile";
      Material["Sheetrock"] = "sheetrock";
      Material["WaterOrIceSurface"] = "water-or-ice-surface";
      Material["WoodCeiling"] = "wood-ceiling";
      Material["WoodPanel"] = "wood-panel";
      Material["Uniform"] = "uniform";
  })(Material || (Material = {}));
  /**
   * Pre-defined frequency-dependent absorption coefficients for listed materials.
   * Currently supported materials are:
   * <ul>
   * <li>'transparent'</li>
   * <li>'acoustic-ceiling-tiles'</li>
   * <li>'brick-bare'</li>
   * <li>'brick-painted'</li>
   * <li>'concrete-block-coarse'</li>
   * <li>'concrete-block-painted'</li>
   * <li>'curtain-heavy'</li>
   * <li>'fiber-glass-insulation'</li>
   * <li>'glass-thin'</li>
   * <li>'glass-thick'</li>
   * <li>'grass'</li>
   * <li>'linoleum-on-concrete'</li>
   * <li>'marble'</li>
   * <li>'metal'</li>
   * <li>'parquet-on-concrete'</li>
   * <li>'plaster-smooth'</li>
   * <li>'plywood-panel'</li>
   * <li>'polished-concrete-or-tile'</li>
   * <li>'sheetrock'</li>
   * <li>'water-or-ice-surface'</li>
   * <li>'wood-ceiling'</li>
   * <li>'wood-panel'</li>
   * <li>'uniform'</li>
   * </ul>
   * @type {Object}
   */
  const ROOM_MATERIAL_COEFFICIENTS = {
      [Material.Transparent]: [1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000],
      [Material.AcousticCeilingTiles]: [0.672, 0.675, 0.700, 0.660, 0.720, 0.920, 0.880, 0.750, 1.000],
      [Material.BrickBare]: [0.030, 0.030, 0.030, 0.030, 0.030, 0.040, 0.050, 0.070, 0.140],
      [Material.BrickPainted]: [0.006, 0.007, 0.010, 0.010, 0.020, 0.020, 0.020, 0.030, 0.060],
      [Material.ConcreteBlockCoarse]: [0.360, 0.360, 0.360, 0.440, 0.310, 0.290, 0.390, 0.250, 0.500],
      [Material.ConcreteBlockPainted]: [0.092, 0.090, 0.100, 0.050, 0.060, 0.070, 0.090, 0.080, 0.160],
      [Material.CurtainHeavy]: [0.073, 0.106, 0.140, 0.350, 0.550, 0.720, 0.700, 0.650, 1.000],
      [Material.FiberGlassInsulation]: [0.193, 0.220, 0.220, 0.820, 0.990, 0.990, 0.990, 0.990, 1.000],
      [Material.GlassThin]: [0.180, 0.169, 0.180, 0.060, 0.040, 0.030, 0.020, 0.020, 0.040],
      [Material.GlassThick]: [0.350, 0.350, 0.350, 0.250, 0.180, 0.120, 0.070, 0.040, 0.080],
      [Material.Grass]: [0.050, 0.050, 0.150, 0.250, 0.400, 0.550, 0.600, 0.600, 0.600],
      [Material.LinoleumOnConcrete]: [0.020, 0.020, 0.020, 0.030, 0.030, 0.030, 0.030, 0.020, 0.040],
      [Material.Marble]: [0.010, 0.010, 0.010, 0.010, 0.010, 0.010, 0.020, 0.020, 0.040],
      [Material.Metal]: [0.030, 0.035, 0.040, 0.040, 0.050, 0.050, 0.050, 0.070, 0.090],
      [Material.ParquetOnConcrete]: [0.028, 0.030, 0.040, 0.040, 0.070, 0.060, 0.060, 0.070, 0.140],
      [Material.PlasterRough]: [0.017, 0.018, 0.020, 0.030, 0.040, 0.050, 0.040, 0.030, 0.060],
      [Material.PlasterSmooth]: [0.011, 0.012, 0.013, 0.015, 0.020, 0.030, 0.040, 0.050, 0.100],
      [Material.PlywoodPanel]: [0.400, 0.340, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
      [Material.PolishedConcreteOrTile]: [0.008, 0.008, 0.010, 0.010, 0.015, 0.020, 0.020, 0.020, 0.040],
      [Material.Sheetrock]: [0.290, 0.279, 0.290, 0.100, 0.050, 0.040, 0.070, 0.090, 0.180],
      [Material.WaterOrIceSurface]: [0.006, 0.006, 0.008, 0.008, 0.013, 0.015, 0.020, 0.025, 0.050],
      [Material.WoodCeiling]: [0.150, 0.147, 0.150, 0.110, 0.100, 0.070, 0.060, 0.070, 0.140],
      [Material.WoodPanel]: [0.280, 0.280, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
      [Material.Uniform]: [0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500],
  };
  /**
   * Default materials that use strings from
   * {@linkcode Utils.MATERIAL_COEFFICIENTS MATERIAL_COEFFICIENTS}
   */
  const DEFAULT_ROOM_MATERIALS = {
      [Direction$1.Left]: Material.Transparent,
      [Direction$1.Right]: Material.Transparent,
      [Direction$1.Front]: Material.Transparent,
      [Direction$1.Back]: Material.Transparent,
      [Direction$1.Down]: Material.Transparent,
      [Direction$1.Up]: Material.Transparent,
  };
  /**
   * The number of bands to average over when computing reflection coefficients.
   */
  const NUMBER_REFLECTION_AVERAGING_BANDS = 3;
  /**
   * The starting band to average over when computing reflection coefficients.
   */
  const ROOM_STARTING_AVERAGING_BAND = 4;
  /**
   * The minimum threshold for room volume.
   * Room model is disabled if volume is below this value.
   */
  const ROOM_MIN_VOLUME = 1e-4;
  /**
   * Air absorption coefficients per frequency band.
   */
  const ROOM_AIR_ABSORPTION_COEFFICIENTS = [0.0006, 0.0006, 0.0007, 0.0008, 0.0010, 0.0015, 0.0026, 0.0060, 0.0207];
  /**
   * A scalar correction value to ensure Sabine and Eyring produce the same RT60
   * value at the cross-over threshold.
   */
  const ROOM_EYRING_CORRECTION_COEFFICIENT = 1.38;
  const TWO_PI = 6.28318530717959;
  const TWENTY_FOUR_LOG10 = 55.2620422318571;
  const LOG1000 = 6.90775527898214;
  const LOG2_DIV2 = 0.346573590279973;
  const RADIANS_TO_DEGREES = 57.295779513082323;
  const EPSILON_FLOAT = 1e-8;
  /**
   * ResonanceAudio library logging function.
   */
  const log = function (...args) {
      window.console.log.apply(window.console, [
          '%c[ResonanceAudio]%c '
              + args.join(' ') + ' %c(@'
              + performance.now().toFixed(2) + 'ms)',
          'background: #BBDEFB; color: #FF5722; font-weight: 700',
          'font-weight: 400',
          'color: #AAA',
      ]);
  };
  const DirectionToDimension = {
      [Direction$1.Left]: Dimension.Width,
      [Direction$1.Right]: Dimension.Width,
      [Direction$1.Front]: Dimension.Depth,
      [Direction$1.Back]: Dimension.Depth,
      [Direction$1.Up]: Dimension.Height,
      [Direction$1.Down]: Dimension.Height
  };
  const DirectionToAxis = {
      [Direction$1.Left]: 0,
      [Direction$1.Right]: 0,
      [Direction$1.Front]: 2,
      [Direction$1.Back]: 2,
      [Direction$1.Up]: 1,
      [Direction$1.Down]: 1
  };
  const DirectionSign = {
      [Direction$1.Left]: 1,
      [Direction$1.Right]: -1,
      [Direction$1.Front]: 1,
      [Direction$1.Back]: -1,
      [Direction$1.Up]: -1,
      [Direction$1.Down]: 1
  };

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Spatially encodes input using weighted spherical harmonics.
   */
  class Encoder {
      /**
       * Spatially encodes input using weighted spherical harmonics.
       */
      constructor(context, options) {
          this.channelGain = new Array();
          this.merger = null;
          // Use defaults for undefined arguments.
          options = Object.assign({
              ambisonicOrder: DEFAULT_AMBISONIC_ORDER,
              azimuth: DEFAULT_AZIMUTH,
              elevation: DEFAULT_ELEVATION,
              sourceWidth: DEFAULT_SOURCE_WIDTH
          }, options);
          this.context = context;
          // Create I/O nodes.
          this.input = context.createGain();
          this.output = context.createGain();
          // Set initial order, angle and source width.
          this.setAmbisonicOrder(options.ambisonicOrder);
          this.azimuth = options.azimuth;
          this.elevation = options.elevation;
          this.setSourceWidth(options.sourceWidth);
      }
      /**
       * Validate the provided ambisonic order.
       * @param ambisonicOrder Desired ambisonic order.
       * @return Validated/adjusted ambisonic order.
       */
      static validateAmbisonicOrder(ambisonicOrder) {
          if (isNaN(ambisonicOrder) || ambisonicOrder == null) {
              log('Error: Invalid ambisonic order', ambisonicOrder, '\nUsing ambisonicOrder=1 instead.');
              ambisonicOrder = 1;
          }
          else if (ambisonicOrder < 1) {
              log('Error: Unable to render ambisonic order', ambisonicOrder, '(Min order is 1)', '\nUsing min order instead.');
              ambisonicOrder = 1;
          }
          else if (ambisonicOrder > SPHERICAL_HARMONICS_MAX_ORDER) {
              log('Error: Unable to render ambisonic order', ambisonicOrder, '(Max order is', SPHERICAL_HARMONICS_MAX_ORDER, ')\nUsing max order instead.');
              ambisonicOrder = SPHERICAL_HARMONICS_MAX_ORDER;
          }
          return ambisonicOrder;
      }
      /**
       * Set the desired ambisonic order.
       * @param ambisonicOrder Desired ambisonic order.
       */
      setAmbisonicOrder(ambisonicOrder) {
          this.ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);
          this.input.disconnect();
          for (let i = 0; i < this.channelGain.length; i++) {
              this.channelGain[i].disconnect();
          }
          if (this.merger != null) {
              this.merger.disconnect();
          }
          // Create audio graph.
          let numChannels = (this.ambisonicOrder + 1) * (this.ambisonicOrder + 1);
          this.merger = this.context.createChannelMerger(numChannels);
          this.channelGain = new Array(numChannels);
          for (let i = 0; i < numChannels; i++) {
              this.channelGain[i] = this.context.createGain();
              this.input.connect(this.channelGain[i]);
              this.channelGain[i].connect(this.merger, 0, i);
          }
          this.merger.connect(this.output);
      }
      dispose() {
          this.merger.disconnect(this.output);
          let numChannels = (this.ambisonicOrder + 1) * (this.ambisonicOrder + 1);
          for (let i = 0; i < numChannels; ++i) {
              this.channelGain[i].disconnect(this.merger, 0, i);
              this.input.disconnect(this.channelGain[i]);
          }
      }
      /**
       * Set the direction of the encoded source signal.
       * @param azimuth
       * Azimuth (in degrees). Defaults to
       * {@linkcode DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
       * @param elevation
       * Elevation (in degrees). Defaults to
       * {@linkcode DEFAULT_ELEVATION DEFAULT_ELEVATION}.
       */
      setDirection(azimuth, elevation) {
          // Format input direction to nearest indices.
          if (azimuth == undefined || isNaN(azimuth)) {
              azimuth = DEFAULT_AZIMUTH;
          }
          if (elevation == undefined || isNaN(elevation)) {
              elevation = DEFAULT_ELEVATION;
          }
          // Store the formatted input (for updating source width).
          this.azimuth = azimuth;
          this.elevation = elevation;
          // Format direction for index lookups.
          azimuth = Math.round(azimuth % 360);
          if (azimuth < 0) {
              azimuth += 360;
          }
          elevation = Math.round(Math.min(90, Math.max(-90, elevation))) + 90;
          // Assign gains to each output.
          this.channelGain[0].gain.value = MAX_RE_WEIGHTS[this.spreadIndex][0];
          for (let i = 1; i <= this.ambisonicOrder; i++) {
              let degreeWeight = MAX_RE_WEIGHTS[this.spreadIndex][i];
              for (let j = -i; j <= i; j++) {
                  const acnChannel = (i * i) + i + j;
                  const elevationIndex = i * (i + 1) / 2 + Math.abs(j) - 1;
                  let val = SPHERICAL_HARMONICS[1][elevation][elevationIndex];
                  if (j != 0) {
                      let azimuthIndex = SPHERICAL_HARMONICS_MAX_ORDER + j - 1;
                      if (j < 0) {
                          azimuthIndex = SPHERICAL_HARMONICS_MAX_ORDER + j;
                      }
                      val *= SPHERICAL_HARMONICS[0][azimuth][azimuthIndex];
                  }
                  this.channelGain[acnChannel].gain.value = val * degreeWeight;
              }
          }
      }
      /**
       * Set the source width (in degrees). Where 0 degrees is a point source and 360
       * degrees is an omnidirectional source.
       * @param sourceWidth (in degrees).
       */
      setSourceWidth(sourceWidth) {
          // The MAX_RE_WEIGHTS is a 360 x (SPHERICAL_HARMONICS_MAX_ORDER+1)
          // size table.
          this.spreadIndex = Math.min(359, Math.max(0, Math.round(sourceWidth)));
          this.setDirection(this.azimuth, this.elevation);
      }
  }

  /**
   * @license
   * Copyright 2016 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * @file Omnitone library common utilities.
   */
  /**
   * Omnitone library logging function.
   * @param Message to be printed out.
   */
  function log$1(...rest) {
      const message = `[Omnitone] ${rest.join(' ')}`;
      window.console.log(message);
  }
  /**
   * Converts Base64-encoded string to ArrayBuffer.
   * @param base64String - Base64-encdoed string.
   * @return Converted ArrayBuffer object.
   */
  function getArrayBufferFromBase64String(base64String) {
      const binaryString = window.atob(base64String);
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < byteArray.length; ++i) {
          byteArray[i] = binaryString.charCodeAt(i);
      }
      return byteArray.buffer;
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * @file Streamlined AudioBuffer loader.
   */
  /**
   * Buffer data type for ENUM.
   */
  var BufferDataType;
  (function (BufferDataType) {
      /** The data contains Base64-encoded string.. */
      BufferDataType["BASE64"] = "base64";
      /** The data is a URL for audio file. */
      BufferDataType["URL"] = "url";
  })(BufferDataType || (BufferDataType = {}));
  /**
   * BufferList object mananges the async loading/decoding of multiple
   * AudioBuffers from multiple URLs.
   */
  class BufferList {
      /**
       * BufferList object mananges the async loading/decoding of multiple
       * AudioBuffers from multiple URLs.
       * @param context - Associated BaseAudioContext.
       * @param bufferData - An ordered list of URLs.
       * @param options - Options.
       */
      constructor(context, bufferData, options) {
          this._context = context;
          this._options = Object.assign({}, {
              dataType: BufferDataType.BASE64,
              verbose: false,
          }, options);
          this._bufferData = this._options.dataType === BufferDataType.BASE64
              ? bufferData
              : bufferData.slice(0);
      }
      /**
       * Starts AudioBuffer loading tasks.
       */
      async load() {
          try {
              const tasks = this._bufferData.map(async (bData) => {
                  try {
                      return await this._launchAsyncLoadTask(bData);
                  }
                  catch (exp) {
                      const message = 'BufferList: error while loading "' +
                          bData + '". (' + exp.message + ')';
                      throw new Error(message);
                  }
              });
              const buffers = await Promise.all(tasks);
              return buffers;
          }
          catch (exp) {
              const message = 'BufferList: error while loading ". (' + exp.message + ')';
              throw new Error(message);
          }
      }
      /**
       * Run async loading task for Base64-encoded string.
       * @param bData - Base64-encoded data.
       */
      async _launchAsyncLoadTask(bData) {
          const arrayBuffer = await this._fetch(bData);
          const audioBuffer = await this._context.decodeAudioData(arrayBuffer);
          return audioBuffer;
      }
      /**
       * Get an array buffer out of the given data.
       * @param bData - Base64-encoded data.
       */
      async _fetch(bData) {
          if (this._options.dataType === BufferDataType.BASE64) {
              return getArrayBufferFromBase64String(bData);
          }
          else {
              const response = await fetch(bData);
              return await response.arrayBuffer();
          }
      }
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * @file A collection of convolvers. Can be used for the optimized FOA binaural
   * rendering. (e.g. SH-MaxRe HRTFs)
   */
  /**
   * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
   */
  class FOAConvolver {
      /**
       * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
       * @param context The associated AudioContext.
       * @param hrirBufferList - An ordered-list of stereo AudioBuffers for convolution. (i.e. 2 stereo AudioBuffers for FOA)
       */
      constructor(context, hrirBufferList) {
          this._context = context;
          this._active = false;
          this._isBufferLoaded = false;
          this._buildAudioGraph();
          if (hrirBufferList) {
              this.setHRIRBufferList(hrirBufferList);
          }
          this.enable();
      }
      /**
       * Build the internal audio graph.
       */
      _buildAudioGraph() {
          this._splitterWYZX = this._context.createChannelSplitter(4);
          this._mergerWY = this._context.createChannelMerger(2);
          this._mergerZX = this._context.createChannelMerger(2);
          this._convolverWY = this._context.createConvolver();
          this._convolverZX = this._context.createConvolver();
          this._splitterWY = this._context.createChannelSplitter(2);
          this._splitterZX = this._context.createChannelSplitter(2);
          this._inverter = this._context.createGain();
          this._mergerBinaural = this._context.createChannelMerger(2);
          this._summingBus = this._context.createGain();
          // Group W and Y, then Z and X.
          this._splitterWYZX.connect(this._mergerWY, 0, 0);
          this._splitterWYZX.connect(this._mergerWY, 1, 1);
          this._splitterWYZX.connect(this._mergerZX, 2, 0);
          this._splitterWYZX.connect(this._mergerZX, 3, 1);
          // Create a network of convolvers using splitter/merger.
          this._mergerWY.connect(this._convolverWY);
          this._mergerZX.connect(this._convolverZX);
          this._convolverWY.connect(this._splitterWY);
          this._convolverZX.connect(this._splitterZX);
          this._splitterWY.connect(this._mergerBinaural, 0, 0);
          this._splitterWY.connect(this._mergerBinaural, 0, 1);
          this._splitterWY.connect(this._mergerBinaural, 1, 0);
          this._splitterWY.connect(this._inverter, 1, 0);
          this._inverter.connect(this._mergerBinaural, 0, 1);
          this._splitterZX.connect(this._mergerBinaural, 0, 0);
          this._splitterZX.connect(this._mergerBinaural, 0, 1);
          this._splitterZX.connect(this._mergerBinaural, 1, 0);
          this._splitterZX.connect(this._mergerBinaural, 1, 1);
          // By default, WebAudio's convolver does the normalization based on IR's
          // energy. For the precise convolution, it must be disabled before the buffer
          // assignment.
          this._convolverWY.normalize = false;
          this._convolverZX.normalize = false;
          // For asymmetric degree.
          this._inverter.gain.value = -1;
          // Input/output proxy.
          this.input = this._splitterWYZX;
          this.output = this._summingBus;
      }
      dispose() {
          if (this._active) {
              this.disable();
          }
          // Group W and Y, then Z and X.
          this._splitterWYZX.disconnect(this._mergerWY, 0, 0);
          this._splitterWYZX.disconnect(this._mergerWY, 1, 1);
          this._splitterWYZX.disconnect(this._mergerZX, 2, 0);
          this._splitterWYZX.disconnect(this._mergerZX, 3, 1);
          // Create a network of convolvers using splitter/merger.
          this._mergerWY.disconnect(this._convolverWY);
          this._mergerZX.disconnect(this._convolverZX);
          this._convolverWY.disconnect(this._splitterWY);
          this._convolverZX.disconnect(this._splitterZX);
          this._splitterWY.disconnect(this._mergerBinaural, 0, 0);
          this._splitterWY.disconnect(this._mergerBinaural, 0, 1);
          this._splitterWY.disconnect(this._mergerBinaural, 1, 0);
          this._splitterWY.disconnect(this._inverter, 1, 0);
          this._inverter.disconnect(this._mergerBinaural, 0, 1);
          this._splitterZX.disconnect(this._mergerBinaural, 0, 0);
          this._splitterZX.disconnect(this._mergerBinaural, 0, 1);
          this._splitterZX.disconnect(this._mergerBinaural, 1, 0);
          this._splitterZX.disconnect(this._mergerBinaural, 1, 1);
      }
      /**
       * Assigns 2 HRIR AudioBuffers to 2 convolvers: Note that we use 2 stereo
       * convolutions for 4-channel direct convolution. Using mono convolver or
       * 4-channel convolver is not viable because mono convolution wastefully
       * produces the stereo outputs, and the 4-ch convolver does cross-channel
       * convolution. (See Web Audio API spec)
       * @param hrirBufferList - An array of stereo AudioBuffers for
       * convolvers.
       */
      setHRIRBufferList(hrirBufferList) {
          // After these assignments, the channel data in the buffer is immutable in
          // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
          // an exception will be thrown.
          if (this._isBufferLoaded) {
              return;
          }
          this._convolverWY.buffer = hrirBufferList[0];
          this._convolverZX.buffer = hrirBufferList[1];
          this._isBufferLoaded = true;
      }
      /**
       * Enable FOAConvolver instance. The audio graph will be activated and pulled by
       * the WebAudio engine. (i.e. consume CPU cycle)
       */
      enable() {
          this._mergerBinaural.connect(this._summingBus);
          this._active = true;
      }
      /**
       * Disable FOAConvolver instance. The inner graph will be disconnected from the
       * audio destination, thus no CPU cycle will be consumed.
       */
      disable() {
          this._mergerBinaural.disconnect();
          this._active = false;
      }
  }

  /**
   * @license
   * Copyright 2016 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * @file Sound field rotator for first-order-ambisonics decoding.
   */
  /**
   * First-order-ambisonic decoder based on gain node network.
   */
  class FOARotator {
      /**
       * First-order-ambisonic decoder based on gain node network.
       * @param context - Associated AudioContext.
       */
      constructor(context) {
          this._context = context;
          this._splitter = this._context.createChannelSplitter(4);
          this._inX = this._context.createGain();
          this._inY = this._context.createGain();
          this._inZ = this._context.createGain();
          this._m0 = this._context.createGain();
          this._m1 = this._context.createGain();
          this._m2 = this._context.createGain();
          this._m3 = this._context.createGain();
          this._m4 = this._context.createGain();
          this._m5 = this._context.createGain();
          this._m6 = this._context.createGain();
          this._m7 = this._context.createGain();
          this._m8 = this._context.createGain();
          this._outX = this._context.createGain();
          this._outY = this._context.createGain();
          this._outZ = this._context.createGain();
          this._merger = this._context.createChannelMerger(4);
          // ACN channel ordering: [1, 2, 3] => [X, Y, Z]
          // X (from channel 1)
          this._splitter.connect(this._inX, 1);
          // Y (from channel 2)
          this._splitter.connect(this._inY, 2);
          // Z (from channel 3)
          this._splitter.connect(this._inZ, 3);
          this._inX.gain.value = -1;
          this._inY.gain.value = -1;
          this._inZ.gain.value = -1;
          // Apply the rotation in the world space.
          // |X|   | m0  m3  m6 |   | X * m0 + Y * m3 + Z * m6 |   | Xr |
          // |Y| * | m1  m4  m7 | = | X * m1 + Y * m4 + Z * m7 | = | Yr |
          // |Z|   | m2  m5  m8 |   | X * m2 + Y * m5 + Z * m8 |   | Zr |
          this._inX.connect(this._m0);
          this._inX.connect(this._m1);
          this._inX.connect(this._m2);
          this._inY.connect(this._m3);
          this._inY.connect(this._m4);
          this._inY.connect(this._m5);
          this._inZ.connect(this._m6);
          this._inZ.connect(this._m7);
          this._inZ.connect(this._m8);
          this._m0.connect(this._outX);
          this._m1.connect(this._outY);
          this._m2.connect(this._outZ);
          this._m3.connect(this._outX);
          this._m4.connect(this._outY);
          this._m5.connect(this._outZ);
          this._m6.connect(this._outX);
          this._m7.connect(this._outY);
          this._m8.connect(this._outZ);
          // Transform 3: world space to audio space.
          // W -> W (to channel 0)
          this._splitter.connect(this._merger, 0, 0);
          // X (to channel 1)
          this._outX.connect(this._merger, 0, 1);
          // Y (to channel 2)
          this._outY.connect(this._merger, 0, 2);
          // Z (to channel 3)
          this._outZ.connect(this._merger, 0, 3);
          this._outX.gain.value = -1;
          this._outY.gain.value = -1;
          this._outZ.gain.value = -1;
          this.setRotationMatrix3(identity(create()));
          // input/output proxy.
          this.input = this._splitter;
          this.output = this._merger;
      }
      dispose() {
          // ACN channel ordering: [1, 2, 3] => [X, Y, Z]
          // X (from channel 1)
          this._splitter.disconnect(this._inX, 1);
          // Y (from channel 2)
          this._splitter.disconnect(this._inY, 2);
          // Z (from channel 3)
          this._splitter.disconnect(this._inZ, 3);
          // Apply the rotation in the world space.
          // |X|   | m0  m3  m6 |   | X * m0 + Y * m3 + Z * m6 |   | Xr |
          // |Y| * | m1  m4  m7 | = | X * m1 + Y * m4 + Z * m7 | = | Yr |
          // |Z|   | m2  m5  m8 |   | X * m2 + Y * m5 + Z * m8 |   | Zr |
          this._inX.disconnect(this._m0);
          this._inX.disconnect(this._m1);
          this._inX.disconnect(this._m2);
          this._inY.disconnect(this._m3);
          this._inY.disconnect(this._m4);
          this._inY.disconnect(this._m5);
          this._inZ.disconnect(this._m6);
          this._inZ.disconnect(this._m7);
          this._inZ.disconnect(this._m8);
          this._m0.disconnect(this._outX);
          this._m1.disconnect(this._outY);
          this._m2.disconnect(this._outZ);
          this._m3.disconnect(this._outX);
          this._m4.disconnect(this._outY);
          this._m5.disconnect(this._outZ);
          this._m6.disconnect(this._outX);
          this._m7.disconnect(this._outY);
          this._m8.disconnect(this._outZ);
          // Transform 3: world space to audio space.
          // W -> W (to channel 0)
          this._splitter.disconnect(this._merger, 0, 0);
          // X (to channel 1)
          this._outX.disconnect(this._merger, 0, 1);
          // Y (to channel 2)
          this._outY.disconnect(this._merger, 0, 2);
          // Z (to channel 3)
          this._outZ.disconnect(this._merger, 0, 3);
      }
      /**
       * Updates the rotation matrix with 3x3 matrix.
       * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
       */
      setRotationMatrix3(rotationMatrix3) {
          this._m0.gain.value = rotationMatrix3[0];
          this._m1.gain.value = rotationMatrix3[1];
          this._m2.gain.value = rotationMatrix3[2];
          this._m3.gain.value = rotationMatrix3[3];
          this._m4.gain.value = rotationMatrix3[4];
          this._m5.gain.value = rotationMatrix3[5];
          this._m6.gain.value = rotationMatrix3[6];
          this._m7.gain.value = rotationMatrix3[7];
          this._m8.gain.value = rotationMatrix3[8];
      }
      /**
       * Updates the rotation matrix with 4x4 matrix.
       * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
       */
      setRotationMatrix4(rotationMatrix4) {
          this._m0.gain.value = rotationMatrix4[0];
          this._m1.gain.value = rotationMatrix4[1];
          this._m2.gain.value = rotationMatrix4[2];
          this._m3.gain.value = rotationMatrix4[4];
          this._m4.gain.value = rotationMatrix4[5];
          this._m5.gain.value = rotationMatrix4[6];
          this._m6.gain.value = rotationMatrix4[8];
          this._m7.gain.value = rotationMatrix4[9];
          this._m8.gain.value = rotationMatrix4[10];
      }
      /**
       * Returns the current 3x3 rotation matrix.
       * @return A 3x3 rotation matrix. (column-major)
       */
      getRotationMatrix3() {
          set(rotationMatrix3, this._m0.gain.value, this._m1.gain.value, this._m2.gain.value, this._m3.gain.value, this._m4.gain.value, this._m5.gain.value, this._m6.gain.value, this._m7.gain.value, this._m8.gain.value);
          return rotationMatrix3;
      }
      /**
       * Returns the current 4x4 rotation matrix.
       * @return A 4x4 rotation matrix. (column-major)
       */
      getRotationMatrix4() {
          set$1(rotationMatrix4, this._m0.gain.value, this._m1.gain.value, this._m2.gain.value, 0, this._m3.gain.value, this._m4.gain.value, this._m5.gain.value, 0, this._m6.gain.value, this._m7.gain.value, this._m8.gain.value, 0, 0, 0, 0, 1);
          return rotationMatrix4;
      }
  }
  const rotationMatrix3 = create();
  const rotationMatrix4 = create$1();

  /**
   * @license
   * Copyright 2016 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * @file An audio channel router to resolve different channel layouts between
   * browsers.
   */
  var ChannelMap;
  (function (ChannelMap) {
      ChannelMap[ChannelMap["Default"] = 0] = "Default";
      ChannelMap[ChannelMap["Safari"] = 1] = "Safari";
      ChannelMap[ChannelMap["FUMA"] = 2] = "FUMA";
  })(ChannelMap || (ChannelMap = {}));
  /**
   * Channel map dictionary ENUM.
   */
  const ChannelMaps = {
      /** ACN channel map for Chrome and FireFox. (FFMPEG) */
      [ChannelMap.Default]: [0, 1, 2, 3],
      /** Safari's 4-channel map for AAC codec. */
      [ChannelMap.Safari]: [2, 0, 1, 3],
      /** ACN > FuMa conversion map. */
      [ChannelMap.FUMA]: [0, 3, 1, 2]
  };
  /**
   * Channel router for FOA stream.
   */
  class FOARouter {
      /**
       * Channel router for FOA stream.
       * @param context - Associated AudioContext.
       * @param channelMap - Routing destination array.
       */
      constructor(context, channelMap) {
          this._context = context;
          this._splitter = this._context.createChannelSplitter(4);
          this._merger = this._context.createChannelMerger(4);
          // input/output proxy.
          this.input = this._splitter;
          this.output = this._merger;
          this.setChannelMap(channelMap || ChannelMap.Default);
      }
      /**
       * Sets channel map.
       * @param channelMap - A new channel map for FOA stream.
       */
      setChannelMap(channelMap) {
          if (channelMap instanceof Array) {
              this._channelMap = channelMap;
          }
          else {
              this._channelMap = ChannelMaps[channelMap];
          }
          this._splitter.disconnect();
          this._splitter.connect(this._merger, 0, this._channelMap[0]);
          this._splitter.connect(this._merger, 1, this._channelMap[1]);
          this._splitter.connect(this._merger, 2, this._channelMap[2]);
          this._splitter.connect(this._merger, 3, this._channelMap[3]);
      }
      dispose() {
          this._splitter.disconnect(this._merger, 0, this._channelMap[0]);
          this._splitter.disconnect(this._merger, 1, this._channelMap[1]);
          this._splitter.disconnect(this._merger, 2, this._channelMap[2]);
          this._splitter.disconnect(this._merger, 3, this._channelMap[3]);
      }
  }

  var FOAHrirBase64 = [
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wIA9v8QAPv/CwD+/wcA/v8MAP//AQD7/wEACAAEAPj/+v8YABAA7v/n//v/9P/M/8D//f34/R38EvzxAfEBtA2lDTcBJQFJ9T71FP0D/cD1tfVo/Wv9uPTO9PPmOufc/U/+agL3Aisc/RxuGKEZBv3j/iYMzQ2gAzsEQQUABiQFrASzA5cB2QmyCy0AtgR4AeYGtfgAA2j5OQHP+scArPsMBJgEggIEBtz6+QVq/pj/aPg8BPP3gQEi+jEAof0fA1v9+/7S+8IBjvwd/xD4IADL/Pf9zvs+/l3+wgB7/+L+7fzFADH9kf6A+n3+DP6+/TP9xP68/pn+w/26/i39YgA0/u790Pt9/kD+7v1s/Wb+8f4C/1P+pf/x/cT+6/3p/Xz9ff5F/0f9G/4r/6v/4P5L/sL+ff7c/pj+Ov7X/UT+9P5G/oz+6v6A/2D+9/6P/8r/bP7m/ij+C//e/tj/Gf4e/9v+FwDP/lz/sP7F/2H+rv/G/s7/Hf7y/4P+NAD9/k0AK/6w/zP/hACh/sX/gf44AOP+dgCm/iUAk/5qAOD+PwC+/jEAWP4CAAr/bQBw/vv/zf5iACD/OgCS/uD/Cv9oAAb/CgDK/kwA//5tACH/TgCg/h4AHP9aABP/JADP/hEAYv9gAAj/3f8m/ysAYv8gACX/8/8k/ysAXv8bABH//v8j/ygAa/8qAAD/9f9g/1YAWf8JACH/AgB2/z4AXP/w/z3/FgB2/ykAX//9/z//EwCV/zUAS//n/1T/GACK/x4ATv/0/4P/QQB4//v/WP/2/3X/HAB8//P/V//3/2f/AQBh/9v/Tf/x/5P/IwCI/wMAf/8hAKP/JACZ/xUAiv8nAK//HgCr/yMAm/8uAMz/OACi/yQAqf87AMT/MwCY/yUAtP9FAMH/KgCu/ycAyP85AMv/IwCz/xoA1f8qAMn/FgC8/xQA4/8nAMX/CwDJ/xQA4f8ZAMH/BgDO/xQA4f8WAMP/BwDU/xQA4P8QAMH/AQDb/xQA3P8JAMP/AgDh/xIA2v8EAMj/AgDk/w0A1f/+/8v/AwDm/wwA0v/+/9H/BgDl/wkAzv/8/9T/BwDk/wcAzv/8/9r/CQDi/wQAzf/8/9//CADf////0P/9/+L/BwDd//7/0////+T/BgDb//z/1f8AAOf/BQDZ//v/2v8CAOb/AwDY//v/3v8EAOb/AgDY//3/4f8FAOX/AQDZ//7/5P8GAOP/AADb/wAA5/8GAOH////d/wIA5/8FAOD////f/wMA6P8FAOD////h/wQA6P8EAN7////h/wUA4v8DANv/AQDd/wQA3P8CANn/AgDb/wMA2/8CANv/AgDd/wIA3v8CAOH/AQDj/wEA",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAA/f8CAP//AQD//wEA//8BAP3/AAACAP7/+f8AAAIA/P8FAAQA8/8AABoA+f/V/wQAHQDO/xoAQQBO/ocA0Px1/ucHW/4UCm8HLO6kAjv8/fCRDdAAYfPiBIgFXveUCM0GBvh6/nz7rf0J/QcQSRVdBgoBSgFR62r9NP8m+LoEAvriBVAAiAPmABEGMf2l+SwBjva6/G4A//8P/CYDMgXm/R0CKAE6/fcBBwAtAND+kQA0A5UDhwFs/8IB8fydAEP/A/8v/e7/mP8j/2YBIwE3Av0AYv+uAOD8lgAg/wwAIf/L/n0Ae//OAJMB3P/XAF//XwCM/08AB/8NAEf/rf4jAT3/lgAJAP4AHgDpAO8AUf9L/07/Qf8KAOD/x/+D/3sATQCDAMoA0f79/+L/EQDt/7EAqv+S/7IAuv/o/wgAc//X//H/SwCm/+3/Yf/B/yoAAADI/7X/AwBg/5EATgCX/xYA/P+q/00AVACY/6v/BADD/zwALQCN/8z/KQDu/ygAEgCZ/6f/VQDC//T/KQCs/7P/UgAfAO7/NgC8/57/awAZAPP/+P/V/8z/bQBBAL//DgD0/+T/TABBAMz/CwAxAPz/SQBqALn/BgALAPz/EAA7AIz/3/8iAAUA//8kALf/y/9VABQA+v81AOj/0P9cAB4A+f8WAOr/vv83ABgAw/8JAOj/4f8nACIAsf/y/w4A3v8gACQAxP/n/ycA7P8WAC0Ayf/U/ycA9v/7/yUA0P/P/zUABADc/xUA5P/J/zcACwDS/xUA9P/m/zAACQDX/+3/9v/2/yQACgDZ/+P/AwAKABYA///b/9j/EQALABkADgD6/+7/GwD4/w4A8P/w//j/EgAEAAUA9f/1/wQAGgD4/wAA5////wAAGQD1////7f8FAAUAFQDv/wAA6v8LAAcAFQDs/wEA9P8SAAYACwDr//7/AQASAAYABQDv/wIAAwAWAAIAAgDv/wAABgATAAEA/f/u/wQABgAQAPr/+P/z/wUACQALAPj/9//4/wgABwAKAPT/+f/5/w4ABwAIAPT/+//9/w4AAwADAPH//f///w8A//8BAPP///8BAA0A/f/+//X/AgACAA0A+//8//b/BAADAAoA+f/7//n/BgADAAcA+P/7//v/BwABAAQA+P/8//3/CQABAAIA9//9////CQD/////+P///wAACAD9//7/+f8AAAAABwD8//3/+v8CAAAABgD7//z//P8EAAAABAD6//3//P8FAP//AgD6//7//v8FAP7/AQD7//////8GAP7/AAD7/wEA//8EAP3/AAD9/wEA/v8DAP3/AAD9/wIA/v8CAP3/AQD9/wIA/v8CAP7/AQD+/wEA",
  ];

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Omnitone FOA renderer class. Uses the optimized convolution technique.
   */
  class FOARenderer {
      /**
       * Omnitone FOA renderer class. Uses the optimized convolution technique.
       */
      constructor(context, options) {
          this.context = context;
          this.config = Object.assign({
              channelMap: ChannelMap.Default,
              renderingMode: RenderingMode.Ambisonic,
          }, options);
          if (this.config.channelMap instanceof Array
              && this.config.channelMap.length !== 4) {
              throw new Error('FOARenderer: Invalid channel map. (got ' + this.config.channelMap
                  + ')');
          }
          if (this.config.hrirPathList && this.config.hrirPathList.length !== 2) {
              throw new Error('FOARenderer: Invalid HRIR URLs. It must be an array with ' +
                  '2 URLs to HRIR files. (got ' + this.config.hrirPathList + ')');
          }
          this.buildAudioGraph();
      }
      /**
       * Builds the internal audio graph.
       */
      buildAudioGraph() {
          this.input = this.context.createGain();
          this.output = this.context.createGain();
          this.bypass = this.context.createGain();
          this.router = new FOARouter(this.context, this.config.channelMap);
          this.rotator = new FOARotator(this.context);
          this.convolver = new FOAConvolver(this.context);
          this.input.connect(this.router.input);
          this.input.connect(this.bypass);
          this.router.output.connect(this.rotator.input);
          this.rotator.output.connect(this.convolver.input);
          this.convolver.output.connect(this.output);
          this.input.channelCount = 4;
          this.input.channelCountMode = 'explicit';
          this.input.channelInterpretation = 'discrete';
      }
      dispose() {
          if (this.getRenderingMode() === RenderingMode.Bypass) {
              this.bypass.connect(this.output);
          }
          this.input.disconnect(this.router.input);
          this.input.disconnect(this.bypass);
          this.router.output.disconnect(this.rotator.input);
          this.rotator.output.disconnect(this.convolver.input);
          this.convolver.output.disconnect(this.output);
          this.convolver.dispose();
          this.rotator.dispose();
          this.router.dispose();
      }
      /**
       * Initializes and loads the resource for the renderer.
       */
      async initialize() {
          const bufferList = this.config.hrirPathList
              ? new BufferList(this.context, this.config.hrirPathList, { dataType: BufferDataType.URL })
              : new BufferList(this.context, FOAHrirBase64, { dataType: BufferDataType.BASE64 });
          try {
              const hrirBufferList = await bufferList.load();
              this.convolver.setHRIRBufferList(hrirBufferList);
              this.setRenderingMode(this.config.renderingMode);
          }
          catch (exp) {
              const errorMessage = `FOARenderer: HRIR loading/decoding (mode: ${this.config.renderingMode}) failed. Reason: ${exp.message}`;
              throw new Error(errorMessage);
          }
      }
      /**
       * Set the channel map.
       * @param channelMap - Custom channel routing for FOA stream.
       */
      setChannelMap(channelMap) {
          if (channelMap.toString() !== this.config.channelMap.toString()) {
              log$1('Remapping channels ([' + this.config.channelMap.toString() +
                  '] -> [' + channelMap.toString() + ']).');
              if (channelMap instanceof Array) {
                  this.config.channelMap = channelMap.slice();
              }
              else {
                  this.config.channelMap = channelMap;
              }
              this.router.setChannelMap(this.config.channelMap);
          }
      }
      /**
       * Updates the rotation matrix with 3x3 matrix.
       * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
       */
      setRotationMatrix3(rotationMatrix3) {
          this.rotator.setRotationMatrix3(rotationMatrix3);
      }
      /**
       * Updates the rotation matrix with 4x4 matrix.
       * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
       */
      setRotationMatrix4(rotationMatrix4) {
          this.rotator.setRotationMatrix4(rotationMatrix4);
      }
      getRenderingMode() {
          return this.config.renderingMode;
      }
      /**
       * Set the rendering mode.
       * @param mode - Rendering mode.
       *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
       *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
       *    decoding or encoding.
       *  - 'off': all the processing off saving the CPU power.
       */
      setRenderingMode(mode) {
          if (mode === this.config.renderingMode) {
              return;
          }
          switch (mode) {
              case RenderingMode.Ambisonic:
                  this.convolver.enable();
                  this.bypass.disconnect();
                  break;
              case RenderingMode.Bypass:
                  this.convolver.disable();
                  this.bypass.connect(this.output);
                  break;
              case RenderingMode.None:
                  this.convolver.disable();
                  this.bypass.disconnect();
                  break;
              default:
                  log$1('FOARenderer: Rendering mode "' + mode + '" is not ' +
                      'supported.');
                  return;
          }
          this.config.renderingMode = mode;
      }
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * @file A collection of convolvers. Can be used for the optimized HOA binaural
   * rendering. (e.g. SH-MaxRe HRTFs)
   */
  /**
   * A convolver network for N-channel HOA stream.
   */
  class HOAConvolver {
      /**
       * A convolver network for N-channel HOA stream.
        * @param context - Associated AudioContext.
       * @param ambisonicOrder - Ambisonic order. (2 or 3)
       * @param [hrirBufferList] - An ordered-list of stereo
       * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
       */
      constructor(context, ambisonicOrder, hrirBufferList) {
          this._active = false;
          this._isBufferLoaded = false;
          this._context = context;
          // The number of channels K based on the ambisonic order N where K = (N+1)^2.
          this._ambisonicOrder = ambisonicOrder;
          this._numberOfChannels =
              (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);
          this._buildAudioGraph();
          if (hrirBufferList) {
              this.setHRIRBufferList(hrirBufferList);
          }
          this.enable();
      }
      /**
       * Build the internal audio graph.
       * For TOA convolution:
       *   input -> splitter(16) -[0,1]-> merger(2) -> convolver(2) -> splitter(2)
       *                         -[2,3]-> merger(2) -> convolver(2) -> splitter(2)
       *                         -[4,5]-> ... (6 more, 8 branches total)
       */
      _buildAudioGraph() {
          const numberOfStereoChannels = Math.ceil(this._numberOfChannels / 2);
          this._inputSplitter =
              this._context.createChannelSplitter(this._numberOfChannels);
          this._stereoMergers = [];
          this._convolvers = [];
          this._stereoSplitters = [];
          this._positiveIndexSphericalHarmonics = this._context.createGain();
          this._negativeIndexSphericalHarmonics = this._context.createGain();
          this._inverter = this._context.createGain();
          this._binauralMerger = this._context.createChannelMerger(2);
          this._outputGain = this._context.createGain();
          for (let i = 0; i < numberOfStereoChannels; ++i) {
              this._stereoMergers[i] = this._context.createChannelMerger(2);
              this._convolvers[i] = this._context.createConvolver();
              this._stereoSplitters[i] = this._context.createChannelSplitter(2);
              this._convolvers[i].normalize = false;
          }
          for (let l = 0; l <= this._ambisonicOrder; ++l) {
              for (let m = -l; m <= l; m++) {
                  // We compute the ACN index (k) of ambisonics channel using the degree (l)
                  // and index (m): k = l^2 + l + m
                  const acnIndex = l * l + l + m;
                  const stereoIndex = Math.floor(acnIndex / 2);
                  // Split channels from input into array of stereo convolvers.
                  // Then create a network of mergers that produces the stereo output.
                  this._inputSplitter.connect(this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
                  this._stereoMergers[stereoIndex].connect(this._convolvers[stereoIndex]);
                  this._convolvers[stereoIndex].connect(this._stereoSplitters[stereoIndex]);
                  // Positive index (m >= 0) spherical harmonics are symmetrical around the
                  // front axis, while negative index (m < 0) spherical harmonics are
                  // anti-symmetrical around the front axis. We will exploit this symmetry
                  // to reduce the number of convolutions required when rendering to a
                  // symmetrical binaural renderer.
                  if (m >= 0) {
                      this._stereoSplitters[stereoIndex].connect(this._positiveIndexSphericalHarmonics, acnIndex % 2);
                  }
                  else {
                      this._stereoSplitters[stereoIndex].connect(this._negativeIndexSphericalHarmonics, acnIndex % 2);
                  }
              }
          }
          this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
          this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 1);
          this._negativeIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
          this._negativeIndexSphericalHarmonics.connect(this._inverter);
          this._inverter.connect(this._binauralMerger, 0, 1);
          // For asymmetric index.
          this._inverter.gain.value = -1;
          // Input/Output proxy.
          this.input = this._inputSplitter;
          this.output = this._outputGain;
      }
      dispose() {
          if (this._active) {
              this.disable();
          }
          for (let l = 0; l <= this._ambisonicOrder; ++l) {
              for (let m = -l; m <= l; m++) {
                  // We compute the ACN index (k) of ambisonics channel using the degree (l)
                  // and index (m): k = l^2 + l + m
                  const acnIndex = l * l + l + m;
                  const stereoIndex = Math.floor(acnIndex / 2);
                  // Split channels from input into array of stereo convolvers.
                  // Then create a network of mergers that produces the stereo output.
                  this._inputSplitter.disconnect(this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
                  this._stereoMergers[stereoIndex].disconnect(this._convolvers[stereoIndex]);
                  this._convolvers[stereoIndex].disconnect(this._stereoSplitters[stereoIndex]);
                  // Positive index (m >= 0) spherical harmonics are symmetrical around the
                  // front axis, while negative index (m < 0) spherical harmonics are
                  // anti-symmetrical around the front axis. We will exploit this symmetry
                  // to reduce the number of convolutions required when rendering to a
                  // symmetrical binaural renderer.
                  if (m >= 0) {
                      this._stereoSplitters[stereoIndex].disconnect(this._positiveIndexSphericalHarmonics, acnIndex % 2);
                  }
                  else {
                      this._stereoSplitters[stereoIndex].disconnect(this._negativeIndexSphericalHarmonics, acnIndex % 2);
                  }
              }
          }
          this._positiveIndexSphericalHarmonics.disconnect(this._binauralMerger, 0, 0);
          this._positiveIndexSphericalHarmonics.disconnect(this._binauralMerger, 0, 1);
          this._negativeIndexSphericalHarmonics.disconnect(this._binauralMerger, 0, 0);
          this._negativeIndexSphericalHarmonics.disconnect(this._inverter);
          this._inverter.disconnect(this._binauralMerger, 0, 1);
      }
      /**
       * Assigns N HRIR AudioBuffers to N convolvers: Note that we use 2 stereo
       * convolutions for 4-channel direct convolution. Using mono convolver or
       * 4-channel convolver is not viable because mono convolution wastefully
       * produces the stereo outputs, and the 4-ch convolver does cross-channel
       * convolution. (See Web Audio API spec)
       * @param hrirBufferList - An array of stereo AudioBuffers for
       * convolvers.
       */
      setHRIRBufferList(hrirBufferList) {
          // After these assignments, the channel data in the buffer is immutable in
          // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
          // an exception will be thrown.
          if (this._isBufferLoaded) {
              return;
          }
          for (let i = 0; i < hrirBufferList.length; ++i) {
              this._convolvers[i].buffer = hrirBufferList[i];
          }
          this._isBufferLoaded = true;
      }
      /**
       * Enable HOAConvolver instance. The audio graph will be activated and pulled by
       * the WebAudio engine. (i.e. consume CPU cycle)
       */
      enable() {
          this._binauralMerger.connect(this._outputGain);
          this._active = true;
      }
      /**
       * Disable HOAConvolver instance. The inner graph will be disconnected from the
       * audio destination, thus no CPU cycle will be consumed.
       */
      disable() {
          this._binauralMerger.disconnect();
          this._active = false;
      }
  }

  /**
   * @license
   * Copyright 2016 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * @file Sound field rotator for higher-order-ambisonics decoding.
   */
  function getKroneckerDelta(i, j) {
      return i === j ? 1 : 0;
  }
  function lij2i(l, i, j) {
      const index = (j + l) * (2 * l + 1) + (i + l);
      return index;
  }
  /**
   * A helper function to allow us to access a matrix array in the same
   * manner, assuming it is a (2l+1)x(2l+1) matrix. [2] uses an odd convention of
   * referring to the rows and columns using centered indices, so the middle row
   * and column are (0, 0) and the upper left would have negative coordinates.
   * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1) elements, where n=1,2,...,N.
   * @param l
   * @param i
   * @param j
   * @param gainValue
   */
  function setCenteredElement(matrix, l, i, j, gainValue) {
      const index = lij2i(l, i, j);
      // Row-wise indexing.
      matrix[l - 1][index].gain.value = gainValue;
  }
  /**
   * This is a helper function to allow us to access a matrix array in the same
   * manner, assuming it is a (2l+1) x (2l+1) matrix.
   * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
   * elements, where n=1,2,...,N.
   * @param l
   * @param i
   * @param j
   */
  function getCenteredElement(matrix, l, i, j) {
      // Row-wise indexing.
      const index = lij2i(l, i, j);
      return matrix[l - 1][index].gain.value;
  }
  /**
   * Helper function defined in [2] that is used by the functions U, V, W.
   * This should not be called on its own, as U, V, and W (and their coefficients)
   * select the appropriate matrix elements to access arguments |a| and |b|.
   * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
   * elements, where n=1,2,...,N.
   * @param i
   * @param a
   * @param b
   * @param l
   */
  function getP(matrix, i, a, b, l) {
      if (b === l) {
          return getCenteredElement(matrix, 1, i, 1) *
              getCenteredElement(matrix, l - 1, a, l - 1) -
              getCenteredElement(matrix, 1, i, -1) *
                  getCenteredElement(matrix, l - 1, a, -l + 1);
      }
      else if (b === -l) {
          return getCenteredElement(matrix, 1, i, 1) *
              getCenteredElement(matrix, l - 1, a, -l + 1) +
              getCenteredElement(matrix, 1, i, -1) *
                  getCenteredElement(matrix, l - 1, a, l - 1);
      }
      else {
          return getCenteredElement(matrix, 1, i, 0) *
              getCenteredElement(matrix, l - 1, a, b);
      }
  }
  /**
   * The functions U, V, and W should only be called if the correspondingly
   * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
   * When the coefficient is 0, these would attempt to access matrix elements that
   * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
   * previously completed band rotations. These functions are valid for |l >= 2|.
   * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
   * elements, where n=1,2,...,N.
   * @param m
   * @param n
   * @param l
   */
  function getU(matrix, m, n, l) {
      // Although [1, 2] split U into three cases for m == 0, m < 0, m > 0
      // the actual values are the same for all three cases.
      return getP(matrix, 0, m, n, l);
  }
  /**
   * The functions U, V, and W should only be called if the correspondingly
   * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
   * When the coefficient is 0, these would attempt to access matrix elements that
   * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
   * previously completed band rotations. These functions are valid for |l >= 2|.
   * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
   * elements, where n=1,2,...,N.
   * @param m
   * @param n
   * @param l
   */
  function getV(matrix, m, n, l) {
      if (m === 0) {
          return getP(matrix, 1, 1, n, l) +
              getP(matrix, -1, -1, n, l);
      }
      else if (m > 0) {
          const d = getKroneckerDelta(m, 1);
          return getP(matrix, 1, m - 1, n, l) * Math.sqrt(1 + d) -
              getP(matrix, -1, -m + 1, n, l) * (1 - d);
      }
      else {
          // Note there is apparent errata in [1,2,2b] dealing with this particular
          // case. [2b] writes it should be P*(1-d)+P*(1-d)^0.5
          // [1] writes it as P*(1+d)+P*(1-d)^0.5, but going through the math by hand,
          // you must have it as P*(1-d)+P*(1+d)^0.5 to form a 2^.5 term, which
          // parallels the case where m > 0.
          const d = getKroneckerDelta(m, -1);
          return getP(matrix, 1, m + 1, n, l) * (1 - d) +
              getP(matrix, -1, -m - 1, n, l) * Math.sqrt(1 + d);
      }
  }
  /**
   * The functions U, V, and W should only be called if the correspondingly
   * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
   * When the coefficient is 0, these would attempt to access matrix elements that
   * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
   * previously completed band rotations. These functions are valid for |l >= 2|.
   * @param matrix N matrices of gainNodes, each with (2n+1) x (2n+1)
   * elements, where n=1,2,...,N.
   * @param m
   * @param n
   * @param l
   */
  function getW(matrix, m, n, l) {
      // Whenever this happens, w is also 0 so W can be anything.
      if (m === 0) {
          return 0;
      }
      return m > 0 ?
          getP(matrix, 1, m + 1, n, l) + getP(matrix, -1, -m - 1, n, l) :
          getP(matrix, 1, m - 1, n, l) - getP(matrix, -1, -m + 1, n, l);
  }
  /**
   * Calculates the coefficients applied to the U, V, and W functions. Because
   * their equations share many common terms they are computed simultaneously.
   * @return 3 coefficients for U, V and W functions.
   */
  function computeUVWCoeff(m, n, l) {
      const d = getKroneckerDelta(m, 0);
      const reciprocalDenominator = Math.abs(n) === l ? 1 / (2 * l * (2 * l - 1)) : 1 / ((l + n) * (l - n));
      set$2(UVWCoeff, Math.sqrt((l + m) * (l - m) * reciprocalDenominator), 0.5 * (1 - 2 * d) * Math.sqrt((1 + d) *
          (l + Math.abs(m) - 1) *
          (l + Math.abs(m)) *
          reciprocalDenominator), -0.5 * (1 - d) * Math.sqrt((l - Math.abs(m) - 1) * (l - Math.abs(m))) * reciprocalDenominator);
      return UVWCoeff;
  }
  const UVWCoeff = create$2();
  /**
   * Calculates the (2l+1) x (2l+1) rotation matrix for the band l.
   * This uses the matrices computed for band 1 and band l-1 to compute the
   * matrix for band l. |rotations| must contain the previously computed l-1
   * rotation matrices.
   * This implementation comes from p. 5 (6346), Table 1 and 2 in [2] taking
   * into account the corrections from [2b].
   * @param matrix - N matrices of gainNodes, each with where
   * n=1,2,...,N.
   * @param l
   */
  function computeBandRotation(matrix, l) {
      // The lth band rotation matrix has rows and columns equal to the number of
      // coefficients within that band (-l <= m <= l implies 2l + 1 coefficients).
      for (let m = -l; m <= l; m++) {
          for (let n = -l; n <= l; n++) {
              const uvwCoefficients = computeUVWCoeff(m, n, l);
              // The functions U, V, W are only safe to call if the coefficients
              // u, v, w are not zero.
              if (Math.abs(uvwCoefficients[0]) > 0) {
                  uvwCoefficients[0] *= getU(matrix, m, n, l);
              }
              if (Math.abs(uvwCoefficients[1]) > 0) {
                  uvwCoefficients[1] *= getV(matrix, m, n, l);
              }
              if (Math.abs(uvwCoefficients[2]) > 0) {
                  uvwCoefficients[2] *= getW(matrix, m, n, l);
              }
              setCenteredElement(matrix, l, m, n, uvwCoefficients[0] + uvwCoefficients[1] + uvwCoefficients[2]);
          }
      }
  }
  /**
   * Compute the HOA rotation matrix after setting the transform matrix.
   * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
   * elements, where n=1,2,...,N.
   */
  function computeHOAMatrices(matrix) {
      // We start by computing the 2nd-order matrix from the 1st-order matrix.
      for (let i = 2; i <= matrix.length; i++) {
          computeBandRotation(matrix, i);
      }
  }
  /**
   * Higher-order-ambisonic decoder based on gain node network. We expect
   * the order of the channels to conform to ACN ordering. Below are the helper
   * methods to compute SH rotation using recursion. The code uses maths described
   * in the following papers:
   *  [1] R. Green, "Spherical Harmonic Lighting: The Gritty Details", GDC 2003,
   *      http://www.research.scea.com/gdc2003/spherical-harmonic-lighting.pdf
   *  [2] J. Ivanic and K. Ruedenberg, "Rotation Matrices for Real
   *      Spherical Harmonics. Direct Determination by Recursion", J. Phys.
   *      Chem., vol. 100, no. 15, pp. 6342-6347, 1996.
   *      http://pubs.acs.org/doi/pdf/10.1021/jp953350u
   *  [2b] Corrections to initial publication:
   *       http://pubs.acs.org/doi/pdf/10.1021/jp9833350
   */
  class HOARotator {
      /**
       * Higher-order-ambisonic decoder based on gain node network. We expect
       * the order of the channels to conform to ACN ordering. Below are the helper
       * methods to compute SH rotation using recursion. The code uses maths described
       * in the following papers:
       *  [1] R. Green, "Spherical Harmonic Lighting: The Gritty Details", GDC 2003,
       *      http://www.research.scea.com/gdc2003/spherical-harmonic-lighting.pdf
       *  [2] J. Ivanic and K. Ruedenberg, "Rotation Matrices for Real
       *      Spherical Harmonics. Direct Determination by Recursion", J. Phys.
       *      Chem., vol. 100, no. 15, pp. 6342-6347, 1996.
       *      http://pubs.acs.org/doi/pdf/10.1021/jp953350u
       *  [2b] Corrections to initial publication:
       *       http://pubs.acs.org/doi/pdf/10.1021/jp9833350
       * @param context - Associated AudioContext.
       * @param ambisonicOrder - Ambisonic order.
       */
      constructor(context, ambisonicOrder) {
          this._context = context;
          this._ambisonicOrder = ambisonicOrder;
          // We need to determine the number of channels K based on the ambisonic order
          // N where K = (N + 1)^2.
          const numberOfChannels = (ambisonicOrder + 1) * (ambisonicOrder + 1);
          this._splitter = this._context.createChannelSplitter(numberOfChannels);
          this._merger = this._context.createChannelMerger(numberOfChannels);
          // Create a set of per-order rotation matrices using gain nodes.
          /** @type {GainNode[][]} */
          this._gainNodeMatrix = [];
          for (let i = 1; i <= ambisonicOrder; i++) {
              // Each ambisonic order requires a separate (2l + 1) x (2l + 1) rotation
              // matrix. We compute the offset value as the first channel index of the
              // current order where
              //   k_last = l^2 + l + m,
              // and m = -l
              //   k_last = l^2
              const orderOffset = i * i;
              // Uses row-major indexing.
              const rows = (2 * i + 1);
              this._gainNodeMatrix[i - 1] = [];
              for (let j = 0; j < rows; j++) {
                  const inputIndex = orderOffset + j;
                  for (let k = 0; k < rows; k++) {
                      const outputIndex = orderOffset + k;
                      const matrixIndex = j * rows + k;
                      this._gainNodeMatrix[i - 1][matrixIndex] = this._context.createGain();
                      this._splitter.connect(this._gainNodeMatrix[i - 1][matrixIndex], inputIndex);
                      this._gainNodeMatrix[i - 1][matrixIndex].connect(this._merger, 0, outputIndex);
                  }
              }
          }
          // W-channel is not involved in rotation, skip straight to ouput.
          this._splitter.connect(this._merger, 0, 0);
          // Default Identity matrix.
          this.setRotationMatrix3(identity(create()));
          // Input/Output proxy.
          this.input = this._splitter;
          this.output = this._merger;
      }
      dispose() {
          for (let i = 1; i <= this._ambisonicOrder; i++) {
              // Each ambisonic order requires a separate (2l + 1) x (2l + 1) rotation
              // matrix. We compute the offset value as the first channel index of the
              // current order where
              //   k_last = l^2 + l + m,
              // and m = -l
              //   k_last = l^2
              const orderOffset = i * i;
              // Uses row-major indexing.
              const rows = (2 * i + 1);
              for (let j = 0; j < rows; j++) {
                  const inputIndex = orderOffset + j;
                  for (let k = 0; k < rows; k++) {
                      const outputIndex = orderOffset + k;
                      const matrixIndex = j * rows + k;
                      this._splitter.disconnect(this._gainNodeMatrix[i - 1][matrixIndex], inputIndex);
                      this._gainNodeMatrix[i - 1][matrixIndex].disconnect(this._merger, 0, outputIndex);
                  }
              }
          }
          // W-channel is not involved in rotation, skip straight to ouput.
          this._splitter.disconnect(this._merger, 0, 0);
      }
      /**
       * Updates the rotation matrix with 3x3 matrix.
       * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
       */
      setRotationMatrix3(rotationMatrix3) {
          this._gainNodeMatrix[0][0].gain.value = rotationMatrix3[0];
          this._gainNodeMatrix[0][1].gain.value = rotationMatrix3[1];
          this._gainNodeMatrix[0][2].gain.value = rotationMatrix3[2];
          this._gainNodeMatrix[0][3].gain.value = rotationMatrix3[3];
          this._gainNodeMatrix[0][4].gain.value = rotationMatrix3[4];
          this._gainNodeMatrix[0][5].gain.value = rotationMatrix3[5];
          this._gainNodeMatrix[0][6].gain.value = rotationMatrix3[6];
          this._gainNodeMatrix[0][7].gain.value = rotationMatrix3[7];
          this._gainNodeMatrix[0][8].gain.value = rotationMatrix3[8];
          computeHOAMatrices(this._gainNodeMatrix);
      }
      /**
       * Updates the rotation matrix with 4x4 matrix.
       * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
       */
      setRotationMatrix4(rotationMatrix4) {
          this._gainNodeMatrix[0][0].gain.value = rotationMatrix4[0];
          this._gainNodeMatrix[0][1].gain.value = rotationMatrix4[1];
          this._gainNodeMatrix[0][2].gain.value = rotationMatrix4[2];
          this._gainNodeMatrix[0][3].gain.value = rotationMatrix4[4];
          this._gainNodeMatrix[0][4].gain.value = rotationMatrix4[5];
          this._gainNodeMatrix[0][5].gain.value = rotationMatrix4[6];
          this._gainNodeMatrix[0][6].gain.value = rotationMatrix4[8];
          this._gainNodeMatrix[0][7].gain.value = rotationMatrix4[9];
          this._gainNodeMatrix[0][8].gain.value = rotationMatrix4[10];
          computeHOAMatrices(this._gainNodeMatrix);
      }
      /**
       * Returns the current 3x3 rotation matrix.
       * @return A 3x3 rotation matrix. (column-major)
       */
      getRotationMatrix3() {
          set(rotationMatrix3$1, this._gainNodeMatrix[0][0].gain.value, this._gainNodeMatrix[0][1].gain.value, this._gainNodeMatrix[0][2].gain.value, this._gainNodeMatrix[0][3].gain.value, this._gainNodeMatrix[0][4].gain.value, this._gainNodeMatrix[0][5].gain.value, this._gainNodeMatrix[0][6].gain.value, this._gainNodeMatrix[0][7].gain.value, this._gainNodeMatrix[0][8].gain.value);
          return rotationMatrix3$1;
      }
      /**
       * Returns the current 4x4 rotation matrix.
       * @return A 4x4 rotation matrix. (column-major)
       */
      getRotationMatrix4() {
          set$1(rotationMatrix4$1, this._gainNodeMatrix[0][0].gain.value, this._gainNodeMatrix[0][1].gain.value, this._gainNodeMatrix[0][2].gain.value, 0, this._gainNodeMatrix[0][3].gain.value, this._gainNodeMatrix[0][4].gain.value, this._gainNodeMatrix[0][5].gain.value, 0, this._gainNodeMatrix[0][6].gain.value, this._gainNodeMatrix[0][7].gain.value, this._gainNodeMatrix[0][8].gain.value, 0, 0, 0, 0, 1);
          return rotationMatrix4$1;
      }
      /**
       * Get the current ambisonic order.
       */
      getAmbisonicOrder() {
          return this._ambisonicOrder;
      }
  }
  const rotationMatrix3$1 = create();
  const rotationMatrix4$1 = create$1();

  var SOAHrirBase64 = [
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wQA8/8ZAPr/DAD+/wMA/v8KAAQA/f8DAAMABADs//z/8v/z/8f/R/90/ob+//zAAWsDAwY3DKn9//tu93DvkwI6An4CuwJ0/BH7VPux92X0Gu7N/EX9mgfqCkkIiRMgBd4NQQGL/c0G/xBxAKELZATUA/sIHRSx+fkCyAUmBNEJIARlAdHz2AjNACcIsAW4AlECsvtJ/P/7K/tf++n8aP4W+g0FXAElAMn8nQHn/sT+Zv7N+9X2xvzM/O3+EvpqBBD7SQLd+vb/sPlw/JD72/3n+Rr+L/wS/vz6UQGg/Nf+Av5L/5X9Gv2//SP+mf3j/lf+v/2B/ZH/5P05/iL9MP9F/uf9UP4v/qv9mv7o/Xn+wP2k/8L+uP5J/tD+Dv/Y/bL+mP72/n3+pP+7/hAA+/5zAGH+Z/+u/g8Azv2y/6L+//9o/iIADP8VACz/CwCN/pb/1v4yAFP+wf+4/jsAcf5VAP3+bADa/nMA6f4sAOT+IQBd/v7/7v6aAIL+QADe/nEA0P4yAKz+CQCo/moAuf5xAN7+mAC8/jcANf9eAPX+IAA1/1kAAP9hAMz+PQD5/m0A2/4gAPr+UQDh/jQAEv9BAPH+FABN/zkASv9DADP/BABe/1IAGf8oAE3/RQAw/zIAQf8mADn/GgBE/xIAR/8hAD7/BABy/zEAKP/0/07/GwBX/z4ARf8mAFr/QQBV/zUAVP8eAFz/JABt/0EAUP8MAHz/KgBr/ycAYv8EAH3/MABl/x8Agv8bAIj/GgBv//z/ff8AAJX/IABu/+T/jv/r/4z/9/9n/77/pP8JAJD/EQCJ//r/q/8WAJ//GQCU/xYAtv8qAKr/PQCW/ysAwf8+ALb/OgC3/ygAz/8uAM7/OgDH/ygAz/8kAMz/OgC//xsA1f8qAMn/LwDN/xcA1f8oAMv/JQDR/xMAzf8bAM//HgDU/wUA2v8ZANL/EwDW/wEA1f8ZAMz/BwDX/wIA0v8SANT/BQDW/wMA0/8PANT/AADY/wIA1f8MANX/+f/a/wUA0v8IANf/+//Y/wUA0/8DANr/+f/Y/wQA1v8BANr/+f/Z/wUA1//8/9z/+v/Y/wYA2f/8/93//v/Y/wUA2v/9/93////Z/wUA3P/8/97/AgDa/wMA3v/8/97/AwDb/wIA3//9/97/BADd/wEA4f///9//BQDf/wAA4v8AAN//BQDf/wAA4/8CAN//BADh/wAA4/8DAOD/BADi////4/8DAOH/AwDk/wAA5P8FAOL/AgDl/wEA5P8FAOL/AQDl/wEA4/8EAOL/AQDj/wIA4P8DAN//AADg/wIA3v8CAOD/AADh/wEA4v8AAOP/AADm/wAA6P8AAOz/AADu/wAA",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////f/+//7///8AAP////8BAAEA/f8AAAEAAQAFAAUA9//6/x0A2f/9/xMA3P+jAE//of9HAKP//gCj/77/Z/vi/28D9/ywDJAJIvr6AsX0Xec4BhcGzf23DZP7yfZ6C1//nwBDBIHyYgob/Tf3sQ41ANoKRA/A+E7yffAa9gD5EQUBDMwMygiqAHMAqPqhAGUB2/gE+a78H/+4APT6DwIUAA0HNwMhBfL8E/90A5n7dP9cALIC+v5C/q0AOv9kAogBHv01/+3/qAQD/ub8T/4vAOUA5P6KATv+ywEYAeT+KP6i/3gCFP6h/hr/+P83ACL/VADn/8UARQJI/4MAu/8qAlj+wf4iAPb/LgFJ/8QAUABAAI4ABf+k/3X/YgFK/ij/j/9HADoAi/+WAA0BVwC/ACL/LACe//cARv9i/xgAUgA0ACj/FgBgAIj/5P9M/7z/zv8/AKz/gv8sAEQA6/+I/yYAawDL/7T/xf8qAOv/FQCu/5n/EgAyAO3/i/9LAE4A+//R//P/FgDe/8z/u/8DADIALAAZALL/TAA8ABwAo//1/xwA/P/L/z0A6P8jAN7/7v+a/zAAwf/7/3//KQAuACwA9v8RAGYAIwBNADgAKgASAF0ADgANACEAMQDH//H/LQACAB0Ay////x0APAABAAQA2v8iAAcAEgDE/+v/FQD+/+P/DAD1/97/6v/4//X/EwD4/+7/5P8cAA0ACQDH//7/CQAXAAEA/P/5//j/CwAWAAEABQD9//n/AQAWAB0A7v/k/wAACQAmAP//9/8AAPn/8/8aAO//6/8fAOv/5v8hAP//5/8PAOf/AAAGAPn/6v8JAAYABgABAOv/1//1//L/+P8DABcA6f/8/wMACgD7/xAA3v/2//z/DADu//z/5v/5/wEA/P/6//7/7v/x/wQABgD5/wAA8v/w/wkAEQD2//j/+v8EAAcAEAD3//v/+v8CAAAACQD3//v//v/9/wUADAD2//X/AgAHAAAABwD2//T/BgAKAP7/AQD4//r/BAAIAPn/AAD3//f/BQAHAPv//v/7//n/BQAJAPj/+v/9//7/AgAGAPj/+f8BAAEAAgAFAPn/+v8BAAIAAAAEAPn/+f8CAAQA/v8BAPr/+v8CAAQA/P////v//P8CAAQA+//+//3//f8CAAUA+v/9//////8AAAQA+v/8////AAD//wIA+//8/wAAAQD+/wEA+//8/wAAAgD9/////P/9/wEAAgD8//7//f/9/wAAAgD8//3//v/+////AQD8//z/////////AAD8//3///8AAP7/AAD9//7///8AAP7////+//////8AAP7////+////////////////////",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v8AAP///////wAAAAAAAP7/AQABAAAABwD///X/BQAjAPL/CQDb/9D/GAAb/7sAYwCW/z0BcP/X/7T/2QDW+wH8yANCCCUJ5QT++UXmhPwhA78FuAxH+p78ifudBlAG9vmu/lAK2fdlB///cfjoCa0E7Akn9Yb/zvba+AkAHPywBGEBFwUNAL8AXAAGA20DFvmR/kz+F/06Ag/+GwHl/5EEKgJd/q0AP/ym/9n6EfxY/2H+/QFtAC4C6QBDAaMCo/20/+3/3f/p/fL9rv9V/6cBhQHuAX4AcwJYAaH/IP/P/gsApP0LAe7/sQBuAI0AAgGDAE4BzACe/5X//v+v/+f+Zf+gAOv/5QBhAOIApAANASYAuP+h/8b/HQBr/9//bACWAGEAFAB5AD0AWQDU/+D/Yf/p//D/s/+R/4QAMQBvABEAkQBfABQAJgDW/wwA8/8XALz/vf8zAFAAKwD1/zEAPwDJ/x0A7/8LAOX/FwDR//H/EQAdAO//6P8QAFEA2f8WABEAMgDy/xIA+f/s/xAALgDv////HQAvAPT/+f8iAAYAEgAFABoAGgD//w0A+f/0/xsAHgDx/9f/GAACAPH/8f8JAPf/GwALABEA7/8cAPT/CgD2//j/BQD8/+3/OgAgAAYA9f8PAN7/DgD9/9r/1//3/+3/9//1//b/8//5//f/AgAJAOf/+v8OAAMACwD9/+7/5f8eAAEA9//q//7/8P8WAP7/+//4/wIA+f8TAAIA9f/5/wcA+P8iAAgA9v/n/xoA//8gAAUABwDj/wAA9v8BAAUAFQDn/wMA7v8QABAAEQDm/wwA8f8aAAAABwDu/wcACgASAAEA7//w//f/BgARAAkA6P/3/wcADgAKAAYA4f/4/wYADgAAAPr/8P/9/xQACgAHAPn/7//9/xEAAgD+//L/8v/8/xUAAwDw//H/9f8CAAsA/v/q//L/+f8FAAYA/P/r//j///8GAAkA+//o//j/AQAIAP//+v/o//v/CAAIAPv/+P/w/wEACQAHAPj/+f/0/wIACwAFAPb/+f/4/wQACwACAPP/+f/+/wYACAD///L/+/8BAAYABQD9//P//P8FAAUAAgD7//T//f8HAAQA///7//f///8IAAMA/P/6//r/AQAIAAEA+v/6//3/AgAHAAAA+f/7/wAAAwAFAP7/+P/8/wIAAgACAP3/+f/9/wMAAwAAAPz/+v/+/wQAAgD+//z/+/8AAAQAAQD8//z//f8BAAQAAAD7//3///8BAAMA///7//3/AAACAAEA/v/7//7/AQABAAAA/v/9////AQAAAP///v/+////AAD/////////////////////////////",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAAAA/v/+/wAAAQD8//3/CQAJAP3/+v8PAAcApABlABkBkwCO/i//lfqa/HQAcf/3BdkCzwJcBCMC0wMN/9/9wgI7AaECYfxV/Tf83vhn/xrt8Owx/8n7cgHABYb43QcZDh4WugNrA7P74gHu/9z/zv0t/acCiQHY/iv4qQOl/ysCE/0//XT9Sf4O//j9xfupAn394gHO+rsCXAFIAxQC9wIXBgcD2AQuAnb/9gJh/6wAVfxEAI4Bvf7oAFv/bALsAMQBe/88/joAT/4dAH39/v9LAXn/gwDI//QBdABcAA0A7f4lAMn///+9/tv/iABp/13/pP/dALv/w/8MAHv//f+y/6////7U/5AAZP+Z/8r/nQDR/5r/DwDr/xAA4v+s/3z/+P9uAOv/t/82AGcAHgCb/yQAFQBGAM7/CgD3/xoAegAaAOz/CgBHAA8Adv8/AAAABQC2/xIAAAA7ABQAKgCj/z4AAQAXAJz/JAADAAcA8f/1/2AAAQAlAPD/NgDx/1wA7v/4/wMAZADv//3/HQAkAFoA8P9FAPv/FgBIAPf/WQAHAEUACQD0/xIAQwDu/wMAwP9VALn/XwCw/yEA5f8sAPj/FgDD/1YAyv8rAOX/HQDo//j/IQAQACAAHwD9/yQAHQBAABgABQAiAAUAKAD3/wkACwAKAAMABwAJAPb/+f8GAOr/JQAHABMA6P8TAA4AGgD//woA8/8ZAP//GADu/w0A9v8SAAMABwD4/wQA5P8XAAQACgDq/wUA+/8VAAcACADs/xIAAAATAPH/+v/1//T/7f///+z/+v/y/+//9/8KAAcACgAJAPT/BAAKAAAABgAIAPL/9v8KAAMABAACAPr/9v8OAAIA+P/x//v/+f8MAPb/+P/w/wQA9f8MAPn////7/woA/v8PAAEAAgD1/xAAAQAPAP//AwD//xQABwALAAAABgADABAAAgAHAAAACAABAA8ABQAFAAMABwAEAA4ABwADAAEACQAFAAoAAwD//wAACQADAAUAAQD/////CAABAAMAAAD/////BwACAAEAAAD/////BwACAP7///8BAAAABgABAP7///8CAAAABAAAAP7///8DAAAAAwAAAP3///8DAAAAAQAAAP3//v8EAAAAAAD+//////8EAP/////+/wAA/v8EAP/////+/wEA/v8EAP///v/+/wIA//8DAP///v/+/wIA//8BAP///v/+/wMA//8BAP/////+/wMA//8AAP//AAD+/wQA//8AAP7/AQD//wIA////////AQD//wIA////////AQAAAAEAAAAAAP//AQD//wEAAAAAAP//AQAAAAEAAAAAAAAA",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wAA+v8AAPz/AAD//wAA/f8AAAEAAAD+/wAACQAAAAQAAAAZAAAAtgAAAFsBAABW/gAAH/oAAGcBAABoBwAAlAAAAO3/AAARAQAA+wIAAEoEAACe/gAAiv4AALD0AADJ8wAAkQQAAF34AABi8QAAPQAAAAH2AAD19AAADAMAAJwGAACTEAAA0AwAAJkHAACOBwAAuQEAANcDAAC6AgAAHwUAAHEFAAB0AwAAbgEAADz+AADYAQAAGAAAAJwCAADgAAAA//0AAMn+AAAT/AAAwP8AAOn9AAAJAAAAewEAAOn+AACN/wAAOv0AAO3+AADN/gAAcP8AACj/AACq/gAA+f4AAML9AACa/wAA/f4AAN7/AABo/wAA6/4AAE//AAAC/wAAEQAAAHX/AAB0AAAA5f8AAEwAAAB3AAAA5/8AAMIAAABCAAAAzgAAAE8AAAB3AAAAKAAAADMAAACqAAAALwAAAK4AAAASAAAAVgAAACgAAAAtAAAATAAAAP3/AAA7AAAA2/8AACQAAADw/wAALQAAADEAAAAlAAAAbAAAADMAAABUAAAAEAAAACgAAAD1/wAA9v8AAPr/AADu/wAALgAAABIAAABUAAAARAAAAGUAAABGAAAAOAAAAGAAAAAuAAAARQAAACEAAAAfAAAAAAAAAAkAAAAQAAAAAwAAABIAAADs/wAAEAAAAAYAAAASAAAAIgAAABEAAAADAAAABAAAAA8AAAD4/wAAHQAAAAsAAAAIAAAADgAAAP//AAAcAAAADwAAAAYAAAASAAAAFwAAAAMAAAAYAAAAEgAAAPr/AAAQAAAADQAAAAoAAAD3/wAABgAAAPb/AADf/wAA/v8AAPL/AAD6/wAAFAAAAAQAAAAEAAAAGwAAAAEAAAAMAAAAIAAAAAIAAAAdAAAAGAAAAAIAAAAcAAAAEgAAAAcAAAAeAAAADwAAAAQAAAAeAAAABAAAAAYAAAAZAAAAAQAAAA4AAAATAAAA/v8AAAoAAAAOAAAA+/8AAAsAAAAJAAAA+f8AAAsAAAABAAAA+f8AAAoAAAD9/wAA+v8AAAcAAAD5/wAA+v8AAAUAAAD3/wAA/f8AAAQAAAD2/wAAAAAAAAEAAAD3/wAAAgAAAAAAAAD4/wAAAwAAAP7/AAD6/wAABAAAAP3/AAD8/wAABAAAAPv/AAD+/wAAAwAAAPv/AAD//wAAAQAAAPv/AAAAAAAAAAAAAPv/AAACAAAA//8AAPz/AAACAAAA/v8AAP3/AAACAAAA/f8AAP7/AAABAAAA/f8AAP//AAABAAAA/f8AAAAAAAAAAAAA/v8AAAEAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  ];

  var TOAHrirBase64 = [
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wQA8/8YAP3/CgACAAAA//8CAAYA8/8AAPH/CgDv/97/e/+y/9P+UQDwAHUBEwV7/pP8P/y09bsDwAfNBGYIFf/Y+736+fP890Hv8AGcC3T/vwYy+S70AAICA3AD4AagBw0R4w3ZEAcN8RVYAV8Q8P2z+kECHwdK/jIG0QNKAYUElf8IClj7BgjX+/f8j/l3/5f/6fkK+xz8FP0v/nj/Mf/n/FcBPfvH/1H3+gBP/Hf8cfiCAR/54QBh+UQAcvkzAWL8TP13+iD/V/73+wv9Kv+Y/hv+xPz7/UL83//a/z/9AP6R/5L+jf26/P3+rP26/tD8nP7B/Pv+WP1V/sP9gv91/3P9xP3J/nv/GP5S/sb+IP8v/9j/dv7U/pr+6v+u/Z3/sv5cAOr9Q/83/+n/zP5x/57+2//k/nwA/v01//L+SACB/sD/Ff81AJT+TgDp/ocAm/5dAFT+MgD+/pMAW/7o/yH/xQDA/kkA9P6LAL3+pAC0/iQAz/5UALD+UwAt/3UAhf4UAA//pwC+/joAz/5aAAv/fwDY/iMAIf+uAPP+ZAAc/0QAy/4xAB7/TgDs/goADP8wAEL/NwDo/ub/Uf9BAC3/+v9F/y4ARP9HAFP/EQA3/xMATP81AG3/HQAu/wgAaP9FACb/9f9B/y0AUP8rAED/CwBV/z4AW/8TAGH/BQBK/xsAfv8eAFn/AgB3/zwAff8RAGj//v+E/yAAb//0/3n/FwBz/xcAiv8PAHn/FQCJ/xgAg//x/3j/EQCa/ycAff/w/47/HwCI//X/iv/7/43/JQCM/+n/kP8AAJb/JACj//7/oP8ZAML/SwCo/w4Atv8tAMb/PACr/xcAwP9HAMP/OADF/y4A0f9IANL/NwC//zEA0f9LAMb/MAC8/y4A3f9GAMH/FQDQ/yYA2/8sAMT/AwDX/xkA3v8SAM3/9v/c/w8A4f8LAMj/8f/h/xQA2P8CAMn/8//j/xQA0v/7/9H//P/i/xEA0v/1/9L//f/j/w0A0f/x/9f//v/k/wgAz//u/9z/AwDg/wMA0P/v/9//BQDf////0v/y/+D/CADc//3/0v/2/+L/CgDa//r/1v/5/+T/CgDY//j/2f/9/+T/CADY//f/3P8AAOT/BwDY//f/4P8EAOP/BADZ//j/4v8GAOL/AwDa//r/5f8IAOH/AQDc//3/5v8JAOD//v/f////5v8IAOD//v/h/wIA5/8HAOD//f/j/wMA5/8GAOD//f/l/wYA5v8EAOD//v/m/wYA5f8CAOL////n/wYA5P8BAOH/AADl/wUA4f///+H/AQDk/wMA4f///+T/AQDm/wEA5////+r/AADt/wAA7/////P/AAD1////",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v///wAAAAAAAAAAAQAAAAAA///9/wAABAD+//n/AgAJAAAA+v/+//f/DAAdAPv/+v+l/8L+jf/4/vgAdwVPAQACLQBo+Qj/Ev7o/N3/VgCbA08Bxf+L+yn9J/2HCU8FmgBvDe30Rv5h/LT09gi5CxkA5gOi8/30kwEM+4YJMf2nBmkJJAQQBLoFtvvv+m4A7PF6/R0Bif3qAuf8WARAAf4GyABG/BIAwvr4Acv8U//c/yIC8AEn/B8Daf2CAgMBAf3MAN38vgLK/UT/QwCyAPYClPyvAW/+pQAoASD+zP+R/IYC1f7C/nEBQP96AZb+1QAIAM//yQE7/tkAZ/7TAXL/w/8+AIsAtwB7/24A4v9a/z4A7v4iADb/dwCj/23/kgBOANUAIv8lAKEAxP9gAK7/BwCP/5kA7/9v/0wAzv9DAGT/3/9vAHv/6P+q/xUA7P8XAO//uv/g/2UAEgCV/wEATADM/+7/+//j/+D/9v/i//j/IgD+/xoAxf/6/z4A5/+8/9D/QwDq/+3/OQDT/zUAIgA/APP/PgAjAPD/BwAGACAADAC3//b/HAA3AN//RgDN/w8AIAACAN//GQBDACEAIwA+ACoAJQAeAPz/KgAYAPr/DgAEABYAIgAcAMT/7f8OAOL/5P/2//L/9P8GAPT/7v/8/+7/6v/t//z/AgAUAOL//P8VAAMA4/8IAPb/+P8MAAoA5v8NAAsA9v///wEAAAD9//n/9/8JAAYA7v/6/wMA+f8GAAEA7f/7/xgACAD4/w8A///3/w0A+f8BAAIA/P/5/xIA///9//r/7v/+/xYACQD///H/CwDz/wEADgAHAPP/FADn/+3/AQD5//f/AgD7/wEABwAMAAEADQD8//n/8f8OAPX/BAD+//X/+v8WAAQA+f8CAAEA7/8QAAEA/P8DAAUA9f8KAAwA9v8DAAUA+f8OAAoA9f/7/w0A+v8EAAgA8P/6/woA+//8/wkA+P/3/woA+//8/wcA9//1/woAAwD5/wcA/P/3/w0AAwD3/wEABAD2/wkABgD3/wEABQD3/wUABQD3//v/BwD3/wMABQD3//r/CQD7////BQD6//n/CQD9//3/BAD9//j/BwAAAPv/AwD///j/BwABAPn/AQABAPn/BQACAPn///8DAPr/AwADAPr//v8EAPv/AQADAPv//P8FAP3///8DAPz/+/8FAP7//f8CAP7/+/8EAP///P8BAP//+/8DAAEA+/8AAAEA+/8CAAIA+////wIA/f8AAAIA/P/+/wIA/f8AAAIA/f/9/wMA/////wEA///+/wIA/////wAAAAD+/wAAAAD/////AAD//wAA//8AAP//AAD//wAA",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAP////8AAP//AAAAAPz//f8IAAMA9////w4AAQD6/wwA8//+/y8Afv/0/2H/UP5gAbH+2QG1B2cAVAIh/l32FPyM/nACPQDV/+UEo/Q6AQwCu/oLD9kF8QJA/Uz+Wf2KCOcC+wUKBsL5aQBQ97rwOPiPAvn5CAl8AHEDkQPcAA8Bn/lIAdz7HQF1+xz9cAM4/94E4gDKAun+cgPYAYr9JgJr/bf+ivxz/MoBgv5UA8EBSgAQAJ7/UgEk/cQB7f63/sD/vf4XAhT/BQFCADYAnQGI/9EBtv3hALD/vP+c/3H/TgIN/1sBpf8yAP3/4f8qABr+1f8OAJ3/dwAGADEBnv9JAPz/IQBwAIH/jgAS/4wAsACTAOn/DQDCALn/ZQCSAAIAAwD1/9//jv9aADQA/v9EAB0AfgA8AAQACgB9APr/IAARAPT/5v9xACAABAAHAGUAt/89AC4ACgAjAMP/+v/9/xYA7f/1/+D/7P87AC0Auv8RAAcA9/8FAC8A2//y/xIAEwAaADQAJADp/zoAAgAfABIA2f/e/zUA+P/6/w4A9//A/zcA4//P//T/5f/R////EwDb/w4A8/8BABkANADh/xEA+f/0/wIAHADc//j/GwD1//f/GADs/+v/EAAAAPz/EgD3/+r/FgAMAAkAGAD9/+z/IQAQAPH/GQD3//z/CgAfAOX/AgD8//H/BAATAOv/+v///wIABAAdAOj/BQAPAAcAAQATAOz/8/8JAAkA6f8VAOv/+f8QABUA/v8OAO3/+P8KABUA9f8FAPv/5/8TAA0A7f8XAAkAAQAJABYA4/8WAAcACgANABEA7v8EAP7/AAD+/wMA9//7/xAAAQD8/wQA+f/7/wMABgDq/wAA+v/3/wYACQD1//3/BAD9/wgADgDw//r/AgD6/wEACADv//j/BQD///X/BwDu//j/AgACAPP/BAD2//n/BAAGAPb/BAD8//3/BQAJAPL/AwD+//3/BAAIAPP//f8DAPz/AAAGAPP/+/8CAP7//f8FAPX/+f8DAAAA/P8EAPf/+v8GAAMA+/8EAPv/+/8GAAQA+v8CAP///P8EAAUA+f8AAP///f8CAAUA+P///wEA/v8BAAUA+f/+/wIAAAD//wUA+v/9/wMAAQD9/wQA+//9/wMAAgD8/wMA/P/9/wMAAwD7/wEA/v/+/wIAAwD6/wEA///+/wAABAD6/wAAAQD//wAAAwD7////AQAAAP//AwD8//7/AgABAP3/AgD9//7/AQABAP3/AQD+//7/AAACAPz/AAD+//////8BAP3/AAD//wAA//8BAP7/AAD//wAA/v8AAP7/AAD//wAA//8AAP//",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////P/9//3//////wAAAAAAAAIAAgACAP//CAAEAEEA//+cAAUAb/8HAAH9+P9eARkAogQUAJn8BwCd/gX/+QQNAKoC9gFdAtb/b/vd/936TP/6AsD/nfqn/un1W/0dA8IEsQLvAJv2bP72+WMAkP8dAcX+nQO2AIr6bP/EABX+NgK/Bdj2IQv2AE4EUAiD/xQAnwIm/B0B/wGNAoH7sQaP/b8CiQakAqD+R/9xA477KQL//6r75v/O/pcCgQCtAiMCBQAkANAARwHf//39hgBl/kUAJgEtAUEATgA/AgoASADK/zUAJv29/vL+l/9c/0cAUwBBAE8A6QE5/87/Wv9NAOf+5v7P/5P/4/9BAKYAQwDD/zYB5v+r/zYATwAp/1v/WQAEAB0AhwA0AA0AIAA3AAEAzv/u/+//5v9m/zwAIADQ/8T/SABiANb/SwAbAFf/MQDX/7L/hP8TAPr/AgAMAAsAHwAZAI3/VgDC/9v/5//x/6P/AwBlAMv/yf82AB4A+P9WAPj/NwDi/1EA0v9JANj/JwAcAAEADABYANj/4f8MAEwAmP82AN//3P8UADYA7//6/wIACADU/ygAyv82AN7/9v/2/ygAxv/9/+3/5//n/zUA6//g/y4ADgD5/wsABwDv/xIADwAGACoAJQD3/zIA+/8FABsAFgDO/zAAHAAIABQALADp/xcACAAAAPH/GADs/wkACQAFAAgAFQDp/wIAHAD1//P/EQDw/+3/GAD9/+f/HAD8//T/DAAQAPH/HwD4//r/DwAPAOj/EQACAOn/DAAXAOX/BAAOANH/9/8MAO//9f8LANT/9f8EAO//6f8NANb/+P8KAOz/5v8MAOD/7f8UAO//7//+//7/9v8YAPj/9f/z/wsA+v8SAPD/+v/x/xYA+f8SAPb/9//3/xEABQACAPn/9//y/xQACQD///b//v/7/xIACQD9//H/AAD7/xEAAgD5//P/AwD9/w8AAgD3//D/BAD//wUA/v/0//D/BgADAAMA/P/2//f/BwAGAP7/+//2//j/CAAFAPv/+f/5//v/BwAHAPn/9//7//7/BQAFAPf/9//+/wEABAACAPf/+P8BAAIAAgAAAPj/9/8CAAMAAAD+//n/+f8EAAQA/v/8//r/+/8EAAMA/P/7//z//P8EAAIA/P/5//7//v8DAAEA+//5//////8CAAAA+//5/wEAAAABAP//+//6/wIAAQD///3//P/7/wMAAQD///3//f/9/wIAAQD9//3//v/9/wMAAQD9//z/AAD//wEAAAD9//z/AAAAAAAA///9//3/AAD//wAA/v////7/AAD//wAA////////AAD//wAA//8AAP//",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+////+f////v//v///wAA/////wUAAQAIAAIABwACAHkATAAOAaMAAf9C/9X6QvwhArAAtghABW37nv/y+0wAWQNcAE8JRwSOC6AEJe8P8S/zrPWaBI/+LQA/+0L+P/4K8AgAb/8uCh78BQtC614GaQWfAin5UfzN8Tf+GQizAZ4MCQMbGJ4BoRS7AvcHyQARA6n9ZwHZ/z4DvwAZAlAB6gbNAS4GFADFATL7E/2K+j37C/xp/SD9Uv0VAOsDs//WAd3+bv7F/f79mP2X/KH+FwC0/1n+VgFcATABHQGaAET+nf8Y/hoAovpqAXj9CQKW/lsCl/4RApj+bAHk/RcAlv4BAG/+DgDi//3/GwAOAEIAq/+y/3z/8v8+/7T/Tv8//27/mgDZ/1sA+P+cAAAA/P/i/yMAi/85AMP/KgDM/9MA9P+QABoA4QAiACwACwBdAP7/TQDb/y0Ayf+SAA0AZwDg/4wA+/8/AAMAgQDp/w0ADAAQAAoANgAgAA4AKABIAB4A4v/3/+f/+v/c/+n/EADn/wgAFAAqAOz/IwDc/9//3f8XAND/2v/a/w0A5v8BANb/9P/m/wAA8P8ZAN3/RwAGAEsABgB/AP7/NAASAEgABAA3AP3/KgD9/1sA8P8lAOr/FgD1/xAA4/8kAOv/AwD4/xEA5f8NAPT/+v/3/x8A7f8PAPj/IwD5/yAA9/8ZAAEAGgD4/xoA9f8HAAMACAD0/xgA+P8AAPr/IQDp/w4A8v8HAPX/IgD1/wYA+P8GAPX/GgD3/woABQASAAcAGQDw/+v/9P8bAP3/HADs/+f/7/8LAPr//v/0//T/AgD2/wsA6P///+P/CADY//7/5v/3/wQA/v8LAPD/GgD1/yMA/P8QAOv/LADw/yQA+P8XAO7/MQD9/yEAAQAcAPD/IgD9/xMA+/8OAO//FQABAAoA+/8PAPP/FQABAAQA9/8PAPX/CAADAAEA+P8NAPv/CAAGAAUA9/8JAP//AAAFAPz/+f8HAAQA/f8FAP3//P8FAAYA+P8DAP7/+/8AAAcA9/8BAP///f///wgA9//+/wAA/v/8/wUA9//8/wIA///7/wUA+v/7/wIAAAD6/wMA/P/6/wEAAQD6/wEA/v/7/wIAAgD6////AAD7/wEAAgD7//7/AQD8/wAAAwD8//3/AwD9/wAAAgD9//z/AwD/////AgD+//z/AwAAAP7/AQD///3/AgABAP3/AAAAAP3/AgACAPz///8BAP3/AQACAP3//v8BAP7/AAABAP3//v8CAP7///8BAP7//f8CAP////8AAAAA/v8CAAAAAAAAAAAA/v8BAAAAAAD//wAA//8AAP//AAD//wAA//8AAP//",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA/////wAAAQD+////AAAGAP3/OAABAIIAAwBv//f/E/0QAK0ADQCzA/7/8P4u/0cBDQCJA6ABbQDg/w7/z/9o+Vn/SPnL/1//Ef+2+jr9RfZgA5QFZwILDFj+PAb2/nEFKgKk/R0Dlv6b/FUDsP6YAoj9SgAT/iL/tAPwAv8A0P6zAr7/dwAnAf39uP22/skA2v///2YCoP4UAUsAZgF2AJH+4P70/rz9+f+U/Xv/8v7CAcb+TACS/kwAv/+x/tX9oP71/oL/1f8nAEUAZwGtAAgAIgC/AD4BaP8GAGH/dQDF/64Arf8nAakAhAH9/+kAQQD3AFb/q/8p/yIAR/8FAPD/ZAA/AIYA3v8tADQADQBp/3f/CwABAP3/Wf8OANj/WwDH/xoAe/8DAKz/zv96/z8A3f/J/5X/IAD5//j/q//c/+//RADq//D/vv8pADUAFQDI/y8ACAAbANb/OwD3/+3/9f/e/wcAIAAeAMH/8/8xAC0AEADW/+3/HAADAPv/8P8DAOL/OwD3/xcACQAHAM//5f8XAAcAz//T/9D/HgD9////yf/e//v/AgD//9H/6/////H/+/8hAAIA9//7/w0AFgAQAPL/2v/8/xsAGQABANz/9P8YAAQA/v/y/wMA5v8YAAkAAAAAAAMA7/8KABgADwDs//j/BwATABsA8P/1//z/BAAMAAAA9P/s/xAA/v8GAAkA/v/p/wMACwALAP7/9P/p/wcADQAFAPb/7//4/w0ACAD8//b//v/1/wMACwD1//T/8P/8/wAACQDz/+f/5P8GAAkABQD5//D/+v8FAA0AAwD///T/AgACABAA/v8CAPD/+/8FAAoA9f/3//f//v8GAP7/9v/t//z/+f8AAPj/+v/3/wEA+v8HAPr//P/5/wQA//8DAPr/+P/3/wYA///+//X/+//5/wQA/f/7//X/+//4/wMA/f/8//j//v/9/wYA///8//f/AgAAAAUA/f/6//n/AwACAAIA/f/7//z/AwACAAAA/f/6//3/AgADAP7//f/7/wAAAwAFAPz////8/wMAAgAEAPv//v/+/wMAAgADAPv//v///wMAAQABAPv//f8AAAIAAAD///v//f8BAAIA///+//z//v8CAAIA/v/9//3///8CAAEA/v/9//7/AAACAAAA/v/9////AAABAAAA/f/9/wAAAQABAP///f/+/wEAAQAAAP///v/+/wEAAQD///7//v///wEAAQD///7//v///wEAAAD+//7///8AAAAAAAD+//7///8AAAAA///+//7///8AAAAA////////AAAAAP////////////8AAP//////////",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAAAAABAAAAAAD//////////////v////3/////////+//8////AQD9//z/9f8BAAIA+f8dACgAWQBxAJX/qv+Y/uz9aP9k/7UDUQQBAiQA4Pgi/AkB0gKaBsD/+fxp/vz9CQSp/I/+ywDO+vMD0fzK/PABcgBeBfoBv/+uAuH9Sf5gAy39awMmBWUBuP9fA9/9fgDj/2/+EACaACcCSv9Z/2j/rv7hAA0AWf55/7L84P7E/SIAT/67AMv/tf+FAA7/1v+7/gv/IP+E/sQA+P5aAXz/tP9XAFX/tP8o/4r/j//e/yQAMv9mAJT/rgCr/9X/EwCb//H/9f7F/6D/EAAoAK3//v+e/zsAh/+B/7r/if/C/2r/4P/z/6//HwCy/0IA7/9ZALT/y/80ACgA9v/J/9//DgA5ADUALQARADIACwAfAOf/NgArACMACQBBAEcAGAAjAC4AWQBUAHcAAAAfACEAIAAcAPj/CADk/yQA7v89AEEAFwD5/xYA6f8aAOX/AADF/zQADwAUAOT/BQDr/yUA6P8XAOf/HADR/0AA8P8nAAgACQDt/ycAKAAHAPH/IQDz/xsACADn//n/DgADAA4A8P///8z/GgDN/yMA/f8QANj/MwACAC0ACwAOAO3/JgAZAAUACgAAAA4AIgAaAAkADwACAAAAHQATAAUABQACAAgACwAjAO////8AAA8ABQAPAPL//f8GAAsABgAGAPD/8v8GAPz/CAD6//H/6v8PAAgABgD4//3/9v8aAAgABwD1//7//v8QAAoACAD//wUA9v8QAAoABAAFAAgAAgAJAAoAAwD//w0AAgD//wcA/v8DAAoABQAFABUABAAKAAYABwAHAA8ACgAGAAwADwAMAAkAEAAJAAgADwAMAAgADgAJAAUACQAPAAUACwAHAAEABgAIAAEABAAGAP//AgAJAAAAAgAEAP7///8IAAIA//8GAAEAAQAJAAIA/v8EAAMA//8JAAEA/v8DAAMA/v8HAAMA/f8BAAUA/v8FAAMA/v8BAAcA//8DAAMA/v8BAAYA//8CAAMA/////wcAAAAAAAMAAAD//wYAAQD+/wMAAQD//wUAAQD+/wIAAgD//wQAAgD+/wEAAwD//wMAAwD+/wEAAwD//wIAAwD//wEABAAAAAEABAD//wAABAABAAAAAwAAAAAABAABAP//AwABAAAAAwACAP//AgACAAAAAwACAP//AgACAAAAAgACAAAAAQADAAAAAQACAAAAAQADAAAAAQACAAAAAAACAAEAAAACAAEAAAACAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAAAAAAAAAAAAAAA",
      "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA//8AAP//AAACAAAA+f8BAAYA///4/wIA//8AAA8A/v/V/wEAEwA9AAEBRwA2AF7/kfog/3gBwv99CDYBU/qtAUX/AP7OAfkAX/o9B38FSfwaAuT14/60BAr8CQAI/tfyIQTzAXP+egdUBBwBof7TBMT8bAWi/5EEWwBRAAAKyfxE/8b88vp6ACP+PAF4/qD8MQNM/ygCJ/2XAPD9kP5gAVT/iP9I/lEB4P8qAD0BFAGa/+7/DgB2AOP98gFm/u/+Vv5/AG8ASP9gAM//qv9w//oAcv+2/jIBHgA7/6D/oAAGAKH/lADT/wAAggC8AAYAkP9yAEcAkf8BAOD/RAAr/zUANwDt/xQAJQAkAMT/zwA/AOH/xv9zAGsANQBTAIcALAAvACIATACy/xMADADg/xcAWABvAJL/7f9VAPb/EgDt/wcA4f8kAPP/5P+h/wgACQDy//r/LgAQAMn/8/9CAOX/5v/S/9//3P8pABYAuP/s/w8AFgDt/+3/7v/w/9j/5/8GAOf/2P/2//P//v8kABMAuf/m/xoADADZ/+r/3P8KAAUAKwDe/wsA3P8VAAAADgAfAB0ACAAMAF4AGgAhAPL/MwDz/0kABAAKAPX/LwAbAAkA9v/s/+3/8/8CABAAAADm//n/BQALAAUAAQDj//n/JQAVAPX/9v/+/wIAEQABAPP/8P/1/wAABgD6/+3/7//o//j/DAD8/+b/8P8IAAkABgD4//D/8P8UAAoAAwD4/wAA+f8OAAcAAAAFAPX/9v8TAAkA8v8EAPb/9/8dAA0A7/8CAPn/+f8SAAQA8/8CAOf/+v8DAAgA9P////H//P8IAAUA8//0/wIAAQAGAAgA9//7/wAA+/8EAP//+P/+////AgACAAsA8v/+/wIABQD7/wgA9v/7/wMABAD5/wAA/P/3/wEAAQD7//7//P/1/wQA///3//r////3/wMAAwD1//r/AwD6////AgD4//n/AwD8//7/AgD4//n/AwD+//3/AQD4//n/BQD///n/AAD6//j/BAABAPj/AAD9//v/AwADAPj//v/+//z/AwAEAPj//v8BAP7/AQADAPj//f8CAP////8EAPr//P8DAAAA/v8CAPv//P8DAAEA/f8BAP3//f8DAAIA/P8AAP7//f8DAAIA/P///wAA/f8BAAIA+//+/wEA//8AAAEA+//+/wEA/////wEA/P/+/wEA///+/wAA/f/9/wEAAAD9/wAA/f/+/wEAAQD8/////v/+/wAAAQD8////////////AQD9////AAD/////AAD+////AAAAAP//AAD///////8AAP//AAD//wAA//8AAP//",
  ];

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  // Currently SOA and TOA are only supported.
  const SupportedAmbisonicOrder = [2, 3];
  /**
   * Omnitone HOA renderer class. Uses the optimized convolution technique.
   */
  class HOARenderer {
      /**
       * Omnitone HOA renderer class. Uses the optimized convolution technique.
       */
      constructor(context, options) {
          this.context = context;
          this.config = Object.assign({
              ambisonicOrder: 3,
              renderingMode: RenderingMode.Ambisonic,
          }, options);
          if (!SupportedAmbisonicOrder.includes(this.config.ambisonicOrder)) {
              log$1('HOARenderer: Invalid ambisonic order. (got ' +
                  this.config.ambisonicOrder + ') Fallbacks to 3rd-order ambisonic.');
              this.config.ambisonicOrder = Math.max(2, Math.min(3, this.config.ambisonicOrder));
          }
          this.config.numberOfChannels =
              (this.config.ambisonicOrder + 1) * (this.config.ambisonicOrder + 1);
          this.config.numberOfStereoChannels =
              Math.ceil(this.config.numberOfChannels / 2);
          if (this.config.hrirPathList.length !== this.config.numberOfStereoChannels) {
              throw new Error('HOARenderer: Invalid HRIR URLs. It must be an array with ' +
                  this.config.numberOfStereoChannels + ' URLs to HRIR files.' +
                  ' (got ' + options.hrirPathList + ')');
          }
          this._buildAudioGraph();
      }
      /**
       * Builds the internal audio graph.
       */
      _buildAudioGraph() {
          this.input = this.context.createGain();
          this.output = this.context.createGain();
          this.bypass = this.context.createGain();
          this.rotator = new HOARotator(this.context, this.config.ambisonicOrder);
          this.convolver =
              new HOAConvolver(this.context, this.config.ambisonicOrder);
          this.input.connect(this.rotator.input);
          this.input.connect(this.bypass);
          this.rotator.output.connect(this.convolver.input);
          this.convolver.output.connect(this.output);
          this.input.channelCount = this.config.numberOfChannels;
          this.input.channelCountMode = 'explicit';
          this.input.channelInterpretation = 'discrete';
      }
      dispose() {
          if (this.getRenderingMode() === RenderingMode.Bypass) {
              this.bypass.connect(this.output);
          }
          this.input.disconnect(this.rotator.input);
          this.input.disconnect(this.bypass);
          this.rotator.output.disconnect(this.convolver.input);
          this.convolver.output.disconnect(this.output);
          this.rotator.dispose();
          this.convolver.dispose();
      }
      /**
       * Initializes and loads the resource for the renderer.
       */
      async initialize() {
          let bufferList;
          if (this.config.hrirPathList) {
              bufferList =
                  new BufferList(this.context, this.config.hrirPathList, { dataType: BufferDataType.URL });
          }
          else {
              bufferList = this.config.ambisonicOrder === 2
                  ? new BufferList(this.context, SOAHrirBase64)
                  : new BufferList(this.context, TOAHrirBase64);
          }
          try {
              const hrirBufferList = await bufferList.load();
              this.convolver.setHRIRBufferList(hrirBufferList);
              this.setRenderingMode(this.config.renderingMode);
          }
          catch (exp) {
              const errorMessage = `HOARenderer: HRIR loading/decoding (mode: ${this.config.renderingMode}) failed. Reason: ${exp.message}`;
              throw new Error(errorMessage);
          }
      }
      /**
       * Updates the rotation matrix with 3x3 matrix.
       * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
       */
      setRotationMatrix3(rotationMatrix3) {
          this.rotator.setRotationMatrix3(rotationMatrix3);
      }
      /**
       * Updates the rotation matrix with 4x4 matrix.
       * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
       */
      setRotationMatrix4(rotationMatrix4) {
          this.rotator.setRotationMatrix4(rotationMatrix4);
      }
      getRenderingMode() {
          return this.config.renderingMode;
      }
      /**
       * Set the decoding mode.
       * @param mode - Decoding mode.
       *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
       *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
       *    decoding or encoding.
       *  - 'off': all the processing off saving the CPU power.
       */
      setRenderingMode(mode) {
          if (mode === this.config.renderingMode) {
              return;
          }
          switch (mode) {
              case RenderingMode.Ambisonic:
                  this.convolver.enable();
                  this.bypass.disconnect();
                  break;
              case RenderingMode.Bypass:
                  this.convolver.disable();
                  this.bypass.connect(this.output);
                  break;
              case RenderingMode.None:
                  this.convolver.disable();
                  this.bypass.disconnect();
                  break;
              default:
                  log$1('HOARenderer: Rendering mode "' + mode + '" is not ' +
                      'supported.');
                  return;
          }
          this.config.renderingMode = mode;
      }
  }

  /**
   * @license
   * Copyright 2016 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Create a FOARenderer, the first-order ambisonic decoder and the optimized
   * binaural renderer.
   */
  function createFOARenderer(context, config) {
      return new FOARenderer(context, config);
  }
  /**
   * Creates HOARenderer for higher-order ambisonic decoding and the optimized
   * binaural rendering.
   */
  function createHOARenderer(context, config) {
      return new HOARenderer(context, config);
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Listener model to spatialize sources in an environment.
   */
  class Listener {
      /**
       * Listener model to spatialize sources in an environment.
       */
      constructor(context, options) {
          // Use defaults for undefined arguments.
          options = Object.assign({
              ambisonicOrder: DEFAULT_AMBISONIC_ORDER,
              position: copy(create$2(), DEFAULT_POSITION),
              forward: copy(create$2(), DEFAULT_FORWARD),
              up: copy(create$2(), DEFAULT_UP),
              renderingMode: DEFAULT_RENDERING_MODE
          }, options);
          // Member variables.
          this.position = create$2();
          this.tempMatrix3 = create();
          // Select the appropriate HRIR filters using 2-channel chunks since
          // multichannel audio is not yet supported by a majority of browsers.
          this.ambisonicOrder =
              Encoder.validateAmbisonicOrder(options.ambisonicOrder);
          // Create audio nodes.
          if (this.ambisonicOrder == 1) {
              this.renderer = createFOARenderer(context, {
                  renderingMode: options.renderingMode
              });
          }
          else if (this.ambisonicOrder > 1) {
              this.renderer = createHOARenderer(context, {
                  ambisonicOrder: this.ambisonicOrder,
                  renderingMode: options.renderingMode
              });
          }
          // These nodes are created in order to safely asynchronously load Omnitone
          // while the rest of the scene is being created.
          this.input = context.createGain();
          this.output = context.createGain();
          this.ambisonicOutput = context.createGain();
          // Initialize Omnitone (async) and connect to audio graph when complete.
          this.renderer.initialize().then(() => {
              // Connect pre-rotated soundfield to renderer.
              this.input.connect(this.renderer.input);
              // Connect rotated soundfield to ambisonic output.
              this.renderer.rotator.output.connect(this.ambisonicOutput);
              // Connect binaurally-rendered soundfield to binaural output.
              this.renderer.output.connect(this.output);
          });
          // Set orientation and update rotation matrix accordingly.
          this.setOrientation(options.forward, options.up);
      }
      getRenderingMode() {
          return this.renderer.getRenderingMode();
      }
      setRenderingMode(mode) {
          this.renderer.setRenderingMode(mode);
      }
      dispose() {
          // Connect pre-rotated soundfield to renderer.
          this.input.disconnect(this.renderer.input);
          // Connect rotated soundfield to ambisonic output.
          this.renderer.rotator.output.disconnect(this.ambisonicOutput);
          // Connect binaurally-rendered soundfield to binaural output.
          this.renderer.output.disconnect(this.output);
          this.renderer.dispose();
      }
      /**
       * Set the source's orientation using forward and up vectors.
       */
      setOrientation(forward, up) {
          copy(F, forward);
          copy(U, up);
          cross(R, F, U);
          set(this.tempMatrix3, R[0], R[1], R[2], U[0], U[1], U[2], -F[0], -F[1], -F[2]);
          this.renderer.setRotationMatrix3(this.tempMatrix3);
      }
  }
  const F = create$2();
  const U = create$2();
  const R = create$2();

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
  * Ray-tracing-based early reflections model.
  */
  class EarlyReflections {
      /**
       * Ray-tracing-based early reflections model.
       */
      constructor(context, options) {
          this.listenerPosition = copy(create$2(), DEFAULT_POSITION);
          this.speedOfSound = DEFAULT_SPEED_OF_SOUND;
          this.coefficients = {
              left: DEFAULT_REFLECTION_COEFFICIENTS.left,
              right: DEFAULT_REFLECTION_COEFFICIENTS.right,
              front: DEFAULT_REFLECTION_COEFFICIENTS.front,
              back: DEFAULT_REFLECTION_COEFFICIENTS.back,
              up: DEFAULT_REFLECTION_COEFFICIENTS.up,
              down: DEFAULT_REFLECTION_COEFFICIENTS.down,
          };
          this.halfDimensions = {
              width: 0.5 * DEFAULT_ROOM_DIMENSIONS.width,
              height: 0.5 * DEFAULT_ROOM_DIMENSIONS.height,
              depth: 0.5 * DEFAULT_ROOM_DIMENSIONS.depth,
          };
          if (options) {
              if (isGoodNumber(options?.speedOfSound)) {
                  this.speedOfSound = options.speedOfSound;
              }
              if (isArray(options?.listenerPosition)
                  && options.listenerPosition.length === 3
                  && isGoodNumber(options.listenerPosition[0])
                  && isGoodNumber(options.listenerPosition[1])
                  && isGoodNumber(options.listenerPosition[2])) {
                  this.listenerPosition[0] = options.listenerPosition[0];
                  this.listenerPosition[1] = options.listenerPosition[1];
                  this.listenerPosition[2] = options.listenerPosition[2];
              }
          }
          // Create nodes.
          this.input = context.createGain();
          this.output = context.createGain();
          this.lowpass = context.createBiquadFilter();
          this.merger = context.createChannelMerger(4); // First-order encoding only.
          this.delays = {
              left: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
              right: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
              front: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
              back: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
              up: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
              down: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION)
          };
          this.gains = {
              left: context.createGain(),
              right: context.createGain(),
              front: context.createGain(),
              back: context.createGain(),
              up: context.createGain(),
              down: context.createGain()
          };
          this.inverters = {
              right: context.createGain(),
              back: context.createGain(),
              down: context.createGain()
          };
          // Connect audio graph for each wall reflection and initialize encoder directions, set delay times and gains to 0.
          for (const direction of Object.values(Direction$1)) {
              const delay = this.delays[direction];
              const gain = this.gains[direction];
              delay.delayTime.value = 0;
              gain.gain.value = 0;
              this.delays[direction] = delay;
              this.gains[direction] = gain;
              this.lowpass.connect(delay);
              delay.connect(gain);
              gain.connect(this.merger, 0, 0);
              // Initialize inverters for opposite walls ('right', 'down', 'back' only).
              if (direction === Direction$1.Right
                  || direction == Direction$1.Back
                  || direction === Direction$1.Down) {
                  this.inverters[direction].gain.value = -1;
              }
          }
          this.input.connect(this.lowpass);
          // Initialize lowpass filter.
          this.lowpass.type = 'lowpass';
          this.lowpass.frequency.value = DEFAULT_REFLECTION_CUTOFF_FREQUENCY;
          this.lowpass.Q.value = 0;
          // Connect nodes.
          // Connect gains to ambisonic channel output.
          // Left: [1 1 0 0]
          // Right: [1 -1 0 0]
          // Up: [1 0 1 0]
          // Down: [1 0 -1 0]
          // Front: [1 0 0 1]
          // Back: [1 0 0 -1]
          this.gains.left.connect(this.merger, 0, 1);
          this.gains.right.connect(this.inverters.right);
          this.inverters.right.connect(this.merger, 0, 1);
          this.gains.up.connect(this.merger, 0, 2);
          this.gains.down.connect(this.inverters.down);
          this.inverters.down.connect(this.merger, 0, 2);
          this.gains.front.connect(this.merger, 0, 3);
          this.gains.back.connect(this.inverters.back);
          this.inverters.back.connect(this.merger, 0, 3);
          this.merger.connect(this.output);
          // Initialize.
          this.setRoomProperties(options?.dimensions, options?.coefficients);
      }
      /**
       * Set the room's properties which determines the characteristics of
       * reflections.
       * @param dimensions
       * Room dimensions (in meters). Defaults to
       * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
       * @param coefficients
       * Frequency-independent reflection coeffs per wall. Defaults to
       * {@linkcode DEFAULT_REFLECTION_COEFFICIENTS
       * DEFAULT_REFLECTION_COEFFICIENTS}.
       */
      setRoomProperties(dimensions, coefficients) {
          if (dimensions == undefined) {
              dimensions = {
                  width: DEFAULT_ROOM_DIMENSIONS.width,
                  height: DEFAULT_ROOM_DIMENSIONS.height,
                  depth: DEFAULT_ROOM_DIMENSIONS.depth,
              };
          }
          if (isGoodNumber(dimensions.width)
              && isGoodNumber(dimensions.height)
              && isGoodNumber(dimensions.depth)) {
              this.halfDimensions.width = 0.5 * dimensions.width;
              this.halfDimensions.height = 0.5 * dimensions.height;
              this.halfDimensions.depth = 0.5 * dimensions.depth;
          }
          if (coefficients == undefined) {
              coefficients = {
                  left: DEFAULT_REFLECTION_COEFFICIENTS.left,
                  right: DEFAULT_REFLECTION_COEFFICIENTS.right,
                  front: DEFAULT_REFLECTION_COEFFICIENTS.front,
                  back: DEFAULT_REFLECTION_COEFFICIENTS.back,
                  up: DEFAULT_REFLECTION_COEFFICIENTS.up,
                  down: DEFAULT_REFLECTION_COEFFICIENTS.down,
              };
          }
          if (isGoodNumber(coefficients.left)
              && isGoodNumber(coefficients.right)
              && isGoodNumber(coefficients.front)
              && isGoodNumber(coefficients.back)
              && isGoodNumber(coefficients.up)
              && isGoodNumber(coefficients.down)) {
              this.coefficients.left = coefficients.left;
              this.coefficients.right = coefficients.right;
              this.coefficients.front = coefficients.front;
              this.coefficients.back = coefficients.back;
              this.coefficients.up = coefficients.up;
              this.coefficients.down = coefficients.down;
          }
          // Update listener position with new room properties.
          this.setListenerPosition(this.listenerPosition);
      }
      dispose() {
          // Connect nodes.
          this.input.disconnect(this.lowpass);
          for (const property of Object.values(Direction$1)) {
              const delay = this.delays[property];
              const gain = this.gains[property];
              this.lowpass.disconnect(delay);
              delay.disconnect(gain);
              gain.disconnect(this.merger, 0, 0);
          }
          // Connect gains to ambisonic channel output.
          // Left: [1 1 0 0]
          // Right: [1 -1 0 0]
          // Up: [1 0 1 0]
          // Down: [1 0 -1 0]
          // Front: [1 0 0 1]
          // Back: [1 0 0 -1]
          this.gains.left.disconnect(this.merger, 0, 1);
          this.gains.right.disconnect(this.inverters.right);
          this.inverters.right.disconnect(this.merger, 0, 1);
          this.gains.up.disconnect(this.merger, 0, 2);
          this.gains.down.disconnect(this.inverters.down);
          this.inverters.down.disconnect(this.merger, 0, 2);
          this.gains.front.disconnect(this.merger, 0, 3);
          this.gains.back.disconnect(this.inverters.back);
          this.inverters.back.disconnect(this.merger, 0, 3);
          this.merger.disconnect(this.output);
      }
      /**
       * Set the listener's position (in meters),
       * where [0,0,0] is the center of the room.
       */
      setListenerPosition(v) {
          // Assign listener position.
          copy(this.listenerPosition, v);
          // Assign delay & attenuation values using distances.
          for (const direction of Object.values(Direction$1)) {
              const dim = this.halfDimensions[DirectionToDimension[direction]];
              const axis = this.listenerPosition[DirectionToAxis[direction]];
              const sign = DirectionSign[direction];
              const distance = DEFAULT_REFLECTION_MULTIPLIER * Math.max(0, dim + sign * axis) + DEFAULT_REFLECTION_MIN_DISTANCE;
              // Compute and assign delay (in seconds).
              const delayInSecs = distance / this.speedOfSound;
              this.delays[direction].delayTime.value = delayInSecs;
              // Compute and assign gain, uses logarithmic rolloff: "g = R / (d + 1)"
              const attenuation = this.coefficients[direction] / distance;
              this.gains[direction].gain.value = attenuation;
          }
      }
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Late-reflections reverberation filter for Ambisonic content.
   */
  class LateReflections {
      /**
      * Late-reflections reverberation filter for Ambisonic content.
      */
      constructor(context, options) {
          // Use defaults for undefined arguments.
          options = Object.assign({
              durations: DEFAULT_REVERB_DURATIONS.slice(),
              predelay: DEFAULT_REVERB_PREDELAY,
              gain: DEFAULT_REVERB_GAIN,
              bandwidth: DEFAULT_REVERB_BANDWIDTH,
              tailonset: DEFAULT_REVERB_TAIL_ONSET
          }, options);
          // Assign pre-computed variables.
          const delaySecs = options.predelay / 1000;
          this.bandwidthCoeff = options.bandwidth * LOG2_DIV2;
          this.tailonsetSamples = options.tailonset / 1000;
          // Create nodes.
          this.context = context;
          this.input = context.createGain();
          this.predelay = context.createDelay(delaySecs);
          this.convolver = context.createConvolver();
          this.output = context.createGain();
          // Set reverb attenuation.
          this.output.gain.value = options.gain;
          // Disable normalization.
          this.convolver.normalize = false;
          // Connect nodes.
          this.input.connect(this.predelay);
          this.predelay.connect(this.convolver);
          this.convolver.connect(this.output);
          // Compute IR using RT60 values.
          this.setDurations(options.durations);
      }
      dispose() {
          this.input.disconnect(this.predelay);
          this.predelay.disconnect(this.convolver);
          this.convolver.disconnect(this.output);
      }
      /**
       * Re-compute a new impulse response by providing Multiband RT60 durations.
       * @param durations
       * Multiband RT60 durations (in seconds) for each frequency band, listed as
       * {@linkcode DEFAULT_REVERB_FREQUENCY_BANDS
       * DEFAULT_REVERB_FREQUENCY_BANDS}.
       */
      setDurations(durations) {
          if (durations.length !== NUMBER_REVERB_FREQUENCY_BANDS) {
              log('Warning: invalid number of RT60 values provided to reverb.');
              return;
          }
          // Compute impulse response.
          const durationsSamples = new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);
          const sampleRate = this.context.sampleRate;
          for (let i = 0; i < durations.length; i++) {
              // Clamp within suitable range.
              durations[i] =
                  Math.max(0, Math.min(DEFAULT_REVERB_MAX_DURATION, durations[i]));
              // Convert seconds to samples.
              durationsSamples[i] = Math.round(durations[i] * sampleRate *
                  DEFAULT_REVERB_DURATION_MULTIPLIER);
          }
          // Determine max RT60 length in samples.
          let durationsSamplesMax = 0;
          for (let i = 0; i < durationsSamples.length; i++) {
              if (durationsSamples[i] > durationsSamplesMax) {
                  durationsSamplesMax = durationsSamples[i];
              }
          }
          // Skip this step if there is no reverberation to compute.
          if (durationsSamplesMax < 1) {
              durationsSamplesMax = 1;
          }
          // Create impulse response buffer.
          const buffer = this.context.createBuffer(1, durationsSamplesMax, sampleRate);
          const bufferData = buffer.getChannelData(0);
          // Create noise signal (computed once, referenced in each band's routine).
          const noiseSignal = new Float32Array(durationsSamplesMax);
          for (let i = 0; i < durationsSamplesMax; i++) {
              noiseSignal[i] = Math.random() * 2 - 1;
          }
          // Compute the decay rate per-band and filter the decaying noise signal.
          for (let i = 0; i < NUMBER_REVERB_FREQUENCY_BANDS; i++) {
              // Compute decay rate.
              const decayRate = -LOG1000 / durationsSamples[i];
              // Construct a standard one-zero, two-pole bandpass filter:
              // H(z) = (b0 * z^0 + b1 * z^-1 + b2 * z^-2) / (1 + a1 * z^-1 + a2 * z^-2)
              const omega = TWO_PI *
                  DEFAULT_REVERB_FREQUENCY_BANDS[i] / sampleRate;
              const sinOmega = Math.sin(omega);
              const alpha = sinOmega * Math.sinh(this.bandwidthCoeff * omega / sinOmega);
              const a0CoeffReciprocal = 1 / (1 + alpha);
              const b0Coeff = alpha * a0CoeffReciprocal;
              const a1Coeff = -2 * Math.cos(omega) * a0CoeffReciprocal;
              const a2Coeff = (1 - alpha) * a0CoeffReciprocal;
              // We optimize since b2 = -b0, b1 = 0.
              // Update equation for two-pole bandpass filter:
              //   u[n] = x[n] - a1 * x[n-1] - a2 * x[n-2]
              //   y[n] = b0 * (u[n] - u[n-2])
              let um1 = 0;
              let um2 = 0;
              for (let j = 0; j < durationsSamples[i]; j++) {
                  // Exponentially-decaying white noise.
                  const x = noiseSignal[j] * Math.exp(decayRate * j);
                  // Filter signal with bandpass filter and add to output.
                  const u = x - a1Coeff * um1 - a2Coeff * um2;
                  bufferData[j] += b0Coeff * (u - um2);
                  // Update coefficients.
                  um2 = um1;
                  um1 = u;
              }
          }
          // Create and apply half of a Hann window to the beginning of the
          // impulse response.
          const halfHannLength = Math.round(this.tailonsetSamples);
          for (let i = 0; i < Math.min(bufferData.length, halfHannLength); i++) {
              const halfHann = 0.5 * (1 - Math.cos(TWO_PI * i / (2 * halfHannLength - 1)));
              bufferData[i] *= halfHann;
          }
          this.convolver.buffer = buffer;
      }
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Generate absorption coefficients from material names.
   */
  function _getCoefficientsFromMaterials(materials) {
      // Initialize coefficients to use defaults.
      const coefficients = {
          [Direction$1.Left]: null,
          [Direction$1.Right]: null,
          [Direction$1.Front]: null,
          [Direction$1.Back]: null,
          [Direction$1.Up]: null,
          [Direction$1.Down]: null
      };
      for (const property of Object.values(Direction$1)) {
          const material = DEFAULT_ROOM_MATERIALS[property];
          coefficients[property] = ROOM_MATERIAL_COEFFICIENTS[material];
      }
      // Sanitize materials.
      if (materials == undefined) {
          materials = Object.assign({}, materials, DEFAULT_ROOM_MATERIALS);
      }
      // Assign coefficients using provided materials.
      for (const property of Object.values(Direction$1)) {
          if (materials[property] in ROOM_MATERIAL_COEFFICIENTS) {
              coefficients[property] =
                  ROOM_MATERIAL_COEFFICIENTS[materials[property]];
          }
          else {
              log('Material \"' + materials[property] + '\" on wall \"' +
                  property + '\" not found. Using \"' +
                  DEFAULT_ROOM_MATERIALS[property] + '\".');
          }
      }
      return coefficients;
  }
  /**
   * Sanitize coefficients.
   * @param coefficients
   * @return {Object}
   */
  function _sanitizeCoefficients(coefficients) {
      if (coefficients == undefined) {
          coefficients = {
              [Direction$1.Left]: null,
              [Direction$1.Right]: null,
              [Direction$1.Front]: null,
              [Direction$1.Back]: null,
              [Direction$1.Up]: null,
              [Direction$1.Down]: null
          };
      }
      for (const property of Object.values(Direction$1)) {
          if (!(coefficients.hasOwnProperty(property))) {
              // If element is not present, use default coefficients.
              coefficients[property] = ROOM_MATERIAL_COEFFICIENTS[DEFAULT_ROOM_MATERIALS[property]];
          }
      }
      return coefficients;
  }
  /**
   * Sanitize dimensions.
   * @param dimensions
   * @return {RoomDimensions}
   */
  function _sanitizeDimensions(dimensions) {
      if (dimensions == undefined) {
          dimensions = {
              width: DEFAULT_ROOM_DIMENSIONS.width,
              height: DEFAULT_ROOM_DIMENSIONS.height,
              depth: DEFAULT_ROOM_DIMENSIONS.depth
          };
      }
      else {
          for (const dimension of Object.values(Dimension)) {
              if (!dimensions.hasOwnProperty(dimension)) {
                  dimensions[dimension] = DEFAULT_ROOM_DIMENSIONS[dimension];
              }
          }
      }
      return dimensions;
  }
  /**
   * Compute frequency-dependent reverb durations.
   */
  function _getDurationsFromProperties(dimensions, coefficients, speedOfSound) {
      const durations = new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);
      // Sanitize inputs.
      dimensions = _sanitizeDimensions(dimensions);
      coefficients = _sanitizeCoefficients(coefficients);
      if (speedOfSound == undefined) {
          speedOfSound = DEFAULT_SPEED_OF_SOUND;
      }
      // Acoustic constant.
      const k = TWENTY_FOUR_LOG10 / speedOfSound;
      // Compute volume, skip if room is not present.
      const volume = dimensions.width * dimensions.height * dimensions.depth;
      if (volume < ROOM_MIN_VOLUME) {
          return durations;
      }
      // Room surface area.
      const leftRightArea = dimensions.width * dimensions.height;
      const floorCeilingArea = dimensions.width * dimensions.depth;
      const frontBackArea = dimensions.depth * dimensions.height;
      const totalArea = 2 * (leftRightArea + floorCeilingArea + frontBackArea);
      for (let i = 0; i < NUMBER_REVERB_FREQUENCY_BANDS; i++) {
          // Effective absorptive area.
          const absorbtionArea = (coefficients.left[i] + coefficients.right[i]) * leftRightArea +
              (coefficients.down[i] + coefficients.up[i]) * floorCeilingArea +
              (coefficients.front[i] + coefficients.back[i]) * frontBackArea;
          const meanAbsorbtionArea = absorbtionArea / totalArea;
          // Compute reverberation using Eyring equation [1].
          // [1] Beranek, Leo L. "Analysis of Sabine and Eyring equations and their
          //     application to concert hall audience and chair absorption." The
          //     Journal of the Acoustical Society of America, Vol. 120, No. 3.
          //     (2006), pp. 1399-1399.
          durations[i] = ROOM_EYRING_CORRECTION_COEFFICIENT * k * volume /
              (-totalArea * Math.log(1 - meanAbsorbtionArea) + 4 *
                  ROOM_AIR_ABSORPTION_COEFFICIENTS[i] * volume);
      }
      return durations;
  }
  /**
   * Compute reflection coefficients from absorption coefficients.
   * @param absorptionCoefficients
   * @return {Object}
   */
  function _computeReflectionCoefficients(absorptionCoefficients) {
      const reflectionCoefficients = {
          [Direction$1.Left]: 0,
          [Direction$1.Right]: 0,
          [Direction$1.Front]: 0,
          [Direction$1.Back]: 0,
          [Direction$1.Up]: 0,
          [Direction$1.Down]: 0
      };
      for (const property of Object.values(Direction$1)) {
          if (DEFAULT_REFLECTION_COEFFICIENTS
              .hasOwnProperty(property)) {
              // Compute average absorption coefficient (per wall).
              reflectionCoefficients[property] = 0;
              for (let j = 0; j < NUMBER_REFLECTION_AVERAGING_BANDS; j++) {
                  const bandIndex = j + ROOM_STARTING_AVERAGING_BAND;
                  reflectionCoefficients[property] +=
                      absorptionCoefficients[property][bandIndex];
              }
              reflectionCoefficients[property] /=
                  NUMBER_REFLECTION_AVERAGING_BANDS;
              // Convert absorption coefficient to reflection coefficient.
              reflectionCoefficients[property] =
                  Math.sqrt(1 - reflectionCoefficients[property]);
          }
      }
      return reflectionCoefficients;
  }
  /**
   * Model that manages early and late reflections using acoustic
   * properties and listener position relative to a rectangular room.
   **/
  class Room {
      constructor(context, options) {
          // Use defaults for undefined arguments.
          options = Object.assign({
              listenerPosition: copy(create$2(), DEFAULT_POSITION),
              dimensions: Object.assign({}, options.dimensions, DEFAULT_ROOM_DIMENSIONS),
              materials: Object.assign({}, options.materials, DEFAULT_ROOM_MATERIALS),
              speedOfSound: DEFAULT_SPEED_OF_SOUND
          }, options);
          // Sanitize room-properties-related arguments.
          options.dimensions = _sanitizeDimensions(options.dimensions);
          const absorptionCoefficients = _getCoefficientsFromMaterials(options.materials);
          const reflectionCoefficients = _computeReflectionCoefficients(absorptionCoefficients);
          const durations = _getDurationsFromProperties(options.dimensions, absorptionCoefficients, options.speedOfSound);
          // Construct submodules for early and late reflections.
          this.early = new EarlyReflections(context, {
              dimensions: options.dimensions,
              coefficients: reflectionCoefficients,
              speedOfSound: options.speedOfSound,
              listenerPosition: options.listenerPosition,
          });
          this.late = new LateReflections(context, {
              durations: durations,
          });
          this.speedOfSound = options.speedOfSound;
          // Construct auxillary audio nodes.
          this.output = context.createGain();
          this.early.output.connect(this.output);
          this._merger = context.createChannelMerger(4);
          this.late.output.connect(this._merger, 0, 0);
          this._merger.connect(this.output);
      }
      dispose() {
          this.early.output.disconnect(this.output);
          this.late.output.disconnect(this._merger, 0, 0);
          this._merger.disconnect(this.output);
      }
      /**
       * Set the room's dimensions and wall materials.
       * @param dimensions Room dimensions (in meters). Defaults to
       * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
       * @param materials Named acoustic materials per wall. Defaults to
       * {@linkcode DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
       */
      setProperties(dimensions, materials) {
          // Compute late response.
          const absorptionCoefficients = _getCoefficientsFromMaterials(materials);
          const durations = _getDurationsFromProperties(dimensions, absorptionCoefficients, this.speedOfSound);
          this.late.setDurations(durations);
          // Compute early response.
          this.early.speedOfSound = this.speedOfSound;
          const reflectionCoefficients = _computeReflectionCoefficients(absorptionCoefficients);
          this.early.setRoomProperties(dimensions, reflectionCoefficients);
      }
      /**
       * Set the listener's position (in meters), where origin is the center of
       * the room.
       */
      setListenerPosition(v) {
          this.early.speedOfSound = this.speedOfSound;
          this.early.setListenerPosition(v);
          // Disable room effects if the listener is outside the room boundaries.
          const distance = this.getDistanceOutsideRoom(v);
          let gain = 1;
          if (distance > EPSILON_FLOAT) {
              gain = 1 - distance / LISTENER_MAX_OUTSIDE_ROOM_DISTANCE;
              // Clamp gain between 0 and 1.
              gain = Math.max(0, Math.min(1, gain));
          }
          this.output.gain.value = gain;
      }
      /**
       * Compute distance outside room of provided position (in meters). Returns
       * Distance outside room (in meters). Returns 0 if inside room.
       */
      getDistanceOutsideRoom(v) {
          const dx = Math.max(0, -this.early.halfDimensions.width - v[0], v[0] - this.early.halfDimensions.width);
          const dy = Math.max(0, -this.early.halfDimensions.height - v[1], v[1] - this.early.halfDimensions.height);
          const dz = Math.max(0, -this.early.halfDimensions.depth - v[2], v[2] - this.early.halfDimensions.depth);
          return Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Distance-based attenuation filter.
   */
  class Attenuation {
      /**
       * Distance-based attenuation filter.
       */
      constructor(context, options) {
          this.minDistance = DEFAULT_MIN_DISTANCE;
          this.maxDistance = DEFAULT_MAX_DISTANCE;
          this.rolloff = DEFAULT_ATTENUATION_ROLLOFF;
          if (options) {
              if (isGoodNumber(options.minDistance)) {
                  this.minDistance = options.minDistance;
              }
              if (isGoodNumber(options.maxDistance)) {
                  this.maxDistance = options.maxDistance;
              }
              if (options.rolloff) {
                  this.rolloff = options.rolloff;
              }
          }
          // Assign values.
          this.setRolloff(this.rolloff);
          // Create node.
          this.gainNode = context.createGain();
          // Initialize distance to max distance.
          this.setDistance(this.maxDistance);
          // Input/Output proxy.
          this.input = this.gainNode;
          this.output = this.gainNode;
      }
      /**
       * Set distance from the listener.
       * @param distance Distance (in meters).
       */
      setDistance(distance) {
          let gain = 1;
          if (this.rolloff == 'logarithmic') {
              if (distance > this.maxDistance) {
                  gain = 0;
              }
              else if (distance > this.minDistance) {
                  let range = this.maxDistance - this.minDistance;
                  if (range > EPSILON_FLOAT) {
                      // Compute the distance attenuation value by the logarithmic curve
                      // "1 / (d + 1)" with an offset of |minDistance|.
                      let relativeDistance = distance - this.minDistance;
                      let attenuation = 1 / (relativeDistance + 1);
                      let attenuationMax = 1 / (range + 1);
                      gain = (attenuation - attenuationMax) / (1 - attenuationMax);
                  }
              }
          }
          else if (this.rolloff == 'linear') {
              if (distance > this.maxDistance) {
                  gain = 0;
              }
              else if (distance > this.minDistance) {
                  let range = this.maxDistance - this.minDistance;
                  if (range > EPSILON_FLOAT) {
                      gain = (this.maxDistance - distance) / range;
                  }
              }
          }
          this.gainNode.gain.value = gain;
      }
      /**
       * Set rolloff.
       * @param rolloff
       * Rolloff model to use, chosen from options in
       * {@linkcode ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
       */
      setRolloff(rolloff) {
          if (rolloff == null) {
              rolloff = DEFAULT_ATTENUATION_ROLLOFF;
          }
          this.rolloff = rolloff;
      }
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const forwardNorm = create$2();
  const directionNorm = create$2();
  /**
   * Directivity/occlusion filter.
   **/
  class Directivity {
      constructor(context, options) {
          this.cosTheta = 0;
          // Use defaults for undefined arguments.
          options = Object.assign({
              alpha: DEFAULT_DIRECTIVITY_ALPHA,
              sharpness: DEFAULT_DIRECTIVITY_SHARPNESS
          }, options);
          // Create audio node.
          this.context = context;
          this.lowpass = context.createBiquadFilter();
          // Initialize filter coefficients.
          this.lowpass.type = 'lowpass';
          this.lowpass.Q.value = 0;
          this.lowpass.frequency.value = context.sampleRate * 0.5;
          this.setPattern(options.alpha, options.sharpness);
          // Input/Output proxy.
          this.input = this.lowpass;
          this.output = this.lowpass;
      }
      /**
       * Compute the filter using the source's forward orientation and the listener's
       * position.
       * @param forward The source's forward vector.
       * @param direction The direction from the source to the
       * listener.
       */
      computeAngle(forward, direction) {
          normalize(forwardNorm, forward);
          normalize(directionNorm, direction);
          let coeff = 1;
          if (this.alpha > EPSILON_FLOAT) {
              let cosTheta = dot(forwardNorm, directionNorm);
              coeff = (1 - this.alpha) + this.alpha * cosTheta;
              coeff = Math.pow(Math.abs(coeff), this.sharpness);
          }
          this.lowpass.frequency.value = this.context.sampleRate * 0.5 * coeff;
      }
      /**
       * Set source's directivity pattern (defined by alpha), where 0 is an
       * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
       * pattern. The sharpness of the pattern is increased exponenentially.
       * @param alpha
       * Determines directivity pattern (0 to 1).
       * @param sharpness
       * Determines the sharpness of the directivity pattern (1 to Inf).
       * DEFAULT_DIRECTIVITY_SHARPNESS}.
       */
      setPattern(alpha, sharpness) {
          // Clamp and set values.
          this.alpha = Math.min(1, Math.max(0, alpha));
          this.sharpness = Math.max(1, sharpness);
          // Update angle calculation using new values.
          this.computeAngle(set$2(forwardNorm, this.cosTheta * this.cosTheta, 0, 0), set$2(directionNorm, 1, 0, 0));
      }
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Determine the distance a source is outside of a room. Attenuate gain going
   * to the reflections and reverb when the source is outside of the room.
   * @param distance Distance in meters.
   * @return Gain (linear) of source.
   */
  function _computeDistanceOutsideRoom(distance) {
      // We apply a linear ramp from 1 to 0 as the source is up to 1m outside.
      let gain = 1;
      if (distance > EPSILON_FLOAT) {
          gain = 1 - distance / SOURCE_MAX_OUTSIDE_ROOM_DISTANCE;
          // Clamp gain between 0 and 1.
          gain = Math.max(0, Math.min(1, gain));
      }
      return gain;
  }
  /**
   * Source model to spatialize an audio buffer.
   */
  class Source {
      /**
       * Source model to spatialize an audio buffer.
       * @param scene Associated ResonanceAudio instance.
       * @param options
       * Options for constructing a new Source.
       */
      constructor(scene, options) {
          // Use defaults for undefined arguments.
          options = Object.assign({
              position: copy(create$2(), DEFAULT_POSITION),
              forward: copy(create$2(), DEFAULT_FORWARD),
              up: copy(create$2(), DEFAULT_UP),
              minDistance: DEFAULT_MIN_DISTANCE,
              maxDistance: DEFAULT_MAX_DISTANCE,
              rolloff: DEFAULT_ATTENUATION_ROLLOFF,
              gain: DEFAULT_SOURCE_GAIN,
              alpha: DEFAULT_DIRECTIVITY_ALPHA,
              sharpness: DEFAULT_DIRECTIVITY_SHARPNESS,
              sourceWidth: DEFAULT_SOURCE_WIDTH,
          }, options);
          // Member variables.
          this.scene = scene;
          this.position = options.position;
          this.forward = options.forward;
          this.up = options.up;
          this.dx = create$2();
          this.right = create$2();
          cross(this.right, this.forward, this.up);
          // Create audio nodes.
          let context = scene.context;
          this.input = context.createGain();
          this.directivity = new Directivity(context, {
              alpha: options.alpha,
              sharpness: options.sharpness,
          });
          this.toEarly = context.createGain();
          this.toLate = context.createGain();
          this.attenuation = new Attenuation(context, {
              minDistance: options.minDistance,
              maxDistance: options.maxDistance,
              rolloff: options.rolloff,
          });
          this.encoder = new Encoder(context, {
              ambisonicOrder: scene.ambisonicOrder,
              sourceWidth: options.sourceWidth,
          });
          // Connect nodes.
          this.input.connect(this.toLate);
          this.toLate.connect(scene.room.late.input);
          this.input.connect(this.attenuation.input);
          this.attenuation.output.connect(this.toEarly);
          this.toEarly.connect(scene.room.early.input);
          this.attenuation.output.connect(this.directivity.input);
          this.directivity.output.connect(this.encoder.input);
          this.encoder.output.connect(scene.listener.input);
          // Assign initial conditions.
          this.setPosition(options.position);
          this.input.gain.value = options.gain;
      }
      dispose() {
          this.encoder.output.disconnect(this.scene.listener.input);
          this.directivity.output.disconnect(this.encoder.input);
          this.attenuation.output.disconnect(this.directivity.input);
          this.toEarly.disconnect(this.scene.room.early.input);
          this.attenuation.output.disconnect(this.toEarly);
          this.input.disconnect(this.attenuation.input);
          this.toLate.disconnect(this.scene.room.late.input);
          this.input.disconnect(this.toLate);
          this.encoder.dispose();
      }
      // Update the source when changing the listener's position.
      update() {
          // Compute distance to listener.
          subtract(this.dx, this.position, this.scene.listener.position);
          const distance = length(this.dx);
          normalize(this.dx, this.dx);
          // Compuete angle of direction vector.
          const azimuth = RADIANS_TO_DEGREES * Math.atan2(-this.dx[0], this.dx[2]);
          const elevation = RADIANS_TO_DEGREES * Math.atan2(this.dx[1], Math.sqrt(this.dx[0] * this.dx[0] + this.dx[2] * this.dx[2]));
          // Set distance/directivity/direction values.
          this.attenuation.setDistance(distance);
          this.directivity.computeAngle(this.forward, this.dx);
          this.encoder.setDirection(azimuth, elevation);
      }
      /**
       * Set source's rolloff.
       * @param rolloff
       * Rolloff model to use, chosen from options in
       * {@linkcode ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
       */
      setRolloff(rolloff) {
          this.attenuation.setRolloff(rolloff);
      }
      /**
       * Set source's minimum distance (in meters).
       */
      setMinDistance(minDistance) {
          this.attenuation.minDistance = minDistance;
      }
      /**
       * Set source's maximum distance (in meters).
       */
      setMaxDistance(maxDistance) {
          this.attenuation.maxDistance = maxDistance;
      }
      /**
       * Set source's gain (linear).
       */
      setGain(gain) {
          this.input.gain.value = gain;
      }
      /**
       * Set source's position (in meters), where origin is the center of
       * the room.
       */
      setPosition(v) {
          // Assign new position.
          copy(this.position, v);
          // Handle far-field effect.
          let distance = this.scene.room.getDistanceOutsideRoom(this.position);
          let gain = _computeDistanceOutsideRoom(distance);
          this.toLate.gain.value = gain;
          this.toEarly.gain.value = gain;
          this.update();
      }
      /**
       * Set the source's orientation using forward and up vectors.
       */
      setOrientation(forward, up) {
          copy(this.forward, forward);
          copy(this.up, up);
          cross(this.right, this.forward, this.up);
      }
      /**
       * Set the source width (in degrees). Where 0 degrees is a point source and 360
       * degrees is an omnidirectional source.
       */
      setSourceWidth(sourceWidth) {
          this.encoder.setSourceWidth(sourceWidth);
          this.setPosition(this.position);
      }
      /**
       * Set source's directivity pattern (defined by alpha), where 0 is an
       * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
       * pattern. The sharpness of the pattern is increased exponentially.
       * @param alpha - Determines directivity pattern (0 to 1).
       * @param sharpness - Determines the sharpness of the directivity pattern (1 to Inf).
       */
      setDirectivityPattern(alpha, sharpness) {
          this.directivity.setPattern(alpha, sharpness);
          this.setPosition(this.position);
      }
  }

  /**
   * @license
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * Main class for managing sources, room and listener models.
   */
  class ResonanceAudio {
      /**
       * Main class for managing sources, room and listener models.
       * @param context
       * Associated {@link
      https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
       * @param options
       * Options for constructing a new ResonanceAudio scene.
       */
      constructor(context, options) {
          // Use defaults for undefined arguments.
          options = Object.assign({
              ambisonicOrder: DEFAULT_AMBISONIC_ORDER,
              listenerPosition: copy(create$2(), DEFAULT_POSITION),
              listenerForward: copy(create$2(), DEFAULT_FORWARD),
              listenerUp: copy(create$2(), DEFAULT_UP),
              dimensions: Object.assign({}, options.dimensions, DEFAULT_ROOM_DIMENSIONS),
              materials: Object.assign({}, options.materials, DEFAULT_ROOM_MATERIALS),
              speedOfSound: DEFAULT_SPEED_OF_SOUND,
              renderingMode: DEFAULT_RENDERING_MODE
          }, options);
          // Create member submodules.
          this.ambisonicOrder = Encoder.validateAmbisonicOrder(options.ambisonicOrder);
          this._sources = new Array();
          this.room = new Room(context, {
              listenerPosition: options.listenerPosition,
              dimensions: options.dimensions,
              materials: options.materials,
              speedOfSound: options.speedOfSound,
          });
          this.listener = new Listener(context, {
              ambisonicOrder: options.ambisonicOrder,
              position: options.listenerPosition,
              forward: options.listenerForward,
              up: options.listenerUp,
              renderingMode: options.renderingMode
          });
          // Create auxillary audio nodes.
          this.context = context;
          this.output = context.createGain();
          this.ambisonicOutput = context.createGain();
          this.ambisonicInput = this.listener.input;
          // Connect audio graph.
          this.room.output.connect(this.listener.input);
          this.listener.output.connect(this.output);
          this.listener.ambisonicOutput.connect(this.ambisonicOutput);
      }
      getRenderingMode() {
          return this.listener.getRenderingMode();
      }
      setRenderingMode(mode) {
          this.listener.setRenderingMode(mode);
      }
      dispose() {
          this.room.output.disconnect(this.listener.input);
          this.listener.output.disconnect(this.output);
          this.listener.ambisonicOutput.disconnect(this.ambisonicOutput);
      }
      /**
       * Create a new source for the scene.
       * @param options
       * Options for constructing a new Source.
       * @return {Source}
       */
      createSource(options) {
          // Create a source and push it to the internal sources array, returning
          // the object's reference to the user.
          let source = new Source(this, options);
          this._sources[this._sources.length] = source;
          return source;
      }
      /**
       * Remove an existing source for the scene.
       * @param source
       */
      removeSource(source) {
          const sourceIdx = this._sources.findIndex((s) => s === source);
          if (sourceIdx > -1) {
              this._sources.splice(sourceIdx, 1);
              source.dispose();
          }
      }
      /**
       * Set the scene's desired ambisonic order.
       * @param ambisonicOrder Desired ambisonic order.
       */
      setAmbisonicOrder(ambisonicOrder) {
          this.ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);
      }
      /**
       * Set the room's dimensions and wall materials.
       * @param dimensions Room dimensions (in meters).
       * @param materials Named acoustic materials per wall.
       */
      setRoomProperties(dimensions, materials) {
          this.room.setProperties(dimensions, materials);
      }
      /**
       * Set the listener's position (in meters), where origin is the center of
       * the room.
       */
      setListenerPosition(v) {
          // Update listener position.
          copy(this.listener.position, v);
          this.room.setListenerPosition(v);
          // Update sources with new listener position.
          this._sources.forEach(function (element) {
              element.update();
          });
      }
      /**
       * Set the source's orientation using forward and up vectors.
       */
      setListenerOrientation(forward, up) {
          this.listener.setOrientation(forward, up);
      }
      /**
       * Set the speed of sound.
       */
      setSpeedOfSound(speedOfSound) {
          this.room.speedOfSound = speedOfSound;
      }
  }

  class BaseWebAudioNode extends BaseNode {
      /**
       * Creates a spatializer that keeps track of the relative position
       * of an audio element to the listener destination.
       * @param id
       * @param stream
       * @param audioContext - the output WebAudio context
       * @param node - this node out to which to pipe the stream
       */
      constructor(id, source, audioContext, node) {
          super(id, source, audioContext);
          this.node = node;
          this.gain.connect(this.node);
      }
      /**
       * Discard values and make this instance useless.
       */
      dispose() {
          if (this.node) {
              this.node.disconnect();
              this.node = null;
          }
          super.dispose();
      }
  }

  /**
   * A spatializer that uses Google's Resonance Audio library.
   **/
  class ResonanceAudioNode extends BaseWebAudioNode {
      /**
       * Creates a new spatializer that uses Google's Resonance Audio library.
       */
      constructor(id, source, audioContext, res) {
          const resNode = res.createSource(undefined);
          super(id, source, audioContext, resNode.input);
          this.resScene = res;
          this.resNode = resNode;
          Object.seal(this);
      }
      /**
       * Performs the spatialization operation for the audio source's latest location.
       */
      update(loc, _t) {
          const { p, f, u } = loc;
          this.resNode.setPosition(p);
          this.resNode.setOrientation(f, u);
      }
      /**
       * Sets parameters that alter spatialization.
       **/
      setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
          super.setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime);
          this.resNode.setMinDistance(this.minDistance);
          this.resNode.setMaxDistance(this.maxDistance);
          this.resNode.setGain(1 / this.rolloff);
          this.resNode.setRolloff(this.algorithm);
      }
      /**
       * Discard values and make this instance useless.
       */
      dispose() {
          this.resScene.removeSource(this.resNode);
          this.resNode = null;
          super.dispose();
      }
  }

  /**
   * An audio positioner that uses Google's Resonance Audio library
   **/
  class ResonanceAudioListener extends BaseListener {
      /**
       * Creates a new audio positioner that uses Google's Resonance Audio library
       */
      constructor(audioContext, destination) {
          super(audioContext, destination);
          this.scene = new ResonanceAudio(audioContext, {
              ambisonicOrder: 1,
              renderingMode: RenderingMode.Bypass
          });
          this.scene.output.connect(this.gain);
          this.scene.setRoomProperties({
              width: 10,
              height: 5,
              depth: 10,
          }, {
              [Direction$1.Left]: Material.Transparent,
              [Direction$1.Right]: Material.Transparent,
              [Direction$1.Front]: Material.Transparent,
              [Direction$1.Back]: Material.Transparent,
              [Direction$1.Down]: Material.Grass,
              [Direction$1.Up]: Material.Transparent,
          });
          Object.seal(this);
      }
      /**
       * Performs the spatialization operation for the audio source's latest location.
       */
      update(loc, _t) {
          const { p, f, u } = loc;
          this.scene.setListenerPosition(p);
          this.scene.setListenerOrientation(f, u);
      }
      /**
       * Creates a spatialzer for an audio source.
       */
      createSpatializer(id, source, spatialize, audioContext) {
          if (spatialize) {
              return new ResonanceAudioNode(id, source, audioContext, this.scene);
          }
          else {
              return super.createSpatializer(id, source, spatialize, audioContext);
          }
      }
  }

  const delta$1 = create$2();
  class VolumeScalingNode extends BaseNode {
      /**
       * Creates a new spatializer that performs no panning, only distance-based volume scaling
       */
      constructor(id, source, audioContext, destination, listener) {
          super(id, source, audioContext);
          this.listener = listener;
          this.gain.connect(destination);
          Object.seal(this);
      }
      update(loc, t) {
          const p = this.listener.pose.p;
          sub(delta$1, p, loc.p);
          const distance = length(delta$1);
          let range = clamp(project(distance, this.minDistance, this.maxDistance), 0, 1);
          if (this.algorithm === "logarithmic") {
              range = Math.sqrt(range);
          }
          const volume = 1 - range;
          this.gain.gain.setValueAtTime(volume, t);
      }
  }

  /**
   * A positioner that uses WebAudio's gain nodes to only adjust volume.
   **/
  class VolumeScalingListener extends BaseListener {
      /**
       * Creates a new positioner that uses WebAudio's playback dependent time progression.
       */
      constructor(audioContext, destination) {
          super(audioContext, destination);
          this.pose = null;
          this.gain.gain.value = 0.25;
          Object.seal(this);
      }
      /**
       * Performs the spatialization operation for the audio source's latest location.
       */
      update(loc, _t) {
          this.pose = loc;
      }
      /**
       * Creates a spatialzer for an audio source.
       */
      createSpatializer(id, source, spatialize, audioContext) {
          if (spatialize) {
              return new VolumeScalingNode(id, source, audioContext, this.gain, this);
          }
          else {
              return super.createSpatializer(id, source, spatialize, audioContext);
          }
      }
  }

  /**
   * Base class for spatializers that uses WebAudio's PannerNode
   **/
  class BaseWebAudioPanner extends BaseWebAudioNode {
      /**
       * Creates a new spatializer that uses WebAudio's PannerNode.
       * @param id
       * @param stream
       * @param audioContext - the output WebAudio context
       */
      constructor(id, source, audioContext, destination) {
          const panner = audioContext.createPanner();
          super(id, source, audioContext, panner);
          this.node.panningModel = "HRTF";
          this.node.distanceModel = "inverse";
          this.node.coneInnerAngle = 360;
          this.node.coneOuterAngle = 0;
          this.node.coneOuterGain = 0;
          this.node.connect(destination);
      }
      /**
       * Sets parameters that alter spatialization.
       **/
      setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
          super.setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime);
          this.node.refDistance = this.minDistance;
          if (this.algorithm === "logarithmic") {
              algorithm = "inverse";
          }
          this.node.distanceModel = algorithm;
          this.node.rolloffFactor = this.rolloff;
      }
  }

  /**
   * A positioner that uses WebAudio's playback dependent time progression.
   **/
  class WebAudioPannerNew extends BaseWebAudioPanner {
      /**
       * Creates a new positioner that uses WebAudio's playback dependent time progression.
       */
      constructor(id, source, audioContext, destination) {
          super(id, source, audioContext, destination);
          Object.seal(this);
      }
      /**
       * Performs the spatialization operation for the audio source's latest location.
       */
      update(loc, t) {
          const { p, f } = loc;
          this.node.positionX.setValueAtTime(p[0], t);
          this.node.positionY.setValueAtTime(p[1], t);
          this.node.positionZ.setValueAtTime(p[2], t);
          this.node.orientationX.setValueAtTime(-f[0], t);
          this.node.orientationY.setValueAtTime(-f[1], t);
          this.node.orientationZ.setValueAtTime(-f[2], t);
      }
  }

  /**
   * A positioner that uses WebAudio's playback dependent time progression.
   **/
  class WebAudioListenerNew extends BaseWebAudioListener {
      /**
       * Creates a new positioner that uses WebAudio's playback dependent time progression.
       */
      constructor(audioContext, destination) {
          super(audioContext, destination);
          Object.seal(this);
      }
      /**
       * Performs the spatialization operation for the audio source's latest location.
       */
      update(loc, t) {
          const { p, f, u } = loc;
          this.node.positionX.setValueAtTime(p[0], t);
          this.node.positionY.setValueAtTime(p[1], t);
          this.node.positionZ.setValueAtTime(p[2], t);
          this.node.forwardX.setValueAtTime(f[0], t);
          this.node.forwardY.setValueAtTime(f[1], t);
          this.node.forwardZ.setValueAtTime(f[2], t);
          this.node.upX.setValueAtTime(u[0], t);
          this.node.upY.setValueAtTime(u[1], t);
          this.node.upZ.setValueAtTime(u[2], t);
      }
      /**
       * Creates a spatialzer for an audio source.
       */
      createSpatializer(id, source, spatialize, audioContext) {
          if (spatialize) {
              return new WebAudioPannerNew(id, source, audioContext, this.gain);
          }
          else {
              return super.createSpatializer(id, source, spatialize, audioContext);
          }
      }
  }

  /**
   * A positioner that uses the WebAudio API's old setPosition method.
   **/
  class WebAudioPannerOld extends BaseWebAudioPanner {
      /**
       * Creates a new positioner that uses the WebAudio API's old setPosition method.
       */
      constructor(id, source, audioContext, destination) {
          super(id, source, audioContext, destination);
          Object.seal(this);
      }
      /**
       * Performs the spatialization operation for the audio source's latest location.
       */
      update(loc, _t) {
          const { p, f } = loc;
          this.node.setPosition(p[0], p[1], p[2]);
          this.node.setOrientation(f[0], f[1], f[2]);
      }
  }

  /**
   * A positioner that uses WebAudio's playback dependent time progression.
   **/
  class WebAudioListenerOld extends BaseWebAudioListener {
      /**
       * Creates a new positioner that uses WebAudio's playback dependent time progression.
       */
      constructor(audioContext, destination) {
          super(audioContext, destination);
          Object.seal(this);
      }
      /**
       * Performs the spatialization operation for the audio source's latest location.
       */
      update(loc, _t) {
          const { p, f, u } = loc;
          this.node.setPosition(p[0], p[1], p[2]);
          this.node.setOrientation(f[0], f[1], f[2], u[0], u[1], u[2]);
      }
      /**
       * Creates a spatialzer for an audio source.
       */
      createSpatializer(id, source, spatialize, audioContext) {
          if (spatialize) {
              return new WebAudioPannerOld(id, source, audioContext, this.gain);
          }
          else {
              return super.createSpatializer(id, source, spatialize, audioContext);
          }
      }
  }

  /**
   * An Event class for tracking changes to audio activity.
   **/
  class AudioActivityEvent extends Event {
      /** Creates a new "audioActivity" event */
      constructor() {
          super("audioActivity");
          this.id = null;
          this.isActive = false;
          Object.seal(this);
      }
      /**
       * Sets the current state of the event
       * @param id - the user for which the activity changed
       * @param isActive - the new state of the activity
       */
      set(id, isActive) {
          this.id = id;
          this.isActive = isActive;
      }
  }

  const audioActivityEvt = new AudioActivityEvent();
  const activityCounterMin = 0;
  const activityCounterMax = 60;
  const activityCounterThresh = 5;
  function frequencyToIndex(frequency, sampleRate, bufferSize) {
      const nyquist = sampleRate / 2;
      const index = Math.round(frequency / nyquist * bufferSize);
      return clamp(index, 0, bufferSize);
  }
  function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz, bufferSize) {
      const sampleRate = analyser.context.sampleRate, start = frequencyToIndex(minHz, sampleRate, bufferSize), end = frequencyToIndex(maxHz, sampleRate, bufferSize), count = end - start;
      let sum = 0;
      for (let i = start; i < end; ++i) {
          sum += frequencies[i];
      }
      return count === 0 ? 0 : (sum / count);
  }
  class ActivityAnalyser extends TypedEventBase {
      constructor(source, audioContext, bufferSize) {
          super();
          this.wasActive = false;
          this.analyser = null;
          if (!isGoodNumber(bufferSize)
              || bufferSize <= 0) {
              throw new Error("Buffer size must be greater than 0");
          }
          this.id = source.id;
          this.bufferSize = bufferSize;
          this.buffer = new Float32Array(this.bufferSize);
          this.wasActive = false;
          this.activityCounter = 0;
          const checkSource = () => {
              if (source.spatializer instanceof BaseNode
                  && source.spatializer.source) {
                  this.analyser = audioContext.createAnalyser();
                  this.analyser.fftSize = 2 * this.bufferSize;
                  this.analyser.smoothingTimeConstant = 0.2;
                  source.spatializer.source.connect(this.analyser);
              }
              else {
                  setTimeout(checkSource, 0);
              }
          };
          checkSource();
      }
      dispose() {
          if (this.analyser) {
              this.analyser.disconnect();
              this.analyser = null;
          }
          this.buffer = null;
      }
      update() {
          if (this.analyser) {
              this.analyser.getFloatFrequencyData(this.buffer);
              const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255, this.bufferSize) / 100;
              if (average >= 0.5 && this.activityCounter < activityCounterMax) {
                  this.activityCounter++;
              }
              else if (average < 0.5 && this.activityCounter > activityCounterMin) {
                  this.activityCounter--;
              }
              const isActive = this.activityCounter > activityCounterThresh;
              if (this.wasActive !== isActive) {
                  this.wasActive = isActive;
                  audioActivityEvt.id = this.id;
                  audioActivityEvt.isActive = isActive;
                  this.dispatchEvent(audioActivityEvt);
              }
          }
      }
  }

  class AudioSource {
      constructor(id) {
          this.id = id;
          this.pose = new InterpolatedPose();
          this.streams = new Map();
          this._spatializer = null;
      }
      get spatializer() {
          return this._spatializer;
      }
      set spatializer(v) {
          if (this.spatializer !== v) {
              if (this._spatializer) {
                  this._spatializer.dispose();
              }
              this._spatializer = v;
          }
      }
      dispose() {
          this.spatializer = null;
      }
      /**
       * Update the user.
       * @param t - the current update time.
       */
      update(t) {
          this.pose.update(t);
          if (this.spatializer) {
              this.spatializer.update(this.pose.current, t);
          }
      }
  }

  /**
   * Indicates whether or not the current browser can change the destination device for audio output.
   **/
  const canChangeAudioOutput = isFunction(HTMLAudioElement.prototype.setSinkId);

  if (!("AudioContext" in globalThis) && "webkitAudioContext" in globalThis) {
      globalThis.AudioContext = globalThis.webkitAudioContext;
  }
  if (!("OfflineAudioContext" in globalThis) && "webkitOfflineAudioContext" in globalThis) {
      globalThis.OfflineAudioContext = globalThis.webkitOfflineAudioContext;
  }
  const BUFFER_SIZE = 1024;
  const audioActivityEvt$1 = new AudioActivityEvent();
  const audioReadyEvt = new Event("audioready");
  const testAudio = Audio();
  const useTrackSource = "createMediaStreamTrackSource" in AudioContext.prototype;
  const useElementSource = !useTrackSource && !("createMediaStreamSource" in AudioContext.prototype);
  const audioTypes = new Map([
      ["wav", ["audio/wav", "audio/vnd.wave", "audio/wave", "audio/x-wav"]],
      ["mp3", ["audio/mpeg"]],
      ["m4a", ["audio/mp4"]],
      ["m4b", ["audio/mp4"]],
      ["3gp", ["audio/mp4"]],
      ["3g2", ["audio/mp4"]],
      ["aac", ["audio/aac", "audio/aacp"]],
      ["oga", ["audio/ogg"]],
      ["ogg", ["audio/ogg"]],
      ["spx", ["audio/ogg"]],
      ["webm", ["audio/webm"]],
      ["flac", ["audio/flac"]]
  ]);
  function shouldTry(path) {
      const idx = path.lastIndexOf(".");
      if (idx > -1) {
          const ext = path.substring(idx + 1);
          if (audioTypes.has(ext)) {
              for (const type of audioTypes.get(ext)) {
                  if (testAudio.canPlayType(type)) {
                      return true;
                  }
              }
              return false;
          }
      }
      return true;
  }
  let hasAudioContext = "AudioContext" in globalThis;
  let hasAudioListener = "AudioListener" in globalThis;
  let hasOldAudioListener = hasAudioListener && "setPosition" in AudioListener.prototype;
  let hasNewAudioListener = hasAudioListener && "positionX" in AudioListener.prototype;
  let attemptResonanceAPI = hasAudioListener;
  var SpatializerType;
  (function (SpatializerType) {
      SpatializerType["Low"] = "volumescale";
      SpatializerType["Medium"] = "webaudiopanner";
      SpatializerType["High"] = "resonance";
  })(SpatializerType || (SpatializerType = {}));
  /**
   * A manager of audio sources, destinations, and their spatialization.
   **/
  class AudioManager extends TypedEventBase {
      /**
       * Creates a new manager of audio sources, destinations, and their spatialization.
       **/
      constructor(type, getBlob) {
          super();
          this.type = type;
          this.getBlob = getBlob;
          this.minDistance = 1;
          this.maxDistance = 10;
          this.rolloff = 1;
          this.algorithm = "logarithmic";
          this.transitionTime = 0.5;
          this._offsetRadius = 0;
          this.clips = new Map();
          this.users = new Map();
          this.analysers = new Map();
          this.sortedUserIDs = new Array();
          this.localUserID = null;
          this.listener = null;
          this.audioContext = null;
          this.element = null;
          this.destination = null;
          this._audioOutputDeviceID = null;
          this.onAudioActivity = (evt) => {
              audioActivityEvt$1.id = evt.id;
              audioActivityEvt$1.isActive = evt.isActive;
              this.dispatchEvent(audioActivityEvt$1);
          };
          this.createContext();
          Object.seal(this);
      }
      get offsetRadius() {
          return this._offsetRadius;
      }
      set offsetRadius(v) {
          this._offsetRadius = v;
          this.updateUserOffsets();
      }
      addEventListener(type, callback, options = null) {
          if (type === audioReadyEvt.type
              && this.ready) {
              callback(audioReadyEvt);
          }
          else {
              super.addEventListener(type, callback, options);
          }
      }
      get ready() {
          return this.audioContext && this.audioContext.state === "running";
      }
      /**
       * Perform the audio system initialization, after a user gesture
       **/
      async start() {
          await this.audioContext.resume();
          await this.setAudioOutputDeviceID(this._audioOutputDeviceID);
          if (this.element) {
              await this.element.play();
          }
      }
      update() {
          if (this.audioContext) {
              const t = this.currentTime;
              for (const clip of this.clips.values()) {
                  clip.update(t);
              }
              for (const user of this.users.values()) {
                  user.update(t);
              }
              for (const analyser of this.analysers.values()) {
                  analyser.update();
              }
          }
      }
      /**
       * If no audio context is currently available, creates one, and initializes the
       * spatialization of its listener.
       *
       * If WebAudio isn't available, a mock audio context is created that provides
       * ersatz playback timing.
       **/
      createContext() {
          if (!this.audioContext) {
              this.audioContext = new AudioContext();
              if (canChangeAudioOutput) {
                  this.destination = this.audioContext.createMediaStreamDestination();
                  this.element = Audio(playsInline, autoPlay, srcObject(this.destination.stream), styles(display("none")));
                  document.body.appendChild(this.element);
              }
              else {
                  this.destination = this.audioContext.destination;
              }
              // These checks are done in an arcane way because it makes the fallback logic
              // for each step self-contained. It's easier to look at a single step and determine
              // wether or not it is correct, without having to look at previous blocks of code.
              if (this.type === SpatializerType.High) {
                  if (hasAudioContext && hasAudioListener && attemptResonanceAPI) {
                      try {
                          this.listener = new ResonanceAudioListener(this.audioContext, this.destination);
                      }
                      catch (exp) {
                          attemptResonanceAPI = false;
                          this.type = SpatializerType.Medium;
                          console.warn("Resonance Audio API not available!", exp);
                      }
                  }
                  else {
                      this.type = SpatializerType.Medium;
                  }
              }
              if (this.type === SpatializerType.Medium) {
                  if (hasAudioContext && hasAudioListener) {
                      if (hasNewAudioListener) {
                          try {
                              this.listener = new WebAudioListenerNew(this.audioContext, this.destination);
                          }
                          catch (exp) {
                              hasNewAudioListener = false;
                              console.warn("No AudioListener.positionX property!", exp);
                          }
                      }
                      if (!hasNewAudioListener && hasOldAudioListener) {
                          try {
                              this.listener = new WebAudioListenerOld(this.audioContext, this.destination);
                          }
                          catch (exp) {
                              hasOldAudioListener = false;
                              console.warn("No WebAudio API!", exp);
                          }
                      }
                      if (!hasNewAudioListener && !hasOldAudioListener) {
                          this.type = SpatializerType.Low;
                          hasAudioListener = false;
                      }
                  }
                  else {
                      this.type = SpatializerType.Low;
                  }
              }
              if (this.type === SpatializerType.Low) {
                  this.listener = new VolumeScalingListener(this.audioContext, this.destination);
              }
              if (this.listener === null) {
                  throw new Error("Calla requires a functioning WebAudio system.");
              }
              if (this.ready) {
                  this.start();
                  this.dispatchEvent(audioReadyEvt);
              }
              else {
                  onUserGesture(() => this.dispatchEvent(audioReadyEvt), async () => {
                      await this.start();
                      return this.ready;
                  });
              }
          }
      }
      getAudioOutputDeviceID() {
          return this.element?.sinkId;
      }
      async setAudioOutputDeviceID(deviceID) {
          this._audioOutputDeviceID = deviceID || "";
          if (this.element
              && this._audioOutputDeviceID !== this.element.sinkId) {
              await this.element.setSinkId(this._audioOutputDeviceID);
          }
      }
      /**
       * Creates a spatialzer for an audio source.
       * @param id
       * @param source - the audio element that is being spatialized.
       * @param spatialize - whether or not the audio stream should be spatialized. Stereo audio streams that are spatialized will get down-mixed to a single channel.
       */
      createSpatializer(id, source, spatialize) {
          if (!this.listener) {
              throw new Error("Audio context isn't ready");
          }
          return this.listener.createSpatializer(id, source, spatialize, this.audioContext);
      }
      /**
       * Gets the current playback time.
       */
      get currentTime() {
          return this.audioContext.currentTime;
      }
      /**
       * Create a new user for audio processing.
       */
      createUser(id) {
          let user = this.users.get(id);
          if (!user) {
              user = new AudioSource(id);
              this.users.set(id, user);
              arraySortedInsert(this.sortedUserIDs, id);
              this.updateUserOffsets();
          }
          return user;
      }
      /**
       * Create a new user for the audio listener.
       */
      createLocalUser(id) {
          this.localUserID = id;
          let oldID = null;
          let user = null;
          for (const entry of this.users.entries()) {
              if (entry[1].spatializer === this.listener) {
                  [oldID, user] = entry;
                  break;
              }
          }
          if (user) {
              this.users.delete(oldID);
              arrayRemove(this.sortedUserIDs, oldID);
              this.users.set(id, user);
              arraySortedInsert(this.sortedUserIDs, id);
              this.updateUserOffsets();
          }
          else {
              user = this.createUser(id);
              user.spatializer = this.listener;
          }
          return user;
      }
      /**
       * Creates a new sound effect from a series of fallback paths
       * for media files.
       * @param name - the name of the sound effect, to reference when executing playback.
       * @param looping - whether or not the sound effect should be played on loop.
       * @param autoPlaying - whether or not the sound effect should be played immediately.
       * @param spatialize - whether or not the sound effect should be spatialized.
       * @param vol - the volume at which to set the clip.
       * @param path - a path for loading the media of the sound effect.
       * @param onProgress - an optional callback function to use for tracking progress of loading the clip.
       */
      async createClip(name, looping, autoPlaying, spatialize, vol, path, onProgress) {
          if (path == null || path.length === 0) {
              throw new Error("No clip source path provided");
          }
          let goodBlob = null;
          if (!shouldTry(path)) {
              if (onProgress) {
                  onProgress(1, 1, "skip");
              }
          }
          else {
              const blob = await this.getBlob(path, onProgress);
              if (testAudio.canPlayType(blob.type)) {
                  goodBlob = blob;
              }
          }
          if (!goodBlob) {
              throw new Error("Cannot play file: " + path);
          }
          const buffer = await goodBlob.arrayBuffer();
          const data = await this.audioContext.decodeAudioData(buffer);
          const source = this.audioContext.createBufferSource();
          source.buffer = data;
          source.loop = looping;
          const clip = new AudioSource("audio-clip-" + name);
          clip.spatializer = this.createSpatializer(name, source, spatialize);
          clip.spatializer.volume = vol;
          if (autoPlaying) {
              clip.spatializer.play();
          }
          this.clips.set(name, clip);
          return clip;
      }
      hasClip(name) {
          return this.clips.has(name);
      }
      /**
       * Plays a named sound effect.
       * @param name - the name of the effect to play.
       */
      async playClip(name) {
          if (this.ready && this.hasClip(name)) {
              const clip = this.clips.get(name);
              await clip.spatializer.play();
          }
      }
      stopClip(name) {
          if (this.ready && this.hasClip(name)) {
              const clip = this.clips.get(name);
              clip.spatializer.stop();
          }
      }
      /**
       * Get an audio source.
       * @param sources - the collection of audio sources from which to retrieve.
       * @param id - the id of the audio source to get
       **/
      getSource(sources, id) {
          return sources.get(id) || null;
      }
      /**
       * Get an existing user.
       */
      getUser(id) {
          return this.getSource(this.users, id);
      }
      /**
       * Get an existing audio clip.
       */
      getClip(id) {
          return this.getSource(this.clips, id);
      }
      /**
       * Remove an audio source from audio processing.
       * @param sources - the collection of audio sources from which to remove.
       * @param id - the id of the audio source to remove
       **/
      removeSource(sources, id) {
          if (sources.has(id)) {
              using(sources.get(id), (source) => {
                  if (source.spatializer) {
                      source.spatializer.stop();
                  }
                  sources.delete(id);
              });
          }
      }
      /**
       * Remove a user from audio processing.
       **/
      removeUser(id) {
          this.removeSource(this.users, id);
          arrayRemove(this.sortedUserIDs, id);
          this.updateUserOffsets();
      }
      /**
       * Remove an audio clip from audio processing.
       **/
      removeClip(id) {
          this.removeSource(this.clips, id);
      }
      createSourceFromStream(stream) {
          if (useTrackSource) {
              const tracks = stream.getAudioTracks()
                  .map((track) => this.audioContext.createMediaStreamTrackSource(track));
              if (tracks.length === 0) {
                  throw new Error("No audio tracks!");
              }
              else if (tracks.length === 1) {
                  return tracks[0];
              }
              else {
                  const merger = this.audioContext.createChannelMerger(tracks.length);
                  for (const track of tracks) {
                      track.connect(merger);
                  }
                  return merger;
              }
          }
          else {
              const elem = Audio(playsInline(true), autoPlay(true), muted(!useElementSource), controls(false), styles(display("none")), srcObject(stream));
              document.body.appendChild(elem);
              elem.play();
              if (useElementSource) {
                  return this.audioContext.createMediaElementSource(elem);
              }
              else {
                  return this.audioContext.createMediaStreamSource(stream);
              }
          }
      }
      async setUserStream(id, stream) {
          if (this.users.has(id)) {
              if (this.analysers.has(id)) {
                  using(this.analysers.get(id), (analyser) => {
                      this.analysers.delete(id);
                      analyser.removeEventListener("audioActivity", this.onAudioActivity);
                  });
              }
              const user = this.users.get(id);
              user.spatializer = null;
              if (stream) {
                  await waitFor(() => stream.active);
                  const source = this.createSourceFromStream(stream);
                  user.spatializer = this.createSpatializer(id, source, true);
                  user.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.algorithm, this.transitionTime);
                  const analyser = new ActivityAnalyser(user, this.audioContext, BUFFER_SIZE);
                  analyser.addEventListener("audioActivity", this.onAudioActivity);
                  this.analysers.set(id, analyser);
              }
          }
      }
      updateUserOffsets() {
          if (this.offsetRadius > 0) {
              const idx = this.sortedUserIDs.indexOf(this.localUserID);
              const dAngle = 2 * Math.PI / this.sortedUserIDs.length;
              const localAngle = (idx + 1) * dAngle;
              const dx = this.offsetRadius * Math.sin(localAngle);
              const dy = this.offsetRadius * (Math.cos(localAngle) - 1);
              for (let i = 0; i < this.sortedUserIDs.length; ++i) {
                  const id = this.sortedUserIDs[i];
                  const angle = (i + 1) * dAngle;
                  const x = this.offsetRadius * Math.sin(angle) - dx;
                  const z = this.offsetRadius * (Math.cos(angle) - 1) - dy;
                  this.setUserOffset(id, x, 0, z);
              }
          }
      }
      /**
       * Sets parameters that alter spatialization.
       **/
      setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
          this.minDistance = minDistance;
          this.maxDistance = maxDistance;
          this.transitionTime = transitionTime;
          this.rolloff = rolloff;
          this.algorithm = algorithm;
          for (const user of this.users.values()) {
              if (user.spatializer) {
                  user.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.algorithm, this.transitionTime);
              }
          }
      }
      /**
       * Get a pose, normalize the transition time, and perform on operation on it, if it exists.
       * @param sources - the collection of poses from which to retrieve the pose.
       * @param id - the id of the pose for which to perform the operation.
       * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
       * @param poseCallback
       */
      withPose(sources, id, dt, poseCallback) {
          if (sources.has(id)) {
              const source = sources.get(id);
              const pose = source.pose;
              if (dt == null) {
                  dt = this.transitionTime;
              }
              return poseCallback(pose, dt);
          }
          return null;
      }
      /**
       * Get a user pose, normalize the transition time, and perform on operation on it, if it exists.
       * @param id - the id of the user for which to perform the operation.
       * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
       * @param poseCallback
       */
      withUser(id, dt, poseCallback) {
          return this.withPose(this.users, id, dt, poseCallback);
      }
      /**
       * Set the comfort position offset for a given user.
       * @param id - the id of the user for which to set the offset.
       * @param x - the horizontal component of the offset.
       * @param y - the vertical component of the offset.
       * @param z - the lateral component of the offset.
       */
      setUserOffset(id, x, y, z) {
          this.withUser(id, null, (pose) => {
              pose.setOffset(x, y, z);
          });
      }
      /**
       * Get the comfort position offset for a given user.
       * @param id - the id of the user for which to set the offset.
       */
      getUserOffset(id) {
          return this.withUser(id, null, (pose) => {
              return pose.offset;
          });
      }
      /**
       * Set the position and orientation of a user.
       * @param id - the id of the user for which to set the position.
       * @param px - the horizontal component of the position.
       * @param py - the vertical component of the position.
       * @param pz - the lateral component of the position.
       * @param fx - the horizontal component of the forward vector.
       * @param fy - the vertical component of the forward vector.
       * @param fz - the lateral component of the forward vector.
       * @param ux - the horizontal component of the up vector.
       * @param uy - the vertical component of the up vector.
       * @param uz - the lateral component of the up vector.
       * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
       **/
      setUserPose(id, px, py, pz, fx, fy, fz, ux, uy, uz, dt = null) {
          this.withUser(id, dt, (pose, dt) => {
              pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, dt);
          });
      }
      /**
       * Get an audio clip pose, normalize the transition time, and perform on operation on it, if it exists.
       * @param id - the id of the audio clip for which to perform the operation.
       * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
       * @param poseCallback
       */
      withClip(id, dt, poseCallback) {
          return this.withPose(this.clips, id, dt, poseCallback);
      }
      /**
       * Set the position of an audio clip.
       * @param id - the id of the audio clip for which to set the position.
       * @param x - the horizontal component of the position.
       * @param y - the vertical component of the position.
       * @param z - the lateral component of the position.
       * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
       **/
      setClipPosition(id, x, y, z, dt = null) {
          this.withClip(id, dt, (pose, dt) => {
              pose.setTargetPosition(x, y, z, this.currentTime, dt);
          });
      }
      /**
       * Set the orientation of an audio clip.
       * @param id - the id of the audio clip for which to set the position.
       * @param fx - the horizontal component of the forward vector.
       * @param fy - the vertical component of the forward vector.
       * @param fz - the lateral component of the forward vector.
       * @param ux - the horizontal component of the up vector.
       * @param uy - the vertical component of the up vector.
       * @param uz - the lateral component of the up vector.
       * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
       **/
      setClipOrientation(id, fx, fy, fz, ux, uy, uz, dt = null) {
          this.withClip(id, dt, (pose, dt) => {
              pose.setTargetOrientation(fx, fy, fz, ux, uy, uz, this.currentTime, dt);
          });
      }
      /**
       * Set the position and orientation of an audio clip.
       * @param id - the id of the audio clip for which to set the position.
       * @param px - the horizontal component of the position.
       * @param py - the vertical component of the position.
       * @param pz - the lateral component of the position.
       * @param fx - the horizontal component of the forward vector.
       * @param fy - the vertical component of the forward vector.
       * @param fz - the lateral component of the forward vector.
       * @param ux - the horizontal component of the up vector.
       * @param uy - the vertical component of the up vector.
       * @param uz - the lateral component of the up vector.
       * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
       **/
      setClipPose(id, px, py, pz, fx, fy, fz, ux, uy, uz, dt = null) {
          this.withClip(id, dt, (pose, dt) => {
              pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, dt);
          });
      }
  }

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __extends = (undefined && undefined.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  /** Error thrown when an HTTP request fails. */
  var HttpError = /** @class */ (function (_super) {
      __extends(HttpError, _super);
      /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
       *
       * @param {string} errorMessage A descriptive error message.
       * @param {number} statusCode The HTTP status code represented by this error.
       */
      function HttpError(errorMessage, statusCode) {
          var _newTarget = this.constructor;
          var _this = this;
          var trueProto = _newTarget.prototype;
          _this = _super.call(this, errorMessage) || this;
          _this.statusCode = statusCode;
          // Workaround issue in Typescript compiler
          // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
          _this.__proto__ = trueProto;
          return _this;
      }
      return HttpError;
  }(Error));
  /** Error thrown when a timeout elapses. */
  var TimeoutError = /** @class */ (function (_super) {
      __extends(TimeoutError, _super);
      /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
       *
       * @param {string} errorMessage A descriptive error message.
       */
      function TimeoutError(errorMessage) {
          var _newTarget = this.constructor;
          if (errorMessage === void 0) { errorMessage = "A timeout occurred."; }
          var _this = this;
          var trueProto = _newTarget.prototype;
          _this = _super.call(this, errorMessage) || this;
          // Workaround issue in Typescript compiler
          // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
          _this.__proto__ = trueProto;
          return _this;
      }
      return TimeoutError;
  }(Error));
  /** Error thrown when an action is aborted. */
  var AbortError = /** @class */ (function (_super) {
      __extends(AbortError, _super);
      /** Constructs a new instance of {@link AbortError}.
       *
       * @param {string} errorMessage A descriptive error message.
       */
      function AbortError(errorMessage) {
          var _newTarget = this.constructor;
          if (errorMessage === void 0) { errorMessage = "An abort occurred."; }
          var _this = this;
          var trueProto = _newTarget.prototype;
          _this = _super.call(this, errorMessage) || this;
          // Workaround issue in Typescript compiler
          // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
          _this.__proto__ = trueProto;
          return _this;
      }
      return AbortError;
  }(Error));

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  /** Represents an HTTP response. */
  var HttpResponse = /** @class */ (function () {
      function HttpResponse(statusCode, statusText, content) {
          this.statusCode = statusCode;
          this.statusText = statusText;
          this.content = content;
      }
      return HttpResponse;
  }());
  /** Abstraction over an HTTP client.
   *
   * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
   */
  var HttpClient = /** @class */ (function () {
      function HttpClient() {
      }
      HttpClient.prototype.get = function (url, options) {
          return this.send(__assign({}, options, { method: "GET", url: url }));
      };
      HttpClient.prototype.post = function (url, options) {
          return this.send(__assign({}, options, { method: "POST", url: url }));
      };
      HttpClient.prototype.delete = function (url, options) {
          return this.send(__assign({}, options, { method: "DELETE", url: url }));
      };
      /** Gets all cookies that apply to the specified URL.
       *
       * @param url The URL that the cookies are valid for.
       * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
       */
      // @ts-ignore
      HttpClient.prototype.getCookieString = function (url) {
          return "";
      };
      return HttpClient;
  }());

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  // These values are designed to match the ASP.NET Log Levels since that's the pattern we're emulating here.
  /** Indicates the severity of a log message.
   *
   * Log Levels are ordered in increasing severity. So `Debug` is more severe than `Trace`, etc.
   */
  var LogLevel;
  (function (LogLevel) {
      /** Log level for very low severity diagnostic messages. */
      LogLevel[LogLevel["Trace"] = 0] = "Trace";
      /** Log level for low severity diagnostic messages. */
      LogLevel[LogLevel["Debug"] = 1] = "Debug";
      /** Log level for informational diagnostic messages. */
      LogLevel[LogLevel["Information"] = 2] = "Information";
      /** Log level for diagnostic messages that indicate a non-fatal problem. */
      LogLevel[LogLevel["Warning"] = 3] = "Warning";
      /** Log level for diagnostic messages that indicate a failure in the current operation. */
      LogLevel[LogLevel["Error"] = 4] = "Error";
      /** Log level for diagnostic messages that indicate a failure that will terminate the entire application. */
      LogLevel[LogLevel["Critical"] = 5] = "Critical";
      /** The highest possible log level. Used when configuring logging to indicate that no log messages should be emitted. */
      LogLevel[LogLevel["None"] = 6] = "None";
  })(LogLevel || (LogLevel = {}));

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __assign$1 = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  // Version token that will be replaced by the prepack command
  /** The version of the SignalR client. */
  var VERSION = "5.0.1";
  /** @private */
  var Arg = /** @class */ (function () {
      function Arg() {
      }
      Arg.isRequired = function (val, name) {
          if (val === null || val === undefined) {
              throw new Error("The '" + name + "' argument is required.");
          }
      };
      Arg.isNotEmpty = function (val, name) {
          if (!val || val.match(/^\s*$/)) {
              throw new Error("The '" + name + "' argument should not be empty.");
          }
      };
      Arg.isIn = function (val, values, name) {
          // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
          if (!(val in values)) {
              throw new Error("Unknown " + name + " value: " + val + ".");
          }
      };
      return Arg;
  }());
  /** @private */
  var Platform = /** @class */ (function () {
      function Platform() {
      }
      Object.defineProperty(Platform, "isBrowser", {
          get: function () {
              return typeof window === "object";
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Platform, "isWebWorker", {
          get: function () {
              return typeof self === "object" && "importScripts" in self;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(Platform, "isNode", {
          get: function () {
              return !this.isBrowser && !this.isWebWorker;
          },
          enumerable: true,
          configurable: true
      });
      return Platform;
  }());
  /** @private */
  function getDataDetail(data, includeContent) {
      var detail = "";
      if (isArrayBuffer(data)) {
          detail = "Binary data of length " + data.byteLength;
          if (includeContent) {
              detail += ". Content: '" + formatArrayBuffer(data) + "'";
          }
      }
      else if (typeof data === "string") {
          detail = "String data of length " + data.length;
          if (includeContent) {
              detail += ". Content: '" + data + "'";
          }
      }
      return detail;
  }
  /** @private */
  function formatArrayBuffer(data) {
      var view = new Uint8Array(data);
      // Uint8Array.map only supports returning another Uint8Array?
      var str = "";
      view.forEach(function (num) {
          var pad = num < 16 ? "0" : "";
          str += "0x" + pad + num.toString(16) + " ";
      });
      // Trim of trailing space.
      return str.substr(0, str.length - 1);
  }
  // Also in signalr-protocol-msgpack/Utils.ts
  /** @private */
  function isArrayBuffer(val) {
      return val && typeof ArrayBuffer !== "undefined" &&
          (val instanceof ArrayBuffer ||
              // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
              (val.constructor && val.constructor.name === "ArrayBuffer"));
  }
  /** @private */
  function sendMessage(logger, transportName, httpClient, url, accessTokenFactory, content, logMessageContent, withCredentials, defaultHeaders) {
      return __awaiter(this, void 0, void 0, function () {
          var _a, headers, token, _b, name, value, responseType, response;
          return __generator(this, function (_c) {
              switch (_c.label) {
                  case 0:
                      headers = {};
                      if (!accessTokenFactory) return [3 /*break*/, 2];
                      return [4 /*yield*/, accessTokenFactory()];
                  case 1:
                      token = _c.sent();
                      if (token) {
                          headers = (_a = {},
                              _a["Authorization"] = "Bearer " + token,
                              _a);
                      }
                      _c.label = 2;
                  case 2:
                      _b = getUserAgentHeader(), name = _b[0], value = _b[1];
                      headers[name] = value;
                      logger.log(LogLevel.Trace, "(" + transportName + " transport) sending data. " + getDataDetail(content, logMessageContent) + ".");
                      responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
                      return [4 /*yield*/, httpClient.post(url, {
                              content: content,
                              headers: __assign$1({}, headers, defaultHeaders),
                              responseType: responseType,
                              withCredentials: withCredentials,
                          })];
                  case 3:
                      response = _c.sent();
                      logger.log(LogLevel.Trace, "(" + transportName + " transport) request complete. Response status: " + response.statusCode + ".");
                      return [2 /*return*/];
              }
          });
      });
  }
  /** @private */
  var SubjectSubscription = /** @class */ (function () {
      function SubjectSubscription(subject, observer) {
          this.subject = subject;
          this.observer = observer;
      }
      SubjectSubscription.prototype.dispose = function () {
          var index = this.subject.observers.indexOf(this.observer);
          if (index > -1) {
              this.subject.observers.splice(index, 1);
          }
          if (this.subject.observers.length === 0 && this.subject.cancelCallback) {
              this.subject.cancelCallback().catch(function (_) { });
          }
      };
      return SubjectSubscription;
  }());
  /** @private */
  function getUserAgentHeader() {
      var userAgentHeaderName = "X-SignalR-User-Agent";
      if (Platform.isNode) {
          userAgentHeaderName = "User-Agent";
      }
      return [userAgentHeaderName, constructUserAgent(VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
  }
  /** @private */
  function constructUserAgent(version, os, runtime, runtimeVersion) {
      // Microsoft SignalR/[Version] ([Detailed Version]; [Operating System]; [Runtime]; [Runtime Version])
      var userAgent = "Microsoft SignalR/";
      var majorAndMinor = version.split(".");
      userAgent += majorAndMinor[0] + "." + majorAndMinor[1];
      userAgent += " (" + version + "; ";
      if (os && os !== "") {
          userAgent += os + "; ";
      }
      else {
          userAgent += "Unknown OS; ";
      }
      userAgent += "" + runtime;
      if (runtimeVersion) {
          userAgent += "; " + runtimeVersion;
      }
      else {
          userAgent += "; Unknown Runtime Version";
      }
      userAgent += ")";
      return userAgent;
  }
  function getOsName() {
      if (Platform.isNode) {
          switch (process.platform) {
              case "win32":
                  return "Windows NT";
              case "darwin":
                  return "macOS";
              case "linux":
                  return "Linux";
              default:
                  return process.platform;
          }
      }
      else {
          return "";
      }
  }
  function getRuntimeVersion() {
      if (Platform.isNode) {
          return process.versions.node;
      }
      return undefined;
  }
  function getRuntime() {
      if (Platform.isNode) {
          return "NodeJS";
      }
      else {
          return "Browser";
      }
  }

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __extends$1 = (undefined && undefined.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  var __assign$2 = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var FetchHttpClient = /** @class */ (function (_super) {
      __extends$1(FetchHttpClient, _super);
      function FetchHttpClient(logger) {
          var _this = _super.call(this) || this;
          _this.logger = logger;
          if (typeof fetch === "undefined") {
              // In order to ignore the dynamic require in webpack builds we need to do this magic
              // @ts-ignore: TS doesn't know about these names
              var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
              // Cookies aren't automatically handled in Node so we need to add a CookieJar to preserve cookies across requests
              _this.jar = new (requireFunc("tough-cookie")).CookieJar();
              _this.fetchType = requireFunc("node-fetch");
              // node-fetch doesn't have a nice API for getting and setting cookies
              // fetch-cookie will wrap a fetch implementation with a default CookieJar or a provided one
              _this.fetchType = requireFunc("fetch-cookie")(_this.fetchType, _this.jar);
              // Node needs EventListener methods on AbortController which our custom polyfill doesn't provide
              _this.abortControllerType = requireFunc("abort-controller");
          }
          else {
              _this.fetchType = fetch.bind(self);
              _this.abortControllerType = AbortController;
          }
          return _this;
      }
      /** @inheritDoc */
      FetchHttpClient.prototype.send = function (request) {
          return __awaiter$1(this, void 0, void 0, function () {
              var abortController, error, timeoutId, msTimeout, response, e_1, content, payload;
              var _this = this;
              return __generator$1(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          // Check that abort was not signaled before calling send
                          if (request.abortSignal && request.abortSignal.aborted) {
                              throw new AbortError();
                          }
                          if (!request.method) {
                              throw new Error("No method defined.");
                          }
                          if (!request.url) {
                              throw new Error("No url defined.");
                          }
                          abortController = new this.abortControllerType();
                          // Hook our abortSignal into the abort controller
                          if (request.abortSignal) {
                              request.abortSignal.onabort = function () {
                                  abortController.abort();
                                  error = new AbortError();
                              };
                          }
                          timeoutId = null;
                          if (request.timeout) {
                              msTimeout = request.timeout;
                              timeoutId = setTimeout(function () {
                                  abortController.abort();
                                  _this.logger.log(LogLevel.Warning, "Timeout from HTTP request.");
                                  error = new TimeoutError();
                              }, msTimeout);
                          }
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 3, 4, 5]);
                          return [4 /*yield*/, this.fetchType(request.url, {
                                  body: request.content,
                                  cache: "no-cache",
                                  credentials: request.withCredentials === true ? "include" : "same-origin",
                                  headers: __assign$2({ "Content-Type": "text/plain;charset=UTF-8", "X-Requested-With": "XMLHttpRequest" }, request.headers),
                                  method: request.method,
                                  mode: "cors",
                                  redirect: "manual",
                                  signal: abortController.signal,
                              })];
                      case 2:
                          response = _a.sent();
                          return [3 /*break*/, 5];
                      case 3:
                          e_1 = _a.sent();
                          if (error) {
                              throw error;
                          }
                          this.logger.log(LogLevel.Warning, "Error from HTTP request. " + e_1 + ".");
                          throw e_1;
                      case 4:
                          if (timeoutId) {
                              clearTimeout(timeoutId);
                          }
                          if (request.abortSignal) {
                              request.abortSignal.onabort = null;
                          }
                          return [7 /*endfinally*/];
                      case 5:
                          if (!response.ok) {
                              throw new HttpError(response.statusText, response.status);
                          }
                          content = deserializeContent(response, request.responseType);
                          return [4 /*yield*/, content];
                      case 6:
                          payload = _a.sent();
                          return [2 /*return*/, new HttpResponse(response.status, response.statusText, payload)];
                  }
              });
          });
      };
      FetchHttpClient.prototype.getCookieString = function (url) {
          var cookies = "";
          if (Platform.isNode && this.jar) {
              // @ts-ignore: unused variable
              this.jar.getCookies(url, function (e, c) { return cookies = c.join("; "); });
          }
          return cookies;
      };
      return FetchHttpClient;
  }(HttpClient));
  function deserializeContent(response, responseType) {
      var content;
      switch (responseType) {
          case "arraybuffer":
              content = response.arrayBuffer();
              break;
          case "text":
              content = response.text();
              break;
          case "blob":
          case "document":
          case "json":
              throw new Error(responseType + " is not supported.");
          default:
              content = response.text();
              break;
      }
      return content;
  }

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __extends$2 = (undefined && undefined.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  var XhrHttpClient = /** @class */ (function (_super) {
      __extends$2(XhrHttpClient, _super);
      function XhrHttpClient(logger) {
          var _this = _super.call(this) || this;
          _this.logger = logger;
          return _this;
      }
      /** @inheritDoc */
      XhrHttpClient.prototype.send = function (request) {
          var _this = this;
          // Check that abort was not signaled before calling send
          if (request.abortSignal && request.abortSignal.aborted) {
              return Promise.reject(new AbortError());
          }
          if (!request.method) {
              return Promise.reject(new Error("No method defined."));
          }
          if (!request.url) {
              return Promise.reject(new Error("No url defined."));
          }
          return new Promise(function (resolve, reject) {
              var xhr = new XMLHttpRequest();
              xhr.open(request.method, request.url, true);
              xhr.withCredentials = request.withCredentials === undefined ? true : request.withCredentials;
              xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
              // Explicitly setting the Content-Type header for React Native on Android platform.
              xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
              var headers = request.headers;
              if (headers) {
                  Object.keys(headers)
                      .forEach(function (header) {
                      xhr.setRequestHeader(header, headers[header]);
                  });
              }
              if (request.responseType) {
                  xhr.responseType = request.responseType;
              }
              if (request.abortSignal) {
                  request.abortSignal.onabort = function () {
                      xhr.abort();
                      reject(new AbortError());
                  };
              }
              if (request.timeout) {
                  xhr.timeout = request.timeout;
              }
              xhr.onload = function () {
                  if (request.abortSignal) {
                      request.abortSignal.onabort = null;
                  }
                  if (xhr.status >= 200 && xhr.status < 300) {
                      resolve(new HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
                  }
                  else {
                      reject(new HttpError(xhr.statusText, xhr.status));
                  }
              };
              xhr.onerror = function () {
                  _this.logger.log(LogLevel.Warning, "Error from HTTP request. " + xhr.status + ": " + xhr.statusText + ".");
                  reject(new HttpError(xhr.statusText, xhr.status));
              };
              xhr.ontimeout = function () {
                  _this.logger.log(LogLevel.Warning, "Timeout from HTTP request.");
                  reject(new TimeoutError());
              };
              xhr.send(request.content || "");
          });
      };
      return XhrHttpClient;
  }(HttpClient));

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __extends$3 = (undefined && undefined.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  /** Default implementation of {@link @microsoft/signalr.HttpClient}. */
  var DefaultHttpClient = /** @class */ (function (_super) {
      __extends$3(DefaultHttpClient, _super);
      /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
      function DefaultHttpClient(logger) {
          var _this = _super.call(this) || this;
          if (typeof fetch !== "undefined" || Platform.isNode) {
              _this.httpClient = new FetchHttpClient(logger);
          }
          else if (typeof XMLHttpRequest !== "undefined") {
              _this.httpClient = new XhrHttpClient(logger);
          }
          else {
              throw new Error("No usable HttpClient found.");
          }
          return _this;
      }
      /** @inheritDoc */
      DefaultHttpClient.prototype.send = function (request) {
          // Check that abort was not signaled before calling send
          if (request.abortSignal && request.abortSignal.aborted) {
              return Promise.reject(new AbortError());
          }
          if (!request.method) {
              return Promise.reject(new Error("No method defined."));
          }
          if (!request.url) {
              return Promise.reject(new Error("No url defined."));
          }
          return this.httpClient.send(request);
      };
      DefaultHttpClient.prototype.getCookieString = function (url) {
          return this.httpClient.getCookieString(url);
      };
      return DefaultHttpClient;
  }(HttpClient));

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  // Not exported from index
  /** @private */
  var TextMessageFormat = /** @class */ (function () {
      function TextMessageFormat() {
      }
      TextMessageFormat.write = function (output) {
          return "" + output + TextMessageFormat.RecordSeparator;
      };
      TextMessageFormat.parse = function (input) {
          if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
              throw new Error("Message is incomplete.");
          }
          var messages = input.split(TextMessageFormat.RecordSeparator);
          messages.pop();
          return messages;
      };
      TextMessageFormat.RecordSeparatorCode = 0x1e;
      TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);
      return TextMessageFormat;
  }());

  // Copyright (c) .NET Foundation. All rights reserved.
  /** @private */
  var HandshakeProtocol = /** @class */ (function () {
      function HandshakeProtocol() {
      }
      // Handshake request is always JSON
      HandshakeProtocol.prototype.writeHandshakeRequest = function (handshakeRequest) {
          return TextMessageFormat.write(JSON.stringify(handshakeRequest));
      };
      HandshakeProtocol.prototype.parseHandshakeResponse = function (data) {
          var responseMessage;
          var messageData;
          var remainingData;
          if (isArrayBuffer(data) || (typeof Buffer !== "undefined" && data instanceof Buffer)) {
              // Format is binary but still need to read JSON text from handshake response
              var binaryData = new Uint8Array(data);
              var separatorIndex = binaryData.indexOf(TextMessageFormat.RecordSeparatorCode);
              if (separatorIndex === -1) {
                  throw new Error("Message is incomplete.");
              }
              // content before separator is handshake response
              // optional content after is additional messages
              var responseLength = separatorIndex + 1;
              messageData = String.fromCharCode.apply(null, binaryData.slice(0, responseLength));
              remainingData = (binaryData.byteLength > responseLength) ? binaryData.slice(responseLength).buffer : null;
          }
          else {
              var textData = data;
              var separatorIndex = textData.indexOf(TextMessageFormat.RecordSeparator);
              if (separatorIndex === -1) {
                  throw new Error("Message is incomplete.");
              }
              // content before separator is handshake response
              // optional content after is additional messages
              var responseLength = separatorIndex + 1;
              messageData = textData.substring(0, responseLength);
              remainingData = (textData.length > responseLength) ? textData.substring(responseLength) : null;
          }
          // At this point we should have just the single handshake message
          var messages = TextMessageFormat.parse(messageData);
          var response = JSON.parse(messages[0]);
          if (response.type) {
              throw new Error("Expected a handshake response from the server.");
          }
          responseMessage = response;
          // multiple messages could have arrived with handshake
          // return additional data to be parsed as usual, or null if all parsed
          return [remainingData, responseMessage];
      };
      return HandshakeProtocol;
  }());

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  /** Defines the type of a Hub Message. */
  var MessageType;
  (function (MessageType) {
      /** Indicates the message is an Invocation message and implements the {@link @microsoft/signalr.InvocationMessage} interface. */
      MessageType[MessageType["Invocation"] = 1] = "Invocation";
      /** Indicates the message is a StreamItem message and implements the {@link @microsoft/signalr.StreamItemMessage} interface. */
      MessageType[MessageType["StreamItem"] = 2] = "StreamItem";
      /** Indicates the message is a Completion message and implements the {@link @microsoft/signalr.CompletionMessage} interface. */
      MessageType[MessageType["Completion"] = 3] = "Completion";
      /** Indicates the message is a Stream Invocation message and implements the {@link @microsoft/signalr.StreamInvocationMessage} interface. */
      MessageType[MessageType["StreamInvocation"] = 4] = "StreamInvocation";
      /** Indicates the message is a Cancel Invocation message and implements the {@link @microsoft/signalr.CancelInvocationMessage} interface. */
      MessageType[MessageType["CancelInvocation"] = 5] = "CancelInvocation";
      /** Indicates the message is a Ping message and implements the {@link @microsoft/signalr.PingMessage} interface. */
      MessageType[MessageType["Ping"] = 6] = "Ping";
      /** Indicates the message is a Close message and implements the {@link @microsoft/signalr.CloseMessage} interface. */
      MessageType[MessageType["Close"] = 7] = "Close";
  })(MessageType || (MessageType = {}));

  // Copyright (c) .NET Foundation. All rights reserved.
  /** Stream implementation to stream items to the server. */
  var Subject = /** @class */ (function () {
      function Subject() {
          this.observers = [];
      }
      Subject.prototype.next = function (item) {
          for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
              var observer = _a[_i];
              observer.next(item);
          }
      };
      Subject.prototype.error = function (err) {
          for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
              var observer = _a[_i];
              if (observer.error) {
                  observer.error(err);
              }
          }
      };
      Subject.prototype.complete = function () {
          for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
              var observer = _a[_i];
              if (observer.complete) {
                  observer.complete();
              }
          }
      };
      Subject.prototype.subscribe = function (observer) {
          this.observers.push(observer);
          return new SubjectSubscription(this, observer);
      };
      return Subject;
  }());

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  var DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
  var DEFAULT_PING_INTERVAL_IN_MS = 15 * 1000;
  /** Describes the current state of the {@link HubConnection} to the server. */
  var HubConnectionState;
  (function (HubConnectionState) {
      /** The hub connection is disconnected. */
      HubConnectionState["Disconnected"] = "Disconnected";
      /** The hub connection is connecting. */
      HubConnectionState["Connecting"] = "Connecting";
      /** The hub connection is connected. */
      HubConnectionState["Connected"] = "Connected";
      /** The hub connection is disconnecting. */
      HubConnectionState["Disconnecting"] = "Disconnecting";
      /** The hub connection is reconnecting. */
      HubConnectionState["Reconnecting"] = "Reconnecting";
  })(HubConnectionState || (HubConnectionState = {}));
  /** Represents a connection to a SignalR Hub. */
  var HubConnection = /** @class */ (function () {
      function HubConnection(connection, logger, protocol, reconnectPolicy) {
          var _this = this;
          Arg.isRequired(connection, "connection");
          Arg.isRequired(logger, "logger");
          Arg.isRequired(protocol, "protocol");
          this.serverTimeoutInMilliseconds = DEFAULT_TIMEOUT_IN_MS;
          this.keepAliveIntervalInMilliseconds = DEFAULT_PING_INTERVAL_IN_MS;
          this.logger = logger;
          this.protocol = protocol;
          this.connection = connection;
          this.reconnectPolicy = reconnectPolicy;
          this.handshakeProtocol = new HandshakeProtocol();
          this.connection.onreceive = function (data) { return _this.processIncomingData(data); };
          this.connection.onclose = function (error) { return _this.connectionClosed(error); };
          this.callbacks = {};
          this.methods = {};
          this.closedCallbacks = [];
          this.reconnectingCallbacks = [];
          this.reconnectedCallbacks = [];
          this.invocationId = 0;
          this.receivedHandshakeResponse = false;
          this.connectionState = HubConnectionState.Disconnected;
          this.connectionStarted = false;
          this.cachedPingMessage = this.protocol.writeMessage({ type: MessageType.Ping });
      }
      /** @internal */
      // Using a public static factory method means we can have a private constructor and an _internal_
      // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
      // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
      // public parameter-less constructor.
      HubConnection.create = function (connection, logger, protocol, reconnectPolicy) {
          return new HubConnection(connection, logger, protocol, reconnectPolicy);
      };
      Object.defineProperty(HubConnection.prototype, "state", {
          /** Indicates the state of the {@link HubConnection} to the server. */
          get: function () {
              return this.connectionState;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(HubConnection.prototype, "connectionId", {
          /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
           *  in the disconnected state or if the negotiation step was skipped.
           */
          get: function () {
              return this.connection ? (this.connection.connectionId || null) : null;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(HubConnection.prototype, "baseUrl", {
          /** Indicates the url of the {@link HubConnection} to the server. */
          get: function () {
              return this.connection.baseUrl || "";
          },
          /**
           * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
           * Reconnecting states.
           * @param {string} url The url to connect to.
           */
          set: function (url) {
              if (this.connectionState !== HubConnectionState.Disconnected && this.connectionState !== HubConnectionState.Reconnecting) {
                  throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
              }
              if (!url) {
                  throw new Error("The HubConnection url must be a valid url.");
              }
              this.connection.baseUrl = url;
          },
          enumerable: true,
          configurable: true
      });
      /** Starts the connection.
       *
       * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
       */
      HubConnection.prototype.start = function () {
          this.startPromise = this.startWithStateTransitions();
          return this.startPromise;
      };
      HubConnection.prototype.startWithStateTransitions = function () {
          return __awaiter$2(this, void 0, void 0, function () {
              var e_1;
              return __generator$2(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (this.connectionState !== HubConnectionState.Disconnected) {
                              return [2 /*return*/, Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."))];
                          }
                          this.connectionState = HubConnectionState.Connecting;
                          this.logger.log(LogLevel.Debug, "Starting HubConnection.");
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 3, , 4]);
                          return [4 /*yield*/, this.startInternal()];
                      case 2:
                          _a.sent();
                          this.connectionState = HubConnectionState.Connected;
                          this.connectionStarted = true;
                          this.logger.log(LogLevel.Debug, "HubConnection connected successfully.");
                          return [3 /*break*/, 4];
                      case 3:
                          e_1 = _a.sent();
                          this.connectionState = HubConnectionState.Disconnected;
                          this.logger.log(LogLevel.Debug, "HubConnection failed to start successfully because of error '" + e_1 + "'.");
                          return [2 /*return*/, Promise.reject(e_1)];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      HubConnection.prototype.startInternal = function () {
          return __awaiter$2(this, void 0, void 0, function () {
              var handshakePromise, handshakeRequest, e_2;
              var _this = this;
              return __generator$2(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          this.stopDuringStartError = undefined;
                          this.receivedHandshakeResponse = false;
                          handshakePromise = new Promise(function (resolve, reject) {
                              _this.handshakeResolver = resolve;
                              _this.handshakeRejecter = reject;
                          });
                          return [4 /*yield*/, this.connection.start(this.protocol.transferFormat)];
                      case 1:
                          _a.sent();
                          _a.label = 2;
                      case 2:
                          _a.trys.push([2, 5, , 7]);
                          handshakeRequest = {
                              protocol: this.protocol.name,
                              version: this.protocol.version,
                          };
                          this.logger.log(LogLevel.Debug, "Sending handshake request.");
                          return [4 /*yield*/, this.sendMessage(this.handshakeProtocol.writeHandshakeRequest(handshakeRequest))];
                      case 3:
                          _a.sent();
                          this.logger.log(LogLevel.Information, "Using HubProtocol '" + this.protocol.name + "'.");
                          // defensively cleanup timeout in case we receive a message from the server before we finish start
                          this.cleanupTimeout();
                          this.resetTimeoutPeriod();
                          this.resetKeepAliveInterval();
                          return [4 /*yield*/, handshakePromise];
                      case 4:
                          _a.sent();
                          // It's important to check the stopDuringStartError instead of just relying on the handshakePromise
                          // being rejected on close, because this continuation can run after both the handshake completed successfully
                          // and the connection was closed.
                          if (this.stopDuringStartError) {
                              // It's important to throw instead of returning a rejected promise, because we don't want to allow any state
                              // transitions to occur between now and the calling code observing the exceptions. Returning a rejected promise
                              // will cause the calling continuation to get scheduled to run later.
                              throw this.stopDuringStartError;
                          }
                          return [3 /*break*/, 7];
                      case 5:
                          e_2 = _a.sent();
                          this.logger.log(LogLevel.Debug, "Hub handshake failed with error '" + e_2 + "' during start(). Stopping HubConnection.");
                          this.cleanupTimeout();
                          this.cleanupPingTimer();
                          // HttpConnection.stop() should not complete until after the onclose callback is invoked.
                          // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
                          return [4 /*yield*/, this.connection.stop(e_2)];
                      case 6:
                          // HttpConnection.stop() should not complete until after the onclose callback is invoked.
                          // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
                          _a.sent();
                          throw e_2;
                      case 7: return [2 /*return*/];
                  }
              });
          });
      };
      /** Stops the connection.
       *
       * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
       */
      HubConnection.prototype.stop = function () {
          return __awaiter$2(this, void 0, void 0, function () {
              var startPromise, e_3;
              return __generator$2(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          startPromise = this.startPromise;
                          this.stopPromise = this.stopInternal();
                          return [4 /*yield*/, this.stopPromise];
                      case 1:
                          _a.sent();
                          _a.label = 2;
                      case 2:
                          _a.trys.push([2, 4, , 5]);
                          // Awaiting undefined continues immediately
                          return [4 /*yield*/, startPromise];
                      case 3:
                          // Awaiting undefined continues immediately
                          _a.sent();
                          return [3 /*break*/, 5];
                      case 4:
                          e_3 = _a.sent();
                          return [3 /*break*/, 5];
                      case 5: return [2 /*return*/];
                  }
              });
          });
      };
      HubConnection.prototype.stopInternal = function (error) {
          if (this.connectionState === HubConnectionState.Disconnected) {
              this.logger.log(LogLevel.Debug, "Call to HubConnection.stop(" + error + ") ignored because it is already in the disconnected state.");
              return Promise.resolve();
          }
          if (this.connectionState === HubConnectionState.Disconnecting) {
              this.logger.log(LogLevel.Debug, "Call to HttpConnection.stop(" + error + ") ignored because the connection is already in the disconnecting state.");
              return this.stopPromise;
          }
          this.connectionState = HubConnectionState.Disconnecting;
          this.logger.log(LogLevel.Debug, "Stopping HubConnection.");
          if (this.reconnectDelayHandle) {
              // We're in a reconnect delay which means the underlying connection is currently already stopped.
              // Just clear the handle to stop the reconnect loop (which no one is waiting on thankfully) and
              // fire the onclose callbacks.
              this.logger.log(LogLevel.Debug, "Connection stopped during reconnect delay. Done reconnecting.");
              clearTimeout(this.reconnectDelayHandle);
              this.reconnectDelayHandle = undefined;
              this.completeClose();
              return Promise.resolve();
          }
          this.cleanupTimeout();
          this.cleanupPingTimer();
          this.stopDuringStartError = error || new Error("The connection was stopped before the hub handshake could complete.");
          // HttpConnection.stop() should not complete until after either HttpConnection.start() fails
          // or the onclose callback is invoked. The onclose callback will transition the HubConnection
          // to the disconnected state if need be before HttpConnection.stop() completes.
          return this.connection.stop(error);
      };
      /** Invokes a streaming hub method on the server using the specified name and arguments.
       *
       * @typeparam T The type of the items returned by the server.
       * @param {string} methodName The name of the server method to invoke.
       * @param {any[]} args The arguments used to invoke the server method.
       * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
       */
      HubConnection.prototype.stream = function (methodName) {
          var _this = this;
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          var _a = this.replaceStreamingParams(args), streams = _a[0], streamIds = _a[1];
          var invocationDescriptor = this.createStreamInvocation(methodName, args, streamIds);
          var promiseQueue;
          var subject = new Subject();
          subject.cancelCallback = function () {
              var cancelInvocation = _this.createCancelInvocation(invocationDescriptor.invocationId);
              delete _this.callbacks[invocationDescriptor.invocationId];
              return promiseQueue.then(function () {
                  return _this.sendWithProtocol(cancelInvocation);
              });
          };
          this.callbacks[invocationDescriptor.invocationId] = function (invocationEvent, error) {
              if (error) {
                  subject.error(error);
                  return;
              }
              else if (invocationEvent) {
                  // invocationEvent will not be null when an error is not passed to the callback
                  if (invocationEvent.type === MessageType.Completion) {
                      if (invocationEvent.error) {
                          subject.error(new Error(invocationEvent.error));
                      }
                      else {
                          subject.complete();
                      }
                  }
                  else {
                      subject.next((invocationEvent.item));
                  }
              }
          };
          promiseQueue = this.sendWithProtocol(invocationDescriptor)
              .catch(function (e) {
              subject.error(e);
              delete _this.callbacks[invocationDescriptor.invocationId];
          });
          this.launchStreams(streams, promiseQueue);
          return subject;
      };
      HubConnection.prototype.sendMessage = function (message) {
          this.resetKeepAliveInterval();
          return this.connection.send(message);
      };
      /**
       * Sends a js object to the server.
       * @param message The js object to serialize and send.
       */
      HubConnection.prototype.sendWithProtocol = function (message) {
          return this.sendMessage(this.protocol.writeMessage(message));
      };
      /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
       *
       * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
       * be processing the invocation.
       *
       * @param {string} methodName The name of the server method to invoke.
       * @param {any[]} args The arguments used to invoke the server method.
       * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
       */
      HubConnection.prototype.send = function (methodName) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          var _a = this.replaceStreamingParams(args), streams = _a[0], streamIds = _a[1];
          var sendPromise = this.sendWithProtocol(this.createInvocation(methodName, args, true, streamIds));
          this.launchStreams(streams, sendPromise);
          return sendPromise;
      };
      /** Invokes a hub method on the server using the specified name and arguments.
       *
       * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
       * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
       * resolving the Promise.
       *
       * @typeparam T The expected return type.
       * @param {string} methodName The name of the server method to invoke.
       * @param {any[]} args The arguments used to invoke the server method.
       * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
       */
      HubConnection.prototype.invoke = function (methodName) {
          var _this = this;
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          var _a = this.replaceStreamingParams(args), streams = _a[0], streamIds = _a[1];
          var invocationDescriptor = this.createInvocation(methodName, args, false, streamIds);
          var p = new Promise(function (resolve, reject) {
              // invocationId will always have a value for a non-blocking invocation
              _this.callbacks[invocationDescriptor.invocationId] = function (invocationEvent, error) {
                  if (error) {
                      reject(error);
                      return;
                  }
                  else if (invocationEvent) {
                      // invocationEvent will not be null when an error is not passed to the callback
                      if (invocationEvent.type === MessageType.Completion) {
                          if (invocationEvent.error) {
                              reject(new Error(invocationEvent.error));
                          }
                          else {
                              resolve(invocationEvent.result);
                          }
                      }
                      else {
                          reject(new Error("Unexpected message type: " + invocationEvent.type));
                      }
                  }
              };
              var promiseQueue = _this.sendWithProtocol(invocationDescriptor)
                  .catch(function (e) {
                  reject(e);
                  // invocationId will always have a value for a non-blocking invocation
                  delete _this.callbacks[invocationDescriptor.invocationId];
              });
              _this.launchStreams(streams, promiseQueue);
          });
          return p;
      };
      /** Registers a handler that will be invoked when the hub method with the specified method name is invoked.
       *
       * @param {string} methodName The name of the hub method to define.
       * @param {Function} newMethod The handler that will be raised when the hub method is invoked.
       */
      HubConnection.prototype.on = function (methodName, newMethod) {
          if (!methodName || !newMethod) {
              return;
          }
          methodName = methodName.toLowerCase();
          if (!this.methods[methodName]) {
              this.methods[methodName] = [];
          }
          // Preventing adding the same handler multiple times.
          if (this.methods[methodName].indexOf(newMethod) !== -1) {
              return;
          }
          this.methods[methodName].push(newMethod);
      };
      HubConnection.prototype.off = function (methodName, method) {
          if (!methodName) {
              return;
          }
          methodName = methodName.toLowerCase();
          var handlers = this.methods[methodName];
          if (!handlers) {
              return;
          }
          if (method) {
              var removeIdx = handlers.indexOf(method);
              if (removeIdx !== -1) {
                  handlers.splice(removeIdx, 1);
                  if (handlers.length === 0) {
                      delete this.methods[methodName];
                  }
              }
          }
          else {
              delete this.methods[methodName];
          }
      };
      /** Registers a handler that will be invoked when the connection is closed.
       *
       * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
       */
      HubConnection.prototype.onclose = function (callback) {
          if (callback) {
              this.closedCallbacks.push(callback);
          }
      };
      /** Registers a handler that will be invoked when the connection starts reconnecting.
       *
       * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
       */
      HubConnection.prototype.onreconnecting = function (callback) {
          if (callback) {
              this.reconnectingCallbacks.push(callback);
          }
      };
      /** Registers a handler that will be invoked when the connection successfully reconnects.
       *
       * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
       */
      HubConnection.prototype.onreconnected = function (callback) {
          if (callback) {
              this.reconnectedCallbacks.push(callback);
          }
      };
      HubConnection.prototype.processIncomingData = function (data) {
          this.cleanupTimeout();
          if (!this.receivedHandshakeResponse) {
              data = this.processHandshakeResponse(data);
              this.receivedHandshakeResponse = true;
          }
          // Data may have all been read when processing handshake response
          if (data) {
              // Parse the messages
              var messages = this.protocol.parseMessages(data, this.logger);
              for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                  var message = messages_1[_i];
                  switch (message.type) {
                      case MessageType.Invocation:
                          this.invokeClientMethod(message);
                          break;
                      case MessageType.StreamItem:
                      case MessageType.Completion:
                          var callback = this.callbacks[message.invocationId];
                          if (callback) {
                              if (message.type === MessageType.Completion) {
                                  delete this.callbacks[message.invocationId];
                              }
                              callback(message);
                          }
                          break;
                      case MessageType.Ping:
                          // Don't care about pings
                          break;
                      case MessageType.Close:
                          this.logger.log(LogLevel.Information, "Close message received from server.");
                          var error = message.error ? new Error("Server returned an error on close: " + message.error) : undefined;
                          if (message.allowReconnect === true) {
                              // It feels wrong not to await connection.stop() here, but processIncomingData is called as part of an onreceive callback which is not async,
                              // this is already the behavior for serverTimeout(), and HttpConnection.Stop() should catch and log all possible exceptions.
                              // tslint:disable-next-line:no-floating-promises
                              this.connection.stop(error);
                          }
                          else {
                              // We cannot await stopInternal() here, but subsequent calls to stop() will await this if stopInternal() is still ongoing.
                              this.stopPromise = this.stopInternal(error);
                          }
                          break;
                      default:
                          this.logger.log(LogLevel.Warning, "Invalid message type: " + message.type + ".");
                          break;
                  }
              }
          }
          this.resetTimeoutPeriod();
      };
      HubConnection.prototype.processHandshakeResponse = function (data) {
          var _a;
          var responseMessage;
          var remainingData;
          try {
              _a = this.handshakeProtocol.parseHandshakeResponse(data), remainingData = _a[0], responseMessage = _a[1];
          }
          catch (e) {
              var message = "Error parsing handshake response: " + e;
              this.logger.log(LogLevel.Error, message);
              var error = new Error(message);
              this.handshakeRejecter(error);
              throw error;
          }
          if (responseMessage.error) {
              var message = "Server returned handshake error: " + responseMessage.error;
              this.logger.log(LogLevel.Error, message);
              var error = new Error(message);
              this.handshakeRejecter(error);
              throw error;
          }
          else {
              this.logger.log(LogLevel.Debug, "Server handshake complete.");
          }
          this.handshakeResolver();
          return remainingData;
      };
      HubConnection.prototype.resetKeepAliveInterval = function () {
          var _this = this;
          if (this.connection.features.inherentKeepAlive) {
              return;
          }
          this.cleanupPingTimer();
          this.pingServerHandle = setTimeout(function () { return __awaiter$2(_this, void 0, void 0, function () {
              var _a;
              return __generator$2(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          if (!(this.connectionState === HubConnectionState.Connected)) return [3 /*break*/, 4];
                          _b.label = 1;
                      case 1:
                          _b.trys.push([1, 3, , 4]);
                          return [4 /*yield*/, this.sendMessage(this.cachedPingMessage)];
                      case 2:
                          _b.sent();
                          return [3 /*break*/, 4];
                      case 3:
                          _a = _b.sent();
                          // We don't care about the error. It should be seen elsewhere in the client.
                          // The connection is probably in a bad or closed state now, cleanup the timer so it stops triggering
                          this.cleanupPingTimer();
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          }); }, this.keepAliveIntervalInMilliseconds);
      };
      HubConnection.prototype.resetTimeoutPeriod = function () {
          var _this = this;
          if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
              // Set the timeout timer
              this.timeoutHandle = setTimeout(function () { return _this.serverTimeout(); }, this.serverTimeoutInMilliseconds);
          }
      };
      HubConnection.prototype.serverTimeout = function () {
          // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
          // Terminate the connection, but we don't need to wait on the promise. This could trigger reconnecting.
          // tslint:disable-next-line:no-floating-promises
          this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
      };
      HubConnection.prototype.invokeClientMethod = function (invocationMessage) {
          var _this = this;
          var methods = this.methods[invocationMessage.target.toLowerCase()];
          if (methods) {
              try {
                  methods.forEach(function (m) { return m.apply(_this, invocationMessage.arguments); });
              }
              catch (e) {
                  this.logger.log(LogLevel.Error, "A callback for the method " + invocationMessage.target.toLowerCase() + " threw error '" + e + "'.");
              }
              if (invocationMessage.invocationId) {
                  // This is not supported in v1. So we return an error to avoid blocking the server waiting for the response.
                  var message = "Server requested a response, which is not supported in this version of the client.";
                  this.logger.log(LogLevel.Error, message);
                  // We don't want to wait on the stop itself.
                  this.stopPromise = this.stopInternal(new Error(message));
              }
          }
          else {
              this.logger.log(LogLevel.Warning, "No client method with the name '" + invocationMessage.target + "' found.");
          }
      };
      HubConnection.prototype.connectionClosed = function (error) {
          this.logger.log(LogLevel.Debug, "HubConnection.connectionClosed(" + error + ") called while in state " + this.connectionState + ".");
          // Triggering this.handshakeRejecter is insufficient because it could already be resolved without the continuation having run yet.
          this.stopDuringStartError = this.stopDuringStartError || error || new Error("The underlying connection was closed before the hub handshake could complete.");
          // If the handshake is in progress, start will be waiting for the handshake promise, so we complete it.
          // If it has already completed, this should just noop.
          if (this.handshakeResolver) {
              this.handshakeResolver();
          }
          this.cancelCallbacksWithError(error || new Error("Invocation canceled due to the underlying connection being closed."));
          this.cleanupTimeout();
          this.cleanupPingTimer();
          if (this.connectionState === HubConnectionState.Disconnecting) {
              this.completeClose(error);
          }
          else if (this.connectionState === HubConnectionState.Connected && this.reconnectPolicy) {
              // tslint:disable-next-line:no-floating-promises
              this.reconnect(error);
          }
          else if (this.connectionState === HubConnectionState.Connected) {
              this.completeClose(error);
          }
          // If none of the above if conditions were true were called the HubConnection must be in either:
          // 1. The Connecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail it.
          // 2. The Reconnecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail the current reconnect attempt
          //    and potentially continue the reconnect() loop.
          // 3. The Disconnected state in which case we're already done.
      };
      HubConnection.prototype.completeClose = function (error) {
          var _this = this;
          if (this.connectionStarted) {
              this.connectionState = HubConnectionState.Disconnected;
              this.connectionStarted = false;
              try {
                  this.closedCallbacks.forEach(function (c) { return c.apply(_this, [error]); });
              }
              catch (e) {
                  this.logger.log(LogLevel.Error, "An onclose callback called with error '" + error + "' threw error '" + e + "'.");
              }
          }
      };
      HubConnection.prototype.reconnect = function (error) {
          return __awaiter$2(this, void 0, void 0, function () {
              var reconnectStartTime, previousReconnectAttempts, retryError, nextRetryDelay, e_4;
              var _this = this;
              return __generator$2(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          reconnectStartTime = Date.now();
                          previousReconnectAttempts = 0;
                          retryError = error !== undefined ? error : new Error("Attempting to reconnect due to a unknown error.");
                          nextRetryDelay = this.getNextRetryDelay(previousReconnectAttempts++, 0, retryError);
                          if (nextRetryDelay === null) {
                              this.logger.log(LogLevel.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt.");
                              this.completeClose(error);
                              return [2 /*return*/];
                          }
                          this.connectionState = HubConnectionState.Reconnecting;
                          if (error) {
                              this.logger.log(LogLevel.Information, "Connection reconnecting because of error '" + error + "'.");
                          }
                          else {
                              this.logger.log(LogLevel.Information, "Connection reconnecting.");
                          }
                          if (this.onreconnecting) {
                              try {
                                  this.reconnectingCallbacks.forEach(function (c) { return c.apply(_this, [error]); });
                              }
                              catch (e) {
                                  this.logger.log(LogLevel.Error, "An onreconnecting callback called with error '" + error + "' threw error '" + e + "'.");
                              }
                              // Exit early if an onreconnecting callback called connection.stop().
                              if (this.connectionState !== HubConnectionState.Reconnecting) {
                                  this.logger.log(LogLevel.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
                                  return [2 /*return*/];
                              }
                          }
                          _a.label = 1;
                      case 1:
                          if (!(nextRetryDelay !== null)) return [3 /*break*/, 7];
                          this.logger.log(LogLevel.Information, "Reconnect attempt number " + previousReconnectAttempts + " will start in " + nextRetryDelay + " ms.");
                          return [4 /*yield*/, new Promise(function (resolve) {
                                  _this.reconnectDelayHandle = setTimeout(resolve, nextRetryDelay);
                              })];
                      case 2:
                          _a.sent();
                          this.reconnectDelayHandle = undefined;
                          if (this.connectionState !== HubConnectionState.Reconnecting) {
                              this.logger.log(LogLevel.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
                              return [2 /*return*/];
                          }
                          _a.label = 3;
                      case 3:
                          _a.trys.push([3, 5, , 6]);
                          return [4 /*yield*/, this.startInternal()];
                      case 4:
                          _a.sent();
                          this.connectionState = HubConnectionState.Connected;
                          this.logger.log(LogLevel.Information, "HubConnection reconnected successfully.");
                          if (this.onreconnected) {
                              try {
                                  this.reconnectedCallbacks.forEach(function (c) { return c.apply(_this, [_this.connection.connectionId]); });
                              }
                              catch (e) {
                                  this.logger.log(LogLevel.Error, "An onreconnected callback called with connectionId '" + this.connection.connectionId + "; threw error '" + e + "'.");
                              }
                          }
                          return [2 /*return*/];
                      case 5:
                          e_4 = _a.sent();
                          this.logger.log(LogLevel.Information, "Reconnect attempt failed because of error '" + e_4 + "'.");
                          if (this.connectionState !== HubConnectionState.Reconnecting) {
                              this.logger.log(LogLevel.Debug, "Connection left the reconnecting state during reconnect attempt. Done reconnecting.");
                              return [2 /*return*/];
                          }
                          retryError = e_4 instanceof Error ? e_4 : new Error(e_4.toString());
                          nextRetryDelay = this.getNextRetryDelay(previousReconnectAttempts++, Date.now() - reconnectStartTime, retryError);
                          return [3 /*break*/, 6];
                      case 6: return [3 /*break*/, 1];
                      case 7:
                          this.logger.log(LogLevel.Information, "Reconnect retries have been exhausted after " + (Date.now() - reconnectStartTime) + " ms and " + previousReconnectAttempts + " failed attempts. Connection disconnecting.");
                          this.completeClose();
                          return [2 /*return*/];
                  }
              });
          });
      };
      HubConnection.prototype.getNextRetryDelay = function (previousRetryCount, elapsedMilliseconds, retryReason) {
          try {
              return this.reconnectPolicy.nextRetryDelayInMilliseconds({
                  elapsedMilliseconds: elapsedMilliseconds,
                  previousRetryCount: previousRetryCount,
                  retryReason: retryReason,
              });
          }
          catch (e) {
              this.logger.log(LogLevel.Error, "IRetryPolicy.nextRetryDelayInMilliseconds(" + previousRetryCount + ", " + elapsedMilliseconds + ") threw error '" + e + "'.");
              return null;
          }
      };
      HubConnection.prototype.cancelCallbacksWithError = function (error) {
          var callbacks = this.callbacks;
          this.callbacks = {};
          Object.keys(callbacks)
              .forEach(function (key) {
              var callback = callbacks[key];
              callback(null, error);
          });
      };
      HubConnection.prototype.cleanupPingTimer = function () {
          if (this.pingServerHandle) {
              clearTimeout(this.pingServerHandle);
          }
      };
      HubConnection.prototype.cleanupTimeout = function () {
          if (this.timeoutHandle) {
              clearTimeout(this.timeoutHandle);
          }
      };
      HubConnection.prototype.createInvocation = function (methodName, args, nonblocking, streamIds) {
          if (nonblocking) {
              if (streamIds.length !== 0) {
                  return {
                      arguments: args,
                      streamIds: streamIds,
                      target: methodName,
                      type: MessageType.Invocation,
                  };
              }
              else {
                  return {
                      arguments: args,
                      target: methodName,
                      type: MessageType.Invocation,
                  };
              }
          }
          else {
              var invocationId = this.invocationId;
              this.invocationId++;
              if (streamIds.length !== 0) {
                  return {
                      arguments: args,
                      invocationId: invocationId.toString(),
                      streamIds: streamIds,
                      target: methodName,
                      type: MessageType.Invocation,
                  };
              }
              else {
                  return {
                      arguments: args,
                      invocationId: invocationId.toString(),
                      target: methodName,
                      type: MessageType.Invocation,
                  };
              }
          }
      };
      HubConnection.prototype.launchStreams = function (streams, promiseQueue) {
          var _this = this;
          if (streams.length === 0) {
              return;
          }
          // Synchronize stream data so they arrive in-order on the server
          if (!promiseQueue) {
              promiseQueue = Promise.resolve();
          }
          var _loop_1 = function (streamId) {
              streams[streamId].subscribe({
                  complete: function () {
                      promiseQueue = promiseQueue.then(function () { return _this.sendWithProtocol(_this.createCompletionMessage(streamId)); });
                  },
                  error: function (err) {
                      var message;
                      if (err instanceof Error) {
                          message = err.message;
                      }
                      else if (err && err.toString) {
                          message = err.toString();
                      }
                      else {
                          message = "Unknown error";
                      }
                      promiseQueue = promiseQueue.then(function () { return _this.sendWithProtocol(_this.createCompletionMessage(streamId, message)); });
                  },
                  next: function (item) {
                      promiseQueue = promiseQueue.then(function () { return _this.sendWithProtocol(_this.createStreamItemMessage(streamId, item)); });
                  },
              });
          };
          // We want to iterate over the keys, since the keys are the stream ids
          // tslint:disable-next-line:forin
          for (var streamId in streams) {
              _loop_1(streamId);
          }
      };
      HubConnection.prototype.replaceStreamingParams = function (args) {
          var streams = [];
          var streamIds = [];
          for (var i = 0; i < args.length; i++) {
              var argument = args[i];
              if (this.isObservable(argument)) {
                  var streamId = this.invocationId;
                  this.invocationId++;
                  // Store the stream for later use
                  streams[streamId] = argument;
                  streamIds.push(streamId.toString());
                  // remove stream from args
                  args.splice(i, 1);
              }
          }
          return [streams, streamIds];
      };
      HubConnection.prototype.isObservable = function (arg) {
          // This allows other stream implementations to just work (like rxjs)
          return arg && arg.subscribe && typeof arg.subscribe === "function";
      };
      HubConnection.prototype.createStreamInvocation = function (methodName, args, streamIds) {
          var invocationId = this.invocationId;
          this.invocationId++;
          if (streamIds.length !== 0) {
              return {
                  arguments: args,
                  invocationId: invocationId.toString(),
                  streamIds: streamIds,
                  target: methodName,
                  type: MessageType.StreamInvocation,
              };
          }
          else {
              return {
                  arguments: args,
                  invocationId: invocationId.toString(),
                  target: methodName,
                  type: MessageType.StreamInvocation,
              };
          }
      };
      HubConnection.prototype.createCancelInvocation = function (id) {
          return {
              invocationId: id,
              type: MessageType.CancelInvocation,
          };
      };
      HubConnection.prototype.createStreamItemMessage = function (id, item) {
          return {
              invocationId: id,
              item: item,
              type: MessageType.StreamItem,
          };
      };
      HubConnection.prototype.createCompletionMessage = function (id, error, result) {
          if (error) {
              return {
                  error: error,
                  invocationId: id,
                  type: MessageType.Completion,
              };
          }
          return {
              invocationId: id,
              result: result,
              type: MessageType.Completion,
          };
      };
      return HubConnection;
  }());

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  // This will be treated as a bit flag in the future, so we keep it using power-of-two values.
  /** Specifies a specific HTTP transport type. */
  var HttpTransportType;
  (function (HttpTransportType) {
      /** Specifies no transport preference. */
      HttpTransportType[HttpTransportType["None"] = 0] = "None";
      /** Specifies the WebSockets transport. */
      HttpTransportType[HttpTransportType["WebSockets"] = 1] = "WebSockets";
      /** Specifies the Server-Sent Events transport. */
      HttpTransportType[HttpTransportType["ServerSentEvents"] = 2] = "ServerSentEvents";
      /** Specifies the Long Polling transport. */
      HttpTransportType[HttpTransportType["LongPolling"] = 4] = "LongPolling";
  })(HttpTransportType || (HttpTransportType = {}));
  /** Specifies the transfer format for a connection. */
  var TransferFormat;
  (function (TransferFormat) {
      /** Specifies that only text data will be transmitted over the connection. */
      TransferFormat[TransferFormat["Text"] = 1] = "Text";
      /** Specifies that binary data will be transmitted over the connection. */
      TransferFormat[TransferFormat["Binary"] = 2] = "Binary";
  })(TransferFormat || (TransferFormat = {}));

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  // Rough polyfill of https://developer.mozilla.org/en-US/docs/Web/API/AbortController
  // We don't actually ever use the API being polyfilled, we always use the polyfill because
  // it's a very new API right now.
  // Not exported from index.
  /** @private */
  var AbortController$1 = /** @class */ (function () {
      function AbortController() {
          this.isAborted = false;
          this.onabort = null;
      }
      AbortController.prototype.abort = function () {
          if (!this.isAborted) {
              this.isAborted = true;
              if (this.onabort) {
                  this.onabort();
              }
          }
      };
      Object.defineProperty(AbortController.prototype, "signal", {
          get: function () {
              return this;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(AbortController.prototype, "aborted", {
          get: function () {
              return this.isAborted;
          },
          enumerable: true,
          configurable: true
      });
      return AbortController;
  }());

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __assign$3 = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$3 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  // Not exported from 'index', this type is internal.
  /** @private */
  var LongPollingTransport = /** @class */ (function () {
      function LongPollingTransport(httpClient, accessTokenFactory, logger, logMessageContent, withCredentials, headers) {
          this.httpClient = httpClient;
          this.accessTokenFactory = accessTokenFactory;
          this.logger = logger;
          this.pollAbort = new AbortController$1();
          this.logMessageContent = logMessageContent;
          this.withCredentials = withCredentials;
          this.headers = headers;
          this.running = false;
          this.onreceive = null;
          this.onclose = null;
      }
      Object.defineProperty(LongPollingTransport.prototype, "pollAborted", {
          // This is an internal type, not exported from 'index' so this is really just internal.
          get: function () {
              return this.pollAbort.aborted;
          },
          enumerable: true,
          configurable: true
      });
      LongPollingTransport.prototype.connect = function (url, transferFormat) {
          return __awaiter$3(this, void 0, void 0, function () {
              var _a, _b, name, value, headers, pollOptions, token, pollUrl, response;
              return __generator$3(this, function (_c) {
                  switch (_c.label) {
                      case 0:
                          Arg.isRequired(url, "url");
                          Arg.isRequired(transferFormat, "transferFormat");
                          Arg.isIn(transferFormat, TransferFormat, "transferFormat");
                          this.url = url;
                          this.logger.log(LogLevel.Trace, "(LongPolling transport) Connecting.");
                          // Allow binary format on Node and Browsers that support binary content (indicated by the presence of responseType property)
                          if (transferFormat === TransferFormat.Binary &&
                              (typeof XMLHttpRequest !== "undefined" && typeof new XMLHttpRequest().responseType !== "string")) {
                              throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
                          }
                          _b = getUserAgentHeader(), name = _b[0], value = _b[1];
                          headers = __assign$3((_a = {}, _a[name] = value, _a), this.headers);
                          pollOptions = {
                              abortSignal: this.pollAbort.signal,
                              headers: headers,
                              timeout: 100000,
                              withCredentials: this.withCredentials,
                          };
                          if (transferFormat === TransferFormat.Binary) {
                              pollOptions.responseType = "arraybuffer";
                          }
                          return [4 /*yield*/, this.getAccessToken()];
                      case 1:
                          token = _c.sent();
                          this.updateHeaderToken(pollOptions, token);
                          pollUrl = url + "&_=" + Date.now();
                          this.logger.log(LogLevel.Trace, "(LongPolling transport) polling: " + pollUrl + ".");
                          return [4 /*yield*/, this.httpClient.get(pollUrl, pollOptions)];
                      case 2:
                          response = _c.sent();
                          if (response.statusCode !== 200) {
                              this.logger.log(LogLevel.Error, "(LongPolling transport) Unexpected response code: " + response.statusCode + ".");
                              // Mark running as false so that the poll immediately ends and runs the close logic
                              this.closeError = new HttpError(response.statusText || "", response.statusCode);
                              this.running = false;
                          }
                          else {
                              this.running = true;
                          }
                          this.receiving = this.poll(this.url, pollOptions);
                          return [2 /*return*/];
                  }
              });
          });
      };
      LongPollingTransport.prototype.getAccessToken = function () {
          return __awaiter$3(this, void 0, void 0, function () {
              return __generator$3(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (!this.accessTokenFactory) return [3 /*break*/, 2];
                          return [4 /*yield*/, this.accessTokenFactory()];
                      case 1: return [2 /*return*/, _a.sent()];
                      case 2: return [2 /*return*/, null];
                  }
              });
          });
      };
      LongPollingTransport.prototype.updateHeaderToken = function (request, token) {
          if (!request.headers) {
              request.headers = {};
          }
          if (token) {
              // tslint:disable-next-line:no-string-literal
              request.headers["Authorization"] = "Bearer " + token;
              return;
          }
          // tslint:disable-next-line:no-string-literal
          if (request.headers["Authorization"]) {
              // tslint:disable-next-line:no-string-literal
              delete request.headers["Authorization"];
          }
      };
      LongPollingTransport.prototype.poll = function (url, pollOptions) {
          return __awaiter$3(this, void 0, void 0, function () {
              var token, pollUrl, response, e_1;
              return __generator$3(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          _a.trys.push([0, , 8, 9]);
                          _a.label = 1;
                      case 1:
                          if (!this.running) return [3 /*break*/, 7];
                          return [4 /*yield*/, this.getAccessToken()];
                      case 2:
                          token = _a.sent();
                          this.updateHeaderToken(pollOptions, token);
                          _a.label = 3;
                      case 3:
                          _a.trys.push([3, 5, , 6]);
                          pollUrl = url + "&_=" + Date.now();
                          this.logger.log(LogLevel.Trace, "(LongPolling transport) polling: " + pollUrl + ".");
                          return [4 /*yield*/, this.httpClient.get(pollUrl, pollOptions)];
                      case 4:
                          response = _a.sent();
                          if (response.statusCode === 204) {
                              this.logger.log(LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
                              this.running = false;
                          }
                          else if (response.statusCode !== 200) {
                              this.logger.log(LogLevel.Error, "(LongPolling transport) Unexpected response code: " + response.statusCode + ".");
                              // Unexpected status code
                              this.closeError = new HttpError(response.statusText || "", response.statusCode);
                              this.running = false;
                          }
                          else {
                              // Process the response
                              if (response.content) {
                                  this.logger.log(LogLevel.Trace, "(LongPolling transport) data received. " + getDataDetail(response.content, this.logMessageContent) + ".");
                                  if (this.onreceive) {
                                      this.onreceive(response.content);
                                  }
                              }
                              else {
                                  // This is another way timeout manifest.
                                  this.logger.log(LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                              }
                          }
                          return [3 /*break*/, 6];
                      case 5:
                          e_1 = _a.sent();
                          if (!this.running) {
                              // Log but disregard errors that occur after stopping
                              this.logger.log(LogLevel.Trace, "(LongPolling transport) Poll errored after shutdown: " + e_1.message);
                          }
                          else {
                              if (e_1 instanceof TimeoutError) {
                                  // Ignore timeouts and reissue the poll.
                                  this.logger.log(LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                              }
                              else {
                                  // Close the connection with the error as the result.
                                  this.closeError = e_1;
                                  this.running = false;
                              }
                          }
                          return [3 /*break*/, 6];
                      case 6: return [3 /*break*/, 1];
                      case 7: return [3 /*break*/, 9];
                      case 8:
                          this.logger.log(LogLevel.Trace, "(LongPolling transport) Polling complete.");
                          // We will reach here with pollAborted==false when the server returned a response causing the transport to stop.
                          // If pollAborted==true then client initiated the stop and the stop method will raise the close event after DELETE is sent.
                          if (!this.pollAborted) {
                              this.raiseOnClose();
                          }
                          return [7 /*endfinally*/];
                      case 9: return [2 /*return*/];
                  }
              });
          });
      };
      LongPollingTransport.prototype.send = function (data) {
          return __awaiter$3(this, void 0, void 0, function () {
              return __generator$3(this, function (_a) {
                  if (!this.running) {
                      return [2 /*return*/, Promise.reject(new Error("Cannot send until the transport is connected"))];
                  }
                  return [2 /*return*/, sendMessage(this.logger, "LongPolling", this.httpClient, this.url, this.accessTokenFactory, data, this.logMessageContent, this.withCredentials, this.headers)];
              });
          });
      };
      LongPollingTransport.prototype.stop = function () {
          return __awaiter$3(this, void 0, void 0, function () {
              var headers, _a, name_1, value, deleteOptions, token;
              return __generator$3(this, function (_b) {
                  switch (_b.label) {
                      case 0:
                          this.logger.log(LogLevel.Trace, "(LongPolling transport) Stopping polling.");
                          // Tell receiving loop to stop, abort any current request, and then wait for it to finish
                          this.running = false;
                          this.pollAbort.abort();
                          _b.label = 1;
                      case 1:
                          _b.trys.push([1, , 5, 6]);
                          return [4 /*yield*/, this.receiving];
                      case 2:
                          _b.sent();
                          // Send DELETE to clean up long polling on the server
                          this.logger.log(LogLevel.Trace, "(LongPolling transport) sending DELETE request to " + this.url + ".");
                          headers = {};
                          _a = getUserAgentHeader(), name_1 = _a[0], value = _a[1];
                          headers[name_1] = value;
                          deleteOptions = {
                              headers: __assign$3({}, headers, this.headers),
                              withCredentials: this.withCredentials,
                          };
                          return [4 /*yield*/, this.getAccessToken()];
                      case 3:
                          token = _b.sent();
                          this.updateHeaderToken(deleteOptions, token);
                          return [4 /*yield*/, this.httpClient.delete(this.url, deleteOptions)];
                      case 4:
                          _b.sent();
                          this.logger.log(LogLevel.Trace, "(LongPolling transport) DELETE request sent.");
                          return [3 /*break*/, 6];
                      case 5:
                          this.logger.log(LogLevel.Trace, "(LongPolling transport) Stop finished.");
                          // Raise close event here instead of in polling
                          // It needs to happen after the DELETE request is sent
                          this.raiseOnClose();
                          return [7 /*endfinally*/];
                      case 6: return [2 /*return*/];
                  }
              });
          });
      };
      LongPollingTransport.prototype.raiseOnClose = function () {
          if (this.onclose) {
              var logMessage = "(LongPolling transport) Firing onclose event.";
              if (this.closeError) {
                  logMessage += " Error: " + this.closeError;
              }
              this.logger.log(LogLevel.Trace, logMessage);
              this.onclose(this.closeError);
          }
      };
      return LongPollingTransport;
  }());

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __assign$4 = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$4 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __assign$5 = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  var __awaiter$5 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$5 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __assign$6 = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  var __awaiter$6 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  var __generator$6 = (undefined && undefined.__generator) || function (thisArg, body) {
      var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
      function verb(n) { return function (v) { return step([n, v]); }; }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while (_) try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [op[0] & 2, t.value];
              switch (op[0]) {
                  case 0: case 1: t = op; break;
                  case 4: _.label++; return { value: op[1], done: false };
                  case 5: _.label++; y = op[1]; op = [0]; continue;
                  case 7: op = _.ops.pop(); _.trys.pop(); continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                      if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                      if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                      if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                      if (t[2]) _.ops.pop();
                      _.trys.pop(); continue;
              }
              op = body.call(thisArg, _);
          } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
          if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
      }
  };
  /** @private */
  var TransportSendQueue = /** @class */ (function () {
      function TransportSendQueue(transport) {
          this.transport = transport;
          this.buffer = [];
          this.executing = true;
          this.sendBufferedData = new PromiseSource();
          this.transportResult = new PromiseSource();
          this.sendLoopPromise = this.sendLoop();
      }
      TransportSendQueue.prototype.send = function (data) {
          this.bufferData(data);
          if (!this.transportResult) {
              this.transportResult = new PromiseSource();
          }
          return this.transportResult.promise;
      };
      TransportSendQueue.prototype.stop = function () {
          this.executing = false;
          this.sendBufferedData.resolve();
          return this.sendLoopPromise;
      };
      TransportSendQueue.prototype.bufferData = function (data) {
          if (this.buffer.length && typeof (this.buffer[0]) !== typeof (data)) {
              throw new Error("Expected data to be of type " + typeof (this.buffer) + " but was of type " + typeof (data));
          }
          this.buffer.push(data);
          this.sendBufferedData.resolve();
      };
      TransportSendQueue.prototype.sendLoop = function () {
          return __awaiter$6(this, void 0, void 0, function () {
              var transportResult, data, error_1;
              return __generator$6(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          return [4 /*yield*/, this.sendBufferedData.promise];
                      case 1:
                          _a.sent();
                          if (!this.executing) {
                              if (this.transportResult) {
                                  this.transportResult.reject("Connection stopped.");
                              }
                              return [3 /*break*/, 6];
                          }
                          this.sendBufferedData = new PromiseSource();
                          transportResult = this.transportResult;
                          this.transportResult = undefined;
                          data = typeof (this.buffer[0]) === "string" ?
                              this.buffer.join("") :
                              TransportSendQueue.concatBuffers(this.buffer);
                          this.buffer.length = 0;
                          _a.label = 2;
                      case 2:
                          _a.trys.push([2, 4, , 5]);
                          return [4 /*yield*/, this.transport.send(data)];
                      case 3:
                          _a.sent();
                          transportResult.resolve();
                          return [3 /*break*/, 5];
                      case 4:
                          error_1 = _a.sent();
                          transportResult.reject(error_1);
                          return [3 /*break*/, 5];
                      case 5: return [3 /*break*/, 0];
                      case 6: return [2 /*return*/];
                  }
              });
          });
      };
      TransportSendQueue.concatBuffers = function (arrayBuffers) {
          var totalLength = arrayBuffers.map(function (b) { return b.byteLength; }).reduce(function (a, b) { return a + b; });
          var result = new Uint8Array(totalLength);
          var offset = 0;
          for (var _i = 0, arrayBuffers_1 = arrayBuffers; _i < arrayBuffers_1.length; _i++) {
              var item = arrayBuffers_1[_i];
              result.set(new Uint8Array(item), offset);
              offset += item.byteLength;
          }
          return result.buffer;
      };
      return TransportSendQueue;
  }());
  var PromiseSource = /** @class */ (function () {
      function PromiseSource() {
          var _this = this;
          this.promise = new Promise(function (resolve, reject) {
              var _a;
              return _a = [resolve, reject], _this.resolver = _a[0], _this.rejecter = _a[1], _a;
          });
      }
      PromiseSource.prototype.resolve = function () {
          this.resolver();
      };
      PromiseSource.prototype.reject = function (reason) {
          this.rejecter(reason);
      };
      return PromiseSource;
  }());

  // Copyright (c) .NET Foundation. All rights reserved.
  // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
  var __assign$7 = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  // tslint:disable:object-literal-sort-keys
  var LogLevelNameMapping = {
      trace: LogLevel.Trace,
      debug: LogLevel.Debug,
      info: LogLevel.Information,
      information: LogLevel.Information,
      warn: LogLevel.Warning,
      warning: LogLevel.Warning,
      error: LogLevel.Error,
      critical: LogLevel.Critical,
      none: LogLevel.None,
  };

  var CallaTeleconferenceEventType;
  (function (CallaTeleconferenceEventType) {
      CallaTeleconferenceEventType["ServerConnected"] = "serverConnected";
      CallaTeleconferenceEventType["ServerDisconnected"] = "serverDisconnected";
      CallaTeleconferenceEventType["ServerFailed"] = "serverFailed";
      CallaTeleconferenceEventType["ConferenceConnected"] = "conferenceConnected";
      CallaTeleconferenceEventType["ConferenceJoined"] = "conferenceJoined";
      CallaTeleconferenceEventType["ConferenceFailed"] = "conferenceFailed";
      CallaTeleconferenceEventType["ConferenceRestored"] = "conferenceRestored";
      CallaTeleconferenceEventType["ConferenceLeft"] = "conferenceLeft";
      CallaTeleconferenceEventType["ParticipantJoined"] = "participantJoined";
      CallaTeleconferenceEventType["ParticipantLeft"] = "participantLeft";
      CallaTeleconferenceEventType["UserNameChanged"] = "userNameChanged";
      CallaTeleconferenceEventType["AudioMuteStatusChanged"] = "audioMuteStatucChanged";
      CallaTeleconferenceEventType["VideoMuteStatusChanged"] = "videoMuteStatucChanged";
      CallaTeleconferenceEventType["AudioActivity"] = "audioActivity";
      CallaTeleconferenceEventType["AudioAdded"] = "audioAdded";
      CallaTeleconferenceEventType["AudioRemoved"] = "audioRemoved";
      CallaTeleconferenceEventType["VideoAdded"] = "videoAdded";
      CallaTeleconferenceEventType["VideoRemoved"] = "videoRemoved";
  })(CallaTeleconferenceEventType || (CallaTeleconferenceEventType = {}));
  var CallaMetadataEventType;
  (function (CallaMetadataEventType) {
      CallaMetadataEventType["UserPosed"] = "userPosed";
      CallaMetadataEventType["UserPointer"] = "userPointer";
      CallaMetadataEventType["SetAvatarEmoji"] = "setAvatarEmoji";
      CallaMetadataEventType["AvatarChanged"] = "avatarChanged";
      CallaMetadataEventType["Emote"] = "emote";
      CallaMetadataEventType["Chat"] = "chat";
  })(CallaMetadataEventType || (CallaMetadataEventType = {}));
  class CallaEvent extends Event {
      constructor(eventType) {
          super(eventType);
          this.eventType = eventType;
      }
  }
  class CallaTeleconferenceServerConnectedEvent extends CallaEvent {
      constructor() {
          super(CallaTeleconferenceEventType.ServerConnected);
      }
  }
  class CallaTeleconferenceServerDisconnectedEvent extends CallaEvent {
      constructor() {
          super(CallaTeleconferenceEventType.ServerDisconnected);
      }
  }
  class CallaTeleconferenceServerFailedEvent extends CallaEvent {
      constructor() {
          super(CallaTeleconferenceEventType.ServerFailed);
      }
  }
  class CallaUserEvent extends CallaEvent {
      constructor(type, id) {
          super(type);
          this.id = id;
      }
  }
  class CallaParticipantEvent extends CallaUserEvent {
      constructor(type, id, displayName) {
          super(type, id);
          this.displayName = displayName;
      }
  }
  class CallaConferenceJoinedEvent extends CallaUserEvent {
      constructor(id, pose) {
          super(CallaTeleconferenceEventType.ConferenceJoined, id);
          this.pose = pose;
      }
  }
  class CallaConferenceLeftEvent extends CallaUserEvent {
      constructor(id) {
          super(CallaTeleconferenceEventType.ConferenceLeft, id);
      }
  }
  class CallaConferenceFailedEvent extends CallaEvent {
      constructor() {
          super(CallaTeleconferenceEventType.ConferenceFailed);
      }
  }
  class CallaParticipantJoinedEvent extends CallaParticipantEvent {
      constructor(id, displayName, source) {
          super(CallaTeleconferenceEventType.ParticipantJoined, id, displayName);
          this.source = source;
      }
  }
  class CallaParticipantLeftEvent extends CallaUserEvent {
      constructor(id) {
          super(CallaTeleconferenceEventType.ParticipantLeft, id);
      }
  }
  class CallaParticipantNameChangeEvent extends CallaParticipantEvent {
      constructor(id, displayName) {
          super(CallaTeleconferenceEventType.UserNameChanged, id, displayName);
      }
  }
  class CallaUserMutedEvent extends CallaUserEvent {
      constructor(type, id, muted) {
          super(type, id);
          this.muted = muted;
      }
  }
  class CallaUserAudioMutedEvent extends CallaUserMutedEvent {
      constructor(id, muted) {
          super(CallaTeleconferenceEventType.AudioMuteStatusChanged, id, muted);
      }
  }
  class CallaUserVideoMutedEvent extends CallaUserMutedEvent {
      constructor(id, muted) {
          super(CallaTeleconferenceEventType.VideoMuteStatusChanged, id, muted);
      }
  }
  var StreamType;
  (function (StreamType) {
      StreamType["Audio"] = "audio";
      StreamType["Video"] = "video";
  })(StreamType || (StreamType = {}));
  var StreamOpType;
  (function (StreamOpType) {
      StreamOpType["Added"] = "added";
      StreamOpType["Removed"] = "removed";
      StreamOpType["Changed"] = "changed";
  })(StreamOpType || (StreamOpType = {}));
  class CallaStreamEvent extends CallaUserEvent {
      constructor(type, kind, op, id, stream) {
          super(type, id);
          this.kind = kind;
          this.op = op;
          this.stream = stream;
      }
  }
  class CallaStreamAddedEvent extends CallaStreamEvent {
      constructor(type, kind, id, stream) {
          super(type, kind, StreamOpType.Added, id, stream);
      }
  }
  class CallaStreamRemovedEvent extends CallaStreamEvent {
      constructor(type, kind, id, stream) {
          super(type, kind, StreamOpType.Removed, id, stream);
      }
  }
  class CallaAudioStreamAddedEvent extends CallaStreamAddedEvent {
      constructor(id, stream) {
          super(CallaTeleconferenceEventType.AudioAdded, StreamType.Audio, id, stream);
      }
  }
  class CallaAudioStreamRemovedEvent extends CallaStreamRemovedEvent {
      constructor(id, stream) {
          super(CallaTeleconferenceEventType.AudioRemoved, StreamType.Audio, id, stream);
      }
  }
  class CallaVideoStreamAddedEvent extends CallaStreamAddedEvent {
      constructor(id, stream) {
          super(CallaTeleconferenceEventType.VideoAdded, StreamType.Video, id, stream);
      }
  }
  class CallaVideoStreamRemovedEvent extends CallaStreamRemovedEvent {
      constructor(id, stream) {
          super(CallaTeleconferenceEventType.VideoRemoved, StreamType.Video, id, stream);
      }
  }
  class CallaPoseEvent extends CallaUserEvent {
      constructor(type, id, px, py, pz, fx, fy, fz, ux, uy, uz) {
          super(type, id);
          this.px = px;
          this.py = py;
          this.pz = pz;
          this.fx = fx;
          this.fy = fy;
          this.fz = fz;
          this.ux = ux;
          this.uy = uy;
          this.uz = uz;
      }
      set(px, py, pz, fx, fy, fz, ux, uy, uz) {
          this.px = px;
          this.py = py;
          this.pz = pz;
          this.fx = fx;
          this.fy = fy;
          this.fz = fz;
          this.ux = ux;
          this.uy = uy;
          this.uz = uz;
      }
  }
  class CallaUserPosedEvent extends CallaPoseEvent {
      constructor(id, px, py, pz, fx, fy, fz, ux, uy, uz) {
          super(CallaMetadataEventType.UserPosed, id, px, py, pz, fx, fy, fz, ux, uy, uz);
      }
  }
  class CallaUserPointerEvent extends CallaPoseEvent {
      constructor(id, name, px, py, pz, fx, fy, fz, ux, uy, uz) {
          super(CallaMetadataEventType.UserPointer, id, px, py, pz, fx, fy, fz, ux, uy, uz);
          this.name = name;
      }
  }
  class CallaEmojiEvent extends CallaUserEvent {
      constructor(type, id, emoji) {
          super(type, id);
          if (emoji instanceof Emoji) {
              this.emoji = emoji.value;
          }
          else {
              this.emoji = emoji;
          }
      }
  }
  class CallaEmoteEvent extends CallaEmojiEvent {
      constructor(id, emoji) {
          super(CallaMetadataEventType.Emote, id, emoji);
      }
  }
  class CallaEmojiAvatarEvent extends CallaEmojiEvent {
      constructor(id, emoji) {
          super(CallaMetadataEventType.SetAvatarEmoji, id, emoji);
      }
  }
  class CallaAvatarChangedEvent extends CallaUserEvent {
      constructor(id, url) {
          super(CallaMetadataEventType.AvatarChanged, id);
          this.url = url;
      }
  }
  class CallaChatEvent extends CallaUserEvent {
      constructor(id, text) {
          super(CallaMetadataEventType.Chat, id);
          this.text = text;
      }
  }

  class BaseMetadataClient extends TypedEventBase {
      constructor(sleepTime) {
          super();
          this.sleepTime = sleepTime;
          this.tasks = new Map();
      }
      async getNext(evtName, userID) {
          return new Promise((resolve) => {
              const getter = (evt) => {
                  if (evt instanceof CallaUserEvent
                      && evt.id === userID) {
                      this.removeEventListener(evtName, getter);
                      resolve(evt);
                  }
              };
              this.addEventListener(evtName, getter);
          });
      }
      get isConnected() {
          return this.metadataState === HubConnectionState.Connected;
      }
      async callThrottled(key, command, ...args) {
          if (!this.tasks.has(key)) {
              const start = performance.now();
              const task = this.callInternal(command, ...args);
              this.tasks.set(key, task);
              await task;
              const delta = performance.now() - start;
              const sleepTime = this.sleepTime - delta;
              if (sleepTime > 0) {
                  await sleep(this.sleepTime);
              }
              this.tasks.delete(key);
          }
      }
      async callImmediate(command, ...args) {
          await this.callInternal(command, ...args);
      }
      setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
          this.callThrottled(CallaMetadataEventType.UserPosed, CallaMetadataEventType.UserPosed, px, py, pz, fx, fy, fz, ux, uy, uz);
      }
      setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz) {
          this.callImmediate(CallaMetadataEventType.UserPosed, px, py, pz, fx, fy, fz, ux, uy, uz);
      }
      setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
          this.callThrottled(CallaMetadataEventType.UserPointer + name, CallaMetadataEventType.UserPointer, name, px, py, pz, fx, fy, fz, ux, uy, uz);
      }
      setAvatarEmoji(emoji) {
          this.callImmediate(CallaMetadataEventType.SetAvatarEmoji, emoji);
      }
      setAvatarURL(url) {
          this.callImmediate(CallaMetadataEventType.AvatarChanged, url);
      }
      emote(emoji) {
          this.callImmediate(CallaMetadataEventType.Emote, emoji);
      }
      chat(text) {
          this.callImmediate(CallaMetadataEventType.Chat, text);
      }
  }

  const JITSI_HAX_FINGERPRINT = "Calla";
  class JitsiMetadataClient extends BaseMetadataClient {
      constructor(tele) {
          super(250);
          this.tele = tele;
          this._status = HubConnectionState.Disconnected;
          this.remoteUserIDs = new Array();
          this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantJoined, (evt) => {
              arraySortedInsert(this.remoteUserIDs, evt.id, false);
          });
          this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantLeft, (evt) => {
              arrayRemove(this.remoteUserIDs, evt.id);
          });
      }
      get metadataState() {
          return this._status;
      }
      async connect() {
          // JitsiTeleconferenceClient will already connect
      }
      async join(_roomName) {
          // JitsiTeleconferenceClient will already join
          this._status = HubConnectionState.Connecting;
          this.tele.conference.addEventListener(JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED, (user, data) => {
              if (data.hax === JITSI_HAX_FINGERPRINT) {
                  const fromUserID = user.getId();
                  const command = data.command;
                  const values = data.values;
                  switch (command) {
                      case CallaMetadataEventType.AvatarChanged:
                          this.dispatchEvent(new CallaAvatarChangedEvent(fromUserID, values[0]));
                          break;
                      case CallaMetadataEventType.Emote:
                          this.dispatchEvent(new CallaEmoteEvent(fromUserID, values[0]));
                          break;
                      case CallaMetadataEventType.SetAvatarEmoji:
                          this.dispatchEvent(new CallaEmojiAvatarEvent(fromUserID, values[0]));
                          break;
                      case CallaMetadataEventType.UserPosed:
                          this.dispatchEvent(new CallaUserPosedEvent(fromUserID, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8]));
                          break;
                      case CallaMetadataEventType.UserPointer:
                          this.dispatchEvent(new CallaUserPointerEvent(fromUserID, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9]));
                          break;
                      case CallaMetadataEventType.Chat:
                          this.dispatchEvent(new CallaChatEvent(fromUserID, values[0]));
                          break;
                      default:
                          console.warn("Unknown message type:", command, "from user:", fromUserID, "values:", values);
                          break;
                  }
              }
          });
          await once(this.tele.conference, JitsiMeetJS.events.conference.DATA_CHANNEL_OPENED);
          this._status = HubConnectionState.Connected;
      }
      async leave() {
          // JitsiTeleconferenceClient will already leave
          this._status = HubConnectionState.Disconnected;
      }
      async identify(_userName) {
          // JitsiTeleconferenceClient will already identify the user
      }
      async disconnect() {
          // JitsiTeleconferenceClient will already disconnect
      }
      sendJitsiHax(toUserID, command, ...values) {
          this.tele.conference.sendMessage({
              hax: JITSI_HAX_FINGERPRINT,
              command,
              values
          }, toUserID);
      }
      callInternal(command, ...values) {
          for (const toUserID of this.remoteUserIDs) {
              this.sendJitsiHax(toUserID, command, ...values);
          }
          return Promise.resolve();
      }
      async stopInternal() {
          this._status = HubConnectionState.Disconnecting;
          await waitFor(() => this.metadataState === HubConnectionState.Disconnected);
      }
  }

  function addLogger(obj, evtName) {
      obj.addEventListener(evtName, (...rest) => {
          if (loggingEnabled) {
              console.log(">== CALLA ==<", evtName, ...rest);
          }
      });
  }
  function filterDeviceDuplicates(devices) {
      const filtered = [];
      for (let i = 0; i < devices.length; ++i) {
          const a = devices[i];
          let found = false;
          for (let j = 0; j < filtered.length && !found; ++j) {
              const b = filtered[j];
              found = a.kind === b.kind && b.label.indexOf(a.label) > 0;
          }
          if (!found) {
              filtered.push(a);
          }
      }
      return filtered;
  }
  const PREFERRED_AUDIO_OUTPUT_ID_KEY = "calla:preferredAudioOutputID";
  const PREFERRED_AUDIO_INPUT_ID_KEY = "calla:preferredAudioInputID";
  const PREFERRED_VIDEO_INPUT_ID_KEY = "calla:preferredVideoInputID";
  const DEFAULT_LOCAL_USER_ID = "local-user";
  let loggingEnabled = window.location.hostname === "localhost"
      || /\bdebug\b/.test(window.location.search);
  class BaseTeleconferenceClient extends TypedEventBase {
      constructor(getBlob) {
          super();
          this.localUserID = null;
          this.localUserName = null;
          this.roomName = null;
          this._prepared = false;
          this._connectionState = HubConnectionState.Disconnected;
          this._conferenceState = HubConnectionState.Disconnected;
          this.hasAudioPermission = false;
          this.hasVideoPermission = false;
          this.audio = new AudioManager(isOculusQuest
              ? SpatializerType.High
              : SpatializerType.Medium, getBlob);
          this.addEventListener(CallaTeleconferenceEventType.ServerConnected, this.setConnectionState.bind(this, HubConnectionState.Connected));
          this.addEventListener(CallaTeleconferenceEventType.ServerFailed, this.setConnectionState.bind(this, HubConnectionState.Disconnected));
          this.addEventListener(CallaTeleconferenceEventType.ServerDisconnected, this.setConnectionState.bind(this, HubConnectionState.Disconnected));
          this.addEventListener(CallaTeleconferenceEventType.ConferenceJoined, this.setConferenceState.bind(this, HubConnectionState.Connected));
          this.addEventListener(CallaTeleconferenceEventType.ConferenceFailed, this.setConferenceState.bind(this, HubConnectionState.Disconnected));
          this.addEventListener(CallaTeleconferenceEventType.ConferenceRestored, this.setConferenceState.bind(this, HubConnectionState.Connected));
          this.addEventListener(CallaTeleconferenceEventType.ConferenceLeft, this.setConferenceState.bind(this, HubConnectionState.Disconnected));
      }
      toggleLogging() {
          loggingEnabled = !loggingEnabled;
      }
      get connectionState() {
          return this._connectionState;
      }
      setConnectionState(state) {
          this._connectionState = state;
      }
      get conferenceState() {
          return this._conferenceState;
      }
      setConferenceState(state) {
          this._conferenceState = state;
      }
      dispatchEvent(evt) {
          if (evt instanceof CallaUserEvent
              && (evt.id == null
                  || evt.id === "local")) {
              if (this.localUserID === DEFAULT_LOCAL_USER_ID) {
                  evt.id = null;
              }
              else {
                  evt.id = this.localUserID;
              }
          }
          return super.dispatchEvent(evt);
      }
      async getNext(evtName, userID) {
          return new Promise((resolve) => {
              const getter = (evt) => {
                  if (evt instanceof CallaUserEvent
                      && evt.id === userID) {
                      this.removeEventListener(evtName, getter);
                      resolve(evt);
                  }
              };
              this.addEventListener(evtName, getter);
          });
      }
      get preferredAudioInputID() {
          return localStorage.getItem(PREFERRED_AUDIO_INPUT_ID_KEY);
      }
      set preferredAudioInputID(v) {
          localStorage.setItem(PREFERRED_AUDIO_INPUT_ID_KEY, v);
      }
      get preferredVideoInputID() {
          return localStorage.getItem(PREFERRED_VIDEO_INPUT_ID_KEY);
      }
      set preferredVideoInputID(v) {
          localStorage.setItem(PREFERRED_VIDEO_INPUT_ID_KEY, v);
      }
      async setPreferredDevices() {
          await this.setPreferredAudioInput(true);
          await this.setPreferredVideoInput(false);
          await this.setPreferredAudioOutput(true);
      }
      async getPreferredAudioInput(allowAny) {
          const devices = await this.getAudioInputDevices();
          const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioInputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => allowAny && d.deviceId.length > 0);
          return device;
      }
      async setPreferredAudioInput(allowAny) {
          const device = await this.getPreferredAudioInput(allowAny);
          if (device) {
              await this.setAudioInputDevice(device);
          }
      }
      async getPreferredVideoInput(allowAny) {
          const devices = await this.getVideoInputDevices();
          const device = arrayScan(devices, (d) => d.deviceId === this.preferredVideoInputID, (d) => allowAny && d && /front/i.test(d.label), (d) => allowAny && d.deviceId.length > 0);
          return device;
      }
      async setPreferredVideoInput(allowAny) {
          const device = await this.getPreferredVideoInput(allowAny);
          if (device) {
              await this.setVideoInputDevice(device);
          }
      }
      async getDevices() {
          let devices = null;
          for (let i = 0; i < 3; ++i) {
              devices = await navigator.mediaDevices.enumerateDevices();
              for (const device of devices) {
                  if (device.deviceId.length > 0) {
                      this.hasAudioPermission = this.hasAudioPermission || device.kind === "audioinput" && device.label.length > 0;
                      this.hasVideoPermission = this.hasVideoPermission || device.kind === "videoinput" && device.label.length > 0;
                  }
              }
              if (this.hasAudioPermission) {
                  break;
              }
              try {
                  await navigator.mediaDevices.getUserMedia({ audio: !this.hasAudioPermission, video: !this.hasVideoPermission });
              }
              catch (exp) {
                  console.warn(exp);
              }
          }
          return devices || [];
      }
      async getMediaPermissions() {
          await this.getDevices();
          return {
              audio: this.hasAudioPermission,
              video: this.hasVideoPermission
          };
      }
      async getAvailableDevices(filterDuplicates = false) {
          let devices = await this.getDevices();
          if (filterDuplicates) {
              devices = filterDeviceDuplicates(devices);
          }
          return {
              audioOutput: canChangeAudioOutput ? devices.filter(d => d.kind === "audiooutput") : [],
              audioInput: devices.filter(d => d.kind === "audioinput"),
              videoInput: devices.filter(d => d.kind === "videoinput")
          };
      }
      async getAudioInputDevices(filterDuplicates = false) {
          const devices = await this.getAvailableDevices(filterDuplicates);
          return devices && devices.audioInput || [];
      }
      async getVideoInputDevices(filterDuplicates = false) {
          const devices = await this.getAvailableDevices(filterDuplicates);
          return devices && devices.videoInput || [];
      }
      async setAudioOutputDevice(device) {
          if (canChangeAudioOutput) {
              this.preferredAudioOutputID = device && device.deviceId || null;
          }
      }
      async getAudioOutputDevices(filterDuplicates = false) {
          if (!canChangeAudioOutput) {
              return [];
          }
          const devices = await this.getAvailableDevices(filterDuplicates);
          return devices && devices.audioOutput || [];
      }
      async getCurrentAudioOutputDevice() {
          if (!canChangeAudioOutput) {
              return null;
          }
          const curId = this.audio.getAudioOutputDeviceID(), devices = await this.getAudioOutputDevices(), device = devices.filter((d) => curId != null && d.deviceId === curId
              || curId == null && d.deviceId === this.preferredAudioOutputID);
          if (device.length === 0) {
              return null;
          }
          else {
              return device[0];
          }
      }
      get preferredAudioOutputID() {
          return localStorage.getItem(PREFERRED_AUDIO_OUTPUT_ID_KEY);
      }
      set preferredAudioOutputID(v) {
          localStorage.setItem(PREFERRED_AUDIO_OUTPUT_ID_KEY, v);
      }
      async getPreferredAudioOutput(allowAny) {
          const devices = await this.getAudioOutputDevices();
          const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioOutputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => allowAny && d.deviceId.length > 0);
          return device;
      }
      async setPreferredAudioOutput(allowAny) {
          const device = await this.getPreferredAudioOutput(allowAny);
          if (device) {
              await this.setAudioOutputDevice(device);
          }
      }
      async setAudioInputDevice(device) {
          this.preferredAudioInputID = device && device.deviceId || null;
      }
      async setVideoInputDevice(device) {
          this.preferredVideoInputID = device && device.deviceId || null;
      }
      async connect() {
          this.setConnectionState(HubConnectionState.Connecting);
      }
      async join(_roomName, _password) {
          this.setConferenceState(HubConnectionState.Connecting);
      }
      async leave() {
          this.setConferenceState(HubConnectionState.Disconnecting);
      }
      async disconnect() {
          this.setConnectionState(HubConnectionState.Disconnecting);
      }
  }

  const jQueryPath = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js";
  function encodeUserName(v) {
      try {
          return encodeURIComponent(v);
      }
      catch (exp) {
          return v;
      }
  }
  function decodeUserName(v) {
      try {
          return decodeURIComponent(v);
      }
      catch (exp) {
          return v;
      }
  }
  class JitsiTeleconferenceClient extends BaseTeleconferenceClient {
      constructor(getBlob, loadScript) {
          super(getBlob);
          this.loadScript = loadScript;
          this.usingDefaultMetadataClient = false;
          this.host = null;
          this.bridgeHost = null;
          this.bridgeMUC = null;
          this.connection = null;
          this.conference = null;
          this.tracks = new Map();
          this.listenersForObjs = new Map();
      }
      _on(obj, evtName, handler) {
          let objListeners = this.listenersForObjs.get(obj);
          if (!objListeners) {
              this.listenersForObjs.set(obj, objListeners = new Map());
          }
          let evtListeners = objListeners.get(evtName);
          if (!evtListeners) {
              objListeners.set(evtName, evtListeners = new Array());
          }
          evtListeners.push(handler);
          obj.addEventListener(evtName, handler);
      }
      _off(obj) {
          const objListeners = this.listenersForObjs.get(obj);
          if (objListeners) {
              this.listenersForObjs.delete(obj);
              for (const [evtName, handlers] of objListeners.entries()) {
                  for (const handler of handlers) {
                      obj.removeEventListener(evtName, handler);
                  }
                  arrayClear(handlers);
              }
              objListeners.clear();
          }
      }
      getDefaultMetadataClient() {
          this.usingDefaultMetadataClient = true;
          return new JitsiMetadataClient(this);
      }
      async prepare(JITSI_HOST, JVB_HOST, JVB_MUC, onProgress) {
          if (!this._prepared) {
              this.host = JITSI_HOST;
              this.bridgeHost = JVB_HOST;
              this.bridgeMUC = JVB_MUC;
              console.info("Connecting to:", this.host);
              const progs = splitProgress(onProgress, 2);
              await this.loadScript(jQueryPath, () => "jQuery" in globalThis, progs.shift());
              await this.loadScript(`https://${this.host}/libs/lib-jitsi-meet.min.js`, () => "JitsiMeetJS" in globalThis, progs.shift());
              {
                  JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
              }
              JitsiMeetJS.init();
              this._prepared = true;
          }
      }
      async connect() {
          await super.connect();
          const connectionEvents = JitsiMeetJS.events.connection;
          this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
              hosts: {
                  domain: this.bridgeHost,
                  muc: this.bridgeMUC
              },
              serviceUrl: `https://${this.host}/http-bind`
          });
          for (const evtName of Object.values(connectionEvents)) {
              addLogger(this.connection, evtName);
          }
          const onDisconnect = () => {
              if (this.connection) {
                  this._off(this.connection);
                  this.connection = null;
              }
          };
          const fwd = (evtName, EvtClass, extra) => {
              this._on(this.connection, evtName, () => {
                  this.dispatchEvent(new EvtClass());
                  if (extra) {
                      extra();
                  }
              });
          };
          fwd(connectionEvents.CONNECTION_ESTABLISHED, CallaTeleconferenceServerConnectedEvent);
          fwd(connectionEvents.CONNECTION_DISCONNECTED, CallaTeleconferenceServerDisconnectedEvent, onDisconnect);
          fwd(connectionEvents.CONNECTION_FAILED, CallaTeleconferenceServerFailedEvent, onDisconnect);
          const connectTask = once(this.connection, connectionEvents.CONNECTION_ESTABLISHED);
          this.connection.connect();
          await connectTask;
      }
      async join(roomName, password) {
          await super.join(roomName, password);
          const isoRoomName = roomName.toLocaleLowerCase();
          if (isoRoomName !== this.roomName) {
              if (this.conference) {
                  await this.leave();
              }
              this.roomName = isoRoomName;
              this.conference = this.connection.initJitsiConference(this.roomName, {
                  openBridgeChannel: this.usingDefaultMetadataClient,
                  p2p: { enabled: false },
                  startVideoMuted: true
              });
              const conferenceEvents = JitsiMeetJS.events.conference;
              for (const evtName of Object.values(conferenceEvents)) {
                  if (evtName !== "conference.audioLevelsChanged") {
                      addLogger(this.conference, evtName);
                  }
              }
              const fwd = (evtName, EvtClass, extra) => {
                  this._on(this.conference, evtName, () => {
                      this.dispatchEvent(new EvtClass());
                      if (extra) {
                          extra();
                      }
                  });
              };
              const onLeft = async () => {
                  this.localUserID = DEFAULT_LOCAL_USER_ID;
                  if (this.tracks.size > 0) {
                      console.warn("><> CALLA <>< ---- there are leftover conference tracks");
                      for (const userID of this.tracks.keys()) {
                          await this.tryRemoveTrack(userID, StreamType.Video);
                          await this.tryRemoveTrack(userID, StreamType.Audio);
                          this.dispatchEvent(new CallaParticipantLeftEvent(userID));
                      }
                  }
                  this.dispatchEvent(new CallaConferenceLeftEvent(this.localUserID));
                  if (this.conference) {
                      this._off(this.conference);
                      this.conference = null;
                  }
              };
              fwd(conferenceEvents.CONFERENCE_ERROR, CallaConferenceFailedEvent, onLeft);
              fwd(conferenceEvents.CONFERENCE_FAILED, CallaConferenceFailedEvent, onLeft);
              fwd(conferenceEvents.CONNECTION_INTERRUPTED, CallaConferenceFailedEvent, onLeft);
              this._on(this.conference, conferenceEvents.CONFERENCE_JOINED, async () => {
                  const userID = this.conference.myUserId();
                  if (userID) {
                      this.localUserID = userID;
                      this.dispatchEvent(new CallaConferenceJoinedEvent(userID, null));
                  }
              });
              this._on(this.conference, conferenceEvents.CONFERENCE_LEFT, onLeft);
              this._on(this.conference, conferenceEvents.USER_JOINED, (id, jitsiUser) => {
                  this.dispatchEvent(new CallaParticipantJoinedEvent(id, decodeUserName(jitsiUser.getDisplayName()), null));
              });
              this._on(this.conference, conferenceEvents.USER_LEFT, (id) => {
                  this.dispatchEvent(new CallaParticipantLeftEvent(id));
              });
              this._on(this.conference, conferenceEvents.DISPLAY_NAME_CHANGED, (id, displayName) => {
                  this.dispatchEvent(new CallaParticipantNameChangeEvent(id, decodeUserName(displayName)));
              });
              const onTrackMuteChanged = (track, muted) => {
                  const userID = track.getParticipantId() || this.localUserID, trackKind = track.getType(), evt = trackKind === StreamType.Audio
                      ? new CallaUserAudioMutedEvent(userID, muted)
                      : new CallaUserVideoMutedEvent(userID, muted);
                  this.dispatchEvent(evt);
              };
              this._on(this.conference, conferenceEvents.TRACK_ADDED, (track) => {
                  const userID = track.getParticipantId() || this.localUserID, trackKind = track.getType(), trackAddedEvt = trackKind === StreamType.Audio
                      ? new CallaAudioStreamAddedEvent(userID, track.stream)
                      : new CallaVideoStreamAddedEvent(userID, track.stream);
                  let userTracks = this.tracks.get(userID);
                  if (!userTracks) {
                      userTracks = new Map();
                      this.tracks.set(userID, userTracks);
                  }
                  const curTrack = userTracks.get(trackKind);
                  if (curTrack) {
                      const trackRemovedEvt = StreamType.Audio
                          ? new CallaAudioStreamRemovedEvent(userID, curTrack.stream)
                          : new CallaVideoStreamRemovedEvent(userID, curTrack.stream);
                      this.dispatchEvent(trackRemovedEvt);
                      curTrack.dispose();
                  }
                  userTracks.set(trackKind, track);
                  this.dispatchEvent(trackAddedEvt);
                  track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, (track) => {
                      onTrackMuteChanged(track, track.isMuted());
                  });
                  onTrackMuteChanged(track, false);
              });
              this._on(this.conference, conferenceEvents.TRACK_REMOVED, (track) => {
                  using(track, (_) => {
                      const userID = track.getParticipantId() || this.localUserID, trackKind = track.getType(), trackRemovedEvt = StreamType.Audio
                          ? new CallaAudioStreamRemovedEvent(userID, track.stream)
                          : new CallaVideoStreamRemovedEvent(userID, track.stream);
                      onTrackMuteChanged(track, true);
                      this.dispatchEvent(trackRemovedEvt);
                      const userTracks = this.tracks.get(userID);
                      if (userTracks) {
                          const curTrack = userTracks.get(trackKind);
                          if (curTrack) {
                              userTracks.delete(trackKind);
                              if (userTracks.size === 0) {
                                  this.tracks.delete(userID);
                              }
                              if (curTrack !== track) {
                                  curTrack.dispose();
                              }
                          }
                      }
                  });
              });
              const joinTask = once(this, CallaTeleconferenceEventType.ConferenceJoined);
              this.conference.join(password);
              await joinTask;
          }
      }
      async identify(userName) {
          this.localUserName = userName;
          this.conference.setDisplayName(encodeUserName(userName));
      }
      async tryRemoveTrack(userID, kind) {
          const userTracks = this.tracks.get(userID);
          const EvtClass = kind === StreamType.Video
              ? CallaVideoStreamRemovedEvent
              : CallaAudioStreamRemovedEvent;
          if (userTracks) {
              const track = userTracks.get(kind);
              if (track) {
                  this.dispatchEvent(new EvtClass(userID, track.stream));
                  userTracks.delete(kind);
                  try {
                      if (this.conference && track.isLocal) {
                          this.conference.removeTrack(track);
                      }
                  }
                  catch (exp) {
                      console.warn(exp);
                  }
                  finally {
                      track.dispose();
                  }
              }
              if (userTracks.size === 0) {
                  this.tracks.delete(userID);
              }
          }
      }
      async leave() {
          if (this.conferenceState === HubConnectionState.Connecting) {
              await waitFor(() => this.conferenceState === HubConnectionState.Connected);
          }
          if (this.conferenceState === HubConnectionState.Disconnecting) {
              await waitFor(() => this.conferenceState === HubConnectionState.Disconnected);
          }
          else if (this.conferenceState === HubConnectionState.Connected) {
              await super.leave();
              try {
                  await this.tryRemoveTrack(this.localUserID, StreamType.Video);
                  await this.tryRemoveTrack(this.localUserID, StreamType.Audio);
                  const leaveTask = once(this, CallaTeleconferenceEventType.ConferenceLeft);
                  this.conference.leave();
                  await leaveTask;
              }
              catch (exp) {
                  console.warn("><> CALLA <>< ---- Failed to leave teleconference.", exp);
              }
          }
      }
      async disconnect() {
          if (this.connectionState === HubConnectionState.Connecting) {
              await waitFor(() => this.connectionState === HubConnectionState.Connected);
          }
          if (this.connectionState === HubConnectionState.Disconnecting) {
              await waitFor(() => this.connectionState === HubConnectionState.Disconnected);
          }
          else if (this.connectionState === HubConnectionState.Connected) {
              await super.disconnect();
              await this.leave();
              const disconnectTask = once(this, CallaTeleconferenceEventType.ServerDisconnected);
              this.connection.disconnect();
              await disconnectTask;
          }
      }
      userExists(id) {
          return this.conference
              && this.conference.participants
              && id in this.conference.participants;
      }
      getUserNames() {
          if (this.conference) {
              return Object.keys(this.conference.participants)
                  .map(k => [k, decodeUserName(this.conference.participants[k].getDisplayName())]);
          }
          else {
              return [];
          }
      }
      getCurrentMediaTrack(type) {
          if (this.localUserID === DEFAULT_LOCAL_USER_ID) {
              return null;
          }
          const userTracks = this.tracks.get(this.localUserID);
          if (!userTracks) {
              return null;
          }
          return userTracks.get(type);
      }
      async setAudioInputDevice(device) {
          await super.setAudioInputDevice(device);
          const cur = this.getCurrentMediaTrack(StreamType.Audio);
          if (cur) {
              const removeTask = this.getNext(CallaTeleconferenceEventType.AudioRemoved, this.localUserID);
              this.conference.removeTrack(cur);
              await removeTask;
          }
          if (this.conference && this.preferredAudioInputID) {
              const addTask = this.getNext(CallaTeleconferenceEventType.AudioAdded, this.localUserID);
              const tracks = await JitsiMeetJS.createLocalTracks({
                  devices: ["audio"],
                  micDeviceId: this.preferredAudioInputID,
                  constraints: {
                      autoGainControl: true,
                      echoCancellation: true,
                      noiseSuppression: true
                  }
              });
              for (const track of tracks) {
                  this.conference.addTrack(track);
              }
              await addTask;
          }
      }
      async setVideoInputDevice(device) {
          await super.setVideoInputDevice(device);
          const cur = this.getCurrentMediaTrack(StreamType.Video);
          if (cur) {
              const removeTask = this.getNext(CallaTeleconferenceEventType.VideoRemoved, this.localUserID);
              this.conference.removeTrack(cur);
              await removeTask;
          }
          if (this.conference && this.preferredVideoInputID) {
              const addTask = this.getNext(CallaTeleconferenceEventType.VideoAdded, this.localUserID);
              const tracks = await JitsiMeetJS.createLocalTracks({
                  devices: ["video"],
                  cameraDeviceId: this.preferredVideoInputID
              });
              for (const track of tracks) {
                  this.conference.addTrack(track);
              }
              await addTask;
          }
      }
      async getCurrentAudioInputDevice() {
          const cur = this.getCurrentMediaTrack(StreamType.Audio), devices = await this.getAudioInputDevices(), device = devices.filter((d) => cur != null && d.deviceId === cur.getDeviceId()
              || cur == null && d.deviceId === this.preferredAudioInputID);
          if (device.length === 0) {
              return null;
          }
          else {
              return device[0];
          }
      }
      async getCurrentVideoInputDevice() {
          const cur = this.getCurrentMediaTrack(StreamType.Video), devices = await this.getVideoInputDevices(), device = devices.filter((d) => cur != null && d.deviceId === cur.getDeviceId()
              || cur == null && d.deviceId === this.preferredVideoInputID);
          if (device.length === 0) {
              return null;
          }
          else {
              return device[0];
          }
      }
      async toggleAudioMuted() {
          const changeTask = this.getNext(CallaTeleconferenceEventType.AudioMuteStatusChanged, this.localUserID);
          const cur = this.getCurrentMediaTrack(StreamType.Audio);
          if (cur) {
              const muted = cur.isMuted();
              if (muted) {
                  await cur.unmute();
              }
              else {
                  await cur.mute();
              }
          }
          else {
              await this.setPreferredAudioInput(true);
          }
          const evt = await changeTask;
          return evt.muted;
      }
      async toggleVideoMuted() {
          const changeTask = this.getNext(CallaTeleconferenceEventType.VideoMuteStatusChanged, this.localUserID);
          const cur = this.getCurrentMediaTrack(StreamType.Video);
          if (cur) {
              await this.setVideoInputDevice(null);
          }
          else {
              await this.setPreferredVideoInput(true);
          }
          const evt = await changeTask;
          return evt.muted;
      }
      isMediaMuted(type) {
          const cur = this.getCurrentMediaTrack(type);
          return cur == null
              || cur.isMuted();
      }
      async getAudioMuted() {
          return this.isMediaMuted(StreamType.Audio);
      }
      async getVideoMuted() {
          return this.isMediaMuted(StreamType.Video);
      }
  }

  var ConnectionState;
  (function (ConnectionState) {
      ConnectionState["InConference"] = "in-conference";
      ConnectionState["JoiningConference"] = "joining-conference";
      ConnectionState["Connected"] = "connected";
      ConnectionState["Connecting"] = "connecting";
      ConnectionState["Prepaired"] = "prepaired";
      ConnectionState["Prepairing"] = "prepairing";
      ConnectionState["Unprepared"] = "unprepaired";
  })(ConnectionState || (ConnectionState = {}));
  const audioActivityEvt$2 = new AudioActivityEvent();
  class Calla extends TypedEventBase {
      constructor(getBlob$1, loadScript$1, TeleClientType, MetaClientType) {
          super();
          this.isAudioMuted = null;
          this.isVideoMuted = null;
          if (isNullOrUndefined(getBlob$1)) {
              getBlob$1 = getBlob;
          }
          if (isNullOrUndefined(loadScript$1)) {
              loadScript$1 = loadScript;
          }
          if (isNullOrUndefined(TeleClientType)) {
              TeleClientType = JitsiTeleconferenceClient;
          }
          this.tele = new TeleClientType(getBlob$1, loadScript$1);
          if (isNullOrUndefined(MetaClientType)) {
              this.meta = this.tele.getDefaultMetadataClient();
          }
          else {
              this.meta = new MetaClientType(this.tele);
          }
          const fwd = this.dispatchEvent.bind(this);
          this.tele.addEventListener(CallaTeleconferenceEventType.ServerConnected, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.ServerDisconnected, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.ServerFailed, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceFailed, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceRestored, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.AudioMuteStatusChanged, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.VideoMuteStatusChanged, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceJoined, async (evt) => {
              const user = this.audio.createLocalUser(evt.id);
              evt.pose = user.pose;
              this.dispatchEvent(evt);
              await this.setPreferredDevices();
          });
          this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceLeft, (evt) => {
              this.audio.createLocalUser(evt.id);
              this.dispatchEvent(evt);
          });
          this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantJoined, async (joinEvt) => {
              joinEvt.source = this.audio.createUser(joinEvt.id);
              this.dispatchEvent(joinEvt);
          });
          this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantLeft, (evt) => {
              this.dispatchEvent(evt);
              this.audio.removeUser(evt.id);
          });
          this.tele.addEventListener(CallaTeleconferenceEventType.UserNameChanged, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.VideoAdded, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.VideoRemoved, fwd);
          this.tele.addEventListener(CallaTeleconferenceEventType.AudioAdded, (evt) => {
              const user = this.audio.getUser(evt.id);
              if (user) {
                  let stream = user.streams.get(evt.kind);
                  if (stream) {
                      user.streams.delete(evt.kind);
                  }
                  stream = evt.stream;
                  user.streams.set(evt.kind, stream);
                  if (evt.id !== this.tele.localUserID) {
                      this.audio.setUserStream(evt.id, stream);
                  }
                  this.dispatchEvent(evt);
              }
          });
          this.tele.addEventListener(CallaTeleconferenceEventType.AudioRemoved, (evt) => {
              const user = this.audio.getUser(evt.id);
              if (user && user.streams.has(evt.kind)) {
                  user.streams.delete(evt.kind);
              }
              if (evt.id !== this.tele.localUserID) {
                  this.audio.setUserStream(evt.id, null);
              }
              this.dispatchEvent(evt);
          });
          this.meta.addEventListener(CallaMetadataEventType.AvatarChanged, fwd);
          this.meta.addEventListener(CallaMetadataEventType.Chat, fwd);
          this.meta.addEventListener(CallaMetadataEventType.Emote, fwd);
          this.meta.addEventListener(CallaMetadataEventType.SetAvatarEmoji, fwd);
          const offsetEvt = (poseEvt) => {
              const O = this.audio.getUserOffset(poseEvt.id);
              if (O) {
                  poseEvt.px += O[0];
                  poseEvt.py += O[1];
                  poseEvt.pz += O[2];
              }
              this.dispatchEvent(poseEvt);
          };
          this.meta.addEventListener(CallaMetadataEventType.UserPointer, offsetEvt);
          this.meta.addEventListener(CallaMetadataEventType.UserPosed, (evt) => {
              this.audio.setUserPose(evt.id, evt.px, evt.py, evt.pz, evt.fx, evt.fy, evt.fz, evt.ux, evt.uy, evt.uz);
              offsetEvt(evt);
          });
          this.audio.addEventListener("audioActivity", (evt) => {
              audioActivityEvt$2.id = evt.id;
              audioActivityEvt$2.isActive = evt.isActive;
              this.dispatchEvent(audioActivityEvt$2);
          });
          const dispose = this.dispose.bind(this);
          window.addEventListener("beforeunload", dispose);
          window.addEventListener("unload", dispose);
          window.addEventListener("pagehide", dispose);
          Object.seal(this);
      }
      get connectionState() {
          return this.tele.connectionState;
      }
      get conferenceState() {
          return this.tele.conferenceState;
      }
      get audio() {
          return this.tele.audio;
      }
      get preferredAudioOutputID() {
          return this.tele.preferredAudioOutputID;
      }
      set preferredAudioOutputID(v) {
          this.tele.preferredAudioOutputID = v;
      }
      get preferredAudioInputID() {
          return this.tele.preferredAudioInputID;
      }
      set preferredAudioInputID(v) {
          this.tele.preferredAudioInputID = v;
      }
      get preferredVideoInputID() {
          return this.tele.preferredVideoInputID;
      }
      set preferredVideoInputID(v) {
          this.tele.preferredVideoInputID = v;
      }
      async getCurrentAudioOutputDevice() {
          return await this.tele.getCurrentAudioOutputDevice();
      }
      async getMediaPermissions() {
          return await this.tele.getMediaPermissions();
      }
      async getAudioOutputDevices(filterDuplicates) {
          return await this.tele.getAudioOutputDevices(filterDuplicates);
      }
      async getAudioInputDevices(filterDuplicates) {
          return await this.tele.getAudioInputDevices(filterDuplicates);
      }
      async getVideoInputDevices(filterDuplicates) {
          return await this.tele.getVideoInputDevices(filterDuplicates);
      }
      dispose() {
          this.leave();
          this.disconnect();
      }
      get offsetRadius() {
          return this.audio.offsetRadius;
      }
      set offsetRadius(v) {
          this.audio.offsetRadius = v;
      }
      setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
          this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz, 0);
          this.meta.setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz);
      }
      setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz) {
          this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz, 0);
          this.meta.setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz);
      }
      setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
          this.meta.setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz);
      }
      setAvatarEmoji(emoji) {
          this.meta.setAvatarEmoji(emoji);
      }
      setAvatarURL(url) {
          this.meta.setAvatarURL(url);
      }
      emote(emoji) {
          this.meta.emote(emoji);
      }
      chat(text) {
          this.meta.chat(text);
      }
      async setPreferredDevices() {
          await this.tele.setPreferredDevices();
      }
      async setAudioInputDevice(device) {
          await this.tele.setAudioInputDevice(device);
      }
      async setVideoInputDevice(device) {
          await this.tele.setVideoInputDevice(device);
      }
      async getCurrentAudioInputDevice() {
          return await this.tele.getCurrentAudioInputDevice();
      }
      async getCurrentVideoInputDevice() {
          return await this.tele.getCurrentVideoInputDevice();
      }
      async toggleAudioMuted() {
          return await this.tele.toggleAudioMuted();
      }
      async toggleVideoMuted() {
          return await this.tele.toggleVideoMuted();
      }
      async getAudioMuted() {
          return await this.tele.getAudioMuted();
      }
      async getVideoMuted() {
          return await this.tele.getVideoMuted();
      }
      get metadataState() {
          return this.meta.metadataState;
      }
      get localUserID() {
          return this.tele.localUserID;
      }
      get localUserName() {
          return this.tele.localUserName;
      }
      get roomName() {
          return this.tele.roomName;
      }
      userExists(id) {
          return this.tele.userExists(id);
      }
      getUserNames() {
          return this.tele.getUserNames();
      }
      async prepare(JITSI_HOST, JVB_HOST, JVB_MUC, onProgress) {
          await this.tele.prepare(JITSI_HOST, JVB_HOST, JVB_MUC, onProgress);
      }
      async connect() {
          await this.tele.connect();
          if (this.tele.connectionState === HubConnectionState.Connected) {
              await this.meta.connect();
          }
      }
      async join(roomName) {
          await this.tele.join(roomName);
          if (this.tele.conferenceState === HubConnectionState.Connected) {
              await this.meta.join(roomName);
          }
      }
      async identify(userName) {
          await this.tele.identify(userName);
          await this.meta.identify(this.localUserID);
      }
      async leave() {
          await this.meta.leave();
          await this.tele.leave();
      }
      async disconnect() {
          await this.meta.disconnect();
          await this.tele.disconnect();
      }
      update() {
          this.audio.update();
      }
      async setAudioOutputDevice(device) {
          this.tele.setAudioOutputDevice(device);
          if (canChangeAudioOutput) {
              await this.audio.setAudioOutputDeviceID(this.tele.preferredAudioOutputID);
          }
      }
      async setAudioMuted(muted) {
          let isMuted = this.isAudioMuted;
          if (muted !== isMuted) {
              isMuted = await this.toggleAudioMuted();
          }
          return isMuted;
      }
      async setVideoMuted(muted) {
          let isMuted = this.isVideoMuted;
          if (muted !== isMuted) {
              isMuted = await this.toggleVideoMuted();
          }
          return isMuted;
      }
  }

  var version$1 = "1.0.0";

  console.info(`Calla v${version$1}.`);

  const JITSI_HOST = "tele.calla.chat";
  const JVB_HOST = JITSI_HOST;
  const JVB_MUC = "conference." + JITSI_HOST;

  const loc = new URL(document.location.href);
  const testNumber = loc.searchParams.get("testUserNumber");
  /**
   * The test instance value that the current window has loaded. This is
   * figured out either from a number in the query string parameter "testUserNumber",
   * or the default value of 1.
   **/
  const userNumber = !isNullOrUndefined(testNumber)
      ? parseInt(testNumber, 10)
      : 1;

  const windows = [];
  // Closes all the windows.
  window.addEventListener("unload", () => {
      for (const w of windows) {
          w.close();
      }
  });
  /**
   * Opens a window that will be closed when the window that opened it is closed.
   * @param href - the location to load in the window
   * @param x - the screen position horizontal component
   * @param y - the screen position vertical component
   * @param width - the screen size horizontal component
   * @param height - the screen size vertical component
   */
  function openWindow(href, x, y, width, height) {
      const w = window.open(href, "_blank", `left=${x},top=${y},width=${width},height=${height}`);
      if (w) {
          windows.push(w);
      }
  }
  /**
   * Opens a new window with a query string parameter that can be used to differentiate different test instances.
   **/
  function openSideTest() {
      const loc = new URL(document.location.href);
      loc.searchParams.set("testUserNumber", (userNumber + windows.length + 1).toString());
      openWindow(loc.href, window.screenLeft + window.outerWidth, 0, window.innerWidth, window.innerHeight);
  }

  // Gets all the named elements in the document so we can
  // setup event handlers on them.
  const controls$1 = {
      roomName: document.getElementById("roomName"),
      userName: document.getElementById("userName"),
      connect: document.getElementById("connect"),
      leave: document.getElementById("leave"),
      space: document.getElementById("space"),
      cams: document.getElementById("cams"),
      mics: document.getElementById("mics"),
      speakers: document.getElementById("speakers")
  };
  /**
   * The animation timer handle, used for later stopping animation.
   **/
  const timer = new RequestAnimationFrameTimer();
  /**
   * The Calla interface, through which teleconferencing sessions and
   * user audio positioning is managed.
   **/
  const client = new Calla();
  /**
   * A place to stow references to our users.
   **/
  const users = new Map();
  /**
   * We need a "user gesture" to create AudioContext objects. The user clicking
   * on the login button is the most natural place for that.
   **/
  async function connect() {
      const roomName = controls$1.roomName.value;
      const userName = controls$1.userName.value;
      // Validate the user input values...
      let message = "";
      if (roomName.length === 0) {
          message += "\n   Room name is required";
      }
      if (userName.length === 0) {
          message += "\n   User name is required";
      }
      if (message.length > 0) {
          message = "Required fields missing:" + message;
          alert(message);
          return;
      }
      controls$1.roomName.disabled = true;
      controls$1.userName.disabled = true;
      controls$1.connect.disabled = true;
      // and start the connection.
      await client.join(roomName);
      await client.identify(userName);
  }
  /**
   * When the video conference has started, we can start
   * displaying content.
   */
  function startGame(id, pose) {
      // Enable the leave button once the user has connected
      // to a conference.
      controls$1.leave.disabled = false;
      // Start the renderer
      timer.start();
      // Create a user graphic for the local user.
      addUser(id, controls$1.userName.value, pose, true);
      // For testing purposes, we place the user at a random location 
      // on the page. Ideally, you'd have a starting location for users
      // so you could design a predictable onboarding path for them.
      setPosition(Math.random() * (controls$1.space.clientWidth - 100) + 50, Math.random() * (controls$1.space.clientHeight - 100) + 50);
  }
  /**
   * Create the graphic for a new user.
   */
  function addUser(id, displayName, pose, isLocal) {
      let user = users.get(id);
      if (user) {
          user.dispose();
          user = null;
      }
      user = new User(id, displayName, pose, isLocal);
      users.set(id, user);
      controls$1.space.append(user.container);
      if (!isLocal) {
          const local = users.get(client.localUserID);
          if (local) {
              const { p, f, u } = local.pose.end;
              client.setLocalPoseImmediate(p[0], p[1], p[2], f[0], f[1], f[2], u[0], u[1], u[2]);
          }
      }
  }
  /**
   * Remove the graphic for a user that has left.
   */
  function removeUser(id) {
      const user = users.get(id);
      if (user) {
          user.dispose();
          users.delete(id);
      }
  }
  /**
   * In Jitsi, users may not have names right away. They need to
   * join a conference before they can set their name, so we need
   * to wait for change notifications and update the display of the
   * user names.
   */
  function changeName(id, displayName) {
      const user = users.get(id);
      if (user) {
          user.name = displayName;
      }
  }
  /**
   * When a user enables or disables video, Calla will give us a
   * notification. Users that add video will have a stream available
   * to then create an HTML Video element. Users that remove video
   * will send `null` as their video stream.
   */
  function changeVideo(id, stream) {
      const user = users.get(id);
      if (user) {
          user.videoStream = stream;
      }
  }
  /**
   * Give Calla the local user's position. Calla will
   * transmit the new value to all the other users, and will
   * perform a smooth transition of the value so users
   * don't pop around.
   * @param {any} x
   * @param {any} y
   */
  function setPosition(x, y) {
      if (client.localUserID) {
          x /= 100;
          y /= 100;
          client.setLocalPose(x, 0, y, 0, 0, -1, 0, 1, 0);
      }
  }
  /**
   * Calla's audio processing system needs an animation pump,
   * which we need also because the user graphics need to
   * be moved.
   **/
  function update() {
      client.update();
      for (let user of users.values()) {
          user.update();
      }
  }
  /**
   * Calla needs to cleanup the audio and video tracks if
   * the user decides they want to leave the conference.
   *
   * NOTE: Don't call the leave function on page unload,
   * as it leads to ghost users being left in the conference.
   * This appears to be a bug in Jitsi.
   **/
  async function leave() {
      await client.leave();
  }
  /**
   * Calla will provide a managed object for the user's position, but we
   * are responsible in our application code for displaying that position
   * in some way. This User class helps encapsulate that representation.
   **/
  class User {
      /**
       * Creates a new User object.
       */
      constructor(id, name, pose, isLocal) {
          this.id = id;
          this.pose = pose;
          // The user's name.
          this._name = null;
          // An HTML element to display the user's name.
          this._nameEl = null;
          // Calla will eventually give us a video stream for the user.
          this._videoStream = null;
          // An HTML element for displaying the user's video.
          this._video = null;
          this.container = document.createElement("div");
          this.container.className = "user";
          if (isLocal) {
              this.container.className += " localUser";
              name += " (Me)";
          }
          this.name = name;
      }
      /**
       * Removes the user from the page.
       **/
      dispose() {
          this.container.parentElement.removeChild(this.container);
      }
      /**
       * Gets the user's name.
       **/
      get name() {
          return this._name;
      }
      /**
       * Sets the user's name, and updates the display of it.
       **/
      set name(v) {
          if (this._nameEl) {
              this.container.removeChild(this._nameEl);
              this._nameEl = null;
          }
          this._name = v;
          this._nameEl = document.createElement("div");
          this._nameEl.className = "userName";
          this._nameEl.append(document.createTextNode(this.name));
          this.container.append(this._nameEl);
      }
      /**
       * Gets the user's video stream.
       **/
      get videoStream() {
          return this._videoStream;
      }
      /**
       * Sets the user's video stream, deleting any previous stream that may have existed,
       * and updates the display of the user to have the new video stream.
       **/
      set videoStream(v) {
          if (this._video) {
              this.container.removeChild(this._video);
              this._video = null;
          }
          this._videoStream = v;
          if (this._videoStream) {
              this._video = document.createElement("video");
              this._video.playsInline = true;
              this._video.autoplay = true;
              this._video.controls = false;
              this._video.muted = true;
              this._video.volume = 0;
              this._video.srcObject = this._videoStream;
              this._video.className = "userVideo";
              this.container.append(this._video);
              this._video.play();
          }
      }
      /**
       * Moves the user's graphics element to the latest position that Calla has
       * calculated for it.
       **/
      update() {
          const dx = this.container.parentElement.clientLeft - this.container.clientWidth / 2;
          const dy = this.container.parentElement.clientTop - this.container.clientHeight / 2;
          this.container.style.left = (100 * this.pose.current.p[0] + dx) + "px";
          this.container.style.zIndex = this.pose.current.p[1].toFixed(3);
          this.container.style.top = (100 * this.pose.current.p[2] + dy) + "px";
      }
  }
  // =========== BEGIN Wire up events ================
  controls$1.connect.addEventListener("click", connect);
  controls$1.leave.addEventListener("click", leave);
  controls$1.space.addEventListener("click", (evt) => {
      const x = evt.clientX - controls$1.space.offsetLeft;
      const y = evt.clientY - controls$1.space.offsetTop;
      setPosition(x, y);
  });
  client.addEventListener(CallaTeleconferenceEventType.ConferenceJoined, (evt) => startGame(evt.id, evt.pose));
  /**
   * If the user has left the conference (or been kicked
   * by a moderator), we need to shut down the rendering.
   **/
  client.addEventListener(CallaTeleconferenceEventType.ConferenceLeft, (evt) => {
      removeUser(evt.id);
      timer.stop();
      controls$1.leave.disabled = true;
      controls$1.connect.disabled = false;
  });
  client.addEventListener(CallaTeleconferenceEventType.ParticipantJoined, (evt) => addUser(evt.id, evt.displayName, evt.source.pose, false));
  client.addEventListener(CallaTeleconferenceEventType.ParticipantLeft, (evt) => removeUser(evt.id));
  client.addEventListener(CallaTeleconferenceEventType.VideoAdded, (evt) => changeVideo(evt.id, evt.stream));
  client.addEventListener(CallaTeleconferenceEventType.VideoRemoved, (evt) => changeVideo(evt.id, null));
  client.addEventListener(CallaTeleconferenceEventType.UserNameChanged, (evt) => changeName(evt.id, evt.displayName));
  timer.addEventListener("tick", update);
  /**
   * Binds a device list to a select box.
   * @param addNone - whether a vestigial "none" item should be added to the front of the list.
   * @param select - the select box to add items to.
   * @param values - the list of devices to control.
   * @param preferredDeviceID - the ID of the device that should be selected first, if any.
   * @param onSelect - a callback that fires when the user selects an item in the list.
   */
  function deviceSelector(addNone, select, values, preferredDeviceID, onSelect) {
      // Add a vestigial "none" item?
      if (addNone) {
          const none = document.createElement("option");
          none.text = "None";
          select.append(none);
      }
      let preferredDevice = null;
      // Create the select box options.
      select.append(...values.map((value) => {
          const opt = document.createElement("option");
          opt.value = value.deviceId;
          opt.text = value.label;
          if (preferredDeviceID === value.deviceId) {
              preferredDevice = value;
              opt.selected = true;
          }
          return opt;
      }));
      // Respond to a user selection. We use "input" instead
      // of "change" because "change" events don't fire if the
      // user clicks an option that is already selected.
      select.addEventListener("input", () => {
          let idx = select.selectedIndex;
          // Skip the vestigial "none" item.
          if (addNone) {
              --idx;
          }
          const value = values[idx];
          onSelect(value || null);
      });
      if (preferredDevice) {
          onSelect(preferredDevice);
      }
  }
  // Setup the device lists.
  (async function () {
      deviceSelector(true, controls$1.mics, await client.getAudioInputDevices(true), client.preferredAudioInputID, (device) => client.setAudioInputDevice(device));
      // There is no way to set "no" audio output, so we don't
      // allow a selection of "none" here. Also, it's a good idea
      // to always start off with an audio output device, so always
      // call `getPreferredAudioOutputAsync(true)`.
      deviceSelector(false, controls$1.speakers, await client.getAudioOutputDevices(true), client.preferredAudioOutputID, (device) => client.setAudioOutputDevice(device));
      // If we want to create sessions that default to having 
      // no video enabled, we can change`getPreferredVideoInputAsync(true)`
      // to `getPreferredVideoInputAsync(false)`.
      deviceSelector(true, controls$1.cams, await client.getVideoInputDevices(true), client.preferredVideoInputID, (device) => client.setVideoInputDevice(device));
      // Chromium is pretty much the only browser that can change
      // audio outputs at this time, so disable the control if we
      // detect there is no option to change outputs.
      controls$1.speakers.disabled = !canChangeAudioOutput;
      await client.prepare(JITSI_HOST, JVB_HOST, JVB_MUC);
      await client.connect();
      // At this point, everything is ready, so we can let 
      // the user attempt to connect to the conference now.
      controls$1.connect.disabled = false;
  })();
  const sideTest = document.getElementById("sideTest");
  if (userNumber === 1) {
      sideTest.addEventListener("click", openSideTest);
  }
  else {
      sideTest.style.display = "none";
  }
  controls$1.roomName.value = "TestRoom";
  controls$1.userName.value = `TestUser${userNumber}`;
  window.client = client;

}());
//# sourceMappingURL=basic.js.map
