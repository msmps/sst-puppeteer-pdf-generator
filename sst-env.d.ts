/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "Api": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "Storage": {
      "name": string
      "type": "sst.aws.Bucket"
    }
  }
}
export {}
