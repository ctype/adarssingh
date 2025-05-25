// ADMIN CONTROLLED CATEGORY ENTITY TYPES
interface CategoriesBaseType {
  // id: number;
  name: string;
  status: boolean;
  description?: string;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

interface PresetType extends CategoriesBaseType {
  id: number;
}

interface PhotoVideoCategory extends CategoriesBaseType {
  id: number;
}

interface Genre extends CategoriesBaseType {
  id: number;
  genreArtwork: string;
}

interface GenreMix extends CategoriesBaseType {
  id: number;
}

interface SubGenre extends CategoriesBaseType {
  id: number;
  genreId: Genre | number;
}

interface MoodType extends CategoriesBaseType {
  id: number;
}

interface Language extends CategoriesBaseType {
  id: number;
}

interface Key extends CategoriesBaseType {
  id: number;
}

interface Instrument extends CategoriesBaseType {
  id: number;
}

interface SocialAccountType {
  id: number;
  socialAccountTypeName: string;
  svgIndex: number;
}

interface Offer {
  id: number;
  name: string;
  type: string;
  timePeriod: Date | null;
  creditAmount: number | null;
  couponCode: string | null;
  usabilityPerUser: number | null;
  discountAmount: number | null;
  discountType: string | null;
  subscriptionPackages: number[] | UserPackage[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface LicenseTemplate {
  id: number;
  type: string;
  licenseTemplateName: string;
  licenseTemplateText: string;
  licenseTemplateShortDescription: string;
  licenseTemplateDefaultPrice: number | null;
  licenseTemplateMinOfferPrice: number | null;
  audioLicenseDuration: number | null;
  audioLicenseDistribution: string;
  audioLicenseStreams: string;
  audioLicenseFreeDownloads: string;
  musicVideoMonitizedAmount: string;
  musicVideoNonMonitizedAmount: string;
  musicVideoMonitizedStreamAmount: string;
  musicVideoNonMonitizedStreamAmount: string;
  radioBroadcastRights: boolean | null;
  radioStationsAmount: string;
  livePerformanceProfitRights: boolean | null;
  livePerformanceNonProfitAmount: string;
  __typename?: string;
}

type LicenseTemplateCreateUpdateFields = Omit<LicenseTemplate, "id">;

// TODO: NOT FIXED ENTITIES
interface SoundBankCategory {
  id: number;
  soundBankCategoryName: string;
}

interface SoundEffectCategory {
  id: number;
  soundEffectCategoryName: string;
}

interface UserTrackCardProps {
  id?: number;
  imageUrl?: string;
  bg?: string;
  edit?: boolean;
  cardShadow?: string;
  isPaid: boolean;
}

// CONTRIBUTOR HANDLED ENTITIES
interface Photo {
  id: number;
  photoFile: string | Blob;
  photoTitle: string;
  photoVideoCategory: number | PhotoVideoCategory;
  upVoteCount: number;
}

interface Video {
  id: number;
  videoFile: string;
  videoTitle: string;
  photoVideoCategory: number | PhotoVideoCategory;
  upVoteCount: number;
}

interface Preference {
  id: number;
  name: string;
  value: string;
}

interface BaseAudio {
  id: number;
  title: string;
  description: string | null;
  trackStreamFile: string;
  artworkFile: string | File;

  visibility: number;
  isDraft: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  upVoteCount: number;

  uploadedBy: User;
  collaborators?: Collaborator[];
  exclusiveOneTimeBuyPrices?: string[];
  fileIds?: TrackFiles[] | number[];
  licenses?: License[];

  __typename?: string;
}

interface Track extends BaseAudio {
  wavFile: string;
  mp3File: string;
  audioBpm: number | null;
  duration: number;
  hasExplicitContent: boolean;
  audioRecordLabel: string | null;
  audioPublisher: string | null;
  audioIsrc: string;
  audioUpc: string;
  audioForSale: boolean;
  audioIsAiGenerated: boolean;
  audioIsYoutube: boolean;
  uploadedByRightHolder: boolean;
  genre: Genre | number;
  subGenre: number | SubGenre | null;
  audioKey: number | Key;
  language: number | Language;
  moodType: number | MoodType;
  instrumentId: number | Instrument;
  releaseDate: Date | null;
  tags: string[];
  status: number;
}

type TrackCreateUpdateFields = Omit<Track, "id" | "uploadedBy" | "createdAt" | "updatedAt">;

interface Preset extends BaseAudio {
  mp3Files: string[];
  status: number;
  genreMix: GenreMix | number;
  presetType: number | PresetCategory;
  tags: string[];
  numberOfFiles: number;
}

type PresetCreateUpdateFields = Omit<Preset, "id" | "uploadedBy" | "createdAt" | "updatedAt">;

interface SoundBank extends BaseAudio {
  mp3Files: string[];
  status: number;
  genreMix: GenreMix | number;
  numberOfFiles: number;
  // soundKit: SoundKit | number;
  // soundBankCategory: SoundBankCategory | number;
  // soundBankInstrument: SoundBankInstrument | number;
  tags: string[];
}

type SoundBankCreateUpdateFields = Omit<SoundBank, "id" | "uploadedBy" | "createdAt" | "updatedAt">;

interface SoundEffect {
  id: number;
  size: number;
  soundEffectTitle: string;
  soundEffectMp3File: File | string;
  soundEffectArtworkFile: File | string;
  genreMix: GenreMix | number;
  soundEffectLabel?: string;
  uploadedBy: User;
  activeStatus: boolean;
  approveStatus: number;
}

type SoundEffectCreateUpdateFields = Omit<SoundEffect, "id" | "uploadedBy" | "activeStatus" | "approveStatus" | "size">;

interface UserSocialAccount {
  id: number;
  socialAccountLink: string;
  userId: number;
  socialAccountType: number | SocialAccountType;
}

// SYSTEM CONTROLLED ENTITIES
interface BaseUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: "admin" | "user" | "contributor";
  // remaining fields
  biography?: string;
  profilePath?: File | string;
  ipi?: number;
  mobileNumber?: number;
  systemUserProId: number;
  userProPackage: UserPackage | null;
  activeStatus: boolean;
  deactiveStatus: boolean;
  followersCount: number;
  followingCount: number;
  likes: Like[];
  __typename?: string;
}

interface ExtraContributorFields {
  country: string;
  professionalEmail?: string;
  biography?: string;
  artistStageName?: string;
  contentType?: string;
  genreType?: string;
  experienceLevel?: string;
  portfolioLink?: string;
  agreeToTerms?: boolean;
}

interface Admin extends BaseUser {
  role: "admin";
}

interface Contributor extends BaseUser, ExtraContributorFields {
  role: "contributor";
}

interface User extends BaseUser, ExtraContributorFields {
  role: "user";
}

interface Like {
  id: number;
  user: User;
  entityId: number;
  entityName: string;
}

interface CommentEntity {
  id: number;
  user: User;
  createdAt?: Date;
  content: string;
  repliesCount: number;
  upVoteCount: number;
  entityId: number | null;
  entityName: string;
  parentId: number | null;
  replies: CommentEntity[];
}

interface NotificationEntity {
  id: number;
  title: string;
  summary: string;
  userId: User | null;
  type: number;
  notificationImageUrl: string;
  redirectLink: string;
  hasBeenRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface UserProPermissions {
  id: number;
  permissionName: string;
  entity: string;
  type: number;
  activeStatus: boolean;
}

interface SubscriptionAccess {
  id: number;
  name: string;
  type: string;
}

interface SubscriptionFeature {
  id: number;
  name: string;
  helperText: string | null;
}

interface UserPackage {
  id: number;
  name: string;
  features: UserProFeature[] | number[];
  packageFeatureValues: number[] | ProPackageFeatureLabelValue[];
  accesses: number[] | SubscriptionAccess[];
  priceMonthly: number;
  priceAnnually: number;
  isPreferred: boolean;
  activeStatus: boolean;
}

interface SubscriptionPackageFeatureLabelValue {
  id: number;
  label: string;
  value: number;
  featureId: number | UserProFeature;
  packageId: number | UserPackage;
  reductionAmount: number;
  timePeriod: number;
}

interface UserDownload {
  id: number;
  entityName: string;
  entityId: number;
  artistName: string;
  artistId: number;
  fileName: string;
  fileKey: string;
  fileType: string;
  type: DownloadType;
  licenseId: number | null;
  user: User;
  createdAt: Date;
}

interface Overview {
  name: string;
  value: string;
  description: string;
}

interface Collaborator {
  id: number;
  collaboratorName: string;
  role: string;
  profitShare: number;
  publishingShare: number;
  audioId: number | null;
  presetId: number | null;
  soundBankId: number | null;
  linkedUserId: number | null;
  __typename?: string;
}

type CollaboratorCreateUpdateFields = Omit<Collaborator, "id">;

interface License {
  id: number;
  licenseName: string;
  licenseShortDescription: string;
  type: string;
  licenseText: string;
  licenseDefaultPrice: number | null;
  licenseMinOfferPrice: number | null;
  audioLicenseDuration: number | null;
  audioLicenseDistribution: string;
  audioLicenseStreams: string;
  audioLicenseFreeDownloads: string;
  musicVideoMonitizedAmount: string;
  musicVideoNonMonitizedAmount: string;
  musicVideoMonitizedStreamAmount: string;
  musicVideoNonMonitizedStreamAmount: string;
  radioBroadcastRights: boolean;
  radioStationsAmount: string;
  livePerformanceProfitRights: boolean
  livePerformanceNonProfitAmount: string;
  addToMusicByDefault: boolean;
  audioIds?: Track[] | number[];
  presetIds?: Preset[];
  soundBankIds?: SoundBank[];
  __typename?: string;
}

type LicenseCreateUpdateFields = Omit<License, "id">;

interface TrackFile {
  id: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  size: number | null;
  exclusivePrice: number | null;
  audioId: number | Track | null;
  presetId: number | Track | null;
  soundBankId: number | Track | null;
}

type TrackFileCreateFields = Omit<TrackFile, "id" | "fileUrl" | "audioId" | "presetId" | "soundBankId">;
type TrackFileUpdateFields = Omit<TrackFile, "id">;

interface CartResponse {
  id: number;
  title: string;
  description: string | null;
  artWorkFilePath: string;
  user: User;
  price: number;
  fileId: number;
  licenseId: number;
}

type FileType = "mp3" | "wav" | "compress" | "photo" | "video";
type DownloadType = "single purchase" | "subscription" | "free";
type ReportStatusType = "pending" | "resolved";

interface ReportEntity {
  id: number;
  remark: string;
  entityName: string;
  entityId: number;
  user: User | number;
  status: ReportStatusType;
  artistId: number;
}

type ReportFormFields = Omit<ReportEntity, "id" | "user">;
