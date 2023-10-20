import { locations } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import { useMemo } from "react";

import Field from "./locations/Field";

const ComponentLocationSettings = {
  [locations.LOCATION_ENTRY_FIELD]: Field,
};

const App = () => {
  const sdk = useSDK();

  const Component = useMemo(() => {
    // eslint-disable-next-line functional/no-loop-statements
    for (const [location, component] of Object.entries(
      ComponentLocationSettings,
    )) {
      if (sdk.location.is(location)) {
        return component;
      }
    }
    return null;
  }, [sdk.location]);

  return Component ? <Component /> : null;
};

export default App;
