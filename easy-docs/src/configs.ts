import * as client from "ts-rmb-http-client/dist/es6";
import * as grid3_client from "grid3_client/dist/es6";

(window as any).configs = (window as any).configs || {};
(window as any).configs = {
  ...(window as any).configs,
  client,
  grid3_client,
};
