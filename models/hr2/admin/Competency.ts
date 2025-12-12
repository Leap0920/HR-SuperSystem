// models/Competency.ts
import mongoose from "mongoose";

const competencySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: { type: Number, min: 0, max: 100 },
  evaluatedAt: Date,
  notes: String,
}, { timestamps: true });

export default mongoose.models.Competency || mongoose.model("Competency", competencySchema);