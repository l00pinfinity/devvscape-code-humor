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

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  // eslint-disable-next-line @typescript-eslint/member-ordering
  images: Observable<Image[]>;
  constructor(private auth: Auth, private firestore: Firestore) {}

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
    console.log('Upload image URL ' + imageUrl);

    // Extract hashtags from postText
    const hashtags = postText.match(/#(\w+)/g) || [];

    // Check for common programming words in postText
    const tags = this.words.filter((word) => postText.includes(word));

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
        likedBy:[],
        tags,
        hashtags,
      });
      //console.log('Post saved to Firestore');
    } catch (error) {
      throw new Error('Error saving post to Firestore:');
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
          return {id,...data};
        });
        return userPosts;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
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

        console.log(
          `Stars ${
            userLiked ? 'decremented' : 'incremented'
          } for post ${postId}`
        );
      } else {
        console.error('Post not found');
      }
    } catch (error) {
      console.error('Error updating stars:', error);
      throw error;
    }
  }

  //need to confirm arrayUnion
  // async addComment(postId: string, comment: string): Promise<void> {
  //   const firestore = getFirestore();
  //   const postsCollection = collection(firestore, 'posts');
  //   const postRef = doc(postsCollection, postId);

  //   await updateDoc(postRef, {comments: comment});
  // }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public words: string[] = [
    'abstract',
    'array',
    'boolean',
    'break',
    'class',
    'const',
    'continue',
    'debug',
    'declare',
    'define',
    'delete',
    'do',
    'else',
    'enum',
    'exception',
    'export',
    'extends',
    'false',
    'final',
    'finally',
    'float',
    'for',
    'function',
    'if',
    'implements',
    'import',
    'instanceof',
    'int',
    'interface',
    'let',
    'long',
    'module',
    'new',
    'null',
    'number',
    'object',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'short',
    'static',
    'string',
    'super',
    'switch',
    'this',
    'throw',
    'throws',
    'true',
    'try',
    'typeof',
    'undefined',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'async',
    'await',
    'await',
    'catch',
    'console',
    'default',
    'export',
    'from',
    'import',
    'of',
    'set',
    'export',
    'constructor',
    'get',
    'implements',
    'interface',
    'let',
    'package',
    'private',
    'protected',
    'public',
    'static',
    'yield',
    'Promise',
    'async',
    'await',
    'resolve',
    'reject',
    'then',
    'catch',
    'throw',
    'try',
    'instanceof',
    'typeof',
    'undefined',
    'null',
    'NaN',
    'Infinity',
    'debugger',
    'Java',
    'Python',
    'C',
    'C++',
    'C#',
    'JavaScript',
    'Ruby',
    'Swift',
    'Kotlin',
    'Go',
    'Rust',
    'PHP',
    'Perl',
    'HTML',
    'CSS',
    'React',
    'Angular',
    'Vue',
    'Node.js',
    'Express.js',
    'Django',
    'Flask',
    'Spring',
    'Ruby on Rails',
    'ASP.NET',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'SQLite',
    'Redis',
    'Git',
    'GitHub',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'Google Cloud',
  ];
}
