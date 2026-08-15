import 'server-only';
import path from 'node:path';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { fileTypeFromBuffer } from 'file-type';

export const MAX_LEAD_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
]);

export interface ValidatedLeadFile {
  buffer: Buffer;
  mime: string;
  extension: string;
  bytes: number;
}

export async function validateLeadAttachment(file: File): Promise<ValidatedLeadFile | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_LEAD_FILE_BYTES) throw new Error('file_too_large');

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_MIME.has(detected.mime)) throw new Error('file_type_invalid');
  if (file.type && file.type !== 'application/octet-stream' && file.type !== detected.mime) {
    throw new Error('file_type_invalid');
  }

  return { buffer, mime: detected.mime, extension: detected.ext, bytes: buffer.length };
}

function uploadRoot(): string {
  return process.env.PORTFOLIO_UPLOAD_PATH?.trim() || path.join(process.cwd(), 'uploads', 'portfolio', 'leads');
}

export async function saveLeadAttachment(
  validated: ValidatedLeadFile,
  leadId: number,
  now = new Date()
): Promise<{ relativePath: string; mime: string; bytes: number }> {
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const filename = `${leadId}-${randomUUID()}.${validated.extension}`;
  const relativePath = path.join(year, month, filename).replaceAll('\\', '/');
  const absolutePath = path.resolve(uploadRoot(), relativePath);
  const root = path.resolve(uploadRoot());
  if (!absolutePath.startsWith(`${root}${path.sep}`)) throw new Error('invalid_upload_path');
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, validated.buffer, { flag: 'wx' });
  return { relativePath, mime: validated.mime, bytes: validated.bytes };
}

export async function deleteLeadAttachment(relativePath: string): Promise<void> {
  const root = path.resolve(uploadRoot());
  const absolutePath = path.resolve(root, relativePath);
  if (!absolutePath.startsWith(`${root}${path.sep}`)) return;
  await unlink(absolutePath).catch(() => undefined);
}
