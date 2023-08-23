import { Injectable } from '@angular/core';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
} from 'firebase/storage';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Image } from '../interface/image';
import { Observable } from 'rxjs';
import {
  DocumentSnapshot,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  // eslint-disable-next-line @typescript-eslint/member-ordering
  images: Observable<Image[]>;
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async uploadImageAndPostText(
    imageFile: File,
    postText: string,
    userId: string,
    displayName: string
  ) {
    const storageRef = ref(getStorage(), 'images/' + imageFile.name);
    const uploadTask: UploadTask = uploadBytesResumable(storageRef, imageFile);

    await uploadTask;
    const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

    // Extract hashtags from postText
    const hashtags = postText.match(/#(\w+)/g) || [];

    // Check for common programming words in postText
    const tags = this.words.filter((word) => postText.toLocaleLowerCase().includes(word));

    // Save image URL and postText to Firestore
    try {
      const postsCollection = collection(this.firestore, 'posts');
      await addDoc(postsCollection, {
        //add the generated id here
        imageUrl,
        postText,
        postedBy: userId,
        stars: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        displayName,
        comments: [],
        likedBy: [],
        tags,
        hashtags,
      });
    } catch (error) {
      throw new Error('Error saving post to Firestore:');
    }
  }

  async reportImage(imageId: string, userId: string, reason: string) {
    try {
      const reportsRef = collection(this.firestore, 'reports');
      const querySnapshot = await getDocs(
        query(
          reportsRef,
          where('imageId', '==', imageId),
          where('reportedBy', '==', userId)
        )
      );

      if (!querySnapshot.empty) {
        throw new Error('Image already reported');
      }

      const reportCollection = collection(this.firestore, 'reports');
      await addDoc(reportCollection, {
        imageId,
        reason,
        reportedBy: userId,
        createdAt: serverTimestamp(),
        resolved: false,
      });
    } catch (error) {
      throw new Error(`Error saving report: ${error}`);
    }
  }

  async getImagePosts(): Promise<Image[]> {
    try {
      const postsCollection = collection(this.firestore, 'posts');
      const querySnapshot = await getDocs(postsCollection);

      return querySnapshot.docs.map((document) => {
        const data = document.data() as Image;
        const id = document.id;
        return { id, ...data };
      });
    } catch (error) {
      throw new Error('Unable to fetch image posts');
    }
  }

  async getImagePostById(id: string) {}

  async getUserPosts() {
    try {
      const user = this.auth.currentUser;
      if (user) {
        const q = query(
          collection(this.firestore, 'posts'),
          where('postedBy', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);

        const userPosts = querySnapshot.docs.map((document) => {
          const data = document.data() as Image;
          const id = document.id;
          return { id, ...data };
        });
        return userPosts;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  }

  async getStarredImages() {}

  async likeImage(postId: string, userId: string): Promise<void> {
    try {
      const firestore = getFirestore();
      const postsCollection = collection(firestore, 'posts');
      const postRef = doc(postsCollection, postId);
      const postSnapshot: DocumentSnapshot<unknown> = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const data = postSnapshot.data() as Image;
        const likedBy = data.likedBy || [];

        // Check if the user has already liked the post
        const userLiked = likedBy.includes(userId);

        // Calculate the new stars count based on the user's previous like status
        const newStars = data.stars + (userLiked ? -1 : 1);

        // Update the stars and likedBy fields of the post
        await updateDoc(postRef, {
          stars: newStars,
          likedBy: userLiked
            ? likedBy.filter((id) => id !== userId) // Remove user ID from likedBy array
            : [...likedBy, userId], // Add user ID to likedBy array
        });

        // Refresh the current route by navigating to the same route
        const currentRoute = this.router.url;
        this.router
          .navigateByUrl('/home', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([currentRoute]);
          });
      } else {
        console.error('Post not found');
      }
    } catch (error) {
      console.error('Error updating stars:', error);
      throw error;
    }
  }

  async addComment() {}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public words: string[] = [
    'java',
    'python',
    'c',
    'c++',
    'c#',
    'javascript',
    'ruby',
    'swift',
    'kotlin',
    'go',
    'rust',
    'php',
    'perl',
    'html',
    'css',
    'react',
    'angular',
    'vue',
    'node.js',
    'express.js',
    'django',
    'flask',
    'spring',
    'ruby on rails',
    'asp.net',
    'typescript',
    'html5',
    'css3',
    'sass',
    'less',
    'bootstrap',
    'tailwind css',
    'jquery',
    'vue.js',
    'react native',
    'ionic',
    'electron',
    'flutter',
    'dart',
    'android',
    'ios',
    'xamarin',
    'tensorflow',
    'pytorch',
    'keras',
    'opencv',
    'unity',
    'unreal engine',
    'opengl',
    'vulkan',
    'qt',
    'swiftui',
    'xcode',
    'android studio',
    'visual studio',
    'intellij idea',
    'eclipse',
    'netbeans',
    'git',
    'github',
    'bitbucket',
    'gitlab',
    'mercurial',
    'docker',
    'kubernetes',
    'aws',
    'azure',
    'google cloud',
    'firebase',
    'heroku',
    'digitalocean',
    'jenkins',
    'travis ci',
    'circleci',
    'ansible',
    'puppet',
    'chef',
    'terraform',
    'nginx',
    'apache',
    'rest api',
    'graphql',
    'websocket',
    'oauth',
    'jwt',
    'microservices',
    'serverless',
    'big data',
    'machine learning',
    'artificial intelligence',
    'blockchain',
    'cryptocurrency',
    'ar/vr',
    'iot',
  ];
}
