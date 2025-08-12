import { User } from "./user";

export interface Project {
    _id?: string;
    title: string;
    projectLogo: string;
    shortDescription: string;
    fullDescription: string;
    requirements: string;
    projectType: string;
    experienceLevel: string;
    workType: 'office' | 'hybrid' | 'remote';
    techStack: string;
    createdAt?: string;
    owner?: {
        username?: string;
        profileImage?: string;
        _id?: string;
    };
    appliedUsers?: string[],
    favourites?: string[];
}