# Developers Escape (Devvscape)

Humour and code go hand in hand. It's a hassle when you have to explain it. We have the most entertaining code-related memes.

# Get Started

1. Clone this repository:

```yaml
git clone https://github.com/your-username/devvscape.git
cd devvscape
```
2. Install the dependencies:

```yaml
npm install
```

3. Configure Firebase:

- Create a Firebase project at https://console.firebase.google.com/
- Copy your Firebase configuration and replace it in src/environments/environment.ts:

```yaml
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'your-api-key',
    authDomain: 'your-auth-domain',
    projectId: 'your-project-id',
    storageBucket: 'your-storage-bucket',
    messagingSenderId: 'your-messaging-sender-id',
    appId: 'your-app-id',
  },
};
```
4. Run the app:

```yaml
npx nx run app:serve
```

> Open your browser and navigate to http://localhost:4200

# Connect with Us
Stay updated with the latest news, announcements, and tech discussions. Connect with us on social media:

[Twitter](https://twitter.com/silkwebhq)

[LinkedIn](https://www.linkedin.com/company/silkwebhq/)

# Contributors
We welcome contributions from the developer community. If you'd like to contribute to Devvscape, please check out our Contributing Guidelines.

# License
This project is licensed under the MIT License.

> Made with ❤️ by the Devvscape Team
