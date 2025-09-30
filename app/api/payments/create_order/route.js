import mongoose from 'mongoose';
import TeamModel from '@/app/Schema/model';
import { randomUUID } from "crypto";

function generateTeamId() {
  return `tf_${randomUUID().slice(0, 6)}`;
}

export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const body = await request.json();   
    const {
      teamName,
      teamLeaderName,
      teamMember1Name,
      teamMember2Name,
      teamMember3Name,
    } = body;

    const newTeam = new TeamModel({
      team_id: generateTeamId(),
      TeamName: teamName,
      TeamLeaderName: teamLeaderName,
      TeamMember1Name: teamMember1Name,
      TeamMember2Name: teamMember2Name,
      TeamMember3Name: teamMember3Name,
    });

    await newTeam.save();

    return new Response(
      JSON.stringify({ message: 'Team created successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in /api/payments/create_order:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}