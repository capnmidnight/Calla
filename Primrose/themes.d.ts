import { FinalTokenType } from "./Grammars/Token";
export interface ThemeStyle {
    foreColor?: string;
    backColor?: string;
    fontStyle?: string;
    fontWeight?: string;
}
export interface Theme extends Record<FinalTokenType, ThemeStyle> {
    name: string;
    cursorColor: string;
    unfocused: string;
    currentRowBackColor: string;
    selectedBackColor: string;
}
export declare const Light: Theme;
export declare const Dark: Theme;
export declare const themes: Map<string, Theme>;
