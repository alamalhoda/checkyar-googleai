import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  User,
  Profile,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ChequeListing,
  MarketplaceListing,
  CreateListingRequest,
  UpdateListingRequest,
  ListingFilters,
  Match,
  CreateMatchRequest,
  UpdateMatchStatusRequest,
  ModerationQueueItem,
  ModerationDecisionRequest,
  ModerationDecisionResponse,
  Notification,
  NotificationPreferences,
  Verification,
  CreateVerificationRequest,
  FeatureFlag,
  AuditEvent,
  AdminDashboardStats,
  PaginatedResponse,
  ApiErrorEnvelope
} from '../types/api';

const STORAGE_KEY = 'chequeyar_simulator_v1';

export const useBackendSimulatorStore = defineStore('backendSimulator', () => {
  // Initial seed data generators
  const seedUsers: User[] = [
    { id: 1, username: 'holder1', email: 'holder@chequeyar.ir', name: 'رضا صبوری (دارنده چک)', phone: '09121111111', role: 'check_holder', is_verified: true },
    { id: 2, username: 'investor1', email: 'investor@chequeyar.ir', name: 'سرمایه‌گذاری نوین (سرمایه‌گذار)', phone: '09122222222', role: 'investor', is_verified: true },
    { id: 3, username: 'mod1', email: 'mod@chequeyar.ir', name: 'علی حسینی (ناظر)', phone: '09123333333', role: 'moderator', is_verified: true },
    { id: 4, username: 'admin1', email: 'admin@chequeyar.ir', name: 'مدیر سامانه چک‌یار', phone: '09124444444', role: 'admin', is_verified: true }
  ];

  const seedProfiles: Record<number, Profile> = {
    1: { id: 1, username: 'holder1', email: 'holder@chequeyar.ir', name: 'رضا صبوری (دارنده چک)', phone: '09121111111', role: 'check_holder', bio: 'فعال صنعت تولید و بازرگانی چوب', is_verified: true, created_at: '2025-01-10T08:00:00Z', updated_at: '2025-01-10T08:00:00Z' },
    2: { id: 2, username: 'investor1', email: 'investor@chequeyar.ir', name: 'سرمایه‌گذاری نوین (سرمایه‌گذار)', phone: '09122222222', role: 'investor', bio: 'صندوق تخصصی خرید مطالبات کوتاه مدت', is_verified: true, created_at: '2025-01-12T09:30:00Z', updated_at: '2025-01-12T09:30:00Z' },
    3: { id: 3, username: 'mod1', email: 'mod@chequeyar.ir', name: 'علی حسینی (ناظر)', phone: '09123333333', role: 'moderator', bio: 'کارشناس اعتبارسنجی و تطابق صیاد', is_verified: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
    4: { id: 4, username: 'admin1', email: 'admin@chequeyar.ir', name: 'مدیر سامانه چک‌یار', phone: '09124444444', role: 'admin', bio: 'مدیریت کل سیستم چک‌یار', is_verified: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' }
  };

  const seedListings: ChequeListing[] = [
    {
      id: 101,
      owner_id: 1,
      issuer_profile: { id: 10, national_or_company_id: '1010203040', name: 'شرکت فولاد صنعت آریا', credit_score: 780, created_at: '2025-01-15T10:00:00Z', updated_at: '2025-01-15T10:00:00Z' },
      bank_name: 'بانک ملت',
      cheque_serial_number: '7410293841',
      face_amount: '1200000000',
      due_date: '2026-09-15',
      issuer_type: 'legal',
      issuer_name: 'شرکت فولاد صنعت آریا',
      issuer_national_id: '1010203040',
      description: 'چک صیادی بنفش بابت خرید مواد اولیه میلگرد، اعتبارسنجی سفید',
      suggested_discount_rate: '2.5',
      risk_tier: 'low',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-01T10:00:00Z',
      updated_at: '2025-02-02T11:00:00Z'
    },
    {
      id: 102,
      owner_id: 1,
      issuer_profile: { id: 11, national_or_company_id: '1038291048', name: 'بازرگانی پارس داروی البرز', credit_score: 820, created_at: '2025-01-16T10:00:00Z', updated_at: '2025-01-16T10:00:00Z' },
      bank_name: 'بانک پاسارگاد',
      cheque_serial_number: '8820192834',
      face_amount: '2500000000',
      due_date: '2026-10-20',
      issuer_type: 'legal',
      issuer_name: 'بازرگانی پارس داروی البرز',
      issuer_national_id: '1038291048',
      description: 'چک شرکتی معتبر تامین دارویی بیمارستانی',
      suggested_discount_rate: '2.2',
      risk_tier: 'low',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-03T14:30:00Z',
      updated_at: '2025-02-04T09:00:00Z'
    },
    {
      id: 103,
      owner_id: 1,
      issuer_profile: { id: 12, national_or_company_id: '0078921043', name: 'محمدجواد رضایی (فروشگاه پارچه)', credit_score: 650, created_at: '2025-01-17T10:00:00Z', updated_at: '2025-01-17T10:00:00Z' },
      bank_name: 'بانک ملی ایران',
      cheque_serial_number: '3310928172',
      face_amount: '450000000',
      due_date: '2026-08-10',
      issuer_type: 'natural',
      issuer_name: 'محمدجواد رضایی (فروشگاه پارچه)',
      issuer_national_id: '0078921043',
      description: 'چک شخصی کسب‌وکار بازار تهران',
      suggested_discount_rate: '3.1',
      risk_tier: 'medium',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-05T08:15:00Z',
      updated_at: '2025-02-05T10:00:00Z'
    },
    {
      id: 104,
      owner_id: 1,
      issuer_profile: { id: 13, national_or_company_id: '1086129384', name: 'صنایع غذایی بهروز', credit_score: 790, created_at: '2025-01-18T10:00:00Z', updated_at: '2025-01-18T10:00:00Z' },
      bank_name: 'بانک تجارت',
      cheque_serial_number: '9910293812',
      face_amount: '1800000000',
      due_date: '2026-11-05',
      issuer_type: 'legal',
      issuer_name: 'صنایع غذایی بهروز',
      issuer_national_id: '1086129384',
      description: 'چک صیادی بابت فروش خط تولید خمیرمایه',
      suggested_discount_rate: '2.4',
      risk_tier: 'low',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-06T12:00:00Z',
      updated_at: '2025-02-07T10:00:00Z'
    },
    {
      id: 105,
      owner_id: 1,
      issuer_profile: { id: 14, national_or_company_id: '0061293841', name: 'حمیدرضا امیری', credit_score: 580, created_at: '2025-01-19T10:00:00Z', updated_at: '2025-01-19T10:00:00Z' },
      bank_name: 'بانک صادرات ایران',
      cheque_serial_number: '4410293811',
      face_amount: '350000000',
      due_date: '2026-07-28',
      issuer_type: 'natural',
      issuer_name: 'حمیدرضا امیری',
      issuer_national_id: '0061293841',
      description: 'چک بازار خرد تجهیزات الکترونیکی',
      suggested_discount_rate: '3.8',
      risk_tier: 'high',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-08T09:00:00Z',
      updated_at: '2025-02-08T11:00:00Z'
    },
    {
      id: 106,
      owner_id: 1,
      issuer_profile: { id: 15, national_or_company_id: '1010394821', name: 'گروه صنعتی کاوه', credit_score: 750, created_at: '2025-01-20T10:00:00Z', updated_at: '2025-01-20T10:00:00Z' },
      bank_name: 'بانک سامان',
      cheque_serial_number: '5520193822',
      face_amount: '3200000000',
      due_date: '2026-12-01',
      issuer_type: 'legal',
      issuer_name: 'گروه صنعتی کاوه',
      issuer_national_id: '1010394821',
      description: 'چک معتبر کارخانه کاشی و سرامیک',
      suggested_discount_rate: '2.6',
      risk_tier: 'medium',
      status: 'pending_moderation',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-10T15:00:00Z',
      updated_at: '2025-02-10T15:00:00Z'
    },
    {
      id: 107,
      owner_id: 1,
      issuer_profile: { id: 16, national_or_company_id: '0054321987', name: 'سارا کاظمی', credit_score: 700, created_at: '2025-01-21T10:00:00Z', updated_at: '2025-01-21T10:00:00Z' },
      bank_name: 'بانک پارسیان',
      cheque_serial_number: '6610293844',
      face_amount: '600000000',
      due_date: '2026-09-30',
      issuer_type: 'natural',
      issuer_name: 'سارا کاظمی',
      issuer_national_id: '0054321987',
      description: 'چک شخصی آموزشگاه زبان',
      suggested_discount_rate: '2.9',
      risk_tier: 'medium',
      status: 'pending_moderation',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-11T10:00:00Z',
      updated_at: '2025-02-11T10:00:00Z'
    },
    {
      id: 108,
      owner_id: 1,
      issuer_profile: { id: 17, national_or_company_id: '1010998877', name: 'پتروشیمی جم', credit_score: 890, created_at: '2025-01-22T10:00:00Z', updated_at: '2025-01-22T10:00:00Z' },
      bank_name: 'بانک سپه',
      cheque_serial_number: '7710293855',
      face_amount: '5000000000',
      due_date: '2027-01-15',
      issuer_type: 'legal',
      issuer_name: 'پتروشیمی جم',
      issuer_national_id: '1010998877',
      description: 'چک شرکتی رتبه الف معتبر بین‌المللی',
      suggested_discount_rate: '2.0',
      risk_tier: 'low',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-12T08:00:00Z',
      updated_at: '2025-02-12T09:00:00Z'
    },
    {
      id: 109,
      owner_id: 1,
      issuer_profile: { id: 18, national_or_company_id: '0087654321', name: 'مهدی کریمی', credit_score: 610, created_at: '2025-01-23T10:00:00Z', updated_at: '2025-01-23T10:00:00Z' },
      bank_name: 'بانک آینده',
      cheque_serial_number: '8810293866',
      face_amount: '280000000',
      due_date: '2026-08-15',
      issuer_type: 'natural',
      issuer_name: 'مهدی کریمی',
      issuer_national_id: '0087654321',
      description: 'تصویر تصویربرداری ناخوانا - رد شده جهت اصلاح',
      suggested_discount_rate: '3.5',
      risk_tier: 'high',
      status: 'rejected',
      rejection_reason: 'تصویر برگ چک ناخوانا است. لطفاً اسکن باکیفیت‌تر بارگذاری کنید.',
      rejection_code: 'MOD_102',
      resubmit_count: 1,
      created_at: '2025-02-13T11:00:00Z',
      updated_at: '2025-02-13T14:00:00Z'
    },
    {
      id: 110,
      owner_id: 1,
      issuer_profile: { id: 19, national_or_company_id: '1020304050', name: 'تکمیل ساخت پاسارگاد', credit_score: 720, created_at: '2025-01-24T10:00:00Z', updated_at: '2025-01-24T10:00:00Z' },
      bank_name: 'بانک مسکن',
      cheque_serial_number: '9910293877',
      face_amount: '1500000000',
      due_date: '2026-10-10',
      issuer_type: 'legal',
      issuer_name: 'تکمیل ساخت پاسارگاد',
      issuer_national_id: '1020304050',
      description: 'چک پیمانکاری پروژه انبوه سازی',
      suggested_discount_rate: '2.8',
      risk_tier: 'medium',
      status: 'matched',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-14T10:00:00Z',
      updated_at: '2025-02-15T12:00:00Z'
    },
    {
      id: 111,
      owner_id: 1,
      issuer_profile: { id: 20, national_or_company_id: '1030405060', name: 'فناوری اطلاعات رایان', credit_score: 800, created_at: '2025-01-25T10:00:00Z', updated_at: '2025-01-25T10:00:00Z' },
      bank_name: 'بانک کشاورزی',
      cheque_serial_number: '1120293888',
      face_amount: '800000000',
      due_date: '2026-09-01',
      issuer_type: 'legal',
      issuer_name: 'فناوری اطلاعات رایان',
      issuer_national_id: '1030405060',
      description: 'چک نرم‌افزاری پشتیبانی شبکه',
      suggested_discount_rate: '2.3',
      risk_tier: 'low',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-15T09:00:00Z',
      updated_at: '2025-02-15T10:00:00Z'
    },
    {
      id: 112,
      owner_id: 1,
      issuer_profile: { id: 21, national_or_company_id: '0011223344', name: 'فاطمه احمدی', credit_score: 670, created_at: '2025-01-26T10:00:00Z', updated_at: '2025-01-26T10:00:00Z' },
      bank_name: 'بانک رفاه کارگران',
      cheque_serial_number: '2230293899',
      face_amount: '400000000',
      due_date: '2026-11-20',
      issuer_type: 'natural',
      issuer_name: 'فاطمه احمدی',
      issuer_national_id: '0011223344',
      description: 'چک شخصی خریدار لوازم منزل',
      suggested_discount_rate: '3.0',
      risk_tier: 'medium',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-16T13:00:00Z',
      updated_at: '2025-02-16T14:00:00Z'
    },
    {
      id: 113,
      owner_id: 1,
      issuer_profile: { id: 22, national_or_company_id: '1040506070', name: 'تولیدی پوشاک پگاه', credit_score: 710, created_at: '2025-01-27T10:00:00Z', updated_at: '2025-01-27T10:00:00Z' },
      bank_name: 'بانک شهر',
      cheque_serial_number: '3340293800',
      face_amount: '950000000',
      due_date: '2026-12-15',
      issuer_type: 'legal',
      issuer_name: 'تولیدی پوشاک پگاه',
      issuer_national_id: '1040506070',
      description: 'چک صیادی بنفش تولیدی پوشاک عمده',
      suggested_discount_rate: '2.7',
      risk_tier: 'medium',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-17T11:00:00Z',
      updated_at: '2025-02-17T12:00:00Z'
    },
    {
      id: 114,
      owner_id: 1,
      issuer_profile: { id: 23, national_or_company_id: '1050607080', name: 'صنایع شیمیایی سپاهان', credit_score: 840, created_at: '2025-01-28T10:00:00Z', updated_at: '2025-01-28T10:00:00Z' },
      bank_name: 'بانک ملت',
      cheque_serial_number: '4450293811',
      face_amount: '4100000000',
      due_date: '2027-02-01',
      issuer_type: 'legal',
      issuer_name: 'صنایع شیمیایی سپاهان',
      issuer_national_id: '1050607080',
      description: 'چک خریدار ماده رزین صنعتی',
      suggested_discount_rate: '2.1',
      risk_tier: 'low',
      status: 'published',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-18T14:00:00Z',
      updated_at: '2025-02-18T15:00:00Z'
    },
    {
      id: 115,
      owner_id: 1,
      issuer_profile: { id: 24, national_or_company_id: '0099887766', name: 'کامران نوری', credit_score: 640, created_at: '2025-01-29T10:00:00Z', updated_at: '2025-01-29T10:00:00Z' },
      bank_name: 'بانک سینا',
      cheque_serial_number: '5560293822',
      face_amount: '220000000',
      due_date: '2026-08-01',
      issuer_type: 'natural',
      issuer_name: 'کامران نوری',
      issuer_national_id: '0099887766',
      description: 'چک شخصی بازار آهن تهران',
      suggested_discount_rate: '3.3',
      risk_tier: 'high',
      status: 'pending_moderation',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: '2025-02-19T09:00:00Z',
      updated_at: '2025-02-19T09:00:00Z'
    }
  ];

  const seedMatches: Match[] = [
    {
      id: 501,
      listing: { id: 110, bank_name: 'بانک مسکن', face_amount: '1500000000', due_date: '2026-10-10', status: 'matched', created_at: '2025-02-14T10:00:00Z', updated_at: '2025-02-15T12:00:00Z' },
      investor: { id: 2, username: 'investor1', name: 'سرمایه‌گذاری نوین (سرمایه‌گذار)' },
      check_holder: { id: 1, username: 'holder1', name: 'رضا صبوری (دارنده چک)' },
      status: 'accepted',
      settlement_type: 'off_platform',
      final_discount_rate: '2.7',
      terms: 'توافق بر سر نرخ تنزیل ۲.۷٪ ماهیانه و انتقال حضور در دفتر اسناد رسمی شماره ۱۲ تهران.',
      message: 'با سلام، آماده خرید کامل این چک با تسویه حضوری در تهران هستیم.',
      created_at: '2025-02-14T16:00:00Z',
      updated_at: '2025-02-15T10:00:00Z'
    },
    {
      id: 502,
      listing: { id: 101, bank_name: 'بانک ملت', face_amount: '1200000000', due_date: '2026-09-15', status: 'published', created_at: '2025-02-01T10:00:00Z', updated_at: '2025-02-02T11:00:00Z' },
      investor: { id: 2, username: 'investor1', name: 'سرمایه‌گذاری نوین (سرمایه‌گذار)' },
      check_holder: { id: 1, username: 'holder1', name: 'رضا صبوری (دارنده چک)' },
      status: 'pending',
      settlement_type: 'escrow',
      final_discount_rate: '2.5',
      terms: 'پیشنهاد خرید با نرخ تنزیل پیشنهاد شده و تسویه امن امانی',
      message: 'در صورت تایید امانی سامانه آماده تخصیص اعتبار فوری هستیم.',
      created_at: '2025-02-18T10:00:00Z',
      updated_at: '2025-02-18T10:00:00Z'
    }
  ];

  const seedNotifications: Notification[] = [
    {
      id: 901,
      type: 'listing_published',
      channel: 'in_app',
      status: 'sent',
      title: 'آگهی منتشر شد',
      message: 'آگهی چک بانک پاسارگاد به مبلغ ۲.۵ میلیارد ریال با موفقیت تایید و منتشر گردید.',
      related_object_type: 'listing',
      related_object_id: '102',
      read_at: null,
      sent_at: '2025-02-04T09:00:00Z',
      created_at: '2025-02-04T09:00:00Z'
    },
    {
      id: 902,
      type: 'match_created',
      channel: 'in_app',
      status: 'sent',
      title: 'ابراز تمایل جدید',
      message: 'سرمایه‌گذار «سرمایه‌گذاری نوین» برای آگهی چک ۱.۲ میلیارد ریالی بانک ملت ابراز تمایل نمود.',
      related_object_type: 'match',
      related_object_id: '502',
      read_at: null,
      sent_at: '2025-02-18T10:00:00Z',
      created_at: '2025-02-18T10:00:00Z'
    },
    {
      id: 903,
      type: 'kyc_approved',
      channel: 'in_app',
      status: 'read',
      title: 'احراز هویت تایید شد',
      message: 'مدارک هویت و حساب بانکی شما با موفقیت در سامانه چک‌یار ثبت و احراز شد.',
      related_object_type: 'kyc',
      related_object_id: '1',
      read_at: '2025-01-11T10:00:00Z',
      sent_at: '2025-01-11T08:00:00Z',
      created_at: '2025-01-11T08:00:00Z'
    }
  ];

  const seedVerifications: Verification[] = [
    {
      id: 1,
      full_name: 'رضا صبوری',
      national_id: '0071234567',
      company_name: 'بازرگانی صبوری',
      status: 'approved',
      rejection_reason: '',
      rejection_code: '',
      documents: [
        { id: 10, document_type: 'national_id_front', file: '/mock/id_front.jpg', file_size: 102400 },
        { id: 11, document_type: 'national_id_back', file: '/mock/id_back.jpg', file_size: 108500 }
      ]
    },
    {
      id: 2,
      full_name: 'سرمایه‌گذاری نوین',
      national_id: '10103334445',
      company_name: 'صندوق توسعه مالی نوین',
      status: 'approved',
      rejection_reason: '',
      rejection_code: '',
      documents: [
        { id: 12, document_type: 'id_document', file: '/mock/company_id.jpg', file_size: 204800 }
      ]
    },
    {
      id: 3,
      full_name: 'سعید مرادی',
      national_id: '0089911223',
      company_name: 'فروشگاه مرادی',
      status: 'pending',
      rejection_reason: '',
      rejection_code: '',
      documents: [
        { id: 13, document_type: 'national_id_front', file: '/mock/id_front_3.jpg', file_size: 150000 },
        { id: 14, document_type: 'selfie', file: '/mock/selfie_3.jpg', file_size: 180000 }
      ]
    }
  ];

  const seedFeatureFlags: FeatureFlag[] = [
    { key: 'ENABLE_ESCROW_SETTLEMENT', description: 'فعال‌سازی تسویه امن امانی چک‌ورزی در پلتفرم', is_enabled: true, is_system: true },
    { key: 'ENABLE_SMS_NOTIFICATIONS', description: 'ارسال پیامک اطلاع‌رسانی تطابق و تغییر وضعیت', is_enabled: fontSmsEnabled(), is_system: false },
    { key: 'ENABLE_SAYAD_DIRECT_INQUIRY', description: 'استعلام مستقیم صیادی از بانک مرکزی', is_enabled: true, is_system: true },
    { key: 'ENABLE_STRICT_RATE_LIMITING', description: 'محدودیت تعداد ابراز تمایل همزمان', is_enabled: false, is_system: false }
  ];

  function fontSmsEnabled() { return true; }

  const seedAuditEvents: AuditEvent[] = [
    { id: 1, actor: 1, actor_username: 'holder1', event_type: 'LISTING_CREATED', object_type: 'ChequeListing', object_id: '101', metadata: { bank: 'بانک ملت', amount: '1200000000' }, ip_address: '185.190.10.12', created_at: '2025-02-01T10:00:00Z' },
    { id: 2, actor: 3, actor_username: 'mod1', event_type: 'LISTING_APPROVED', object_type: 'ChequeListing', object_id: '101', metadata: { decision: 'approved' }, ip_address: '5.160.22.8', created_at: '2025-02-02T11:00:00Z' },
    { id: 3, actor: 2, actor_username: 'investor1', event_type: 'MATCH_CREATED', object_type: 'Match', object_id: '502', metadata: { listing_id: 101 }, ip_address: '91.92.100.4', created_at: '2025-02-18T10:00:00Z' }
  ];

  // Load state from localStorage or initialize
  const users = ref<User[]>([]);
  const profiles = ref<Record<number, Profile>>({});
  const listings = ref<ChequeListing[]>([]);
  const matches = ref<Match[]>([]);
  const notifications = ref<Notification[]>([]);
  const verifications = ref<Verification[]>([]);
  const featureFlags = ref<FeatureFlag[]>([]);
  const auditEvents = ref<AuditEvent[]>([]);
  const notificationPrefs = ref<NotificationPreferences>({
    in_app_enabled: true,
    sms_enabled: true,
    email_enabled: false
  });

  function init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        users.value = parsed.users || seedUsers;
        profiles.value = parsed.profiles || seedProfiles;
        listings.value = parsed.listings || seedListings;
        matches.value = parsed.matches || seedMatches;
        notifications.value = parsed.notifications || seedNotifications;
        verifications.value = parsed.verifications || seedVerifications;
        featureFlags.value = parsed.featureFlags || seedFeatureFlags;
        auditEvents.value = parsed.auditEvents || seedAuditEvents;
        if (parsed.notificationPrefs) notificationPrefs.value = parsed.notificationPrefs;
      } else {
        resetToSeed();
      }
    } catch (e) {
      resetToSeed();
    }
  }

  function resetToSeed() {
    users.value = JSON.parse(JSON.stringify(seedUsers));
    profiles.value = JSON.parse(JSON.stringify(seedProfiles));
    listings.value = JSON.parse(JSON.stringify(seedListings));
    matches.value = JSON.parse(JSON.stringify(seedMatches));
    notifications.value = JSON.parse(JSON.stringify(seedNotifications));
    verifications.value = JSON.parse(JSON.stringify(seedVerifications));
    featureFlags.value = JSON.parse(JSON.stringify(seedFeatureFlags));
    auditEvents.value = JSON.parse(JSON.stringify(seedAuditEvents));
    persist();
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        users: users.value,
        profiles: profiles.value,
        listings: listings.value,
        matches: matches.value,
        notifications: notifications.value,
        verifications: verifications.value,
        featureFlags: featureFlags.value,
        auditEvents: auditEvents.value,
        notificationPrefs: notificationPrefs.value
      }));
    } catch (e) {
      console.error('Failed to persist simulator state', e);
    }
  }

  init();

  // Helper for standardized API Error Envelope
  function createErrorEnvelope(code: string, message: string, details?: any): ApiErrorEnvelope {
    return {
      error: {
        code,
        message,
        details
      }
    };
  }

  // --- Auth Handlers ---
  async function handleLogin(req: LoginRequest): Promise<LoginResponse> {
    const user = users.value.find(u => u.username === req.identifier || u.email === req.identifier);
    if (!user) {
      throw createErrorEnvelope('AUTHENTICATION_ERROR', 'نام کاربری یا رمز عبور اشتباه است.');
    }
    return {
      access: `mock-access-token-${user.id}-${Date.now()}`,
      refresh: `mock-refresh-token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  async function handleRegister(req: RegisterRequest): Promise<RegisterResponse> {
    if (req.password !== req.password_confirm) {
      throw createErrorEnvelope('VALIDATION_ERROR', 'رمز عبور و تایید آن یکسان نیستند.', {
        password_confirm: ['رمز عبور و تایید آن باید مطابقت داشته باشند.']
      });
    }
    const existing = users.value.find(u => u.username === req.username);
    if (existing) {
      throw createErrorEnvelope('VALIDATION_ERROR', 'این نام کاربری قبلا ثبت شده است.', {
        username: ['این نام کاربری تکراری است.']
      });
    }

    const newUser: User = {
      id: Date.now(),
      username: req.username,
      email: req.email || `${req.username}@chequeyar.ir`,
      name: req.name || req.username,
      phone: req.phone || '09120000000',
      role: req.role,
      is_verified: false
    };

    users.value.push(newUser);
    profiles.value[newUser.id] = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone || '',
      role: newUser.role,
      bio: '',
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    persist();

    return {
      access: `mock-access-token-${newUser.id}-${Date.now()}`,
      refresh: `mock-refresh-token-${newUser.id}-${Date.now()}`,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role as 'check_holder' | 'investor'
      }
    };
  }

  // --- Listings Handlers ---
  function getMarketplaceListings(filters: ListingFilters): PaginatedResponse<MarketplaceListing> {
    let result = listings.value.filter(l => l.status === 'published').map(l => {
      // compute days_to_due
      const due = new Date(l.due_date).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((due - now) / (1000 * 3600 * 24));
      const mItem: MarketplaceListing = {
        ...l,
        days_to_due: diff > 0 ? diff : 0,
        interest_count: matches.value.filter(m => m.listing.id === l.id).length,
        published_at: l.updated_at
      };
      return mItem;
    });

    if (filters.risk_tier) {
      result = result.filter(r => r.risk_tier === filters.risk_tier);
    }
    if (filters.bank_name) {
      result = result.filter(r => r.bank_name.includes(filters.bank_name!));
    }
    if (filters.issuer_type) {
      result = result.filter(r => r.issuer_type === filters.issuer_type);
    }
    if (filters.min_amount) {
      result = result.filter(r => Number(r.face_amount) >= filters.min_amount!);
    }
    if (filters.max_amount) {
      result = result.filter(r => Number(r.face_amount) <= filters.max_amount!);
    }
    if (filters.max_days_to_due) {
      result = result.filter(r => r.days_to_due <= filters.max_days_to_due!);
    }

    const page = filters.page || 1;
    const pageSize = filters.page_size || 10;
    const start = (page - 1) * pageSize;
    const paged = result.slice(start, start + pageSize);

    return {
      count: result.length,
      next: start + pageSize < result.length ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results: paged
    };
  }

  function getMyListings(userId: number): ChequeListing[] {
    return listings.value.filter(l => l.owner_id === userId);
  }

  function getListingById(id: number): ChequeListing {
    const found = listings.value.find(l => l.id === id);
    if (!found) {
      throw createErrorEnvelope('NOT_FOUND_ERROR', 'آگهی چک مورد نظر یافت نشد.');
    }
    return found;
  }

  function createListing(userId: number, req: CreateListingRequest): ChequeListing {
    const newListing: ChequeListing = {
      id: Date.now(),
      owner_id: userId,
      issuer_profile: {
        id: Date.now() + 1,
        national_or_company_id: req.issuer_national_id,
        name: req.issuer_name,
        credit_score: 750,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      bank_name: req.bank_name,
      cheque_serial_number: req.cheque_serial_number,
      face_amount: String(req.face_amount),
      due_date: req.due_date,
      issuer_type: req.issuer_type,
      issuer_name: req.issuer_name,
      issuer_national_id: req.issuer_national_id,
      description: req.description || '',
      suggested_discount_rate: req.suggested_discount_rate || '2.5',
      risk_tier: 'medium',
      status: 'pending_moderation',
      rejection_reason: '',
      rejection_code: null,
      resubmit_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    listings.value.unshift(newListing);

    // Audit Event
    auditEvents.value.unshift({
      id: Date.now(),
      actor: userId,
      actor_username: users.value.find(u => u.id === userId)?.username || 'user',
      event_type: 'LISTING_CREATED',
      object_type: 'ChequeListing',
      object_id: String(newListing.id),
      metadata: { bank: req.bank_name, face_amount: req.face_amount },
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });

    persist();
    return newListing;
  }

  function updateListing(userId: number, id: number, req: UpdateListingRequest): ChequeListing {
    const item = listings.value.find(l => l.id === id);
    if (!item) throw createErrorEnvelope('NOT_FOUND_ERROR', 'آگهی یافت نشد.');
    if (item.owner_id !== userId) throw createErrorEnvelope('PERMISSION_ERROR', 'شما دسترسی ویرایش این آگهی را ندارید.');

    if (req.bank_name) item.bank_name = req.bank_name;
    if (req.cheque_serial_number) item.cheque_serial_number = req.cheque_serial_number;
    if (req.face_amount !== undefined) item.face_amount = String(req.face_amount);
    if (req.due_date) item.due_date = req.due_date;
    if (req.issuer_type) item.issuer_type = req.issuer_type;
    if (req.issuer_name) item.issuer_name = req.issuer_name;
    if (req.issuer_national_id) item.issuer_national_id = req.issuer_national_id;
    if (req.description !== undefined) item.description = req.description;
    if (req.suggested_discount_rate !== undefined) item.suggested_discount_rate = req.suggested_discount_rate;

    item.status = 'pending_moderation';
    item.resubmit_count += 1;
    item.updated_at = new Date().toISOString();

    persist();
    return item;
  }

  // --- Matches Handlers ---
  function getMyMatches(userId: number): Match[] {
    return matches.value.filter(m => m.investor.id === userId || m.check_holder.id === userId);
  }

  function createMatch(userId: number, req: CreateMatchRequest): Match {
    const listing = listings.value.find(l => l.id === req.listing_id);
    if (!listing) throw createErrorEnvelope('NOT_FOUND_ERROR', 'آگهی مورد نظر یافت نشد.');

    const user = users.value.find(u => u.id === userId);
    const holder = users.value.find(u => u.id === listing.owner_id) || { id: listing.owner_id, username: 'holder', name: 'دارنده چک' };

    const newMatch: Match = {
      id: Date.now(),
      listing: {
        id: listing.id,
        bank_name: listing.bank_name,
        face_amount: listing.face_amount,
        due_date: listing.due_date,
        status: listing.status,
        created_at: listing.created_at,
        updated_at: listing.updated_at
      },
      investor: {
        id: userId,
        username: user?.username || 'investor',
        name: user?.name || 'سرمایه‌گذار'
      },
      check_holder: {
        id: holder.id,
        username: holder.username,
        name: holder.name
      },
      status: 'pending',
      settlement_type: req.settlement_type || 'escrow',
      final_discount_rate: listing.suggested_discount_rate,
      terms: 'پیشنهاد اولیه خرید و ابراز تمایل',
      message: req.message || 'ابراز تمایل جهت خرید چک با شرایط آگهی شده.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    matches.value.unshift(newMatch);

    // Notify holder
    notifications.value.unshift({
      id: Date.now(),
      type: 'match_created',
      channel: 'in_app',
      status: 'sent',
      title: 'ابراز تمایل جدید',
      message: `کاربر ${user?.name || 'سرمایه‌گذار'} برای آگهی ${listing.bank_name} ابراز تمایل کرد.`,
      related_object_type: 'match',
      related_object_id: String(newMatch.id),
      read_at: null,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    persist();
    return newMatch;
  }

  function updateMatchStatus(matchId: number, req: UpdateMatchStatusRequest): Match {
    const match = matches.value.find(m => m.id === matchId);
    if (!match) throw createErrorEnvelope('NOT_FOUND_ERROR', 'تطابق یافت نشد.');

    match.status = req.status;
    if (req.final_discount_rate !== undefined) match.final_discount_rate = req.final_discount_rate;
    if (req.terms !== undefined) match.terms = req.terms;
    match.updated_at = new Date().toISOString();

    if (req.status === 'accepted') {
      const listing = listings.value.find(l => l.id === match.listing.id);
      if (listing) listing.status = 'matched';
    }

    persist();
    return match;
  }

  // --- Moderation Handlers ---
  function getModerationQueue(): ModerationQueueItem[] {
    return listings.value.filter(l => l.status === 'pending_moderation');
  }

  function getKycQueue(): Verification[] {
    return verifications.value.filter(v => v.status === 'pending');
  }

  function handleModerationDecision(listingId: number, moderatorId: number, req: ModerationDecisionRequest): ModerationDecisionResponse {
    const listing = listings.value.find(l => l.id === listingId);
    if (!listing) throw createErrorEnvelope('NOT_FOUND_ERROR', 'آگهی در صف وجود ندارد.');

    if (req.decision === 'approve') {
      listing.status = 'published';
      listing.rejection_reason = '';
      listing.rejection_code = null;
    } else {
      listing.status = 'rejected';
      listing.rejection_reason = req.rejection_note || 'آگهی مطابق قوانین و ضوابط نمی‌باشد.';
      listing.rejection_code = req.rejection_code || 'MOD_106';
    }
    listing.updated_at = new Date().toISOString();

    // Create Notification
    notifications.value.unshift({
      id: Date.now(),
      type: req.decision === 'approve' ? 'listing_published' : 'listing_rejected',
      channel: 'in_app',
      status: 'sent',
      title: req.decision === 'approve' ? 'آگهی منتشر شد' : 'آگهی رد شد',
      message: req.decision === 'approve'
        ? `آگهی ${listing.bank_name} به مبلغ ${listing.face_amount} ریال با موفقیت منتشر گردید.`
        : `آگهی ${listing.bank_name} به دلیل «${listing.rejection_reason}» رد شد.`,
      related_object_type: 'listing',
      related_object_id: String(listing.id),
      read_at: null,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    persist();

    return {
      id: Date.now(),
      listing: listingId,
      moderator: moderatorId,
      decision: req.decision === 'approve' ? 'approved' : 'rejected',
      rejection_code: req.rejection_code || null,
      rejection_code_display: req.rejection_code ? req.rejection_code : null,
      rejection_note: req.rejection_note || '',
      created_at: new Date().toISOString()
    };
  }

  function getNotifications(filters?: { type?: string; status?: string; page?: number; page_size?: number }): PaginatedResponse<Notification> {
    let result = [...notifications.value];
    if (filters?.type) {
      result = result.filter(n => n.type === filters.type);
    }
    if (filters?.status) {
      if (filters.status === 'read') {
        result = result.filter(n => !!n.read_at);
      } else if (filters.status === 'sent' || filters.status === 'pending') {
        result = result.filter(n => !n.read_at && n.status === filters.status);
      }
    }

    const page = filters?.page || 1;
    const pageSize = filters?.page_size || 10;
    const start = (page - 1) * pageSize;
    const paged = result.slice(start, start + pageSize);

    return {
      count: result.length,
      next: start + pageSize < result.length ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results: paged
    };
  }

  function markNotificationRead(id: number): Notification {
    const item = notifications.value.find(n => n.id === id);
    if (!item) throw createErrorEnvelope('NOT_FOUND_ERROR', 'اعلامیه یافت نشد.');
    item.read_at = new Date().toISOString();
    item.status = 'read';
    persist();
    return item;
  }

  function markAllNotificationsRead(): void {
    const now = new Date().toISOString();
    notifications.value.forEach(n => {
      n.read_at = now;
      n.status = 'read';
    });
    persist();
  }

  function updateNotificationPreferences(prefs: Partial<NotificationPreferences>): NotificationPreferences {
    Object.assign(notificationPrefs.value, prefs);
    persist();
    return notificationPrefs.value;
  }

  function handleKycDecision(verificationId: number, status: 'approved' | 'rejected', reason?: string, code?: string) {
    const v = verifications.value.find(x => x.id === verificationId);
    if (!v) throw createErrorEnvelope('NOT_FOUND_ERROR', 'درخواست احراز یافت نشد.');
    v.status = status;
    v.rejection_reason = reason || '';
    if (code) v.rejection_code = code;
    persist();
    return v;
  }

  // --- Admin Stats ---
  function getAdminStats(): AdminDashboardStats {
    return {
      listings: {
        total: listings.value.length,
        published: listings.value.filter(l => l.status === 'published').length,
        pending_moderation: listings.value.filter(l => l.status === 'pending_moderation').length,
        rejected: listings.value.filter(l => l.status === 'rejected').length,
        expired: listings.value.filter(l => l.status === 'expired').length,
        matched: listings.value.filter(l => l.status === 'matched').length
      },
      users: {
        total: users.value.length,
        kyc_pending: verifications.value.filter(v => v.status === 'pending').length,
        kyc_approved: verifications.value.filter(v => v.status === 'approved').length
      },
      verifications: {
        pending: verifications.value.filter(v => v.status === 'pending').length
      },
      notifications: {
        unread: notifications.value.filter(n => !n.read_at).length
      }
    };
  }

  function resubmitListing(listingId: number): ChequeListing {
    const listing = listings.value.find(l => l.id === listingId);
    if (!listing) throw createErrorEnvelope('NOT_FOUND_ERROR', 'آگهی مورد نظر یافت نشد.');

    if (listing.resubmit_count >= 3) {
      throw createErrorEnvelope('MOD_306', 'حد مجاز ارسال مجدد (حداکثر ۳ بار) برای این آگهی تکمیل شده است.');
    }

    listing.resubmit_count += 1;
    listing.status = 'pending_moderation';
    listing.rejection_reason = '';
    listing.rejection_code = null;
    listing.updated_at = new Date().toISOString();

    persist();
    return listing;
  }

  function uploadDocument(listingId: number, documentType: string, fileName: string): any {
    const listing = listings.value.find(l => l.id === listingId);
    if (!listing) throw createErrorEnvelope('NOT_FOUND_ERROR', 'آگهی مورد نظر یافت نشد.');

    if (!listing.documents) listing.documents = [];

    const newDoc = {
      id: Date.now(),
      document_type: documentType,
      file_name: fileName || 'document.pdf',
      created_at: new Date().toISOString()
    };

    listing.documents.push(newDoc);
    persist();
    return newDoc;
  }

  function toggleFeatureFlag(key: string) {
    const flag = featureFlags.value.find(f => f.key === key);
    if (flag) {
      flag.is_enabled = !flag.is_enabled;
      persist();
    }
  }

  function getAuditEvents(filters?: { page?: number; page_size?: number }): PaginatedResponse<AuditEvent> {
    const page = filters?.page || 1;
    const pageSize = filters?.page_size || 10;
    const start = (page - 1) * pageSize;
    const paged = auditEvents.value.slice(start, start + pageSize);

    return {
      count: auditEvents.value.length,
      next: start + pageSize < auditEvents.value.length ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results: paged
    };
  }

  return {
    users,
    profiles,
    listings,
    matches,
    notifications,
    verifications,
    featureFlags,
    auditEvents,
    notificationPrefs,
    resetToSeed,
    handleLogin,
    handleRegister,
    getMarketplaceListings,
    getMyListings,
    getListingById,
    createListing,
    updateListing,
    resubmitListing,
    uploadDocument,
    getMyMatches,
    createMatch,
    updateMatchStatus,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    updateNotificationPreferences,
    getModerationQueue,
    getKycQueue,
    handleModerationDecision,
    handleKycDecision,
    getAdminStats,
    toggleFeatureFlag,
    getAuditEvents
  };
});
