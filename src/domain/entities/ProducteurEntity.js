/**
 * Producteur Entity - Agricultural Producer
 * Représente un producteur agricole dans le domaine métier
 */

import { BaseEntity } from './BaseEntity.js';
import { ValidationError } from '@shared/errors/DomainErrors.js';

export class ProducteurEntity extends BaseEntity {
  constructor({
    id,
    nom,
    prenoms,
    dateNaissance,
    lieuNaissance,
    sexe,
    nationalite,
    niveauScolaire,
    numeroTelephone,
    village,
    souspref,
    departement,
    region,
    pays,
    typeProducteur,
    superficieTotale = 0,
    nombreParcelles = 0,
    principalesCultures = [],
    anneesExperience = 0,
    typeExploitation,
    materielAgricole = [],
    certifications = [],
    cooperatives = [],
    formationsRecues = [],
    accesBanque = false,
    revenus = null,
    photoProfil = null,
    pieceIdentite = null,
    statusVerification = 'en_attente',
    notes = '',
    gpsCoordinates = null,
    createdBy,
    createdAt,
    updatedAt
  }) {
    super(id);
    
    this._nom = nom;
    this._prenoms = prenoms;
    this._dateNaissance = dateNaissance ? new Date(dateNaissance) : null;
    this._lieuNaissance = lieuNaissance;
    this._sexe = sexe;
    this._nationalite = nationalite;
    this._niveauScolaire = niveauScolaire;
    this._numeroTelephone = numeroTelephone;
    this._village = village;
    this._souspref = souspref;
    this._departement = departement;
    this._region = region;
    this._pays = pays;
    this._typeProducteur = typeProducteur;
    this._superficieTotale = superficieTotale;
    this._nombreParcelles = nombreParcelles;
    this._principalesCultures = principalesCultures || [];
    this._anneesExperience = anneesExperience;
    this._typeExploitation = typeExploitation;
    this._materielAgricole = materielAgricole || [];
    this._certifications = certifications || [];
    this._cooperatives = cooperatives || [];
    this._formationsRecues = formationsRecues || [];
    this._accesBanque = accesBanque;
    this._revenus = revenus;
    this._photoProfil = photoProfil;
    this._pieceIdentite = pieceIdentite;
    this._statusVerification = statusVerification;
    this._notes = notes;
    this._gpsCoordinates = gpsCoordinates;
    this._createdBy = createdBy;
    
    if (createdAt) this._createdAt = new Date(createdAt);
    if (updatedAt) this._updatedAt = new Date(updatedAt);
    
    this.validate();
  }

  // Types de producteur
  static get PRODUCTEUR_TYPES() {
    return {
      PETIT: 'petit',
      MOYEN: 'moyen',
      GRAND: 'grand',
      COOPERATIF: 'cooperatif'
    };
  }

  // Types d'exploitation
  static get EXPLOITATION_TYPES() {
    return {
      FAMILIALE: 'familiale',
      COMMERCIALE: 'commerciale',
      MIXTE: 'mixte',
      BIOLOGIQUE: 'biologique'
    };
  }

  // Status de vérification
  static get VERIFICATION_STATUS() {
    return {
      EN_ATTENTE: 'en_attente',
      VERIFIE: 'verifie',
      REJETE: 'rejete',
      INCOMPLET: 'incomplet'
    };
  }

