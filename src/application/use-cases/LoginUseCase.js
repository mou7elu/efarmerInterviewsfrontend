/**
 * Login Use Case
 * Cas d'usage pour l'authentification des utilisateurs
 */

import { BaseUseCase } from './BaseUseCase.js';
import { ValidationError, AuthenticationError } from '@shared/errors/DomainErrors.js';
import { Email } from '@domain/value-objects/Email.js';

export class LoginUseCase extends BaseUseCase {
  constructor(authRepository, tokenService, storageService) {
    super();
    this.authRepository = authRepository;
    this.tokenService = tokenService;
    this.storageService = storageService;
  }

  async execute(input) {
    try {
      this.validateInput(input);
      
      const { email, password, rememberMe = false } = input;

      // Valider l'email avec le Value Object
      const emailVO = new Email(email);

      // Tentative d'authentification
      const authResult = await this.authRepository.authenticate(emailVO.value, password);
      
      if (!authResult.success) {
        throw new AuthenticationError('Email ou mot de passe incorrect');
      }

      const { user, token, refreshToken } = authResult;

      // Stocker les tokens
      await this.storageService.setToken(token);
      if (refreshToken) {
        await this.storageService.setRefreshToken(refreshToken);
      }

      // Stocker les préférences de connexion
      if (rememberMe) {
        await this.storageService.setRememberMe(true);
      }

      // Logger la connexion réussie
      this.log('info', 'Connexion réussie', { 
        userId: user.id, 
        email: emailVO.value,
        rememberMe 
      });

      return {
        user,
        token,
        refreshToken,
        message: 'Connexion réussie'
      };

    } catch (error) {
      this.handleError(error, { 
        input: this.sanitizeForLogging(input) 
      });
    }
  }

  validateInput(input) {
    if (!input) {
      throw new ValidationError('Les données de connexion sont requises');
    }

    const { email, password } = input;

    if (!email || email.trim().length === 0) {
      throw new ValidationError('L\'email est requis', 'email');
    }

    if (!password || password.trim().length === 0) {
      throw new ValidationError('Le mot de passe est requis', 'password');
    }

    return true;
  }
}