// shared/types/enquiry.ts
export interface EnquiryDocument {
  id: string                    // crypto.randomUUID() — server-set
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
  name: string                  // Max 100 chars, HTML-entity encoded
  email: string                 // Validated email
  message: string               // Max 2000 chars, HTML-entity encoded
  referralSource: ReferralSource
  honeypotTriggered: boolean
  ipHash: string                // SHA-256 of IP — never raw
  userAgent: string             // Truncated to 200 chars
  status: 'new' | 'read' | 'responded' | 'archived'
  adminNotes: string            // Internal — max 500 chars
  respondedAt?: FirestoreTimestamp
}

export type ReferralSource =
  | 'google_search' | 'social_media' | 'word_of_mouth'
  | 'baatn_directory' | 'bacp_directory' | 'other'

export interface SiteSettings {
  id: 'global'
  acceptingNewClients: boolean
  bannerMessage: string        // Max 200 chars
  updatedAt: FirestoreTimestamp
  updatedBy: string            // Admin UID
}

// FirestoreTimestamp is a placeholder; in code, use firebase-admin/firestore Timestamp
export type FirestoreTimestamp = any