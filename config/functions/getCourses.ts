import { databases } from "../appwrite";
import { appwriteConfig } from "../setup";

export const getCourses = async ()=>{
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseID as string,
          appwriteConfig.coursesCollectionID as string
        );

        return response.documents
      } catch (error) {
        console.error("Error getting courses:", error);
        return []
      }
}