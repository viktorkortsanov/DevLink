export interface AnalyticsData {
    userGrowth: {
        labels: string[];
        data: number[];
    };
    activeProjects: {
        active: number;
        total: number;
    };
    techStack: {
        labels: string[];
        data: number[];
    };
    userTypes: {
        developers: number;
        employers: number;
    };
}