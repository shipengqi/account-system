export interface IResponse {
  code: number;
  message: string;
  data: any;
}

export interface ListResponse {
  total: number,
  items: Array<any>
}
