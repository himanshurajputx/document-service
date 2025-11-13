export function parseFileSize(sizeStr: string): number {
  const match = /^(\d+)(KB|MB|GB)?$/i.exec(sizeStr.trim());
  if (!match) return 0;

  const size = parseInt(match[1], 10);
  const unit = match[2]?.toUpperCase() || 'B';

  switch (unit) {
    case 'KB':
      return size * 1024;
    case 'MB':
      return size * 1024 * 1024;
    case 'GB':
      return size * 1024 * 1024 * 1024;
    default:
      return size;
  }
}
