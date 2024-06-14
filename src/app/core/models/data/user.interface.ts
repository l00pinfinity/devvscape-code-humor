export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  website?: string;
  githubUsername?: string;
  twitterHandle?: string;
  linkedinProfile?: string;
  favoriteTechStack?: string[];
  interests?: string[];
  createdAt: any;
  updatedAt: any;
  memesPosted?: number;
  eventsCreated?: number;
  gamesParticipated?: number;
  followers?: number;
  following?: number;
}
