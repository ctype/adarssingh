import { createBrowserRouter, RouteObject } from "react-router-dom";

// Layouts
import DashboardLayout from "@/layouts/DashboardLayout";
import PublicLayout from "@/layouts/PublicLayout";

// Auth pages
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  EmailVerification,
} from "@/pages/auth";

// Public pages
import {
  AboutPage,
  BlogDetailPage,
  BlogPage,
  ContactPage,
  ContributorPage,
  DMCAPage,
  FAQPage,
  HelpCenterPage,
  LandingPage,
  LicensingPage,
  MusicDetailPage,
  MusicExplorePage,
  PhotoExplorePage,
  PresetDetailPage,
  PresetExplorePage,
  PricingPage,
  PrivacyPolicyPage,
  ProfilePage,
  SoundBankDetailPage,
  SoundBankExplorePage,
  SoundEffectExplorePage,
  TermsOfServicePage,
  VideoExplorePage,
} from "@/pages/public";

// Utilities
import ScrollOnNavigation from "@/utils/ScrollOnNavigation";

// Auth routes
import AuthRoute from "./AuthRoute";
import PersistLoginRoute from "./PresistLoginRoute";

// Context
import { TrackContextProvider } from "@/pages/contributor/track/context/TrackContextProvider";
import { PresetContextProvider } from "@/pages/contributor/preset/context/PresetContextProvider";
// import { LicenseTemplateProvider } from "@/pages/admin/licenseTemplate/context/LicenseTemplateProvider";
import { SoundBankContextProvider } from "@/pages/contributor/sound-bank/context/SoundBankContextProvider";
// import { ContributorLicenseContextProvider } from "@/pages/contributor/license/context/ContributorLicenseContextProvider";

// Global pages
import { UnAuthorizedPage } from "@/pages/global";

// Contributor pages
import {
  ContributorStudioDashboard,
  ContributorPhotoAdd,
  ContributorPhotoEdit,
  ContributorPhotoList,
  ContributorPresetAdd,
  ContributorPresetEdit,
  ContributorPresetList,
  ContributorSoundBankAdd,
  ContributorSoundBankEdit,
  ContributorSoundBankList,
  ContributorSoundEffectAdd,
  ContributorSoundEffectEdit,
  ContributorSoundEffectList,
  ContributorTrackAdd,
  ContributorTrackEdit,
  ContributorTrackList,
  ContributorVideoAdd,
  ContributorVideoEdit,
  ContributorVideoList,
  // ContributorLicenseList,
  // ContributorLicenseAdd,
  // ContributorLicenseEdit,
  ContributorTrackFileList,
  ContributorProfileSettingPage,
  ContributorSocialAccountSettingPage,
  ContributorReportList,
} from "@/pages/contributor";

// Admin pages
import {
  AdminDashboard,
  GenreList,
  KeyList,
  LanguageList,
  MoodTypeList,
  PhotoVideoCategoryList,
  SubGenreList,
  InstrumentList,
  AdminUserList,
  AdminContributorList,
  // AdminLicenseTemplateList,
  // AdminLicenseTemplateAdd,
  // AdminLicenseTemplateEdit,
  TrackRequest,
  GenreMixList,
  // SoundBankRequest,
  // PresetRequest,
  PresetTypeList,
  SubGenreAdd,
  SubGenreEdit,
  AdminReportList,
  // SocialMediaList,
} from "@/pages/admin";

// User pages
import {
  Checkout,
  UserDashboard,
  UserDownloads,
  UserSetting,
  UserSubscription,
  UserTransactions,
} from "@/pages/user";

// Utils
import {
  adminSidebarData,
  contributorSidebarData,
  userSidebarData,
} from "@/utils/sidebarData";
import NotFoundPage from "@/pages/public/global/NotFoundPage";

