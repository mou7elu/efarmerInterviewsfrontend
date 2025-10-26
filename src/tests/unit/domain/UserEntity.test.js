import { describe, it, expect, beforeEach } from 'vitest';
import { UserEntity } from '../../../domain/entities/UserEntity';
import { Email } from '../../../domain/value-objects/Email';

describe('UserEntity', () => {
  let userData;

  beforeEach(() => {
    userData = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'interviewer',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
    };
  });

  describe('constructor', () => {
    it('should create a valid user entity', () => {
      const user = new UserEntity(userData);

      expect(user.getId()).toBe('1');
      expect(user.getUsername()).toBe('testuser');
      expect(user.getEmail().getValue()).toBe('test@example.com');
      expect(user.getRole()).toBe('interviewer');
      expect(user.getFirstName()).toBe('John');
      expect(user.getLastName()).toBe('Doe');
      expect(user.isActive()).toBe(true);
    });

    it('should throw error for invalid email', () => {
      const invalidData = { ...userData, email: 'invalid-email' };

      expect(() => new UserEntity(invalidData)).toThrow();
    });

    it('should throw error for missing required fields', () => {
      expect(() => new UserEntity({})).toThrow('Username is required');
      expect(() => new UserEntity({ username: 'test' })).toThrow('Email is required');
    });
  });

  describe('getFullName', () => {
    it('should return full name when both first and last names are provided', () => {
      const user = new UserEntity(userData);
      expect(user.getFullName()).toBe('John Doe');
    });

    it('should return only first name when last name is missing', () => {
      const dataWithoutLastName = { ...userData, lastName: undefined };
      const user = new UserEntity(dataWithoutLastName);
      expect(user.getFullName()).toBe('John');
    });

    it('should return username when both names are missing', () => {
      const dataWithoutNames = { 
        ...userData, 
        firstName: undefined, 
        lastName: undefined 
      };
      const user = new UserEntity(dataWithoutNames);
      expect(user.getFullName()).toBe('testuser');
    });
  });

  describe('canManageUsers', () => {
    it('should return true for admin role', () => {
      const adminData = { ...userData, role: 'admin' };
      const user = new UserEntity(adminData);
      expect(user.canManageUsers()).toBe(true);
    });

    it('should return true for manager role', () => {
      const managerData = { ...userData, role: 'manager' };
      const user = new UserEntity(managerData);
      expect(user.canManageUsers()).toBe(true);
    });

    it('should return false for interviewer role', () => {
      const user = new UserEntity(userData);
      expect(user.canManageUsers()).toBe(false);
    });

    it('should return false for viewer role', () => {
      const viewerData = { ...userData, role: 'viewer' };
      const user = new UserEntity(viewerData);
      expect(user.canManageUsers()).toBe(false);
    });
  });

  describe('validation', () => {
    it('should validate successfully for valid data', () => {
      const user = new UserEntity(userData);
      const validation = user.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual({});
    });

    it('should return validation errors for invalid data', () => {
      const invalidUser = new UserEntity({
        id: '1',
        username: 'a', // Too short
        email: 'test@example.com',
        role: 'interviewer',
      });

      const validation = invalidUser.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors.username).toBeDefined();
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object representation', () => {
      const user = new UserEntity(userData);
      const plainObject = user.toPlainObject();

      expect(plainObject).toEqual({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'interviewer',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});