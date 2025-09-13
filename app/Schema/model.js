import mongoose from 'mongoose'
const TeamSchema = new mongoose.Schema({
    team_id:String,

    TeamLeaderName:String,
    TeamMember1Name:String,
    TeamMember2Name:String,
    TeamMember3Name:String,
    TeamName:String,
    
  
    
})
const TeamModel=mongoose.models.team || mongoose.model("team", TeamSchema);
export default TeamModel;