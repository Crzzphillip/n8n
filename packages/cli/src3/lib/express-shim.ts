export type ShimRequest = {
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  method: string;
  headers: Record<string, string>;
};

export type ShimResponse = {
  status: (code: number) => ShimResponse;
  json: (obj: any) => ShimResponse;
  send: (obj: any) => ShimResponse;
};