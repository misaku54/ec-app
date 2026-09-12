// バックエンドはタイムゾーンなしの日本時間（例: "2026-09-13T03:59:04.596"）を返す。
// Date に変換すると閲覧者のタイムゾーンで解釈されてずれるため、文字列のまま整形する。
const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/;

export const formatDateTime = (value?: string | null): string => {
  if (!value) return "";

  const matched = DATE_TIME_PATTERN.exec(value);
  if (!matched) return value;

  const [, year, month, day, hour, minute] = matched;
  return `${year}/${month}/${day} ${hour}:${minute}`;
};

export const formatDate = (value?: string | null): string => {
  const formatted = formatDateTime(value);
  return formatted.split(" ")[0] ?? "";
};
