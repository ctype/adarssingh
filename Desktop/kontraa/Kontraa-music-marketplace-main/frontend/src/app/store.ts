import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import AuthReducer from "@/features/auth/authSlice";
import PhotoReducer from "@/features/photo/photoSlice";
import VideoReducer from "@/features/video/videoSlice";
import GenreReducer from "@/features/genre/genreSlice";
import GenreMixReducer from "@/features/genreMix/genreMixSlice";
import PresetTypeReducer from "@/features/preset/presetTypeSlice";
import setPhotoVideoCategoryReducer from "@/features/category/photoVideoCategorySlice";
import KeyReducer from "@/features/key/keySlice";
import SubGenreReducer from "@/features/subGenre/subGenreSlice";
import LanguageReducer from "@/features/language/languageSlice";
import MoodTypeReducer from "@/features/moodType/moodTypeSlice";
import AudioReducer from "@/features/audio/audioSlice";
import SoundEffectReducer from "@/features/sound_effect/soundEffectSlice";
import SoundBankReducer from "@/features/soundBank/soundBankSlice";
import PresetReducer from "@/features/preset/presetSlice";
import InstrumentReducer from "@/features/instrument/instrumentSlice";
import AdminReducer from "@/features/admin/adminSlice";
import CollaboratorReducer from "@/features/collaborator/collaboratorSlice";
import LicenseTemplateReducer from "@/features/license/licenseTemplateSlice";
import LicenseReducer from "@/features/license/licenseSlice";
import CartReducer from "@/features/cart/cartSlice";
import TrackFileReducer from "@/features/trackFile/trackFileSlice";
import SystemUserReducer from "@/features/system_user/systemUserSlice";
import NotificationReducer from "@/features/notification/notificationSlice";
import SubscriptionReducer from "@/features/subscription/subscriptionSlice";
import CommentReducer from "@/features/social_system/commentSlice";
import OfferReducer from "@/features/offer/offerSlice";
import SocialMediaReducer from "@/features/socialMedia/socialMediaSlice";
import DownloadReducer from "@/features/downloads/downloadActivitySlice";
import ReportReducer from "@/features/report/reportSlice";

const appReducer = combineReducers({
  auth: AuthReducer,
  photoVideoCategories: setPhotoVideoCategoryReducer,
  photos: PhotoReducer,
  videos: VideoReducer,
  genres: GenreReducer,
  genreMixes: GenreMixReducer,
  presetTypes: PresetTypeReducer,
  keys: KeyReducer,
  subGenres: SubGenreReducer,
  languages: LanguageReducer,
  moodTypes: MoodTypeReducer,
  instruments: InstrumentReducer,
  audios: AudioReducer,
  soundEffects: SoundEffectReducer,
  soundBanks: SoundBankReducer,
  presets: PresetReducer,
  admins: AdminReducer,
  collaborators: CollaboratorReducer,
  licenseTemplates: LicenseTemplateReducer,
  licenses: LicenseReducer,
  carts: CartReducer,
  trackFiles: TrackFileReducer,
  systemUser: SystemUserReducer,
  notifications: NotificationReducer,
  subscription: SubscriptionReducer,
  comments: CommentReducer,
  offers: OfferReducer,
  socialMedias: SocialMediaReducer,
  downloads: DownloadReducer,
  reports: ReportReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: { type: string }) => {
  if (action.type === "LOGOUT_USER") {
    return appReducer({ auth: state?.auth }, action);
  }
  return appReducer(state, action);
}

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
