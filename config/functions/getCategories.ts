import { databases } from "../appwrite";
import { appwriteConfig } from "../setup";

export const getCategories = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseID as string,
      appwriteConfig.categoriesCollectionID as string
    );


    const categories = [
      "All",
      ...response.documents.map((doc) => doc.name || doc.category),
    ];


    return [...new Set(categories)];
  } catch (error) {
    console.error("Error getting categories:", error);
    return ["All"]; 
  }
};
