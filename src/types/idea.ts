type SourceIdeas = {
    metadata?: {[key: string]: any};
    ideas: Idea[];
};

type Idea = {
    title: string;
    description: string;
    checked: boolean;
};

export type { SourceIdeas, Idea };
