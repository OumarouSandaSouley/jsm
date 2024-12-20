import { databases } from "../appwrite";
import { appwriteConfig } from "../setup";

export const getResources = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseID as string,
      appwriteConfig.resourcesCollectionID as string
    );

    return response.documents;
  } catch (error) {
    console.error("Error getting resources:", error);
    return [];
  }
};
