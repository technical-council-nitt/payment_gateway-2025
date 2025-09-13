import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import TeamModel from '@/app/Schema/model';
import { randomUUID } from "crypto";

function generateTeamId() {
  return `tf_${randomUUID().slice(0, 6)}`; 
}
export async function POST(request) {
    await mongoose.connect(process.env.MONGODB_URI);
    const formData = await request.formData();
    const teamName = formData.get('teamName');
    const teamLeaderName = formData.get('teamLeaderName');
    const teamMember1Name = formData.get('teamMember1Name');
    const teamMember2Name = formData.get('teamMember2Name');
    const teamMember3Name = formData.get('teamMember3Name');
    const newTeam = new TeamModel({
        team_id: generateTeamId(),
        TeamName: teamName,
        TeamLeaderName: teamLeaderName,
        TeamMember1Name: teamMember1Name,
        TeamMember2Name: teamMember2Name,
        TeamMember3Name: teamMember3Name,
    });
    await newTeam.save();

  
   
  
    return new Response(JSON.stringify({ message: 'Form data received successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }