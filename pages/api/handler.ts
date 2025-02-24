import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { db } = await connectToDatabase();

      // Fetch years/subjects data
      const yearsData = await db.collection("Subjects").findOne({});

      // Fetch professors data
      const professorsData = await db.collection("Teachers").findOne({});

      // Combine the data
      const data = {
        years: yearsData?.years || [],
        professors: professorsData?.professors || [],
      };

      res.status(200).json(data);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Unable to fetch data from database" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
