import { marked } from "marked";
import * as frontmatter from "gray-matter";
import { Idea, SourceIdeas } from "../types/idea";
import { saveData } from "../utilities/saveData";

marked.setOptions({
    pedantic: false,
    gfm: true,
    breaks: true,
    sanitize: true,
});

const preprocess = (source: string): SourceIdeas => {
    const { data, content } = frontmatter(source);
    const tokens = marked.lexer(content);
    const ideas: Idea[] = [];
    const rawList = tokens.filter((token) => token.type !== "space");
    if (rawList.length !== 1 && rawList[0].type !== "list") {
        throw new Error("tokens has one list");
    }
    const list = rawList[0] as marked.Tokens.List;
    for (const item of list.items) {
        if (!item.task) {
            throw new Error("list is checkbox list");
        }
        if (item.tokens.length !== 1 && item.tokens.length !== 2) {
            throw new Error("each idea has title + (description)");
        }
        const checked = item.checked || false;
        const title = (item.tokens[0] as marked.Tokens.Text).text;
        if (item.tokens.length === 1) {
            ideas.push({ title, checked, description: "" });
            continue;
        }
        const description = ((item.tokens[1] as marked.Tokens.List).items[0].tokens[0] as marked.Tokens.Text).text ?? "";
        ideas.push({ title, description, checked });
    }
    return { ideas, metadata: data };
}

const encode = (source: string): SourceIdeas => {
    const data = preprocess(source);
    const initialized = initialize(data);
    saveData(initialized);
    return initialized;
};

const validate = (source: string): boolean => {
    try {
        // only parse
        preprocess(source);
    }catch (e) {
        console.log(`Error: ${e}`);
        return false;
    }
    return true;
};

const initialize = (data: SourceIdeas): SourceIdeas => {
    const { ideas, metadata } = data;
    ideas.sort((a, b) => {
        if (a.checked === true && b.checked === false) {
            return 1;
        }
        if (a.checked === false && b.checked === true) {
            return -1;
        }
        return 0;
    });
    return { ideas, metadata };
};

export { encode, validate };
