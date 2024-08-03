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

### Android Auth Screens

<p align="center">
<img src="/images/auth/android/login.jpeg" alt="alt" width="200"/>
<img src="/images/auth/android/register.jpeg" alt="alt" width="200"/>
<img src="/images/auth/android/fgt_pwd.jpeg" alt="alt" width="200"/>
</p>

- **Login Screen:** Allows users to login using their email or social media accounts.
- **Registration Screen:** Enables new users to create an account using their email.
- **Forgot Password Screen:** Assists users in resetting their password if they have forgotten it.

### iOS Auth Screens

<p align="center">
<img src="/images/auth/ios/login.jpeg" alt="alt" width="200"/>
<img src="/images/auth/ios/register.jpeg" alt="alt" width="200"/>
<img src="/images/auth/ios/fgt_pwd.jpeg" alt="alt" width="200"/>
</p>

- **Login Screen:** Similar to Android, this screen lets iOS users login using their email or social media accounts.
- **Registration Screen:** Allows new users to sign up using their email.
- **Forgot Password Screen:** Provides a way for users to reset their password if forgotten.

> Each screen is designed to be user-friendly and intuitive, ensuring a smooth authentication process for all users.

### User Profile

During account registration, when a user registers using email and password, they are required to set up their profile. This includes:

- **Profile Avatar:** Users must upload an avatar with a visible face, which is verified by AI for its validity. The profile should contain a single clear face so that other users of `Gigsy` can recognize them. The avatar validation is handled by a dedicated server, which serves as an API consuming the [DeepFace](https://github.com/serengil/deepface) model to ensure the uploaded image contains a clear and valid face.
- **First Name and Last Name:** Users must set a first name and last name before saving their profile.

 <p align="center">
<img src="/images/auth/android/profile.jpeg" alt="alt" width="200"/>
<img src="/images/auth/ios/profile.jpeg" alt="alt" width="200"/>
</p>

This ensures that all profiles on `Gigsy` are authentic and easily recognizable.
