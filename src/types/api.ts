export type UserRole = 'check_holder' | 'investor' | 'moderator' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type ListingStatus = 'pending_moderation' | 'published' | 'rejected' | 'matched' | 'expired' | 'withdrawn' | 'settled_off_platform';
export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'off_platform_confirmed' | 'settled';
export type SettlementType = 'off_platform' | 'escrow' | 'principal_ledger';
export type IssuerType = 'legal' | 'natural';
export type DocumentType = 'national_id_front' | 'national_id_back' | 'selfie' | 'cheque_image' | 'id_document' | 'supplementary';
export type NotificationType = 'match_created' | 'match_accepted' | 'match_declined' | 'match_cancelled' | 'settlement_confirmed' | 'listing_published' | 'listing_rejected' | 'listing_expired' | 'kyc_approved' | 'kyc_rejected' | 'new_moderation_item';
export type NotificationChannel = 'in_app' | 'sms' | 'email';
export type NotificationStatus = 'pending' | 'sent' | 'read' | 'failed';
export type ModerationDecision = 'approved' | 'rejected';
export type RejectionCode = 'MOD_101' | 'MOD_102' | 'MOD_103' | 'MOD_104' | 'MOD_105' | 'MOD_106';

export type GeneralErrorCode = 'VALIDATION_ERROR' | 'AUTHENTICATION_ERROR' | 'PERMISSION_ERROR' | 'NOT_FOUND_ERROR' | 'SERVER_ERROR';
export type ListingErrorCode = 'LST_201' | 'LST_202' | 'LST_203' | 'LST_204' | 'LST_205' | 'LST_206';
export type ModerationErrorCode = 'MOD_101' | 'MOD_102' | 'MOD_103' | 'MOD_104' | 'MOD_105' | 'MOD_106' | 'MOD_306';
export type ErrorCode = GeneralErrorCode | ListingErrorCode | ModerationErrorCode;

export interface ApiErrorDetail { field?: string; code: ErrorCode | string; message: string; }
export interface ApiErrorEnvelope { error: { code: string; message: string; details?: Record<string, string[]> | ApiErrorDetail[]; }; }

export interface LoginRequest { identifier: string; password: string; }
export interface LoginResponse { access: string; refresh: string; user: { id: number; username: string; email: string; name: string; role: UserRole; }; }
export interface RegisterRequest { username: string; email?: string; password: string; password_confirm: string; name?: string; phone?: string; role: 'check_holder' | 'investor'; }
export interface RegisterResponse { access: string; refresh: string; user: { id: number; username: string; email: string; name: string; role: 'check_holder' | 'investor'; }; }
export interface RefreshTokenRequest { refresh: string; }
export interface RefreshTokenResponse { access: string; refresh: string; user: { id: number; username: string; email: string; name: string; role: UserRole; }; }

export interface ListingDocumentItem { id: number; document_type: string; file_name?: string; created_at?: string; }
export interface User { id: number; username: string; email: string; name: string; phone?: string | null; role: UserRole; is_verified: boolean; created_at?: string; updated_at?: string; }
export interface Profile { id: number; username: string; email: string; name: string; phone: string; role: UserRole; bio: string; is_verified: boolean; created_at: string; updated_at: string; }

export interface Document { id: number; document_type: DocumentType; file: string; file_size: number; }
export interface Verification { id: number; full_name: string; national_id: string; company_name: string; status: VerificationStatus; rejection_reason: string; rejection_code: string; documents: Document[]; }
export interface CreateVerificationRequest { full_name: string; national_id?: string; company_name?: string; national_id_front?: File | string; national_id_back?: File | string; selfie?: File | string; }

export interface IssuerProfile { id: number; national_or_company_id: string; name: string; credit_score: number | null; created_at: string; updated_at: string; }
export interface ChequeListing { id: number; owner_id: number; issuer_profile: IssuerProfile; bank_name: string; cheque_serial_number: string; face_amount: string; due_date: string; issuer_type: IssuerType; issuer_name: string; issuer_national_id: string; description: string; suggested_discount_rate: string | null; risk_tier: 'low' | 'medium' | 'high' | null; status: ListingStatus; rejection_reason: string; rejection_code: string | null; resubmit_count: number; documents?: ListingDocumentItem[]; created_at: string; updated_at: string; }
export interface CreateListingRequest { issuer?: number; bank_name: string; cheque_serial_number: string; face_amount: number | string; due_date: string; issuer_type: IssuerType; issuer_name: string; issuer_national_id: string; description?: string; suggested_discount_rate?: string | null; }
export type UpdateListingRequest = Partial<CreateListingRequest>;
export interface ListingFilters { risk_tier?: 'low' | 'medium' | 'high'; min_amount?: number; max_amount?: number; max_days_to_due?: number; issuer_type?: 'legal' | 'natural'; bank_name?: string; ordering?: string; page?: number; page_size?: number; }