  // Getters
  get nom() { return this._nom; }
  get prenoms() { return this._prenoms; }
  get nomComplet() { return `${this._prenoms} ${this._nom}`; }
  get dateNaissance() { return this._dateNaissance; }
  get lieuNaissance() { return this._lieuNaissance; }
  get sexe() { return this._sexe; }
  get nationalite() { return this._nationalite; }
  get niveauScolaire() { return this._niveauScolaire; }
  get numeroTelephone() { return this._numeroTelephone; }
  get village() { return this._village; }
  get souspref() { return this._souspref; }
  get departement() { return this._departement; }
  get region() { return this._region; }
  get pays() { return this._pays; }
  get typeProducteur() { return this._typeProducteur; }
  get superficieTotale() { return this._superficieTotale; }
  get nombreParcelles() { return this._nombreParcelles; }
  get principalesCultures() { return [...this._principalesCultures]; }
  get anneesExperience() { return this._anneesExperience; }
  get typeExploitation() { return this._typeExploitation; }
  get materielAgricole() { return [...this._materielAgricole]; }
  get certifications() { return [...this._certifications]; }
  get cooperatives() { return [...this._cooperatives]; }
  get formationsRecues() { return [...this._formationsRecues]; }
  get accesBanque() { return this._accesBanque; }
  get revenus() { return this._revenus; }
  get photoProfil() { return this._photoProfil; }
  get pieceIdentite() { return this._pieceIdentite; }
  get statusVerification() { return this._statusVerification; }
  get notes() { return this._notes; }
  get gpsCoordinates() { return this._gpsCoordinates; }
  get createdBy() { return this._createdBy; }

