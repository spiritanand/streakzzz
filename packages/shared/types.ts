export interface Types {
  name: string;
}

export const logger = (name?: string) => {
  console.log(`Hello from ${name || "shared"}`);
};
