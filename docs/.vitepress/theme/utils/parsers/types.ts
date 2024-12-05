export interface TokenLocation {
  start: number;
  end: number;
  type: string;
  text: string;
  error?: string;
}

export interface ParserResult {
  tokens: TokenLocation[];
  isValid: boolean;
  usesFallback: boolean;
  errors?: TokenLocation[];
}

export type CodeParser = (code: string) => ParserResult;
