import { Client, Account, ID, Databases } from "react-native-appwrite";
import { appwriteConfig } from "./setup";

export const client = new Client()
  .setProject(appwriteConfig.projectID as string)
  .setPlatform("com.oss.jsm");
export const databases = new Databases(client)