import { Injectable } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Firestore, collection, doc, getDoc, getDocs, limit, orderBy, query } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Observable, catchError, from, map, of } from "rxjs";
import { Image } from "../models/data/image.interface";
import { Comment } from "../models/data/comment.interface.ts";
import { DocumentSnapshot, addDoc, collectionGroup, deleteDoc, getFirestore, serverTimestamp, updateDoc, where, writeBatch } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage, private router: Router) { }

  getImagePosts(): Observable<Image[]> {
    const q = query(collection(this.firestore, 'posts',), orderBy('createdAt', 'desc'), limit(40));

    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((document) => {
          const data = document.data() as Image;
          const id = document.id;
          return { ...data, id };
        });
      }),
      catchError(error => {
        console.error('Error fetching image posts:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  getImagePostById(id: string): Observable<Image | null> {
    const docRef = doc(this.firestore, 'posts', id);

    return from(getDoc(docRef)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as Image;
          return { ...data, id };
        } else {
          return null;
        }
      }),
      catchError(error => {
        console.error('Error fetching image post by ID:', error);
        return of(null); // Return null in case of error
      })
    );
  }

  async reportImage(imageId: string, userId: string, reason: string): Promise<void> {
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
      console.error(`Error saving report: ${error}`);
      throw new Error(`Error saving report: ${error}`);
    }
  }

  getUserPosts(): Observable<Image[]> {
    const user = this.auth.currentUser;
    if (user) {
      const q = query(
        collection(this.firestore, 'posts'),
        where('postedBy', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      return from(getDocs(q)).pipe(
        map((querySnapshot) => {
          return querySnapshot.docs.map((document) => {
            const data = document.data() as Image;
            const id = document.id;
            return { ...data, id };
          });
        }),
        catchError(error => {
          console.error('Error fetching user posts:', error);
          return of([]);
        })
      );
    } else {
      return of([]);
    }
  }

  getUserPostsComments(userId: string): Observable<Comment[]> {
    const q = query(
      collectionGroup(this.firestore, 'comments'),
      where('postedBy', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        const userComments: Comment[] = [];
        querySnapshot.forEach((document) => {
          const data = document.data() as Comment;
          const commentId = document.id;

          const parent = document.ref.parent;
          const grandparent = parent ? parent.parent : null;
          const postId = grandparent ? grandparent.id : null;

          userComments.push({
            id: commentId,
            postId: postId ?? '',
            ...data,
          });
        });
        return userComments;
      }),
      catchError((error) => {
        console.error('Error fetching user comments:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  async deleteUserPosts(userUid: string): Promise<boolean> {
    try {
      const q = query(
        collection(this.firestore, 'posts'),
        where('postedBy', '==', userUid)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const batch = writeBatch(this.firestore);
        querySnapshot.forEach((document) => {
          batch.delete(document.ref);
        });

        await batch.commit();

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error deleting user posts:', error);
      throw error;
    }
  }

  getStarredImages(userId: string): Observable<Image[]> {
    const q = query(
      collection(this.firestore, 'posts'),
      where('likedBy', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        return querySnapshot.docs.map((document) => {
          const data = document.data() as Image;
          const id = document.id;
          return { ...data, id };
        });
      }),
      catchError((error) => {
        console.error('Error fetching starred images:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  async addComment(
    postId: string,
    userId: string,
    displayName: string,
    commentText: string
  ): Promise<void> {
    try {
      const commentsCollection = collection(
        this.firestore,
        `posts/${postId}/comments`
      );

      const newComment: Comment = {
        postedBy: userId,
        displayName,
        text: commentText,
        stars: 0,
        likedBy: [],
        createdAt: new Date(),
      };

      await addDoc(commentsCollection, newComment);

      console.log('Comment added successfully.');
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async deleteComment(imageId: string, commentId: string): Promise<void> {
    try {
      const commentRef = doc(
        this.firestore,
        `posts/${imageId}/comments/${commentId}`
      );

      const commentSnapshot = await getDoc(commentRef);

      if (commentSnapshot.exists()) {
        await deleteDoc(commentRef);
        console.log('Comment deleted successfully.');
      } else {
        console.error('Comment not found in the subcollection.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  async uploadImageAndPostText(imageFile: File, postText: string, userId: string, displayName: string): Promise<void> {
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(this.storage, 'images/' + imageFile.name);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      await uploadTask;
      const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

      // Extract hashtags from postText
      const hashtags = postText.match(/#(\w+)/g) || [];

      // Check for common programming words in postText
      const tags = this.words.filter((word) =>
        postText.toLowerCase().includes(word)
      );

      // Prepare the post data
      const postData = {
        imageUrl: imageUrl,
        postText: postText,
        postedBy: userId,
        stars: 0,
        downloads: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        displayName: displayName,
        comments: [],
        likedBy: [],
        downloadedBy: [],
        tags: tags,
        hashtags: hashtags,
      };

      // Save image URL and postText to Firestore
      const postsCollection = collection(this.firestore, 'posts');
      await addDoc(postsCollection, postData);

    } catch (error) {
      console.error('Error uploading image and creating post:', error);
      throw new Error(`Error uploading image and creating post: ${error}`);
    }
  }

  async getImageComments(imageId: string): Promise<Comment[]> {
    try {
      const commentsCollection = collection(
        this.firestore,
        `posts/${imageId}/comments`
      );

      const q = query(commentsCollection);

      const querySnapshot = await getDocs(q);

      const imageComments: Comment[] = [];

      querySnapshot.forEach((document) => {
        const data = document.data() as Comment;
        const id = document.id;

        imageComments.push({ id, ...data });
      });

      return imageComments;
    } catch (error) {
      console.error('Error fetching image comments:', error);
      throw error;
    }
  }

  async downloads(imageId: string, userId: string): Promise<void> {
    try {
      const firestore = getFirestore();
      const postsCollection = collection(firestore, 'posts');
      const postRef = doc(postsCollection, imageId);
      const postSnapshot: DocumentSnapshot<unknown> = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const data = postSnapshot.data() as Image;
        const downloadedBy = data.downloadedBy || [];

        const userDownloaded = downloadedBy.includes(userId);

        if (!userDownloaded) {
          const newDownloads = data.downloads + 1;
          await updateDoc(postRef, {
            downloads: newDownloads,
            downloadedBy: [...downloadedBy, userId],
          });
          console.log('Image downloaded and recorded.');
        } else {
          console.log('Image has already been downloaded by this user.');
        }
      } else {
        console.error('Image not found');
      }
    } catch (error) {
      console.error('Error updating image downloads:', error);
      throw error;
    }
  }

  async likeImage(postId: string, userId: string): Promise<void> {
    try {
      const firestore = getFirestore();
      const postsCollection = collection(firestore, 'posts');
      const postRef = doc(postsCollection, postId);
      const postSnapshot: DocumentSnapshot<unknown> = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const data = postSnapshot.data() as Image;
        const likedBy = data.likedBy || [];

        const userLiked = likedBy.includes(userId);

        const newStars = data.stars + (userLiked ? -1 : 1);

        await updateDoc(postRef, {
          stars: newStars,
          likedBy: userLiked
            ? likedBy.filter((id) => id !== userId)
            : [...likedBy, userId],
        });

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
