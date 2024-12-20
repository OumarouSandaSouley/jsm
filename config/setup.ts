export const appwriteConfig = {
  projectID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string,
  databaseID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string,
  categoriesCollectionID: process.env.EXPO_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID as string,
  coursesCollectionID: process.env.EXPO_PUBLIC_APPWRITE_COURSES_COLLECTION_ID as string,
  projectCollectionID: process.env.EXPO_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID as string,
  resourcesCollectionID: process.env.EXPO_PUBLIC_APPWRITE_RESSOURCES_COLLECTION_ID as string,
};