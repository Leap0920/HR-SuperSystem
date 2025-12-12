import { Schema, model, models } from "mongoose";

interface IModule {
    title: string;
    description: string;
    category: string;
    numberOfTopics: number;
    targetRoles: string[];
    fileName?: string;      // GridFS filename
    filePath?: string;      // API path to download the file
    createdAt?: Date;
}

const ModuleSchema = new Schema<IModule>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        numberOfTopics: { type: Number, required: true, default: 1 },
        targetRoles: { type: [String], default: [] },
        fileName: { type: String },
        filePath: { type: String },
    },
    { timestamps: true } // adds createdAt and updatedAt automatically
);

// Check if model exists before creating to prevent OverwriteModelError
const Module = models.Module || model<IModule>("Module", ModuleSchema);

export default Module;
 