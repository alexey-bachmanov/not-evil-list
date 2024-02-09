export default function formatPhoneNumber(num: string | undefined) {
  if (!num) {
    return undefined;
  }
  return `\(${num.slice(0, 3)}\) ${num.slice(3, 6)}-${num.slice(6)}`;
}
