import { GrammarDefinition } from './grammarDefinition';
import { Token, tokenizeLine, Rule } from './tokenize';
import * as fs from 'fs-extra';

export interface Tokenizer {
    tokenize(line: string): Token[];
}

export class Grammar {
    constructor(private grammarDef: GrammarDefinition) {}

    tokenizer(): Tokenizer {
        let rule = grammarToRule(this.grammarDef);

        return {
            tokenize: (line: string) => {
                const r = tokenizeLine(line, rule);
                rule = r.state;
                return r.tokens;
            }
        };
    }

    static async createFromFile(filename: string): Promise<Grammar> {
        const json = await fs.readFile(filename, 'utf8');
        const grammarDef = JSON.parse(json) as GrammarDefinition;
        return new Grammar(grammarDef);
    }
}

function grammarToRule(grammar: GrammarDefinition): Rule {
    const rule: Rule = {
        parent: undefined,
        pattern: grammar,
        scope: grammar.scopeName,
        grammarDef: grammar,
        depth: 0,
    };

    return rule;
}
