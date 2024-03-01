// utils for formatting, unformatting, and checking validity of a phone number
export function formatPhoneNumber(num: string | undefined) {
  let rawnum = num;
  if (!rawnum) {
    // check for undefined input
    return undefined;
  }
  // unformat it, just in case you're getting it already formatted
  rawnum = unformatPhoneNumber(rawnum);
  // return undefined if the number is too short to be valid
  if (rawnum.length < 10) {
    return undefined;
  }
  // pad the start with 1 (US extension) if you get a 10-digit number
  rawnum = rawnum.padStart(11, '1');
  // [415555555555] => [+41 (555) 555-5555]
  return `+${rawnum.slice(0, -10)} \(${rawnum.slice(-10, -7)}\) ${rawnum.slice(
    -7,
    -4
  )}-${rawnum.slice(-4)}`;
}

export function unformatPhoneNumber(phoneNum: string) {
  // un-format phone number [+41 (555) 555-5555]=>[415555555555]
  return phoneNum.replace(/\D/g, '');
}

export function isValidPhoneNumber(phoneNum: string | undefined) {
  // use the formatting util and check if it returns undefined
  const num = formatPhoneNumber(phoneNum);
  return typeof num === 'string';
}
