/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { App } from './index';
import { render, fireEvent, cleanup, configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-test-id'
});

function renderComponent(sdk: FieldExtensionSDK) {
  return render(<App sdk={sdk} />);
}

const sdk: any = {
  field: {
    getValue: jest.fn(),
    onValueChanged: jest.fn(),
    setValue: jest.fn(),
    removeValue: jest.fn(),
    setInvalid: jest.fn()
  },
  window: {
    startAutoResizer: jest.fn()
  }
};

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    sdk.field.onValueChanged.mockReturnValue(jest.fn());
  });

  afterEach(cleanup);

  it('should read a value from field.getValue() and subscribe for external changes', () => {
    sdk.field.getValue.mockImplementation(() => '#ff0000');
    const { getByTestId } = renderComponent(sdk);

    expect(sdk.field.getValue).toHaveBeenCalled();
    expect(sdk.field.onValueChanged).toHaveBeenCalled();
    expect((getByTestId('my-field') as HTMLInputElement).value).toEqual('#ff0000');
  });

  it('should call starstartAutoResizer', () => {
    renderComponent(sdk);
    expect(sdk.window.startAutoResizer).toHaveBeenCalled();
  });

  it('should call setValue on every change in input', () => {
    const { getByTestId } = renderComponent(sdk);

    fireEvent.change(getByTestId('my-field'), {
      target: { value: '#00ff00' }
    });
    fireEvent.blur(getByTestId('my-field'));

    expect(sdk.field.setInvalid).toHaveBeenCalledWith(false);
    expect(sdk.field.setValue).toHaveBeenCalledWith('#00ff00');
  });

  it('should call setValue and call setInvalid with true when empty value passed', () => {
    const { getByTestId } = renderComponent(sdk);

    fireEvent.change(getByTestId('my-field'), {
      target: { value: 'invalid-value' }
    });
    fireEvent.blur(getByTestId('my-field'));

    expect(sdk.field.setInvalid).toHaveBeenCalledWith(true);
    expect(sdk.field.setValue).toHaveBeenCalledWith('invalid-value');
  });
});
