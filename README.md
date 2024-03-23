<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="assets/icon.png" alt="Logo" width="80" height="80">

  <h3 align="center">Kaisen Workout</h3>

  <p align="center">
      By Mickaël Lalanne
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About the project

![Product Name Screen Shot][product-screenshot]<br>
Kaisen Workout is a mobile application that allows users to create and follow their own workout programs.<br>
During a session, users can view their past performances and utilize a timer for their rest periods between sets.<br>
Additionally, they can access a log of all completed sessions and visualize a detailed report for each one.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
* ![Realm](https://img.shields.io/badge/Realm-39477F?style=for-the-badge&logo=realm&logoColor=white)
* ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
* ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
* ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

And also [React Native Paper](https://reactnativepaper.com/) for the Material Design library.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [Nodejs](https://nodejs.org/en)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mickael-lalanne/kaisen-workout.git
   ```
2. Install client dependencies
   ```sh
   npm install
   ```
3. Create the following `env.local` file in the root folder :
   ```
   EXPO_ENVIRONMENT=local
   ```
4. Create a file called `local.properties` in `android/` folder with  this line :
   ```
   sdk.dir = C:\\Users\\WINDOWS_USERNAME\\AppData\\Local\\Android\\sdk
   ```
5. Run the app locally
   ```sh
   npx expo run:android
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Mickaël Lalanne - mickael.lalanne03@gmail.com

[![LinkedIn][linkedin-shield]][linkedin-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [React Native](https://reactnative.dev/docs/getting-started)
* [Expo](https://expo.dev/)
* [Atlas Device SDK for React Native](https://www.mongodb.com/docs/realm/sdk/react-native/)
* [React Native Paper](https://reactnativepaper.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: assets/demo.gif
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/mickael-lalanne/