export interface MarketplaceListing { id: number; owner_id: number; issuer_profile: IssuerProfile; bank_name: string; cheque_serial_number: string; face_amount: string; due_date: string; issuer_type: IssuerType; issuer_name: string; issuer_national_id: string; description: string; suggested_discount_rate: string | null; risk_tier: 'low' | 'medium' | 'high' | null; status: ListingStatus; days_to_due: number; interest_count: number; published_at: string | null; created_at: string; updated_at: string; }
export interface MarketplaceLatestListing { id: number; issuer_profile: IssuerProfile; bank_name: string; face_amount: string; due_date: string; issuer_type: IssuerType; suggested_discount_rate: string | null; risk_tier: 'low' | 'medium' | 'high' | null; status: ListingStatus; days_to_due: number; created_at: string; }

export interface UserSummary { id: number; username: string; name: string; phone?: string; email?: string; }
export interface ListingSummary { id: number; bank_name: string; face_amount: string; due_date: string; status: ListingStatus; created_at: string; updated_at: string; }
export interface Match { id: number; listing: ListingSummary; investor: UserSummary; check_holder: UserSummary; status: MatchStatus; settlement_type: SettlementType; final_discount_rate: string | null; terms: string; message: string; created_at: string; updated_at: string; }
export interface CreateMatchRequest { listing_id: number; message?: string; settlement_type?: SettlementType; }
export interface UpdateMatchStatusRequest { status: MatchStatus; final_discount_rate?: string | null; terms?: string; }

export interface ModerationQueueItem { id: number; owner_id: number; issuer_profile: IssuerProfile; bank_name: string; cheque_serial_number: string; face_amount: string; due_date: string; issuer_type: IssuerType; issuer_name: string; issuer_national_id: string; description: string; suggested_discount_rate: string | null; risk_tier: 'low' | 'medium' | 'high' | null; status: ListingStatus; rejection_reason: string; rejection_code: string | null; resubmit_count: number; created_at: string; updated_at: string; }
export interface ModerationDecisionRequest { decision: 'approve' | 'reject'; rejection_code?: RejectionCode; rejection_note?: string; }
export interface ModerationDecisionResponse { id: number; listing: number; moderator: number | null; decision: ModerationDecision; rejection_code: RejectionCode | null; rejection_code_display: string | null; rejection_note: string; created_at: string; }

export interface Notification { id: number; type: NotificationType; channel: NotificationChannel; status: NotificationStatus; title: string; message: string; related_object_type?: string; related_object_id?: string; read_at: string | null; sent_at: string | null; created_at: string; }
export interface NotificationPreferences { in_app_enabled: boolean; sms_enabled: boolean; email_enabled: boolean; }
export interface MarkNotificationReadRequest { is_read: boolean; }

export interface FeatureFlag { key: string; description: string; is_enabled: boolean; is_system: boolean; }
export interface AuditEvent { id: number; actor: number; actor_username: string; event_type: string; object_type: string; object_id: string; metadata: Record<string, any>; ip_address: string; created_at: string; }
export interface AdminDashboardStats { listings: { total: number; published: number; pending_moderation: number; rejected: number; expired: number; matched: number; }; users: { total: number; kyc_pending: number; kyc_approved: number; }; verifications: { pending: number; }; notifications: { unread: number; }; }

export interface PaginatedResponse<T> { count: number; next: string | null; previous: string | null; results: T[]; }
export interface ApiError { field?: string; code: string; message: string; }

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = { match_created: 'ابراز تمایل جدید', match_accepted: 'تطابق پذیرفته شد', match_declined: 'تطابق رد شد', match_cancelled: 'تطابق لغو شده', settlement_confirmed: 'تسویه تأیید شد', listing_published: 'آگهی منتشر شد', listing_rejected: 'آگهی رد شد', listing_expired: 'آگهی منقضی شد', kyc_approved: 'احراز هویت تأیید شد', kyc_rejected: 'احراز هویت رد شده', new_moderation_item: 'آگهی/احراز هویت جدید', };
export const REJECTION_CODE_LABELS: Record<RejectionCode, string> = { MOD_101: 'اطلاعات ناقص', MOD_102: 'تصویر ناخوانا', MOD_103: 'عدم تطابق', MOD_104: 'محتوای غیرمجاز', MOD_105: 'مدارک صادرکننده ناقص', MOD_106: 'سایر', };
export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = { pending_moderation: 'در انتظار بررسی', published: 'منتشر شده', rejected: 'رد شده', matched: 'تطابق داده شده', expired: 'منقضی شده', withdrawn: 'پس گرفته شده', settled_off_platform: 'تسویه شده', };
export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = { pending: 'در انتظار', accepted: 'پذیرفته شده', declined: 'رد شده', cancelled: 'لغو شده', off_platform_confirmed: 'تأیید تسویه', settled: 'تسویه نهایی', };
