export interface IQueryGenerator {
  generateQuery(input: string): Promise<string>;
}
