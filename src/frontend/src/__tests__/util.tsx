import { Provider } from "react-redux";
import { RATINGS_URL } from "../FSA";
import { createStore } from "../store";

export const serverURL = (path: string) => {
    let base = RATINGS_URL;
    // new URL() mangles the base URL if it doesn't end in a slash.
    if (!base.endsWith("/")) {
      base = base + "/";
    }
    return new URL(path, base).href;
};

interface RenderWithStoreProps {}

export const RenderWithStore = (props: React.PropsWithChildren<RenderWithStoreProps>) => {
  const store = createStore();
  return <Provider store={store}>
      {props.children}
    </Provider>;
};

  