function ye(r) {
  let e = typeof r;
  if (e == "object") {
    if (Array.isArray(r))
      return "array";
    if (r === null)
      return "null";
  }
  return e;
}
function Ue(r) {
  return r !== null && typeof r == "object" && !Array.isArray(r);
}
let v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), G = [];
for (let r = 0; r < v.length; r++)
  G[v[r].charCodeAt(0)] = r;
G[45] = v.indexOf("+");
G[95] = v.indexOf("/");
function Ie(r) {
  let e = r.length * 3 / 4;
  r[r.length - 2] == "=" ? e -= 2 : r[r.length - 1] == "=" && (e -= 1);
  let t = new Uint8Array(e), n = 0, s = 0, i, a = 0;
  for (let o = 0; o < r.length; o++) {
    if (i = G[r.charCodeAt(o)], i === void 0)
      switch (r[o]) {
        case "=":
          s = 0;
        // reset state when padding found
        case `
`:
        case "\r":
        case "	":
        case " ":
          continue;
        // skip white-space, and padding
        default:
          throw Error("invalid base64 string.");
      }
    switch (s) {
      case 0:
        a = i, s = 1;
        break;
      case 1:
        t[n++] = a << 2 | (i & 48) >> 4, a = i, s = 2;
        break;
      case 2:
        t[n++] = (a & 15) << 4 | (i & 60) >> 2, a = i, s = 3;
        break;
      case 3:
        t[n++] = (a & 3) << 6 | i, s = 0;
        break;
    }
  }
  if (s == 1)
    throw Error("invalid base64 string.");
  return t.subarray(0, n);
}
function Oe(r) {
  let e = "", t = 0, n, s = 0;
  for (let i = 0; i < r.length; i++)
    switch (n = r[i], t) {
      case 0:
        e += v[n >> 2], s = (n & 3) << 4, t = 1;
        break;
      case 1:
        e += v[s | n >> 4], s = (n & 15) << 2, t = 2;
        break;
      case 2:
        e += v[s | n >> 6], e += v[n & 63], t = 0;
        break;
    }
  return t && (e += v[s], e += "=", t == 1 && (e += "=")), e;
}
const Q = (r) => String.fromCharCode.apply(String, r);
function Tt(r) {
  if (r.length < 1)
    return "";
  let e = 0, t = [], n = [], s = 0, i, a = r.length;
  for (; e < a; )
    i = r[e++], i < 128 ? n[s++] = i : i > 191 && i < 224 ? n[s++] = (i & 31) << 6 | r[e++] & 63 : i > 239 && i < 365 ? (i = ((i & 7) << 18 | (r[e++] & 63) << 12 | (r[e++] & 63) << 6 | r[e++] & 63) - 65536, n[s++] = 55296 + (i >> 10), n[s++] = 56320 + (i & 1023)) : n[s++] = (i & 15) << 12 | (r[e++] & 63) << 6 | r[e++] & 63, s > 8191 && (t.push(Q(n)), s = 0);
  return t.length ? (s && t.push(Q(n.slice(0, s))), t.join("")) : Q(n.slice(0, s));
}
var H;
(function(r) {
  r.symbol = Symbol.for("protobuf-ts/unknown"), r.onRead = (t, n, s, i, a) => {
    (e(n) ? n[r.symbol] : n[r.symbol] = []).push({ no: s, wireType: i, data: a });
  }, r.onWrite = (t, n, s) => {
    for (let { no: i, wireType: a, data: o } of r.list(n))
      s.tag(i, a).raw(o);
  }, r.list = (t, n) => {
    if (e(t)) {
      let s = t[r.symbol];
      return n ? s.filter((i) => i.no == n) : s;
    }
    return [];
  }, r.last = (t, n) => r.list(t, n).slice(-1)[0];
  const e = (t) => t && Array.isArray(t[r.symbol]);
})(H || (H = {}));
function ve(r, e) {
  return Object.assign(Object.assign({}, r), e);
}
var O;
(function(r) {
  r[r.Varint = 0] = "Varint", r[r.Bit64 = 1] = "Bit64", r[r.LengthDelimited = 2] = "LengthDelimited", r[r.StartGroup = 3] = "StartGroup", r[r.EndGroup = 4] = "EndGroup", r[r.Bit32 = 5] = "Bit32";
})(O || (O = {}));
function Ve() {
  let r = 0, e = 0;
  for (let n = 0; n < 28; n += 7) {
    let s = this.buf[this.pos++];
    if (r |= (s & 127) << n, !(s & 128))
      return this.assertBounds(), [r, e];
  }
  let t = this.buf[this.pos++];
  if (r |= (t & 15) << 28, e = (t & 112) >> 4, !(t & 128))
    return this.assertBounds(), [r, e];
  for (let n = 3; n <= 31; n += 7) {
    let s = this.buf[this.pos++];
    if (e |= (s & 127) << n, !(s & 128))
      return this.assertBounds(), [r, e];
  }
  throw new Error("invalid varint");
}
function ee(r, e, t) {
  for (let i = 0; i < 28; i = i + 7) {
    const a = r >>> i, o = !(!(a >>> 7) && e == 0), u = (o ? a | 128 : a) & 255;
    if (t.push(u), !o)
      return;
  }
  const n = r >>> 28 & 15 | (e & 7) << 4, s = !!(e >> 3);
  if (t.push((s ? n | 128 : n) & 255), !!s) {
    for (let i = 3; i < 31; i = i + 7) {
      const a = e >>> i, o = !!(a >>> 7), u = (o ? a | 128 : a) & 255;
      if (t.push(u), !o)
        return;
    }
    t.push(e >>> 31 & 1);
  }
}
const J = 65536 * 65536;
function Te(r) {
  let e = r[0] == "-";
  e && (r = r.slice(1));
  const t = 1e6;
  let n = 0, s = 0;
  function i(a, o) {
    const u = Number(r.slice(a, o));
    s *= t, n = n * t + u, n >= J && (s = s + (n / J | 0), n = n % J);
  }
  return i(-24, -18), i(-18, -12), i(-12, -6), i(-6), [e, n, s];
}
function ne(r, e) {
  if (e >>> 0 <= 2097151)
    return "" + (J * e + (r >>> 0));
  let t = r & 16777215, n = (r >>> 24 | e << 8) >>> 0 & 16777215, s = e >> 16 & 65535, i = t + n * 6777216 + s * 6710656, a = n + s * 8147497, o = s * 2, u = 1e7;
  i >= u && (a += Math.floor(i / u), i %= u), a >= u && (o += Math.floor(a / u), a %= u);
  function f(c, d) {
    let m = c ? String(c) : "";
    return d ? "0000000".slice(m.length) + m : m;
  }
  return f(
    o,
    /*needLeadingZeros=*/
    0
  ) + f(
    a,
    /*needLeadingZeros=*/
    o
  ) + // If the final 1e7 digit didn't need leading zeros, we would have
  // returned via the trivial code path at the top.
  f(
    i,
    /*needLeadingZeros=*/
    1
  );
}
function fe(r, e) {
  if (r >= 0) {
    for (; r > 127; )
      e.push(r & 127 | 128), r = r >>> 7;
    e.push(r);
  } else {
    for (let t = 0; t < 9; t++)
      e.push(r & 127 | 128), r = r >> 7;
    e.push(1);
  }
}
function Pe() {
  let r = this.buf[this.pos++], e = r & 127;
  if (!(r & 128))
    return this.assertBounds(), e;
  if (r = this.buf[this.pos++], e |= (r & 127) << 7, !(r & 128))
    return this.assertBounds(), e;
  if (r = this.buf[this.pos++], e |= (r & 127) << 14, !(r & 128))
    return this.assertBounds(), e;
  if (r = this.buf[this.pos++], e |= (r & 127) << 21, !(r & 128))
    return this.assertBounds(), e;
  r = this.buf[this.pos++], e |= (r & 15) << 28;
  for (let t = 5; r & 128 && t < 10; t++)
    r = this.buf[this.pos++];
  if (r & 128)
    throw new Error("invalid varint");
  return this.assertBounds(), e >>> 0;
}
let E;
function Me() {
  const r = new DataView(new ArrayBuffer(8));
  E = globalThis.BigInt !== void 0 && typeof r.getBigInt64 == "function" && typeof r.getBigUint64 == "function" && typeof r.setBigInt64 == "function" && typeof r.setBigUint64 == "function" ? {
    MIN: BigInt("-9223372036854775808"),
    MAX: BigInt("9223372036854775807"),
    UMIN: BigInt("0"),
    UMAX: BigInt("18446744073709551615"),
    C: BigInt,
    V: r
  } : void 0;
}
Me();
function ke(r) {
  if (!r)
    throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support");
}
const Ae = /^-?[0-9]+$/, W = 4294967296, K = 2147483648;
class De {
  /**
   * Create a new instance with the given bits.
   */
  constructor(e, t) {
    this.lo = e | 0, this.hi = t | 0;
  }
  /**
   * Is this instance equal to 0?
   */
  isZero() {
    return this.lo == 0 && this.hi == 0;
  }
  /**
   * Convert to a native number.
   */
  toNumber() {
    let e = this.hi * W + (this.lo >>> 0);
    if (!Number.isSafeInteger(e))
      throw new Error("cannot convert to safe number");
    return e;
  }
}
class D extends De {
  /**
   * Create instance from a `string`, `number` or `bigint`.
   */
  static from(e) {
    if (E)
      switch (typeof e) {
        case "string":
          if (e == "0")
            return this.ZERO;
          if (e == "")
            throw new Error("string is no integer");
          e = E.C(e);
        case "number":
          if (e === 0)
            return this.ZERO;
          e = E.C(e);
        case "bigint":
          if (!e)
            return this.ZERO;
          if (e < E.UMIN)
            throw new Error("signed value for ulong");
          if (e > E.UMAX)
            throw new Error("ulong too large");
          return E.V.setBigUint64(0, e, !0), new D(E.V.getInt32(0, !0), E.V.getInt32(4, !0));
      }
    else
      switch (typeof e) {
        case "string":
          if (e == "0")
            return this.ZERO;
          if (e = e.trim(), !Ae.test(e))
            throw new Error("string is no integer");
          let [t, n, s] = Te(e);
          if (t)
            throw new Error("signed value for ulong");
          return new D(n, s);
        case "number":
          if (e == 0)
            return this.ZERO;
          if (!Number.isSafeInteger(e))
            throw new Error("number is no integer");
          if (e < 0)
            throw new Error("signed value for ulong");
          return new D(e, e / W);
      }
    throw new Error("unknown value " + typeof e);
  }
  /**
   * Convert to decimal string.
   */
  toString() {
    return E ? this.toBigInt().toString() : ne(this.lo, this.hi);
  }
  /**
   * Convert to native bigint.
   */
  toBigInt() {
    return ke(E), E.V.setInt32(0, this.lo, !0), E.V.setInt32(4, this.hi, !0), E.V.getBigUint64(0, !0);
  }
}
D.ZERO = new D(0, 0);
class T extends De {
  /**
   * Create instance from a `string`, `number` or `bigint`.
   */
  static from(e) {
    if (E)
      switch (typeof e) {
        case "string":
          if (e == "0")
            return this.ZERO;
          if (e == "")
            throw new Error("string is no integer");
          e = E.C(e);
        case "number":
          if (e === 0)
            return this.ZERO;
          e = E.C(e);
        case "bigint":
          if (!e)
            return this.ZERO;
          if (e < E.MIN)
            throw new Error("signed long too small");
          if (e > E.MAX)
            throw new Error("signed long too large");
          return E.V.setBigInt64(0, e, !0), new T(E.V.getInt32(0, !0), E.V.getInt32(4, !0));
      }
    else
      switch (typeof e) {
        case "string":
          if (e == "0")
            return this.ZERO;
          if (e = e.trim(), !Ae.test(e))
            throw new Error("string is no integer");
          let [t, n, s] = Te(e);
          if (t) {
            if (s > K || s == K && n != 0)
              throw new Error("signed long too small");
          } else if (s >= K)
            throw new Error("signed long too large");
          let i = new T(n, s);
          return t ? i.negate() : i;
        case "number":
          if (e == 0)
            return this.ZERO;
          if (!Number.isSafeInteger(e))
            throw new Error("number is no integer");
          return e > 0 ? new T(e, e / W) : new T(-e, -e / W).negate();
      }
    throw new Error("unknown value " + typeof e);
  }
  /**
   * Do we have a minus sign?
   */
  isNegative() {
    return (this.hi & K) !== 0;
  }
  /**
   * Negate two's complement.
   * Invert all the bits and add one to the result.
   */
  negate() {
    let e = ~this.hi, t = this.lo;
    return t ? t = ~t + 1 : e += 1, new T(t, e);
  }
  /**
   * Convert to decimal string.
   */
  toString() {
    if (E)
      return this.toBigInt().toString();
    if (this.isNegative()) {
      let e = this.negate();
      return "-" + ne(e.lo, e.hi);
    }
    return ne(this.lo, this.hi);
  }
  /**
   * Convert to native bigint.
   */
  toBigInt() {
    return ke(E), E.V.setInt32(0, this.lo, !0), E.V.setInt32(4, this.hi, !0), E.V.getBigInt64(0, !0);
  }
}
T.ZERO = new T(0, 0);
const le = {
  readUnknownField: !0,
  readerFactory: (r) => new je(r)
};
function Ce(r) {
  return r ? Object.assign(Object.assign({}, le), r) : le;
}
class je {
  constructor(e, t) {
    this.varint64 = Ve, this.uint32 = Pe, this.buf = e, this.len = e.length, this.pos = 0, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength), this.textDecoder = t ?? new TextDecoder("utf-8", {
      fatal: !0,
      ignoreBOM: !0
    });
  }
  /**
   * Reads a tag - field number and wire type.
   */
  tag() {
    let e = this.uint32(), t = e >>> 3, n = e & 7;
    if (t <= 0 || n < 0 || n > 5)
      throw new Error("illegal tag: field no " + t + " wire type " + n);
    return [t, n];
  }
  /**
   * Skip one element on the wire and return the skipped data.
   * Supports WireType.StartGroup since v2.0.0-alpha.23.
   */
  skip(e) {
    let t = this.pos;
    switch (e) {
      case O.Varint:
        for (; this.buf[this.pos++] & 128; )
          ;
        break;
      case O.Bit64:
        this.pos += 4;
      case O.Bit32:
        this.pos += 4;
        break;
      case O.LengthDelimited:
        let n = this.uint32();
        this.pos += n;
        break;
      case O.StartGroup:
        let s;
        for (; (s = this.tag()[1]) !== O.EndGroup; )
          this.skip(s);
        break;
      default:
        throw new Error("cant skip wire type " + e);
    }
    return this.assertBounds(), this.buf.subarray(t, this.pos);
  }
  /**
   * Throws error if position in byte array is out of range.
   */
  assertBounds() {
    if (this.pos > this.len)
      throw new RangeError("premature EOF");
  }
  /**
   * Read a `int32` field, a signed 32 bit varint.
   */
  int32() {
    return this.uint32() | 0;
  }
  /**
   * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
   */
  sint32() {
    let e = this.uint32();
    return e >>> 1 ^ -(e & 1);
  }
  /**
   * Read a `int64` field, a signed 64-bit varint.
   */
  int64() {
    return new T(...this.varint64());
  }
  /**
   * Read a `uint64` field, an unsigned 64-bit varint.
   */
  uint64() {
    return new D(...this.varint64());
  }
  /**
   * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64() {
    let [e, t] = this.varint64(), n = -(e & 1);
    return e = (e >>> 1 | (t & 1) << 31) ^ n, t = t >>> 1 ^ n, new T(e, t);
  }
  /**
   * Read a `bool` field, a variant.
   */
  bool() {
    let [e, t] = this.varint64();
    return e !== 0 || t !== 0;
  }
  /**
   * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
   */
  fixed32() {
    return this.view.getUint32((this.pos += 4) - 4, !0);
  }
  /**
   * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
   */
  sfixed32() {
    return this.view.getInt32((this.pos += 4) - 4, !0);
  }
  /**
   * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
   */
  fixed64() {
    return new D(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
   */
  sfixed64() {
    return new T(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `float` field, 32-bit floating point number.
   */
  float() {
    return this.view.getFloat32((this.pos += 4) - 4, !0);
  }
  /**
   * Read a `double` field, a 64-bit floating point number.
   */
  double() {
    return this.view.getFloat64((this.pos += 8) - 8, !0);
  }
  /**
   * Read a `bytes` field, length-delimited arbitrary data.
   */
  bytes() {
    let e = this.uint32(), t = this.pos;
    return this.pos += e, this.assertBounds(), this.buf.subarray(t, t + e);
  }
  /**
   * Read a `string` field, length-delimited data converted to UTF-8 text.
   */
  string() {
    return this.textDecoder.decode(this.bytes());
  }
}
function p(r, e) {
  if (!r)
    throw new Error(e);
}
function Ke(r, e) {
  throw new Error(e ?? "Unexpected object: " + r);
}
const Xe = 34028234663852886e22, $e = -34028234663852886e22, qe = 4294967295, Je = 2147483647, He = -2147483648;
function j(r) {
  if (typeof r != "number")
    throw new Error("invalid int 32: " + typeof r);
  if (!Number.isInteger(r) || r > Je || r < He)
    throw new Error("invalid int 32: " + r);
}
function Z(r) {
  if (typeof r != "number")
    throw new Error("invalid uint 32: " + typeof r);
  if (!Number.isInteger(r) || r > qe || r < 0)
    throw new Error("invalid uint 32: " + r);
}
function oe(r) {
  if (typeof r != "number")
    throw new Error("invalid float 32: " + typeof r);
  if (Number.isFinite(r) && (r > Xe || r < $e))
    throw new Error("invalid float 32: " + r);
}
const ce = {
  writeUnknownFields: !0,
  writerFactory: () => new Ze()
};
function We(r) {
  return r ? Object.assign(Object.assign({}, ce), r) : ce;
}
class Ze {
  constructor(e) {
    this.stack = [], this.textEncoder = e ?? new TextEncoder(), this.chunks = [], this.buf = [];
  }
  /**
   * Return all bytes written and reset this writer.
   */
  finish() {
    this.chunks.push(new Uint8Array(this.buf));
    let e = 0;
    for (let s = 0; s < this.chunks.length; s++)
      e += this.chunks[s].length;
    let t = new Uint8Array(e), n = 0;
    for (let s = 0; s < this.chunks.length; s++)
      t.set(this.chunks[s], n), n += this.chunks[s].length;
    return this.chunks = [], t;
  }
  /**
   * Start a new fork for length-delimited data like a message
   * or a packed repeated field.
   *
   * Must be joined later with `join()`.
   */
  fork() {
    return this.stack.push({ chunks: this.chunks, buf: this.buf }), this.chunks = [], this.buf = [], this;
  }
  /**
   * Join the last fork. Write its length and bytes, then
   * return to the previous state.
   */
  join() {
    let e = this.finish(), t = this.stack.pop();
    if (!t)
      throw new Error("invalid state, fork stack empty");
    return this.chunks = t.chunks, this.buf = t.buf, this.uint32(e.byteLength), this.raw(e);
  }
  /**
   * Writes a tag (field number and wire type).
   *
   * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
   *
   * Generated code should compute the tag ahead of time and call `uint32()`.
   */
  tag(e, t) {
    return this.uint32((e << 3 | t) >>> 0);
  }
  /**
   * Write a chunk of raw bytes.
   */
  raw(e) {
    return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []), this.chunks.push(e), this;
  }
  /**
   * Write a `uint32` value, an unsigned 32 bit varint.
   */
  uint32(e) {
    for (Z(e); e > 127; )
      this.buf.push(e & 127 | 128), e = e >>> 7;
    return this.buf.push(e), this;
  }
  /**
   * Write a `int32` value, a signed 32 bit varint.
   */
  int32(e) {
    return j(e), fe(e, this.buf), this;
  }
  /**
   * Write a `bool` value, a variant.
   */
  bool(e) {
    return this.buf.push(e ? 1 : 0), this;
  }
  /**
   * Write a `bytes` value, length-delimited arbitrary data.
   */
  bytes(e) {
    return this.uint32(e.byteLength), this.raw(e);
  }
  /**
   * Write a `string` value, length-delimited data converted to UTF-8 text.
   */
  string(e) {
    let t = this.textEncoder.encode(e);
    return this.uint32(t.byteLength), this.raw(t);
  }
  /**
   * Write a `float` value, 32-bit floating point number.
   */
  float(e) {
    oe(e);
    let t = new Uint8Array(4);
    return new DataView(t.buffer).setFloat32(0, e, !0), this.raw(t);
  }
  /**
   * Write a `double` value, a 64-bit floating point number.
   */
  double(e) {
    let t = new Uint8Array(8);
    return new DataView(t.buffer).setFloat64(0, e, !0), this.raw(t);
  }
  /**
   * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
   */
  fixed32(e) {
    Z(e);
    let t = new Uint8Array(4);
    return new DataView(t.buffer).setUint32(0, e, !0), this.raw(t);
  }
  /**
   * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
   */
  sfixed32(e) {
    j(e);
    let t = new Uint8Array(4);
    return new DataView(t.buffer).setInt32(0, e, !0), this.raw(t);
  }
  /**
   * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
   */
  sint32(e) {
    return j(e), e = (e << 1 ^ e >> 31) >>> 0, fe(e, this.buf), this;
  }
  /**
   * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
   */
  sfixed64(e) {
    let t = new Uint8Array(8), n = new DataView(t.buffer), s = T.from(e);
    return n.setInt32(0, s.lo, !0), n.setInt32(4, s.hi, !0), this.raw(t);
  }
  /**
   * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
   */
  fixed64(e) {
    let t = new Uint8Array(8), n = new DataView(t.buffer), s = D.from(e);
    return n.setInt32(0, s.lo, !0), n.setInt32(4, s.hi, !0), this.raw(t);
  }
  /**
   * Write a `int64` value, a signed 64-bit varint.
   */
  int64(e) {
    let t = T.from(e);
    return ee(t.lo, t.hi, this.buf), this;
  }
  /**
   * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64(e) {
    let t = T.from(e), n = t.hi >> 31, s = t.lo << 1 ^ n, i = (t.hi << 1 | t.lo >>> 31) ^ n;
    return ee(s, i, this.buf), this;
  }
  /**
   * Write a `uint64` value, an unsigned 64-bit varint.
   */
  uint64(e) {
    let t = D.from(e);
    return ee(t.lo, t.hi, this.buf), this;
  }
}
const he = {
  emitDefaultValues: !1,
  enumAsInteger: !1,
  useProtoFieldName: !1,
  prettySpaces: 0
}, de = {
  ignoreUnknownFields: !1
};
function Ye(r) {
  return r ? Object.assign(Object.assign({}, de), r) : de;
}
function Ge(r) {
  return r ? Object.assign(Object.assign({}, he), r) : he;
}
function ze(r, e) {
  var t, n;
  let s = Object.assign(Object.assign({}, r), e);
  return s.typeRegistry = [...(t = r == null ? void 0 : r.typeRegistry) !== null && t !== void 0 ? t : [], ...(n = e == null ? void 0 : e.typeRegistry) !== null && n !== void 0 ? n : []], s;
}
const ue = Symbol.for("protobuf-ts/message-type");
function re(r) {
  let e = !1;
  const t = [];
  for (let n = 0; n < r.length; n++) {
    let s = r.charAt(n);
    s == "_" ? e = !0 : /\d/.test(s) ? (t.push(s), e = !0) : e ? (t.push(s.toUpperCase()), e = !1) : n == 0 ? t.push(s.toLowerCase()) : t.push(s);
  }
  return t.join("");
}
var l;
(function(r) {
  r[r.DOUBLE = 1] = "DOUBLE", r[r.FLOAT = 2] = "FLOAT", r[r.INT64 = 3] = "INT64", r[r.UINT64 = 4] = "UINT64", r[r.INT32 = 5] = "INT32", r[r.FIXED64 = 6] = "FIXED64", r[r.FIXED32 = 7] = "FIXED32", r[r.BOOL = 8] = "BOOL", r[r.STRING = 9] = "STRING", r[r.BYTES = 12] = "BYTES", r[r.UINT32 = 13] = "UINT32", r[r.SFIXED32 = 15] = "SFIXED32", r[r.SFIXED64 = 16] = "SFIXED64", r[r.SINT32 = 17] = "SINT32", r[r.SINT64 = 18] = "SINT64";
})(l || (l = {}));
var x;
(function(r) {
  r[r.BIGINT = 0] = "BIGINT", r[r.STRING = 1] = "STRING", r[r.NUMBER = 2] = "NUMBER";
})(x || (x = {}));
var Y;
(function(r) {
  r[r.NO = 0] = "NO", r[r.PACKED = 1] = "PACKED", r[r.UNPACKED = 2] = "UNPACKED";
})(Y || (Y = {}));
function Qe(r) {
  var e, t, n, s;
  return r.localName = (e = r.localName) !== null && e !== void 0 ? e : re(r.name), r.jsonName = (t = r.jsonName) !== null && t !== void 0 ? t : re(r.name), r.repeat = (n = r.repeat) !== null && n !== void 0 ? n : Y.NO, r.opt = (s = r.opt) !== null && s !== void 0 ? s : r.repeat || r.oneof ? !1 : r.kind == "message", r;
}
function kt(r, e, t, n) {
  var s;
  const i = (s = r.fields.find((a, o) => a.localName == e || o == e)) === null || s === void 0 ? void 0 : s.options;
  return i && i[t] ? n.fromJson(i[t]) : void 0;
}
function At(r, e, t, n) {
  var s;
  const i = (s = r.fields.find((o, u) => o.localName == e || u == e)) === null || s === void 0 ? void 0 : s.options;
  if (!i)
    return;
  const a = i[t];
  return a === void 0 ? a : n ? n.fromJson(a) : a;
}
function Dt(r, e, t) {
  const s = r.options[e];
  return s === void 0 ? s : t ? t.fromJson(s) : s;
}
function et(r) {
  if (typeof r != "object" || r === null || !r.hasOwnProperty("oneofKind"))
    return !1;
  switch (typeof r.oneofKind) {
    case "string":
      return r[r.oneofKind] === void 0 ? !1 : Object.keys(r).length == 2;
    case "undefined":
      return Object.keys(r).length == 1;
    default:
      return !1;
  }
}
function _t(r, e) {
  return r[e];
}
function Rt(r, e, t) {
  r.oneofKind !== void 0 && delete r[r.oneofKind], r.oneofKind = e, t !== void 0 && (r[e] = t);
}
function Lt(r) {
  r.oneofKind !== void 0 && delete r[r.oneofKind], r.oneofKind = void 0;
}
function Ft(r) {
  if (r.oneofKind !== void 0)
    return r[r.oneofKind];
}
class tt {
  constructor(e) {
    var t;
    this.fields = (t = e.fields) !== null && t !== void 0 ? t : [];
  }
  prepare() {
    if (this.data)
      return;
    const e = [], t = [], n = [];
    for (let s of this.fields)
      if (s.oneof)
        n.includes(s.oneof) || (n.push(s.oneof), e.push(s.oneof), t.push(s.oneof));
      else
        switch (t.push(s.localName), s.kind) {
          case "scalar":
          case "enum":
            (!s.opt || s.repeat) && e.push(s.localName);
            break;
          case "message":
            s.repeat && e.push(s.localName);
            break;
          case "map":
            e.push(s.localName);
            break;
        }
    this.data = { req: e, known: t, oneofs: Object.values(n) };
  }
  /**
   * Is the argument a valid message as specified by the
   * reflection information?
   *
   * Checks all field types recursively. The `depth`
   * specifies how deep into the structure the check will be.
   *
   * With a depth of 0, only the presence of fields
   * is checked.
   *
   * With a depth of 1 or more, the field types are checked.
   *
   * With a depth of 2 or more, the members of map, repeated
   * and message fields are checked.
   *
   * Message fields will be checked recursively with depth - 1.
   *
   * The number of map entries / repeated values being checked
   * is < depth.
   */
  is(e, t, n = !1) {
    if (t < 0)
      return !0;
    if (e == null || typeof e != "object")
      return !1;
    this.prepare();
    let s = Object.keys(e), i = this.data;
    if (s.length < i.req.length || i.req.some((a) => !s.includes(a)) || !n && s.some((a) => !i.known.includes(a)))
      return !1;
    if (t < 1)
      return !0;
    for (const a of i.oneofs) {
      const o = e[a];
      if (!et(o))
        return !1;
      if (o.oneofKind === void 0)
        continue;
      const u = this.fields.find((f) => f.localName === o.oneofKind);
      if (!u || !this.field(o[o.oneofKind], u, n, t))
        return !1;
    }
    for (const a of this.fields)
      if (a.oneof === void 0 && !this.field(e[a.localName], a, n, t))
        return !1;
    return !0;
  }
  field(e, t, n, s) {
    let i = t.repeat;
    switch (t.kind) {
      case "scalar":
        return e === void 0 ? t.opt : i ? this.scalars(e, t.T, s, t.L) : this.scalar(e, t.T, t.L);
      case "enum":
        return e === void 0 ? t.opt : i ? this.scalars(e, l.INT32, s) : this.scalar(e, l.INT32);
      case "message":
        return e === void 0 ? !0 : i ? this.messages(e, t.T(), n, s) : this.message(e, t.T(), n, s);
      case "map":
        if (typeof e != "object" || e === null)
          return !1;
        if (s < 2)
          return !0;
        if (!this.mapKeys(e, t.K, s))
          return !1;
        switch (t.V.kind) {
          case "scalar":
            return this.scalars(Object.values(e), t.V.T, s, t.V.L);
          case "enum":
            return this.scalars(Object.values(e), l.INT32, s);
          case "message":
            return this.messages(Object.values(e), t.V.T(), n, s);
        }
        break;
    }
    return !0;
  }
  message(e, t, n, s) {
    return n ? t.isAssignable(e, s) : t.is(e, s);
  }
  messages(e, t, n, s) {
    if (!Array.isArray(e))
      return !1;
    if (s < 2)
      return !0;
    if (n) {
      for (let i = 0; i < e.length && i < s; i++)
        if (!t.isAssignable(e[i], s - 1))
          return !1;
    } else
      for (let i = 0; i < e.length && i < s; i++)
        if (!t.is(e[i], s - 1))
          return !1;
    return !0;
  }
  scalar(e, t, n) {
    let s = typeof e;
    switch (t) {
      case l.UINT64:
      case l.FIXED64:
      case l.INT64:
      case l.SFIXED64:
      case l.SINT64:
        switch (n) {
          case x.BIGINT:
            return s == "bigint";
          case x.NUMBER:
            return s == "number" && !isNaN(e);
          default:
            return s == "string";
        }
      case l.BOOL:
        return s == "boolean";
      case l.STRING:
        return s == "string";
      case l.BYTES:
        return e instanceof Uint8Array;
      case l.DOUBLE:
      case l.FLOAT:
        return s == "number" && !isNaN(e);
      default:
        return s == "number" && Number.isInteger(e);
    }
  }
  scalars(e, t, n, s) {
    if (!Array.isArray(e))
      return !1;
    if (n < 2)
      return !0;
    if (Array.isArray(e)) {
      for (let i = 0; i < e.length && i < n; i++)
        if (!this.scalar(e[i], t, s))
          return !1;
    }
    return !0;
  }
  mapKeys(e, t, n) {
    let s = Object.keys(e);
    switch (t) {
      case l.INT32:
      case l.FIXED32:
      case l.SFIXED32:
      case l.SINT32:
      case l.UINT32:
        return this.scalars(s.slice(0, n).map((i) => parseInt(i)), t, n);
      case l.BOOL:
        return this.scalars(s.slice(0, n).map((i) => i == "true" ? !0 : i == "false" ? !1 : i), t, n);
      default:
        return this.scalars(s, t, n, x.STRING);
    }
  }
}
function F(r, e) {
  switch (e) {
    case x.BIGINT:
      return r.toBigInt();
    case x.NUMBER:
      return r.toNumber();
    default:
      return r.toString();
  }
}
class nt {
  constructor(e) {
    this.info = e;
  }
  prepare() {
    var e;
    if (this.fMap === void 0) {
      this.fMap = {};
      const t = (e = this.info.fields) !== null && e !== void 0 ? e : [];
      for (const n of t)
        this.fMap[n.name] = n, this.fMap[n.jsonName] = n, this.fMap[n.localName] = n;
    }
  }
  // Cannot parse JSON <type of jsonValue> for <type name>#<fieldName>.
  assert(e, t, n) {
    if (!e) {
      let s = ye(n);
      throw (s == "number" || s == "boolean") && (s = n.toString()), new Error(`Cannot parse JSON ${s} for ${this.info.typeName}#${t}`);
    }
  }
  /**
   * Reads a message from canonical JSON format into the target message.
   *
   * Repeated fields are appended. Map entries are added, overwriting
   * existing keys.
   *
   * If a message field is already present, it will be merged with the
   * new data.
   */
  read(e, t, n) {
    this.prepare();
    const s = [];
    for (const [i, a] of Object.entries(e)) {
      const o = this.fMap[i];
      if (!o) {
        if (!n.ignoreUnknownFields)
          throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${i}`);
        continue;
      }
      const u = o.localName;
      let f;
      if (o.oneof) {
        if (a === null && (o.kind !== "enum" || o.T()[0] !== "google.protobuf.NullValue"))
          continue;
        if (s.includes(o.oneof))
          throw new Error(`Multiple members of the oneof group "${o.oneof}" of ${this.info.typeName} are present in JSON.`);
        s.push(o.oneof), f = t[o.oneof] = {
          oneofKind: u
        };
      } else
        f = t;
      if (o.kind == "map") {
        if (a === null)
          continue;
        this.assert(Ue(a), o.name, a);
        const c = f[u];
        for (const [d, m] of Object.entries(a)) {
          this.assert(m !== null, o.name + " map value", null);
          let N;
          switch (o.V.kind) {
            case "message":
              N = o.V.T().internalJsonRead(m, n);
              break;
            case "enum":
              if (N = this.enum(o.V.T(), m, o.name, n.ignoreUnknownFields), N === !1)
                continue;
              break;
            case "scalar":
              N = this.scalar(m, o.V.T, o.V.L, o.name);
              break;
          }
          this.assert(N !== void 0, o.name + " map value", m);
          let y = d;
          o.K == l.BOOL && (y = y == "true" ? !0 : y == "false" ? !1 : y), y = this.scalar(y, o.K, x.STRING, o.name).toString(), c[y] = N;
        }
      } else if (o.repeat) {
        if (a === null)
          continue;
        this.assert(Array.isArray(a), o.name, a);
        const c = f[u];
        for (const d of a) {
          this.assert(d !== null, o.name, null);
          let m;
          switch (o.kind) {
            case "message":
              m = o.T().internalJsonRead(d, n);
              break;
            case "enum":
              if (m = this.enum(o.T(), d, o.name, n.ignoreUnknownFields), m === !1)
                continue;
              break;
            case "scalar":
              m = this.scalar(d, o.T, o.L, o.name);
              break;
          }
          this.assert(m !== void 0, o.name, a), c.push(m);
        }
      } else
        switch (o.kind) {
          case "message":
            if (a === null && o.T().typeName != "google.protobuf.Value") {
              this.assert(o.oneof === void 0, o.name + " (oneof member)", null);
              continue;
            }
            f[u] = o.T().internalJsonRead(a, n, f[u]);
            break;
          case "enum":
            let c = this.enum(o.T(), a, o.name, n.ignoreUnknownFields);
            if (c === !1)
              continue;
            f[u] = c;
            break;
          case "scalar":
            f[u] = this.scalar(a, o.T, o.L, o.name);
            break;
        }
    }
  }
  /**
   * Returns `false` for unrecognized string representations.
   *
   * google.protobuf.NullValue accepts only JSON `null` (or the old `"NULL_VALUE"`).
   */
  enum(e, t, n, s) {
    if (e[0] == "google.protobuf.NullValue" && p(t === null || t === "NULL_VALUE", `Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} only accepts null.`), t === null)
      return 0;
    switch (typeof t) {
      case "number":
        return p(Number.isInteger(t), `Unable to parse field ${this.info.typeName}#${n}, enum can only be integral number, got ${t}.`), t;
      case "string":
        let i = t;
        e[2] && t.substring(0, e[2].length) === e[2] && (i = t.substring(e[2].length));
        let a = e[1][i];
        return typeof a > "u" && s ? !1 : (p(typeof a == "number", `Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} has no value for "${t}".`), a);
    }
    p(!1, `Unable to parse field ${this.info.typeName}#${n}, cannot parse enum value from ${typeof t}".`);
  }
  scalar(e, t, n, s) {
    let i;
    try {
      switch (t) {
        // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
        // Either numbers or strings are accepted. Exponent notation is also accepted.
        case l.DOUBLE:
        case l.FLOAT:
          if (e === null)
            return 0;
          if (e === "NaN")
            return Number.NaN;
          if (e === "Infinity")
            return Number.POSITIVE_INFINITY;
          if (e === "-Infinity")
            return Number.NEGATIVE_INFINITY;
          if (e === "") {
            i = "empty string";
            break;
          }
          if (typeof e == "string" && e.trim().length !== e.length) {
            i = "extra whitespace";
            break;
          }
          if (typeof e != "string" && typeof e != "number")
            break;
          let a = Number(e);
          if (Number.isNaN(a)) {
            i = "not a number";
            break;
          }
          if (!Number.isFinite(a)) {
            i = "too large or small";
            break;
          }
          return t == l.FLOAT && oe(a), a;
        // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
        case l.INT32:
        case l.FIXED32:
        case l.SFIXED32:
        case l.SINT32:
        case l.UINT32:
          if (e === null)
            return 0;
          let o;
          if (typeof e == "number" ? o = e : e === "" ? i = "empty string" : typeof e == "string" && (e.trim().length !== e.length ? i = "extra whitespace" : o = Number(e)), o === void 0)
            break;
          return t == l.UINT32 ? Z(o) : j(o), o;
        // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
        case l.INT64:
        case l.SFIXED64:
        case l.SINT64:
          if (e === null)
            return F(T.ZERO, n);
          if (typeof e != "number" && typeof e != "string")
            break;
          return F(T.from(e), n);
        case l.FIXED64:
        case l.UINT64:
          if (e === null)
            return F(D.ZERO, n);
          if (typeof e != "number" && typeof e != "string")
            break;
          return F(D.from(e), n);
        // bool:
        case l.BOOL:
          if (e === null)
            return !1;
          if (typeof e != "boolean")
            break;
          return e;
        // string:
        case l.STRING:
          if (e === null)
            return "";
          if (typeof e != "string") {
            i = "extra whitespace";
            break;
          }
          try {
            encodeURIComponent(e);
          } catch (u) {
            u = "invalid UTF8";
            break;
          }
          return e;
        // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
        // Either standard or URL-safe base64 encoding with/without paddings are accepted.
        case l.BYTES:
          if (e === null || e === "")
            return new Uint8Array(0);
          if (typeof e != "string")
            break;
          return Ie(e);
      }
    } catch (a) {
      i = a.message;
    }
    this.assert(!1, s + (i ? " - " + i : ""), e);
  }
}
class rt {
  constructor(e) {
    var t;
    this.fields = (t = e.fields) !== null && t !== void 0 ? t : [];
  }
  /**
   * Converts the message to a JSON object, based on the field descriptors.
   */
  write(e, t) {
    const n = {}, s = e;
    for (const i of this.fields) {
      if (!i.oneof) {
        let f = this.field(i, s[i.localName], t);
        f !== void 0 && (n[t.useProtoFieldName ? i.name : i.jsonName] = f);
        continue;
      }
      const a = s[i.oneof];
      if (a.oneofKind !== i.localName)
        continue;
      const o = i.kind == "scalar" || i.kind == "enum" ? Object.assign(Object.assign({}, t), { emitDefaultValues: !0 }) : t;
      let u = this.field(i, a[i.localName], o);
      p(u !== void 0), n[t.useProtoFieldName ? i.name : i.jsonName] = u;
    }
    return n;
  }
  field(e, t, n) {
    let s;
    if (e.kind == "map") {
      p(typeof t == "object" && t !== null);
      const i = {};
      switch (e.V.kind) {
        case "scalar":
          for (const [u, f] of Object.entries(t)) {
            const c = this.scalar(e.V.T, f, e.name, !1, !0);
            p(c !== void 0), i[u.toString()] = c;
          }
          break;
        case "message":
          const a = e.V.T();
          for (const [u, f] of Object.entries(t)) {
            const c = this.message(a, f, e.name, n);
            p(c !== void 0), i[u.toString()] = c;
          }
          break;
        case "enum":
          const o = e.V.T();
          for (const [u, f] of Object.entries(t)) {
            p(f === void 0 || typeof f == "number");
            const c = this.enum(o, f, e.name, !1, !0, n.enumAsInteger);
            p(c !== void 0), i[u.toString()] = c;
          }
          break;
      }
      (n.emitDefaultValues || Object.keys(i).length > 0) && (s = i);
    } else if (e.repeat) {
      p(Array.isArray(t));
      const i = [];
      switch (e.kind) {
        case "scalar":
          for (let u = 0; u < t.length; u++) {
            const f = this.scalar(e.T, t[u], e.name, e.opt, !0);
            p(f !== void 0), i.push(f);
          }
          break;
        case "enum":
          const a = e.T();
          for (let u = 0; u < t.length; u++) {
            p(t[u] === void 0 || typeof t[u] == "number");
            const f = this.enum(a, t[u], e.name, e.opt, !0, n.enumAsInteger);
            p(f !== void 0), i.push(f);
          }
          break;
        case "message":
          const o = e.T();
          for (let u = 0; u < t.length; u++) {
            const f = this.message(o, t[u], e.name, n);
            p(f !== void 0), i.push(f);
          }
          break;
      }
      (n.emitDefaultValues || i.length > 0 || n.emitDefaultValues) && (s = i);
    } else
      switch (e.kind) {
        case "scalar":
          s = this.scalar(e.T, t, e.name, e.opt, n.emitDefaultValues);
          break;
        case "enum":
          s = this.enum(e.T(), t, e.name, e.opt, n.emitDefaultValues, n.enumAsInteger);
          break;
        case "message":
          s = this.message(e.T(), t, e.name, n);
          break;
      }
    return s;
  }
  /**
   * Returns `null` as the default for google.protobuf.NullValue.
   */
  enum(e, t, n, s, i, a) {
    if (e[0] == "google.protobuf.NullValue")
      return !i && !s ? void 0 : null;
    if (t === void 0) {
      p(s);
      return;
    }
    if (!(t === 0 && !i && !s))
      return p(typeof t == "number"), p(Number.isInteger(t)), a || !e[1].hasOwnProperty(t) ? t : e[2] ? e[2] + e[1][t] : e[1][t];
  }
  message(e, t, n, s) {
    return t === void 0 ? s.emitDefaultValues ? null : void 0 : e.internalJsonWrite(t, s);
  }
  scalar(e, t, n, s, i) {
    if (t === void 0) {
      p(s);
      return;
    }
    const a = i || s;
    switch (e) {
      // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
      case l.INT32:
      case l.SFIXED32:
      case l.SINT32:
        return t === 0 ? a ? 0 : void 0 : (j(t), t);
      case l.FIXED32:
      case l.UINT32:
        return t === 0 ? a ? 0 : void 0 : (Z(t), t);
      // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
      // Either numbers or strings are accepted. Exponent notation is also accepted.
      case l.FLOAT:
        oe(t);
      case l.DOUBLE:
        return t === 0 ? a ? 0 : void 0 : (p(typeof t == "number"), Number.isNaN(t) ? "NaN" : t === Number.POSITIVE_INFINITY ? "Infinity" : t === Number.NEGATIVE_INFINITY ? "-Infinity" : t);
      // string:
      case l.STRING:
        return t === "" ? a ? "" : void 0 : (p(typeof t == "string"), t);
      // bool:
      case l.BOOL:
        return t === !1 ? a ? !1 : void 0 : (p(typeof t == "boolean"), t);
      // JSON value will be a decimal string. Either numbers or strings are accepted.
      case l.UINT64:
      case l.FIXED64:
        p(typeof t == "number" || typeof t == "string" || typeof t == "bigint");
        let o = D.from(t);
        return o.isZero() && !a ? void 0 : o.toString();
      // JSON value will be a decimal string. Either numbers or strings are accepted.
      case l.INT64:
      case l.SFIXED64:
      case l.SINT64:
        p(typeof t == "number" || typeof t == "string" || typeof t == "bigint");
        let u = T.from(t);
        return u.isZero() && !a ? void 0 : u.toString();
      // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
      // Either standard or URL-safe base64 encoding with/without paddings are accepted.
      case l.BYTES:
        return p(t instanceof Uint8Array), t.byteLength ? Oe(t) : a ? "" : void 0;
    }
  }
}
function se(r, e = x.STRING) {
  switch (r) {
    case l.BOOL:
      return !1;
    case l.UINT64:
    case l.FIXED64:
      return F(D.ZERO, e);
    case l.INT64:
    case l.SFIXED64:
    case l.SINT64:
      return F(T.ZERO, e);
    case l.DOUBLE:
    case l.FLOAT:
      return 0;
    case l.BYTES:
      return new Uint8Array(0);
    case l.STRING:
      return "";
    default:
      return 0;
  }
}
class st {
  constructor(e) {
    this.info = e;
  }
  prepare() {
    var e;
    if (!this.fieldNoToField) {
      const t = (e = this.info.fields) !== null && e !== void 0 ? e : [];
      this.fieldNoToField = new Map(t.map((n) => [n.no, n]));
    }
  }
  /**
   * Reads a message from binary format into the target message.
   *
   * Repeated fields are appended. Map entries are added, overwriting
   * existing keys.
   *
   * If a message field is already present, it will be merged with the
   * new data.
   */
  read(e, t, n, s) {
    this.prepare();
    const i = s === void 0 ? e.len : e.pos + s;
    for (; e.pos < i; ) {
      const [a, o] = e.tag(), u = this.fieldNoToField.get(a);
      if (!u) {
        let m = n.readUnknownField;
        if (m == "throw")
          throw new Error(`Unknown field ${a} (wire type ${o}) for ${this.info.typeName}`);
        let N = e.skip(o);
        m !== !1 && (m === !0 ? H.onRead : m)(this.info.typeName, t, a, o, N);
        continue;
      }
      let f = t, c = u.repeat, d = u.localName;
      switch (u.oneof && (f = f[u.oneof], f.oneofKind !== d && (f = t[u.oneof] = {
        oneofKind: d
      })), u.kind) {
        case "scalar":
        case "enum":
          let m = u.kind == "enum" ? l.INT32 : u.T, N = u.kind == "scalar" ? u.L : void 0;
          if (c) {
            let I = f[d];
            if (o == O.LengthDelimited && m != l.STRING && m != l.BYTES) {
              let L = e.uint32() + e.pos;
              for (; e.pos < L; )
                I.push(this.scalar(e, m, N));
            } else
              I.push(this.scalar(e, m, N));
          } else
            f[d] = this.scalar(e, m, N);
          break;
        case "message":
          if (c) {
            let I = f[d], L = u.T().internalBinaryRead(e, e.uint32(), n);
            I.push(L);
          } else
            f[d] = u.T().internalBinaryRead(e, e.uint32(), n, f[d]);
          break;
        case "map":
          let [y, V] = this.mapEntry(u, e, n);
          f[d][y] = V;
          break;
      }
    }
  }
  /**
   * Read a map field, expecting key field = 1, value field = 2
   */
  mapEntry(e, t, n) {
    let s = t.uint32(), i = t.pos + s, a, o;
    for (; t.pos < i; ) {
      let [u, f] = t.tag();
      switch (u) {
        case 1:
          e.K == l.BOOL ? a = t.bool().toString() : a = this.scalar(t, e.K, x.STRING);
          break;
        case 2:
          switch (e.V.kind) {
            case "scalar":
              o = this.scalar(t, e.V.T, e.V.L);
              break;
            case "enum":
              o = t.int32();
              break;
            case "message":
              o = e.V.T().internalBinaryRead(t, t.uint32(), n);
              break;
          }
          break;
        default:
          throw new Error(`Unknown field ${u} (wire type ${f}) in map entry for ${this.info.typeName}#${e.name}`);
      }
    }
    if (a === void 0) {
      let u = se(e.K);
      a = e.K == l.BOOL ? u.toString() : u;
    }
    if (o === void 0)
      switch (e.V.kind) {
        case "scalar":
          o = se(e.V.T, e.V.L);
          break;
        case "enum":
          o = 0;
          break;
        case "message":
          o = e.V.T().create();
          break;
      }
    return [a, o];
  }
  scalar(e, t, n) {
    switch (t) {
      case l.INT32:
        return e.int32();
      case l.STRING:
        return e.string();
      case l.BOOL:
        return e.bool();
      case l.DOUBLE:
        return e.double();
      case l.FLOAT:
        return e.float();
      case l.INT64:
        return F(e.int64(), n);
      case l.UINT64:
        return F(e.uint64(), n);
      case l.FIXED64:
        return F(e.fixed64(), n);
      case l.FIXED32:
        return e.fixed32();
      case l.BYTES:
        return e.bytes();
      case l.UINT32:
        return e.uint32();
      case l.SFIXED32:
        return e.sfixed32();
      case l.SFIXED64:
        return F(e.sfixed64(), n);
      case l.SINT32:
        return e.sint32();
      case l.SINT64:
        return F(e.sint64(), n);
    }
  }
}
class it {
  constructor(e) {
    this.info = e;
  }
  prepare() {
    if (!this.fields) {
      const e = this.info.fields ? this.info.fields.concat() : [];
      this.fields = e.sort((t, n) => t.no - n.no);
    }
  }
  /**
   * Writes the message to binary format.
   */
  write(e, t, n) {
    this.prepare();
    for (const i of this.fields) {
      let a, o, u = i.repeat, f = i.localName;
      if (i.oneof) {
        const c = e[i.oneof];
        if (c.oneofKind !== f)
          continue;
        a = c[f], o = !0;
      } else
        a = e[f], o = !1;
      switch (i.kind) {
        case "scalar":
        case "enum":
          let c = i.kind == "enum" ? l.INT32 : i.T;
          if (u)
            if (p(Array.isArray(a)), u == Y.PACKED)
              this.packed(t, c, i.no, a);
            else
              for (const d of a)
                this.scalar(t, c, i.no, d, !0);
          else a === void 0 ? p(i.opt) : this.scalar(t, c, i.no, a, o || i.opt);
          break;
        case "message":
          if (u) {
            p(Array.isArray(a));
            for (const d of a)
              this.message(t, n, i.T(), i.no, d);
          } else
            this.message(t, n, i.T(), i.no, a);
          break;
        case "map":
          p(typeof a == "object" && a !== null);
          for (const [d, m] of Object.entries(a))
            this.mapEntry(t, n, i, d, m);
          break;
      }
    }
    let s = n.writeUnknownFields;
    s !== !1 && (s === !0 ? H.onWrite : s)(this.info.typeName, e, t);
  }
  mapEntry(e, t, n, s, i) {
    e.tag(n.no, O.LengthDelimited), e.fork();
    let a = s;
    switch (n.K) {
      case l.INT32:
      case l.FIXED32:
      case l.UINT32:
      case l.SFIXED32:
      case l.SINT32:
        a = Number.parseInt(s);
        break;
      case l.BOOL:
        p(s == "true" || s == "false"), a = s == "true";
        break;
    }
    switch (this.scalar(e, n.K, 1, a, !0), n.V.kind) {
      case "scalar":
        this.scalar(e, n.V.T, 2, i, !0);
        break;
      case "enum":
        this.scalar(e, l.INT32, 2, i, !0);
        break;
      case "message":
        this.message(e, t, n.V.T(), 2, i);
        break;
    }
    e.join();
  }
  message(e, t, n, s, i) {
    i !== void 0 && (n.internalBinaryWrite(i, e.tag(s, O.LengthDelimited).fork(), t), e.join());
  }
  /**
   * Write a single scalar value.
   */
  scalar(e, t, n, s, i) {
    let [a, o, u] = this.scalarInfo(t, s);
    (!u || i) && (e.tag(n, a), e[o](s));
  }
  /**
   * Write an array of scalar values in packed format.
   */
  packed(e, t, n, s) {
    if (!s.length)
      return;
    p(t !== l.BYTES && t !== l.STRING), e.tag(n, O.LengthDelimited), e.fork();
    let [, i] = this.scalarInfo(t);
    for (let a = 0; a < s.length; a++)
      e[i](s[a]);
    e.join();
  }
  /**
   * Get information for writing a scalar value.
   *
   * Returns tuple:
   * [0]: appropriate WireType
   * [1]: name of the appropriate method of IBinaryWriter
   * [2]: whether the given value is a default value
   *
   * If argument `value` is omitted, [2] is always false.
   */
  scalarInfo(e, t) {
    let n = O.Varint, s, i = t === void 0, a = t === 0;
    switch (e) {
      case l.INT32:
        s = "int32";
        break;
      case l.STRING:
        a = i || !t.length, n = O.LengthDelimited, s = "string";
        break;
      case l.BOOL:
        a = t === !1, s = "bool";
        break;
      case l.UINT32:
        s = "uint32";
        break;
      case l.DOUBLE:
        n = O.Bit64, s = "double";
        break;
      case l.FLOAT:
        n = O.Bit32, s = "float";
        break;
      case l.INT64:
        a = i || T.from(t).isZero(), s = "int64";
        break;
      case l.UINT64:
        a = i || D.from(t).isZero(), s = "uint64";
        break;
      case l.FIXED64:
        a = i || D.from(t).isZero(), n = O.Bit64, s = "fixed64";
        break;
      case l.BYTES:
        a = i || !t.byteLength, n = O.LengthDelimited, s = "bytes";
        break;
      case l.FIXED32:
        n = O.Bit32, s = "fixed32";
        break;
      case l.SFIXED32:
        n = O.Bit32, s = "sfixed32";
        break;
      case l.SFIXED64:
        a = i || T.from(t).isZero(), n = O.Bit64, s = "sfixed64";
        break;
      case l.SINT32:
        s = "sint32";
        break;
      case l.SINT64:
        a = i || T.from(t).isZero(), s = "sint64";
        break;
    }
    return [n, s, i || a];
  }
}
function at(r) {
  const e = r.messagePrototype ? Object.create(r.messagePrototype) : Object.defineProperty({}, ue, { value: r });
  for (let t of r.fields) {
    let n = t.localName;
    if (!t.opt)
      if (t.oneof)
        e[t.oneof] = { oneofKind: void 0 };
      else if (t.repeat)
        e[n] = [];
      else
        switch (t.kind) {
          case "scalar":
            e[n] = se(t.T, t.L);
            break;
          case "enum":
            e[n] = 0;
            break;
          case "map":
            e[n] = {};
            break;
        }
  }
  return e;
}
function te(r, e, t) {
  let n, s = t, i;
  for (let a of r.fields) {
    let o = a.localName;
    if (a.oneof) {
      const u = s[a.oneof];
      if ((u == null ? void 0 : u.oneofKind) == null)
        continue;
      if (n = u[o], i = e[a.oneof], i.oneofKind = u.oneofKind, n == null) {
        delete i[o];
        continue;
      }
    } else if (n = s[o], i = e, n == null)
      continue;
    switch (a.repeat && (i[o].length = n.length), a.kind) {
      case "scalar":
      case "enum":
        if (a.repeat)
          for (let f = 0; f < n.length; f++)
            i[o][f] = n[f];
        else
          i[o] = n;
        break;
      case "message":
        let u = a.T();
        if (a.repeat)
          for (let f = 0; f < n.length; f++)
            i[o][f] = u.create(n[f]);
        else i[o] === void 0 ? i[o] = u.create(n) : u.mergePartial(i[o], n);
        break;
      case "map":
        switch (a.V.kind) {
          case "scalar":
          case "enum":
            Object.assign(i[o], n);
            break;
          case "message":
            let f = a.V.T();
            for (let c of Object.keys(n))
              i[o][c] = f.create(n[c]);
            break;
        }
        break;
    }
  }
}
function ot(r, e, t) {
  if (e === t)
    return !0;
  if (!e || !t)
    return !1;
  for (let n of r.fields) {
    let s = n.localName, i = n.oneof ? e[n.oneof][s] : e[s], a = n.oneof ? t[n.oneof][s] : t[s];
    switch (n.kind) {
      case "enum":
      case "scalar":
        let o = n.kind == "enum" ? l.INT32 : n.T;
        if (!(n.repeat ? me(o, i, a) : _e(o, i, a)))
          return !1;
        break;
      case "map":
        if (!(n.V.kind == "message" ? pe(n.V.T(), X(i), X(a)) : me(n.V.kind == "enum" ? l.INT32 : n.V.T, X(i), X(a))))
          return !1;
        break;
      case "message":
        let u = n.T();
        if (!(n.repeat ? pe(u, i, a) : u.equals(i, a)))
          return !1;
        break;
    }
  }
  return !0;
}
const X = Object.values;
function _e(r, e, t) {
  if (e === t)
    return !0;
  if (r !== l.BYTES)
    return !1;
  let n = e, s = t;
  if (n.length !== s.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (n[i] != s[i])
      return !1;
  return !0;
}
function me(r, e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (!_e(r, e[n], t[n]))
      return !1;
  return !0;
}
function pe(r, e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (!r.equals(e[n], t[n]))
      return !1;
  return !0;
}
const ut = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}));
class St {
  constructor(e, t, n) {
    this.defaultCheckDepth = 16, this.typeName = e, this.fields = t.map(Qe), this.options = n ?? {}, this.messagePrototype = Object.create(null, Object.assign(Object.assign({}, ut), { [ue]: { value: this } })), this.refTypeCheck = new tt(this), this.refJsonReader = new nt(this), this.refJsonWriter = new rt(this), this.refBinReader = new st(this), this.refBinWriter = new it(this);
  }
  create(e) {
    let t = at(this);
    return e !== void 0 && te(this, t, e), t;
  }
  /**
   * Clone the message.
   *
   * Unknown fields are discarded.
   */
  clone(e) {
    let t = this.create();
    return te(this, t, e), t;
  }
  /**
   * Determines whether two message of the same type have the same field values.
   * Checks for deep equality, traversing repeated fields, oneof groups, maps
   * and messages recursively.
   * Will also return true if both messages are `undefined`.
   */
  equals(e, t) {
    return ot(this, e, t);
  }
  /**
   * Is the given value assignable to our message type
   * and contains no [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
   */
  is(e, t = this.defaultCheckDepth) {
    return this.refTypeCheck.is(e, t, !1);
  }
  /**
   * Is the given value assignable to our message type,
   * regardless of [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
   */
  isAssignable(e, t = this.defaultCheckDepth) {
    return this.refTypeCheck.is(e, t, !0);
  }
  /**
   * Copy partial data into the target message.
   */
  mergePartial(e, t) {
    te(this, e, t);
  }
  /**
   * Create a new message from binary format.
   */
  fromBinary(e, t) {
    let n = Ce(t);
    return this.internalBinaryRead(n.readerFactory(e), e.byteLength, n);
  }
  /**
   * Read a new message from a JSON value.
   */
  fromJson(e, t) {
    return this.internalJsonRead(e, Ye(t));
  }
  /**
   * Read a new message from a JSON string.
   * This is equivalent to `T.fromJson(JSON.parse(json))`.
   */
  fromJsonString(e, t) {
    let n = JSON.parse(e);
    return this.fromJson(n, t);
  }
  /**
   * Write the message to canonical JSON value.
   */
  toJson(e, t) {
    return this.internalJsonWrite(e, Ge(t));
  }
  /**
   * Convert the message to canonical JSON string.
   * This is equivalent to `JSON.stringify(T.toJson(t))`
   */
  toJsonString(e, t) {
    var n;
    let s = this.toJson(e, t);
    return JSON.stringify(s, null, (n = t == null ? void 0 : t.prettySpaces) !== null && n !== void 0 ? n : 0);
  }
  /**
   * Write the message to binary format.
   */
  toBinary(e, t) {
    let n = We(t);
    return this.internalBinaryWrite(e, n.writerFactory(), n).finish();
  }
  /**
   * This is an internal method. If you just want to read a message from
   * JSON, use `fromJson()` or `fromJsonString()`.
   *
   * Reads JSON value and merges the fields into the target
   * according to protobuf rules. If the target is omitted,
   * a new instance is created first.
   */
  internalJsonRead(e, t, n) {
    if (e !== null && typeof e == "object" && !Array.isArray(e)) {
      let s = n ?? this.create();
      return this.refJsonReader.read(e, s, t), s;
    }
    throw new Error(`Unable to parse message ${this.typeName} from JSON ${ye(e)}.`);
  }
  /**
   * This is an internal method. If you just want to write a message
   * to JSON, use `toJson()` or `toJsonString().
   *
   * Writes JSON value and returns it.
   */
  internalJsonWrite(e, t) {
    return this.refJsonWriter.write(e, t);
  }
  /**
   * This is an internal method. If you just want to write a message
   * in binary format, use `toBinary()`.
   *
   * Serializes the message in binary format and appends it to the given
   * writer. Returns passed writer.
   */
  internalBinaryWrite(e, t, n) {
    return this.refBinWriter.write(e, t, n), t;
  }
  /**
   * This is an internal method. If you just want to read a message from
   * binary data, use `fromBinary()`.
   *
   * Reads data from binary format and merges the fields into
   * the target according to protobuf rules. If the target is
   * omitted, a new instance is created first.
   */
  internalBinaryRead(e, t, n, s) {
    let i = s ?? this.create();
    return this.refBinReader.read(e, i, n, t), i;
  }
}
function Bt(r) {
  return r[ue] != null;
}
function ft(r) {
  if (typeof r != "object" || r === null || !r.hasOwnProperty(0))
    return !1;
  for (let e of Object.keys(r)) {
    let t = parseInt(e);
    if (Number.isNaN(t)) {
      let n = r[e];
      if (n === void 0 || typeof n != "number" || r[n] === void 0)
        return !1;
    } else {
      let n = r[t];
      if (n === void 0 || r[n] !== t)
        return !1;
    }
  }
  return !0;
}
function Re(r) {
  if (!ft(r))
    throw new Error("not a typescript enum object");
  let e = [];
  for (let [t, n] of Object.entries(r))
    typeof n == "number" && e.push({ name: t, number: n });
  return e;
}
function xt(r) {
  return Re(r).map((e) => e.name);
}
function Ut(r) {
  return Re(r).map((e) => e.number).filter((e, t, n) => n.indexOf(e) == t);
}
function lt(r, e) {
  var t, n, s;
  let i = r;
  return i.service = e, i.localName = (t = i.localName) !== null && t !== void 0 ? t : re(i.name), i.serverStreaming = !!i.serverStreaming, i.clientStreaming = !!i.clientStreaming, i.options = (n = i.options) !== null && n !== void 0 ? n : {}, i.idempotency = (s = i.idempotency) !== null && s !== void 0 ? s : void 0, i;
}
function vt(r, e, t, n) {
  var s;
  const i = (s = r.methods.find((a, o) => a.localName === e || o === e)) === null || s === void 0 ? void 0 : s.options;
  return i && i[t] ? n.fromJson(i[t]) : void 0;
}
function Vt(r, e, t, n) {
  var s;
  const i = (s = r.methods.find((o, u) => o.localName === e || u === e)) === null || s === void 0 ? void 0 : s.options;
  if (!i)
    return;
  const a = i[t];
  return a === void 0 ? a : n ? n.fromJson(a) : a;
}
function Pt(r, e, t) {
  const n = r.options;
  if (!n)
    return;
  const s = n[e];
  return s === void 0 ? s : t ? t.fromJson(s) : s;
}
class Mt {
  constructor(e, t, n) {
    this.typeName = e, this.methods = t.map((s) => lt(s, this)), this.options = n ?? {};
  }
}
class g extends Error {
  constructor(e, t = "UNKNOWN", n) {
    super(e), this.name = "RpcError", Object.setPrototypeOf(this, new.target.prototype), this.code = t, this.meta = n ?? {};
  }
  toString() {
    const e = [this.name + ": " + this.message];
    this.code && (e.push(""), e.push("Code: " + this.code)), this.serviceName && this.methodName && e.push("Method: " + this.serviceName + "/" + this.methodName);
    let t = Object.entries(this.meta);
    if (t.length) {
      e.push(""), e.push("Meta:");
      for (let [n, s] of t)
        e.push(`  ${n}: ${s}`);
    }
    return e.join(`
`);
  }
}
function Le(r, e) {
  if (!e)
    return r;
  let t = {};
  $(r, t), $(e, t);
  for (let n of Object.keys(e)) {
    let s = e[n];
    switch (n) {
      case "jsonOptions":
        t.jsonOptions = ze(r.jsonOptions, t.jsonOptions);
        break;
      case "binaryOptions":
        t.binaryOptions = ve(r.binaryOptions, t.binaryOptions);
        break;
      case "meta":
        t.meta = {}, $(r.meta, t.meta), $(e.meta, t.meta);
        break;
      case "interceptors":
        t.interceptors = r.interceptors ? r.interceptors.concat(s) : s.concat();
        break;
    }
  }
  return t;
}
function $(r, e) {
  if (!r)
    return;
  let t = e;
  for (let [n, s] of Object.entries(r))
    s instanceof Date ? t[n] = new Date(s.getTime()) : Array.isArray(s) ? t[n] = s.concat() : t[n] = s;
}
var R;
(function(r) {
  r[r.PENDING = 0] = "PENDING", r[r.REJECTED = 1] = "REJECTED", r[r.RESOLVED = 2] = "RESOLVED";
})(R || (R = {}));
class P {
  /**
   * @param preventUnhandledRejectionWarning - prevents the warning
   * "Unhandled Promise rejection" by adding a noop rejection handler.
   * Working with calls returned from the runtime-rpc package in an
   * async function usually means awaiting one call property after
   * the other. This means that the "status" is not being awaited when
   * an earlier await for the "headers" is rejected. This causes the
   * "unhandled promise reject" warning. A more correct behaviour for
   * calls might be to become aware whether at least one of the
   * promises is handled and swallow the rejection warning for the
   * others.
   */
  constructor(e = !0) {
    this._state = R.PENDING, this._promise = new Promise((t, n) => {
      this._resolve = t, this._reject = n;
    }), e && this._promise.catch((t) => {
    });
  }
  /**
   * Get the current state of the promise.
   */
  get state() {
    return this._state;
  }
  /**
   * Get the deferred promise.
   */
  get promise() {
    return this._promise;
  }
  /**
   * Resolve the promise. Throws if the promise is already resolved or rejected.
   */
  resolve(e) {
    if (this.state !== R.PENDING)
      throw new Error(`cannot resolve ${R[this.state].toLowerCase()}`);
    this._resolve(e), this._state = R.RESOLVED;
  }
  /**
   * Reject the promise. Throws if the promise is already resolved or rejected.
   */
  reject(e) {
    if (this.state !== R.PENDING)
      throw new Error(`cannot reject ${R[this.state].toLowerCase()}`);
    this._reject(e), this._state = R.REJECTED;
  }
  /**
   * Resolve the promise. Ignore if not pending.
   */
  resolvePending(e) {
    this._state === R.PENDING && this.resolve(e);
  }
  /**
   * Reject the promise. Ignore if not pending.
   */
  rejectPending(e) {
    this._state === R.PENDING && this.reject(e);
  }
}
class ie {
  constructor() {
    this._lis = {
      nxt: [],
      msg: [],
      err: [],
      cmp: []
    }, this._closed = !1;
  }
  // --- RpcOutputStream callback API
  onNext(e) {
    return this.addLis(e, this._lis.nxt);
  }
  onMessage(e) {
    return this.addLis(e, this._lis.msg);
  }
  onError(e) {
    return this.addLis(e, this._lis.err);
  }
  onComplete(e) {
    return this.addLis(e, this._lis.cmp);
  }
  addLis(e, t) {
    return t.push(e), () => {
      let n = t.indexOf(e);
      n >= 0 && t.splice(n, 1);
    };
  }
  // remove all listeners
  clearLis() {
    for (let e of Object.values(this._lis))
      e.splice(0, e.length);
  }
  // --- Controller API
  /**
   * Is this stream already closed by a completion or error?
   */
  get closed() {
    return this._closed !== !1;
  }
  /**
   * Emit message, close with error, or close successfully, but only one
   * at a time.
   * Can be used to wrap a stream by using the other stream's `onNext`.
   */
  notifyNext(e, t, n) {
    p((e ? 1 : 0) + (t ? 1 : 0) + (n ? 1 : 0) <= 1, "only one emission at a time"), e && this.notifyMessage(e), t && this.notifyError(t), n && this.notifyComplete();
  }
  /**
   * Emits a new message. Throws if stream is closed.
   *
   * Triggers onNext and onMessage callbacks.
   */
  notifyMessage(e) {
    p(!this.closed, "stream is closed"), this.pushIt({ value: e, done: !1 }), this._lis.msg.forEach((t) => t(e)), this._lis.nxt.forEach((t) => t(e, void 0, !1));
  }
  /**
   * Closes the stream with an error. Throws if stream is closed.
   *
   * Triggers onNext and onError callbacks.
   */
  notifyError(e) {
    p(!this.closed, "stream is closed"), this._closed = e, this.pushIt(e), this._lis.err.forEach((t) => t(e)), this._lis.nxt.forEach((t) => t(void 0, e, !1)), this.clearLis();
  }
  /**
   * Closes the stream successfully. Throws if stream is closed.
   *
   * Triggers onNext and onComplete callbacks.
   */
  notifyComplete() {
    p(!this.closed, "stream is closed"), this._closed = !0, this.pushIt({ value: null, done: !0 }), this._lis.cmp.forEach((e) => e()), this._lis.nxt.forEach((e) => e(void 0, void 0, !0)), this.clearLis();
  }
  /**
   * Creates an async iterator (that can be used with `for await {...}`)
   * to consume the stream.
   *
   * Some things to note:
   * - If an error occurs, the `for await` will throw it.
   * - If an error occurred before the `for await` was started, `for await`
   *   will re-throw it.
   * - If the stream is already complete, the `for await` will be empty.
   * - If your `for await` consumes slower than the stream produces,
   *   for example because you are relaying messages in a slow operation,
   *   messages are queued.
   */
  [Symbol.asyncIterator]() {
    return this._itState || (this._itState = { q: [] }), this._closed === !0 ? this.pushIt({ value: null, done: !0 }) : this._closed !== !1 && this.pushIt(this._closed), {
      next: () => {
        let e = this._itState;
        p(e, "bad state"), p(!e.p, "iterator contract broken");
        let t = e.q.shift();
        return t ? "value" in t ? Promise.resolve(t) : Promise.reject(t) : (e.p = new P(), e.p.promise);
      }
    };
  }
  // "push" a new iterator result.
  // this either resolves a pending promise, or enqueues the result.
  pushIt(e) {
    let t = this._itState;
    if (t)
      if (t.p) {
        const n = t.p;
        p(n.state == R.PENDING, "iterator contract broken"), "value" in e ? n.resolve(e) : n.reject(e), delete t.p;
      } else
        t.q.push(e);
  }
}
var ct = function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(a) {
      a(i);
    });
  }
  return new (t || (t = Promise))(function(i, a) {
    function o(c) {
      try {
        f(n.next(c));
      } catch (d) {
        a(d);
      }
    }
    function u(c) {
      try {
        f(n.throw(c));
      } catch (d) {
        a(d);
      }
    }
    function f(c) {
      c.done ? i(c.value) : s(c.value).then(o, u);
    }
    f((n = n.apply(r, e || [])).next());
  });
};
class Fe {
  constructor(e, t, n, s, i, a, o) {
    this.method = e, this.requestHeaders = t, this.request = n, this.headers = s, this.response = i, this.status = a, this.trailers = o;
  }
  /**
   * If you are only interested in the final outcome of this call,
   * you can await it to receive a `FinishedUnaryCall`.
   */
  then(e, t) {
    return this.promiseFinished().then((n) => e ? Promise.resolve(e(n)) : n, (n) => t ? Promise.resolve(t(n)) : Promise.reject(n));
  }
  promiseFinished() {
    return ct(this, void 0, void 0, function* () {
      let [e, t, n, s] = yield Promise.all([this.headers, this.response, this.status, this.trailers]);
      return {
        method: this.method,
        requestHeaders: this.requestHeaders,
        request: this.request,
        headers: e,
        response: t,
        status: n,
        trailers: s
      };
    });
  }
}
var ht = function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(a) {
      a(i);
    });
  }
  return new (t || (t = Promise))(function(i, a) {
    function o(c) {
      try {
        f(n.next(c));
      } catch (d) {
        a(d);
      }
    }
    function u(c) {
      try {
        f(n.throw(c));
      } catch (d) {
        a(d);
      }
    }
    function f(c) {
      c.done ? i(c.value) : s(c.value).then(o, u);
    }
    f((n = n.apply(r, e || [])).next());
  });
};
class Se {
  constructor(e, t, n, s, i, a, o) {
    this.method = e, this.requestHeaders = t, this.request = n, this.headers = s, this.responses = i, this.status = a, this.trailers = o;
  }
  /**
   * Instead of awaiting the response status and trailers, you can
   * just as well await this call itself to receive the server outcome.
   * You should first setup some listeners to the `request` to
   * see the actual messages the server replied with.
   */
  then(e, t) {
    return this.promiseFinished().then((n) => e ? Promise.resolve(e(n)) : n, (n) => t ? Promise.resolve(t(n)) : Promise.reject(n));
  }
  promiseFinished() {
    return ht(this, void 0, void 0, function* () {
      let [e, t, n] = yield Promise.all([this.headers, this.status, this.trailers]);
      return {
        method: this.method,
        requestHeaders: this.requestHeaders,
        request: this.request,
        headers: e,
        status: t,
        trailers: n
      };
    });
  }
}
var dt = function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(a) {
      a(i);
    });
  }
  return new (t || (t = Promise))(function(i, a) {
    function o(c) {
      try {
        f(n.next(c));
      } catch (d) {
        a(d);
      }
    }
    function u(c) {
      try {
        f(n.throw(c));
      } catch (d) {
        a(d);
      }
    }
    function f(c) {
      c.done ? i(c.value) : s(c.value).then(o, u);
    }
    f((n = n.apply(r, e || [])).next());
  });
};
class mt {
  constructor(e, t, n, s, i, a, o) {
    this.method = e, this.requestHeaders = t, this.requests = n, this.headers = s, this.response = i, this.status = a, this.trailers = o;
  }
  /**
   * Instead of awaiting the response status and trailers, you can
   * just as well await this call itself to receive the server outcome.
   * Note that it may still be valid to send more request messages.
   */
  then(e, t) {
    return this.promiseFinished().then((n) => e ? Promise.resolve(e(n)) : n, (n) => t ? Promise.resolve(t(n)) : Promise.reject(n));
  }
  promiseFinished() {
    return dt(this, void 0, void 0, function* () {
      let [e, t, n, s] = yield Promise.all([this.headers, this.response, this.status, this.trailers]);
      return {
        method: this.method,
        requestHeaders: this.requestHeaders,
        headers: e,
        response: t,
        status: n,
        trailers: s
      };
    });
  }
}
var pt = function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(a) {
      a(i);
    });
  }
  return new (t || (t = Promise))(function(i, a) {
    function o(c) {
      try {
        f(n.next(c));
      } catch (d) {
        a(d);
      }
    }
    function u(c) {
      try {
        f(n.throw(c));
      } catch (d) {
        a(d);
      }
    }
    function f(c) {
      c.done ? i(c.value) : s(c.value).then(o, u);
    }
    f((n = n.apply(r, e || [])).next());
  });
};
class bt {
  constructor(e, t, n, s, i, a, o) {
    this.method = e, this.requestHeaders = t, this.requests = n, this.headers = s, this.responses = i, this.status = a, this.trailers = o;
  }
  /**
   * Instead of awaiting the response status and trailers, you can
   * just as well await this call itself to receive the server outcome.
   * Note that it may still be valid to send more request messages.
   */
  then(e, t) {
    return this.promiseFinished().then((n) => e ? Promise.resolve(e(n)) : n, (n) => t ? Promise.resolve(t(n)) : Promise.reject(n));
  }
  promiseFinished() {
    return pt(this, void 0, void 0, function* () {
      let [e, t, n] = yield Promise.all([this.headers, this.status, this.trailers]);
      return {
        method: this.method,
        requestHeaders: this.requestHeaders,
        headers: e,
        status: t,
        trailers: n
      };
    });
  }
}
var gt = function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(a) {
      a(i);
    });
  }
  return new (t || (t = Promise))(function(i, a) {
    function o(c) {
      try {
        f(n.next(c));
      } catch (d) {
        a(d);
      }
    }
    function u(c) {
      try {
        f(n.throw(c));
      } catch (d) {
        a(d);
      }
    }
    function f(c) {
      c.done ? i(c.value) : s(c.value).then(o, u);
    }
    f((n = n.apply(r, e || [])).next());
  });
};
class C {
  /**
   * Initialize with mock data. Omitted fields have default value.
   */
  constructor(e) {
    this.suppressUncaughtRejections = !0, this.headerDelay = 10, this.responseDelay = 50, this.betweenResponseDelay = 10, this.afterResponseDelay = 10, this.data = e ?? {};
  }
  /**
   * Sent message(s) during the last operation.
   */
  get sentMessages() {
    return this.lastInput instanceof q ? this.lastInput.sent : typeof this.lastInput == "object" ? [this.lastInput.single] : [];
  }
  /**
   * Sending message(s) completed?
   */
  get sendComplete() {
    return this.lastInput instanceof q ? this.lastInput.completed : typeof this.lastInput == "object";
  }
  // Creates a promise for response headers from the mock data.
  promiseHeaders() {
    var e;
    const t = (e = this.data.headers) !== null && e !== void 0 ? e : C.defaultHeaders;
    return t instanceof g ? Promise.reject(t) : Promise.resolve(t);
  }
  // Creates a promise for a single, valid, message from the mock data.
  promiseSingleResponse(e) {
    if (this.data.response instanceof g)
      return Promise.reject(this.data.response);
    let t;
    return Array.isArray(this.data.response) ? (p(this.data.response.length > 0), t = this.data.response[0]) : this.data.response !== void 0 ? t = this.data.response : t = e.O.create(), p(e.O.is(t)), Promise.resolve(t);
  }
  /**
   * Pushes response messages from the mock data to the output stream.
   * If an error response, status or trailers are mocked, the stream is
   * closed with the respective error.
   * Otherwise, stream is completed successfully.
   *
   * The returned promise resolves when the stream is closed. It should
   * not reject. If it does, code is broken.
   */
  streamResponses(e, t, n) {
    return gt(this, void 0, void 0, function* () {
      const s = [];
      if (this.data.response === void 0)
        s.push(e.O.create());
      else if (Array.isArray(this.data.response))
        for (let i of this.data.response)
          p(e.O.is(i)), s.push(i);
      else this.data.response instanceof g || (p(e.O.is(this.data.response)), s.push(this.data.response));
      try {
        yield A(this.responseDelay, n)(void 0);
      } catch (i) {
        t.notifyError(i);
        return;
      }
      if (this.data.response instanceof g) {
        t.notifyError(this.data.response);
        return;
      }
      for (let i of s) {
        t.notifyMessage(i);
        try {
          yield A(this.betweenResponseDelay, n)(void 0);
        } catch (a) {
          t.notifyError(a);
          return;
        }
      }
      if (this.data.status instanceof g) {
        t.notifyError(this.data.status);
        return;
      }
      if (this.data.trailers instanceof g) {
        t.notifyError(this.data.trailers);
        return;
      }
      t.notifyComplete();
    });
  }
  // Creates a promise for response status from the mock data.
  promiseStatus() {
    var e;
    const t = (e = this.data.status) !== null && e !== void 0 ? e : C.defaultStatus;
    return t instanceof g ? Promise.reject(t) : Promise.resolve(t);
  }
  // Creates a promise for response trailers from the mock data.
  promiseTrailers() {
    var e;
    const t = (e = this.data.trailers) !== null && e !== void 0 ? e : C.defaultTrailers;
    return t instanceof g ? Promise.reject(t) : Promise.resolve(t);
  }
  maybeSuppressUncaught(...e) {
    if (this.suppressUncaughtRejections)
      for (let t of e)
        t.catch(() => {
        });
  }
  mergeOptions(e) {
    return Le({}, e);
  }
  unary(e, t, n) {
    var s;
    const i = (s = n.meta) !== null && s !== void 0 ? s : {}, a = this.promiseHeaders().then(A(this.headerDelay, n.abort)), o = a.catch((c) => {
    }).then(A(this.responseDelay, n.abort)).then((c) => this.promiseSingleResponse(e)), u = o.catch((c) => {
    }).then(A(this.afterResponseDelay, n.abort)).then((c) => this.promiseStatus()), f = o.catch((c) => {
    }).then(A(this.afterResponseDelay, n.abort)).then((c) => this.promiseTrailers());
    return this.maybeSuppressUncaught(u, f), this.lastInput = { single: t }, new Fe(e, i, t, a, o, u, f);
  }
  serverStreaming(e, t, n) {
    var s;
    const i = (s = n.meta) !== null && s !== void 0 ? s : {}, a = this.promiseHeaders().then(A(this.headerDelay, n.abort)), o = new ie(), u = a.then(A(this.responseDelay, n.abort)).catch(() => {
    }).then(() => this.streamResponses(e, o, n.abort)).then(A(this.afterResponseDelay, n.abort)), f = u.then(() => this.promiseStatus()), c = u.then(() => this.promiseTrailers());
    return this.maybeSuppressUncaught(f, c), this.lastInput = { single: t }, new Se(e, i, t, a, o, f, c);
  }
  clientStreaming(e, t) {
    var n;
    const s = (n = t.meta) !== null && n !== void 0 ? n : {}, i = this.promiseHeaders().then(A(this.headerDelay, t.abort)), a = i.catch((f) => {
    }).then(A(this.responseDelay, t.abort)).then((f) => this.promiseSingleResponse(e)), o = a.catch((f) => {
    }).then(A(this.afterResponseDelay, t.abort)).then((f) => this.promiseStatus()), u = a.catch((f) => {
    }).then(A(this.afterResponseDelay, t.abort)).then((f) => this.promiseTrailers());
    return this.maybeSuppressUncaught(o, u), this.lastInput = new q(this.data, t.abort), new mt(e, s, this.lastInput, i, a, o, u);
  }
  duplex(e, t) {
    var n;
    const s = (n = t.meta) !== null && n !== void 0 ? n : {}, i = this.promiseHeaders().then(A(this.headerDelay, t.abort)), a = new ie(), o = i.then(A(this.responseDelay, t.abort)).catch(() => {
    }).then(() => this.streamResponses(e, a, t.abort)).then(A(this.afterResponseDelay, t.abort)), u = o.then(() => this.promiseStatus()), f = o.then(() => this.promiseTrailers());
    return this.maybeSuppressUncaught(u, f), this.lastInput = new q(this.data, t.abort), new bt(e, s, this.lastInput, i, a, u, f);
  }
}
C.defaultHeaders = {
  responseHeader: "test"
};
C.defaultStatus = {
  code: "OK",
  detail: "all good"
};
C.defaultTrailers = {
  responseTrailer: "test"
};
function A(r, e) {
  return (t) => new Promise((n, s) => {
    if (e != null && e.aborted)
      s(new g("user cancel", "CANCELLED"));
    else {
      const i = setTimeout(() => n(t), r);
      e && e.addEventListener("abort", (a) => {
        clearTimeout(i), s(new g("user cancel", "CANCELLED"));
      });
    }
  });
}
class q {
  constructor(e, t) {
    this._completed = !1, this._sent = [], this.data = e, this.abort = t;
  }
  get sent() {
    return this._sent;
  }
  get completed() {
    return this._completed;
  }
  send(e) {
    if (this.data.inputMessage instanceof g)
      return Promise.reject(this.data.inputMessage);
    const t = this.data.inputMessage === void 0 ? 10 : this.data.inputMessage;
    return Promise.resolve(void 0).then(() => {
      this._sent.push(e);
    }).then(A(t, this.abort));
  }
  complete() {
    if (this.data.inputComplete instanceof g)
      return Promise.reject(this.data.inputComplete);
    const e = this.data.inputComplete === void 0 ? 10 : this.data.inputComplete;
    return Promise.resolve(void 0).then(() => {
      this._completed = !0;
    }).then(A(e, this.abort));
  }
}
function z(r, e, t, n, s) {
  var i, a, o, u;
  if (r == "unary") {
    let f = (c, d, m) => e.unary(c, d, m);
    for (const c of ((i = n.interceptors) !== null && i !== void 0 ? i : []).filter((d) => d.interceptUnary).reverse()) {
      const d = f;
      f = (m, N, y) => c.interceptUnary(d, m, N, y);
    }
    return f(t, s, n);
  }
  if (r == "serverStreaming") {
    let f = (c, d, m) => e.serverStreaming(c, d, m);
    for (const c of ((a = n.interceptors) !== null && a !== void 0 ? a : []).filter((d) => d.interceptServerStreaming).reverse()) {
      const d = f;
      f = (m, N, y) => c.interceptServerStreaming(d, m, N, y);
    }
    return f(t, s, n);
  }
  if (r == "clientStreaming") {
    let f = (c, d) => e.clientStreaming(c, d);
    for (const c of ((o = n.interceptors) !== null && o !== void 0 ? o : []).filter((d) => d.interceptClientStreaming).reverse()) {
      const d = f;
      f = (m, N) => c.interceptClientStreaming(d, m, N);
    }
    return f(t, n);
  }
  if (r == "duplex") {
    let f = (c, d) => e.duplex(c, d);
    for (const c of ((u = n.interceptors) !== null && u !== void 0 ? u : []).filter((d) => d.interceptDuplex).reverse()) {
      const d = f;
      f = (m, N) => c.interceptDuplex(d, m, N);
    }
    return f(t, n);
  }
  Ke(r);
}
function Ct(r, e, t, n) {
  return z("unary", r, e, n, t);
}
function jt(r, e, t, n) {
  return z("serverStreaming", r, e, n, t);
}
function Kt(r, e, t) {
  return z("clientStreaming", r, e, t);
}
function Xt(r, e, t) {
  return z("duplex", r, e, t);
}
class $t {
  constructor(e, t, n, s, i = { code: "OK", detail: "" }) {
    this._cancelled = !1, this._listeners = [], this.method = e, this.headers = t, this.deadline = n, this.trailers = {}, this._sendRH = s, this.status = i;
  }
  /**
   * Set the call cancelled.
   *
   * Invokes all callbacks registered with onCancel() and
   * sets `cancelled = true`.
   */
  notifyCancelled() {
    if (!this._cancelled) {
      this._cancelled = !0;
      for (let e of this._listeners)
        e();
    }
  }
  /**
   * Send response headers.
   */
  sendResponseHeaders(e) {
    this._sendRH(e);
  }
  /**
   * Is the call cancelled?
   *
   * When the client closes the connection before the server
   * is done, the call is cancelled.
   *
   * If you want to cancel a request on the server, throw a
   * RpcError with the CANCELLED status code.
   */
  get cancelled() {
    return this._cancelled;
  }
  /**
   * Add a callback for cancellation.
   */
  onCancel(e) {
    const t = this._listeners;
    return t.push(e), () => {
      let n = t.indexOf(e);
      n >= 0 && t.splice(n, 1);
    };
  }
}
var h;
(function(r) {
  r[r.OK = 0] = "OK", r[r.CANCELLED = 1] = "CANCELLED", r[r.UNKNOWN = 2] = "UNKNOWN", r[r.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", r[r.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", r[r.NOT_FOUND = 5] = "NOT_FOUND", r[r.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", r[r.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", r[r.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", r[r.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", r[r.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", r[r.ABORTED = 10] = "ABORTED", r[r.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", r[r.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", r[r.INTERNAL = 13] = "INTERNAL", r[r.UNAVAILABLE = 14] = "UNAVAILABLE", r[r.DATA_LOSS = 15] = "DATA_LOSS";
})(h || (h = {}));
var wt = function(r, e, t, n) {
  function s(i) {
    return i instanceof t ? i : new t(function(a) {
      a(i);
    });
  }
  return new (t || (t = Promise))(function(i, a) {
    function o(c) {
      try {
        f(n.next(c));
      } catch (d) {
        a(d);
      }
    }
    function u(c) {
      try {
        f(n.throw(c));
      } catch (d) {
        a(d);
      }
    }
    function f(c) {
      c.done ? i(c.value) : s(c.value).then(o, u);
    }
    f((n = n.apply(r, e || [])).next());
  });
};
function be(r, e, t, n, s) {
  if (n)
    for (let [i, a] of Object.entries(n))
      if (typeof a == "string")
        r.append(i, a);
      else
        for (let o of a)
          r.append(i, o);
  if (r.set("Content-Type", e === "text" ? "application/grpc-web-text" : "application/grpc-web+proto"), e == "text" && r.set("Accept", "application/grpc-web-text"), r.set("X-Grpc-Web", "1"), s && r.set("X-User-Agent", s), typeof t == "number") {
    if (t <= 0)
      throw new g(`timeout ${t} ms exceeded`, h[h.DEADLINE_EXCEEDED]);
    r.set("grpc-timeout", `${t}m`);
  } else if (t) {
    const i = t.getTime(), a = Date.now();
    if (i <= a)
      throw new g(`deadline ${t} exceeded`, h[h.DEADLINE_EXCEEDED]);
    r.set("grpc-timeout", `${i - a}m`);
  }
  return r;
}
function ge(r, e) {
  let t = new Uint8Array(5 + r.length);
  t[0] = S.DATA;
  for (let n = r.length, s = 4; s > 0; s--)
    t[s] = n % 256, n >>>= 8;
  return t.set(r, 5), e === "binary" ? t : Oe(t);
}
function ae(r, e, t) {
  if (arguments.length === 1) {
    let u = r, f;
    try {
      f = u.type;
    } catch {
    }
    switch (f) {
      case "error":
      case "opaque":
      case "opaqueredirect":
        throw new g(`fetch response type ${u.type}`, h[h.UNKNOWN]);
    }
    return ae(It(u.headers), u.status, u.statusText);
  }
  let n = r, s = e >= 200 && e < 300, i = xe(n), [a, o] = Be(n);
  return (a === void 0 || a === h.OK) && !s && (a = Ot(e), o = t), [a, o, i];
}
function we(r) {
  let e = yt(r), [t, n] = Be(e), s = xe(e);
  return [t ?? h.OK, n, s];
}
var S;
(function(r) {
  r[r.DATA = 0] = "DATA", r[r.TRAILER = 128] = "TRAILER";
})(S || (S = {}));
function Ne(r, e, t) {
  return wt(this, void 0, void 0, function* () {
    let n, s = "", i = new Uint8Array(0), a = Et(e);
    if (Nt(r)) {
      let o = r.getReader();
      n = {
        next: () => o.read()
      };
    } else
      n = r[Symbol.asyncIterator]();
    for (; ; ) {
      let o = yield n.next();
      if (o.value !== void 0) {
        if (a === "text") {
          for (let f = 0; f < o.value.length; f++)
            s += String.fromCharCode(o.value[f]);
          let u = s.length - s.length % 4;
          if (u === 0)
            continue;
          i = Ee(i, Ie(s.substring(0, u))), s = s.substring(u);
        } else
          i = Ee(i, o.value);
        for (; i.length >= 5 && i[0] === S.DATA; ) {
          let u = 0;
          for (let f = 1; f < 5; f++)
            u = (u << 8) + i[f];
          if (i.length - 5 >= u)
            t(S.DATA, i.subarray(5, 5 + u)), i = i.subarray(5 + u);
          else
            break;
        }
      }
      if (o.done) {
        if (i.length === 0)
          break;
        if (i[0] !== S.TRAILER || i.length < 5)
          throw new g("premature EOF", h[h.DATA_LOSS]);
        t(S.TRAILER, i.subarray(5));
        break;
      }
    }
  });
}
const Nt = (r) => typeof r.getReader == "function";
function Ee(r, e) {
  let t = new Uint8Array(r.length + e.length);
  return t.set(r), t.set(e, r.length), t;
}
function Et(r) {
  switch (r) {
    case "application/grpc-web-text":
    case "application/grpc-web-text+proto":
      return "text";
    case "application/grpc-web":
    case "application/grpc-web+proto":
      return "binary";
    case void 0:
    case null:
      throw new g("missing response content type", h[h.INTERNAL]);
    default:
      throw new g("unexpected response content type: " + r, h[h.INTERNAL]);
  }
}
function Be(r) {
  let e, t, n = r["grpc-message"];
  if (n !== void 0) {
    if (Array.isArray(n))
      return [h.INTERNAL, "invalid grpc-web message"];
    t = n;
  }
  let s = r["grpc-status"];
  if (s !== void 0) {
    if (Array.isArray(s))
      return [h.INTERNAL, "invalid grpc-web status"];
    if (e = parseInt(s, 10), h[e] === void 0)
      return [h.INTERNAL, "invalid grpc-web status"];
  }
  return [e, t];
}
function xe(r) {
  let e = {};
  for (let [t, n] of Object.entries(r))
    switch (t) {
      case "grpc-message":
      case "grpc-status":
      case "content-type":
        break;
      default:
        e[t] = n;
    }
  return e;
}
function yt(r) {
  let e = {};
  for (let t of String.fromCharCode.apply(String, r).trim().split(`\r
`)) {
    if (t == "")
      continue;
    let [n, ...s] = t.split(":");
    const i = s.join(":").trim();
    n = n.trim();
    let a = e[n];
    typeof a == "string" ? e[n] = [a, i] : Array.isArray(a) ? a.push(i) : e[n] = i;
  }
  return e;
}
function It(r) {
  let e = {};
  return r.forEach((t, n) => {
    let s = e[n];
    typeof s == "string" ? e[n] = [s, t] : Array.isArray(s) ? s.push(t) : e[n] = t;
  }), e;
}
function Ot(r) {
  switch (r) {
    case 200:
      return h.OK;
    case 400:
      return h.INVALID_ARGUMENT;
    case 401:
      return h.UNAUTHENTICATED;
    case 403:
      return h.PERMISSION_DENIED;
    case 404:
      return h.NOT_FOUND;
    case 409:
      return h.ABORTED;
    case 412:
      return h.FAILED_PRECONDITION;
    case 429:
      return h.RESOURCE_EXHAUSTED;
    case 499:
      return h.CANCELLED;
    case 500:
      return h.UNKNOWN;
    case 501:
      return h.UNIMPLEMENTED;
    case 503:
      return h.UNAVAILABLE;
    case 504:
      return h.DEADLINE_EXCEEDED;
    default:
      return h.UNKNOWN;
  }
}
class qt {
  constructor(e) {
    this.defaultOptions = e;
  }
  mergeOptions(e) {
    return Le(this.defaultOptions, e);
  }
  /**
   * Create an URI for a gRPC web call.
   *
   * Takes the `baseUrl` option and appends:
   * - slash "/"
   * - package name
   * - dot "."
   * - service name
   * - slash "/"
   * - method name
   *
   * If the service was declared without a package, the package name and dot
   * are omitted.
   *
   * All names are used exactly like declared in .proto.
   */
  makeUrl(e, t) {
    let n = t.baseUrl;
    return n.endsWith("/") && (n = n.substring(0, n.length - 1)), `${n}/${e.service.typeName}/${e.name}`;
  }
  clientStreaming(e) {
    const t = new g("Client streaming is not supported by grpc-web", h[h.UNIMPLEMENTED]);
    throw t.methodName = e.name, t.serviceName = e.service.typeName, t;
  }
  duplex(e) {
    const t = new g("Duplex streaming is not supported by grpc-web", h[h.UNIMPLEMENTED]);
    throw t.methodName = e.name, t.serviceName = e.service.typeName, t;
  }
  serverStreaming(e, t, n) {
    var s, i, a, o;
    let u = n, f = (s = u.format) !== null && s !== void 0 ? s : "text", c = (i = u.fetchInit) !== null && i !== void 0 ? i : {}, d = this.makeUrl(e, u), m = e.I.toBinary(t, u.binaryOptions), N = new P(), y = new ie(), V = !0, I, L = new P(), B, M = new P();
    return globalThis.fetch(d, Object.assign(Object.assign({}, c), {
      method: "POST",
      headers: be(new globalThis.Headers(), f, u.timeout, u.meta),
      body: ge(m, f),
      signal: (a = n.abort) !== null && a !== void 0 ? a : null
      // node-fetch@3.0.0-beta.9 rejects `undefined`
    })).then((w) => {
      let [b, k, _] = ae(w);
      if (N.resolve(_), b != null && b !== h.OK)
        throw new g(k ?? h[b], h[b], _);
      return b != null && (I = {
        code: h[b],
        detail: k ?? h[b]
      }), w;
    }).then((w) => {
      if (!w.body)
        throw new g("missing response body", h[h.INTERNAL]);
      return Ne(w.body, w.headers.get("content-type"), (b, k) => {
        switch (b) {
          case S.DATA:
            y.notifyMessage(e.O.fromBinary(k, u.binaryOptions)), V = !1;
            break;
          case S.TRAILER:
            let _, U;
            [_, U, B] = we(k), I = {
              code: h[_],
              detail: U ?? h[_]
            };
            break;
        }
      });
    }).then(() => {
      if (!B && !V)
        throw new g("missing trailers", h[h.DATA_LOSS]);
      if (!I)
        throw new g("missing status", h[h.INTERNAL]);
      if (I.code !== "OK")
        throw new g(I.detail, I.code, B);
      y.notifyComplete(), L.resolve(I), M.resolve(B || {});
    }).catch((w) => {
      let b;
      w instanceof g ? b = w : w instanceof Error && w.name === "AbortError" ? b = new g(w.message, h[h.CANCELLED]) : b = new g(w instanceof Error ? w.message : "" + w, h[h.INTERNAL]), b.methodName = e.name, b.serviceName = e.service.typeName, N.rejectPending(b), y.notifyError(b), L.rejectPending(b), M.rejectPending(b);
    }), new Se(e, (o = u.meta) !== null && o !== void 0 ? o : {}, t, N.promise, y, L.promise, M.promise);
  }
  unary(e, t, n) {
    var s, i, a, o;
    let u = n, f = (s = u.format) !== null && s !== void 0 ? s : "text", c = (i = u.fetchInit) !== null && i !== void 0 ? i : {}, d = this.makeUrl(e, u), m = e.I.toBinary(t, u.binaryOptions), N = new P(), y, V = new P(), I, L = new P(), B, M = new P();
    return globalThis.fetch(d, Object.assign(Object.assign({}, c), {
      method: "POST",
      headers: be(new globalThis.Headers(), f, u.timeout, u.meta),
      body: ge(m, f),
      signal: (a = n.abort) !== null && a !== void 0 ? a : null
      // node-fetch@3.0.0-beta.9 rejects `undefined`
    })).then((w) => {
      let [b, k, _] = ae(w);
      if (N.resolve(_), b != null && b !== h.OK)
        throw new g(k ?? h[b], h[b], _);
      return b != null && (I = {
        code: h[b],
        detail: k ?? h[b]
      }), w;
    }).then((w) => {
      if (!w.body)
        throw new g("missing response body", h[h.INTERNAL]);
      return Ne(w.body, w.headers.get("content-type"), (b, k) => {
        switch (b) {
          case S.DATA:
            if (y)
              throw new g("unary call received 2nd message", h[h.DATA_LOSS]);
            y = e.O.fromBinary(k, u.binaryOptions);
            break;
          case S.TRAILER:
            let _, U;
            [_, U, B] = we(k), I = {
              code: h[_],
              detail: U ?? h[_]
            };
            break;
        }
      });
    }).then(() => {
      if (!B && y)
        throw new g("missing trailers", h[h.DATA_LOSS]);
      if (!I)
        throw new g("missing status", h[h.INTERNAL]);
      if (!y && I.code === "OK")
        throw new g("expected error status", h[h.DATA_LOSS]);
      if (!y)
        throw new g(I.detail, I.code, B);
      if (V.resolve(y), I.code !== "OK")
        throw new g(I.detail, I.code, B);
      L.resolve(I), M.resolve(B || {});
    }).catch((w) => {
      let b;
      w instanceof g ? b = w : w instanceof Error && w.name === "AbortError" ? b = new g(w.message, h[h.CANCELLED]) : b = new g(w instanceof Error ? w.message : "" + w, h[h.INTERNAL]), b.methodName = e.name, b.serviceName = e.service.typeName, N.rejectPending(b), V.rejectPending(b), L.rejectPending(b), M.rejectPending(b);
    }), new Fe(e, (o = u.meta) !== null && o !== void 0 ? o : {}, t, N.promise, V.promise, L.promise, M.promise);
  }
}
export {
  je as BinaryReader,
  Ze as BinaryWriter,
  mt as ClientStreamingCall,
  P as Deferred,
  R as DeferredState,
  bt as DuplexStreamingCall,
  h as GrpcStatusCode,
  qt as GrpcWebFetchTransport,
  S as GrpcWebFrame,
  x as LongType,
  ue as MESSAGE_TYPE,
  St as MessageType,
  T as PbLong,
  D as PbULong,
  st as ReflectionBinaryReader,
  it as ReflectionBinaryWriter,
  nt as ReflectionJsonReader,
  rt as ReflectionJsonWriter,
  tt as ReflectionTypeCheck,
  Y as RepeatType,
  g as RpcError,
  ie as RpcOutputStreamController,
  l as ScalarType,
  $t as ServerCallContextController,
  Se as ServerStreamingCall,
  Mt as ServiceType,
  C as TestTransport,
  Fe as UnaryCall,
  H as UnknownFieldHandler,
  O as WireType,
  p as assert,
  oe as assertFloat32,
  j as assertInt32,
  Ke as assertNever,
  Z as assertUInt32,
  Ie as base64decode,
  Oe as base64encode,
  Ce as binaryReadOptions,
  We as binaryWriteOptions,
  Lt as clearOneofValue,
  Bt as containsMessageType,
  ge as createGrpcWebRequestBody,
  be as createGrpcWebRequestHeader,
  _t as getOneofValue,
  Ft as getSelectedOneofValue,
  ft as isEnumObject,
  Ue as isJsonObject,
  et as isOneofGroup,
  Ye as jsonReadOptions,
  Ge as jsonWriteOptions,
  xt as listEnumNames,
  Ut as listEnumNumbers,
  Re as listEnumValues,
  re as lowerCamelCase,
  ve as mergeBinaryOptions,
  ze as mergeJsonOptions,
  Le as mergeRpcOptions,
  Qe as normalizeFieldInfo,
  At as readFieldOption,
  kt as readFieldOptions,
  Ne as readGrpcWebResponseBody,
  ae as readGrpcWebResponseHeader,
  we as readGrpcWebResponseTrailer,
  Dt as readMessageOption,
  Vt as readMethodOption,
  vt as readMethodOptions,
  Pt as readServiceOption,
  at as reflectionCreate,
  ot as reflectionEquals,
  te as reflectionMergePartial,
  se as reflectionScalarDefault,
  Rt as setOneofValue,
  Kt as stackClientStreamingInterceptors,
  Xt as stackDuplexStreamingInterceptors,
  z as stackIntercept,
  jt as stackServerStreamingInterceptors,
  Ct as stackUnaryInterceptors,
  ye as typeofJsonValue,
  Tt as utf8read
};
