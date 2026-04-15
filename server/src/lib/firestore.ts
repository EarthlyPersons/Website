import { SignJWT, importPKCS8 } from 'jose'
import type { WorkerBindings } from '../types/bindings'

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { timestampValue: string }

type FirestoreFields = Record<string, FirestoreValue>

function normalizePrivateKey(pem: string): string {
  return pem.replace(/\\n/g, '\n')
}

async function getAccessToken(env: WorkerBindings): Promise<string | null> {
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    return null
  }

  const pkcs8 = normalizePrivateKey(env.FIREBASE_PRIVATE_KEY)
  const key = await importPKCS8(pkcs8, 'RS256')

  const assertion = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/datastore',
  })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(env.FIREBASE_CLIENT_EMAIL)
    .setSubject(env.FIREBASE_CLIENT_EMAIL)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('3600s')
    .sign(key)

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  })

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!res.ok) {
    return null
  }

  const json = (await res.json()) as { access_token?: string }
  return json.access_token ?? null
}

function timestampField(iso: string): FirestoreValue {
  return { timestampValue: iso }
}

export type EnquiryWritePayload = {
  id: string
  name: string
  email: string
  message: string
  referralSource: string
  honeypotTriggered: boolean
  ipHash: string
  userAgent: string
  status: 'new' | 'read' | 'responded' | 'archived'
  adminNotes: string
}

export async function writeEnquiryToFirestore(
  payload: EnquiryWritePayload,
  env: WorkerBindings
): Promise<void> {
  const projectId = env.FIREBASE_PROJECT_ID?.trim()
  if (!projectId) {
    return
  }

  const token = await getAccessToken(env)
  if (!token) {
    throw new Error('Firestore credentials are not configured')
  }

  const now = new Date().toISOString()
  const fields: FirestoreFields = {
    id: { stringValue: payload.id },
    createdAt: timestampField(now),
    updatedAt: timestampField(now),
    name: { stringValue: payload.name },
    email: { stringValue: payload.email },
    message: { stringValue: payload.message },
    referralSource: { stringValue: payload.referralSource },
    honeypotTriggered: { booleanValue: payload.honeypotTriggered },
    ipHash: { stringValue: payload.ipHash },
    userAgent: { stringValue: payload.userAgent },
    status: { stringValue: payload.status },
    adminNotes: { stringValue: payload.adminNotes },
  }

  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    projectId
  )}/databases/(default)/documents/enquiries?documentId=${encodeURIComponent(payload.id)}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Firestore write failed: ${res.status} ${errText}`)
  }
}

export type SiteSettingsResponse = {
  acceptingNewClients: boolean
  bannerMessage: string
}

function readStringField(
  fields: Record<string, { stringValue?: string }> | undefined,
  key: string
): string | undefined {
  return fields?.[key]?.stringValue
}

function readBoolField(
  fields: Record<string, { booleanValue?: boolean }> | undefined,
  key: string
): boolean | undefined {
  return fields?.[key]?.booleanValue
}

export async function getSiteSettings(env: WorkerBindings): Promise<SiteSettingsResponse> {
  const token = await getAccessToken(env)
  if (!token) {
    return { acceptingNewClients: true, bannerMessage: '' }
  }

  const projectId = env.FIREBASE_PROJECT_ID?.trim()
  if (!projectId) {
    return { acceptingNewClients: true, bannerMessage: '' }
  }

  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    projectId
  )}/databases/(default)/documents/settings/global`

  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    return { acceptingNewClients: true, bannerMessage: '' }
  }

  const doc = (await res.json()) as { fields?: Record<string, unknown> }
  const fields = doc.fields as
    | Record<string, { stringValue?: string; booleanValue?: boolean }>
    | undefined

  return {
    acceptingNewClients: readBoolField(fields, 'acceptingNewClients') ?? true,
    bannerMessage: readStringField(fields, 'bannerMessage') ?? '',
  }
}