  // Propriétés calculées
  get age() {
    if (!this._dateNaissance) return null;
    const today = new Date();
    const birth = new Date(this._dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  get adresseComplete() {
    const parts = [this._village, this._souspref, this._departement, this._region, this._pays];
    return parts.filter(part => part && part.trim()).join(', ');
  }

  get isVerified() {
    return this._statusVerification === ProducteurEntity.VERIFICATION_STATUS.VERIFIE;
  }

  get isPending() {
    return this._statusVerification === ProducteurEntity.VERIFICATION_STATUS.EN_ATTENTE;
  }

  get isRejected() {
    return this._statusVerification === ProducteurEntity.VERIFICATION_STATUS.REJETE;
  }

  get isIncomplete() {
    return this._statusVerification === ProducteurEntity.VERIFICATION_STATUS.INCOMPLET;
  }

  get hasDocuments() {
    return !!(this._photoProfil && this._pieceIdentite);
  }

  get experienceLevel() {
    if (this._anneesExperience < 2) return 'Débutant';
    if (this._anneesExperience < 5) return 'Intermédiaire';
    if (this._anneesExperience < 10) return 'Expérimenté';
    return 'Expert';
  }

  get productionScale() {
    if (this._superficieTotale < 1) return 'Micro';
    if (this._superficieTotale < 5) return 'Petite';
    if (this._superficieTotale < 20) return 'Moyenne';
    return 'Grande';
  }

  // Méthodes métier
  updatePersonalInfo(nom, prenoms, dateNaissance, sexe, nationalite) {
    if (!nom || nom.trim().length === 0) {
      throw new ValidationError('Le nom est requis');
    }
    if (!prenoms || prenoms.trim().length === 0) {
      throw new ValidationError('Les prénoms sont requis');
    }

    this._nom = nom.trim();
    this._prenoms = prenoms.trim();
    this._dateNaissance = dateNaissance ? new Date(dateNaissance) : null;
    this._sexe = sexe;
    this._nationalite = nationalite;
    this.updateTimestamp();
  }

  updateContactInfo(numeroTelephone, village, souspref, departement, region, pays) {
    this._numeroTelephone = numeroTelephone;
    this._village = village;
    this._souspref = souspref;
    this._departement = departement;
    this._region = region;
    this._pays = pays;
    this.updateTimestamp();
  }

  updateAgricultureInfo(data) {
    const {
      typeProducteur,
      superficieTotale,
      nombreParcelles,
      principalesCultures,
      anneesExperience,
      typeExploitation
    } = data;

    if (superficieTotale < 0) {
      throw new ValidationError('La superficie totale ne peut pas être négative');
    }
    if (nombreParcelles < 0) {
      throw new ValidationError('Le nombre de parcelles ne peut pas être négatif');
    }
    if (anneesExperience < 0) {
      throw new ValidationError('Les années d\'expérience ne peuvent pas être négatives');
    }

    this._typeProducteur = typeProducteur;
    this._superficieTotale = superficieTotale;
    this._nombreParcelles = nombreParcelles;
    this._principalesCultures = principalesCultures || [];
    this._anneesExperience = anneesExperience;
    this._typeExploitation = typeExploitation;
    this.updateTimestamp();
  }

  addCulture(culture) {
    if (!culture || culture.trim().length === 0) {
      throw new ValidationError('Le nom de la culture est requis');
    }
    if (!this._principalesCultures.includes(culture)) {
      this._principalesCultures.push(culture);
      this.updateTimestamp();
    }
  }

  removeCulture(culture) {
    const index = this._principalesCultures.indexOf(culture);
    if (index > -1) {
      this._principalesCultures.splice(index, 1);
      this.updateTimestamp();
    }
  }

  addMateriel(materiel) {
    if (!materiel || materiel.trim().length === 0) {
      throw new ValidationError('Le nom du matériel est requis');
    }
    if (!this._materielAgricole.includes(materiel)) {
      this._materielAgricole.push(materiel);
      this.updateTimestamp();
    }
  }

  addCertification(certification) {
    if (!certification || !certification.nom) {
      throw new ValidationError('Les informations de certification sont requises');
    }
    this._certifications.push({
      ...certification,
      dateObtention: certification.dateObtention ? new Date(certification.dateObtention) : null
    });
    this.updateTimestamp();
  }

  addCooperative(cooperative) {
    if (!cooperative || !cooperative.nom) {
      throw new ValidationError('Les informations de la coopérative sont requises');
    }
    this._cooperatives.push({
      ...cooperative,
      dateAdhesion: cooperative.dateAdhesion ? new Date(cooperative.dateAdhesion) : null
    });
    this.updateTimestamp();
  }

  addFormation(formation) {
    if (!formation || !formation.nom) {
      throw new ValidationError('Les informations de formation sont requises');
    }
    this._formationsRecues.push({
      ...formation,
      dateSuivie: formation.dateSuivie ? new Date(formation.dateSuivie) : null
    });
    this.updateTimestamp();
  }

  attachPhoto(photoData) {
    if (!photoData || !photoData.filename) {
      throw new ValidationError('Les données de la photo sont requises');
    }
    this._photoProfil = {
      ...photoData,
      uploadDate: new Date()
    };
    this.updateTimestamp();
  }

  attachPieceIdentite(pieceData) {
    if (!pieceData || !pieceData.filename) {
      throw new ValidationError('Les données de la pièce d\'identité sont requises');
    }
    this._pieceIdentite = {
      ...pieceData,
      uploadDate: new Date()
    };
    this.updateTimestamp();
  }

  verify() {
    if (!this.hasDocuments) {
      throw new ValidationError('Les documents sont requis pour la vérification');
    }
    this._statusVerification = ProducteurEntity.VERIFICATION_STATUS.VERIFIE;
    this.updateTimestamp();
  }

  reject(reason = '') {
    this._statusVerification = ProducteurEntity.VERIFICATION_STATUS.REJETE;
    this._notes = reason;
    this.updateTimestamp();
  }

  markAsIncomplete(reason = '') {
    this._statusVerification = ProducteurEntity.VERIFICATION_STATUS.INCOMPLET;
    this._notes = reason;
    this.updateTimestamp();
  }

  setGpsCoordinates(latitude, longitude) {
    if (latitude < -90 || latitude > 90) {
      throw new ValidationError('Latitude invalide');
    }
    if (longitude < -180 || longitude > 180) {
      throw new ValidationError('Longitude invalide');
    }
    this._gpsCoordinates = { latitude, longitude };
    this.updateTimestamp();
  }

  // Validation
  validate() {
    super.validate();

    if (!this._nom || this._nom.trim().length === 0) {
      throw new ValidationError('Le nom est requis');
    }

    if (!this._prenoms || this._prenoms.trim().length === 0) {
      throw new ValidationError('Les prénoms sont requis');
    }

    if (this._dateNaissance && this._dateNaissance > new Date()) {
      throw new ValidationError('La date de naissance ne peut pas être dans le futur');
    }

    if (this._superficieTotale < 0) {
      throw new ValidationError('La superficie totale ne peut pas être négative');
    }

    if (this._nombreParcelles < 0) {
      throw new ValidationError('Le nombre de parcelles ne peut pas être négatif');
    }

    if (this._anneesExperience < 0) {
      throw new ValidationError('Les années d\'expérience ne peuvent pas être négatives');
    }

    if (this._typeProducteur && !Object.values(ProducteurEntity.PRODUCTEUR_TYPES).includes(this._typeProducteur)) {
      throw new ValidationError('Type de producteur invalide');
    }

    if (this._typeExploitation && !Object.values(ProducteurEntity.EXPLOITATION_TYPES).includes(this._typeExploitation)) {
      throw new ValidationError('Type d\'exploitation invalide');
    }

    if (!Object.values(ProducteurEntity.VERIFICATION_STATUS).includes(this._statusVerification)) {
      throw new ValidationError('Status de vérification invalide');
    }
  }

  // Sérialisation
  toPlainObject() {
    return {
      ...super.toPlainObject(),
      nom: this._nom,
      prenoms: this._prenoms,
      nomComplet: this.nomComplet,
      dateNaissance: this._dateNaissance,
      lieuNaissance: this._lieuNaissance,
      sexe: this._sexe,
      nationalite: this._nationalite,
      niveauScolaire: this._niveauScolaire,
      numeroTelephone: this._numeroTelephone,
      village: this._village,
      souspref: this._souspref,
      departement: this._departement,
      region: this._region,
      pays: this._pays,
      typeProducteur: this._typeProducteur,
      superficieTotale: this._superficieTotale,
      nombreParcelles: this._nombreParcelles,
      principalesCultures: this._principalesCultures,
      anneesExperience: this._anneesExperience,
      typeExploitation: this._typeExploitation,
      materielAgricole: this._materielAgricole,
      certifications: this._certifications,
      cooperatives: this._cooperatives,
      formationsRecues: this._formationsRecues,
      accesBanque: this._accesBanque,
      revenus: this._revenus,
      photoProfil: this._photoProfil,
      pieceIdentite: this._pieceIdentite,
      statusVerification: this._statusVerification,
      notes: this._notes,
      gpsCoordinates: this._gpsCoordinates,
      createdBy: this._createdBy,
      // Propriétés calculées
      age: this.age,
      adresseComplete: this.adresseComplete,
      isVerified: this.isVerified,
      isPending: this.isPending,
      isRejected: this.isRejected,
      isIncomplete: this.isIncomplete,
      hasDocuments: this.hasDocuments,
      experienceLevel: this.experienceLevel,
      productionScale: this.productionScale
    };
  }

  // Factory method
  static fromApiData(data) {
    return new ProducteurEntity({
      id: data.id || data._id,
      nom: data.nom,
      prenoms: data.prenoms,
      dateNaissance: data.dateNaissance,
      lieuNaissance: data.lieuNaissance,
      sexe: data.sexe,
      nationalite: data.nationalite,
      niveauScolaire: data.niveauScolaire,
      numeroTelephone: data.numeroTelephone,
      village: data.village,
      souspref: data.souspref,
      departement: data.departement,
      region: data.region,
      pays: data.pays,
      typeProducteur: data.typeProducteur,
      superficieTotale: data.superficieTotale,
      nombreParcelles: data.nombreParcelles,
      principalesCultures: data.principalesCultures,
      anneesExperience: data.anneesExperience,
      typeExploitation: data.typeExploitation,
      materielAgricole: data.materielAgricole,
      certifications: data.certifications,
      cooperatives: data.cooperatives,
      formationsRecues: data.formationsRecues,
      accesBanque: data.accesBanque,
      revenus: data.revenus,
      photoProfil: data.photoProfil,
      pieceIdentite: data.pieceIdentite,
      statusVerification: data.statusVerification,
      notes: data.notes,
      gpsCoordinates: data.gpsCoordinates,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}