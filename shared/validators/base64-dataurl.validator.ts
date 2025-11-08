import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

type Options = {
  allowRawBase64?: boolean;
  maxBytes?: number; // hard limit after decoding
  allowedMimeTypes?: string[]; // only enforced when data URL is used
};

@ValidatorConstraint({ name: 'IsBase64DataUrl', async: false })
export class IsBase64DataUrl implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    if (typeof value !== 'string' || value.length === 0) return false;

    const [opts] = (args?.constraints || []) as [Options?];
    const allowRawBase64 = !!opts?.allowRawBase64;
    const maxBytes = opts?.maxBytes ?? 10 * 1024 * 1024;
    const allowedMimeTypes = opts?.allowedMimeTypes ?? [];

    // Accept either data URL or raw base64
    const dataUrlMatch = value.match(/^data:([^;]+);base64,([A-Za-z0-9+/=\r\n]+)$/);

    let mime: string | undefined;
    let b64: string;

    if (dataUrlMatch) {
      mime = dataUrlMatch[1];
      b64 = dataUrlMatch[2].replace(/\r?\n/g, '');
      if (allowedMimeTypes.length && !allowedMimeTypes.includes(mime)) return false;
    } else {
      if (!allowRawBase64) return false;
      // raw base64 (no mime in front)
      if (!/^[A-Za-z0-9+/=\r\n]+$/.test(value)) return false;
      b64 = value.replace(/\r?\n/g, '');
    }

    // Quick size calculation without decoding: bytes ≈ (len * 3) / 4 - padding
    const len = b64.length;
    const padding = (b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0);
    const approxBytes = Math.floor((len * 3) / 4) - padding;

    if (approxBytes <= 0 || approxBytes > maxBytes) return false;

    // Final sanity check: attempt a light decode to catch malformed base64
    try {
      Buffer.from(b64, 'base64');
    } catch {
      return false;
    }

    return true;
  }

  defaultMessage(args?: ValidationArguments): string {
    const [opts] = (args?.constraints || []) as [Options?];
    const maxBytes = opts?.maxBytes ?? 10 * 1024 * 1024;
    const types = (opts?.allowedMimeTypes ?? []).join(', ') || 'valid mime types';

    return `fileContent must be a valid base64${opts?.allowRawBase64 ? ' or data URL' : ' data URL'
      } and <= ${Math.floor(maxBytes / (1024 * 1024))}MB${opts?.allowedMimeTypes?.length ? ` (${types})` : ''}`;
  }
}
