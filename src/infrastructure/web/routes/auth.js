const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();

// Utiliser le modèle User principal
const User = require('../../../../models/User');

/**
 * POST /api/auth/login
 * Authentification de l'utilisateur
 */
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Tentative de connexion:', req.body);
    
    const { email, password } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Email et mot de passe requis'
      });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_ERROR',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_ERROR',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérification que l'utilisateur est actif
    if (user.Sommeil) {
      console.log('❌ Utilisateur inactif:', email);
      return res.status(401).json({
        success: false,
        error: 'ACCOUNT_INACTIVE',
        message: 'Compte utilisateur désactivé'
      });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        id: user._id,
        email: user.email,
        role: user.isGodMode ? 'admin' : 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    console.log('✅ Connexion réussie pour:', email);

    // Utiliser toDTO pour la réponse
    const userDTO = user.toDTO();

    // Réponse réussie
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: userDTO
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * POST /api/auth/register
 * Enregistrement d'un nouvel utilisateur
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, Nom_ut, Pren_ut, Tel, Genre, profileId, isGodMode, ResponsableId } = req.body;

    // Validation des données
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'USER_EXISTS',
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Générer un code_ut unique (4 caractères alphanumériques)
    const generateCodeUt = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let code_ut = generateCodeUt();
    // Vérifier l'unicité du code
    while (await User.findOne({ code_ut })) {
      code_ut = generateCodeUt();
    }

    // Création de l'utilisateur
    const user = await User.create({
      email,
      code_ut,
      password,
      Nom_ut: Nom_ut || '',
      Pren_ut: Pren_ut || '',
      Tel: Tel || '',
      Genre: Genre || 0,
      profileId: profileId || null,
      isGodMode: isGodMode || false,
      ResponsableId: ResponsableId || null
    });

    console.log('✅ Nouvel utilisateur créé:', email, '- Code:', code_ut);

    const userDTO = user.toDTO();

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: userDTO
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * GET /api/auth/me
 * Récupération des informations de l'utilisateur connecté
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'NO_TOKEN',
        message: 'Token d\'authentification requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId || decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé'
      });
    }

    const userDTO = user.toDTO();

    res.json({
      success: true,
      data: {
        user: userDTO
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Token invalide'
    });
  }
});

module.exports = router;