const routes: RouteObject[] = [
  {
    element: <PersistLoginRoute />,
    children: [
      // PUBLIC ROUTES START
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/",
            element: <LandingPage />,
          },
          {
            path: "/pricing",
            element: <PricingPage />,
          },
          {
            path: "/tracks",
            element: <MusicExplorePage />,
          },
          {
            path: "/sound-effects",
            element: <SoundEffectExplorePage />,
          },
          {
            path: "/sound-banks/*",
            children: [
              {
                path: "",
                element: <SoundBankExplorePage />,
              },
              {
                path: ":id",
                element: <SoundBankDetailPage />,
              },
            ],
          },
          {
            path: "/presets",
            children: [
              {
                path: "",
                element: <PresetExplorePage />,
              },
              {
                path: ":id",
                element: <PresetDetailPage />,
              },
            ],
          },
          {
            path: "/videos",
            element: <VideoExplorePage />,
          },
          {
            path: "/photos",
            element: <PhotoExplorePage />,
          },
          {
            path: "/tracks/:id",
            element: <MusicDetailPage />,
          },
          {
            path: "/about",
            element: <AboutPage />,
          },
          {
            path: "/blog",
            element: <BlogPage />,
          },
          {
            path: "/blog/:id",
            element: <BlogDetailPage />,
          },
          {
            path: "/contact",
            element: <ContactPage />,
          },
          {
            path: "/faq",
            element: <FAQPage />,
          },
          {
            path: "/help-center",
            element: <HelpCenterPage />,
          },
          {
            path: "/terms-of-service",
            element: <TermsOfServicePage />,
          },
          {
            path: "/licensing",
            element: <LicensingPage />,
          },
          {
            path: "/dmca",
            element: <DMCAPage />,
          },
          {
            path: "/privacy-policy",
            element: <PrivacyPolicyPage />,
          },
          {
            path: "/contributor",
            element: <ContributorPage />,
          },
          {
            path: "/profile/:username",
            element: <ProfilePage />,
          },
        ],
      },
      // AUTH ROUTES START
      {
        path: "/auth/*",
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "reset-password/:token",
            element: <ResetPassword />,
          },
          {
            path: "verify/:email",
            element: <EmailVerification />,
          },
        ],
      },
      // ADMIN ROUTES START
      {
        element: <AuthRoute role="admin" />,
        children: [
          {
            element: <DashboardLayout sidebarData={adminSidebarData} />,
            children: [
              {
                path: "/admin/*",
                children: [
                  {
                    path: "dashboard",
                    element: <AdminDashboard />,
                  },
                  // {
                  //   path: "genres",
                  //   element: <GenreList />,
                  // },
                  // {
                  //   path: "genre-mixes",
                  //   element: <GenreMixList />,
                  // },
                  {
                    path: "genres",
                    element: <GenreMixList />,
                  },
                  {
                    path: "genre-mixes",
                    element: <GenreList />,
                  },
                  {
                    path: "sub-genres/*",
                    children: [
                      {
                        path: "",
                        element: <SubGenreList />,
                      },
                      {
                        path: "add",
                        element: <SubGenreAdd />,
                      },
                      {
                        path: "edit/:id",
                        element: <SubGenreEdit />,
                      },
                    ],
                  },
                  {
                    path: "keys",
                    element: <KeyList />,
                  },
                  {
                    path: "languages",
                    element: <LanguageList />,
                  },
                  {
                    path: "mood-types",
                    element: <MoodTypeList />,
                  },
                  {
                    path: "instruments",
                    element: <InstrumentList />,
                  },
                  {
                    path: "preset-types",
                    element: <PresetTypeList />,
                  },
                  {
                    path: "photo-video-categories",
                    element: <PhotoVideoCategoryList />,
                  },
                  {
                    path: "users",
                    element: <AdminUserList />,
                  },
                  {
                    path: "contributors",
                    element: <AdminContributorList />,
                  },
                  // {
                  //   element: <LicenseTemplateProvider />,
                  //   children: [
                  //     {
                  //       path: "license-templates",
                  //       children: [
                  //         {
                  //           path: "",
                  //           element: <AdminLicenseTemplateList />,
                  //         },
                  //         {
                  //           path: "add",
                  //           element: <AdminLicenseTemplateAdd />,
                  //         },
                  //         {
                  //           path: "edit/:id",
                  //           element: <AdminLicenseTemplateEdit />,
                  //         },
                  //       ],
                  //     },
                  //   ],
                  // },
                  // {
                  //   path: "social-medias",
                  //   element: <SocialMediaList />,
                  // },
                  {
                    path: "track-requests",
                    element: <TrackRequest />,
                  },
                  {
                    path: "reports",
                    element: <AdminReportList />,
                  },
                  // {
                  //   path: "soundbank-requests",
                  //   element: <SoundBankRequest />,
                  // },
                  // {
                  //   path: "preset-requests",
                  //   element: <PresetRequest />,
                  // },
                  {
                    path: "*",
                    element: <NotFoundPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      // CONTRIBUTOR ROUTES START
      {
        element: <AuthRoute role="contributor" />,
        children: [
          {
            element: <DashboardLayout sidebarData={contributorSidebarData} />,
            children: [
              {
                path: "/contributors/*",
                children: [
                  {
                    path: "dashboard",
                    element: <ContributorStudioDashboard />,
                  },
                  {
                    element: <TrackContextProvider />,
                    children: [
                      {
                        path: "tracks/*",
                        children: [
                          {
                            path: "",
                            element: <ContributorTrackList />,
                          },
                          {
                            path: "add",
                            element: <ContributorTrackAdd />,
                          },
                          {
                            path: "edit/:id",
                            element: <ContributorTrackEdit />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    element: <SoundBankContextProvider />,
                    children: [
                      {
                        path: "sound-banks/*",
                        children: [
                          {
                            path: "",
                            element: <ContributorSoundBankList />,
                          },
                          {
                            path: "add",
                            element: <ContributorSoundBankAdd />,
                          },
                          {
                            path: "edit/:id",
                            element: <ContributorSoundBankEdit />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: "sound-effects/*",
                    children: [
                      {
                        path: "",
                        element: <ContributorSoundEffectList />,
                      },
                      {
                        path: "add",
                        element: <ContributorSoundEffectAdd />,
                      },
                      {
                        path: "edit/:id",
                        element: <ContributorSoundEffectEdit />,
                      },
                    ],
                  },
                  {
                    element: <PresetContextProvider />,
                    children: [
                      {
                        path: "presets/*",
                        children: [
                          {
                            path: "",
                            element: <ContributorPresetList />,
                          },
                          {
                            path: "add",
                            element: <ContributorPresetAdd />,
                          },
                          {
                            path: "edit/:id",
                            element: <ContributorPresetEdit />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: "file-storage",
                    element: <ContributorTrackFileList />,
                  },
                  {
                    path: "photos/*",
                    children: [
                      {
                        path: "",
                        element: <ContributorPhotoList />,
                      },
                      {
                        path: "add",
                        element: <ContributorPhotoAdd />,
                      },
                      {
                        path: "edit/:id",
                        element: <ContributorPhotoEdit />,
                      },
                    ],
                  },
                  {
                    path: "videos/*",
                    children: [
                      {
                        path: "",
                        element: <ContributorVideoList />,
                      },
                      {
                        path: "add",
                        element: <ContributorVideoAdd />,
                      },
                      {
                        path: "edit/:id",
                        element: <ContributorVideoEdit />,
                      },
                    ],
                  },
                  // {
                  //   element: <ContributorLicenseContextProvider />,
                  //   children: [
                  //     {
                  //       path: "licenses/*",
                  //       children: [
                  //         {
                  //           path: "",
                  //           element: <ContributorLicenseList />,
                  //         },
                  //         {
                  //           path: "add",
                  //           element: <ContributorLicenseAdd />,
                  //         },
                  //         {
                  //           path: "edit/:id",
                  //           element: <ContributorLicenseEdit />,
                  //         },
                  //       ],
                  //     },
                  //   ],
                  // },
                  {
                    path: "account/*",
                    children: [
                      {
                        path: "profile",
                        element: <ContributorProfileSettingPage />,
                      },
                      {
                        path: "social-account",
                        element: <ContributorSocialAccountSettingPage />,
                      },
                      {
                        path: "reports",
                        element: <ContributorReportList />,
                      },
                    ],
                  },
                  {
                    path: "*",
                    element: <NotFoundPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      // USER ROUTES START
      {
        element: <AuthRoute role="user" />,
        children: [
          {
            element: <DashboardLayout sidebarData={userSidebarData} />,
            children: [
              {
                path: "/users/*",
                children: [
                  {
                    path: "dashboard",
                    element: <UserDashboard />,
                  },
                  {
                    path: "downloads",
                    element: <UserDownloads />,
                  },
                  {
                    path: "transactions",
                    element: <UserTransactions />,
                  },
                  {
                    path: "system/*",
                    children: [
                      {
                        path: "subscription",
                        element: <UserSubscription />,
                      },
                      {
                        path: "setting",
                        element: <UserSetting />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            element: <PublicLayout />,
            children: [
              {
                path: "/checkout",
                element: <Checkout />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <UnAuthorizedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const route = createBrowserRouter([
  {
    element: <ScrollOnNavigation />,
    children: routes,
  },
]);
