import { databases } from "../appwrite";
import { appwriteConfig } from "../setup";

export const getProjects = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseID as string,
      appwriteConfig.projectCollectionID as string
    );

    return response.documents;
  } catch (error) {
    console.error("Error getting courses:", error);
    return [];
  }
};
