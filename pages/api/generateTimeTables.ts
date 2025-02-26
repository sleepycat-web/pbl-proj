// pages/api/data.js
import { connectToDatabase } from '../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  )  {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to the database
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
    console.log(data);
    // Space for additional operations with data
    // -------------------------------------------
    // Add your additional data operations here
    // Example: Filter data, transform data, etc.
    // -------------------------------------------
    
    // Return success status instead of data
    return res.status(200).json({ 
      status: 'success',
      message: 'Data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Error connecting to database', 
     });
  }
}