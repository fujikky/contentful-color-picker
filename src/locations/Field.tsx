import { FieldExtensionSDK } from "@contentful/app-sdk";
import { Stack, TextInput } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import { css } from "emotion";
import {
  type ChangeEventHandler,
  type FocusEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

const COLOR_HEX = /^#[0-9a-f]{6}$/i;
const COLOR_PATTERN = COLOR_HEX.toString();

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const [value, setValue] = useState<string>(() => sdk.field.getValue() || "");

  const onExternalChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  useEffect(() => {
    sdk.window.startAutoResizer();
    const detach = sdk.field.onValueChanged(onExternalChange);

    return () => detach();
  }, [sdk, onExternalChange]);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const value = e.currentTarget.value;
      setValue(value);
      sdk.field.setInvalid(!COLOR_HEX.test(value));
    },
    [sdk.field]
  );

  const handleBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    async (e) => {
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
    <Stack flexDirection="column">
      <TextInput.Group>
        <TextInput
          type="color"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={7}
          className={css({ width: "45px", padding: "2px 5px" })}
        />
        <TextInput
          testId="my-field"
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          pattern={COLOR_PATTERN}
        />
      </TextInput.Group>
    </Stack>
  );
};

export default Field;
