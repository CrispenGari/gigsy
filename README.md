### Gigsy

`Gigsy` is a mobile app platform where job seekers can find part-time jobs online in their local cities.

<p align="center"><img src="/images/logo.png" alt="alt" width="200"/></p>

### Table of Contents

- [Gigsy](#gigsy)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tools and Technologies](#tools-and-technologies)
- [Authentication Screens](#authentication-screens)
- [`Android` Auth Screens](#android-auth-screens)
- [`iOS` Auth Screens](#ios-auth-screens)
- [User Profile](#user-profile)
- [Job Creation UI](#job-creation-ui)
- [`Home` page and `Wishlists`](#home-page-and-wishlists)
- [`Chats` and `Messages`](#chats-and-messages)
- [`Profile` and `Settings`](#profile-and-settings)
- [User Profile](#user-profile-1)
- [Server](#server)
- [Environmental Variables](#environmental-variables)
- [License](#license)

### Features

- **Browse Jobs:** You can browse jobs on `Gigsy` without authenticating yourself.
- **Upload Jobs:** To upload jobs, authentication is required.
- **Social Login:** Login with your social media accounts.
- **Email Login/Registration:** Login or register with your email.
- **Location-Based Jobs:** Create and find jobs based on your location.
- **Wishlist:** Add jobs to your wishlist.
- **Profile Management:** Update your password and profile details.
- **Job Details:** View other users' email and city upon publishing a job (exact location not shown).
- **Location Settings:** Update your location settings.
- **Encrypted Messaging:** Use end-to-end encrypted messaging during negotiations.
  **Profile Verification:** Verify your profile using AI to enhance trust and security.
- **Profile Validation:** Only profile avatars with faces are allowed.

### Tools and Technologies

In this project, we are using the following technologies:

1. [Convex](https://www.convex.dev/) - For database and storage.
2. [Clerk](https://clerk.dev/) - For authentication.
3. [DeepFace](https://github.com/serengil/deepface) - For server face validation and verification.
4. [React-Native Expo](https://expo.dev/) - Creating the app with Expo Router.

### Authentication Screens

`Gigsy` provides seamless authentication options for both Android and iOS users.

### `Android` Auth Screens

<p align="center">
<img src="/images/auth/android/login.jpeg" alt="alt" width="200"/>
<img src="/images/auth/android/register.jpeg" alt="alt" width="200"/>
<img src="/images/auth/android/verify.jpeg" alt="alt" width="200"/>
</p>

### `iOS` Auth Screens

<p align="center">
<img src="/images/auth/ios/login.jpeg" alt="alt" width="200"/>
<img src="/images/auth/ios/register.jpeg" alt="alt" width="200"/>
<img src="/images/auth/ios/verify.jpeg" alt="alt" width="200"/>
</p>

- **Login Screen:** Similar to Android, this screen lets iOS users login using their email or social media accounts.
- **Registration Screen:** Allows new users to sign up using their email.
- **Forgot Password Screen:** Provides a way for users to reset their password if forgotten.
- **Verify Email Screen:** Provides a way for users to verify their email before they are fully authenticated.

> Each screen is designed to be user-friendly and intuitive, ensuring a smooth authentication process for all users.

To sign in or sign-up to `gisgy` you use a provider such as `google` and `github` socials. However when you want to do email authentication the procedure is somehow different. When signing in you provide email and password that you used to create your account. In the event that you forgot the password you can go to the forgot password screen, on that screen you will enter your email address so that a reset password code will be sent to that email address. Here are the forgot password screen uis for both `ios` and `android`.

<p align="center">
<img src="/images/auth/android/fgt_pwd.jpeg" alt="alt" width="200"/>
<img src="/images/auth/ios/fgt_pwd.jpeg" alt="alt" width="200"/>
</p>

After that you will be redirected to the `reset-password` screen with the following UI.

<p align="center">
<img src="/images/auth/android/reset.jpeg" alt="alt" width="200"/>
<img src="/images/auth/ios/reset.jpeg" alt="alt" width="200"/>
</p>

However, when signing up you go through screens: > `SignUp` --> `Verify Email` ---> `Profile`. Creating a new account requires us to capture your email address with it's password, then profile avatar of a visible face with your first name and last name that will appear in the app.

### User Profile

During account registration, when a user registers using email and password, they are required to set up their profile. This includes:

- **Profile Avatar:** Users must upload an avatar with a visible face, which is verified by AI for its validity. The profile should contain a single clear face so that other users of `Gigsy` can recognize them. The avatar validation is handled by a dedicated server, which serves as an API consuming the [DeepFace](https://github.com/serengil/deepface) model to ensure the uploaded image contains a clear and valid face.
- **First Name and Last Name:** Users must set a first name and last name before saving their profile.

 <p align="center">
<img src="/images/auth/android/profile.jpeg" alt="alt" width="200"/>
<img src="/images/auth/ios/profile.jpeg" alt="alt" width="200"/>
</p>

This ensures that all profiles on `Gigsy` are authentic and easily recognizable.

### Job Creation UI

To create a job in the app is simple, you just need to navigate the `publish` job tab and click that. This will take you through the following UI on `ios`

 <p align="center">
<img src="/images/app/ios/create/0.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/create/1.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/create/2.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/create/3.jpeg" alt="alt" width="200"/>
</p>

And the following `ui` on `android`

<p align="center">
<img src="/images/app/android/create/0.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/create/1.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/create/2.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/create/3.jpeg" alt="alt" width="200"/>
</p>

There are required fields that when advertising a new job. The UI is friendly you can adjust your location if you want which make it easier for you to advertise jobs in different locations. On top of that you can also specify the `skills`, `qualifications`, `job benefits`, etc on the job.

### `Home` page and `Wishlists`

On the home page, you will be presented with jobs based on your location radius, with recent jobs shown at the beginning. You can change this by updating the filters. If you click on a job, a bottom sheet will open to display the job details. Here is the UI for:

1. `android`

 <p align="center">
<img src="/images/app/android/home.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/filters.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/job.jpeg" alt="alt" width="200"/>
</p>

2. `iOS`

 <p align="center">
<img src="/images/app/ios/home.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/filters.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/job.jpeg" alt="alt" width="200"/>
</p>

A job can be added to or removed from the wishlist. Wishlist jobs are stored in the Convex database server, so if you log in with another device, you can access them. These are jobs you might want to do in the future. You can access your wishlist by going to the `wishlists` tab.

1. `android`

 <p align="center">
<img src="/images/app/android/wishlists.jpeg" alt="alt" width="200"/>
</p>

2. `iOS`

 <p align="center">
<img src="/images/app/ios/wishlists.jpeg" alt="alt" width="200"/>
</p>

### `Chats` and `Messages`

Real-time chat exists between an advertiser and a job seeker. In the job bottom sheet, there is a `start chat` button presented to the job seeker, which allows you to start chatting with the job advertiser. You can access the chat messages by going to the `chats` tab, where you will see your chat messages. In the chat screen, you can reach out to the advertiser or the job seeker and start a conversation. During chatting, you can send `images`, `text`, `audio`, and `documents` within the chat.

1. `android`

<p align="center">
<img src="/images/app/android/chats.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/chat-options.jpeg" alt="alt" width="200"/>
</p>

2. `iOS`

 <p align="center">
<img src="/images/app/ios/chat.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/chats.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/chat-options.jpeg" alt="alt" width="200"/>
</p>

### `Profile` and `Settings`

1. `android`

<p align="center">
<img src="/images/app/android/profile/0.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/2.jpeg" alt="alt" width="200"/>
</p>

2. `iOS`

<p align="center">
<img src="/images/app/ios/profile/0.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/1.jpeg" alt="alt" width="200"/>
</p>

On this tab, you can do many things. You can:

1. **Update profile and Adverts**: Modify your profile details such as your profile picture and verify your profile, and adverts.

- `android`

<p align="center">
<img src="/images/app/android/profile/user-profile.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/user-profile-2.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/user-advert-1.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/user-advert-2.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/profile-verification.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/profile-verification-2.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/profile-verification-why.jpeg" alt="alt" width="200"/>
</p>

- `iOS`

<p align="center">
<img src="/images/app/ios/profile/user-profile.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/user-profile-2.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/user-advert-1.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/user-advert-2.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/profile-verification.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/profile-verification-why.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/profile-verification-why.jpeg" alt="alt" width="200"/>
</p>

2. **Update personal information**: Change your personal information including first name and last name.

- `android`

<p align="center">
<img src="/images/app/android/profile/pi.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/android/profile/pi.jpeg" alt="alt" width="200"/>
</p>

3. **Account and Security Settings** - You can change your password or delete your account on this screen/

- `android`

<p align="center">
<img src="/images/app/android/profile/security-1.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/security-2.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/security-1.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/security-2.jpeg" alt="alt" width="200"/>
</p>

4. **Change notification settings**: Customize how and when you receive notifications from the app.

- `android`

<p align="center">
<img src="/images/app/android/profile/&apos;notifications.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/notifications.jpeg" alt="alt" width="200"/>
</p>

1. **Change location settings**: Update your location preferences to get job listings relevant to your area.

- `android`

<p align="center">
<img src="/images/app/android/profile/location.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/location.jpeg" alt="alt" width="200"/>
</p>

6. **Change sound and haptics preferences**: Adjust the sound and vibration settings for notifications and interactions within the app.

- `android`

<p align="center">
<img src="/images/app/android/profile/sound.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/sound.jpeg" alt="alt" width="200"/>
</p>

7. **Check for new updates**: See if there are any new updates available for the app and install them.
8. **Manage storage and network**: Monitor and manage the app's storage usage and network settings.

   - `android`

<p align="center">
<img src="/images/app/android/profile/storage.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/storage.jpeg" alt="alt" width="200"/>
</p>

9.  **Change chat wallpapers**: Personalize your chat experience by changing the chat background wallpaper.

- `android`

<p align="center">
<img src="/images/app/android/profile/wallpaper.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/wallpaper.jpeg" alt="alt" width="200"/>
</p>

10. **Give us feedback**: Provide feedback to the Gigsy team about your experience using the app.

    - `android`

<p align="center">
<img src="/images/app/android/profile/feedback.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/feedback.jpeg" alt="alt" width="200"/>
</p>

11. **Tell friends about Gigsy**: Share the app with your friends through social media or messaging apps.
12. **Learn how Gigsy works**: Explanation of how gigsy works.

- `android`

<p align="center">
<img src="/images/app/android/profile/how.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/how.jpeg" alt="alt" width="200"/>
</p>

13. **Report an issue**: Report any bugs, issues, or problems you encounter while using the app on `github`.
14. **Read our Terms of Service**: Review the terms and conditions for using Gigsy.

- `android`

<p align="center">
<img src="/images/app/android/profile/tnc.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/tnc.jpeg" alt="alt" width="200"/>
</p>

15. **Read our Privacy Policy**: Understand how your data is collected, used, and protected by Gigsy.

- `android`

<p align="center">
<img src="/images/app/android/profile/pp.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/pp.jpeg" alt="alt" width="200"/>
</p>

16. **Logout of Gigsy**: Log out of your account on the Gigsy app.

### User Profile

You can view the profile of the user by clicking on the profile image in the job advert. This will show you the UI where you can view the details of the job advertiser along with their profile image. If you click the profile image of that user, you will be able to view the full image on a new screen where you can `download` the image, `report`, `share`, and display the profile `info`.

<p align="center">
<img src="/images/app/android/profile/up-0.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/up-1.jpeg" alt="alt" width="200"/>
<img src="/images/app/android/profile/up-2.jpeg" alt="alt" width="200"/>
</p>

- `iOS`
<p align="center">
<img src="/images/app/ios/profile/up-0.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/up-1.jpeg" alt="alt" width="200"/>
<img src="/images/app/ios/profile/up-2.jpeg" alt="alt" width="200"/>
</p>

### Server

This app is served as a multi-repo project that contains two main subdirectories: `📂mobile` and `📂server`. The `mobile` directory is the `client` React Native app, which has the UI that we have been going through in this README file. The `server` directory is a `REST` API using Flask to serve routes `/api/v1/find-face` and `/api/v1/verify-face`. These routes confirm if the face is valid and verify if the face in the user's profile matches the one they are trying to verify, respectively, using [Deepface](https://github.com/serengil/deepface). Here is the python sample code for doing that which can be found in the `📂server/blueprints/__init__.py` file

```py
class DeepFaceContainer:
    def validate_face(image):
        faces = DeepFace.extract_faces(
            image,
            detector_backend="opencv",
            enforce_detection=True,
        )
        return len(faces) == 1

    def verify_face(img1, img2):
        result = DeepFace.verify(
            img1,
            img2,
            model_name="VGG-Face",
            detector_backend="opencv",
            distance_metric="cosine",
            align=True,
            enforce_detection=False,
            anti_spoofing=False,
        )
        return result["verified"]
```

### Environmental Variables

You will need the following environmental variables to be added in you `mobile/.env` and `mobile/.env.local` files.

```shell
# .env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
EXPO_PUBLIC_SERVER_URL = your_hosted_server
```

```shell
# .env.local
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=dev:something # team: crispengari, project: gigsy
EXPO_PUBLIC_CONVEX_URL=https://something.convex.cloud
EXPO_PUBLIC_CONVEX_SITE=https://something.convex.site
```

### License

This project is using the `MIT` License which reads as follows:

```
MIT License

Copyright (c) 2024 crispengari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
