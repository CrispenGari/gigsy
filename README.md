### Gigsy

`Gigsy` is a mobile app platform where job seekers can find part-time jobs online in their local cities.

<p align="center"><img src="/images/logo.png" alt="alt" width="200"/></p>

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
