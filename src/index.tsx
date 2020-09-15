/* eslint-disable react/prop-types */
import * as React from 'react';
import { render } from 'react-dom';
import { TextInput } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

const colorHex = /^#[0-9a-f]{6}$/i;

type Props = {
  sdk: FieldExtensionSDK;
};

export const App: React.FC<Props> = ({ sdk }) => {
  const [value, setValue] = React.useState<string>(() => sdk.field.getValue() || '');

  const onExternalChange = React.useCallback((value: string) => {
    setValue(value);
  }, []);

  React.useEffect(() => {
    sdk.window.startAutoResizer();
    const detach = sdk.field.onValueChanged(onExternalChange);

    return () => detach();
  }, [sdk, onExternalChange]);

  const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    e => {
      const value = e.currentTarget.value;
      setValue(value);
      sdk.field.setInvalid(!colorHex.test(value));
    },
    [sdk.field]
  );

  const handleBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
    async e => {
      const value = e.currentTarget.value;
      if (value) {
        await sdk.field.setValue(value);
      } else {
        await sdk.field.removeValue();
      }
    },
    [sdk.field]
  );

  return (
    <div className="color-picker-container">
      <input
        type="color"
        className="color-picker-color"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={7}
      />
      <TextInput
        testId="my-field"
        width="large"
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        pattern={colorHex.toString()}
      />
    </div>
  );
};

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});
