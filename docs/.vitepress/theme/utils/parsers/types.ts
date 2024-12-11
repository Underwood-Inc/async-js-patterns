export interface TokenLocation {
  start: number;
  end: number;
  type: string;
  text: string;
  error?: string;
  info?: {
    type?: string;
    documentation?: string;
    color?: {
      text: string;
      background: string;
    };
  };
}

export interface ParserResult {
  tokens: TokenLocation[];
  errors: string[];
  isValid: boolean;
  usesFallback: boolean;
}

export type CodeParser = (code: string) => ParserResult;
