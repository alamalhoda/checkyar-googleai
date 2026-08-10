import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBackendSimulatorStore } from '../../stores/useBackendSimulatorStore';

describe('UserType and KYC Validation Rules', () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    const mockLocalStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => { storage[key] = value; },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => { storage = {}; },
    };
    globalThis.localStorage = mockLocalStorage as any;
    setActivePinia(createPinia());
  });

  describe('Registration user_type rules', () => {
    it('allows natural user registration with optional name', async () => {
      const store = useBackendSimulatorStore();
      const res = await store.handleRegister({
        username: 'natural_test',
        user_type: 'natural',
        password: 'password123',
        password_confirm: 'password123',
        role: 'check_holder'
      });

      expect(res.user.user_type).toBe('natural');
      expect(res.user.username).toBe('natural_test');
    });

    it('requires name for legal user registration', async () => {
      const store = useBackendSimulatorStore();

      await expect(store.handleRegister({
        username: 'legal_test',
        user_type: 'legal',
        name: '',
        password: 'password123',
        password_confirm: 'password123',
        role: 'investor'
      })).rejects.toMatchObject({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'نام رسمی شرکت برای شخص حقوقی الزامی است.'
        }
      });
    });

    it('succeeds for legal user registration when company name is provided', async () => {
      const store = useBackendSimulatorStore();
      const res = await store.handleRegister({
        username: 'legal_test',
        user_type: 'legal',
        name: 'شرکت آریا صنعت',
        password: 'password123',
        password_confirm: 'password123',
        role: 'investor'
      });

      expect(res.user.user_type).toBe('legal');
      expect(res.user.name).toBe('شرکت آریا صنعت');
    });
  });

  describe('KYC Verification conditional rules', () => {
    it('enforces 10-digit national_id and empty company_name for natural user', async () => {
      const store = useBackendSimulatorStore();
      storage['chequeyar_auth_user'] = JSON.stringify({ id: 1, user_type: 'natural' });

      // Valid natural KYC
      const validVer = store.createVerification({
        full_name: 'رضا صبوری',
        national_id: '0012345678'
      });
      expect(validVer.national_id).toBe('0012345678');
      expect(validVer.user_type).toBe('natural');
      expect(validVer.status).toBe('pending');

      // Invalid national_id length
      expect(() => store.createVerification({
        full_name: 'رضا صبوری',
        national_id: '123'
      })).toThrowError();

      // Invalid company_name sent for natural user
      expect(() => store.createVerification({
        full_name: 'رضا صبوری',
        national_id: '0012345678',
        company_name: 'شرکت ناخواسته'
      })).toThrowError();
    });

    it('enforces 11-digit national_id, company_name, and representative full_name for legal user', async () => {
      const store = useBackendSimulatorStore();
      storage['chequeyar_auth_user'] = JSON.stringify({ id: 2, user_type: 'legal' });

      // Valid legal KYC
      const validVer = store.createVerification({
        full_name: 'علی نماینده',
        company_name: 'شرکت توسعه تجارت نوین',
        national_id: '10100012345'
      });
      expect(validVer.national_id).toBe('10100012345');
      expect(validVer.company_name).toBe('شرکت توسعه تجارت نوین');
      expect(validVer.user_type).toBe('legal');

      // Missing company name
      expect(() => store.createVerification({
        full_name: 'علی نماینده',
        company_name: '',
        national_id: '10100012345'
      })).toThrowError();

      // Incorrect national_id length (10 digits instead of 11)
      expect(() => store.createVerification({
        full_name: 'علی نماینده',
        company_name: 'شرکت توسعه تجارت نوین',
        national_id: '0012345678'
      })).toThrowError();
    });
  });

  describe('KYC Moderation Queue user_type tests', () => {
    it('returns at least 1 natural pending and at least 1 legal pending verification in getKycQueue', () => {
      const store = useBackendSimulatorStore();
      const queue = store.getKycQueue();

      const naturalPending = queue.filter(v => (v.user_type === 'natural' || (!v.company_name && v.national_id.length === 10)));
      const legalPending = queue.filter(v => (v.user_type === 'legal' || (v.company_name !== '' && v.national_id.length === 11)));

      expect(naturalPending.length).toBeGreaterThanOrEqual(1);
      expect(legalPending.length).toBeGreaterThanOrEqual(1);

      const nItem = naturalPending[0];
      expect(nItem.national_id).toMatch(/^\d{10}$/);
      expect(nItem.company_name).toBe('');
      expect(nItem.status).toBe('pending');

      const lItem = legalPending[0];
      expect(lItem.national_id).toMatch(/^\d{11}$/);
      expect(lItem.company_name).not.toBe('');
      expect(lItem.status).toBe('pending');
    });
  });
});
